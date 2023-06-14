# encoding: utf-8
"""
Audit Trails module
============
"""

from app.extensions.api import api_v1


def init_app(app, **kwargs):
    # pylint: disable=unused-argument,unused-variable
    """
    Init Audit Trails module.
    """
    api_v1.add_oauth_scope('audit-trails:read', "Provide access to Audit Trails details")
    api_v1.add_oauth_scope('audit-trails:write', "Provide write access to Audit Trails details")

    # Touch underlying modules
    from . import models, resources

    api_v1.add_namespace(resources.api)