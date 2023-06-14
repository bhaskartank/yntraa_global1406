# encoding: utf-8
"""
AuditTrail adapter
---------------
"""
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
import logging
log = logging.getLogger(__name__)

class AuditTrail(object):
    """
    This is a helper extension, which adjusts logging configuration for the
    application.
    """
    def __init__(self, app=None):
        if app:
             self.init_app(app)

    def init_app(self, app):
        """
        Common Flask interface to initialize the connetion to MongoDB according to the
        application configuration.
        """
        self.mongo = PyMongo(app, uri="mongodb://mongodb:27017/auditTrail")
        log.debug(self.mongo)
        return self.mongo

    def save_audit_log(self, data={}):

        audit_inserted_id = self.mongo.db.auditTrail.insert_one(data).inserted_id

        return audit_inserted_id

    def get_audit_log_by_id(self, log_id):
        audit_log = self.mongo.db.auditTrail.find_one({"_id":ObjectId(log_id)})
        return audit_log

    def get_audit_log(self, offset=0, limit=100):

        audit_log = self.mongo.db.auditTrail.find({}).skip(offset).limit(limit)
        return audit_log