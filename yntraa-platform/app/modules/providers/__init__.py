# encoding: utf-8
"""
provider module
============
"""

from app.extensions.api import api_v1


def init_app(app, **kwargs):
    # pylint: disable=unused-argument,unused-variable
    """
    Init provider module.
    """
    api_v1.add_oauth_scope('providers:read', "Provide access to provider details")
    api_v1.add_oauth_scope('providers:write', "Provide write access to provider details")

    # Touch underlying modules
    from . import models #, resources

    #api_v1.add_namespace(resources.api)
