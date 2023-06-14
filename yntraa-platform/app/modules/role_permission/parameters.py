from flask_login import current_user
from flask_marshmallow import base_fields
from flask_restplus_patched import PostFormParameters, PatchJSONParameters
from flask_restplus_patched._http import HTTPStatus
from marshmallow import validates_schema, ValidationError
from app.extensions.api.parameters import PaginationParameters, SortPaginateParameters

from app.extensions.api import abort
from . import schemas
from .models import UserRole


class AddUserRoleParameters(PostFormParameters):
    """
    New user role creation parameters.
    """
    organisation_id = base_fields.Integer(description="Example: 1", required=True)
    project_id = base_fields.String(description="Example: 1", required=True)
    user_scope = base_fields.List(base_fields.String, required=False)
    user_role = base_fields.Integer(description="Example: 1", required=False)

    # class Meta(schemas.BaseUserRoleSchema.Meta):
    #     fields = schemas.BaseUserRoleSchema.Meta.fields + (
    #         'organisation_id',
    #         'project_id',
    #         'user_scope',
    #         'user_role'
    #     )

class UpdateUserRoleParameters(PostFormParameters, schemas.BaseUserRoleSchema):
    """
    Update user role parameters.
    """
    user_scope = base_fields.List(base_fields.String, required=False)
    user_role = base_fields.Integer(description="Example: 1 Role Permission Group ID", required=False)

    class Meta(schemas.BaseUserRoleSchema.Meta):
        fields = schemas.BaseUserRoleSchema.Meta.fields + (

            'user_scope',
            'user_role'
        )


class PatchUserRolesDetailsParameters(PatchJSONParameters):

    # pylint: disable=abstract-method
    """
    User details updating parameters following PATCH JSON RFC.
    """
    OPERATION_CHOICES = (
        PatchJSONParameters.OP_REPLACE,
    )


    PATH_CHOICES = tuple(
        '/%s' % field for field in (
            UserRole.user_scope.key,
        )
    )

class CreateRolePermissionGroupParameters(PostFormParameters, schemas.BaseRolePermissionGroupSchema):

    group_name = base_fields.String(description="Example: Permission Group Name", required=True)
    group_description = base_fields.String(description="Example: Permission Group Desc.", required=True)    
    organisation_id = base_fields.Integer(description="Example: 1", required=True)
    scope = base_fields.List(base_fields.String, required=True)
    is_active = base_fields.Boolean(description="Example: True/False Default True", required=False)
    public = base_fields.Boolean(description="Example: True/False Default True", required=False)

    class Meta(schemas.BaseRolePermissionGroupSchema.Meta):
        fields = schemas.BaseRolePermissionGroupSchema.Meta.fields + (
            'group_name',
            'group_description',
            'organisation_id',
            'scope',
            'is_active',
            'public'

        )

class RolePermissionGroupofOrganisationParameters(SortPaginateParameters):

    organisation_id = base_fields.Integer(description="Example: 1", required=True)
    include_global = base_fields.Boolean(description="Example: True/False Default True", required=False)    
    
    # class Meta(schemas.BaseRolePermissionGroupSchema.Meta):
    #     fields = (
    #         'organisation_id',
    #         'include_global'
    #     )

class UserTypeForDefaultScopeParameters(PaginationParameters):

    user_scope_type = base_fields.String(description="Example: global/user", required=True)
    
