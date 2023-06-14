# pylint: disable=too-few-public-methods,invalid-name,missing-docstring
import os


class BaseConfig(object):
    INGRESS_SECG_MONITORING_PORT = 9100
    INGRESS_SECG_AV_PORT = 4118
    CEPH_OBJECT_GATEWAY_USER_URL = '3.7.59.116:8080'
    CEPH_BUCKET_URL = 'http://3.7.59.116:8080'
    CEPH_OBJECT_GATEWAY_ACCESS_KEY = 'OMDNG30GCFSXNLG4G0XE'
    CEPH_OBJECT_GATEWAY_SECRET_KEY = 'w9bWcwXbhEqudDwefR5z8TIEomVxHVkB1SKRAQwS'
    CEPH_OBJECT_KEY_PATTERN = r"/([^/]+)$"

    SECRET_KEY = 'this-is-my-secret-key-and-needs-to-be-changed-in-prod'

    PROJECT_ROOT = os.path.abspath(os.path.dirname(__file__))

    POSTGRES_USER = os.environ.get('POSTGRES_USER', 'global_user')
    POSTGRES_PASSWORD = os.environ.get('POSTGRES_PASSWORD', 'password')
    POSTGRES_DB = os.environ.get('POSTGRES_DB', 'globaldb')
    DB_HOST = os.environ.get('DB_HOST', 'localhost')
    DB_PORT = os.environ.get('DB_PORT', '5435')

    SQLALCHEMY_DATABASE_URI = 'postgresql://{user}:{password}@{host}:{port}/{name}'.format(
        user=POSTGRES_USER,
        password=POSTGRES_PASSWORD,
        host=DB_HOST,
        port=DB_PORT,
        name=POSTGRES_DB,
    )

    # SQLITE
    # SQLALCHEMY_DATABASE_URI = 'sqlite:///%s' % (os.path.join(PROJECT_ROOT, "example.db"))

    DEBUG = False
    MODE = 'production'
    ERROR_404_HELP = False

    REVERSE_PROXY_SETUP = os.getenv('API_REVERSE_PROXY_SETUP', False)

    AUTHORIZATIONS = {
        'oauth2_password': {
            'type': 'oauth2',
            'flow': 'password',
            'scopes': {},
            'tokenUrl': '/auth/oauth2/token',
        },
        # TODO: implement other grant types for third-party apps
        # 'oauth2_implicit': {
        #    'type': 'oauth2',
        #    'flow': 'implicit',
        #    'scopes': {},
        #    'authorizationUrl': '/auth/oauth2/authorize',
        # },
    }

    OTP_INTEGRATION = os.getenv('OTP_INTEGRATION', 'true')
    OTP_EXPIRY_TIME = os.getenv('OTP_EXPIRY_TIME', '120')
    TOKEN_EXPIRY_TIME = os.getenv('TOKEN_EXPIRY_TIME', '600')

    SECRET_KEY = 'SomethingNotEntirelySecret'
    CSRF_INTEGRATION = os.getenv('CSRF_INTEGRATION', default=False)
    IS_OIDC_ENABLED = (os.getenv('OIDC_ENABLED', "false").lower() != 'false')
    OIDC_CLIENT_ID = os.getenv('OIDC_CLIENT_ID', 'ccp-apiserver')
    OIDC_CLIENT_SECRET = os.getenv('OIDC_CLIENT_SECRET', 'te0cXJGv10TyZfScWXHgy4YegDf75oZB')
    OIDC_DISCOVERY_URI = os.getenv('OIDC_DISCOVERY_URI',
                                   'https://yantraiam.coredge.io/realms/cloud/.well-known/openid-configuration')
    OIDC_RESOURCE_CHECK_AUD = os.getenv('OIDC_RESOURCE_CHECK_AUD', default=False)
    OIDC_ID_TOKEN_COOKIE_SECURE = os.getenv('OIDC_ID_TOKEN_COOKIE_SECURE', default=False)
    OIDC_REQUIRE_VERIFIED_EMAIL = os.getenv('OIDC_REQUIRE_VERIFIED_EMAIL', default=False)
    OIDC_USER_INFO_ENABLED = (os.getenv('OIDC_USER_INFO_ENABLED', 'false').lower() != 'false')
    OIDC_OPENID_REALM = os.getenv('OIDC_OPENID_REALM', 'cloud')
    OIDC_SCOPES = 'openid'
    OIDC_INTROSPECTION_AUTH_METHOD = os.getenv('OIDC_INTROSPECTION_AUTH_METHOD', 'client_secret_post')
    OIDC_RESOURCE_SERVER_ONLY = True  # Important to set this so that we are not redirecting.
    OIDC_DISABLE_URI_SSL_VALIDATION = (os.getenv('OIDC_DISABLE_URI_SSL_VALIDATION',"false").lower() != 'false')
    OIDC_INTERNAL_BASE_URL = os.getenv('OIDC_INTERNAL_URL', 'https://kcyotta.coredge.io')

    VAULT_ENABLED = os.getenv('VAULT_ENABLED', 'false').lower() == 'true'
    VERIFY_VAULT_SSL = os.getenv('VERIFY_VAULT_SSL', 'true').lower() == 'true'
    VAULT_ADDR = os.getenv('VAULT_ADDR', 'https://vault.cloud.yntraa.com')
    VAULT_TOKEN = os.getenv('VAULT_TOKEN', '')
    VAULT_KV_PATH = os.getenv('VAULT_KV_PATH', 'v1/secret')

    AUTO_VERIFY_BACKUP = os.getenv('AUTO_VERIFY_BACKUP', 'false').lower() == 'true'

    ENABLED_MODULES = (
        # 'resource_costs',
        'auth',
        'utils',
        'quotapackages',
        # 'projects',
        # 'certificates',
        'organisations',
        'users',
        # 'teams',
        # 'scaling_groups',
        'providers',
        # 'volumes',
        # 'load_balancers',
        # 'object_storages',
        # 'kubernetesnodes',
        # 'metadatas',
        # 'cluster',
        'audit_trails',
        # 'public_ips',
        'resource_action_logs',
        # 'nas_volumes',
        # 'resource_metrices',
        # 'hostaggregates',
        # 'invoices',
        # 'resource_annotations',
        # 'orchestrators',
        # 'nks',
        'api',
    )

    STATIC_ROOT = os.path.join(PROJECT_ROOT, 'static')

    SWAGGER_UI_JSONEDITOR = True
    SWAGGER_UI_OAUTH_CLIENT_ID = 'documentation'
    SWAGGER_UI_OAUTH_REALM = "Authentication for Yntraa Cloud API server documentation"
    SWAGGER_UI_OAUTH_APP_NAME = "Yntraa Cloud API server documentation"
    REDIS_HOST = os.environ.get('REDIS_HOST', 'redis')
    REDIS_PORT = os.environ.get('REDIS_PORT', '6379')
    REDIS_URL = f"redis://{REDIS_HOST}:{REDIS_PORT}/"
    REDIS_DB_NUM = (os.getenv('REDIS_DB_NUM', '0'))
    CELERY_BROKER_URL = REDIS_URL,
    CELERY_RESULT_BACKEND = REDIS_URL

    SOCKETIO_HOST = os.getenv('SOCKETIO_HOST', 'socketio')
    SOCKETIO_PORT = os.getenv('SOCKETIO_PORT', '5000')

    # TODO: consider if these are relevant for this project
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    CSRF_ENABLED = False
    CONSOLE_PROXY = os.environ.get('CONSOLE_PROXY', '')

    # SMS_SERVICE_URL = "https://smsgw.sms.yntraa.com/failsafe/HttpLink?"    
    # SMS_SERVICE_USERID = "cloudweb.sms"        
    # SMS_SERVICE_USERPIN = "K!pdz8d%2h"            
    # SMS_SERVICE_SSID = "YntraaCCS"


class ProductionConfig(BaseConfig):
    # SECRET_KEY = os.getenv('API_SERVER_SECRET_KEY')
    # SQLALCHEMY_DATABASE_URI = os.getenv('API_SERVER_SQLALCHEMY_DATABASE_URI')
    SECRET_KEY = 'this-is-my-secret-key-and-needs-to-be-changed-in-prod'

    POSTGRES_USER = os.environ.get('POSTGRES_USER', 'api_user')
    POSTGRES_PASSWORD = os.environ.get('POSTGRES_PASSWORD', 'password')
    POSTGRES_DB = os.environ.get('POSTGRES_DB', 'apidb')
    DB_HOST = os.environ.get('DB_HOST', 'postgres')
    DB_PORT = os.environ.get('DB_PORT', '5432')
    CONSOLE_PROXY = os.environ.get('CONSOLE_PROXY', '')

    SQLALCHEMY_DATABASE_URI = 'postgresql://{user}:{password}@{host}:{port}/{name}'.format(
        user=POSTGRES_USER,
        password=POSTGRES_PASSWORD,
        host=DB_HOST,
        port=DB_PORT,
        name=POSTGRES_DB,
    )
    MODE = 'production'


class DevelopmentConfig(BaseConfig):
    DEBUG = True
    MODE = 'development'


class TestingConfig(BaseConfig):
    TESTING = True
    MODE = 'testing'
    # Use in-memory SQLite database for testing
    SQLALCHEMY_DATABASE_URI = 'sqlite://'


class ResourceActionlogConfig(BaseConfig):
    BUCKETS = 'buckets'
    SUCCESS = 'Success'
    CREATED = 'created'
    OBJSTORAGEPROVIDER = 'ObjStorageProvider'
    FAIL = 'Fail'
