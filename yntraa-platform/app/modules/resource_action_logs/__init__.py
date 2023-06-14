# encoding: utf-8
"""
Resource Action Logs module
============
"""

from app.extensions.api import api_v1


def init_app(app, **kwargs):
    # pylint: disable=unused-argument,unused-variable
    """
    Init Resource Action Logs module.
    """
    api_v1.add_oauth_scope('resource-action-logs:read', "Provide access to Resource Action Logs details")
    api_v1.add_oauth_scope('resource-action-logs:write', "Provide write access to Resource Action Logs details")

    # Touch underlying modules
    from . import models, resources

    api_v1.add_namespace(resources.api)