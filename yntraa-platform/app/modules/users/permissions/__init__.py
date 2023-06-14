# encoding: utf-8
# pylint: disable=too-few-public-methods,invalid-name,abstract-method,method-hidden
"""
RESTful API permissions
-----------------------
"""
import logging
from flask_sqlalchemy import BaseQuery
from permission import Permission as BasePermission
from functools import wraps
from flask_login import current_user
from app.modules.role_permission.models import RolePermissionGroup, UserRole,UsersDefaultScope
from flask_restplus_patched._http import HTTPStatus
from app.extensions.api import abort

from . import rules

log = logging.getLogger(__name__)


class PermissionExtendedQuery(BaseQuery):
    """
    Extends BaseQuery class from flask_sqlalchemy to add get_or_403 method

    Example:
    >>> DataTransformation.query.get_or_403(id)
    """
    def __init__(self, permisssion, *args, **kwargs):
        super(PermissionExtendedQuery, self).__init__(*args, **kwargs)
        self.permisssion = permisssion

    def get_or_403(self, ident):
        obj = self.get_or_404(ident)
        with self.permisssion(obj=obj):
            return obj


class Permission(BasePermission):
    """
    Declares classmethod to provide extended BaseQuery to model,
    which adds additional method get_or_403
    """

    @classmethod
    def get_query_class(cls):
        """
        Returns extended BaseQuery class for flask_sqlalchemy model to provide get_or_403 method

        Example:
        >>> DataTransformation(db.Model):
        ...     query_class = OwnerRolePermission.get_query_class()
        """
        return lambda *args, **kwargs: PermissionExtendedQuery(cls, *args, **kwargs)


class PasswordRequiredPermissionMixin(object):
    """
    Helper rule mixin that ensure that user password is correct if
    `password_required` is set to True.
    """

    def __init__(self, password_required=False, password=None, **kwargs):
        # NOTE: kwargs is required since it is a mixin
        """
        Args:
            password_required (bool) - in some cases you may need to ask
                users for a password to allow certain actions, enforce this
                requirement by setting this :bool:`True`.
            password (str) - pass a user-specified password here.
        """
        self._password_required = password_required
        self._password = password
        super(PasswordRequiredPermissionMixin, self).__init__(**kwargs)

    def rule(self):
        _rule = super(PasswordRequiredPermissionMixin, self).rule()
        if self._password_required:
            _rule &= rules.PasswordRequiredRule(self._password)
        return _rule


class WriteAccessPermission(Permission):
    """
    Require a regular user role to perform an action.
    """

    def rule(self):
        return rules.InternalRoleRule() | rules.AdminRoleRule() | rules.WriteAccessRule()


class RolePermission(Permission):
    """
    This class aims to help distinguish all role-type permissions.
    """

    def __init__(self, partial=False, **kwargs):
        """
        Args:
            partial (bool) - True values is mostly useful for Swagger
                documentation purposes.
        """
        self._partial = partial
        super(RolePermission, self).__init__(**kwargs)

    def rule(self):
        if self._partial:
            return rules.PartialPermissionDeniedRule()
        return rules.AllowAllRule()


class ActiveUserRolePermission(RolePermission):
    """
    At least Active user is required.
    """

    def rule(self):
        return rules.ActiveUserRoleRule()


class AdminRolePermission(PasswordRequiredPermissionMixin, RolePermission):
    """
    AdminType user role is required.
    """

    def rule(self):
        return (
            (rules.AdminRoleRule() & super(AdminRolePermission, self).rule())
        )


class InternalRolePermission(RolePermission):
    """
    SuperAdmin type user role is required.
    """

    def rule(self):
        return rules.InternalRoleRule()


class SupervisorRolePermission(PasswordRequiredPermissionMixin, RolePermission):
    """
    Supervisor/Admin may execute this action.
    """

    def __init__(self, obj=None, **kwargs):
        """
        Args:
            obj (object) - any object can be passed here, which will be asked
                via ``check_supervisor(current_user)`` method whether a current
                user has enough permissions to perform an action on the given
                object.
        """
        self._obj = obj
        super(SupervisorRolePermission, self).__init__(**kwargs)

    def rule(self):
        return (
            rules.InternalRoleRule()
            | (
                (
                    rules.AdminRoleRule()
                    | rules.SupervisorRoleRule(obj=self._obj)
                )
                & super(SupervisorRolePermission, self).rule()
            )
        )


class OwnerRolePermission(PasswordRequiredPermissionMixin, RolePermission):
    """
    Owner/Supervisor/Admin may execute this action.
    """

    def __init__(self, obj=None, **kwargs):
        """
        Args:
            obj (object) - any object can be passed here, which will be asked
                via ``check_owner(current_user)`` method whether a current user
                has enough permissions to perform an action on the given
                object.
        """
        self._obj = obj
        super(OwnerRolePermission, self).__init__(**kwargs)

    def rule(self):
        return (
            rules.InternalRoleRule()
            | (
                (
                    rules.AdminRoleRule()
                    | rules.OwnerRoleRule(obj=self._obj)
                    | rules.SupervisorRoleRule(obj=self._obj)
                )
                & super(OwnerRolePermission, self).rule()
            )
        )


"""
Added code on 23/08/2018
"""
class TeamRolePermission(PasswordRequiredPermissionMixin, RolePermission):

    """
    Team/Owner/Supervisor/Admin may perform this action.
    """

    def __init__(self, obj=None, **kwargs):

        self._obj = obj
        super(TeamRolePermission, self).__init__(**kwargs)

    def rule(self):
        return (
            rules.InternalRoleRule()
            | (
                (
                    rules.AdminRoleRule()
                    | rules.SupervisorRoleRule(obj=self._obj)
                    | rules.OwnerRoleRule(obj=self._obj)

                )
                & super(TeamRolePermission, self).rule()
            )
        )


class ProjectRolePermission(PasswordRequiredPermissionMixin, RolePermission):

    """
    Project/Team/Supervison/Admin may perform this action
    """
    # from app.modules.role_permission.models import UserRole

    def __init__(self, obj=None, **kwargs):
        # log.info("obj =====================>>>>>> %s", obj)
        # self.role_class = UserRole
        self._obj = obj
        super(ProjectRolePermission, self).__init__(**kwargs)

    def rule(self):
        return (
            rules.InternalRoleRule()
            | (
                (
                    rules.AdminRoleRule()
                    | rules.SupervisorRoleRule(obj=self._obj)
                    | rules.OwnerRoleRule(obj=self._obj)
                    | rules.TeamRoleRule(obj=self._obj)
                )
                & super(ProjectRolePermission, self).rule()
            )
        )
        return rules.ProjectRoleRule(obj=self._obj)


def check_permission(permission_value):
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            from flask import request
            from app.modules.auth.models import OAuth2Token

            if current_user.is_internal:
                ret = f(*args, **kwargs)
                return ret

            userrole = None
            project_id = None
            organisation_id = None
            permission_list = None
            role_id = None
            user_id = current_user.id

            if 'project' in kwargs:
                project = kwargs['project']
                project_id = project.id
            if 'project_id' in kwargs:
                project_id = kwargs['project_id']
            if 'organisation' in kwargs:
                organisation = kwargs['organisation']
                organisation_id = organisation.id
            if 'organisation_id' in kwargs:
                organisation_id = kwargs['organisation_id']
            current_path = request.path
            
            if project_id is None and '/api/v1/organisation' not in current_path:

                authorisation_token = request.headers.get('Authorization')
                authorisation_token_details = list(authorisation_token.split(" "))
                authorisation_token = authorisation_token_details[1]
                oauth2_last_token = OAuth2Token.query.filter_by(access_token=authorisation_token,
                                                                user_id=current_user.id).one_or_none()

                project_id = oauth2_last_token.project_id

            if project_id is not None and organisation_id is not None:
                userrole = UserRole.query.filter_by(organisation_id=organisation_id, project_id=project_id, user_id=user_id).one_or_none()

            elif organisation_id is not None:
                userrole = UserRole.query.filter_by(organisation_id=organisation_id, user_id=user_id).first()

            elif project_id is not None:
                userrole = UserRole.query.filter_by(project_id=project_id, user_id=user_id).one_or_none()

            else:
                return abort(code=HTTPStatus.FORBIDDEN, message="You don\'t have permission to perform this action")

            if userrole is not None:
                permission_list = userrole.user_scope
                if permission_list is None:
                    permission_list = list()

                user_type = 'internal'
                if current_user.is_admin:
                    user_type = 'admin'
                elif current_user.is_regular_user:
                    user_type = 'regular'

                user_default_scope = UsersDefaultScope.query.filter_by(user_scope_type=user_type).one_or_none()

                if user_default_scope is not None:
                    permission_list.extend(user_default_scope.scope)

                role_id = userrole.user_role

                if permission_value in permission_list:
                    ret = f(*args, **kwargs)
                    return ret

                else:
                    rolepermission = RolePermissionGroup.query.filter_by(id=role_id).one_or_none()

                    if rolepermission is not None:
                        if permission_value in rolepermission.scope:
                            ret = f(*args, **kwargs)
                            return ret
                        else:
                            return abort(code=HTTPStatus.FORBIDDEN,
                                         message="You don\'t have permission to perform this action")
                    else:
                        return abort(code=HTTPStatus.FORBIDDEN,
                                     message="You don\'t have permission to perform this action")
            else:
                return abort(code=HTTPStatus.FORBIDDEN, message="You don\'t have permission to perform this action")

            ret = f(*args, **kwargs)
            return ret
        return wrapped
    return decorator


