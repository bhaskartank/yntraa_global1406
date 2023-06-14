# encoding: utf-8
"""
Serialization schemas for Organisations resources RESTful API
----------------------------------------------------
"""

from flask_marshmallow import base_fields
from flask_restplus_patched import ModelSchema
from .models import Organisation, OrganisationProjectUser, OrganisationQuotaPackage, OrganisationOnboardingRequest, OrganisationOnboardingUserRequest, QuotaPackageUpdateRequest, OrganisationZoneMapping, Subscription
from app.modules.quotapackages.schemas import BaseQuotaPackageSchema


class BaseOrganisationProjectUserSchema(ModelSchema):
    """
    Base OrganisationProjectUser schema exposes only the most general fields.
    """
    class Meta:
        # pylint: disable=missing-docstring
        model = OrganisationProjectUser
        fields = (
            OrganisationProjectUser.user_id.key,
            OrganisationProjectUser.project_id.key,
            OrganisationProjectUser.organisation_id.key
        )

class BaseOrganisationSchema(ModelSchema):
    """
    Base Organisation schema exposes only the most general fields.
    """

    class Meta:
        # pylint: disable=missing-docstring
        model = Organisation
        fields = (
            Organisation.id.key,
            Organisation.org_id.key,
            Organisation.name.key,
            Organisation.description.key,
            Organisation.org_reg_code.key,
        )
        dump_only = (
            Organisation.id.key,
        )


class DetailedOrganisationSchema(BaseOrganisationSchema, BaseOrganisationProjectUserSchema):
    """
    Detailed Organisation schema exposes all useful fields.
    """

    created = base_fields.DateTime(format="%s", attribute="created")
    updated = base_fields.DateTime(format="%s", attribute="updated")
    organisation_quotapackage_organisation = base_fields.Nested(BaseQuotaPackageSchema, many=True)
    project_organisation = base_fields.Nested('BaseProjectSchema', many=True)
    organisation_project_user_organisation = base_fields.Nested(BaseOrganisationProjectUserSchema, many=True)
    class Meta(BaseOrganisationSchema.Meta):
        fields = BaseOrganisationSchema.Meta.fields + (
            Organisation.created.key,
            Organisation.updated.key,
            Organisation.organisation_quotapackage_organisation.key,
            Organisation.project_organisation.key,
            Organisation.organisation_project_user_organisation.key,
        )
        dump_only = BaseOrganisationSchema.Meta.dump_only + (
            Organisation.created.key,
            Organisation.updated.key,
        )


class DetailOrganisationProjectUserSchema(ModelSchema):
    """
    Base OrganisationProjectUser schema exposes only the most general fields.
    """
    organisation = base_fields.Nested('BaseOrganisationSchema')
    project = base_fields.Nested('BaseProjectSchema')
    user = base_fields.Nested('BaseFindUserSchema')
    #user_roles_user = base_fields.Nested('DetailedUserRoleSchema')
    #user_roles_role_permission_group = base_fields.Nested('DetailedUserRoleSchema')
    class Meta:
        # pylint: disable=missing-docstring
        model = OrganisationProjectUser
        fields = (
            OrganisationProjectUser.user.key,
            OrganisationProjectUser.project.key,
            OrganisationProjectUser.organisation.key,
            #OrganisationProjectUser.user_roles_user.key,
        )
class OrganisationProjectUsersSchema(ModelSchema):
    class Meta:
        # pylint: disable=missing-docstring
        organisation = base_fields.Nested('BaseOrganisationSchema')
        user = base_fields.Nested('BaseUserSchema')
        project = base_fields.Nested('BaseProjectSchema')
        model = OrganisationProjectUser
        fields = (
            OrganisationProjectUser.user.key,
            OrganisationProjectUser.project.key,
            OrganisationProjectUser.organisation.key,
            #OrganisationProjectUser.user_roles_user.key,
        )

class DetailOrganisationProjectUserMeSchema(ModelSchema):
    """
    Base OrganisationProjectUser schema exposes only the most general fields.
    """
    organisation = base_fields.Nested('BaseOrganisationSchema')
    project = base_fields.Nested('BaseProjectSchema')
    #user = base_fields.Nested('BaseUserSchema')
    class Meta:
        # pylint: disable=missing-docstring
        model = OrganisationProjectUser
        fields = (
            OrganisationProjectUser.user_id.key,
            OrganisationProjectUser.project.key,
            OrganisationProjectUser.organisation.key
        )
class BaseOrganisationQuotaPackageSchema(ModelSchema):
    """
    Base Organisation QuotaPackage schema exposes only the most general fields.
    """
    #provider = base_fields.Nested('BaseProviderSchema')
    #package = base_fields.Nested('BasePackageSchema')
    class Meta:
        # pylint: disable=missing-docstring
        model = OrganisationQuotaPackage
        fields = (
            OrganisationQuotaPackage.id.key,
            OrganisationQuotaPackage.quotapackage_id.key,
            OrganisationQuotaPackage.provider_id.key,
            OrganisationQuotaPackage.organisation_id.key,
        )
        dump_only = (
            OrganisationQuotaPackage.id.key,
        )


class DetailedOrganisationQuotaPackageSchema(BaseOrganisationQuotaPackageSchema):
    """
    Detailed Organisation QuotaPackage schema exposes all useful fields.
    """
    created = base_fields.DateTime(format="%s", attribute="created")
    updated = base_fields.DateTime(format="%s", attribute="updated")
    organisation = base_fields.Nested('BaseOrganisationSchema')
    provider = base_fields.Nested('BaseProviderSchema')
    quotapackage = base_fields.Nested('BaseQuotaPackageSchema')
    class Meta(BaseOrganisationQuotaPackageSchema.Meta):
        fields = BaseOrganisationQuotaPackageSchema.Meta.fields + (
            OrganisationQuotaPackage.quotapackage.key,
            OrganisationQuotaPackage.provider.key,
            OrganisationQuotaPackage.organisation.key,
            OrganisationQuotaPackage.created.key,
            OrganisationQuotaPackage.updated.key,
        )
        dump_only = BaseOrganisationQuotaPackageSchema.Meta.dump_only + (
            OrganisationQuotaPackage.created.key,
            OrganisationQuotaPackage.updated.key,
        )

class AvailableProviderForOrganisationSchema(ModelSchema):
    """
    Base Organisation QuotaPackage schema exposes only the most general fields.
    """
    organisation = base_fields.Nested('BaseOrganisationSchema')
    provider = base_fields.Nested('BaseProviderSchema')
    quotapackage = base_fields.Nested('BaseQuotaPackageSchema')
    class Meta:
        # pylint: disable=missing-docstring
        model = OrganisationQuotaPackage
        fields = (
            OrganisationQuotaPackage.id.key,
            OrganisationQuotaPackage.quotapackage.key,
            OrganisationQuotaPackage.provider.key,
            OrganisationQuotaPackage.organisation.key,
        )
        dump_only = (
            OrganisationQuotaPackage.id.key,
        )

class BaseOrganisatonOnboardUserRequestSchema(ModelSchema):
    """
    Base Organisation Onboard  UserRequest Schema
    """
    class meta:
        model = OrganisationOnboardingUserRequest
        fields = (
            OrganisationOnboardingUserRequest.id.key,
            OrganisationOnboardingUserRequest.first_name.key,
            OrganisationOnboardingUserRequest.middle_name.key,
            OrganisationOnboardingUserRequest.last_name.key,
            OrganisationOnboardingUserRequest.username.key,
            OrganisationOnboardingUserRequest.mobile_no.key,
            OrganisationOnboardingUserRequest.organisation_onboarding_request_id.key,
            OrganisationOnboardingUserRequest.static_roles.key
        )

class BaseOrganisationOnboardRequestSchema(ModelSchema):
    """
    Base Organisation Onboard Request Schema
    """
    created = base_fields.DateTime(format="%s", attribute="created")
    updated = base_fields.DateTime(format="%s", attribute="updated")
    id = base_fields.Integer()
    name = base_fields.String()
    description = base_fields.String()
    # project_name = base_fields.String()
    org_reg_code = base_fields.String()
    provider_location = base_fields.String()
    quotapackage_name = base_fields.String()
    # project_meta = base_fields.String()
    # requested_by = base_fields.Integer()
    status = base_fields.String()
    # quotapackage = base_fields.Nested('BaseQuotaPackageSchema')
    # provider = base_fields.Nested('BaseProviderSchema')
    #organisation_onboarding_request_user = base_fields.Nested('BaseOrganisatonOnboardUserRequestSchema', many=True)
    #organisation_onboarding_request_user = base_fields.Nested('BaseOrganisationOnboardUserRequestSchema')
    class meta:
        # pylint: disable=missing-docstring
        model = OrganisationOnboardingRequest
        fields = (
            OrganisationOnboardingRequest.id.key,
            OrganisationOnboardingRequest.name.key,
            OrganisationOnboardingRequest.description.key,
            # OrganisationOnboardingRequest.project_name.key,
            # OrganisationOnboardingRequest.project_description.key,
            OrganisationOnboardingRequest.org_reg_code.key,
            OrganisationOnboardingRequest.provider_location.key,
            OrganisationOnboardingRequest.quotapackage_name.key,
            # OrganisationOnboardingRequest.project_meta.key,
            # OrganisationOnboardingRequest.requested_by.key,
            OrganisationOnboardingRequest.status.key,
            OrganisationOnboardingRequest.created.key,
            OrganisationOnboardingRequest.updated.key,

        )

class BaseQuotaPackageUpdateRequestSchema(ModelSchema):
    """
    Base QuotaPackageUpdateRequest schema exposes only the most general fields.
    """
    allocation_date = base_fields.DateTime(format="%s", attribute="allocation_date")
    class Meta:
        # pylint: disable=missing-docstring
        model = QuotaPackageUpdateRequest
        fields = (
            QuotaPackageUpdateRequest.id.key,
            QuotaPackageUpdateRequest.organisation_id.key,
            QuotaPackageUpdateRequest.provider_id.key,
            QuotaPackageUpdateRequest.quotapackage_id.key,
            QuotaPackageUpdateRequest.allocation_date.key,
            QuotaPackageUpdateRequest.requested_by.key,
            QuotaPackageUpdateRequest.allocated_by.key,
            QuotaPackageUpdateRequest.status.key,
            QuotaPackageUpdateRequest.remarks.key,
            QuotaPackageUpdateRequest.request_id.key,
        )
class DetailedQuotaPackageUpdateRequestSchema(BaseQuotaPackageUpdateRequestSchema):
    """
    Detailed QuotaPackage update request schema exposes all useful fields.
    """
    created = base_fields.DateTime(format="%s", attribute="created")
    updated = base_fields.DateTime(format="%s", attribute="updated")
    quotapackage = base_fields.Nested('BaseQuotaPackageSchema')
    provider = base_fields.Nested('BaseProviderSchema')
    class Meta(BaseQuotaPackageUpdateRequestSchema.Meta):
        fields = BaseQuotaPackageUpdateRequestSchema.Meta.fields + (
            QuotaPackageUpdateRequest.quotapackage.key,
            QuotaPackageUpdateRequest.provider.key,
            QuotaPackageUpdateRequest.created.key,
            QuotaPackageUpdateRequest.updated.key,
        )

class BaseOrganisationzoneSchema(ModelSchema):
    """
    Base OrganisationzoneSchema schema exposes only the most general fields.
    """
    class Meta:
        # pylint: disable=missing-docstring

        model = OrganisationZoneMapping
        fields = (
            OrganisationZoneMapping.id.key,
            OrganisationZoneMapping.availability_zone_id.key,
            OrganisationZoneMapping.provider_id.key,
            OrganisationZoneMapping.organisation_id.key,
            OrganisationZoneMapping.resource_name.key,
        )

class DetailedOrganisationzoneSchema(BaseOrganisationzoneSchema):
    """
    Detailed Organisationzone schema exposes all useful fields.
    """
    created = base_fields.DateTime(format="%s", attribute="created")
    updated = base_fields.DateTime(format="%s", attribute="updated")
    resource_availability_zones = base_fields.Nested('BaseResourceAvailabilityZonesSchema')
    class Meta(BaseOrganisationzoneSchema.Meta):
        fields = BaseOrganisationzoneSchema.Meta.fields + (
            OrganisationZoneMapping.created.key,
            OrganisationZoneMapping.updated.key,
            OrganisationZoneMapping.resource_availability_zones.key,
        )

class BaseSubscriptionSchema(ModelSchema):
    """
    Base Subscription Schema
    """
    created = base_fields.DateTime(format="%s", attribute="created")
    updated = base_fields.DateTime(format="%s", attribute="updated")
    class Meta:
        # pylint: disable=missing-docstring
        model = Subscription
        fields = (
            Subscription.id.key,
            Subscription.organisation_id.key,
            Subscription.provider_id.key,
            Subscription.project_id.key,
            Subscription.eula_id.key,
            Subscription.user_id.key,
        )
        dump_only = (
            Subscription.id.key,
        )