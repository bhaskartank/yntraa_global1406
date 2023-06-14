# encoding: utf-8
"""
Input arguments (Parameters) for Audit Trails resources RESTful API
-----------------------------------------------------------
"""

from flask_marshmallow import base_fields
from flask_restplus_patched import PostFormParameters, PatchJSONParameters
from app.extensions.api.parameters import PaginationParameters, SortPaginateParameters

from . import schemas


# class CreateAuditTrailParameters(PostFormParameters, schemas.DetailedAuditTrailSchema):

#     class Meta(schemas.DetailedAuditTrailSchema.Meta):
#         pass


class GetRecordAfterIdParameters(PaginationParameters):
    record_id = base_fields.Integer(description="Example: audit-trail record ID", required=False)

class GetAuditTrailParameters(SortPaginateParameters):
    from_date = base_fields.DateTime(description="Example: yyyy-mm-dd HH:mm:ss", required=False)
    to_date = base_fields.DateTime(description="Example: yyyy-mm-dd HH:mm:ss", required=False)
    user_id = base_fields.Integer(description="Example: user_id", required=False)
    organisation_id = base_fields.Integer(description="Example: organisation_id", required=False)
    provider_id = base_fields.Integer(description="Example: provider_id", required=False)
    project_id = base_fields.Integer(description="Example: project_id", required=False)
    resource_id = base_fields.Integer(description="Example: compute_id", required=False)
    resource_type = base_fields.String(description="Example: Compute", required=False)
    resource_name = base_fields.String(description="Example: Compute name", required=False)
    status = base_fields.String(description='Example: success/fail', required=False)
    action_method = base_fields.String(description='Example: GET/POST', required=False)

class FilterParameters(PaginationParameters):
    from_date = base_fields.DateTime(description="Example: yyyy-mm-dd HH:mm:ss", required=False)
    to_date = base_fields.DateTime(description="Example: yyyy-mm-dd HH:mm:ss", required=False)

class ActionLogFilterParameters(SortPaginateParameters):
    from_date = base_fields.DateTime(description="Example: yyyy-mm-dd HH:mm:ss", required=False)
    to_date = base_fields.DateTime(description="Example: yyyy-mm-dd HH:mm:ss", required=False)
    status = base_fields.String(description='Example: success/fail', required=False)


