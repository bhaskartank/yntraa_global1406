# encoding: utf-8
"""
flask limiter
---------------
"""
# from flask_limiter import Limiter
# from flask_limiter.util import get_remote_address
#
# from functools import wraps
# from flask import g, Blueprint, request
# from flask_limiter import Limiter, RateLimitExceeded
# from flask_limiter.util import get_remote_address
# from flask_limiter.wrappers import LimitGroup

from functools import wraps
from flask_login import current_user
from flask import request
from .exceptions import RateLimited
from .utils import is_rate_limited
from app.extensions.api import abort
from flask_restplus_patched._http import HTTPStatus
from config import BaseConfig


import logging
log = logging.getLogger(__name__)


"""
Decorator for request rate limit
Rate Example = 10/m, (m= minute), 1/s,(s= second), 40/h, (h=hour), 100/d, (d=day)
"""


def ratelimit(rate='100/s', redis_url=BaseConfig.REDIS_URL + BaseConfig.REDIS_DB_NUM):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            #from app.modules import update_token_expiry_time
            #log.info(request.headers.get('X-Real-Ip'))
            current_path = request.path
            is_csi_user = False
            try:
                key = current_user.id
                user_type = current_user

                action = request.method + "_" + str(current_path)
                is_csi_user = current_user.user_type == 'csi_user'
                #update_token_expiry_time(current_user.id)
            except:
                key = request.headers.get('X-Real-Ip') #current_user.id


            key = str(key)+'_'+str(current_path)+'_'+request.method
            message = "Too many requests."

            if 'validate_otp' in current_path or '/oauth2/token' in current_path:
                message = message +"Your account has been locked for 2 minutes."

            # No limiting for user_type CSI_USER.
            # TODO: Identify optimum rate limiting for CSI_USER
            if not is_csi_user and is_rate_limited(rate, key, f, redis_url):
                abort(
                    code=HTTPStatus.TOO_MANY_REQUESTS,
                    message=message
                )
            return f(*args, **kwargs)

        return decorated_function

    return decorator


