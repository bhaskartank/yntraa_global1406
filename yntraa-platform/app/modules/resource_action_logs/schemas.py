# encoding: utf-8
"""
Serialization schemas for Resource Action Logs resources RESTful API
----------------------------------------------------
"""

from flask_marshmallow import base_fields
from flask_restplus_patched import ModelSchema

from .models import ResourceActionLog


class BaseResourceActionLogSchema(ModelSchema):
    """
    Base ResourceActionLog schema exposes only the most general fields.
    """

    class Meta:
        # pylint: disable=missing-docstring
        model = ResourceActionLog
        fields = (
            ResourceActionLog.id.key,
            ResourceActionLog.resource_type.key,
            ResourceActionLog.resource_record_id.key,
            ResourceActionLog.resource_configuration.key,
            ResourceActionLog.user_id.key,
            ResourceActionLog.project_id.key,
            ResourceActionLog.organisation_id.key,
            ResourceActionLog.provider_id.key,
        )
        dump_only = (
            ResourceActionLog.id.key,
        )


class DetailedResourceActionLogSchema(BaseResourceActionLogSchema):
    """
    Detailed ResourceActionLog schema exposes all useful fields.
    """
    created = base_fields.DateTime(format="%s", attribute="created")
    updated = base_fields.DateTime(format="%s", attribute="updated")
    
    class Meta(BaseResourceActionLogSchema.Meta):
        fields = BaseResourceActionLogSchema.Meta.fields + (
            ResourceActionLog.created.key,
            ResourceActionLog.updated.key,
        )
        dump_only = BaseResourceActionLogSchema.Meta.dump_only + (
            ResourceActionLog.created.key,
            ResourceActionLog.updated.key,
        )