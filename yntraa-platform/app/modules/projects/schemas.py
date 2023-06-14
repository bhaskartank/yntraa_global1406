# encoding: utf-8
"""
Serialization schemas for Projects resources RESTful API
----------------------------------------------------
"""

from flask_marshmallow import base_fields
from flask_restplus_patched import ModelSchema, Schema
from app.modules.organisations.schemas import DetailedOrganisationSchema, BaseOrganisationSchema
from .models import Project, ProjectProviderMapping, ProjectGatewayService, ProjectTechnologyDetails


class PaginationSchema(ModelSchema):

    total = base_fields.Integer()
    has_next = base_fields.Boolean()
    has_prev = base_fields.Boolean()
    page = base_fields.Integer()
    page_size = base_fields.Integer()


class BaseProjectProviderMappingSchema(ModelSchema):
    """
    Base Project Provider Mapping schema exposes only the most general fields.
    """
    provider = base_fields.Nested(
        'BaseProviderSchema'
    )
    class Meta:
        # pylint: disable=missing-docstring
        model = ProjectProviderMapping
        fields = (
            ProjectProviderMapping.id.key,
            ProjectProviderMapping.project_id.key,
            ProjectProviderMapping.provider_id.key,
            ProjectProviderMapping.provider_project_id.key,
            ProjectProviderMapping.gw_device_ip.key,
            ProjectProviderMapping.provider.key,
            ProjectProviderMapping.action.key,
        )
        dump_only = (
            ProjectProviderMapping.id.key,
        )
class GatewaySchema(Schema):
    """
    Base Project Provider Mapping schema exposes only the most general fields.
    """
    id = base_fields.Integer(required=True)
    project_id = base_fields.Integer(required=False) 
    provider_id = base_fields.Integer(required=False) 
    provider_project_id = base_fields.Integer(required=False) 
    gw_device_ip = base_fields.String(required=False) 
    security_group_id = base_fields.Integer(required=False) 
    created = base_fields.DateTime(format="%s", attribute="created", required=False)
    updated = base_fields.DateTime(format="%s", attribute="updated", required=False)
    snat_ip = base_fields.String(required=False)

class DetailedProjectProviderMappingSchema(BaseProjectProviderMappingSchema):
    """
    Detailed Project Provider Mapping schema exposes all useful fields.
    """
    created = base_fields.DateTime(format="%s", attribute="created")
    updated = base_fields.DateTime(format="%s", attribute="updated")
    #project_provider_compute = base_fields.Nested('DetailedGatewayComputeMappingSchema')
    class Meta(BaseProjectProviderMappingSchema.Meta):
        fields = BaseProjectProviderMappingSchema.Meta.fields + (
            ProjectProviderMapping.gw_device_id.key,
            ProjectProviderMapping.created.key,
            ProjectProviderMapping.updated.key,
        )
        dump_only = BaseProjectProviderMappingSchema.Meta.dump_only + (
            ProjectProviderMapping.created.key,
            ProjectProviderMapping.updated.key,
        )

class BaseProjectSchema(PaginationSchema):
    """
    Base Project schema exposes only the most general fields.
    """
    created = base_fields.DateTime(format="%s", attribute="created")
    updated = base_fields.DateTime(format="%s", attribute="updated")
    project_provider_mapping_project = base_fields.Nested(
        'BaseProjectProviderMappingSchema',
        exclude=(ProjectProviderMapping.provider_project_id.key, ),
        many=True
    )
    class Meta:
        # pylint: disable=missing-docstring
        model = Project
        fields = (
            Project.id.key,
            Project.project_id.key,
            Project.user_id.key,
            Project.name.key,
            Project.description.key,
            Project.organisation_id.key,
            Project.project_provider_mapping_project.key,
            Project.action.key,
            Project.task_id.key,
            Project.created.key,
            Project.updated.key,
            Project.status.key
        )
        dump_only = (
            Project.id.key,
        )


class DetailedProjectSchema(BaseProjectSchema):
    """
    Detailed Project schema exposes all useful fields.
    """
    created = base_fields.DateTime(format="%s", attribute="created")
    updated = base_fields.DateTime(format="%s", attribute="updated")
    organisation = base_fields.Nested('BaseOrganisationSchema')
    project_provider_mapping_project = base_fields.Nested(
        'BaseProjectProviderMappingSchema',
        many=True
    )
    class Meta(BaseProjectSchema.Meta):
        fields = BaseProjectSchema.Meta.fields + (
            Project.organisation.key,
            Project.project_provider_mapping_project.key,
            Project.created.key,
            Project.updated.key,
        )
        dump_only = BaseProjectSchema.Meta.dump_only + (
            Project.created.key,
            Project.updated.key,
        )

class BaseProjectGatewayServiceSchema(ModelSchema):
    """
    Base Project schema exposes only the most general fields.
    """

    class Meta:
        # pylint: disable=missing-docstring
        model = ProjectGatewayService
        fields = (
            ProjectGatewayService.id.key,
            ProjectGatewayService.provider_id.key,
            ProjectGatewayService.project_id.key,
            ProjectGatewayService.service_name.key,
            ProjectGatewayService.service_status.key,
            ProjectGatewayService.device_status.key,
        )
        dump_only = (
            ProjectGatewayService.id.key,
        )
class DetailedProjectGatewayServiceSchema(BaseProjectGatewayServiceSchema):
    """
    Detailed Project Provider Mapping schema exposes all useful fields.
    """
    created = base_fields.DateTime(format="%s", attribute="created")
    updated = base_fields.DateTime(format="%s", attribute="updated")

    class Meta(BaseProjectGatewayServiceSchema.Meta):
        fields = BaseProjectGatewayServiceSchema.Meta.fields + (
            ProjectGatewayService.service_protocol.key,
            ProjectGatewayService.service_gw_port.key,
            ProjectGatewayService.service_destination.key,
        )
        dump_only = BaseProjectGatewayServiceSchema.Meta.dump_only + (
            ProjectGatewayService.created.key,
            ProjectGatewayService.updated.key,
        )
class ProjectGatewayServiceLogSchema(Schema):
    name = base_fields.String(required=True)
    logs = base_fields.String(required=False) 


class RoutableIPSchema(Schema):

    routable_ip = base_fields.String()
    attached_with = base_fields.String()

class BaseProjectTechnologyDetailsSchema(ModelSchema):
    """
    Base Project Technology details schema exposes only the most general fields.
    """

    class Meta:
        # pylint: disable=missing-docstring
        model = ProjectTechnologyDetails
        fields = (
            ProjectTechnologyDetails.id.key,
            ProjectTechnologyDetails.technology_type.key,
            ProjectTechnologyDetails.name.key,
            ProjectTechnologyDetails.status.key,
            
        )
        dump_only = (
            ProjectGatewayService.id.key,
        )