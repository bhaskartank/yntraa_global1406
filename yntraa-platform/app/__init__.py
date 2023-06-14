# encoding: utf-8
"""
Example RESTful API Server.
"""
import logging
import os
import sys

from flask import Flask
from werkzeug.contrib.fixers import ProxyFix
from celery import Celery
from config import BaseConfig

CONFIG_NAME_MAPPER = {
    'development': 'config.DevelopmentConfig',
    'testing': 'config.TestingConfig',
    'production': 'config.ProductionConfig',
    'base': 'config.BaseConfig',
    'local': 'local_config.LocalConfig',
}

celery = Celery(__name__, broker=BaseConfig.CELERY_BROKER_URL, include=['app.modules.users.tasks','app.modules.projects.tasks','app.modules.compute.tasks', 'app.modules.volumes.tasks', 'app.modules.load_balancers.tasks', 'app.modules.scaling_groups.tasks', 'app.modules.nks.tasks', 'app.modules.networks.tasks', 'app.modules.orchestrators.tasks', 'app.modules.cluster.tasks'])
def create_app(flask_config_name=None, **kwargs):
    """
    Entry point to the Flask RESTful Server application.
    """
    # This is a workaround for Alpine Linux (musl libc) quirk:
    # https://github.com/docker-library/python/issues/211
    import threading
    threading.stack_size(2*1024*1024)

    app = Flask(__name__, **kwargs)
    env_flask_config_name = os.getenv('FLASK_CONFIG')
    if not env_flask_config_name and flask_config_name is None:
        flask_config_name = 'local'
    elif flask_config_name is None:
        flask_config_name = env_flask_config_name
    else:
        if env_flask_config_name:
            assert env_flask_config_name == flask_config_name, (
                "FLASK_CONFIG environment variable (\"%s\") and flask_config_name argument "
                "(\"%s\") are both set and are not the same." % (
                    env_flask_config_name,
                    flask_config_name
                )
            )

    try:
        app.config.from_object(CONFIG_NAME_MAPPER[flask_config_name])
    except ImportError:
        if flask_config_name == 'local':
            app.logger.error(
                "You have to have `local_config.py` or `local_config/__init__.py` in order to use "
                "the default 'local' Flask Config. Alternatively, you may set `FLASK_CONFIG` "
                "environment variable to one of the following options: development, production, "
                "testing."
            )
            sys.exit(1)
        raise

    if app.config['REVERSE_PROXY_SETUP']:
        app.wsgi_app = ProxyFix(app.wsgi_app)

    from . import extensions
    extensions.init_app(app)

    from . import modules
    modules.init_app(app)
    celery.conf.update(app.config)
    return app