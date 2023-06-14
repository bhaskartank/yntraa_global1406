# encoding: utf-8
"""
QuotaPackages module
============
"""

from app.extensions.api import api_v1


def init_app(app, **kwargs):
    # pylint: disable=unused-argument,unused-variable
    """
    Init QuotaPackages module.
    """
    api_v1.add_oauth_scope('quotapackages:read', "Provide access to QuotaPackages details")
    api_v1.add_oauth_scope('quotapackages:write', "Provide write access to QuotaPackages details")

    # Touch underlying modules
    from . import models, resources

    api_v1.add_namespace(resources.api)