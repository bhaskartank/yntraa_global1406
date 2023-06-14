# encoding: utf-8
"""
Organisations module
============
"""

from app.extensions.api import api_v1


def init_app(app, **kwargs):
    # pylint: disable=unused-argument,unused-variable
    """
    Init Organisations module.
    """
    api_v1.add_oauth_scope('organisations:read', "Provide access to Organisations details")
    api_v1.add_oauth_scope('organisations:write', "Provide write access to Organisations details")

    # Touch underlying modules
    from . import models, resources

    api_v1.add_namespace(resources.api)