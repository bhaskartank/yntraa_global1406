# coding: utf-8
"""
OAuth2 provider setup.

It is based on the code from the example:
https://github.com/lepture/example-oauth2-server

More details are available here:
* http://flask-oauthlib.readthedocs.org/en/latest/oauth2.html
* http://lepture.com/en/2013/create-oauth-server
"""

from flask import Blueprint, request, render_template, session, make_response, jsonify, current_app
from flask_login import current_user
from app.extensions.auth import oidc
from flask_restplus_patched._http import HTTPStatus
import logging
from app.extensions import api, oauth2, oidc
from app.extensions.flask_limiter import ratelimit
from flask import request, Response, g
from .models import OAuth2Client
from app.modules import check_2fa_status, create_user_action_log, create_user_action_trails
from app.extensions import api, db
from datetime import datetime, timedelta
import redis
import sqlalchemy
from config import BaseConfig


log = logging.getLogger(__name__)
auth_blueprint = Blueprint('auth', __name__, url_prefix='/auth')  # pylint: disable=invalid-name

@auth_blueprint.route('/oauth2/token', methods=['GET', 'POST'])
@create_user_action_trails(action='OAuth2 Token')
@ratelimit(rate='10/5m')
@oauth2.token_handler
def access_token(*args, **kwargs):
    # pylint: disable=unused-argument
    """
    This endpoint is for exchanging/refreshing an access token.

    Returns:
        response (dict): a dictionary or None as the extra credentials for
        creating the token response.
    """
    from app.modules.users.models import User
    request_body = request.form.to_dict()
    if 'username' not in request_body:
        return None
    user = User.query.filter_by(username=request_body['username']).first()
    if user is None:
        return None
    is_2fa = check_2fa_status(user.id) 
    if is_2fa:
        return {
            '2f_auth': True,
            'otp_expiry_time': int(current_app.config['OTP_EXPIRY_TIME'])
        }
    else:
        return {
            '2f_auth': False,
            'otp_expiry_time': None
        }

@auth_blueprint.route('/oauth2/revoke', methods=['POST'])
@oauth2.revoke_handler
def revoke_token():
    """
    This endpoint allows a user to revoke their access token.
    """
    pass

@auth_blueprint.route('/oauth2/authorize', methods=['GET', 'POST'])
@oauth2.authorize_handler
def authorize(*args, **kwargs):
    # pylint: disable=unused-argument
    """
    This endpoint asks user if he grants access to his data to the requesting
    application.
    """
    # TODO: improve implementation. This implementation is broken because we
    # don't use cookies, so there is no session which client could carry on.
    # OAuth2 server should probably be deployed on a separate domain, so we
    # can implement a login page and store cookies with a session id.
    # ALTERNATIVELY, authorize page can be implemented as SPA (single page
    # application)
    if not current_user.is_authenticated:
        return api.abort(code=HTTPStatus.UNAUTHORIZED)

    if request.method == 'GET':
        client_id = kwargs.get('client_id')
        oauth2_client = OAuth2Client.query.get_or_404(client_id=client_id)
        kwargs['client'] = oauth2_client
        kwargs['user'] = current_user
        # TODO: improve template design
        return render_template('authorize.html', **kwargs)

    confirm = request.form.get('confirm', 'no')
    return confirm == 'yes'

@auth_blueprint.route('/oidc/password', methods=['POST'])
@oidc.oidc_login_with_credentials()
@create_user_action_trails(action='OIDC Login')
@ratelimit(rate='10/5m')
def handle_oidc_login(*args, **kwargs):
    return _post_token_validation()

@auth_blueprint.route('/oidc/token', methods=['POST'])
@oidc.accept_token(require_token=True, required_roles=['User'])
@create_user_action_trails(action='OIDC Token Login')
@ratelimit(rate='10/5m')
def handleToken(*args, **kwargs):
    """
    Generate application token after validating SSO token.
    """
    return _post_token_validation()

def _post_token_validation():
    """
        This function will do the necessary things post token validation.
    @type username: object
    """
    from app.modules import create_user_action_log
    from app.modules.audit_trails.resources import api
    from app.modules.auth.models import OAuth2Token
    from app.modules.role_permission.models import UserRole, RolePermissionGroup, UsersDefaultScope
    from app.modules.users.models import User
    from oauthlib.common import generate_token

    username=g.oidc_token_info['preferred_username']
    expires_in = int(current_app.config['TOKEN_EXPIRY_TIME'])
    expires = datetime.utcnow() + timedelta(seconds=expires_in)
    user = User.query.filter_by(username=username).first()
    userrole_details = None
    if user:
        userrole_details = UserRole.query.filter_by(user_id=user.id).first()

    if user is None or userrole_details is None:
        log.warn("User with username : %s not found in DB." %username)
        create_user_action_log(action='OIDC Token Login', status='Fail', session_uuid=session['uuid'], error_message='Invalid username or password or no roles.')
        api.abort(
            code=HTTPStatus.UNAUTHORIZED,
            message="Invalid username or password or no roles."
        )

    user_role_id = userrole_details.user_role
    user_project_id = userrole_details.project_id
    user_scope = list()
    redis_obj = redis.Redis(BaseConfig.REDIS_HOST, charset="utf-8", decode_responses=True)

    if userrole_details.user_scope is not None:
        user_scope = userrole_details.user_scope

    if user_role_id > 0 :
        role_permission_group_details = RolePermissionGroup.query.filter_by(id=user_role_id).first_or_404()
        role_permission_group_scope = role_permission_group_details.scope
        user_scope.extend(role_permission_group_scope)

    user_type = 'internal'
    if user.is_admin :
        user_type = 'admin'
    elif user.is_regular_user :
        user_type = 'regular'

    user_default_scope = UsersDefaultScope.query.filter_by(user_scope_type=user_type).one_or_none()

    if user_default_scope is not None:
        user_scope.extend(user_default_scope.scope)

    user_scope = sorted(list(set(user_scope)))

    try:
        token_exists = False
        access_token = generate_token()
        
        with db.session.begin():
            token_instance = OAuth2Token(
                access_token=access_token,
                refresh_token=generate_token(),
                token_type='Bearer',
                scopes=user_scope,
                # scopes=[scope for scope in token['scope'].split(' ') if scope],
                expires=expires,
                client_id=user.email,
                user_id=user.id,
                project_id=user_project_id,
            )

            redis_obj = redis.Redis(BaseConfig.REDIS_HOST, charset="utf-8", decode_responses=True)
            redis_obj.set(access_token, username)
            redis_obj.expireat(access_token, expires)

            # Remove old sessions.
            previous_user_session = OAuth2Token.query.filter_by(user_id=user.id).all()
            for row in previous_user_session:
                if row.access_token != token_instance.access_token:
                    OAuth2Token.query.filter_by(id=row.id).delete()
                    redis_obj.delete(str(row.access_token))
                else:
                    token_exists = True
            if not token_exists:
                db.session.add(token_instance)

    except sqlalchemy.exc.IntegrityError:
        log.exception("Token-setter has failed.")
        api.abort(code=HTTPStatus.UNAUTHORIZED)

    data = {"access_token": token_instance.access_token, 
            'refresh_token': token_instance.refresh_token,
            'expires_in': expires_in,
            'token_type': token_instance.token_type,
            'scope': token_instance.scopes}
    create_user_action_log(action='OIDC Token Login',status='Success',session_uuid=session['uuid'])

    return make_response(jsonify(data), 200)

