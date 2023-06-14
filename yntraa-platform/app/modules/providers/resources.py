# # encoding: utf-8
# # pylint: disable=too-few-public-methods,invalid-name,bad-continuation
# """
# RESTful API Provider resources
# --------------------------
# """
# import logging
# from flask_login import current_user
# from flask_restplus_patched import Resource
# from flask_restplus_patched._http import HTTPStatus
# from app.modules.users.permissions import check_permission
# from app.extensions import db, Openstack, Docker
# from app.extensions.api import Namespace, abort
# from app.extensions.api.parameters import PaginationParameters
# from app.modules.users import permissions
# from app.modules.users.models import User
# from app.modules.compute.models import ImageInitScriptMapping, Images, Flavors
# from . import parameters, schemas
# from app.modules.compute.schemas import BaseImageSchema, BaseFlavorSchema
# from .models import Provider, ProviderType, ResourceAvailabilityZones, ServiceType, ServiceProvider
# from app.modules.organisations.models import OrganisationProjectUser, OrganisationQuotaPackage
# from app.modules import RateConfig, custom_query, verify_parameters,check_scope_and_auth_token, generate_hash_for_number, create_user_action_log, create_user_action_trails
# from app.extensions.flask_limiter import ratelimit
# from flask import session
#
# #from app.modules.compute import tasks
#
#
# log = logging.getLogger(__name__)
# api = Namespace('providers', description="Providers")
#
#
# @api.route('/')
# class Providers(Resource):
#     """
#     Manipulations with providers.
#     """
#
#     @create_user_action_trails(action='Get List of Providers')
#     @check_scope_and_auth_token('providers:read')
#     @api.login_required(oauth_scopes=['providers:read'])
#     #@api.permission_required(permissions.AdminRolePermission())
#     #@api.permission_required(permissions.InternalRolePermission())
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.parameters(parameters.ListProvidersParamaters())
#     @api.response(schemas.BaseProviderSchema(many=True))
#     @api.paginate()
#     def get(self, args):
#         """
#         List of providers.
#
#         Returns a list of providers starting from ``offset`` limited by ``limit``
#         parameter.
#         """
#         filter_args = custom_query(args)
#
#         with db.session.begin():
#             try:
#                 if filter_args:
#                     provider_list = Provider.query.filter_by(**filter_args).filter(Provider.status != 'deleted', Provider.is_active==True)
#                 else:
#                     provider_list = db.session.query(Provider).filter(Provider.status != 'deleted', Provider.is_active==True)
#                 create_user_action_log(action='Get List of Providers',status='Success',session_uuid=session['uuid'])
#                 return provider_list
#             except Exception as e:
#                 log.info("Exception: %s", e)
#                 create_user_action_log(action='Get List of Providers',status='Fail',session_uuid=session['uuid'], error_message="Record not found")
#                 abort(
#                     code=HTTPStatus.NOT_FOUND,
#                     message="Record not found"
#                 )
#
#     @create_user_action_trails(action='Create New Provider')
#     @check_scope_and_auth_token('providers:write')
#     @api.login_required(oauth_scopes=['providers:read'])
#     @ratelimit(rate=RateConfig.low)
#     #@api.permission_required(permissions.AdminRolePermission())
#     @api.permission_required(permissions.InternalRolePermission())
#     @verify_parameters()
#     @api.parameters(parameters.AddProviderParameters())
#     @api.response(schemas.DetailedProviderSchema())
#     @api.response(code=HTTPStatus.FORBIDDEN)
#     @api.response(code=HTTPStatus.CONFLICT)
#     @api.doc(id='create_provider')
#     def post(self, args):
#         """
#         Create a new provider.
#         """
#         error_msg = None
#         error_code = None
#         try:
#             with api.commit_or_abort(
#                     db.session,
#                     default_error_message="Failed to create a new provider."
#                 ):
#                 provider_name = args.pop('provider_name').lower()
#                 provider = db.session.query(Provider).filter(Provider.provider_name==provider_name, Provider.status != 'deleted').first()
#                 if provider is not None:
#                     error_msg = "Please provide different name for provider"
#                     error_code = HTTPStatus.CONFLICT
#                     create_user_action_log(action='Create New Provider',status='Fail',session_uuid=session['uuid'], error_message=error_msg)
#                     abort(
#                         code=HTTPStatus.CONFLICT,
#                         message=error_msg
#                         )
#                 new_provider = Provider(provider_name=provider_name,**args)
#                 if 'identity_api_version' in args and args['identity_api_version'] == 3:
#                     new_provider.user_domain_id = "default"
#
#                 db.session.add(new_provider)
#             with db.session.begin():
#                 if 'provider_id' not in args:
#                     provider_id = generate_hash_for_number(new_provider.id, 'provider')
#                     new_provider.provider_id = provider_id
#                     db.session.merge(new_provider)
#
#             provider_type = ProviderType.query.get(new_provider.provider_type_id)
#             _provider = globals()[provider_type.name]
#             new_provider_data = _provider.create_provider(new_provider)
#             log.info(new_provider_data)
#             with db.session.begin():
#                 for _image in new_provider_data['images']:
#                     is_active = True
#                     if _image['os'] == '' or _image['os_version'] == '' or _image['os_architecture'] == '' or _image['min_ram'] <= 0 or _image['min_disk'] <= 0 or _image['size'] <= 0 or  _image['name'] == '':
#                         is_active = False
#                     image = Images(
#                         provider_id = new_provider.id,
#                         provider_image_id = _image['id'],
#                         name = _image['name'],
#                         min_ram = _image['min_ram'],
#                         min_disk = _image['min_disk'],
#                         size = _image['size'],
#                         os = _image['os'],
#                         os_version = _image['os_version'],
#                         os_architecture = _image['os_architecture'],
#                         is_active = is_active
#                     )
#                     db.session.add(image)
#             with db.session.begin():
#                 for _flavor in new_provider_data['flavors']:
#                     flavor = Flavors(
#                         provider_id = new_provider.id,
#                         provider_flavor_id = _flavor['id'],
#                         name = _flavor['name'],
#                         ram = _flavor['ram'],
#                         vcpus = _flavor['vcpus'],
#                         disk = _flavor['disk'],
#                         weight = _flavor['weight']
#                     )
#                     db.session.add(flavor)
#             create_user_action_log(action='Create New Provider',status='Success',session_uuid=session['uuid'], resource_id=new_provider.id, resource_type="Provider", resource_name=provider_name)
#             return new_provider
#         except Exception as e:
#             log.info("Exception: %s", e)
#             create_user_action_log(action='Create New Provider',status='Fail',session_uuid=session['uuid'], error_message=str(e))
#             if error_msg is None:
#                 abort(
#                     code=HTTPStatus.BAD_REQUEST,
#                     message="%s" % e
#                 )
#             else:
#                 abort(
#                     code=error_code,
#                     message=error_msg
#                 )
#
# @api.route('/<int:provider_id>')
# @api.response(
#     code=HTTPStatus.NOT_FOUND,
#     description="Provider not found.",
# )
# @api.resolve_object_by_model(Provider, 'provider')
# class ProviderByID(Resource):
#     """
#     Manipulations with a specific provider.
#     """
#
#     @create_user_action_trails(action='Get Provider details by ID')
#     @check_scope_and_auth_token('providers:read')
#     @api.login_required(oauth_scopes=['providers:read'])
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @check_permission('providers:read')
#     @api.response(schemas.DetailedProviderSchema())
#     def get(self, provider):
#         """
#         Get provider details by ID.
#         """
#         create_user_action_log(action='Get Provider details by ID',status='Success',session_uuid=session['uuid'], resource_id=provider.id, resource_type="Provider")
#         return provider
#
#     @create_user_action_trails(action='Patch Provider details by ID')
#     @check_scope_and_auth_token('providers:write')
#     @api.login_required(oauth_scopes=['providers:read'])
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.permission_required(permissions.InternalRolePermission())
#     @api.parameters(parameters.PatchProviderDetailsParameters())
#     @api.response(schemas.DetailedProviderSchema())
#     @api.response(code=HTTPStatus.CONFLICT)
#     def patch(self, args, provider):
#         """
#         Patch provider details by ID.
#         """
#         with api.commit_or_abort(
#                 db.session,
#                 default_error_message="Failed to update provider details."
#             ):
#             parameters.PatchProviderDetailsParameters.perform_patch(args, provider)
#             db.session.merge(provider)
#
#         create_user_action_log(action='Patch Provider details by ID',status='Success',session_uuid=session['uuid'])
#         return provider
#
#     @create_user_action_trails(action='Delete Provider by ID')
#     @check_scope_and_auth_token('providers:write')
#     @api.login_required(oauth_scopes=['providers:read'])
#     @api.permission_required(permissions.InternalRolePermission())
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.response(code=HTTPStatus.CONFLICT)
#     def delete(self, provider):
#         """
#         Delete Provider by ID.
#         """
#         from app.modules.projects.models import ProjectProviderMapping
#
#         with api.commit_or_abort(
#                 db.session,
#                 default_error_message="Failed to delete provider."
#             ):
#             project_provider_mapping = ProjectProviderMapping.query.filter_by(provider_id=provider.id).first()
#             if project_provider_mapping is not None:
#                 create_user_action_log(action='Delete Provider by ID',status='Fail',session_uuid=session['uuid'], error_message="Provider is attached with one or more projects")
#                 abort(
#                     code=HTTPStatus.UNPROCESSABLE_ENTITY,
#                     message="Provider is attached with one or more projects."
#                 )
#             old_provider = Provider.query.get(provider.id)
#             old_provider.is_active = False
#             old_provider.public = False
#             old_provider.status = "deleted"
#             db.session.merge(old_provider)
#
#         create_user_action_log(action='Delete Provider by ID',status='Success',session_uuid=session['uuid'])
#         return ['provider deleted successfully.']
#
# @api.route('/type/')
# class ProviderTypes(Resource):
#     """
#     Manipulations with a specific provider list.
#     """
#     @create_user_action_trails(action='Get Provider Type details')
#     @check_scope_and_auth_token('providers:read')
#     @api.login_required(oauth_scopes=['providers:read'])
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     # @api.permission_required(permissions.AdminRolePermission())
#     @api.parameters(PaginationParameters())
#     @api.response(schemas.BaseProviderTypeSchema(many=True))
#     def get(self, args):
#         """
#         Get provider Type list details.
#         """
#
#         try:
#             resp = ProviderType.query.offset(args['offset']).limit(args['limit'])
#             create_user_action_log(action='Get Provider Type details',status='Success',session_uuid=session['uuid'])
#             return resp
#         except Exception as e:
#             log.info("Exception: %s", e)
#             create_user_action_log(action='Get Provider Type details',status='Fail',session_uuid=session['uuid'], error_message="Record not found")
#             abort(
#                 code=HTTPStatus.NOT_FOUND,
#                 message="Record not found"
#             )
#
#
#     @create_user_action_trails(action='Create New Provider Type')
#     @check_scope_and_auth_token('providers:write')
#     @api.login_required(oauth_scopes=['providers:read'])
#     # @api.permission_required(permissions.AdminRolePermission())
#     @api.permission_required(permissions.InternalRolePermission())
#     @api.parameters(parameters.AddProviderTypeParameters())
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.response(schemas.DetailedProviderTypeSchema())
#     @api.response(code=HTTPStatus.FORBIDDEN)
#     @api.response(code=HTTPStatus.CONFLICT)
#     def post(self, args):
#         """
#         Create a new provider type.
#         """
#         with api.commit_or_abort(
#                 db.session,
#                 default_error_message="Failed to create a new provider type."
#             ):
#             provider_type = ProviderType.query.filter_by(name=args['name']).first()
#             if provider_type is not None:
#                 create_user_action_log(action='Create New Provider Type',status='Fail',session_uuid=session['uuid'], error_message="Provider type name should not be same")
#                 abort(
#                     code=HTTPStatus.CONFLICT,
#                     message="Provider type name should not be same."
#                     )
#             new_provider_type = ProviderType(**args)
#             db.session.add(new_provider_type)
#         create_user_action_log(action='Create New Provider Type',status='Success',session_uuid=session['uuid'], resource_id=new_provider_type.id, resource_type="ProviderType")
#         return new_provider_type
#
#
# @api.route('/type/<int:type_id>')
# class ProviderTypeByID(Resource):
#     """
#     Manipulations with a specific provider.
#     """
#     @create_user_action_trails(action='Get Provider Type details by ID')
#     @check_scope_and_auth_token('providers:read')
#     @api.login_required(oauth_scopes=['providers:read'])
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.response(schemas.DetailedProviderTypeSchema())
#     def get(self, type_id):
#         """
#         Get provider details by ID.
#         """
#         try:
#             resp = ProviderType.query.filter_by(id=type_id).first_or_404()
#             create_user_action_log(action='Get Provider Type details by ID',status='Success',session_uuid=session['uuid'],resource_id=type_id,resource_type='ProviderType')
#             return resp
#         except Exception as e:
#             log.info("Exception: %s", e)
#             create_user_action_log(action='Get Provider Type details by ID',status='Fail',session_uuid=session['uuid'],resource_id=type_id,resource_type='ProviderType', error_message=str(e))
#             abort(
#                 code=HTTPStatus.NOT_FOUND,
#                 message="Record not found"
#             )
#
#     @create_user_action_trails(action='Delete Provider Type by ID')
#     @check_scope_and_auth_token('providers:write')
#     @api.login_required(oauth_scopes=['providers:read'])
#     @api.permission_required(permissions.InternalRolePermission())
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.response(code=HTTPStatus.CONFLICT)
#     def delete(self, type_id):
#         """
#         Delete Provider Type by type ID.
#         """
#         try:
#             with api.commit_or_abort(
#                     db.session,
#                     default_error_message="Failed to delete Volume."
#                 ):
#                 type_details = ProviderType.query.filter_by(id=type_id).first_or_404()
#                 db.session.delete(type_details)
#
#             create_user_action_log(action='Delete Provider Type by ID',status='Success',session_uuid=session['uuid'],resource_id=type_id,resource_type='ProviderType')
#             return None
#         except Exception as e:
#             log.info("Exception: %s", e)
#             create_user_action_log(action='Delete Provider Type by ID',status='Fail',session_uuid=session['uuid'],resource_id=type_id,resource_type='ProviderType', error_message=str(e))
#             abort(
#                 code=HTTPStatus.BAD_REQUEST,
#                 message="%s" % e
#             )
#
# @api.route('/<int:provider_id>/availability_zone/')
# @api.response(
#     code=HTTPStatus.NOT_FOUND,
#     description="Zone not found.",
# )
# @api.resolve_object_by_model(Provider, 'provider')
# class ProviderAvailabilityZone(Resource):
#     """
#     Manipulation with Provider availability zone details
#     """
#
#     @create_user_action_trails(action='Get availability zone details')
#     @api.login_required(oauth_scopes=['providers:read'])
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.response(schemas.BaseResourceAvailabilityZonesSchema(many=True))
#     @api.response(code=HTTPStatus.NOT_FOUND)
#     @api.paginate()
#     def get(self, args, provider):
#         """
#         get list of provider availability zone
#         """
#         provider_availability_zone = ResourceAvailabilityZones.query.filter_by(provider_id=provider.id).filter(ResourceAvailabilityZones.is_public==True)
#         create_user_action_log(action='Get availability zone details',status='Success',session_uuid=session['uuid'])
#         return provider_availability_zone
#
# @api.route('/<int:provider_id>/enabled-services/')
# @api.response(
#     code=HTTPStatus.NOT_FOUND,
#     description="Provider not found.",
# )
# @api.resolve_object_by_model(Provider, 'provider')
# class ProviderEnabledService(Resource):
#     """
#     Manipulation with Provider enabled service
#     """
#
#     @create_user_action_trails(action='Get list of enabled services')
#     @api.login_required(oauth_scopes=['providers:read'])
#     @ratelimit(rate=RateConfig.medium)
#     def get(self, provider):
#
#         service_enabled_list = []
#
#         service_types = ServiceType.query.all()
#         for service in service_types:
#             service_provider_details = ServiceProvider.query.filter_by(service_type_id=service.id, provider_id=provider.id).filter(ServiceProvider.is_active==True, ServiceProvider.is_public==True).first()
#             service_enabled = {"provider_id": provider.id}
#             service_enabled['service_name'] = service.name
#             service_enabled['service_description'] = service.description
#             if service_provider_details:
#                 service_enabled['service_provider_name'] = service_provider_details.service_provider_name
#                 service_enabled['service_provider_description'] = service_provider_details.service_provider_description
#                 service_enabled['configurable_by'] = service_provider_details.configurable_by
#                 service_enabled['is_enabled'] = True
#             else:
#                 service_enabled['is_enabled'] = False
#
#             service_enabled_list.append(service_enabled)
#         create_user_action_log(action='Get list of enabled services',status='Success',session_uuid=session['uuid'])
#         return service_enabled_list
#
