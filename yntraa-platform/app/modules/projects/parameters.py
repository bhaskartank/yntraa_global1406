# encoding: utf-8
"""
Input arguments (Parameters) for Projects resources RESTful API
-----------------------------------------------------------
"""

from flask_marshmallow import base_fields
from flask_restplus_patched import PostFormParameters, PatchJSONParameters

from . import schemas
from .models import Project, ProjectGatewayService


class CreateProjectParameters(PostFormParameters, schemas.BaseProjectSchema):
    project_meta = base_fields.List(base_fields.Raw, required=False)
    name = base_fields.String(description="Example: Project Name", required=True)
    description = base_fields.String(description="Example: Project Description", required=True)
    class Meta(schemas.BaseProjectSchema.Meta):
        fields = (
            'name',
            'description',
            'project_meta',
        )

class CreateProjectGatewayServiceParameters(PostFormParameters, schemas.BaseProjectGatewayServiceSchema):

    service_name = base_fields.String(description="Example: mysql", required=True)
    service_protocol = base_fields.String(description="Example: tcp", required=True)
    service_gw_port = base_fields.String(description="Example: 3306", required=True)
    service_destination = base_fields.String(description="Pass destination address in ip:port format. Example: 192.168.3.11:3306", required=True)
    class Meta(schemas.BaseProjectGatewayServiceSchema.Meta):
        fields = (
            'service_name',
            'service_protocol',
            'service_gw_port',
            'service_destination',
        )

class PatchProjectDetailsParameters(PatchJSONParameters):
    # pylint: disable=abstract-method,missing-docstring
    OPERATION_CHOICES = (
        PatchJSONParameters.OP_REPLACE,
    )

    PATH_CHOICES = tuple(
        '/%s' % field for field in (
            Project.name.key,
            Project.description.key,
        )
    )