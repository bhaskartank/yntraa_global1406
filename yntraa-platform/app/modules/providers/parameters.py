# encoding: utf-8
# pylint: disable=wrong-import-order
"""
Input arguments (Parameters) for Provider resources RESTful API
-----------------------------------------------------------
"""

from flask_login import current_user
from flask_marshmallow import base_fields
from flask_restplus_patched import PostFormParameters, PatchJSONParameters
from flask_restplus_patched._http import HTTPStatus
from marshmallow import validates_schema, ValidationError

from app.extensions.api import abort
from app.modules.users import permissions
from app.modules.users.models import User
from app.extensions.api.parameters import PaginationParameters

from . import schemas
from .models import Provider, ProviderType


class AddProviderParameters(PostFormParameters, schemas.BaseProviderSchema):
    """
    New provider creation Parameters.
    """
    provider_name = base_fields.String(description="Example: Opnstack DC1", required=True)
    provider_location = base_fields.String(required=False)
    provider_description = base_fields.String(required=False)
    provider_type_id = base_fields.String(required=True)
    auth_url = base_fields.String(description="Example: https://identity.cloud.local/v3", required=True)
    username = base_fields.String(description="Example: admin", required=True)
    password = base_fields.String(description="No rules yet", required=True)
    docker_registry = base_fields.String(description="Example: registry.cloud.yntraa.com", required=False)
    identity_api_version = base_fields.Integer(description="Example: 3",required=True)
    region_name = base_fields.String(description="Example: RegionOne", required=True)
    user_domain_id = base_fields.String(description="Example: default",required=False)
    project_name = base_fields.String(description="Example: admin", required=True)
    
    recaptcha_key = base_fields.String(
        description="reCAPTCHA Key to avoid csrf",
        required=False
    )

    @validates_schema
    def validate_captcha(self, data):
        """"
        Check reCAPTCHA if necessary.

        NOTE: we remove 'recaptcha_key' from data once checked because we don't need it
        in the resource
        """
        recaptcha_key = data.pop('recaptcha_key', None)
        captcha_is_valid = False
        if not recaptcha_key:
            no_captcha_permission = permissions.AdminRolePermission()
            if no_captcha_permission.check():
                captcha_is_valid = True
        # NOTE: This hardcoded CAPTCHA key is just for demo purposes.
        elif recaptcha_key == 'secret_key':
            captcha_is_valid = True

        if not captcha_is_valid:
            abort(code=HTTPStatus.FORBIDDEN, message="CAPTCHA key is incorrect.")

class PatchProviderDetailsParameters(PatchJSONParameters):
    # pylint: disable=abstract-method,missing-docstring
    OPERATION_CHOICES = (
        PatchJSONParameters.OP_REPLACE,
    )

    PATH_CHOICES = tuple(
        '/%s' % field for field in (
            Provider.provider_name.key,
        )
    )

class AddProviderTypeParameters(PostFormParameters, schemas.BaseProviderTypeSchema):
    
    class Meta(schemas.BaseProviderTypeSchema.Meta):
        pass

class ListProvidersParamaters(PaginationParameters):
    public = base_fields.Boolean(required=False)