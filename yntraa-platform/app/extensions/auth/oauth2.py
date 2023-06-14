# encoding: utf-8
# pylint: disable=no-self-use
"""
OAuth2 provider setup.

It is based on the code from the example:
https://github.com/lepture/example-oauth2-server

More details are available here:
* http://flask-oauthlib.readthedocs.org/en/latest/oauth2.html
* http://lepture.com/en/2013/create-oauth-server
"""

from datetime import datetime, timedelta
import functools
import logging
import string
import random
import os
from functools import wraps

from app.extensions.api import abort
from flask_login import current_user
from flask_oauthlib import provider
from flask_restplus_patched._http import HTTPStatus
import sqlalchemy
from flask import request, Response, jsonify, session, current_app
from app.extensions import api, db, sio
import redis
from config import BaseConfig

log = logging.getLogger(__name__)

def _get_uri_from_request(request):
    """
    The uri returned from request.uri is not properly urlencoded
    (sometimes it's partially urldecoded) This is a weird hack to get
    werkzeug to return the proper urlencoded string uri
    """
    uri = request.base_url
    if request.query_string:
        uri += '?' + request.query_string.decode('utf-8')
    return uri


def extract_params():
    """Extract request params."""

    uri = _get_uri_from_request(request)
    http_method = request.method
    headers = dict(request.headers)
    if 'wsgi.input' in headers:
        del headers['wsgi.input']
    if 'wsgi.errors' in headers:
        del headers['wsgi.errors']
   
    if request.authorization:
        headers['Authorization'] = request.authorization

    body = request.form.to_dict()
    return uri, http_method, body, headers


def create_response(headers, body, status):
    """Create response class for Flask."""
    response = Response(body or '')
    for k, v in headers.items():
        response.headers[str(k)] = v

    response.status_code = status
    return response


class OAuth2RequestValidator(provider.OAuth2RequestValidator):
    # pylint: disable=abstract-method
    """
    A project-specific implementation of OAuth2RequestValidator, which connects
    our User and OAuth2* implementations together.
    """

    def __init__(self):
        from app.modules.auth.models import OAuth2Client, OAuth2Grant, OAuth2Token

        self._client_class = OAuth2Client
        self._grant_class = OAuth2Grant
        self._token_class = OAuth2Token
        super(OAuth2RequestValidator, self).__init__(
            usergetter=self._usergetter,
            clientgetter=self._client_class.find,
            tokengetter=self._token_class.find,
            grantgetter=self._grant_class.find,
            tokensetter=self._tokensetter,
            grantsetter=self._grantsetter,
        )

    def _usergetter(self, username, password, client, request):
        # pylint: disable=method-hidden,unused-argument
        # Avoid circular dependencies
        from app.modules.users.models import User
        from app.modules import create_user_action_log
        user = User.query.filter_by(username=request.body['username']).first()
        if user is None:
            create_user_action_log(action='OAuth2 Token',status='Fail',session_uuid=session['uuid'], error_message='Invalid Username')
            abort(
                code=HTTPStatus.UNAUTHORIZED,
                message="Invalid username or password"
            )
        create_user_action_log(action='OAuth2 Token',status='Success',session_uuid=session['uuid'])
        user_obj = User.find_with_password(username, password)
        if user_obj is None:
            create_user_action_log(action='OAuth2 Token',status='Fail',session_uuid=session['uuid'], error_message='Invalid Password')
            abort(
                code=HTTPStatus.UNAUTHORIZED,
                message="Invalid username or password"
            )
        return user_obj


    def _tokensetter(self, token, request, *args, **kwargs):
        from app.modules.auth.models import OAuth2Client, OAuth2Token
        from app.modules.users.models import User
        from app.modules.role_permission.models import UserRole, RolePermissionGroup, UsersDefaultScope
        from app.modules.organisations.models import OrganisationProjectUser
        from app.modules import send_sms, create_user_action_log
        from app.extensions import SendMAIL
        from app.modules.utils.models import SmsTemplate
        # pylint: disable=method-hidden,unused-argument
        # TODO: review expiration time
        expires_in = int(current_app.config['TOKEN_EXPIRY_TIME']) #token['expires_in']
        expires = datetime.utcnow() + timedelta(seconds=expires_in)
        userrole_details = UserRole.query.filter_by(user_id=request.client.user_id).first_or_404()
        user_details = User.query.get(request.client.user_id)

        user_role_id = userrole_details.user_role
        user_project_id = userrole_details.project_id
        redis_obj = redis.Redis(BaseConfig.REDIS_HOST, charset="utf-8", decode_responses=True)
        otp_integration = current_app.config['OTP_INTEGRATION'].lower()!='false'
        is_2fa = user_details.is_2fa
        
        if otp_integration and is_2fa:
            user_scope = ['otp_validate:read','auth:read']
            redis_obj = redis.Redis(BaseConfig.REDIS_HOST, charset="utf-8", decode_responses=True)

            allowed_chars = 'ABCDEFGHKMNPQRSTUVWXYZ123456789'

            flask_config = os.getenv('FLASK_CONFIG')
            log.info(f"Flask_Config : {flask_config}")
            if flask_config and flask_config.lower() == 'production':

                otp_value = ''.join(random.choice(allowed_chars) for _ in range(6))
                user_mobile_number = '91'+str(user_details.mobile_no)
        
                sms_template = SmsTemplate.query.filter_by(template_name='otp', template_type='login').first()
                if sms_template is None:
                    message = "Dear Sir/Madam, Please use OTP: "+str(otp_value)+" to login into the Yntraa Cloud Service Portal. -Regards, Yntraa/YntraaSI Cloud Support"
                    send_sms_status = send_sms(user_mobile_number, message, template_id='1107166696307646045')
                else:
                    message = sms_template.custom_template.format(otp_value=otp_value)
                    send_sms_status = send_sms(user_mobile_number, message, template_id=sms_template.template_id)
                log.debug("send_sms_status %s",send_sms_status)

                subject = 'One Time Password (OTP) : Yntraa Cloud Service Portal'
                message = '<p>Dear Sir/Ma\'am, <br/><br/> The One Time Password (OTP) to access Service Cloud Portal is <strong>'+str(otp_value)+'</strong>  <br/><br/>This OTP is valid for one(1) successful login into the portal. Please do not share this OTP with anyone.<br/><br/>Thanks & regards, <br/>Cloud Support Team</p>'
                #log.info("send_mail_message %s", message)
                
                noreply_email = os.getenv('FROM_EMAIL', 'noreply@cloud.yntraa.com')
                user_email = user_details.email
                send_mail_status = SendMAIL.send_mail_wrapper(noreply_email, user_email, subject, message, True)
                log.info("send_mail_status %s",send_mail_status)

            else :
                otp_value = 123456

            redis_obj.set(request.user.id,otp_value)
            redis_obj.expire(request.user.id, int(current_app.config['OTP_EXPIRY_TIME']))

        else:
            user_scope = list()
            if userrole_details.user_scope is not None:
                user_scope = userrole_details.user_scope

            if user_role_id > 0 :
                role_permission_group_details = RolePermissionGroup.query.filter_by(id=user_role_id).first_or_404()
                role_permission_group_scope = role_permission_group_details.scope
                user_scope.extend(role_permission_group_scope)

            user_type = 'internal'
            if user_details.is_admin :
                user_type = 'admin'
            elif user_details.is_regular_user :
                user_type = 'regular'

            user_default_scope = UsersDefaultScope.query.filter_by(user_scope_type=user_type).one_or_none()


            if user_default_scope is not None:
                user_scope.extend(user_default_scope.scope)

            user_scope = sorted(list(set(user_scope)))

        create_user_action_log(action='OAuth2 Token',status='Success',session_uuid=session['uuid'])
        try:
            with db.session.begin():
                token_instance = self._token_class(
                    access_token=token['access_token'],
                    refresh_token=token.get('refresh_token'),
                    token_type=token['token_type'],
                    scopes=user_scope,
                    # scopes=[scope for scope in token['scope'].split(' ') if scope],
                    expires=expires,
                    client_id=request.client.client_id,
                    user_id=request.user.id,
                    project_id=user_project_id,
                )
                db.session.add(token_instance)
                self.set_token_on_redis(token_instance)
            if is_2fa is False or otp_integration is False:
                previous_user_session = self._token_class.query.filter_by(user_id=user_details.id).all()
                for row in previous_user_session:
                    if row.access_token != token_instance.access_token:
                        authorisation_token_hint = None
                        res = self.revoke_token(row.access_token, authorisation_token_hint, request)
                        redis_obj.delete(str(row.access_token))

        except sqlalchemy.exc.IntegrityError:
            log.exception("Token-setter has failed.")
            return None
        return token_instance

    def _grantsetter(self, client_id, code, request, *args, **kwargs):
        from app.modules.auth.models import OAuth2Client
        from app.modules.users.models import User
        from app.modules.role_permission.models import UserRole, RolePermissionGroup, UsersDefaultScope
        from app.modules.organisations.models import OrganisationProjectUser
        # pylint: disable=method-hidden,unused-argument
        # TODO: review expiration time
        # decide the expires time yourself
        expires = datetime.utcnow() + timedelta(seconds=100)
        userrole_details = UserRole.query.filter_by(user_id=request.client.user_id).first_or_404()
        user_details = User.query.get(request.client.user_id)

        user_scope = list()
        if userrole_details.user_scope is not None:
            user_scope = userrole_details.user_scope
        user_role_id = userrole_details.user_role
        # log.info("user_scope in oauth2_client_grantnsetter : %s", user_scope)
        # log.info("user_role_id in oauth2_client_grantnsetter : %s", user_role_id)

        if user_role_id > 0:
            role_permission_group_details = RolePermissionGroup.query.filter_by(id=user_role_id).first_or_404()
            role_permission_group_scope = role_permission_group_details.scope
            user_scope.extend(role_permission_group_scope)
            # log.info("role_permission_group_scope in oauth2_client_grantnsetter2 : %s", role_permission_group_scope)
            # log.info("user_scope in oauth2_client_grantnsetter2 : %s", user_scope)

        user_type = 'internal'
        if user_details.is_admin :
            user_type = 'admin'
        elif user_details.is_regular_user :
            user_type = 'regular'

        user_default_scope = UsersDefaultScope.query.filter_by(user_scope_type=user_type).one_or_none()

        if user_default_scope is not None:
            user_scope.extend(user_default_scope.scope)

        user_scope = sorted(list(set(user_scope)))

        try:
            with db.session.begin():
                grant_instance = self._grant_class(
                    client_id=client_id,
                    code=code['code'],
                    redirect_uri=request.redirect_uri,
                    scopes=user_scope,
                    # scopes=request.scopes,
                    user=current_user,
                    expires=expires
                )
                db.session.add(grant_instance)
        except sqlalchemy.exc.IntegrityError:
            log.exception("Grant-setter has failed.")
            return None
        return grant_instance

    def revoke_token(self, token, token_type_hint, request, *args, **kwargs):
        """Revoke an access or refresh token.
        """
        if token_type_hint:
            tok = self._tokengetter(**{token_type_hint: token})
        else:
            tok = self._tokengetter(access_token=token)
            if not tok:
                tok = self._tokengetter(refresh_token=token)

        if tok:
            request.client_id = tok.client_id
            request.user = tok.user
            tok.delete()
            return True

        msg = 'Invalid token supplied.'
        #log.info(msg)
        request.error_message = msg
        return False


    def set_token_on_redis(self, token):

        redis_obj = redis.Redis(BaseConfig.REDIS_HOST, charset="utf-8", decode_responses=True)
        access_token = token.access_token
        redis_obj.set(access_token, token.user_id)
        redis_obj.expireat(access_token, token.expires)
        #sio.emit({})
        return redis_obj
        # access_token = token['access_token'],
        # refresh_token = token.get('refresh_token'),
        # token_type = token['token_type'],
        # scopes = user_scope,
        # # scopes=[scope for scope in token['scope'].split(' ') if scope],
        # expires = expires,
        # client_id = request.client.client_id,
        # user_id = request.user.id,
        # project_id = user_project_id,

        # redis_data = {
        #     'user_id': token.user_id,
        #     'access_token': token.access_token,
        #     'refresh_token': token.refresh_token,
        #     'scopes': token.scopes,
        #     'expires': token.expires,
        #     'project_id': token.project_id
        # }
        #
        # #conn.hgetall("pythonDict")
        #
        # resp = redis_conn.hmset("token2", redis_data)
        #
        # resp1 = redis_conn.hgetall("token2")
        #log.info(resp1['user_id'])
        return resp



def api_invalid_response(req):
    """
    This is a default handler for OAuth2Provider, which raises abort exception
    with error message in JSON format.
    """
    # pylint: disable=unused-argument
    api.abort(code=HTTPStatus.UNAUTHORIZED.value)

class OAuth2Provider(provider.OAuth2Provider):
    """
    A helper class which connects OAuth2RequestValidator with OAuth2Provider.
    """

    def __init__(self, *args, **kwargs):
        super(OAuth2Provider, self).__init__(*args, **kwargs)
        self.invalid_response(api_invalid_response)

    def init_app(self, app):
        assert app.config['SECRET_KEY'], "SECRET_KEY must be configured!"
        super(OAuth2Provider, self).init_app(app)
        self._validator = OAuth2RequestValidator()

    def token_handler(self, f):
        """Access/refresh token handler decorator.
        The decorated function should return an dictionary or None as
        the extra credentials for creating the token response.
        You can control the access method with standard flask route mechanism.
        If you only allow the `POST` method::
            @app.route('/oauth/token', methods=['POST'])
            @oauth.token_handler
            def access_token():
                return None
        """
        @wraps(f)
        def decorated(*args, **kwargs):
            from app.modules.users.models import User
            from app.modules import create_user_action_log
            server = self.server
            uri, http_method, body, headers = extract_params()
            credentials = f(*args, **kwargs) or {}
            if 'username' in body:
                user = User.query.filter_by(username=body['username']).first()
                if user is None:
                    create_user_action_log(action='OAuth2 Token',status='Fail',session_uuid=session['uuid'], error_message='Invalid Username')
                    abort(
                        code=HTTPStatus.UNAUTHORIZED,
                        message="Invalid username or password"
                    )
            else:
                create_user_action_log(action='OAuth2 Token',status='Fail',session_uuid=session['uuid'], error_message='Username is missing')
                abort(
                        code=HTTPStatus.UNAUTHORIZED,
                        message="Username is missing"
                    )
            ret = server.create_token_response(
                uri, http_method, body, headers, credentials
            )
            return create_response(*ret)
        return decorated

    def require_oauth(self, *args, **kwargs):
        # pylint: disable=arguments-differ
        """
        A decorator to protect a resource with specified scopes. Access Token
        can be fetched from the specified locations (``headers`` or ``form``).

        Arguments:
            locations (list): a list of locations (``headers``, ``form``) where
                the access token should be looked up.

        Returns:
            function: a decorator.
        """
        locations = kwargs.pop('locations', ('cookies',))
        origin_decorator = super(OAuth2Provider, self).require_oauth(*args, **kwargs)

        def decorator(func):
            # pylint: disable=missing-docstring
            from flask import request

            origin_decorated_func = origin_decorator(func)

            @functools.wraps(origin_decorated_func)
            def wrapper(*args, **kwargs):
                # pylint: disable=missing-docstring
                if 'headers' not in locations:
                    # Invalidate authorization if developer specifically
                    # disables the lookup in the headers.
                    request.authorization = '!'
                if 'form' in locations:
                    if 'access_token' in request.form:
                        request.authorization = 'Bearer %s' % request.form['access_token']
                        log.info(" in require_oauth request.authorization  ")
                        log.info(request.authorization)
                        
                return origin_decorated_func(*args, **kwargs)

            return wrapper

        return decorator


