# encoding: utf-8
"""
Input arguments (Parameters) for Organisations resources RESTful API
-----------------------------------------------------------
"""

from flask_marshmallow import base_fields
from flask_restplus_patched import PostFormParameters, PatchJSONParameters, Parameters
from app.modules.projects.parameters import CreateProjectParameters
from app.modules.projects.schemas import BaseProjectSchema
from app.modules.users.schemas import BaseUserSchema
from app.extensions.api.parameters import PaginationParameters, SortPaginateParameters
from app.extensions.api.parameters import PaginationParameters, SortParameters
from . import schemas
from .models import Organisation

class CreateOrganisationParameters(PostFormParameters, schemas.BaseOrganisationSchema):

    class Meta(schemas.BaseOrganisationSchema.Meta):
        pass

class AttachUsersToOrganisationProjectParameters(PostFormParameters, schemas.BaseOrganisationProjectUserSchema):

    
    user_id_list = base_fields.List(base_fields.String, required=True)
    user_role = base_fields.Integer(description="Example: 1", required=False)    
    user_scope = base_fields.List(base_fields.String, required=False)
    class Meta(schemas.BaseOrganisationProjectUserSchema.Meta):
        fields = (            
            'user_id_list',
            'user_role',
            'user_scope',
        )

class DetachUsersToOrganisationProjectParameters(PostFormParameters, schemas.BaseOrganisationProjectUserSchema):

    
    user_id_list = base_fields.List(base_fields.String, required=True)
    class Meta(schemas.BaseOrganisationProjectUserSchema.Meta):
        fields = (            
            'user_id_list',
        )
class AvailableProvidersParameters(SortPaginateParameters):
    
    organisation_id = base_fields.String(description="Example: 1", required=False)


class PatchOrganisationDetailsParameters(PatchJSONParameters):
    # pylint: disable=abstract-method,missing-docstring
    OPERATION_CHOICES = (
        PatchJSONParameters.OP_REPLACE,
    )

    PATH_CHOICES = tuple(
        '/%s' % field for field in (
            Organisation.name.key,
            Organisation.description.key,
            Organisation.org_reg_code.key,
        )
    )

class InitOrganisation(PostFormParameters, schemas.DetailedOrganisationSchema, BaseProjectSchema):
    project_meta = base_fields.List(base_fields.Raw, required=False)
    project_name = base_fields.String(description="Example: Project Name", required=True)
    project_description = base_fields.String(description="Example: Project Description", required=True)
    provider_id = base_fields.Integer(description="Provider ID", required=True)
    quotapackage_id = base_fields.Integer(description="Quotapackage ID.", required=True)
    class Meta():
        fields = (
            Organisation.name.key,
            Organisation.description.key,
            Organisation.org_reg_code.key,
            'project_meta',
            'project_name',
            'project_description',
            'provider_id',
            'quotapackage_id',
        )
# class UserSchema(PostFormParameters):
#     name = base_fields.String(required=True)
#     email = base_fields.Email()
#     username = base_fields.String()
#     mobile_no = base_fields.String()

class OrganisationOnboardRequestParameters(PostFormParameters, schemas.DetailedOrganisationSchema):
    # project_meta = base_fields.List(base_fields.Raw, required=False)
    # project_name = base_fields.String(description="Example: Project Name", required=True)
    # project_description = base_fields.String(description="Example: Project Description", required=True)
    # provider_location = base_fields.String(description="Example: BHUBANESHWAR(01)", required=True)
    # quotapackage_name = base_fields.String(description="Quotapackage Like- small, mega, large, medium", required=True)
    # username = base_fields.String(description="Example: root", required=True)
    # user_details = base_fields.Raw()
    type = base_fields.String(description="Example: End User", required=True)

    class Meta():
        fields = (
            Organisation.name.key,
            # Organisation.description.key,
            Organisation.org_reg_code.key,
            Organisation.org_id.key,
            # 'project_meta',
            # 'project_name',
            # 'project_description',
            # 'provider_location',
            # 'quotapackage_name',
            'user_details',
            'type'
            # 'username',
            # 'password',
            # 'first_name',
            # 'middle_name',
            # 'last_name',
            # 'email',
            # 'mobile_no',

        )

class QuotapackageUpdate(PostFormParameters):
    quotapackage_id = base_fields.Integer(description="Quotapackage ID.", required=True)

class QuotapackageUpdateCancel(PostFormParameters):
    remarks = base_fields.String(required=False)

class ResourceTopupWithdrawParameter(PostFormParameters):
    resource_topup_id = base_fields.Integer(description="Resource Topup ID", required=True)
    resource_topup_request_id = base_fields.Integer(description="Resource Topup Request ID", required=True)

class ResourceTopupQueryParameter(SortPaginateParameters):
    provider_id = base_fields.Integer(description="Provider ID", required=False)
    organisation_id = base_fields.Integer(description="Organisation ID", required=False)
    status = base_fields.String(description="Example :pending,approved,rejected,withdrawn", required=False)

class QuotapackageUpdateQueryParameter(PaginationParameters):
    provider_id = base_fields.Integer(description="Provider ID", required=False)
    organisation_id = base_fields.Integer(description="Organisation ID", required=False)

class ResourceTopupRequestCancelParameter(Parameters):
    remarks = base_fields.String(description="remarks for cancel", required=False)

class OrganisationOnboardingRequestParameters(PaginationParameters, SortParameters):
    provider_id = base_fields.Integer(description="Provider ID", required=False)
    search = base_fields.String(description="Example: org_reg_code", required=False)
    status = base_fields.String(description='Example: pending/approved/rejected', required=False)

class BaseSubscriptionParameters(PostFormParameters):
    eula_id = base_fields.Integer(description="EULA Id", required=False)
    class Meta():
        fields = (
            'eula_id',)