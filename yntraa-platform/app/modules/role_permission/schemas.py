# encoding: utf-8
# pylint: disable=too-few-public-methods
"""
permission group schemas
------------
"""

from flask_marshmallow import base_fields
from flask_restplus_patched import Schema, ModelSchema
from app.modules.projects.schemas import DetailedProjectSchema, BaseProjectSchema
from app.modules.organisations.schemas import BaseOrganisationSchema 
from .models import UserRole, RolePermissionGroup, UsersDefaultScope
#from app.modules.organisations.models import OrganisationUsers

class BaseUserRoleSchema(ModelSchema):
    """
    Base user role schema exposes only the most general fields.
    """
    user_scope = base_fields.List(base_fields.String, required=True)
    project = base_fields.Nested(
        'DetailedProjectSchema'
    )
    organisation = base_fields.Nested(
        'BaseOrganisationSchema'
    )
    role_permission_group = base_fields.Nested(
        'BaseRolePermissionGroupSchema'
    )
    user = base_fields.Nested(
        'BaseUserSchema',
        #many=True
    )
    class Meta:
        # pylint: disable=missing-docstring
        model = UserRole
        fields = (
            UserRole.id.key,
            UserRole.organisation_id.key,
            UserRole.project_id.key,    
            UserRole.user_scope.key,
            UserRole.user_role.key,
            UserRole.project.key,
            UserRole.organisation.key,
            UserRole.role_permission_group.key,
            UserRole.user.key,
        )
        dump_only = (
            UserRole.id.key,
        )


class DetailedUserRoleSchema(BaseUserRoleSchema):
    """
    Detailed user schema exposes all useful fields.
    """
    user_scope = base_fields.List(base_fields.String, required=True)
    project = base_fields.Nested(
        'DetailedProjectSchema',
        #many=True
    )
    organisation = base_fields.Nested(
        'BaseOrganisationSchema',
        #many=True
    )
    role_permission_group = base_fields.Nested(
        'BaseRolePermissionGroupSchema'
    )
    created = base_fields.DateTime(format="%s", attribute="created")
    updated = base_fields.DateTime(format="%s", attribute="updated")
    class Meta(BaseUserRoleSchema.Meta):
        fields = BaseUserRoleSchema.Meta.fields + (
            UserRole.user_id.key,
            UserRole.created.key,
            UserRole.updated.key,
            UserRole.user_scope.key,
            UserRole.project.key,
            UserRole.organisation.key,
            UserRole.role_permission_group.key,

        )

class BaseRolePermissionGroupSchema(ModelSchema):
    """
    Base user role permission group schema exposes only the most general fields.
    """
    scope = base_fields.List(base_fields.String, required=True)
    class Meta:
        # pylint: disable=missing-docstring
        model = RolePermissionGroup
        fields = (
            RolePermissionGroup.id.key,
            RolePermissionGroup.group_name.key,
            RolePermissionGroup.group_description.key,
            RolePermissionGroup.organisation_id.key,
            RolePermissionGroup.scope.key,
            RolePermissionGroup.is_active.key,
            RolePermissionGroup.public.key,
            RolePermissionGroup.status.key,

        )
        dump_only = (
            RolePermissionGroup.id.key,
        )


class DetailedRolePermissionGroupSchema(BaseRolePermissionGroupSchema):
    """
    Detailed user schema exposes all useful fields.
    """
    scope = base_fields.List(base_fields.String, required=True)
    
    # organisation_user_user = base_fields.Nested(
    #     'BaseOrganisationUserSchema',
    #     exclude = (OrganisationUser.user_id.key, OrganisationUser.id.key, ),
    #     many=True
    # )
    created = base_fields.DateTime(format="%s", attribute="created")
    updated = base_fields.DateTime(format="%s", attribute="updated")
    class Meta(BaseRolePermissionGroupSchema.Meta):
        fields = BaseRolePermissionGroupSchema.Meta.fields + (
            RolePermissionGroup.created.key,
            RolePermissionGroup.updated.key

        )

class BaseUserTypeForDefaultScopeSchema(ModelSchema):
    """
    Base user type for default schema exposes only the most general fields.
    """
    scope = base_fields.List(base_fields.String, required=True)
    class Meta:
        # pylint: disable=missing-docstring
        model = UsersDefaultScope
        fields = (
            UsersDefaultScope.id.key,
            UsersDefaultScope.user_scope_type.key,
            UsersDefaultScope.scope.key,
        )
        dump_only = (
            UsersDefaultScope.id.key,
        )

