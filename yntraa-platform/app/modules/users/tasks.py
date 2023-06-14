import logging
import os
from flask_login import current_user
from flask_restplus_patched import Resource
from flask_restplus_patched._http import HTTPStatus
from app.modules.users import permissions
from app.modules.users.models import User
from app import celery, create_app
from socketIO_client import SocketIO, LoggingNamespace
from app.extensions import db, sio
import time
from flask import request
from celery.result import AsyncResult
import redis, uuid
import requests, ssl
#from config import BaseConfig
#from app.extensions.api import Namespace


log = logging.getLogger(__name__)
@celery.task
def get_me(user):
    #app = create_app('base')
    app = create_app(os.getenv('FLASK_CONFIG', 'base'))
    app.app_context().push()
    task_id = celery.current_task.request.id
    # time.sleep(10)

    # redis_obj = redis.Redis(BaseConfig.REDIS_HOST, charset="utf-8", decode_responses=True)
    # redis_obj.delete('test123456')
    # sio.emit('set_session',{'data':task_id, 'auth_token':'1234fdsfsdfdff'})
    #user_action_log(str(task_id), 'success')

@celery.task
def send_otp_sms(url):
    app = create_app(os.getenv('FLASK_CONFIG', 'base'))
    app.app_context().push()
    message_delivery_status = False
    try:
        message_status = requests.get(url, verify=False).text
        log.info(message_status)
        if ('Accepted' in message_status):
            message_delivery_status = True
        return message_delivery_status

    except Exception as e:
        log.info("Exception: %s", e)
        return message_delivery_status

