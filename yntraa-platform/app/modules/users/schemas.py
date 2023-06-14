# encoding: utf-8
# pylint: disable=too-few-public-methods
"""
User schemas
------------
"""

from flask_marshmallow import base_fields
from flask_restplus_patched import Schema, ModelSchema
from app.modules.projects.schemas import DetailedProjectSchema, BaseProjectSchema
from app.modules.organisations.schemas import BaseOrganisationSchema, DetailOrganisationProjectUserSchema
from app.modules.organisations.models import OrganisationProjectUser
from .models import User

class BaseFindUserSchema(ModelSchema):
    """
    Base Find user schema exposes only the most general fields.
    """
    class Meta:
        # pylint: disable=missing-docstring
        model = User
        fields = (
            User.id.key,
            User.username.key,
            User.first_name.key,
            User.middle_name.key,
            User.last_name.key,
            User.mobile_no.key,
        )
        dump_only = (
            User.id.key,
        )

class BaseUserSchema(ModelSchema):
    """
    Base user schema exposes only the most general fields.
    """
    created = base_fields.DateTime(format="%s", attribute="created")
    updated = base_fields.DateTime(format="%s", attribute="updated")
    organisation_project_user_user = base_fields.Nested(
        'DetailOrganisationProjectUserMeSchema',
        exclude=(OrganisationProjectUser.user_id.key),
        many=True
    )
    class Meta:
        # pylint: disable=missing-docstring
        model = User
        fields = (
            User.id.key,
            User.username.key,
            User.first_name.key,
            User.middle_name.key,
            User.last_name.key,
            User.mobile_no.key,
            User.created.key,
            User.updated.key,
            User.is_active.fget.__name__,
            User.is_regular_user.fget.__name__,
            User.is_admin.fget.__name__,
            User.organisation_project_user_user.key,
        )
        dump_only = (
            User.id.key,
        )


class DetailedUserSchema(BaseUserSchema):
    """
    Detailed user schema exposes all useful fields.
    """
    organisation_project_user_user = base_fields.Nested(
        'DetailOrganisationProjectUserMeSchema',
        exclude = (OrganisationProjectUser.user_id.key),
        many=True
    )
    created = base_fields.DateTime(format="%s", attribute="created")
    updated = base_fields.DateTime(format="%s", attribute="updated")
    class Meta(BaseUserSchema.Meta):
        fields = BaseUserSchema.Meta.fields + (
            User.email.key,
            User.created.key,
            User.updated.key,
            User.organisation_project_user_user.key,
            #User.project_user.key,
            User.is_active.fget.__name__,
            User.is_regular_user.fget.__name__,
            User.is_admin.fget.__name__,
        )
        
class UserSignupFormSchema(Schema):

    recaptcha_server_key = base_fields.String(required=True)
