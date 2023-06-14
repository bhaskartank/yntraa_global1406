# encoding: utf-8
"""
Input arguments (Parameters) for Resource Action Logs resources RESTful API
-----------------------------------------------------------
"""

from flask_marshmallow import base_fields
from flask_restplus_patched import PostFormParameters, PatchJSONParameters
from app.extensions.api.parameters import PaginationParameters


from . import schemas
from .models import ResourceActionLog


class CreateResourceActionLogParameters(PostFormParameters, schemas.DetailedResourceActionLogSchema):

    class Meta(schemas.DetailedResourceActionLogSchema.Meta):
        pass

class OrganisationResourceActionLogFilterParameters(PaginationParameters):
    from_date = base_fields.Date(description="Example: yyyy-mm-dd", required=False)
    to_date = base_fields.Date(description="Example: yyyy-mm-dd", required=False)

class ResourceActionLogFilterParameters(PostFormParameters, schemas.DetailedResourceActionLogSchema):
    """
    Resource Action Log Filter parameters.
    """
    project_id = base_fields.Integer(description="Example: provider ID", required=False)
    provider_id = base_fields.Integer(description="Example: provider ID", required=False)
    resource_type = base_fields.String(description="Example: resource type", required=False)
    

class PatchResourceActionLogDetailsParameters(PatchJSONParameters):
    # pylint: disable=abstract-method,missing-docstring
    OPERATION_CHOICES = (
        PatchJSONParameters.OP_REPLACE,
    )

    PATH_CHOICES = tuple(
        '/%s' % field for field in (
            ResourceActionLog.resource_configuration.key,
        )
    )

class InsertResourceActionLogParameters(PostFormParameters):
    organisation_code = base_fields.String(required=True)
    project_code = base_fields.String(required=True)
    provider_code = base_fields.String(required=True)
    storage_size = base_fields.String(required=True)
    record_id = base_fields.Integer(required=True)
    action = base_fields.String(required=True)