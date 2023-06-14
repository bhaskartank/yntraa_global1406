# encoding: utf-8
"""
Serialization schemas for Audit Trails resources RESTful API
----------------------------------------------------
"""

from flask_marshmallow import base_fields
from flask_restplus_patched import ModelSchema

from .models import AuditTrailLog


class BaseAuditTrailLogSchema(ModelSchema):
    """
    Base AuditTrailLog schema exposes only the most general fields.
    """

    class Meta:
        # pylint: disable=missing-docstring
            
        model = AuditTrailLog
        fields = (
            AuditTrailLog.id.key,
            AuditTrailLog.user_id.key,
            AuditTrailLog.user_name.key,
            AuditTrailLog.organisation_id.key,
            AuditTrailLog.organisation_name.key,
            AuditTrailLog.provider_id.key,
            AuditTrailLog.provider_name.key,
            AuditTrailLog.project_id.key,
            AuditTrailLog.project_name.key,
            AuditTrailLog.action.key,
            AuditTrailLog.action_url.key,
            AuditTrailLog.action_method.key,
            AuditTrailLog.status.key,
            AuditTrailLog.status_message.key,
            AuditTrailLog.resource_id.key,
            AuditTrailLog.resource_type.key,
            AuditTrailLog.resource_name.key,
            AuditTrailLog.error_message.key,

        )
        dump_only = (
            AuditTrailLog.id.key,
        )

class DetailedAuditTrailLogSchema(BaseAuditTrailLogSchema):
    """
    Detailed AuditTrail schema exposes all useful fields.
    """
    created = base_fields.DateTime(format="%s", attribute="created")
    updated = base_fields.DateTime(format="%s", attribute="updated")

    class Meta(BaseAuditTrailLogSchema.Meta):
        fields = BaseAuditTrailLogSchema.Meta.fields + (
            AuditTrailLog.created.key,
            AuditTrailLog.updated.key,
        )
        dump_only = BaseAuditTrailLogSchema.Meta.dump_only + (
            AuditTrailLog.created.key,
            AuditTrailLog.updated.key,
        )