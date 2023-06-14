from functools import wraps

from .exceptions import RateLimited
from .utils import is_rate_limited
from congig import BaseConfig

def ratelimit(rate, key, redis_url=BaseConfig.REDIS_URL + BaseConfig.REDIS_DB_NUM):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if is_rate_limited(rate, key, f, redis_url):
                raise RateLimited("Too Many Requests")
            return f(*args, **kwargs)
        return decorated_function
    return decorator
