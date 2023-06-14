# encoding: utf-8
"""
Flask-RESTplus API registration module
======================================
"""

from flask import Blueprint, jsonify

from app.extensions import api

def handle_bad_request(e):
    return jsonify(code=404,message=str(e)), 404

def handle_unauthorized_request(e):
    return jsonify(code=401,message=str(e)), 401

def init_app(app, **kwargs):
    # pylint: disable=unused-argument
    api_v1_blueprint = Blueprint('api', __name__, url_prefix='/api/v1')
    api.api_v1.init_app(api_v1_blueprint)
    app.register_blueprint(api_v1_blueprint)
    app.register_error_handler(404, handle_bad_request)
    app.register_error_handler(401, handle_unauthorized_request)

