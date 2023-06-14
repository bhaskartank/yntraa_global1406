# encoding: utf-8
"""
Serialization schemas for QuotaPackage resources RESTful API
----------------------------------------------------
"""

from flask_marshmallow import base_fields
from flask_restplus_patched import ModelSchema

from .models import QuotaPackage, QuotaPackageProviderMapping, ResourceTopup, ResourceTopupRequest, ResourceTopupWithdrawalRequest, OrganisationTopupMapping, ResourceTopupProviderMapping


class BaseQuotaPackageSchema(ModelSchema):
    """
    Base QuotaPackage schema exposes only the most general fields.
    """

    class Meta:
        # pylint: disable=missing-docstring
        model = QuotaPackage
        fields = (
            QuotaPackage.id.key,
            QuotaPackage.name.key,
            QuotaPackage.description.key,
            QuotaPackage.quotapackage_value.key,
            QuotaPackage.version.key,
            QuotaPackage.is_active.key,
        )
        dump_only = (
            QuotaPackage.id.key,
        )


class DetailedQuotaPackageSchema(BaseQuotaPackageSchema):
    """
    Detailed QuotaPackage schema exposes all useful fields.
    """
    created = base_fields.DateTime(format="%s", attribute="created")
    updated = base_fields.DateTime(format="%s", attribute="updated")
    class Meta(BaseQuotaPackageSchema.Meta):
        fields = BaseQuotaPackageSchema.Meta.fields + (
            QuotaPackage.user.key,
            QuotaPackage.project.key,
            QuotaPackage.vm.key,
            QuotaPackage.vcpu.key,
            QuotaPackage.ram.key,
            QuotaPackage.storage.key,
            QuotaPackage.network.key,
            QuotaPackage.subnet.key,
            QuotaPackage.port.key,
            QuotaPackage.router.key,
            QuotaPackage.security_group.key,
            QuotaPackage.security_group_rule.key,
            QuotaPackage.load_balancer.key,
            QuotaPackage.vm_snapshot.key,
            QuotaPackage.volume_snapshot.key,
            QuotaPackage.key_pair.key,
            QuotaPackage.floating_ip.key,
            QuotaPackage.public_ip.key,
            QuotaPackage.scaling_group.key,
            QuotaPackage.nks_cluster.key,
            QuotaPackage.nas_storage.key,
            QuotaPackage.version.key,
            QuotaPackage.is_active.key,
            QuotaPackage.effective_from.key,
            QuotaPackage.valid_till.key,
            QuotaPackage.created.key,
            QuotaPackage.updated.key,
        )
        dump_only = BaseQuotaPackageSchema.Meta.dump_only + (
            QuotaPackage.created.key,
            QuotaPackage.updated.key,
        )

class BaseQuotaPackageProviderMappingSchema(ModelSchema):
    """
    Base QuotaPackage Provider Mapping schema exposes only the most general fields.
    """
    #provider = base_fields.Nested('BaseProviderSchema')
    #quotapackage = base_fields.Nested('BaseQuotaPackageSchema')
    class Meta:
        # pylint: disable=missing-docstring
        model = QuotaPackageProviderMapping
        fields = (
            QuotaPackageProviderMapping.id.key,
            QuotaPackageProviderMapping.quotapackage_id.key,
            QuotaPackageProviderMapping.provider_id.key,
            QuotaPackageProviderMapping.is_public.key
        )
        dump_only = (
            QuotaPackageProviderMapping.id.key,
        )


class DetailedQuotaPackageProviderMappingSchema(BaseQuotaPackageProviderMappingSchema):
    """
    Detailed Project Provider Mapping schema exposes all useful fields.
    """
    created = base_fields.DateTime(format="%s", attribute="created")
    updated = base_fields.DateTime(format="%s", attribute="updated")
    provider = base_fields.Nested('BaseProviderSchema')
    quotapackage = base_fields.Nested('DetailedQuotaPackageSchema')
    class Meta(BaseQuotaPackageProviderMappingSchema.Meta):
        fields = BaseQuotaPackageProviderMappingSchema.Meta.fields + (
            QuotaPackageProviderMapping.quotapackage.key,
            QuotaPackageProviderMapping.provider.key,
            QuotaPackageProviderMapping.created.key,
            QuotaPackageProviderMapping.updated.key,
        )
        dump_only = BaseQuotaPackageProviderMappingSchema.Meta.dump_only + (
            QuotaPackageProviderMapping.created.key,
            QuotaPackageProviderMapping.updated.key,
        )

class BaseResourceTopupSchema(ModelSchema):
    """
    Base ResourceTopup schema exposes only the most general fields.
    """
    created = base_fields.DateTime(format="%s", attribute="created")
    updated = base_fields.DateTime(format="%s", attribute="updated")
    class Meta:
        # pylint: disable=missing-docstring
        model = ResourceTopup
        fields = (
            ResourceTopup.id.key,
            ResourceTopup.topup_item.key,
            ResourceTopup.topup_type.key,
            ResourceTopup.topup_value.key,
            ResourceTopup.public.key,
            ResourceTopup.is_active.key,
            ResourceTopup.created.key,
            ResourceTopup.updated.key,
        )

class BaseResourceTopupRequestSchema(ModelSchema):
    """
    Base ResourceTopupRequest schema exposes only the most general fields.
    """
    allocation_date = base_fields.DateTime(format="%s", attribute="allocation_date")
    created = base_fields.DateTime(format="%s", attribute="created")
    resource_topup = base_fields.Nested('BaseResourceTopupSchema', exclude=(ResourceTopup.public.key, ResourceTopup.is_active.key, ResourceTopup.created.key, ResourceTopup.updated.key))
    class Meta:
        # pylint: disable=missing-docstring
        model = ResourceTopupRequest
        fields = (
            ResourceTopupRequest.id.key,
            ResourceTopupRequest.organisation_id.key,
            ResourceTopupRequest.provider_id.key,
            ResourceTopupRequest.resource_topup_id.key,
            ResourceTopupRequest.resource_topup.key,
            ResourceTopupRequest.allocation_date.key,
            ResourceTopupRequest.requested_by.key,
            ResourceTopupRequest.allocated_by.key,
            ResourceTopupRequest.status.key,
            ResourceTopupRequest.remarks.key,
            ResourceTopupRequest.created.key,
            ResourceTopupRequest.request_id.key,
        )

class BaseResourceTopupWithdrawRequestSchema(ModelSchema):
    """
    Base ResourceTopupWithdrawRequest schema exposes only the most general fields.
    """
    withdrawal_date = base_fields.DateTime(format="%s", attribute="withdrawal_date")
    created = base_fields.DateTime(format="%s", attribute="created")
    resource_topup = base_fields.Nested('BaseResourceTopupSchema', exclude=(ResourceTopup.public.key, ResourceTopup.is_active.key, ResourceTopup.created.key, ResourceTopup.updated.key))
    class Meta:
        # pylint: disable=missing-docstring
        model = ResourceTopupWithdrawalRequest
        fields = (
            ResourceTopupWithdrawalRequest.id.key,
            ResourceTopupWithdrawalRequest.organisation_id.key,
            ResourceTopupWithdrawalRequest.provider_id.key,
            ResourceTopupWithdrawalRequest.resource_topup_id.key,
            ResourceTopupWithdrawalRequest.resource_topup.key,
            ResourceTopupWithdrawalRequest.resource_topup_request_id.key,
            ResourceTopupWithdrawalRequest.withdrawal_date.key,
            ResourceTopupWithdrawalRequest.requested_by.key,
            ResourceTopupWithdrawalRequest.approved_by.key,
            ResourceTopupWithdrawalRequest.status.key,
            ResourceTopupWithdrawalRequest.remarks.key,
            ResourceTopupWithdrawalRequest.created.key,
            ResourceTopupWithdrawalRequest.request_id.key,
        )

class BaseResourceTopupProviderMappingSchema(ModelSchema):
    """
    Base ResourceTopupProviderMapping schema exposes only the most general fields.
    """
    class Meta:
        # pylint: disable=missing-docstring
        model = ResourceTopupProviderMapping
        fields = (
            ResourceTopupProviderMapping.id.key,
            ResourceTopupProviderMapping.provider_id.key,
            ResourceTopupProviderMapping.resource_topup_id.key,
        )

class DetailedResourceTopupProviderMappingSchema(ModelSchema):
    """
    Detailed OrganisationTopupMapping schema exposes only the most general fields.
    """
    resource_topup = base_fields.Nested('BaseResourceTopupSchema')
    class Meta:
        # pylint: disable=missing-docstring
        model = ResourceTopupProviderMapping
        fields = (
            ResourceTopupProviderMapping.provider_id.key,
            ResourceTopupProviderMapping.resource_topup.key,
        )

class BaseOrganisationTopupMappingSchema(ModelSchema):
    """
    Base OrganisationTopupMapping schema exposes only the most general fields.
    """
    class Meta:
        # pylint: disable=missing-docstring
        model = OrganisationTopupMapping
        fields = (
            OrganisationTopupMapping.id.key,
            OrganisationTopupMapping.organisation_id.key,
            OrganisationTopupMapping.provider_id.key,
            OrganisationTopupMapping.resource_topup_id.key,
        )

class DetailedOrganisationTopupMappingSchema(ModelSchema):
    """
    Detailed OrganisationTopupMapping schema exposes only the most general fields.
    """
    
    resource_topup = base_fields.Nested('BaseResourceTopupSchema')
    class Meta:
        # pylint: disable=missing-docstring
        model = OrganisationTopupMapping
        fields = (
            OrganisationTopupMapping.organisation_id.key,
            OrganisationTopupMapping.provider_id.key,
            OrganisationTopupMapping.resource_topup.key,
        )