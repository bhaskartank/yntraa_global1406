import socketio

from flask import Flask, render_template, request

from kombu import Connection, Exchange
from kombu.pools import producers
from kombu import Producer
import json, redis
import gevent
import gevent.monkey
from gevent.pywsgi import WSGIServer

app = Flask(__name__)
mgr = socketio.KombuManager('redis://redis:6379')
sio = socketio.Server(client_manager=mgr)
app = Flask(__name__,template_folder='templates')
app.wsgi_app = socketio.Middleware(sio, app.wsgi_app)

@app.route('/')
def index():
    # global thread
    # if thread is None:
    #     thread = sio.start_background_task(background_thread)
    return render_template('index.html')

@sio.on('connect')
def connect(sid, environ):
    print('connect ', sid)
    sio.emit('send_msg', {'data': 'Connected', 'count': 0})
gevent.monkey.patch_all()
gevent.spawn()
interface = '0.0.0.0'
port = 5000
httpd = WSGIServer((interface, port), app)
print('Evented Service (longpolling) running on %s:%s', interface, port)
try:
    httpd.serve_forever()
except:
    print("Evented Service (longpolling): uncaught error during main loop")
    raise