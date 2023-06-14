# encoding: utf-8
"""
Input arguments (Parameters) for QuotaPackage resources RESTful API
-----------------------------------------------------------
"""

from flask_marshmallow import base_fields
from flask_restplus_patched import PostFormParameters, PatchJSONParameters, Parameters

from . import schemas
from .models import QuotaPackage


class CreateQuotaPackageParameters(PostFormParameters, schemas.DetailedQuotaPackageSchema):

    class Meta(schemas.DetailedQuotaPackageSchema.Meta):
        pass

class UpdateQuotaPackageParameters(PostFormParameters, schemas.DetailedQuotaPackageSchema):

    class Meta(schemas.DetailedQuotaPackageSchema.Meta):
        fields = (
            'name',
            'description',
            'quotapackage_value',
            'user',
            'project',
            'vm',
            'vcpu',
            'ram',
            'storage',
            'network',
            'subnet',
            'port',
            'router',
            'security_group',
            'security_group_rule',
            'load_balancer',
            'vm_snapshot',
            'volume_snapshot',
            'key_pair',
            'floating_ip',
            'public_ip',
            'scaling_group',
            'nks_cluster',
            'nas_storage'
        )

class PatchQuotaPackageDetailsParameters(PatchJSONParameters):
    # pylint: disable=abstract-method,missing-docstring
    OPERATION_CHOICES = (
        PatchJSONParameters.OP_REPLACE,
    )

    PATH_CHOICES = tuple(
        '/%s' % field for field in (
            QuotaPackage.name.key,
        )
    )

class ResourceTopupValueParameters(Parameters):
    topup_type = base_fields.String(description="Example: vm, vcpu, ram, etc.", required=True)