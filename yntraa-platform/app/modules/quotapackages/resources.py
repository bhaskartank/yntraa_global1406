# encoding: utf-8
# pylint: disable=bad-continuation
"""
RESTful API QuotaPackage resources
--------------------------
"""

import logging

from flask_login import current_user
from flask_restplus_patched import Resource
from flask_restplus_patched._http import HTTPStatus

from app.extensions import db
from app.extensions.api import Namespace, abort
from app.extensions.api.parameters import PaginationParameters
from app.modules.users import permissions
from app.modules.providers.models import Provider
from app.modules.organisations.models import Organisation, OrganisationQuotaPackage
from app.modules import RateConfig, verify_parameters, create_user_action_log, create_user_action_trails, check_scope_and_auth_token
from app.extensions.flask_limiter import ratelimit

from . import parameters, schemas
from .models import QuotaPackage, QuotaPackageProviderMapping, OrganisationTopupMapping, ResourceTopup, ResourceTopupProviderMapping
from flask import session


log = logging.getLogger(__name__)  # pylint: disable=invalid-name
api = Namespace('quotapackage', description="QuotaPackage")  # pylint: disable=invalid-name


@api.route('/')
class QuotaPackages(Resource):
    """
    Manipulations with QuotaPackage.
    """

    @create_user_action_trails(action='Get List of QuotaPackages')
    @check_scope_and_auth_token('quotapackages:read')
    @api.login_required(oauth_scopes=['quotapackages:read'])
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    @api.parameters(PaginationParameters())
    @api.response(schemas.DetailedQuotaPackageSchema(many=True))
    @api.paginate()
    def get(self, args):
        """
        List of QuotaPackage.

        Returns a list of QuotaPackage starting from ``offset`` limited by ``limit``
        parameter.
        """
        try:
            resp = QuotaPackage.query.filter_by(is_active=True)
            create_user_action_log(action='Get List of QuotaPackages',status='Success',session_uuid=session['uuid'])
            return resp
        except Exception as e:
            log.info("Exception: %s", e)
            create_user_action_log(action='Get List of QuotaPackages',status='Fail',session_uuid=session['uuid'], error_message=str(e))
            abort(
                code=HTTPStatus.NOT_FOUND,
                message="Record not found"
            )

    @create_user_action_trails(action='Create New Instance of QuotaPackage')
    @check_scope_and_auth_token('quotapackages:write')
    @api.login_required(oauth_scopes=['quotapackages:read'])
    @api.permission_required(permissions.InternalRolePermission())
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    @api.parameters(parameters.CreateQuotaPackageParameters())
    @api.response(schemas.DetailedQuotaPackageSchema())
    @api.response(code=HTTPStatus.CONFLICT)
    def post(self, args):
        """
        Create a new instance of QuotaPackage.
        """
        with api.commit_or_abort(
                db.session,
                default_error_message="Failed to create a new QuotaPackage"
            ):
            quotapackage = QuotaPackage.query.filter_by(name=args['name'], is_active=True).first()
            if quotapackage is not None:
                create_user_action_log(action='Create New Instance of QuotaPackage',status='Fail',session_uuid=session['uuid'], error_message=f"An active QuotaPackage with name {quotapackage.name} already exists of version {quotapackage.version}")
                abort(
                    code=HTTPStatus.CONFLICT,
                    message=f"An active QuotaPackage with name {quotapackage.name} already exists of version {quotapackage.version}"
                )
            quotapackages = QuotaPackage(**args)
            db.session.add(quotapackages)

        with db.session.begin():
            if 'effective_from' not in args:
                quotapackages.effective_from = quotapackages.created
                db.session.merge(quotapackages)
        create_user_action_log(action='Create New Instance of QuotaPackage',status='Success',session_uuid=session['uuid'])
        return quotapackages


@api.route('/<int:quotapackage_id>')
@api.response(
    code=HTTPStatus.NOT_FOUND,
    description="QuotaPackage not found.",
)
@api.resolve_object_by_model(QuotaPackage, 'quotapackage')
class QuotaPackageByID(Resource):
    """
    Manipulations with a specific QuotaPackage.
    """

    @create_user_action_trails(action='Get QuotaPackage details by ID')
    @check_scope_and_auth_token('quotapackages:read')
    @api.login_required(oauth_scopes=['quotapackages:read'])
    @ratelimit(rate=RateConfig.high)
    @verify_parameters()
    @api.response(schemas.DetailedQuotaPackageSchema())
    def get(self, quotapackage):
        """
        Get QuotaPackage details by ID.
        """
        create_user_action_log(action='Get QuotaPackage details by ID',status='Success',session_uuid=session['uuid'],resource_type='QuotaPackage')
        return quotapackage

    @create_user_action_trails(action='Update Instance of QuotaPackage')
    @check_scope_and_auth_token('quotapackages:write')
    @api.login_required(oauth_scopes=['quotapackages:read'])
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    @api.permission_required(permissions.InternalRolePermission())
    @api.parameters(parameters.UpdateQuotaPackageParameters())
    @api.response(schemas.DetailedQuotaPackageSchema())
    @api.response(code=HTTPStatus.CONFLICT)
    def put(self, args, quotapackage):
        """
        Update instance of QuotaPackage.
        """
        try:
            with api.commit_or_abort(
                    db.session,
                    default_error_message="Failed to update a new QuotaPackage"
                ):
                if not quotapackage.is_active:
                    create_user_action_log(action='Update Instance of QuotaPackage',status='Fail',session_uuid=session['uuid'],resource_type='QuotaPackage',error_message='Cannot update inactive Quota Package')
                    abort(
                        code=HTTPStatus.BAD_REQUEST,
                        message='Cannot update inactive Quota Package'
                    )
                for key, value in args.items():
                    if hasattr(quotapackage, key):
                        setattr(quotapackage, key, value)
                db.session.merge(quotapackage)

            create_user_action_log(action='Update Instance of QuotaPackage',status='Success',session_uuid=session['uuid'],resource_type='QuotaPackage')
            return quotapackage
        except Exception as e:
            log.info("Exception: %s", e)
            create_user_action_log(action='Update Instance of QuotaPackage',status='Fail',session_uuid=session['uuid'],resource_type='QuotaPackage')
            abort(
                code=HTTPStatus.BAD_REQUEST,
                message="%s" % e
            )


    @create_user_action_trails(action='Delete QuotaPackage by ID')
    @check_scope_and_auth_token('quotapackages:write')
    @api.login_required(oauth_scopes=['quotapackages:read'])
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    @api.permission_required(permissions.InternalRolePermission())
    @api.response(code=HTTPStatus.CONFLICT)
    @api.response(code=HTTPStatus.NO_CONTENT)
    def delete(self, quotapackage):
        """
        Delete a QuotaPackage by ID.
        """
        from datetime import datetime
        with api.commit_or_abort(
                db.session,
                default_error_message="Failed to delete the QuotaPackage."
            ):
            quotapackage.is_active = False
            quotapackage.effective_from = quotapackage.created
            quotapackage.valid_till = datetime.utcnow()
            db.session.merge(quotapackage)
            
        create_user_action_log(action='Delete QuotaPackage by ID',status='Success',session_uuid=session['uuid'],resource_type='QuotaPackage')
        return None


@api.route('/<int:quotapackage_id>/provider/')
@api.response(
    code=HTTPStatus.NOT_FOUND,
    description="QuotaPackage not found.",
)
@api.resolve_object_by_model(QuotaPackage, 'quotapackage')
class QuotaPackageProviderList(Resource):
    """
    Manipulations with a specific QuotaPackage to Provider.
    """
    @create_user_action_trails(action='Get QuotaPackage available on Providers by ID')
    @check_scope_and_auth_token('quotapackages:read')
    @api.login_required(oauth_scopes=['quotapackages:read'])
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    @api.parameters(PaginationParameters())
    @api.response(schemas.DetailedQuotaPackageProviderMappingSchema(many=True))
    def get(self, args, quotapackage):
        """
        Get QuotaPackage available on Provider List by ID.
        """
        try:
            resp = QuotaPackageProviderMapping.query.join(QuotaPackage).filter(QuotaPackageProviderMapping.quotapackage_id==quotapackage.id, QuotaPackageProviderMapping.is_public==True, QuotaPackage.is_active==True).offset(args['offset']).limit(args['limit'])
            create_user_action_log(action='Get QuotaPackage available on Providers by ID',status='Success',session_uuid=session['uuid'],resource_type='QuotaPackage')
            return resp
        except Exception as e:
            log.info("Exception: %s", e)
            create_user_action_log(action='Get QuotaPackage available on Providers by ID',status='Fail',session_uuid=session['uuid'],resource_type='QuotaPackage', error_message=str(e))
            abort(
                code=HTTPStatus.NOT_FOUND,
                message="Record not found"
            )

@api.route('/<int:provider_id>/quotapackage/')
@api.response(
    code=HTTPStatus.NOT_FOUND,
    description="Provider not found.",
)
@api.resolve_object_by_model(Provider, 'provider')
class ProviderQuotaPackageList(Resource):
    """
    Manipulations with a specific Provider to QuotaPackage.
    """
    @create_user_action_trails(action='Get QuotaPackage List available on Provider')
    @check_scope_and_auth_token('providers:read')
    @api.login_required(oauth_scopes=['providers:read'])
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    @api.parameters(PaginationParameters())
    @api.response(schemas.DetailedQuotaPackageProviderMappingSchema(many=True))
    def get(self, args, provider):
        """
        Get QuotaPackage available on Provider List by ID.
        """
        try:
            resp = QuotaPackageProviderMapping.query.join(QuotaPackage).filter(QuotaPackageProviderMapping.provider_id==provider.id, QuotaPackageProviderMapping.is_public==True, QuotaPackage.is_active==True).offset(args['offset']).limit(args['limit'])
            create_user_action_log(action='Get QuotaPackage List available on Provider',status='Success',session_uuid=session['uuid'])
            return resp
        except Exception as e:
            log.info("Exception: %s", e)
            create_user_action_log(action='Get QuotaPackage List available on Provider',status='Fail',session_uuid=session['uuid'])
            abort(
                code=HTTPStatus.NOT_FOUND,
                message="Record not found"
            )



@api.route('/<int:quotapackage_id>/provider/<int:provider_id>/')
@api.response(
    code=HTTPStatus.NOT_FOUND,
    description="QuotaPackage not found.",
)
class AttachQuotaPackageToProvider(Resource):
    """
    Manipulations with a specific QuotaPackage to Provider.
    """
    @create_user_action_trails(action='Get QuotaPackage and Provider details by ID')
    @check_scope_and_auth_token('quotapackages:read')
    @api.login_required(oauth_scopes=['quotapackages:read'])
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    @api.parameters(PaginationParameters())
    @api.response(schemas.BaseQuotaPackageProviderMappingSchema(many=True))
    def get(self, args, quotapackage_id, provider_id):
        """
        Get QuotaPackage and Provider details by ID.
        """
        try:
            resp = QuotaPackageProviderMapping.query.filter_by(quotapackage_id=quotapackage_id, provider_id=provider_id).offset(args['offset']).limit(args['limit'])
            create_user_action_log(action='Get QuotaPackage and Provider details by ID',status='Success',session_uuid=session['uuid'],resource_type='QuotaPackage')
            return resp
        except Exception as e:
            log.info("Exception: %s", e)
            create_user_action_log(action='Get QuotaPackage and Provider details by ID',status='Fail',session_uuid=session['uuid'],resource_type='QuotaPackage')
            abort(
                code=HTTPStatus.NOT_FOUND,
                message="Record not found"
            )

    @create_user_action_trails(action='Attach QuotaPackage with Provider')
    @check_scope_and_auth_token('quotapackages:read')
    @api.login_required(oauth_scopes=['quotapackages:read'])
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    @api.response(schemas.DetailedQuotaPackageProviderMappingSchema())
    @api.response(code=HTTPStatus.CONFLICT)
    def post(self, quotapackage_id, provider_id):
        """
        Attach QuotaPackage with a Provider.
        """
        try:
            with api.commit_or_abort(
                    db.session,
                    default_error_message="Failed to attach a new QuotaPackage to a Provider"
                ):

                quotapackage = QuotaPackage.query.get(quotapackage_id)
                if quotapackage is None:
                    create_user_action_log(action='Attach QuotaPackage with Provider',status='Fail',session_uuid=session['uuid'],resource_type='QuotaPackage', error_message=f"QuotaPackage with id {quotapackage_id} does not exists")
                    abort(
                        code=HTTPStatus.NOT_FOUND,
                        message="QuotaPackage with id %d does not exist" % quotapackage_id
                    )

                if not quotapackage.is_active:
                    create_user_action_log(action='Attach QuotaPackage with Provider',status='Fail',session_uuid=session['uuid'],resource_type='QuotaPackage', error_message="Selected QuotaPackage is Inactive/Deleted")
                    abort(
                        code=HTTPStatus.NOT_FOUND,
                        message="Selected QuotaPackage is Inactive/Deleted"
                    )

                provider = Provider.query.get(provider_id)
                if provider is None:
                    create_user_action_log(action='Attach QuotaPackage with Provider',status='Fail',session_uuid=session['uuid'],resource_type='QuotaPackage', error_message=f"Provider with id {provider_id} does not exists")
                    abort(
                        code=HTTPStatus.NOT_FOUND,
                        message="Provider with id %d does not exist" % provider_id
                    )

                quotapackage_provider_mapping_check = QuotaPackageProviderMapping.query.filter_by(quotapackage_id = quotapackage_id, provider_id=provider_id).one_or_none()
                if quotapackage_provider_mapping_check is None:

                    new_quotapackage_provider = QuotaPackageProviderMapping(quotapackage_id = quotapackage_id, provider_id = provider_id, is_public=True)
                    db.session.add(new_quotapackage_provider)

                    create_user_action_log(action='Attach QuotaPackage with Provider',status='Success',session_uuid=session['uuid'],resource_type='QuotaPackage')
                    return new_quotapackage_provider

                else :
                    create_user_action_log(action='Attach QuotaPackage with Provider',status='Fail',session_uuid=session['uuid'],resource_type='QuotaPackage', error_message="Provider and QuotaPackage Mapping exist")
                    abort(
                        code=HTTPStatus.NOT_FOUND,
                        message="Provider and QuotaPackage Mapping exist"
                    )
        except Exception as e:
            log.info("Exception: %s", e)
            create_user_action_log(action='Attach QuotaPackage with Provider',status='Fail',session_uuid=session['uuid'],resource_type='QuotaPackage', error_message=str(e))
            abort(
                code=HTTPStatus.BAD_REQUEST,
                message="%s" % e
            )

    @create_user_action_trails(action='Detach QuotaPackage from Provider')
    @check_scope_and_auth_token('quotapackages:write')
    @api.login_required(oauth_scopes=['quotapackages:read'])
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    @api.permission_required(permissions.InternalRolePermission())
    @api.response(code=HTTPStatus.CONFLICT)
    @api.response(code=HTTPStatus.NO_CONTENT)
    def delete(self, quotapackage_id, provider_id):
        """        
        Detach Provider ID From QuotaPackage ID.
        """
        try:
            quotapackage = QuotaPackage.query.get(quotapackage_id)
            if quotapackage is None:
                create_user_action_log(action='Detach QuotaPackage with Provider',status='Fail',session_uuid=session['uuid'],resource_type='QuotaPackage')
                abort(
                    code=HTTPStatus.NOT_FOUND,
                    message="QuotaPackage with id %d does not exist" % quotapackage_id
                )

            provider = Provider.query.get(provider_id)
            if provider is None:
                create_user_action_log(action='Detach QuotaPackage with Provider',status='Fail',session_uuid=session['uuid'],resource_type='QuotaPackage')
                abort(
                    code=HTTPStatus.NOT_FOUND,
                    message="Provider with id %d does not exist" % provider_id
                )

            quota_mapped_organisations = OrganisationQuotaPackage.query.filter(OrganisationQuotaPackage.provider_id==provider_id, OrganisationQuotaPackage.quotapackage_id==quotapackage_id).all()

            if len(quota_mapped_organisations) > 0:
                create_user_action_log(action='Detach QuotaPackage with Provider',status='Fail',session_uuid=session['uuid'],resource_type='QuotaPackage', error_message="Cannot detach QuotaPackage which is mapped to any Organisation")
                abort(
                    code=HTTPStatus.FORBIDDEN,
                    message="Cannot detach QuotaPackage which is mapped to any Organisation"
                )

            with api.commit_or_abort(
                    db.session,
                    default_error_message="Failed to detach QuotaPackage to Provider"
                ):

                quotapackage_provider_mapping_details = QuotaPackageProviderMapping.query.filter_by(quotapackage_id=quotapackage_id, provider_id=provider_id).first_or_404()
                db.session.delete(quotapackage_provider_mapping_details)

            create_user_action_log(action='Detach QuotaPackage with Provider',status='Success',session_uuid=session['uuid'],resource_type='QuotaPackage')
            return None
        except Exception as e:
            log.info("Exception: %s", e)
            create_user_action_log(action='Detach QuotaPackage with Provider',status='Fail',session_uuid=session['uuid'],resource_type='QuotaPackage', error_message=str(e))
            abort(
                code=HTTPStatus.BAD_REQUEST,
                message="%s" % e
            )

@api.route('/<int:organisation_id>/<int:provider_id>/resource_topup_details/')
@api.response(
    code=HTTPStatus.NOT_FOUND,
    description="Topup details not found.",
)
@api.resolve_object_by_model(Organisation, 'organisation')
@api.resolve_object_by_model(Provider, 'provider')
class ProviderResourceTopupMapping(Resource):
    """
    Manipulation with provider resource topup
    """

    @create_user_action_trails(action='Get List of Resource Topup')
    @check_scope_and_auth_token('quotapackages:read')
    @api.login_required(oauth_scopes=['quotapackages:read'])
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    @api.response(schemas.DetailedResourceTopupProviderMappingSchema(many=True))
    @api.paginate()
    def get(self, args, organisation, provider):
        """
        get list of all resource topup available on a provider.
        """
        
        resp = ResourceTopupProviderMapping.query.filter_by(provider_id=provider.id)
        log.info(resp)
        create_user_action_log(action='Get List of Resource Topup',status='Success',session_uuid=session['uuid'])
        return resp

@api.route('/<int:provider_id>/resource_topup_label/')
@api.response(
    code=HTTPStatus.NOT_FOUND,
    description="provider not found.",
)
@api.resolve_object_by_model(Provider, 'provider')
class ProviderResourceLabel(Resource):
    """
    Manipulation with provider resource label
    """
    @create_user_action_trails(action='Get List of Resource Provider Label')
    @check_scope_and_auth_token('quotapackages:read')
    @api.login_required(oauth_scopes=['quotapackages:read'])
    @ratelimit(rate=RateConfig.medium)
    def get(self, provider):
        """
        get list of provider resources label
        """
        provider_topup_resource = db.session.query(ResourceTopupProviderMapping.resource_topup_id).filter(ResourceTopupProviderMapping.provider_id == provider.id).all()
        resource_topup = db.session.query(ResourceTopup.topup_type).filter(ResourceTopup.id.in_(provider_topup_resource)).distinct().all()
        resource_topup_list = [resource[0] for resource in resource_topup]
        create_user_action_log(action='Get List of Resource Provider Label',status='Success',session_uuid=session['uuid'])
        return resource_topup_list

@api.route('/<int:provider_id>/resource_topup_value/')
@api.response(
    code=HTTPStatus.NOT_FOUND,
    description="provider not found.",
)
@api.resolve_object_by_model(Provider, 'provider')
class ResourceTopupValue(Resource):
    """
    Manipulation with resource topup value
    """
    @create_user_action_trails(action='Get List of resource topup values')
    @check_scope_and_auth_token('quotapackages:read')
    @api.login_required(oauth_scopes=['quotapackages:read'])
    @api.parameters(parameters.ResourceTopupValueParameters())
    @verify_parameters()
    @api.response(schemas.BaseResourceTopupSchema(many=True))
    @ratelimit(rate=RateConfig.medium)
    def get(self, args, provider):
        """
        Get list of resource topup values
        """
        provider_topup_resource = db.session.query(ResourceTopupProviderMapping.resource_topup_id).filter(ResourceTopupProviderMapping.provider_id == provider.id).all()
        resource_topup = db.session.query(ResourceTopup).filter(ResourceTopup.id.in_(provider_topup_resource)).filter(ResourceTopup.topup_type.ilike(args['topup_type']), ResourceTopup.public == True, ResourceTopup.is_active == True).all()
        create_user_action_log(action='Get List of resource topup values',status='Success',session_uuid=session['uuid'])
        return resource_topup

