
from app.extensions.api import api_v1


def init_app(app, **kwargs):
    # pylint: disable=unused-argument,unused-variable
    """
    Init Role_permission module.
    """
    api_v1.add_oauth_scope('role_permission:read', "Provide access to Permission details")
    api_v1.add_oauth_scope('role_permission:write', "Provide write access to Permission details")

    # Touch underlying modules
    from . import models, resources

    api_v1.add_namespace(resources.api)

#
# class ConstactRole:
#
#     def __init__(self):
#         pass
#
#     @staticmethod
#     def getRole():
#
#         roles = ['admin', 'Organisation_admin', 'project_admin', 'user']
#         return roles
#
#
#     @staticmethod
#     def getPermission():
#
#         permissions = ['read', 'write', 'delete', 'update']
#         return permissions