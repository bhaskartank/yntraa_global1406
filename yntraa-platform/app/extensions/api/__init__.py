# encoding: utf-8
"""
API extension
=============
"""

from copy import deepcopy

from flask import Blueprint, current_app

from .api import Api
from .namespace import Namespace
from .http_exceptions import abort
import redis, uuid
from config import BaseConfig
import logging
log = logging.getLogger(__name__)


api_v1 = Api( # pylint: disable=invalid-name
    version='1.0',
    title="Yntraa Cloud API",
    description=(
        "This is the gateway to Yntraa Cloud platform."
    ),
)


def serve_swaggerui_assets(path):
    """
    Swagger-UI assets serving route.
    """
    if not current_app.debug:
        import warnings
        warnings.warn(
            "/swaggerui/ is recommended to be served by public-facing server (e.g. NGINX)"
        )
    from flask import send_from_directory
    return send_from_directory('../static/', path)


def generate_csrf_token(auth_token):

    redis_obj = redis.Redis(BaseConfig.REDIS_HOST, charset="utf-8", decode_responses=True)
    token = redis_obj.get(f'csrf_{auth_token}')
    if token:
        return token

    token = uuid.uuid4().hex

    redis_obj.set(str(token), str(auth_token))
    redis_obj.expire(str(token), int(current_app.config['TOKEN_EXPIRY_TIME']))

    csrf_auth = "csrf_"+str(auth_token)

    redis_obj.set(csrf_auth, str(token))
    redis_obj.expire(csrf_auth, int(current_app.config['TOKEN_EXPIRY_TIME']))

    return token

def update_access_token_expiry_time(access_token):
    
    import redis
    from datetime import datetime, timedelta
    from app.extensions import db
    from app.modules.auth.models import OAuth2Token, User
    
    oauth2_token_detail = OAuth2Token.query.filter_by(access_token=access_token).first()  
         
    if oauth2_token_detail:
        token_expiry_time = oauth2_token_detail.expires
        if datetime.utcnow() >= token_expiry_time:
            return

        user = User.query.get(oauth2_token_detail.user_id)
        if user.user_type and user.user_type.lower() == 'api':
            return

        expires_in = int(current_app.config['TOKEN_EXPIRY_TIME'])
        expires = datetime.utcnow() + timedelta(seconds=expires_in)

        with db.session.begin():
            oauth2_token_detail.expires = expires
            db.session.merge(oauth2_token_detail)
        
        redis_obj = redis.Redis(BaseConfig.REDIS_HOST, charset="utf-8", decode_responses=True)
        redis_obj.set(access_token, user.id)
        redis_obj.expireat(access_token, expires)
        
        csrf_auth = "csrf_"+str(access_token)
        log.info('updating csrf_access_token expiry in cache')
        redis_obj.expire(csrf_auth, expires_in)

        csrf_token = redis_obj.get(csrf_auth)
        if csrf_token != None:
            log.info('updating csrf_token expiry in cache')
            redis_obj.expire(csrf_token, expires_in)
        
        client_key_for_redis = "client_" + str(access_token)
        resp = redis_obj.get(client_key_for_redis) 
        if resp != None:
            log.info('updating client_access_token expiry in cache')
            redis_obj.expireat(str(resp), expires)
            redis_obj.expire(str(resp), expires_in)
            socket_id = redis_obj.get(resp)
            if socket_id != None:
                log.info('updating socket_id expiry in cache')
                redis_obj.expireat(str(socket_id), expires)


def init_app(app, **kwargs):
    # pylint: disable=unused-argument
    """
    API extension initialization point.
    """
    app.route('/swaggerui/<path:path>')(serve_swaggerui_assets)

    # Prevent config variable modification with runtime changes
    api_v1.authorizations = deepcopy(app.config['AUTHORIZATIONS'])
 
    app.after_request_funcs.setdefault(None, []).append(after_request)
    app.before_request_funcs.setdefault(None, []).append(before_request)


def before_request():
    from flask import request
    from flask_login import current_user
    from flask_restplus_patched._http import HTTPStatus
    import redis

    csrf_integration = current_app.config.get('CSRF_INTEGRATION', True)
    authorisation_token = request.headers.get('Authorization')

    if not (csrf_integration and authorisation_token):
        return


    authorisation_token_details = list(authorisation_token.split(" "))
    authorisation_token = authorisation_token_details[1]

    csrf_token = request.cookies.get('X-CSRF-TOKEN')
    if csrf_token is None or csrf_token == '':
        return abort(code=HTTPStatus.FORBIDDEN,
                        message="Forbidden: You do not have CSRF Token to access. Please reinitiate request with CSRF Token !!!!!")

    redis_obj = redis.Redis(BaseConfig.REDIS_HOST, charset="utf-8", decode_responses=True)

    is_valid_token = redis_obj.get(csrf_token)

    if is_valid_token is None:
        return abort(code=HTTPStatus.FORBIDDEN,
                        message="Forbidden: Your CSRF token has been expired. Please reinitate request !!!!!")
    elif is_valid_token != authorisation_token:
        return abort(code=HTTPStatus.FORBIDDEN,
                        message="Forbidden: You do not have valid CSRF token with authorization token. Please reinitiate request !!!!")


def after_request(response):
    """
    After Request method to set csrf_token
    """
    import redis
    from flask import request

    response.headers['Access-Control-Allow-Credentials'] = 'true'

    if request.headers.get('Authorization', None) and response.status_code not in range(400,500,1):
        auth_token = request.headers.get('Authorization').split(" ")[1]
        try:
            update_access_token_expiry_time(auth_token)
        except Exception as e:
            log.error(f'Unable to update access token expiry time: {str(e)}')

    if current_app.config.get('CSRF_INTEGRATION'):
        auth_token = None
        if request.headers.get('Authorization'):
            auth_token = request.headers.get('Authorization').split(" ")[1]

        csrf_token = ''
        if request.method == 'POST':
            if request.endpoint in frozenset(['auth.handleToken', 'auth.access_token']):
                auth_token = response.get_json()['access_token']

            if auth_token is not None:
                csrf_token = generate_csrf_token(auth_token)

        if csrf_token:
            redis_obj = redis.Redis(BaseConfig.REDIS_HOST, charset="utf-8", decode_responses=True)
            response.set_cookie('X-CSRF-TOKEN', redis_obj.get(f'csrf_{auth_token}'), httponly=True, samesite='Strict')

    return response

