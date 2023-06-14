# encoding: utf-8
"""
Serialization schemas for QuotaPackage resources RESTful API
----------------------------------------------------
"""

from flask_marshmallow import base_fields
from flask_restplus_patched import ModelSchema
from .models import ConsentData, EULA

class BaseConsentDataSchema(ModelSchema):
    """
    Base consent data schema exposes only the most general fields.
    """
    class Meta:
        # pylint: disable=missing-docstring
        model = ConsentData
        fields = (
            ConsentData.id.key,
            ConsentData.module.key,
            ConsentData.service.key,
            ConsentData.action.key,
            ConsentData.consent_text.key,
            ConsentData.priority.key,
            ConsentData.is_mandatory.key,
            ConsentData.status.key,
        )
        dump_only = (
            ConsentData.id.key,
        )

class BaseEulaSchema(ModelSchema):
    """
    Base eula schema exposes only the most general fields.
    """
    class Meta:
        # pylint: disable=missing-docstring
        model = EULA
        fields = (
            EULA.id.key,
            EULA.content.key,
            EULA.version.key,
        )