# set async_mode to 'threading', 'eventlet', 'gevent' or 'gevent_uwsgi' to
# force a mode else, the best mode is selected automatically from what's
# installed
from gevent import pywsgi
import gevent.monkey
async_mode = 'gevent'
import logging
import time
from flask import Flask, render_template, request
import socketio
import json, redis


import os

CORS_ALLOW_ORIGINS_STR = os.environ.get('CORS_ALLOW_ORIGINS', 'http://localhost:3001,https://service.yntraa.com,http://localhost:8080,http://localhost:3600,http://yntraa.com,*,http://localhost:3000,http://socketio:5000')
CORS_ALLOW_ORIGINS = CORS_ALLOW_ORIGINS_STR.split(',') if CORS_ALLOW_ORIGINS_STR else []
REDIS_HOST = os.environ.get('REDIS_HOST', 'redis')
REDIS_PORT = os.environ.get('REDIS_PORT', '6379')
REDIS_URL = f"redis://{REDIS_HOST}:{REDIS_PORT}/"
REDIS_DB_NUM = os.environ.get('REDIS_DB_NUM', '1')
gevent.monkey.patch_all()

logging.basicConfig(level=logging.INFO)
mgr = socketio.KombuManager(REDIS_URL + REDIS_DB_NUM)
sio = socketio.Server(client_manager=mgr, logger=True, async_mode=async_mode,
                      cors_allowed_origins=CORS_ALLOW_ORIGINS)
# sio = socketio.Server(logger=False, async_mode=None, message_queue='redis://redis:6379/1')
app = Flask(__name__, template_folder='templates')
app.wsgi_app = socketio.Middleware(sio, app.wsgi_app)
app.config['SECRET_KEY'] = 'secret!'
thread = None
log = logging.getLogger(__name__)

log.info(CORS_ALLOW_ORIGINS)


# @app.route('/get_session')
# def background_thread(token):
#    """Example of how to send server generated events to clients."""
#    redis_obj = redis.Redis('redis', charset="utf-8", decode_responses=True)
#    while True:
#        token = redis_obj.get('jJfh028lvG9SZ0WqD1oyikFZVM0cde')
#        if token:
#            sio.emit('serve_forever', {'data': 'session active', 'status_code':202},
#                     namespace='/session')
#        else:
#            sio.emit('serve_forever', {'data': 'session expired', 'status_code':401},
#                     namespace='/session')
#        sio.sleep(300)

# def background_thread():
#     """Example of how to send server generated events to clients."""
#     count = 0
#     while True:
#         sio.sleep(10)
#         count += 1
#         sio.emit('send_msg', {'data': 'Server generated event'})

@app.route('/')
def index():
    # global thread
    # if thread is None:
    #     thread = sio.start_background_task(background_thread)
    return render_template('index.html')


@sio.on('join_room')
def getstatus(sid, message):
    redis_obj = redis.Redis('redis', charset="utf-8", decode_responses=True)
    if message['taskId'] == 'static_room':
        sio.enter_room(sid, message['taskId'])
        sio.emit(message['taskId'], {'data': 'room joined'})
    else:
        resp = redis_obj.get(message['taskId'])
        is_token_active = redis_obj.get(sid)

        if is_token_active:
            if resp:
                sio.enter_room(sid, message['taskId'])
                sio.emit(message['taskId'], {'data': 'room joined'})
            else:
                sio.emit(message['taskId'],
                         {'data': {'message': 'Invalid task_id', 'status_code': 422, 'task_id': message['taskId']}})
        else:
            sio.emit(message['taskId'],
                     {'data': {'message': 'invalid user', 'status_code': 401, 'task_id': message['taskId']}})


@sio.on('set_session')
def manage_session(sid, message):
    try:
        if 'task_id' in message:
            sio.emit(message['task_id'], {'data': message}, room=message['task_id'])

        else:
            redis_obj = redis.Redis('redis', charset="utf-8", decode_responses=True)
            client_key_for_redis = "client_" + str(message['auth_token'])
            client_id = redis_obj.get(client_key_for_redis)

            sio.emit(message['auth_token'], {'csrf_token': message['csrf_token']}, room=client_id)
    except:
        redis_obj = redis.Redis('redis', charset="utf-8", decode_responses=True)
        client_key_for_redis = "client_" + str(message['auth_token'])
        client_id = redis_obj.get(client_key_for_redis)
        sio.emit(message['auth_token'], {'csrf_token': message['csrf_token']}, room=client_id)


@sio.on('constant_room')
def static_room(sid, message):
    sio.emit('static_room', {'data': message}, room='static_room')


@sio.on('session')
def get_token(sid, message):
    redis_obj = redis.Redis('redis', charset="utf-8", decode_responses=True)
    valid_user_id = redis_obj.get(message['token'])
    if valid_user_id:
        client_key_for_redis = "client_" + str(message['token'])
        redis_obj.set(client_key_for_redis, sid)
        redis_obj.expire(client_key_for_redis, 43200)
        redis_obj.set(sid, message['token'])
        redis_obj.expire(sid, redis_obj.ttl(message['token']))


@sio.on('connect')
def test_connect(sid, environ):
    sio.emit('send_msg', {'data': 'Connected', 'count': 0}, room=sid, namespace='/session')


@sio.on('disconnect')
def test_disconnect(sid):
    redis_obj = redis.Redis('redis', charset="utf-8", decode_responses=True)
    redis_obj.delete(sid)
    print('Client disconnected')


if __name__ == '__main__':
    if sio.async_mode == 'threading':
        # deploy with Werkzeug
        app.run(threaded=True)
    elif sio.async_mode == 'eventlet':
        # deploy with eventlet
        import eventlet
        import eventlet.wsgi

        eventlet.wsgi.server(eventlet.listen(('0.0.0.0', 5000)), app)
    elif sio.async_mode == 'gevent':
        # deploy with gevent
        try:
            from geventwebsocket.handler import WebSocketHandler

            websocket = True
        except ImportError:
            websocket = False
        if websocket:
            pywsgi.WSGIServer(('0.0.0.0', 5000), app,
                              handler_class=WebSocketHandler).serve_forever()
        else:
            pywsgi.WSGIServer(('0.0.0.0', 5000), app).serve_forever()
    elif sio.async_mode == 'gevent_uwsgi':
        print('Start the application through the uwsgi server. Example:')
        print('uwsgi --http :5001 --gevent 1000 --http-websockets --master '
              '--wsgi-file app.py --callable app')
    else:
        print('Unknown async_mode: ' + sio.async_mode)
