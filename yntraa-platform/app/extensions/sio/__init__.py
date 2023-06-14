# encoding: utf-8
"""
Logging adapter
---------------
"""
from socketIO_client import SocketIO, LoggingNamespace
from config import BaseConfig
import logging
log = logging.getLogger(__name__)

class SIO(object):
    """
    This is a helper extension, which adjusts logging configuration for the
    application.
    """
    def __init__(self, app=None):
        if app:
             self.init_app(app)

    def init_app(self, app):
        """
        Common Flask interface to initialize the connetion to SocketIO according to the
        application configuration.
        """
        self.socketIO = None
        self.socketIO = SocketIO(BaseConfig.SOCKETIO_HOST, BaseConfig.SOCKETIO_PORT, LoggingNamespace)
        #self.socketIO = SocketIO('socketio', 5000, LoggingNamespace)
        return self
    def emit(self, event, data):
        # sio = SocketIO('socketio', 10000, LoggingNamespace)
        # user_socket = self.socketIO.define(BaseNamespace, namespace)
        # user_socket.emit(event, data)
        try:
            self.socketIO.emit(event, data)
            # self.socketIO.disconnect()
            #self.socketIO.wait(seconds=1)
        except Exception as e:
            log.info(e)
            self.socketIO.disconnect()

    def disconnect(self):
        self.socketIO.disconnect()
