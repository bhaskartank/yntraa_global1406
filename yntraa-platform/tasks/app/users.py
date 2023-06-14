# encoding: utf-8
"""
Application Users management related tasks for Invoke.
"""

from http import HTTPStatus
from ._utils import app_context_task
from urllib.parse import urlencode
from app.extensions import db
from app.extensions.api import abort
from app.modules.users.models import User
from app.modules.utils.models import SmsTemplate
from app.modules import send_sms
import httplib2
import json
import os
import string
import random
import time
import logging as log


SSO_GENERATE_TOKEN_API = '/realms/{realm_name}/protocol/openid-connect/token'


SSO_SEND_EMAIL_API = '/admin/realms/{realm_name}/users/{user_id}/execute-actions-email'
SSO_GET_CLIENTS_API = '/admin/realms/{realm_name}/clients/?clientId={client_name}'
SSO_GET_CLIENT_ROLES_API = '/admin/realms/{realm_name}/clients/{client_id}/roles?search={role_name}'

SSO_CREATE_USER_API = '/admin/realms/{realm_name}/users'
SSO_GET_USERS_API = '/admin/realms/{realm_name}/users?max=-1&search={username}'
SSO_GET_USER_SESSIONS_API = '/admin/realms/{realm_name}/users/{user_id}/sessions'
SSO_USER_BY_ID_API = '/admin/realms/{realm_name}/users/{user_id}'

SSO_CLIENT_ROLE_MAPPINGS_API = '/admin/realms/{realm_name}/users/{user_id}/role-mappings/clients/{client_id}'

@app_context_task(help={'username': "qwe"})
def create_user(
        context,
        username,
        email,
        is_internal=False,
        is_admin=False,
        is_regular_user=True,
        is_active=True
    ):
    """
    Create a new user.
    """
    from app.modules.users.models import User

    password = input("Enter password: ")

    new_user = User(
        username=username,
        password=password,
        email=email,
        is_internal=is_internal,
        is_admin=is_admin,
        is_regular_user=is_regular_user,
        is_active=is_active
    )

    from app.extensions import db
    with db.session.begin():
        db.session.add(new_user)



@app_context_task
def create_oauth2_client(
        context,
        username,
        client_id,
        client_secret,
        default_scopes=None
    ):
    """
    Create a new OAuth2 Client associated with a given user (username).
    """
    from app.modules.users.models import User
    from app.modules.auth.models import OAuth2Client

    user = User.query.filter(User.username == username).first()
    if not user:
        raise Exception("User with username '%s' does not exist." % username)

    if default_scopes is None:
        from app.extensions.api import api_v1
        default_scopes = list(api_v1.authorizations['oauth2_password']['scopes'].keys())

    oauth2_client = OAuth2Client(
        client_id=client_id,
        client_secret=client_secret,
        user=user,
        default_scopes=default_scopes
    )

    from app.extensions import db
    with db.session.begin():
        db.session.add(oauth2_client)


def ensure_sso_user(base_uri, realm_name, user_body, headers=None, http_object=httplib2.Http()):
    user_exists = get_sso_user_id(base_uri, realm_name, user_body.get('username', ''), headers, http_object)

    if user_exists:
        log.info('skiping %s as user already exists in sso.'  %user_body.get('username', ''))
        return
    else:
        log.info('migrating %s to sso.'  %user_body.get('username', ''))

    return make_http_api_call(
            uri=f"{base_uri}{SSO_CREATE_USER_API.format(realm_name=realm_name)}",
            method="POST",
            http_object=http_object,
            headers=headers,
            body=json.dumps(user_body)
        )


def get_sso_users(base_uri, realm_name, username, headers=None, http_object=httplib2.Http()):
    return make_http_api_call(
        uri=f"{base_uri}{SSO_GET_USERS_API.format(realm_name=realm_name, username=username)}",
        headers=headers,
        http_object=http_object
    )


def get_sso_user(base_uri, realm_name, username, headers=None, http_object=httplib2.Http()):
    users = get_sso_users(base_uri,realm_name, username, headers, http_object)

    # SSO Username is case insensitive
    user = list(filter(lambda user: user['username'].lower() == username.lower(), users))

    if len(user):
        user = user[0]
    else:
        user = None

    return user

def generate_random_password():
    # Generate a random password
    lower_case = string.ascii_lowercase
    upper_case = string.ascii_uppercase
    digits = string.digits
    special_chars = "@!~"
    # Choose a random length for the password
    password_length = random.randint(8, 16)

    # Ensure that the password contains at least one of each character type
    random_password = (
        random.choice(lower_case) +
        random.choice(upper_case) +
        random.choice(digits) +
        ''.join(random.sample(special_chars, random.randint(1, 2)))
    )

    remaining_length = password_length - len(random_password)
    random_password += ''.join(random.choice(lower_case + upper_case + digits) for _ in range(remaining_length))
    return random_password

def get_sso_user_id(base_uri, realm_name, username, headers=None, http_object=httplib2.Http()):
    users = get_sso_users(base_uri, realm_name, username, headers, http_object)

    # SSO Username is case insensitive
    user_id = list(filter(lambda user: user['username'].lower() == username.lower(), users))

    if len(user_id):
        user_id = user_id[0]["id"]
    else:
        user_id = ""

    return user_id

def get_sso_user_sessions(base_uri, realm_name, username, headers=None, http_object=httplib2.Http()):
    user_id = get_sso_user_id(base_uri, realm_name, username, headers, http_object)

    if not user_id:
        log.info(f"Could not find user {username} on SSO.")
        abort(
            code=HTTPStatus.NOT_FOUND,
            message=f"Could not find user {username} on SSO."
        )

    sessions = make_http_api_call(
        uri=f"{base_uri}{SSO_GET_USER_SESSIONS_API.format(realm_name=realm_name, user_id=user_id)}",
        headers=headers,
        http_object=http_object
    )

    return sessions

def update_sso_user(base_uri, realm_name, username, body=None, headers=None, http_object=httplib2.Http()):
    user_id = get_sso_user_id(base_uri, realm_name, username, headers, http_object)

    if not user_id:
        log.info(f"Could not find user {username} on SSO.")
        abort(
            code=HTTPStatus.NOT_FOUND,
            message=f"Could not find user {username} on SSO."
        )

    make_http_api_call(
        uri=f"{base_uri}{SSO_USER_BY_ID_API.format(realm_name=realm_name, user_id=user_id)}",
        method="PUT",
        body=json.dumps(body),
        headers=headers,
        http_object=http_object
    )


def make_http_api_call(uri, method="GET", body=None, headers=None, http_object=httplib2.Http()):
    """
    Helper method for handling HTTP API calls using httplib2
    """
    for _ in range(2):
        resp, content = http_object.request(uri, method, body=body, headers=headers)

        if content:
            content = json.loads(content)
        else:
            content = None

        if resp.status == 401:
            access_token = generate_access_token(http_object=http_object)
            headers.update({'Authorization': f'Bearer {access_token}'})
            continue

        if resp.status not in (200, 201, 202, 204):
            log.warn('got error response from SSO : %s' %str(content))
            log.warn('Request url %s: %s' %(str(uri), str(body)))
            abort(resp.status, content)
        else:
            break

    return content


def generate_access_token(http_object=httplib2.Http()):
    """
    Get the access token from SSO
    """
    from flask import current_app

    base_uri = current_app.config['OIDC_INTERNAL_BASE_URL'].rstrip('/')
    realm_name = current_app.config['OIDC_OPENID_REALM']

    auth_body = {
        "client_id": current_app.config['OIDC_CLIENT_ID'],
        "client_secret": current_app.config['OIDC_CLIENT_SECRET'],
        "grant_type": "client_credentials"
    }

    resp, content = http_object.request(
        uri=f"{base_uri}{SSO_GENERATE_TOKEN_API.format(realm_name=realm_name)}",
        method="POST",
        body=urlencode(auth_body),
        headers={'Content-Type': 'application/x-www-form-urlencoded'}
    )

    content = json.loads(content)

    if resp.status != 200:
        abort(resp.status, content)

    return content.get('access_token')


@app_context_task
def migrate_to_sso(context):
    """
    Task to migrate users to SSO
    """
    from flask import current_app
    if not current_app.config['MIGRATE_USERS_TO_SSO']:
        return

    users = db.session.query(User).all()
    for user in users:
        create_sso_user(current_app, user)


def create_sso_user(current_app, user):
    """
    Task to create a user in SSO
    """

    http = httplib2.Http(disable_ssl_certificate_validation=current_app.config['OIDC_DISABLE_URI_SSL_VALIDATION'])

    BASE_URI = current_app.config['OIDC_INTERNAL_BASE_URL'].rstrip('/')
    realm_name = current_app.config['OIDC_OPENID_REALM']
    frontend_client_name = current_app.config.get('SSO_SERVICE_CLOUD_CLIENT_ID','frontend')
    admin_client_name = current_app.config.get('SSO_ADMIN_API_CLIENT_ID','adminapis')
    frontend_user_role_name = 'User'
    admin_dc_admin_role_name = 'Admin'
    frontend_roles = []
    admin_dc_admin_role = "Admin"

    # Get the access token
    access_token = generate_access_token(http)

    common_headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    frontend_client_id = make_http_api_call(
        uri=f"{BASE_URI}{SSO_GET_CLIENTS_API.format(realm_name=realm_name, client_name=frontend_client_name)}",
        headers=common_headers,
        http_object=http
    )
    if frontend_client_id:
        frontend_client_id = frontend_client_id[0]["id"]
        frontend_roles = make_http_api_call(
            uri=f"{BASE_URI}{SSO_GET_CLIENT_ROLES_API.format(realm_name=realm_name, client_id=frontend_client_id, role_name=frontend_user_role_name)}",
            headers=common_headers,
            http_object=http
        )
        if frontend_roles:
            frontend_user_role = list(filter(lambda role: role["name"].lower() == "user", frontend_roles))

    admin_frontend_client_id = make_http_api_call(
        uri=f"{BASE_URI}{SSO_GET_CLIENTS_API.format(realm_name=realm_name, client_name=admin_client_name)}",
        headers=common_headers,
        http_object=http
    )

    if admin_frontend_client_id:
        admin_frontend_client_id = admin_frontend_client_id[0]["id"]
        admin_frontend_roles = make_http_api_call(
            uri=f"{BASE_URI}{SSO_GET_CLIENT_ROLES_API.format(realm_name=realm_name, client_id=admin_frontend_client_id, role_name=admin_dc_admin_role_name)}",
            headers=common_headers,
            http_object=http
        )
        if admin_frontend_roles:
            admin_dc_admin_role = list(filter(lambda role: role["name"].lower() == "admin", admin_frontend_roles))

    user_email = user.email
    random_password = generate_random_password()

    user_body = {
        "enabled": True,
        "firstName": user.first_name,
        "lastName": user.last_name,
        "email": user_email,
        "emailVerified": True,
        "username": user_email,
        # "credentials": [
        #     {
        #         "type": "password",
        #         "value": random_password,  # Setting random password
        #         "temporary": True
        #     }
        # ],
        "attributes": {
            "mobile_number": user.mobile_no,
            "user_type": user.user_type,
            "is_internal": user.is_internal,
            "is_admin": user.is_admin,
            "is_2fa": True if user.is_csrf_token == "True" or user.is_csrf_token is True else False,
        }
    }

    if user.is_internal:
        user_body["groups"]= ["internal"]

    # Create user based on database field values
    ensure_sso_user(BASE_URI, realm_name, user_body, headers=common_headers, http_object=http)

    # Get the user_id for the newly created user
    for _ in range(3):
        user_id = get_sso_user_id(BASE_URI, realm_name, user_email, headers=common_headers, http_object=http)
        if user_id:
            break
        # Wait for the user to be created
        time.sleep(3)

    # Assign User role in frontend client
    if frontend_roles:
        make_http_api_call(
            uri=f"{BASE_URI}{SSO_CLIENT_ROLE_MAPPINGS_API.format(realm_name=realm_name, user_id=user_id, client_id=frontend_client_id)}",
            method="POST",
            http_object=http,
            headers=common_headers,
            body=json.dumps(frontend_user_role)
        )

    # Assign DC_Admin role in admin-frontend client
    if user.is_admin and admin_dc_admin_role:
        make_http_api_call(
            uri=f"{BASE_URI}{SSO_CLIENT_ROLE_MAPPINGS_API.format(realm_name=realm_name, user_id=user_id, client_id=admin_frontend_client_id)}",
            method="POST",
            http_object=http,
            headers=common_headers,
            body=json.dumps(admin_dc_admin_role)
        )

    # flask_config = os.getenv('FLASK_CONFIG')
    # if flask_config and flask_config.lower() == 'production':
    #     user_mobile_number = '91'+str(user.mobile_no)
    #     sms_template = SmsTemplate.query.filter_by(template_name='password', template_type='reset').first()
    #     if sms_template is None:
    #         message = f"Dear Sir/Madam, Your password has been reset. Please use password: {random_password} to login into the Yntraa Cloud Service Portal. -Regards, Yntraa/YntraaSI Cloud Support"
    #         send_sms_status = send_sms(user_mobile_number, message, template_id='1107166696317419631')
    #     else:
    #         message = sms_template.custom_template.format(password=random_password)
    #         send_sms_status = send_sms(user_mobile_number, message, template_id=sms_template.template_id)
    #     log.info("send_sms_status %s",send_sms_status)
