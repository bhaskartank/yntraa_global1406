# encoding: utf-8
# pylint: disable=too-few-public-methods
"""
Provider schemas
------------
"""

from flask_marshmallow import base_fields
from flask_restplus_patched import Schema, ModelSchema

from .models import Provider, ProviderType, ResourceAvailabilityZones

class BaseProviderTypeSchema(ModelSchema):
    """
    Base provider list schema exposes only the most general fields.
    """

    class Meta:
        # pylint: disable=missing-docstring
        model = ProviderType
        fields = (
            ProviderType.id.key,
            ProviderType.name.key,
            ProviderType.description.key,
        )
        dump_only = (
            ProviderType.id.key,
        )


class DetailedProviderTypeSchema(BaseProviderTypeSchema):
    """
    Detailed provider schema exposes all useful fields.
    """
    created = base_fields.DateTime(format="%s", attribute="created")
    updated = base_fields.DateTime(format="%s", attribute="updated")
    class Meta(BaseProviderTypeSchema.Meta):
        fields = BaseProviderTypeSchema.Meta.fields + (
            ProviderType.created.key,
            ProviderType.updated.key,
        )
class BaseProviderSchema(ModelSchema):
    """
    Base provider schema exposes only the most general fields.
    """
    created = base_fields.DateTime(format="%s", attribute="created")
    updated = base_fields.DateTime(format="%s", attribute="updated")
    class Meta:
        # pylint: disable=missing-docstring
        model = Provider
        fields = (
            Provider.id.key,
            Provider.provider_id.key,
            Provider.provider_name.key,
            Provider.provider_location.key,
            Provider.provider_description.key,
            Provider.created.key,
            Provider.updated.key,
            Provider.is_active.key,
            Provider.status.key,
            Provider.public.key,
            Provider.is_sso_enabled.key,
            Provider.idp_name.key,


        )
        dump_only = (
            Provider.id.key,
        )


class DetailedProviderSchema(BaseProviderSchema, BaseProviderTypeSchema):
    """
    Detailed provider schema exposes all useful fields.
    """
    provider_type = base_fields.Nested(BaseProviderTypeSchema)
    created = base_fields.DateTime(format="%s", attribute="created")
    updated = base_fields.DateTime(format="%s", attribute="updated")
    class Meta(BaseProviderSchema.Meta):
        fields = BaseProviderSchema.Meta.fields + (
            Provider.provider_type.key,
            Provider.user_domain_id.key,
            Provider.created.key,
            Provider.updated.key,
        )

class BaseResourceAvailabilityZonesSchema(ModelSchema):
    """
    Base ResourceAvailabilityZones schema exposes only the most general fields.
    """
    class Meta:
        # pylint: disable=missing-docstring
        model = ResourceAvailabilityZones
        fields = (
            ResourceAvailabilityZones.id.key,
            ResourceAvailabilityZones.provider_id.key,
            ResourceAvailabilityZones.resource_name.key,
            ResourceAvailabilityZones.zone_name.key,
            ResourceAvailabilityZones.status.key,
            ResourceAvailabilityZones.is_public.key,
            ResourceAvailabilityZones.is_default.key,
        )
        dump_only = (
            ResourceAvailabilityZones.id.key,
        )

