# encoding: utf-8
# pylint: disable=bad-continuation
"""
RESTful API Organisations resources
--------------------------
"""
from datetime import datetime, timedelta
import logging
from flask_login import current_user
from flask_restplus_patched import Resource
from flask_restplus_patched._http import HTTPStatus
from flask import jsonify, session
from app.extensions import db
from app.extensions.api import Namespace, abort
# from app.extensions.api.parameters import PaginationParameters
# from app.modules.users import permissions
# from app.modules.users.permissions import check_permission
# from app.modules import create_user_action_log, create_user_action_trails, sort_queryset, verify_parameters #,allocated_topup_quota_details, calculate_current_utlization_from_resource_action_logs, calcute_resource_topup, check_scope_and_auth_token, combine_calculated_log_and_cron_log, create_resource_action_log, get_organisation_resource_details_on_provider, AlchemyEncoder,  RateConfig, generate_hash_for_number, send_org_onboard_details, send_sms, custom_query, sendOrganisationServiceRequestConfirmationMail
from app.modules.resource_action_logs.models import ProviderResourceActionLog, ResourceActionLog
from app.modules.quotapackages.models import QuotaPackage, QuotaPackageProviderMapping, ResourceTopup, ResourceTopupProviderMapping, ResourceTopupRequest, OrganisationTopupMapping, ResourceTopupWithdrawalRequest
from app.modules.providers.models import Provider, ResourceAvailabilityZones
# from app.modules.projects.models import Project, ProjectMeta
# from app.modules.projects.schemas import BaseProjectSchema
from app.modules.users.models import User
# from app.modules.auth.models import OAuth2Client,OAuth2Token
from app.modules.role_permission.models import UserRole, RolePermissionGroup
# from app.extensions.flask_limiter import ratelimit
# from app.modules.quotapackages.schemas import BaseResourceTopupRequestSchema, BaseResourceTopupWithdrawRequestSchema
# from app.modules.users.schemas import BaseUserSchema
from . import parameters, schemas
# from app.modules.role_permission.schemas import DetailedUserRoleSchema, BaseUserRoleSchema
# from app.modules.utils.models import SmsTemplate
from .models import Organisation, OrganisationQuotaPackage, OrganisationOnboardingRequest #, OrganisationOnboardingUserRequest, QuotaPackageUpdateRequest, OrganisationZoneMapping, Subscription,OrganisationProjectUser
# from app.modules.projects import tasks
# import json
# import redis
# from config import BaseConfig

log = logging.getLogger(__name__)  # pylint: disable=invalid-name
api = Namespace('organisation', description="Organisation")  # pylint: disable=invalid-name

# @api.route('/')
# class Organisations(Resource):
#     """
#     +
#     Manipulations with Organisations.
#     """
#
#     @create_user_action_trails(action='Get Organisation Details')
#     @check_scope_and_auth_token('organisations:read')
#     @api.login_required(oauth_scopes=['organisations:read'])
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.parameters(PaginationParameters())
#     @api.response(schemas.DetailedOrganisationSchema(many=True))
#     def get(self, args):
#         """
#         List of Organisation.
#
#         Returns a list of Organisation starting from ``offset`` limited by ``limit``
#         parameter.
#         """
#         with db.session.begin():
#             try:
#                 organisations = db.session.query(Organisation).filter(Organisation.id > 0).all()#.offset(args['offset']).limit(args['limit'])
#                 create_user_action_log(action='Get Organisation Details',status='Success',session_uuid=session['uuid'], resource_type='Organisation')
#                 return organisations
#             except Exception as e:
#                 create_user_action_log(action='Get Organisation Details',status='Fail',session_uuid=session['uuid'], resource_type='Organisation', error_message=str(e))
#                 log.info("Exception: %s", e)
#                 abort(
#                     code=HTTPStatus.NOT_FOUND,
#                     message="Record not found"
#                 )
#         #return Organisation.query.offset(args['offset']).limit(args['limit'])
#
#     @create_user_action_trails(action='Create Organisation Instance')
#     @check_scope_and_auth_token('organisations:write')
#     @api.login_required(oauth_scopes=['organisations:read'])
#     @api.permission_required(permissions.InternalRolePermission())
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.parameters(parameters.CreateOrganisationParameters())
#     @api.response(schemas.DetailedOrganisationSchema())
#     @api.response(code=HTTPStatus.CONFLICT)
#     def post(self, args):
#         """
#         Create a new instance of Organisation.
#         """
#         with api.commit_or_abort(
#                 db.session,
#                 default_error_message="Failed to create a new Organisation"
#             ):
#             name = args.pop('name').lower()
#             organisation = Organisation.query.filter_by(name=name).first()
#             if organisation is not None:
#                 create_user_action_log(action='Create Organisation Instance',status='Fail',session_uuid=session['uuid'], resource_type='Organisation', error_message="Organisation already exist")
#                 abort(
#                     code=HTTPStatus.CONFLICT,
#                     message="organisation with name '{}' already exist.".format(name)
#                 )
#             organisation = Organisation(name=name, **args)
#             db.session.add(organisation)
#
#         with db.session.begin():
#             org_id = generate_hash_for_number(organisation.id, 'organisation')
#             organisation.org_id = org_id
#             db.session.merge(organisation)
#
#         create_user_action_log(action='Create Organisation Instance',status='Success',session_uuid=session['uuid'], resource_type='Organisation')
#         log.info(organisation)
#         return organisation
#
#
# @api.route('/<int:organisation_id>')
# @api.response(
#     code=HTTPStatus.NOT_FOUND,
#     description="Organisation not found.",
# )
# @api.resolve_object_by_model(Organisation, 'organisation')
# class OrganisationByID(Resource):
#     """
#     Manipulations with a specific Organisation.
#     """
#
#     @create_user_action_trails(action='Get Organisation Details by ID')
#     @check_scope_and_auth_token('organisations:read')
#     @api.login_required(oauth_scopes=['organisations:read'])
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.response(schemas.DetailedOrganisationSchema())
#     def get(self, organisation):
#         """
#         Get Organisation details by ID.
#         """
#         create_user_action_log(action='Get Organisation Details by ID',status='Success',session_uuid=session['uuid'], resource_type='Organisation', resource_name=organisation.name)
#         return organisation
#
#     @create_user_action_trails(action='Patch Organisation Details')
#     @check_scope_and_auth_token('organisations:write')
#     @api.login_required(oauth_scopes=['organisations:read'])
#     @api.permission_required(permissions.InternalRolePermission())
#     @api.parameters(parameters.PatchOrganisationDetailsParameters())
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.response(schemas.DetailedOrganisationSchema())
#     @api.response(code=HTTPStatus.CONFLICT)
#     def patch(self, args, organisation):
#         """
#         Patch Organisation details by ID.
#         """
#
#         with api.commit_or_abort(
#                 db.session,
#                 default_error_message="Failed to update Organisation details."
#             ):
#             parameters.PatchOrganisationDetailsParameters.perform_patch(args, obj=organisation)
#             db.session.merge(organisation)
#         create_user_action_log(action='Patch Organisation Details',status='Success',session_uuid=session['uuid'], resource_type='Organisation', resource_name=organisation.name)
#         return organisation
#
#     @create_user_action_trails(action='Delete Organisation')
#     @check_scope_and_auth_token('organisations:write')
#     @api.login_required(oauth_scopes=['organisations:read'])
#     @api.permission_required(permissions.InternalRolePermission())
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.response(code=HTTPStatus.CONFLICT)
#     @api.response(code=HTTPStatus.NO_CONTENT)
#     def delete(self, organisation):
#         """
#         Delete a Organisation by ID.
#         """
#         with api.commit_or_abort(
#                 db.session,
#                 default_error_message="Failed to delete the Organisation."
#             ):
#             db.session.delete(organisation)
#         create_user_action_log(action='Delete Organisation',status='Success',session_uuid=session['uuid'], resource_type='Organisation', resource_name=organisation.name)
#         return None
#
# @api.route('/<int:organisation_id>/userlist/')
# @api.response(
#     code=HTTPStatus.NOT_FOUND,
#     description="organisation not found.",
# )
# @api.resolve_object_by_model(Organisation, 'organisation')
# class OrganisationUserList(Resource):
#     """
#     Manipulations with a specific Organisation Project Users.
#     """
#
#     @create_user_action_trails(action='Get User List by Organisation ID')
#     @check_scope_and_auth_token('organisations:read')
#     @api.login_required(oauth_scopes=['organisations:read'])
#     @api.permission_required(permissions.AdminRolePermission())
#     @api.parameters(PaginationParameters())
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.response(schemas.DetailOrganisationProjectUserSchema(many=True))
#     def get(self,args, organisation):
#         """
#         Get User List by Organisation ID.
#         """
#         #if current_user.is_admin:
#         organisation_id = organisation.id
#
#         try:
#             organisation_user_list = db.session.query(OrganisationProjectUser).filter_by(organisation_id=organisation_id).distinct(OrganisationProjectUser.user_id).all()
#             create_user_action_log(action='Get User List by Organisation ID',status='Success',session_uuid=session['uuid'], resource_type='Organisation')
#             return organisation_user_list
#         except Exception as e:
#             log.info("Exception: %s", e)
#             create_user_action_log(action='Get User List by Organisation ID',status='Fail',session_uuid=session['uuid'], resource_type='Organisation', error_message=str(e))
#             abort(
#                 code=HTTPStatus.NOT_FOUND,
#                 message="Record not found"
#             )
#         # else:
#         #     organisation_user_list = db.session.query(OrganisationProjectUser).filter_by(
#         #         organisation_id=organisation_id,user_id=current_user.id).distinct(OrganisationProjectUser.user_id).all()
#         #     if
#
# @api.route('/<int:organisation_id>/<int:project_id>/userlist/')
# @api.response(
#     code=HTTPStatus.NOT_FOUND,
#     description="userlist not found.",
# )
# @api.resolve_object_by_model(Organisation, 'organisation')
# @api.resolve_object_by_model(Project, 'project')
# class OrganisationProjectUserList(Resource):
#     """
#     Manipulations with a specific Organisation Project Users.
#     """
#
#     @create_user_action_trails(action='Get User List by Organisation ID and Project ID')
#     @check_scope_and_auth_token('organisations:read')
#     @api.login_required(oauth_scopes=['organisations:read'])
#     #@check_permission('organisations:read')
#     #@api.permission_required(permissions.AdminRolePermission())
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.parameters(PaginationParameters())
#     @api.response(BaseUserRoleSchema(many=True))
#     def get(self,args, organisation, project):
#         """
#         Get User List by Organisation ID and Project ID.
#         """
#         organisation_id = organisation.id
#         project_id = project.id
#         if current_user.is_admin or current_user.is_internal:
#             organisation_project_user_list = db.session.query(UserRole).filter_by(organisation_id=organisation_id, project_id=project_id).all()
#             create_user_action_log(action='Get User List by Organisation ID and Project ID',status='Success',session_uuid=session['uuid'])
#             return organisation_project_user_list
#         else:
#             organisation_project_user = db.session.query(UserRole).filter_by(
#                 organisation_id=organisation_id, project_id=project_id,user_id=current_user.id).first()
#             if organisation_project_user is not None:
#                 organisation_project_user_list = db.session.query(UserRole).filter_by(
#                     organisation_id=organisation_id, project_id=project_id).all()
#                 create_user_action_log(action='Get User List by Organisation ID and Project ID',status='Success',session_uuid=session['uuid'])
#                 return organisation_project_user_list
#             else:
#                 create_user_action_log(action='Get User List by Organisation ID and Project ID',status='Fail',session_uuid=session['uuid'])
#                 abort(
#                     code=HTTPStatus.NOT_FOUND,
#                     message="Resource not found"
#                 )
#
#
# @api.route('/<int:organisation_id>/<int:project_id>/user')
# @api.response(
#     code=HTTPStatus.NOT_FOUND,
#     description="user not found.",
# )
# @api.resolve_object_by_model(Organisation, 'organisation')
# @api.resolve_object_by_model(Project, 'project')
# class OrganisationProjectUserDetails(Resource):
#     """
#     Manipulations with a specific Organisation and Project User.
#     """
#
#     @create_user_action_trails(action='Get User Details by Organisation ID and Project ID')
#     @check_scope_and_auth_token('organisations:read')
#     @api.login_required(oauth_scopes=['organisations:read'])
#     # @check_permission('organisations:read')
#     @api.permission_required(permissions.AdminRolePermission())
#     @api.parameters(PaginationParameters())
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.response(schemas.DetailOrganisationProjectUserSchema(many=True))
#     def get(self,args, organisation, project):
#         """
#         Get User Details by Organisation ID and Project ID.
#         """
#
#         try:
#             resp = OrganisationProjectUser.query.filter_by(organisation_id=organisation.id, project_id=project.id).offset(args['offset']).limit(args['limit']).all()
#             create_user_action_log(action='Get User Details by Organisation ID and Project ID',status='Success',session_uuid=session['uuid'],resource_type="Organisation",resource_name=organisation.name)
#             return resp
#         except Exception as e:
#             log.info("Exception: %s", e)
#             create_user_action_log(action='Get User Details by Organisation ID and Project ID',status='Fail',session_uuid=session['uuid'], resource_name=organisation.name, resource_type="Organisation", error_message=str(e))
#             abort(
#                 code=HTTPStatus.NOT_FOUND,
#                 message="Record not found"
#             )
#
#     @create_user_action_trails(action="Attach User with Organisation's Project")
#     @check_scope_and_auth_token('users:write')
#     @api.login_required(oauth_scopes=['users:read'])
#     @api.permission_required(permissions.AdminRolePermission())
#     # @api.response(schemas.DetailOrganisationProjectUserSchema())
#     @api.parameters(parameters.AttachUsersToOrganisationProjectParameters())
#     @ratelimit(rate=RateConfig.low)
#     @verify_parameters()
#     @api.response(code=HTTPStatus.CONFLICT)
#     def post(self, args, organisation, project):
#         """
#         Attach User with an Organisation's Project.
#         """
#
#         organisation_id = organisation.id
#         project_id = project.id
#         staus_message = []
#         with api.commit_or_abort(
#                 db.session,
#                 default_error_message="Failed to attach a new User to an Organisation"
#             ):
#
#             organisation = Organisation.query.get(organisation_id)
#             if organisation is None:
#                 create_user_action_log(action="Attach User with Organisation's Project",status='Fail',session_uuid=session['uuid'], error_message="Organisation does not exist")
#                 abort(
#                     code=HTTPStatus.NOT_FOUND,
#                     message="Organisation with id %d does not exist" % organisation_id
#                 )
#
#             organisation_project_details = Project.query.filter_by(organisation_id=organisation_id, id=project_id).one_or_none()
#             if organisation_project_details is None:
#                 create_user_action_log(action="Attach User with Organisation's Project",status='Fail',session_uuid=session['uuid'],resource_name=organisation.name,resource_type='Organisation', error_message="Project doesn't belongs to Organisation")
#                 abort(
#                     code=HTTPStatus.NOT_FOUND,
#                     message="Project ID Doesn't Belongs to Organisation %d " % organisation_id
#                 )
#             if organisation_project_details.status == 'Deleted':
#                 create_user_action_log(action="Attach User with Organisation's Project",status='Fail',session_uuid=session['uuid'],resource_name=organisation.name,resource_type='Organisation', error_message="Project has been deleted")
#                 abort(
#                     code=HTTPStatus.NOT_FOUND,
#                     message="Project has been deleted"
#                 )
#
#             logged_in_user_id = current_user.id
#             is_organisation_user = OrganisationProjectUser.query.filter_by(organisation_id=organisation_id, user_id=logged_in_user_id).first()
#             if not is_organisation_user:
#                 create_user_action_log(action="Attach User with Organisation's Project",status='Fail',session_uuid=session['uuid'],resource_name=organisation.name,resource_type='Organisation', error_message="logged in user is not associated with organisation")
#                 abort(
#                     code=HTTPStatus.FORBIDDEN,
#                     message="logged in user is not associated with organisation"
#                 )
#
#             user_role = None
#             user_scope = None
#             if 'user_role' in args :
#                 user_role = args['user_role']
#
#                 role_details = RolePermissionGroup.query.get(user_role)
#                 if role_details is None:
#                     create_user_action_log(action="Attach User with Organisation's Project",status='Fail',session_uuid=session['uuid'],resource_name=organisation.name, resource_type="Organisation", error_message="Role does not exist")
#                     abort(
#                         code=HTTPStatus.NOT_FOUND,
#                         message="Role with id %d does not exist" % user_role
#                     )
#             if 'user_scope' in args :
#                 user_scope = list(args['user_scope'])
#
#             user_id_list = args['user_id_list']
#             #user_id_list = user_id_argument_data.split(",")
#             while len(user_id_list) > 0 :
#                 user_id_from_list = user_id_list.pop()
#
#                 user = User.query.get(user_id_from_list)
#                 if user is None:
#                     create_user_action_log(action="Attach User with Organisation's Project",status='Fail',session_uuid=session['uuid'], resource_name=organisation.name, resource_type="Organisation", error_message="User does not exist")
#                     log.info("User with ID %s doesn't  exist" % user_id_from_list)
#                     message = 'User with ID '+user_id_from_list+' does not exist'
#                     staus_message.append(message)
#                 else :
#                     organisation_project_user_check = OrganisationProjectUser.query.filter_by(organisation_id = organisation_id, project_id=project_id, user_id = user_id_from_list).one_or_none()
#
#                     if organisation_project_user_check is not None:
#                         create_user_action_log(action="Attach User with Organisation's Project",status='Fail',session_uuid=session['uuid'], resource_name=organisation.name, resource_type="Organisation", error_message="User already mapped")
#                         log.info("User already mapped with this Organisation's Project")
#                         message = 'User '+user_id_from_list+' already mapped with this Organisation\'s Project'
#                         staus_message.append(message)
#                     else :
#                         only_organisation_user = db.session.query(OrganisationProjectUser).filter(OrganisationProjectUser.organisation_id==organisation_id, OrganisationProjectUser.user_id==user_id_from_list, OrganisationProjectUser.project_id==None).first()
#                         if only_organisation_user:
#                             only_organisation_user.project_id=project_id
#                             db.session.merge(only_organisation_user)
#                         else:
#                             new_organisation_project_user = OrganisationProjectUser(organisation_id = organisation_id, project_id=project_id, user_id = user_id_from_list)
#                             db.session.add(new_organisation_project_user)
#
#                         create_user_action_log(action="Attach User with Organisation's Project",status='Success',session_uuid=session['uuid'], resource_name=organisation.name, resource_type="Organisation")
#                         log.info("User successfully mapped with this Organisation's Project")
#                         message = 'User '+user_id_from_list+' successfully mapped with this Organisation\'s Project'
#                         staus_message.append(message)
#
#                         user_role_details = UserRole.query.filter_by(user_id=user_id_from_list, project_id=project_id,
#                                                                     organisation_id=organisation_id).one_or_none()
#                         if user_role_details is None:
#                             new_user_role_scope = UserRole(user_id=user_id_from_list, project_id=project_id, organisation_id = organisation_id, user_role=user_role, user_scope=user_scope)
#                             db.session.add(new_user_role_scope)
#                             create_user_action_log(action="Attach User with Organisation's Project",status='Success',session_uuid=session['uuid'], resource_name=organisation.name, resource_type="User", resource_id=organisation_project_details.id)
#                             log.info("User\'s' %s Role and Scope successfully mapped for this Organisation's Project" % user.email)
#                             message = 'User\'s '+user.email+' Role and Scope successfully mapped for this Organisation\'s ' +organisation.name+' Project '+organisation_project_details.name
#                             staus_message.append(message)
#                         else:
#                             create_user_action_log(action="Attach User with Organisation's Project",status='Fail',session_uuid=session['uuid'], resource_name=organisation.name, resource_type="User", error_message="User already mapped", resource_id=organisation_project_details.id)
#                             log.info("User already mapped with this Organisation's Project")
#                             message = 'User ' + user_id_from_list + ' has already Role permission with this Organisation\'s Project'
#                             staus_message.append(message)
#
#         return staus_message
#
#     @create_user_action_trails(action="Update User Role and Scope From Organisation's Project")
#     @check_scope_and_auth_token('users:write')
#     @api.login_required(oauth_scopes=['users:read'])
#     @api.permission_required(permissions.AdminRolePermission())
#     @api.parameters(parameters.AttachUsersToOrganisationProjectParameters())
#     @ratelimit(rate=RateConfig.low)
#     @verify_parameters()
#     @api.response(code=HTTPStatus.CONFLICT)
#     def put(self, args, organisation, project):
#         """
#         Update User Role and Scope From Organisation's Project.
#         """
#
#         organisation_id = organisation.id
#         project_id = project.id
#         staus_message = []
#         with api.commit_or_abort(
#                 db.session,
#                 default_error_message="Failed to Update User to an Organisation's Project"
#             ):
#             organisation = Organisation.query.get(organisation_id)
#             if organisation is None:
#                 create_user_action_log(action="Update User Role and Scope From Organisation's Project",status='Fail',session_uuid=session['uuid'], error_message="Organisation does not exist")
#                 abort(
#                     code=HTTPStatus.NOT_FOUND,
#                     message="Organisation with id %d does not exist" % organisation_id
#                 )
#
#             organisation_project_details = Project.query.filter_by(organisation_id=organisation_id, id=project_id).one_or_none()
#             if organisation_project_details is None:
#                 create_user_action_log(action="Update User Role and Scope From Organisation's Project",status='Fail',session_uuid=session['uuid'], error_message="Project doesn't belongs to Organisation")
#                 abort(
#                     code=HTTPStatus.NOT_FOUND,
#                     message="Project ID Doesn't Belongs to Organisation %d " % organisation_id
#                 )
#
#
#             user_role = None
#             user_scope = None
#             if 'user_role' in args :
#                 user_role = args['user_role']
#
#                 role_details = RolePermissionGroup.query.get(user_role)
#                 if role_details is None:
#                     create_user_action_log(action="Update User Role and Scope From Organisation's Project",status='Fail',session_uuid=session['uuid'], error_message="Role doesn't exist")
#                     abort(
#                         code=HTTPStatus.NOT_FOUND,
#                         message="Role with id %d does not exist" % user_role
#                     )
#             if 'user_scope' in args :
#                 user_scope = list(args['user_scope'])
#
#             user_id_list = args['user_id_list']
#
#             while len(user_id_list) > 0 :
#                 user_id_from_list = user_id_list.pop()
#
#                 user = User.query.get(user_id_from_list)
#                 if user is None:
#                     log.info("User with ID %s doesn't  exist" % user_id_from_list)
#                     message = 'User with ID '+user_id_from_list+' does not exist'
#                     staus_message.append(message)
#                     create_user_action_log(action="Update User Role and Scope From Organisation's Project",status='Fail',session_uuid=session['uuid'])
#                 else :
#                     organisation_project_user_check = OrganisationProjectUser.query.filter_by(organisation_id = organisation_id, project_id=project_id, user_id = user_id_from_list).one_or_none()
#
#                     if organisation_project_user_check is None:
#                         log.info("User, Project, and Organisation %d relation doesn't exist" % organisation_id)
#                         message = 'User '+user.username+' , Project, and Organisation relation doesn\'t exist'
#                         staus_message.append(message)
#                         create_user_action_log(action="Update User Role and Scope From Organisation's Project",status='Fail',session_uuid=session['uuid'])
#                     else :
#
#                         user_role_scope_check = UserRole.query.filter_by(user_id=user_id_from_list, project_id=project_id, organisation_id = organisation_id).one_or_none()
#                         if user_role_scope_check is None:
#                             log.info("User, Project, and Organisation %d permissions doesn't exist" % organisation_id)
#                             message = 'User '+user.username+' , Project '+organisation_project_details.name+', and Organisation '+organisation.name+' relation doesn\'t exist'
#                             staus_message.append(message)
#                             create_user_action_log(action="Update User Role and Scope From Organisation's Project",status='Fail',session_uuid=session['uuid'])
#                         else :
#                             user_role_scope_check.user_scope = user_scope
#                             user_role_scope_check.user_role = user_role
#                             db.session.merge(user_role_scope_check)
#                             log.info("User's Role and Permissions successfully updated with this Organisation's Project")
#                             message = 'User\'s '+user.username+'  Role and Permissions successfully updated from Organisation  '+organisation.name+' and Project  '+organisation.name
#                             staus_message.append(message)
#                             create_user_action_log(action="Update User Role and Scope From Organisation's Project",status='Success',session_uuid=session['uuid'])
#
#         return staus_message
#
# @api.route('/<int:organisation_id>/<int:project_id>/user/detach')
# @api.response(
#     code=HTTPStatus.NOT_FOUND,
#     description="user not found.",
# )
# @api.resolve_object_by_model(Organisation, 'organisation')
# @api.resolve_object_by_model(Project, 'project')
# class OrganisationProjectUserDetach(Resource):
#
#     @create_user_action_trails(action="Detach User ID From Organisation's Project")
#     @check_scope_and_auth_token('users:write')
#     @api.login_required(oauth_scopes=['users:read'])
#     #@api.permission_required(permissions.WriteAccessPermission())
#     @api.permission_required(permissions.AdminRolePermission())
#     @api.parameters(parameters.DetachUsersToOrganisationProjectParameters())
#     @api.response(code=HTTPStatus.CONFLICT)
#     @ratelimit(rate=RateConfig.low)
#     @verify_parameters()
#     @api.response(code=HTTPStatus.NO_CONTENT)
#     def post(self, args, organisation, project):
#         """
#         Detach User ID From Organisation's Project.
#         """
#         organisation_id = organisation.id
#         project_id = project.id
#         staus_message = []
#         with api.commit_or_abort(
#                 db.session,
#                 default_error_message="Failed to detach User to an Organisation's Project"
#             ):
#             organisation = Organisation.query.get(organisation_id)
#             if organisation is None:
#                 create_user_action_log(action="Detach User ID From Organisation's Project",status='Fail',session_uuid=session['uuid'], resource_name=organisation.name, resource_type="Organisation", error_message="Organisation does not exist")
#                 abort(
#                     code=HTTPStatus.NOT_FOUND,
#                     message="Organisation with id %d does not exist" % organisation_id
#                 )
#
#             organisation_project_details = Project.query.filter_by(organisation_id=organisation_id, id=project_id).one_or_none()
#             if organisation_project_details is None:
#                 create_user_action_log(action="Detach User ID From Organisation's Project",status='Fail',session_uuid=session['uuid'], resource_name=organisation.name, resource_type="Organisation", error_message="Project doesn't belongs to Organisation")
#                 abort(
#                     code=HTTPStatus.NOT_FOUND,
#                     message="Project ID Doesn't Belongs to Organisation %d " % organisation_id
#                 )
#             if organisation_project_details.status == 'Deleted':
#                 create_user_action_log(action="Detach User ID From Organisation's Project",status='Fail',session_uuid=session['uuid'], resource_name=organisation.name, resource_type="Organisation", error_message="Project has been deleted")
#                 abort(
#                     code=HTTPStatus.NOT_FOUND,
#                     message="Project has been deleted"
#                 )
#
#             user_id_list = args['user_id_list']
#
#             while len(user_id_list) > 0 :
#                 user_id_from_list = user_id_list.pop()
#
#                 user = User.query.get(user_id_from_list)
#                 if user is None:
#                     message = 'User with ID '+user_id_from_list+' does not exist'
#                     staus_message.append(message)
#                     create_user_action_log(action="Detach User ID From Organisation's Project",status='Fail',session_uuid=session['uuid'], resource_name=organisation.name, resource_type="Organisation", error_message="User does not exist")
#                 else :
#                     organisation_project_user_check = OrganisationProjectUser.query.filter_by(organisation_id = organisation_id, project_id=project_id, user_id = user_id_from_list).one_or_none()
#
#                     if organisation_project_user_check is None:
#                         log.info("User, Project, and Organisation %d relation doesn't exist" % organisation_id)
#                         message = 'User '+user.username+' , Project, and Organisation relation doesn\'t exist'
#                         staus_message.append(message)
#                         create_user_action_log(action="Detach User ID From Organisation's Project",status='Fail',session_uuid=session['uuid'], resource_name=organisation.name, resource_type="Organisation", error_message="Mapping does not exist")
#                     else :
#                         organisation_project_user_check.project_id = None
#                         db.session.merge(organisation_project_user_check)
#                         log.info("User successfully detached with this Organisation's Project")
#                         message = 'User '+user.username+' successfully detached with this Organisation\'s Project'
#                         staus_message.append(message)
#                         create_user_action_log(action="Detach User ID From Organisation's Project",status='Success',session_uuid=session['uuid'], resource_name=organisation.name, resource_type="Organisation")
#
#                     user_role_scope_check = UserRole.query.filter_by(user_id=user_id_from_list, project_id=project_id, organisation_id = organisation_id).one_or_none()
#                     if user_role_scope_check is None:
#                         log.info("User, Project, and Organisation %d permissions doesn't exist" % organisation_id)
#                         message = 'User '+user.username+' , Project '+organisation_project_details.name+', and Organisation '+organisation.name+' relation doesn\'t exist'
#                         staus_message.append(message)
#                         create_user_action_log(action="Detach User ID From Organisation's Project",status='Fail',session_uuid=session['uuid'], resource_name=organisation.name, resource_type="User", error_message="Mapping does not exist", resource_id=organisation_project_details.id)
#                     else :
#                         db.session.delete(user_role_scope_check)
#                         log.info("User's Role and Permissions successfully deleted with this Organisation's Project")
#                         message = 'User\'s '+user.username+'  Role and Permissions successfully deleted from Organisation  '+organisation.name+' and Project  '+organisation.name
#                         staus_message.append(message)
#                         create_user_action_log(action="Detach User ID From Organisation's Project",status='Success',session_uuid=session['uuid'], resource_name=organisation.name, resource_type="User", resource_id=organisation_project_details.id)
#
#         return staus_message
#
# @api.route('/<int:organisation_id>/quotapackage/')
# @api.response(
#     code=HTTPStatus.NOT_FOUND,
#     description="organisation not found.",
# )
# @api.resolve_object_by_model(Organisation, 'organisation')
# class OrganisationQuotaPackageList(Resource):
#     """
#     Manipulations with a specific QuotaPackage to Organisation.
#     """
#
#     @create_user_action_trails(action="Get Quotapackage details by Organisation ID")
#     @check_scope_and_auth_token('quotapackages:read')
#     @api.login_required(oauth_scopes=['quotapackages:read'])
#     #@api.parameters(PaginationParameters())
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.response(schemas.DetailedOrganisationQuotaPackageSchema(many=True))
#     @api.paginate()
#     def get(self, args, organisation):
#         """
#         Get QuotaPackage details by Organisation ID.
#         """
#
#         try:
#             resp = OrganisationQuotaPackage.query.filter_by(organisation_id=organisation.id)
#             create_user_action_log(action='Get Quotapackage details by Organisation ID',status='Success',session_uuid=session['uuid'])
#             return resp
#         except Exception as e:
#             log.info("Exception: %s", e)
#             create_user_action_log(action='Get Quotapackage details by Organisation ID',status='Fail',session_uuid=session['uuid'])
#             abort(
#                 code=HTTPStatus.NOT_FOUND,
#                 message="Record not found"
#             )
#
# @api.route('/<int:organisation_id>/<int:provider_id>/quotapackage/')
# @api.response(
#     code=HTTPStatus.NOT_FOUND,
#     description="QuotaPackage not found.",
# )
# @api.resolve_object_by_model(Organisation, 'organisation')
# @api.resolve_object_by_model(Provider, 'provider')
# class OrganisationQuotaPackageByProviderID(Resource):
#     """
#     Manipulations with a specific QuotaPackage to Organisation for a Provider.
#     """
#
#     @create_user_action_trails(action="Get Quotapackage details by Organisation ID and Provider ID")
#     @check_scope_and_auth_token('quotapackages:read')
#     @api.login_required(oauth_scopes=['quotapackages:read'])
#     @api.parameters(PaginationParameters())
#     @api.response(schemas.DetailedOrganisationQuotaPackageSchema(many=True))
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     def get(self, args, organisation, provider):
#         """
#         Get QuotaPackage details by Organisation ID and Provider ID.
#         """
#
#         try:
#             resp = OrganisationQuotaPackage.query.filter_by(organisation_id=organisation.id, provider_id=provider.id).offset(args['offset']).limit(args['limit'])
#             create_user_action_log(action='Get Quotapackage details by Organisation ID and Provider ID',status='Success',session_uuid=session['uuid'])
#             return resp
#         except Exception as e:
#             log.info("Exception: %s", e)
#             create_user_action_log(action='Get Quotapackage details by Organisation ID and Provider ID',status='Fail',session_uuid=session['uuid'])
#             abort(
#                 code=HTTPStatus.NOT_FOUND,
#                 message="Record not found"
#             )
#
#
# @api.route('/<int:organisation_id>/<int:provider_id>/<int:quotapackage_id>/')
# @api.response(
#     code=HTTPStatus.NOT_FOUND,
#     description="QuotaPackage not found.",
# )
# @api.resolve_object_by_model(Organisation, 'organisation')
# @api.resolve_object_by_model(Provider, 'provider')
# @api.resolve_object_by_model(QuotaPackage, 'quotapackage')
# class QuotaPackageToOrganisation(Resource):
#     """
#     Manipulations with a specific QuotaPackage to Organisation.
#     """
#
#     @create_user_action_trails(action="Get Quotapackage details by Organisation ID and Provider ID")
#     @check_scope_and_auth_token('quotapackages:read')
#     @api.login_required(oauth_scopes=['quotapackages:read'])
#     @api.parameters(PaginationParameters())
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.response(schemas.BaseOrganisationQuotaPackageSchema(many=True))
#     def get(self, args, organisation, provider, quotapackage):
#         """
#         Get QuotaPackage and Provider details by Organisation ID.
#         """
#
#         try:
#             resp = OrganisationQuotaPackage.query.filter_by(organisation_id=organisation.id, provider_id=provider.id, quotapackage_id=quotapackage.id).offset(args['offset']).limit(args['limit'])
#             create_user_action_log(action='Get Quotapackage details by Organisation ID and Provider ID',status='Success',session_uuid=session['uuid'],resource_type='QuotaPackage')
#             return resp
#         except Exception as e:
#             log.info("Exception: %s", e)
#             create_user_action_log(action='Get Quotapackage details by Organisation ID and Provider ID',status='Fail',session_uuid=session['uuid'],resource_type='QuotaPackage')
#             abort(
#                 code=HTTPStatus.NOT_FOUND,
#                 message="Record not found"
#             )
#
#     @create_user_action_trails(action="Set Quotapackage to an Organisation")
#     @check_scope_and_auth_token('quotapackages:read')
#     @api.login_required(oauth_scopes=['quotapackages:read'])
#     @api.response(schemas.DetailedOrganisationQuotaPackageSchema())
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.response(code=HTTPStatus.CONFLICT)
#     def post(self, organisation, provider, quotapackage):
#         """
#         Set QuotaPackage to an Organisation.
#         """
#         organisation_id = organisation.id
#         provider_id = provider.id
#         quotapackage_id = quotapackage.id
#         with api.commit_or_abort(
#                 db.session,
#                 default_error_message="Failed to set a new QuotaPackage to an Organisation"
#             ):
#             # quotapackage = QuotaPackage.query.get(quotapackage_id)
#             # if quotapackage is None:
#             #     abort(
#             #         code=HTTPStatus.NOT_FOUND,
#             #         message="QuotaPackage with id %d does not exist" % quotapackage_id
#             #     )
#
#             # provider = Provider.query.get(provider_id)
#             # if provider is None:
#             #     abort(
#             #         code=HTTPStatus.NOT_FOUND,
#             #         message="Provider with id %d does not exist" % provider_id
#             #     )
#
#             # organisation = Organisation.query.get(organisation_id)
#             # if organisation is None:
#             #     abort(
#             #         code=HTTPStatus.NOT_FOUND,
#             #         message="Organisation with id %d does not exist" % organisation_id
#             #     )
#
#             if not quotapackage.is_active:
#                 create_user_action_log(action="Set Quotapackage to an Organisation",status='Fail',session_uuid=session['uuid'],resource_type='QuotaPackage', error_message='Selected QuotaPackage is Inactive/Deleted')
#                 abort(
#                     code=HTTPStatus.BAD_REQUEST,
#                     message='Selected QuotaPackage is Inactive/Deleted'
#                 )
#
#             is_quota_provider_mapped = QuotaPackageProviderMapping.query.filter(QuotaPackageProviderMapping.provider_id==provider.id, QuotaPackageProviderMapping.quotapackage_id==quotapackage.id, QuotaPackageProviderMapping.is_public==True).one_or_none()
#             if not is_quota_provider_mapped:
#                 create_user_action_log(action="Set Quotapackage to an Organisation",status='Fail',session_uuid=session['uuid'],resource_type='QuotaPackage', error_message='Selected QuotaPackage is not mapped with Provider')
#                 abort(
#                     code=HTTPStatus.BAD_REQUEST,
#                     message='Selected QuotaPackage is not mapped with Provider'
#                 )
#
#             organisation_quotapackage_mapping_check = OrganisationQuotaPackage.query.filter_by(provider_id=provider_id, organisation_id=organisation_id).one_or_none()
#             if organisation_quotapackage_mapping_check is None:
#
#                 new_organisation_quotapackage = OrganisationQuotaPackage(quotapackage_id = quotapackage_id, provider_id=provider_id, organisation_id=organisation_id)
#                 db.session.add(new_organisation_quotapackage)
#                 create_user_action_log(action="Set Quotapackage to an Organisation",status='Success',session_uuid=session['uuid'],resource_type='QuotaPackage')
#                 return new_organisation_quotapackage
#
#             else :
#                 create_user_action_log(action="Set Quotapackage to an Organisation",status='Fail',session_uuid=session['uuid'],resource_type='QuotaPackage', error_message="QuotaPackage with Organisation for this Provider is already mapped")
#                 abort(
#                     code=HTTPStatus.NOT_FOUND,
#                     message="QuotaPackage with Organisation for this Provider is already mapped. You may Update QuotaPackage."
#                 )
#
#     @create_user_action_trails(action="Detach QuotaPackage From Organisation for a Provider")
#     @check_scope_and_auth_token('quotapackages:write')
#     @api.login_required(oauth_scopes=['quotapackages:read'])
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.response(code=HTTPStatus.CONFLICT)
#     @api.response(code=HTTPStatus.NO_CONTENT)
#     def delete(self, organisation, provider, quotapackage):
#         """
#         Detach QuotaPackage From Organisation for a Provider.
#         """
#         organisation_id = organisation.id
#         provider_id = provider.id
#         quotapackage_id = quotapackage.id
#
#         # quotapackage = QuotaPackage.query.get(quotapackage_id)
#         # if quotapackage is None:
#         #     abort(
#         #         code=HTTPStatus.NOT_FOUND,
#         #         message="QuotaPackage with id %d does not exist" % quotapackage_id
#         #     )
#
#         # provider = Provider.query.get(provider_id)
#         # if provider is None:
#         #     abort(
#         #         code=HTTPStatus.NOT_FOUND,
#         #         message="Provider with id %d does not exist" % provider_id
#         #     )
#
#         # organisation = Organisation.query.get(organisation_id)
#         # if organisation is None:
#         #     abort(
#         #         code=HTTPStatus.NOT_FOUND,
#         #         message="Organisation with id %d does not exist" % organisation_id
#         #     )
#
#         with api.commit_or_abort(
#                 db.session,
#                 default_error_message="Failed to detach QuotaPackage From Organisation for a Provider"
#             ):
#
#             organisation_quotapackage_details = OrganisationQuotaPackage.query.filter_by(quotapackage_id = quotapackage_id, provider_id=provider_id, organisation_id=organisation_id).first_or_404()
#             db.session.delete(organisation_quotapackage_details)
#
#         create_user_action_log(action="Detach QuotaPackage From Organisation for a Provider",status='Success',session_uuid=session['uuid'],resource_type='QuotaPackage')
#         return None
#
#     @create_user_action_trails(action="Put QuotaPackage and Provider details by Organisation ID")
#     @check_scope_and_auth_token('quotapackages:read')
#     @api.login_required(oauth_scopes=['quotapackages:read'])
#     @api.parameters(PaginationParameters())
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.response(schemas.BaseOrganisationQuotaPackageSchema())
#     def put(self, args, organisation, provider, quotapackage):
#         """
#         Put QuotaPackage and Provider details by Organisation ID.
#         """
#
#         organisation_id = organisation.id
#         provider_id = provider.id
#         quotapackage_id = quotapackage.id
#         with api.commit_or_abort(
#                 db.session,
#                 default_error_message="Failed to update QuotaPackage From Organisation for a Provider"
#             ):
#
#             # quotapackage = QuotaPackage.query.get(quotapackage_id)
#             # if quotapackage is None:
#             #     abort(
#             #         code=HTTPStatus.NOT_FOUND,
#             #         message="QuotaPackage with id %d does not exist" % quotapackage_id
#             #     )
#             # provider = Provider.query.get(provider_id)
#             # if provider is None:
#             #     abort(
#             #         code=HTTPStatus.NOT_FOUND,
#             #         message="Provider with id %d does not exist" % provider_id
#             #     )
#
#             # organisation = Organisation.query.get(organisation_id)
#             # if organisation is None:
#             #     abort(
#             #         code=HTTPStatus.NOT_FOUND,
#             #         message="Organisation with id %d does not exist" % organisation_id
#             #     )
#
#             if not quotapackage.is_active:
#                 create_user_action_log(action="Put QuotaPackage and Provider details by Organisation ID",status='Fail',session_uuid=session['uuid'],resource_type='QuotaPackage',error_message='Selected QuotaPackage is Inactive/Deleted')
#                 abort(
#                     code=HTTPStatus.BAD_REQUEST,
#                     message='Selected QuotaPackage is Inactive/Deleted'
#                 )
#
#             is_quota_provider_mapped = QuotaPackageProviderMapping.query.filter(QuotaPackageProviderMapping.provider_id==provider.id, QuotaPackageProviderMapping.quotapackage_id==quotapackage.id, QuotaPackageProviderMapping.is_public==True).one_or_none()
#             if not is_quota_provider_mapped:
#                 create_user_action_log(action="Put QuotaPackage and Provider details by Organisation ID",status='Fail',session_uuid=session['uuid'],resource_type='QuotaPackage',error_message='Selected QuotaPackage is not mapped with Provider')
#                 abort(
#                     code=HTTPStatus.BAD_REQUEST,
#                     message='Selected QuotaPackage is not mapped with Provider'
#                 )
#
#             organisation_quotapackage_mapping = OrganisationQuotaPackage.query.filter_by(provider_id=provider_id, organisation_id=organisation_id).one_or_none()
#             if organisation_quotapackage_mapping is not None:
#
#                 #if organisation_quotapackage_mapping.quotapackage_id > quotapackage_id:
#                 compute_resource_log = ResourceActionLog.query.filter_by(organisation_id = organisation_id, provider_id=provider_id).all()
#                 resource_data = calculate_current_utlization_from_resource_action_logs(organisation_id, provider_id, compute_resource_log)
#                 quotapackage_data = json.dumps(quotapackage, cls=AlchemyEncoder)
#                 error_msg = None
#                 for resource, value in json.loads(quotapackage_data).items():
#
#                     if '_' in resource:
#                         column = resource.replace('_', '')
#                     else:
#                         column = resource
#                     try:
#                         consumed_value = resource_data[column]['consumed']['value']
#                         log.info("resource ======>>>> %s", column)
#                         log.info("consumed ======>>>> %s", consumed_value)
#                         log.info("Selected package value ===========>>> %s", value)
#                         if int(consumed_value) > int(value):
#                             error_msg = "Resource {} already consumed more than requested quotapackage.".format(resource)
#                             create_user_action_log(action="Put QuotaPackage and Provider details by Organisation ID",status='Fail',session_uuid=session['uuid'],resource_type='QuotaPackage', error_message=error_msg)
#                             abort(
#                                 code=HTTPStatus.BAD_REQUEST,
#                                 message="Resource {} already consumed more than requested quotapackage.".format(resource)
#                                 )
#
#                     except Exception as e:
#                         log.info("Exception -------->> %s", e)
#                         create_user_action_log(action="Put QuotaPackage and Provider details by Organisation ID",status='Fail',session_uuid=session['uuid'],resource_type='QuotaPackage', error_message=str(e))
#                         if error_msg:
#                             abort(
#                                 code=HTTPStatus.BAD_REQUEST,
#                                 message=error_msg
#                                 )
#                         else:
#                             pass
#
#
#
#                 organisation_quotapackage_mapping.quotapackage_id = quotapackage_id
#                 db.session.merge(organisation_quotapackage_mapping)
#                 create_user_action_log(action="Put QuotaPackage and Provider details by Organisation ID",status='Success',session_uuid=session['uuid'],resource_type='QuotaPackage')
#                 return organisation_quotapackage_mapping
#
#             else :
#                 create_user_action_log(action="Put QuotaPackage and Provider details by Organisation ID",status='Fail',session_uuid=session['uuid'],resource_type='QuotaPackage', error_message="QuotaPackage with Organisation for this Provider does not exit.")
#                 abort(
#                     code=HTTPStatus.NOT_FOUND,
#                     message="QuotaPackage with Organisation for this Provider does not exit."
#                 )
#
#
# @api.route('/available_providers')
# class AvailableProviderForOrganisation(Resource):
#     """
#     Get Provider list of an organisation
#     """
#
#     @create_user_action_trails(action="Get available Provider list of organisation")
#     @check_scope_and_auth_token('organisations:read')
#     @api.login_required(oauth_scopes=['organisations:read'])
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.parameters(parameters.AvailableProvidersParameters())
#     @api.response(schemas.AvailableProviderForOrganisationSchema(many=True))
#     @api.paginate()
#     @api.sort()
#     def get(self, args):
#         """
#         Get available provider list  of organisation
#         """
#         with api.commit_or_abort(
#                 db.session,
#                 default_error_message="Failed to fetch provider list."
#             ):
#             org_ids = list()
#             if 'organisation_id' in args :
#                 organisation_id = args.pop('organisation_id')
#                 organisation = Organisation.query.get(organisation_id)
#                 if organisation is None:
#                     create_user_action_log(action="Get available Provider list of organisation",status='Fail',session_uuid=session['uuid'], error_message="Organisation doesn't exist")
#                     abort(
#                         code=HTTPStatus.NOT_FOUND,
#                         message=("Organisation doesn't exist with this ID :{}").format(organisation_id)
#                     )
#                 org_ids.append(organisation_id)
#             else :
#                 organisation_project_details = db.session.query(OrganisationProjectUser).filter(OrganisationProjectUser.user_id==current_user.id).distinct(OrganisationProjectUser.organisation_id).all()
#                 for data in organisation_project_details:
#                     org_ids.append(data.organisation_id)
#
#             if len(org_ids) > 0:
#                 org_ids = tuple(org_ids)
#                 create_user_action_log(action="Get available Provider list of organisation",status='Success',session_uuid=session['uuid'])
#                 return db.session.query(OrganisationQuotaPackage).join(Provider).filter(OrganisationQuotaPackage.organisation_id.in_(org_ids)).filter(Provider.is_active==True)
#
#             else:
#                 create_user_action_log(action="Get available Provider list of organisation",status='Fail',session_uuid=session['uuid'], error_message="Provider not exist for this organisation.")
#                 abort(
#                     code=HTTPStatus.NOT_FOUND,
#                     message="Provider not exist for this organisation."
#                 )



# @api.route('/update_organisation_id/')
# class UpdateOrganisationId(Resource):
#     """
#     Manipulations with a organisation to auto update organisation_id.
#     """

#     @api.login_required(oauth_scopes=['organisations:read'])
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.response(schemas.BaseOrganisationSchema(many=True))
#     def get(self):
#         """
#         update organisation_id of a organisation.
#         """

#         organisation_list = Organisation.query.all()

#         for organisation in organisation_list:
#             with db.session.begin():
#                 organisation_id = generate_hash_for_number(organisation.id, 'organisation')
#                 organisation.org_id = organisation_id
#                 db.session.merge(organisation)

#         return organisation_list

#
# @api.route('/init_organisation/')
# class InitOrganisation(Resource):
#     """
#     Onboard an Organisation
#     """
#
#     @create_user_action_trails(action="Onboard Organisation")
#     @check_scope_and_auth_token('organisations:write')
#     @api.login_required(oauth_scopes=['organisations:read'])
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.parameters(parameters.InitOrganisation())
#     @api.response(schemas.DetailedOrganisationSchema())
#     @api.response(code=HTTPStatus.CONFLICT)
#     def post(self, args):
#         """
#         onboard organisation
#         """
#         log.info(args)
#         staus_message = []
#         meta = ''
#         with db.session.begin():
#             name = args['name'].lower()
#             organisation = Organisation.query.filter_by(name=name).first()
#             if organisation is not None:
#                 create_user_action_log(action="Onboard Organisation",status='Fail',session_uuid=session['uuid'], error_message="organisation already exist.")
#                 abort(
#                     code=HTTPStatus.CONFLICT,
#                     message="organisation with name '{}' already exist.".format(name)
#                 )
#             description = args['description']
#             org_reg_code = args['org_reg_code']
#             project_name = args['project_name']
#             project_description = args['project_description']
#             provider_id = args['provider_id']
#             quotapackage_id = args['quotapackage_id']
#             organisation  = Organisation(name=name, description=description, org_reg_code=org_reg_code)
#             db.session.add(organisation)
#             staus_message.append("Organisation successfully created")
#             user = User.query.get(current_user.id)
#             if 'project_meta' in args:
#                 meta = args.pop('project_meta')
#                 for val in meta:
#                     if ':' not in val:
#                         create_user_action_log(action="Onboard Organisation",status='Fail',session_uuid=session['uuid'], error_message="Invalid parameter. Meta value should be in 'key:value' format.")
#                         # error_msg = "Invalid parameter. Meta value should be in 'key:value' format."
#                         # error_code = HTTPStatus.UNPROCESSABLE_ENTITY
#                         abort(
#                             code=HTTPStatus.UNPROCESSABLE_ENTITY,
#                             message="Invalid parameter. Meta value should be in 'key:value' format."
#                         )
#
#         with db.session.begin():
#             org_id = generate_hash_for_number(organisation.id, 'organisation')
#             organisation.org_id = org_id
#             db.session.merge(organisation)
#
#             project = Project(name=project_name, organisation=organisation, user=user, description=project_description)
#             db.session.add(project)
#             staus_message.append("Project successfully created.")
#         create_user_action_log(action="Onboard Organisation",status='Success',session_uuid=session['uuid'])
#         with db.session.begin():
#             project_id = generate_hash_for_number(project.id, 'project')
#             project.project_id = project_id
#             db.session.merge(project)
#             create_resource_action_log(db,
#                                        resource_type='project',
#                                        resource_record_id=project.id,
#                                        action='created',
#                                        resource_configuration='Project Created',
#                                        user_id=current_user.id,
#                                        project_id=project.id,
#                                        organisation_id=organisation.id,
#                                        provider_id=0
#                                        )
#
#             new_organisation_quotapackage = OrganisationQuotaPackage(quotapackage_id=quotapackage_id,
#                                                                      provider_id=provider_id,
#                                                                      organisation_id=organisation.id)
#             db.session.add(new_organisation_quotapackage)
#             staus_message.append("Quotapackage successfully assinged with Organisation.")
#         create_user_action_log(action="Onboard Organisation",status='Success',session_uuid=session['uuid'])
#
#         with db.session.begin():
#             for val in meta:
#                 meta_dict = val.split(':')
#                 key = meta_dict[0]
#                 value = meta_dict[1]
#                 project_meta = ProjectMeta(project=project, meta_label=str(key), meta_value=str(value))
#                 db.session.add(project_meta)
#
#         return organisation


@api.route('/organisation-onboarding-request/')
class CreateOrganisationOnboardingRequest(Resource):
    """
    Manipulation with organisation onboarding request
    """

    # @create_user_action_trails(action='Get Organisation Onboarding Request List')
    @api.login_required(oauth_scopes=['organisations:read'])
    # @ratelimit(rate=RateConfig.medium)
    # @verify_parameters()
    @api.parameters(parameters.OrganisationOnboardingRequestParameters())
    @api.response(schemas.BaseOrganisationOnboardRequestSchema(many=True))
    @api.paginate()
    # @sort_queryset(OrganisationOnboardingRequest)
    def get(self, args):
        """
        get list of all requested Organisation onboard
        """
        import sqlalchemy
        from sqlalchemy import or_

        search_data = ''
        if 'search' in args:
            search_data = args.pop('search')

        if current_user.is_internal == False:
            provider_list = getProviderList('organisations:read', current_user.id)

            provider_location = Provider.query.with_entities(Provider.provider_location).filter(
                Provider.id.in_(provider_list))
            location_list = []
            for provider in set(provider_location):
                location_list.append(provider.provider_location)

        if current_user.is_internal == True:
            resp = OrganisationOnboardingRequest.query.filter(
                or_(OrganisationOnboardingRequest.name.ilike('%' + search_data + '%'),
                    OrganisationOnboardingRequest.description.ilike('%' + search_data + '%'),
                    OrganisationOnboardingRequest.org_reg_code.ilike('%' + search_data + '%'),
                    OrganisationOnboardingRequest.project_name.ilike('%' + search_data + '%'),
                    OrganisationOnboardingRequest.project_description.ilike('%' + search_data + '%')))
        else:
            resp = OrganisationOnboardingRequest.query.filter(
                OrganisationOnboardingRequest.provider_location.in_(location_list)).filter(
                or_(OrganisationOnboardingRequest.name.ilike('%' + search_data + '%'),
                    OrganisationOnboardingRequest.description.ilike('%' + search_data + '%'),
                    OrganisationOnboardingRequest.org_reg_code.ilike('%' + search_data + '%'),
                    OrganisationOnboardingRequest.project_name.ilike('%' + search_data + '%'),
                    OrganisationOnboardingRequest.project_description.ilike('%' + search_data + '%')))

        if 'status' in args:
            status = args.get('status')
            resp = resp.filter(OrganisationOnboardingRequest.status.ilike(status))
        else:
            resp = resp.order_by(sqlalchemy.sql.expression.case(((OrganisationOnboardingRequest.status == "pending", 1),
                                                                 (
                                                                 OrganisationOnboardingRequest.status == "approved", 2),
                                                                 (OrganisationOnboardingRequest.status == "rejected",
                                                                  3))))

        # create_user_action_log(action='Get Organisation Onboarding Request List', status='Success',
        #                        session_uuid=session['uuid'], resource_type="Organisation")
        return resp

    # @create_user_action_trails(action='Create Organisation Onboarding Request')
    # # @api.login_required(oauth_scopes=['organisations:read'])
    # @api.parameters(parameters.OrganisationOnboardRequestParameters())
    # @api.response(schemas.BaseOrganisationOnboardRequestSchema())
    # @api.response(code=HTTPStatus.CONFLICT)
    # def post(self, args):
    #     """
    #     organisation onboard request
    #     """
    #     provider = Provider.query.filter_by(default=True).first()
    #     if not provider:
    #         create_user_action_log(action='Create Organisation Onboarding Request', status='Fail',
    #                                session_uuid=session['uuid'], resource_type="Organisation",
    #                                error_message="No Default Provider found")
    #         abort(
    #             code=HTTPStatus.UNPROCESSABLE_ENTITY,
    #             message="No Default Provider found"
    #         )
    #     quotapackage = QuotaPackage.query.filter_by(default=True).first()
    #     if not quotapackage:
    #         create_user_action_log(action='Create Organisation Onboarding Request', status='Fail',
    #                                session_uuid=session['uuid'], resource_type="Organisation",
    #                                error_message="No Default Quotapackage found")
    #         abort(
    #             code=HTTPStatus.UNPROCESSABLE_ENTITY,
    #             message="No Default Quotapackage found"
    #         )
    #     # if 'project_meta' in args:
    #     #     meta = args['project_meta']
    #     #     for val in meta:
    #     #         if ':' not in val:
    #     #             create_user_action_log(action='Create Organisation Onboarding Request',status='Fail',session_uuid=session['uuid'], resource_type="Organisation", error_message="Invalid parameter, Meta value should be in key:value format")
    #     #             abort(
    #     #                 code=HTTPStatus.UNPROCESSABLE_ENTITY,
    #     #                 message="Invalid parameter. Meta value should be in 'key:value' format."
    #     #             )
    #     # if current_user.is_internal == False :
    #     #     # provider_list = getProviderList('organisations:read',current_user.id), ""
    #     #     provider_list = getProviderList('organisations:read',current_user.id)
    #     # provider_location = Provider.query.with_entities(Provider.provider_location).filter(Provider.id.in_(provider_list))
    #     # location_list = []
    #     # for provider in set(provider_location) :
    #     #     location_list.append(provider.provider_location)
    #     #
    #     # if args['provider_location'] not in location_list :
    #     #     args['provider_location'] = Provider.query.filter_by(default=True).first().provider_location
    #     #     create_user_action_log(action='Create Organisation Onboarding Request',status='Fail',session_uuid=session['uuid'],resource_type="Organisation",error_message="You don't have the permission to access the requested resource.")
    #     #     abort(
    #     #             code=HTTPStatus.FORBIDDEN,
    #     #             message="You don't have the permission to access the requested resource."
    #     #         )
    #
    #     # quotapackage_name = args.pop('quotapackage_name')
    #     # if quotapackage_name is not None:
    #     #     with db.session.begin():
    #     #         qoutapackage = db.session.query(QuotaPackage).filter(QuotaPackage.name.ilike(quotapackage_name), QuotaPackage.is_active==True).first()
    #     #         if qoutapackage:
    #     #             quotapackage_id = qoutapackage.id
    #     #         else:
    #     #             create_user_action_log(action='Create Organisation Onboarding Request',status='Fail',session_uuid=session['uuid'],resource_type="Organisation",error_message="Invalid value for quotapackage")
    #     #             abort(
    #     #                 code=HTTPStatus.BAD_REQUEST,
    #     #                 message="Invalid value for quotapackage"
    #     #             )
    #     # else:
    #     #     create_user_action_log(action='Create Organisation Onboarding Request',status='Fail',session_uuid=session['uuid'],resource_type="Organisation",error_message="No value for quotapackage")
    #     #     abort(
    #     #         code=HTTPStatus.BAD_REQUEST,
    #     #         message="No value for quotapackage"
    #     #     )
    #     provider_location = provider.provider_location
    #
    #     # previous_request = OrganisationOnboardingRequest.query.filter_by(org_reg_code=args['org_reg_code'], status='pending').first()
    #     # if previous_request is not None:
    #     #     create_user_action_log(action='Create Organisation Onboarding Request',status='Fail',session_uuid=session['uuid'],resource_type="Organisation",error_message="A request is already made for this reference_number")
    #     #     abort(
    #     #         code=HTTPStatus.CONFLICT,
    #     #         message="A request is already made for this reference_number."
    #     #     )
    #     #
    #     # previous_request = OrganisationOnboardingRequest.query.filter_by(name=args['name'],org_reg_code=args['org_reg_code'], status='approved').first()
    #     # if previous_request is not None:
    #     #     create_user_action_log(action='Create Organisation Onboarding Request',status='Fail',session_uuid=session['uuid'],resource_type="Organisation",error_message="Duplicate reference_number")
    #     #     abort(
    #     #         code=HTTPStatus.CONFLICT,
    #     #         message="Duplicate entry exists."
    #     #     )
    #
    #     requested_by = args.pop('requested_by')
    #     with db.session.begin():
    #         user = User.query.filter_by(email=requested_by).first()
    #         if not user:
    #             user = User(email=requested_by, username=requested_by, password='test@Pass!23')
    #             db.session.add(user)
    #             # create_user_action_log(action='Create Organisation Onboarding Request', status='Fail',
    #             #                        session_uuid=session['uuid'],
    #             #                        resource_id=args['org_reg_code'],resource_type='Organisation Account Number',
    #             #                        error_message="User Doesn't Exists")
    #             # abort(
    #             #     code=HTTPStatus.UNPROCESSABLE_ENTITY,
    #             #     message="User Doesn't Exists"
    #             # )
    #         # if 'user_details' in args:
    #         #     users = args.pop('user_details')
    #         organisation_onboard_request = OrganisationOnboardingRequest(requested_by=requested_by,
    #                                                                      provider_location=provider_location,
    #                                                                      quotapackage_name=quotapackage.name,
    #                                                                      status='pending', **args)
    #         db.session.add(organisation_onboard_request)
    #
    #     # if users:
    #     #     users = json.loads(users)
    #     #     log.info(users)
    #     #     with db.session.begin():
    #     #         if users:
    #     #             for user in users:
    #     #                 log.info(user)
    #     #                 username = user['username']
    #     #                 password = 'test@Pass!23'
    #     #                 email = user['email']
    #     #                 firstname = user['first_name']
    #     #                 middle_name = None
    #     #                 last_name = None
    #     #                 mobile_no = None
    #     #                 if 'middle_name' in user:
    #     #                     middle_name = user['middle_name']
    #     #                 if 'last_name' in user:
    #     #                     last_name = user['last_name']
    #     #                 if 'mobile_no' in user:
    #     #                     mobile_no = user['mobile_no']
    #     #
    #     #                 log.info(organisation_onboard_request.id)
    #     #                 organisation_onboard_user_request = OrganisationOnboardingUserRequest(username=username,password=password, email=email, first_name=firstname, middle_name=middle_name, last_name=last_name,mobile_no=mobile_no, organisation_onboarding_request_id=organisation_onboard_request.id)
    #     #                 db.session.add(organisation_onboard_user_request)
    #
    #     create_user_action_log(action='Create Organisation Onboarding Request', status='Success',
    #                            session_uuid=session['uuid'], resource_type="Organisation")
    #     # args, onboard_request_id, provider_id
    #     # provider = Provider.query.filter_by(provider_location=provider_location).first()
    #     approve_org_obj = ApproveOrganisationOnboardingRequestById()
    #     result = approve_org_obj.get(args, onboard_request_id=organisation_onboard_request.id,
    #                                  provider_id=provider.id, user_id=user.id)
    #     return result
#
# @api.route('/organisation-onboarding-request/<int:onboard_request_id>/users/')
# class OrganisationOnboardingRequestById(Resource):
#     """
#     Manipulation with organisation onboarding request user
#     """
#
#     @create_user_action_trails(action="Get Organisation onboard with user details")
#     @check_scope_and_auth_token('organisations:read')
#     @api.login_required(oauth_scopes=['organisations:read'])
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.response(code=HTTPStatus.CONFLICT)
#     def get(self, onboard_request_id):
#         """
#         requested Organisation onboard with user details
#         """
#         organisation_onboard_request = OrganisationOnboardingRequest.query.get(onboard_request_id)
#         organisation_onboard_request_user = OrganisationOnboardingUserRequest.query.filter_by(organisation_onboarding_request_id=onboard_request_id).all()
#
#         organisation_user = []
#         for user in organisation_onboard_request_user:
#             json_user = json.dumps(user, cls=AlchemyEncoder)
#             organisation_user.append(json.loads(json_user))
#
#         organisation_onboard = json.dumps(organisation_onboard_request, cls=AlchemyEncoder)
#
#
#         data = {'organisation_onboard_request': json.loads(organisation_onboard), 'organisation_onboard_request_user':organisation_user}
#         response = jsonify(data)
#         response.status_code = 200
#         create_user_action_log(action="Get Organisation onboard with user details",status='Success',session_uuid=session['uuid'],resource_id=onboard_request_id,resource_type='Onboard Request')
#         return response
#
# @api.route('/organisation-onboarding-request/<int:onboard_request_id>/reject/')
# class OrganisationOnboardingRequestReject(Resource):
#     """
#     Manipulation with organisation onboarding request action reject
#     """
#     @create_user_action_trails(action="Reject Organisation onboard request")
#     @check_scope_and_auth_token('organisations:read')
#     @api.login_required(oauth_scopes=['organisations:read'])
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.response(schemas.BaseOrganisationOnboardRequestSchema())
#     @api.response(code=HTTPStatus.CONFLICT)
#     def get(self, onboard_request_id,provider_id,action):
#         """
#         update status (reject) of organisation onboard request
#         """
#         staus_message = []
#         from datetime import date, datetime
#
#
#         organisation_onboard_request = OrganisationOnboardingRequest.query.get(onboard_request_id)
#         if organisation_onboard_request is None:
#             create_user_action_log(action="Reject Organisation onboard request",status='Fail',session_uuid=session['uuid'],resource_id=onboard_request_id,resource_type='Onboard Request', error_message="Organisation onboard request not found.")
#             abort(
#                 code=HTTPStatus.NOT_FOUND,
#                 message="Organisation onboard request not found."
#             )
#         if organisation_onboard_request  is not None and organisation_onboard_request.status in ['rejected','approved']:
#             create_user_action_log(action="Reject Organisation onboard request",status='Fail',session_uuid=session['uuid'],resource_id=onboard_request_id,resource_type='Onboard Request', error_message="Invalid request data")
#             abort(
#                 code=HTTPStatus.BAD_REQUEST,
#                 message="Invalid request data"
#             )
#         requested_organisation_user = OrganisationOnboardingUserRequest.query.filter_by(
#             organisation_onboarding_request_id=onboard_request_id).all()
#         # provider = Provider.query.get(provider_id)
#         # if provider is None:
#         #     abort(
#         #         code=HTTPStatus.BAD_REQUEST,
#         #         message="Invalid provider_id"
#         #     )
#
#         if organisation_onboard_request is None:
#             create_user_action_log(action="Reject Organisation onboard request",status='Fail',session_uuid=session['uuid'],resource_id=onboard_request_id,resource_type='Onboard Request', error_message="organisation onboard request not found")
#             abort(
#                 code=HTTPStatus.NOT_FOUND,
#                 message="organisation onboard request not found"
#             )
#         today = date.today()
#
#         with db.session.begin():
#             organisation_onboard_request.status = 'rejected'
#             db.session.merge(organisation_onboard_request)
#             try:
#                 now = datetime.now()
#                 creation_date = now.strftime("%Y-%m-%d %H:%M:%S")
#                 params = {
#                     'reference_number': organisation_onboard_request.org_reg_code,
#                     'datacenter_name': organisation_onboard_request.provider_location,
#                     'creation_date': creation_date,
#                     'stack': 'Openstack',
#                     'status': 'rejected',
#                     'reject_reason': 'test rejected'
#                 }
#                 send_org_onboard_details(**params)
#             except Exception as e:
#                 create_user_action_log(action="Reject Organisation onboard request",status='Fail',session_uuid=session['uuid'],resource_id=onboard_request_id,resource_type='Onboard Request', error_message=str(e))
#                 log.info('Org registration Exception: %s', e)
#
#         create_user_action_log(action="Reject Organisation onboard request",status='Success',session_uuid=session['uuid'],resource_id=onboard_request_id,resource_type='Onboard Request')
#         return  organisation_onboard_request


# @api.route('/organisation-onboarding-request/<int:onboard_request_id>/<int:provider_id>/<string:action>')
# class OrganisationOnboardingRequestAction(Resource):
#     """
#     Manipulation with organisation onboarding request action
#     """
#
#     @create_user_action_trails(action="Update Approve or Reject Organisation onboard request")
#     @check_scope_and_auth_token('organisations:read')
#     @api.login_required(oauth_scopes=['organisations:read'])
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.response(schemas.BaseOrganisationOnboardRequestSchema())
#     @api.response(code=HTTPStatus.CONFLICT)
#     def get(self, onboard_request_id,provider_id,action):
#         "Update status (approve or reject) of organisation onboard request"
#         staus_message = []
#         from datetime import date, datetime
#         if not action or action.lower() not in ['approve', 'reject']:
#             create_user_action_log(action="Update Approve or Reject Organisation onboard request",status='Fail',session_uuid=session['uuid'],resource_id=onboard_request_id,resource_type='Onboard Request', error_message = "Invalid request data")
#             abort(
#                 code = HTTPStatus.BAD_REQUEST,
#                 message = "Invalid request data"
#             )
#
#         organisation_onboard_request = OrganisationOnboardingRequest.query.get(onboard_request_id)
#         if organisation_onboard_request is None:
#             create_user_action_log(action="Update Approve or Reject Organisation onboard request",status='Fail',session_uuid=session['uuid'],resource_id=onboard_request_id,resource_type='Onboard Request', error_message="Organisation onboard request not found.")
#             abort(
#                 code=HTTPStatus.NOT_FOUND,
#                 message="Organisation onboard request not found."
#             )
#         if organisation_onboard_request  is not None and organisation_onboard_request.status in ['rejected','approved']:
#             create_user_action_log(action="Update Approve or Reject Organisation onboard request",status='Fail',session_uuid=session['uuid'],resource_id=onboard_request_id,resource_type='Onboard Request', error_message="Invalid request data")
#             abort(
#                 code=HTTPStatus.BAD_REQUEST,
#                 message="Invalid request data"
#             )
#         requested_organisation_user = OrganisationOnboardingUserRequest.query.filter_by(
#             organisation_onboarding_request_id=onboard_request_id).all()
#         provider = Provider.query.get(provider_id)
#         if provider is None:
#             create_user_action_log(action="Update Approve or Reject Organisation onboard request",status='Fail',session_uuid=session['uuid'],resource_id=onboard_request_id,resource_type='Onboard Request', error_message="Invalid provider_id")
#             abort(
#                 code=HTTPStatus.BAD_REQUEST,
#                 message="Invalid provider_id"
#             )
#         try:
#             if organisation_onboard_request is None:
#                 create_user_action_log(action="Update Approve or Reject Organisation onboard request",status='Fail',session_uuid=session['uuid'],resource_id=onboard_request_id,resource_type='Onboard Request', error_message="organisation onboard request not found")
#                 abort(
#                     code=HTTPStatus.NOT_FOUND,
#                     message="organisation onboard request not found"
#                 )
#             today = date.today()
#
#             if action.lower() == 'reject':
#                 with db.session.begin():
#                     organisation_onboard_request.status = 'rejected'
#                     db.session.merge(organisation_onboard_request)
#                     try:
#                         now = datetime.now()
#                         creation_date = now.strftime("%Y-%m-%d %H:%M:%S")
#                         params = {
#                             'reference_number': organisation_onboard_request.org_reg_code,
#                             #'org_code': org_id,
#                             'datacenter_name': provider.provider_location,
#                             'creation_date': creation_date,
#                             'stack': 'Openstack',
#                             'status': 'rejected',
#                             'reject_reason': 'test rejected'
#                         }
#                         send_org_onboard_details(**params)
#                     except Exception as e:
#                         create_user_action_log(action="Update Approve or Reject Organisation onboard request",status='Fail',session_uuid=session['uuid'],resource_id=onboard_request_id,resource_type='Onboard Request')
#                         log.info('Org registration Exception: %s', e)
#                 create_user_action_log(action="Update Approve or Reject Organisation onboard request",status='Success',session_uuid=session['uuid'],resource_id=onboard_request_id,resource_type='Onboard Request')
#                 return  organisation_onboard_request
#
#             elif action.lower() == 'approve':
#                 quotapackage_name = organisation_onboard_request.quotapackage_name
#                 with db.session.begin():
#                     qoutapackage = db.session.query(QuotaPackage).filter(QuotaPackage.name.ilike(quotapackage_name), QuotaPackage.is_active==True).first()
#                     if qoutapackage:
#                         quotapackage_id = qoutapackage.id
#                     else:
#                         create_user_action_log(action="Update Approve or Reject Organisation onboard request",status='Fail',session_uuid=session['uuid'],resource_id=onboard_request_id,resource_type='Onboard Request', error_message="Invalid value for quotapackage")
#                         abort(
#                             code=HTTPStatus.BAD_REQUEST,
#                             message="Invalid value for quotapackage"
#                         )
#                 with db.session.begin():
#                     organisation = Organisation(name=organisation_onboard_request.name, description=organisation_onboard_request.description, org_reg_code=organisation_onboard_request.org_reg_code)
#                     db.session.add(organisation)
#                     staus_message.append("Organisation created successfully.")
#
#                 with db.session.begin():
#                     new_organisation_quotapackage = OrganisationQuotaPackage(quotapackage_id=quotapackage_id,
#                                                                              provider_id=provider_id,
#                                                                              organisation_id=organisation.id)
#                     db.session.add(new_organisation_quotapackage)
#                     staus_message.append("Quotapackage successfully assinged with Organisation.")
#
#                 with db.session.begin():
#                     org_id = generate_hash_for_number(organisation.id, 'organisation')
#                     organisation.org_id = org_id
#                     db.session.merge(organisation)
#                 with db.session.begin():
#                     # project creation
#                     project = Project(organisation=organisation, name=organisation_onboard_request.project_name,
#                                       description=organisation_onboard_request.project_description,
#                                       user_id=current_user.id)
#                     db.session.add(project)
#                     staus_message.append("Project created successfully.")
#                 with db.session.begin():
#                     project_id = generate_hash_for_number(project.id, 'project')
#                     project.project_id = project_id
#                     db.session.merge(project)
#
#                 for org_user in requested_organisation_user:
#                     new_user = User.query.filter_by(email=org_user.username).first()
#                     is_active = 0x1000
#                     if new_user is None:
#                         with db.session.begin():
#                             user_password = "test@Pass!23"
#                             new_user = User(username=org_user.username, password=user_password, email=org_user.email,first_name=org_user.first_name, middle_name=org_user.middle_name, last_name=org_user.last_name, mobile_no=org_user.mobile_no)
#                             new_user.static_roles = 0x4000 + is_active
#                             db.session.add(new_user)
#                             staus_message.append("User created successfully.")
#
#                         user_mobile_number = '91'+str(new_user.mobile_no)
#
#                         sms_template = SmsTemplate.query.filter_by(template_name='password', template_type='delivery').first()
#                         if sms_template is None:
#                             message = "Dear Sir/Madam, In reference to your Cloud Reg. A/C No. :"+organisation.org_reg_code+". Please use password: "+str(user_password)+" to Login into the Cloud Service Portal. -Regards, Yntraa/YntraaSI Cloud Support"
#                             send_sms_status = send_sms(user_mobile_number, message, template_id='1107166696322985326')
#                         else:
#                             message = sms_template.custom_template.format(cloud_acc_number=organisation.org_reg_code, password=str(user_password))
#                             send_sms_status = send_sms(user_mobile_number, message, template_id=sms_template.template_id)
#                         log.debug("send_sms_status %s",send_sms_status)
#
#                         with db.session.begin():
#                             created_user_details = User.query.filter_by(username=org_user.username).one_or_none()
#                             if created_user_details is None:
#                                 create_user_action_log(action="Update Approve or Reject Organisation onboard request",status='Fail',session_uuid=session['uuid'],resource_id=onboard_request_id,resource_type='Onboard Request')
#                                 abort(
#                                     code=HTTPStatus.NOT_FOUND,
#                                     message="User %s doesn\'t' exists so Client ID and Secret Key have not been created." % username
#                                 )
#                             else:
#                                 new_OAuth2Client = OAuth2Client(client_id=created_user_details.username,
#                                                                 client_secret=created_user_details.username,
#                                                                 user_id=created_user_details.id, client_type='public')
#                                 db.session.add(new_OAuth2Client)
#
#                             create_resource_action_log(db,
#                                                        resource_type='user',
#                                                        resource_record_id=created_user_details.id,
#                                                        action='created',
#                                                        resource_configuration='User Created',
#                                                        user_id=current_user.id,
#                                                        project_id=0,
#                                                        organisation_id=organisation.id,
#                                                        provider_id=provider_id
#                                                        )
#
#                     check_internal_user = False
#                     with db.session.begin():
#                         organisation_project_user = OrganisationProjectUser(organisation_id=organisation.id, project_id=project.id, user_id=new_user.id)
#                         db.session.add(organisation_project_user)
#
#                         user_role = UserRole(organisation_id=organisation.id, project_id=project.id, user_id=new_user.id, user_role=1)
#                         db.session.add(user_role)
#                         try:
#                             if new_user.id == current_user.id:
#                                 check_internal_user = True
#                         except Exception as e:
#                             log.info(e)
#                 try:
#                     if check_internal_user is False:
#                         with db.session.begin():
#                             organisation_project_user = OrganisationProjectUser(organisation_id=organisation.id, project_id=project.id, user_id=current_user.id)
#                             db.session.add(organisation_project_user)
#
#                             user_role = UserRole(organisation_id=organisation.id, project_id=project.id, user_id=current_user.id, user_role=1)
#                             db.session.add(user_role)
#                 except Exception as e:
#                     log.info(e)
#
#                 with db.session.begin():
#
#                     organisation_onboard_request.status = 'approved'
#                     db.session.merge(organisation_onboard_request)
#
#                     # create_resource_action_log(db,
#                     #                            resource_type='project',
#                     #                            resource_record_id=project.id,
#                     #                            action='created',
#                     #                            resource_configuration='Project Created',
#                     #                            user_id=new_user.id,
#                     #                            project_id=project.id,
#                     #                            organisation_id=organisation.id,
#                     #                            provider_id=organisation_onboard_request.provider_id
#                     #                            )
#
#
#             try:
#                 now = datetime.now()
#                 creation_date = now.strftime("%Y-%m-%d %H:%M:%S")
#                 params = {
#                     'reference_number': organisation_onboard_request.org_reg_code,
#                     'org_code': org_id,
#                     'datacenter_name': provider.provider_location,
#                     'creation_date': creation_date,
#                     'stack': 'Openstack',
#                     'status': 'created'
#                 }
#                 send_org_onboard_details(**params)
#             except Exception as e:
#                 create_user_action_log(action="Update Approve or Reject Organisation onboard request",status='Fail',session_uuid=session['uuid'],resource_id=onboard_request_id,resource_type='Onboard Request', error_message=str(e))
#                 log.info('Org registration Exception: %s', e)
#
#             create_user_action_log(action="Update Approve or Reject Organisation onboard request",status='Success',session_uuid=session['uuid'],resource_id=onboard_request_id,resource_type='Onboard Request')
#
#             return organisation_onboard_request
#
#         except Exception as e:
#             log.info(e)
#             with db.session.begin():
#                 organisation = Organisation.query.filter_by(org_reg_code=organisation_onboard_request.org_reg_code).first()
#                 if organisation is None:
#                     create_user_action_log(action="Update Approve or Reject Organisation onboard request",status='Fail',session_uuid=session['uuid'],resource_id=onboard_request_id,resource_type='Onboard Request', error_message=str(e))
#                     abort(
#                         code=HTTPStatus.BAD_REQUEST,
#                         mesaage=e
#                     )
#                 organisation_quotapackage = OrganisationQuotaPackage.query.filter_by(organisation_id=organisation.id).first()
#                 if organisation_quotapackage is not None:
#                     db.session.delete(organisation_quotapackage)
#                 requested_organisation_user = OrganisationOnboardingUserRequest.query.filter_by(organisation_onboarding_request_id=onboard_request_id).all()
#                 for org_user in requested_organisation_user:
#                     user = User.query.filter_by(email=org_user.username).first()
#                     if user is not None:
#                         db.session.delete(user)
#                 project = Project.query.filter_by(organisation_id=organisation.id).first()
#                 if project is not None:
#                     db.session.delete(project)
#                     db.session.delete(organisation)
#
#                 abort(
#                     code=HTTPStatus.BAD_REQUEST,
#                     mesaage=e
#                 )
#
# @api.route('/<int:organisation_id>/<int:provider_id>/<int:quotapackage_id>/request_new_quotapackage/')
# @api.response(
#     code=HTTPStatus.NOT_FOUND,
#     description="QuotaPackage not found.",
# )
# @api.resolve_object_by_model(Organisation, 'organisation')
# @api.resolve_object_by_model(Provider, 'provider')
# @api.resolve_object_by_model(QuotaPackage, 'quotapackage')
# class RequestNewQuotapackage(Resource):
#     """
#     Manipulation with a quotapackage on a new provider
#     """
#     @create_user_action_trails(action='Request a fresh quotapackage on a new provider')
#     @check_scope_and_auth_token('organisations:read')
#     @api.login_required(oauth_scopes=['organisations:read'])
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.response(schemas.DetailedQuotaPackageUpdateRequestSchema())
#     def post(self, organisation, provider, quotapackage):
#         """
#         Request a fresh quotapackage on a new provider.
#         """
#         if not provider.is_active:
#             create_user_action_log(action="Request a fresh quotapackage on a new provider",status='Fail',session_uuid=session['uuid'],resource_id=organisation.id,resource_type='QuotaPackage', error_message="Selected provider is not active")
#             abort(
#                 code=HTTPStatus.BAD_REQUEST,
#                 message="Selected provider is not active"
#             )
#         if not quotapackage.is_active:
#             create_user_action_log(action="Request a fresh quotapackage on a new provider",status='Fail',session_uuid=session['uuid'],resource_id=organisation.id,resource_type='QuotaPackage', error_message="Selected QuotaPackage is Inactive/Deleted")
#             abort(
#                 code=HTTPStatus.BAD_REQUEST,
#                 message="Selected QuotaPackage is Inactive/Deleted"
#             )
#         quotapackage_provider_mapping_check = QuotaPackageProviderMapping.query.filter_by(provider_id=provider.id, quotapackage_id=quotapackage.id, is_public=True).one_or_none()
#         if quotapackage_provider_mapping_check is None:
#             create_user_action_log(action="Request a fresh quotapackage on a new provider",status='Fail',session_uuid=session['uuid'],resource_id=organisation.id,resource_type='QuotaPackage', error_message="QuotaPackage in Provider not found.")
#             abort(
#                 code=HTTPStatus.NOT_FOUND,
#                 message="QuotaPackage in Provider not found."
#             )
#         organisation_quotapackage_mapping_check = OrganisationQuotaPackage.query.filter_by(provider_id=provider.id, organisation_id=organisation.id, quotapackage_id=quotapackage.id).one_or_none()
#         if organisation_quotapackage_mapping_check is not None:
#             create_user_action_log(action="Request a fresh quotapackage on a new provider",status='Fail',session_uuid=session['uuid'],resource_id=organisation.id,resource_type='QuotaPackage', error_message="QuotaPackage with Organisation for this Provider is already mapped. You may Update QuotaPackage.")
#             abort(
#                 code=HTTPStatus.NOT_FOUND,
#                 message="QuotaPackage with Organisation for this Provider is already mapped. You may Update QuotaPackage."
#             )
#         with db.session.begin():
#             new_quotapackage_update_request = QuotaPackageUpdateRequest(organisation_id=organisation.id, provider_id=provider.id,quotapackage_id = quotapackage.id,status='pending', requested_by=current_user.id)
#             db.session.add(new_quotapackage_update_request)
#
#         quota_package_request_id = f"QPR-{new_quotapackage_update_request.created.strftime('%Y%m%d')}-{new_quotapackage_update_request.id}"
#         with db.session.begin():
#             new_quotapackage_update_request.request_id = quota_package_request_id
#             db.session.merge(new_quotapackage_update_request)
#
#         create_user_action_log(action="Request a fresh quotapackage on a new provider",status='Success',session_uuid=session['uuid'],resource_id=organisation.id,resource_type='QuotaPackage')
#
#         try:
#             message = f"Quotapackage Request (Request ID: {quota_package_request_id})"
#             team_name = "cloud-infra"
#             cloud_location = provider.provider_location
#             sendOrganisationServiceRequestConfirmationMail(organisation.id, message, team_name, cloud_location)
#         except Exception as e:
#             create_user_action_log(action='Send mail Quotapackage Update Request',status='Fail',session_uuid=session['uuid'], resource_type='QuotaPackage')
#             log.info(e)
#
#         return new_quotapackage_update_request

# @api.route('/quotapackage_update_request/')
# class OrganisationQuotapackageUpdateRequest(Resource):
#     """
#     Manipulation with organisation quotapackage update request
#     """
#
#     @create_user_action_trails(action='Get Quotapackage Update Request List')
#     @check_scope_and_auth_token('organisations:read')
#     @api.login_required(oauth_scopes=['organisations:read'])
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.parameters(parameters.QuotapackageUpdateQueryParameter())
#     @api.response(schemas.DetailedQuotaPackageUpdateRequestSchema(many=True))
#     @api.paginate()
#     def get(self, args):
#         """
#         get list of all quotapackage update request
#         """
#
#         filter_args = {}
#
#         filter_args = custom_query(args)
#
#         resp = QuotaPackageUpdateRequest.query.filter_by(**filter_args).order_by("created desc")
#
#         create_user_action_log(action='Get Quotapackage Update Request List',status='Success',session_uuid=session['uuid'])
#         return resp
#
# @api.route('/<int:organisation_id>/<int:provider_id>/<int:quotapackage_id>/quotapackage_update_request/')
# @api.response(
#     code=HTTPStatus.NOT_FOUND,
#     description="QuotaPackage not found.",
# )
# @api.resolve_object_by_model(Organisation, 'organisation')
# @api.resolve_object_by_model(Provider, 'provider')
# @api.resolve_object_by_model(QuotaPackage, 'quotapackage')
# class UpdateQuotaPackageToOrganisation(Resource):
#     """
#     Manipulations with a specific QuotaPackage.
#     """
#
#     @create_user_action_trails(action='Quotapackage Update Request')
#     @check_scope_and_auth_token('quotapackages:read')
#     @api.login_required(oauth_scopes=['quotapackages:read'])
#     @api.response(schemas.DetailedQuotaPackageUpdateRequestSchema())
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.response(code=HTTPStatus.CONFLICT)
#     def post(self, organisation, provider, quotapackage):
#         """
#         Request to update quotapackage.
#         """
#         organisation_id = organisation.id
#         provider_id = provider.id
#         quotapackage_id = quotapackage.id
#         if not provider.is_active:
#             create_user_action_log(action="Quotapackage Update Request",status='Fail',session_uuid=session['uuid'],resource_id=organisation_id,resource_type='QuotaPackage', error_message="Selected provider is not active")
#             abort(
#                 code=HTTPStatus.CONFLICT,
#                 message="Selected provider is not active"
#             )
#         with api.commit_or_abort(
#                 db.session,
#                 default_error_message="Failed to create quotapackage update request"
#             ):
#             quotapackage_update_request_check = QuotaPackageUpdateRequest.query.filter_by(provider_id=provider_id, quotapackage_id=quotapackage_id, organisation_id=organisation_id, status='pending').first()
#             if quotapackage_update_request_check is not None:
#                 create_user_action_log(action="Quotapackage Update Request",status='Fail',session_uuid=session['uuid'],resource_id=organisation_id,resource_type='QuotaPackage', error_message="Approval for previous quotaPackage update request is already pending.")
#                 abort(
#                     code=HTTPStatus.CONFLICT,
#                     message="Approval for previous quotaPackage update request is already pending."
#                 )
#             if not quotapackage.is_active:
#                 create_user_action_log(action="Quotapackage Update Request",status='Fail',session_uuid=session['uuid'],resource_id=organisation_id,resource_type='QuotaPackage', error_message="Selected QuotaPackage is Inactive/Deleted")
#                 abort(
#                     code=HTTPStatus.BAD_REQUEST,
#                     message="Selected QuotaPackage is Inactive/Deleted"
#                 )
#             quotapackage_provider_mapping_check = QuotaPackageProviderMapping.query.filter_by(provider_id=provider_id, quotapackage_id=quotapackage_id, is_public=True).one_or_none()
#             if quotapackage_provider_mapping_check is None:
#                 create_user_action_log(action="Quotapackage Update Request",status='Fail',session_uuid=session['uuid'],resource_id=organisation_id,resource_type='QuotaPackage', error_message="QuotaPackage in Provider not found.")
#                 abort(
#                     code=HTTPStatus.NOT_FOUND,
#                     message="QuotaPackage in Provider not found."
#                 )
#
#             organisation_quotapackage_mapping_check = OrganisationQuotaPackage.query.filter_by(provider_id=provider_id, organisation_id=organisation_id).one_or_none()
#             if organisation_quotapackage_mapping_check:
#                 if organisation_quotapackage_mapping_check.quotapackage_id == quotapackage_id:
#                     create_user_action_log(action="Quotapackage Update Request",status='Fail',session_uuid=session['uuid'],resource_id=organisation_id,resource_type='QuotaPackage', error_message="QuotaPackage with Organisation for this Provider is already mapped.")
#                     abort(
#                         code=HTTPStatus.NOT_FOUND,
#                         message="QuotaPackage with Organisation for this Provider is already mapped. You may Update QuotaPackage."
#                     )
#
#                 resources = {}
#                 quota_package_details = QuotaPackage.query.filter_by(id=quotapackage_id).one_or_none()
#                 quota_package_details = quota_package_details.__dict__
#                 for quota in quota_package_details :
#                     if quota not in ("id", "_sa_instance_state", "updated", "created", "name", "description",  "is_active", "version", "effective_from", "valid_till"):
#                         resources[quota.replace("_","")] = quota_package_details[quota]
#
#                 resource_data = None
#
#                 provider_action_log = ProviderResourceActionLog.query.filter_by(organisation_id=organisation_id, provider_id=provider_id).order_by("action_log_date desc").first()
#                 compute_resource_log = ResourceActionLog.query.filter_by(organisation_id = organisation_id, provider_id = provider_id)
#                 if provider_action_log:
#                     last_log_date = provider_action_log.action_log_date
#                     from_date = str(datetime.combine((last_log_date+timedelta(days=1)), datetime.min.time()))
#                     compute_resource_log = compute_resource_log.filter(ResourceActionLog.created > from_date)
#                 compute_resource_log = compute_resource_log.all()
#                 resource_data = calculate_current_utlization_from_resource_action_logs(organisation_id, provider_id,compute_resource_log)
#                 if provider_action_log:
#                     resource_data = combine_calculated_log_and_cron_log(resource_data, provider_action_log.action_log[0]['resource_action_log'], organisation_id=organisation_id, provider_id=provider_id)
#
#                 organisation_topup_quota = allocated_topup_quota_details(organisation_id, provider_id)
#
#                 for object_head in resources :
#                     if resource_data[object_head]['consumed']['value'] > resources[object_head] :
#                         if object_head in organisation_topup_quota and (int(organisation_topup_quota[object_head])+(int(resources[object_head])) > int(resource_data[object_head]['consumed']['value'])):
#                             continue
#                         else:
#                             create_user_action_log(action="Quotapackage Update Request",status='Fail',session_uuid=session['uuid'],resource_id=organisation_id,resource_type='QuotaPackage', error_message="resource consumed value is more than requested quotapackage resource.")
#                             abort(
#                                 code=HTTPStatus.BAD_REQUEST,
#                                 message="%s resource consumed value is more than requested quotapackage resource" % object_head
#                             )
#
#             new_quotapackage_update_request = QuotaPackageUpdateRequest(organisation_id=organisation_id, provider_id=provider_id,quotapackage_id = quotapackage_id,status='pending', requested_by=current_user.id)
#             db.session.add(new_quotapackage_update_request)
#
#         quota_package_request_id = f"QPR-{new_quotapackage_update_request.created.strftime('%Y%m%d')}-{new_quotapackage_update_request.id}"
#         with db.session.begin():
#             new_quotapackage_update_request.request_id = quota_package_request_id
#             db.session.merge(new_quotapackage_update_request)
#
#         try:
#             message = f"Quotapackage Update Request (Request ID: {quota_package_request_id})"
#             team_name = "cloud-infra"
#             cloud_location = provider.provider_location
#             sendOrganisationServiceRequestConfirmationMail(organisation.id, message, team_name, cloud_location)
#         except Exception as e:
#             create_user_action_log(action='Send mail Quotapackage Update Request',status='Fail',session_uuid=session['uuid'], resource_type='Organisation')
#             log.info(e)
#
#         create_user_action_log(action="Quotapackage Update Request",status='Success',session_uuid=session['uuid'],resource_id=organisation_id,resource_type='QuotaPackage')
#         return new_quotapackage_update_request
#
# @api.route('/quotapackage_update_request/<int:quotapackage_update_request_id>/cancel/')
# @api.response(
#     code=HTTPStatus.NOT_FOUND,
#     description="QuotaPackageUpdateRequest not found.",
# )
# class CancelUpdateQuotaPackage(Resource):
#     """
#     Manipulations with a specific QuotaPackage Update Request.
#     """
#
#     @create_user_action_trails(action='Cancel Quotapackage Update Request')
#     @check_scope_and_auth_token('quotapackages:read')
#     @api.login_required(oauth_scopes=['quotapackages:read'])
#     @api.parameters(parameters.QuotapackageUpdateCancel())
#     @api.response(schemas.DetailedQuotaPackageUpdateRequestSchema())
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.response(code=HTTPStatus.CONFLICT)
#     def put(self, args, quotapackage_update_request_id):
#         """
#         Request to cancel update quotapackage.
#         """
#         quotapackage_update_request_details = QuotaPackageUpdateRequest.query.filter_by(id=quotapackage_update_request_id).one_or_none()
#         if quotapackage_update_request_details is not None and quotapackage_update_request_details.status in ['cancelled','rejected','approved']:
#             create_user_action_log(action="Cancel Quotapackage Update Request",status='Fail',session_uuid=session['uuid'],resource_id=quotapackage_update_request_details.organisation_id,resource_type='QuotaPackage', error_message="Invalid request data")
#             abort(
#                 code=HTTPStatus.BAD_REQUEST,
#                 message="Invalid request data"
#             )
#
#         if quotapackage_update_request_details is None:
#             create_user_action_log(action="Cancel Quotapackage Update Request",status='Fail',session_uuid=session['uuid'],resource_type='QuotaPackage', error_message="QuotaPackageUpdateRequest not found.")
#             abort(
#                 code=HTTPStatus.NOT_FOUND,
#                 message="QuotaPackageUpdateRequest not found."
#             )
#
#         if 'remarks' in args :
#             quotapackage_update_request_details.remarks = args['remarks']
#         quotapackage_update_request_details.status = 'cancelled'
#
#         db.session.merge(quotapackage_update_request_details)
#         create_user_action_log(action="Cancel Quotapackage Update Request",status='Success',session_uuid=session['uuid'],resource_id=quotapackage_update_request_details.organisation_id,resource_type='QuotaPackage')
#         return quotapackage_update_request_details

# @api.route('/<int:organisation_id>/<int:provider_id>/<int:resource_topup_id>/resource_topup_request/')
# @api.response(
#     code=HTTPStatus.NOT_FOUND,
#     description="Resource Topup not found.",
# )
# @api.resolve_object_by_model(Organisation, 'organisation')
# @api.resolve_object_by_model(Provider, 'provider')
# @api.resolve_object_by_model(ResourceTopup, 'resource_topup')
# class ResourceTopupToOrganisation(Resource):
#     """
#     Manipulations with a ResourceTopup.
#     """
#
#     @create_user_action_trails(action='Request Resource Topup')
#     @check_scope_and_auth_token('quotapackages:read')
#     @api.login_required(oauth_scopes=['quotapackages:read'])
#     @api.response(BaseResourceTopupRequestSchema())
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.response(code=HTTPStatus.CONFLICT)
#     def post(self, organisation, provider, resource_topup):
#         """
#         Request to topup resource.
#         """
#         organisation_id = organisation.id
#         provider_id = provider.id
#         resource_topup_id = resource_topup.id
#
#         if not provider.is_active:
#             create_user_action_log(action='Request Resource Topup',status='Fail',session_uuid=session['uuid'],resource_id=organisation_id,resource_type='QuotaPackage', error_message="Requested provider is not active")
#             abort(
#                 code=HTTPStatus.BAD_REQUEST,
#                 message="Requested provider is not active"
#             )
#
#         with api.commit_or_abort(
#                 db.session,
#                 default_error_message="Failed to create quotapackage topup request"
#             ):
#
#             resource_topup_mapping_check = ResourceTopupProviderMapping.query.filter_by(provider_id=provider_id, resource_topup_id=resource_topup_id).one_or_none()
#             if resource_topup_mapping_check is None:
#                 create_user_action_log(action='Request Resource Topup',status='Fail',session_uuid=session['uuid'],resource_id=organisation_id,resource_type='QuotaPackage', error_message="Resource Topup in Provider not found.")
#                 abort(
#                     code=HTTPStatus.NOT_FOUND,
#                     message="Resource Topup in Provider not found."
#                 )
#
#             new_resource_topup_request = ResourceTopupRequest(organisation_id=organisation_id, provider_id=provider_id,resource_topup_id = resource_topup_id,status='pending', requested_by=current_user.id)
#             db.session.add(new_resource_topup_request)
#
#         resource_topup_request_id = f"QPR-TOP-{new_resource_topup_request.created.strftime('%Y%m%d')}-{new_resource_topup_request.id}"
#         with db.session.begin():
#             new_resource_topup_request.request_id = resource_topup_request_id
#             db.session.merge(new_resource_topup_request)
#
#         try:
#             message = f"Resource Topup Request (Request ID: {resource_topup_request_id})"
#             team_name = "cloud-infra"
#             cloud_location = provider.provider_location
#             sendOrganisationServiceRequestConfirmationMail(organisation.id, message, team_name, cloud_location)
#         except Exception as e:
#             log.info(e)
#
#         create_user_action_log(action='Request Resource Topup',status='Success',session_uuid=session['uuid'],resource_id=organisation_id,resource_type='QuotaPackage')
#         return new_resource_topup_request
#
# @api.route('/<int:organisation_id>/<int:provider_id>/resource_topup_withdrawl_request/')
# @api.resolve_object_by_model(Organisation, 'organisation')
# @api.resolve_object_by_model(Provider, 'provider')
# class ResourceTopupWithdrawlOrganisation(Resource):
#     """
#     Manipulations with a ResourceTopup Withdrawl.
#     """
#
#     @create_user_action_trails(action='Resource Topup Withdrawl Request')
#     @check_scope_and_auth_token('quotapackages:read')
#     @api.login_required(oauth_scopes=['quotapackages:read'])
#     @api.parameters(parameters.ResourceTopupWithdrawParameter())
#     @api.response(BaseResourceTopupWithdrawRequestSchema())
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.response(code=HTTPStatus.CONFLICT)
#     def post(self, args, organisation, provider):
#         """
#         Request to withdraw topup resource.
#         """
#         organisation_id = organisation.id
#         provider_id = provider.id
#
#         if not provider.is_active:
#             create_user_action_log(action='Resource Topup Withdrawl Request',status='Fail',session_uuid=session['uuid'],resource_id=organisation_id,resource_type='QuotaPackage', error_message="Requested provider is not active")
#             abort(
#                 code=HTTPStatus.BAD_REQUEST,
#                 message="Requested provider is not active"
#             )
#
#         resource_utilization = get_organisation_resource_details_on_provider(organisation_id, provider_id)
#         resource_topup = ResourceTopup.query.get(args['resource_topup_id'])
#         resource_type, resource_value = (resource_topup.topup_type.replace('_', ''), resource_topup.topup_value)
#         consumed_resource = resource_utilization[resource_type]['consumed']['value']
#         allocated_resource = resource_utilization[resource_type]['allocated']['value']
#         if resource_value > allocated_resource - consumed_resource:
#             create_user_action_log(action='Resource Topup Withdrawl Request',status='Fail',session_uuid=session['uuid'],resource_id=organisation_id,resource_type='QuotaPackage', error_message="Consumed resource over requested quota limit, can't be withdrawn")
#             abort(
#                 code=HTTPStatus.FORBIDDEN,
#                 message="Consumed resource over requested quota limit, can't be withdrawn"
#             )
#
#         with api.commit_or_abort(
#                 db.session,
#                 default_error_message="Failed to create topup withdrawl request"
#             ):
#
#             resource_topup_request_check = ResourceTopupRequest.query.filter_by(id=args['resource_topup_request_id'], resource_topup_id=args['resource_topup_id'], status='approved').one_or_none()
#             if resource_topup_request_check is None:
#                 create_user_action_log(action='Resource Topup Withdrawl Request',status='Fail',session_uuid=session['uuid'],resource_id=organisation_id,resource_type='QuotaPackage', error_message="Resource Topup Request not found.")
#                 abort(
#                     code=HTTPStatus.NOT_FOUND,
#                     message="Resource Topup Request not found."
#                 )
#
#             pending_withdrawal_request = ResourceTopupWithdrawalRequest.query.filter_by(organisation_id=organisation_id, provider_id=provider_id,resource_topup_id=args['resource_topup_id'],resource_topup_request_id=args['resource_topup_request_id'],status='pending').first()
#             if pending_withdrawal_request:
#                 create_user_action_log(action='Resource Topup Withdrawl Request',status='Fail',session_uuid=session['uuid'],resource_id=organisation_id,resource_type='QuotaPackage', error_message='Resource Topup Withdrawal Request already pending')
#                 abort(
#                     code=HTTPStatus.CONFLICT,
#                     message='Resource Topup Withdrawal Request already pending'
#                 )
#
#             new_resource_topup_withdrawl_request = ResourceTopupWithdrawalRequest(organisation_id=organisation_id, provider_id=provider_id,resource_topup_id=args['resource_topup_id'],resource_topup_request_id=args['resource_topup_request_id'],status='pending', requested_by=current_user.id)
#             db.session.add(new_resource_topup_withdrawl_request)
#
#         resource_topup_withdrawal_request_id = f"QPR-TOP-WD-{new_resource_topup_withdrawl_request.created.strftime('%Y%m%d')}-{new_resource_topup_withdrawl_request.id}"
#         with db.session.begin():
#             new_resource_topup_withdrawl_request.request_id = resource_topup_withdrawal_request_id
#             db.session.merge(new_resource_topup_withdrawl_request)
#
#         try:
#             message = f"Resource Topup Withdrawl Request (Request ID: {resource_topup_withdrawal_request_id})"
#             team_name = "cloud-infra"
#             cloud_location = provider.provider_location
#             sendOrganisationServiceRequestConfirmationMail(organisation.id, message, team_name, cloud_location)
#         except Exception as e:
#             log.info(e)
#
#         create_user_action_log(action='Resource Topup Withdrawl Request',status='Success',session_uuid=session['uuid'],resource_id=organisation_id,resource_type='QuotaPackage')
#
#         return new_resource_topup_withdrawl_request
#
# @api.route('/resource_topup_request/')
# class OrganisationResourceTopupRequest(Resource):
#     """
#     Manipulation with organisation resource topup request
#     """
#
#     @create_user_action_trails(action='Get Resource Topup Request List')
#     @check_scope_and_auth_token('organisations:read')
#     @api.login_required(oauth_scopes=['organisations:read'])
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.parameters(parameters.ResourceTopupQueryParameter())
#     @api.response(BaseResourceTopupRequestSchema(many=True))
#     @api.paginate()
#     @api.sort()
#     def get(self, args):
#         """
#         get list of all resource topup request
#         """
#
#         filter_args = {}
#
#         filter_args = custom_query(args)
#
#         resp = ResourceTopupRequest.query.filter_by(**filter_args)
#
#         create_user_action_log(action='Get Resource Topup Request List',status='Success',session_uuid=session['uuid'])
#         return resp
#
# @api.route('/resource_topup_withdrawl_request/')
# class OrganisationResourceTopupWithdrawlRequest(Resource):
#     """
#     Manipulation with organisation resource topup withdrawl request
#     """
#
#     @create_user_action_trails(action='Get Resource Topup Withdrawl Request List')
#     @check_scope_and_auth_token('organisations:read')
#     @api.login_required(oauth_scopes=['organisations:read'])
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.parameters(parameters.ResourceTopupQueryParameter())
#     @api.response(BaseResourceTopupWithdrawRequestSchema(many=True))
#     @api.paginate()
#     @api.sort()
#     def get(self, args):
#         """
#         get list of all resource topup withdrawl request
#         """
#
#         filter_args = {}
#
#         filter_args = custom_query(args)
#
#         resp = ResourceTopupWithdrawalRequest.query.filter_by(**filter_args)
#
#         create_user_action_log(action='Get Resource Topup Request List',status='Success',session_uuid=session['uuid'])
#         return resp

#
# @api.route('/<int:organisation_id>/<int:provider_id>/zone/')
# @api.response(
#     code=HTTPStatus.NOT_FOUND,
#     description="Zone not found.",
# )
# @api.resolve_object_by_model(Organisation, 'organisation')
# @api.resolve_object_by_model(Provider, 'provider')
# class OrganisationZone(Resource):
#     """
#     Manipulation with organisation zone details
#     """
#
#     @create_user_action_trails(action='Get zone details')
#     @api.login_required(oauth_scopes=['organisations:read'])
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.response(schemas.DetailedOrganisationzoneSchema(many=True))
#     @api.response(code=HTTPStatus.NOT_FOUND)
#     @api.paginate()
#     def get(self, args, organisation, provider):
#         """
#         get list of organisation zone
#         """
#         organisation_zone = OrganisationZoneMapping.query.filter_by(organisation_id=organisation.id, provider_id=provider.id)
#         create_user_action_log(action='Get zone details',status='Success',session_uuid=session['uuid'])
#         return organisation_zone
#
# @api.route('/resource_topup_request/<int:resource_topup_request_id>/cancel')
# @api.response(
#     code=HTTPStatus.NOT_FOUND,
#     description="Resource Topup request not found.",
# )
# @api.resolve_object_by_model(ResourceTopupRequest, 'resource_topup_request')
# class ResourceTopupRequestCancel(Resource):
#     """
#     Manipulations with a ResourceTopupRequest
#     """
#
#     @create_user_action_trails(action='Cancel Resource Topup Request')
#     @check_scope_and_auth_token('quotapackages:read')
#     @api.login_required(oauth_scopes=['quotapackages:read'])
#     @verify_parameters()
#     @api.response(BaseResourceTopupRequestSchema())
#     @api.parameters(parameters.ResourceTopupRequestCancelParameter())
#     @ratelimit(rate=RateConfig.medium)
#     def get(self, args, resource_topup_request):
#
#         resource_topup_request_details = ResourceTopupRequest.query.get(resource_topup_request.id)
#         if resource_topup_request_details.status != 'pending':
#             create_user_action_log(action='Cancel Resource Topup Request',status='Fail',session_uuid=session['uuid'], provider_id=resource_topup_request_details.provider_id, organisation_id=resource_topup_request_details.organisation_id,resource_id=resource_topup_request_details.organisation_id,resource_type="QuotaPackage",error_message="Only pending resource topup request can be cancelled")
#             abort(
#                 code = HTTPStatus.BAD_REQUEST,
#                 message = "Only pending resource topup request can be cancelled"
#             )
#         with db.session.begin():
#             resource_topup_request_details.status = 'cancelled'
#             if 'remarks' in args:
#                 resource_topup_request_details.remarks = args['remarks']
#             db.session.merge(resource_topup_request_details)
#         create_user_action_log(action='Cancel Resource Topup Request',status='Success',session_uuid=session['uuid'],provider_id=resource_topup_request_details.provider_id, organisation_id=resource_topup_request_details.organisation_id,resource_id=resource_topup_request_details.organisation_id,resource_type="QuotaPackage")
#         return resource_topup_request_details

@api.route('/organisation-onboarding-requestt/')
class AutoApproveOrganisationOnboardingRequestById(Resource):

    # @create_user_action_trails(action='Create Organisation Auto Approve Onboarding Request')
    @api.login_required(oauth_scopes=['auth:read'])
    @api.parameters(parameters.OrganisationOnboardRequestParameters())
    @api.response(schemas.BaseOrganisationOnboardRequestSchema())
    @api.response(code=HTTPStatus.CONFLICT)
    def post(self, args):
        """
        Update status approve of organisation onboard request
        """
        try:
            provider = Provider.query.filter_by(default=True).first()
            if not provider:
                pass
                # create_user_action_log(action='Create Organisation Auto Approve Onboarding Request', status='Fail',
                #                        session_uuid=session['uuid'], error_message="No Default Provider found")
                # abort(
                #     code=HTTPStatus.UNPROCESSABLE_ENTITY,
                #     message="No Default Provider found"
                # )
            quotapackage = QuotaPackage.query.filter_by(default=True).first()
            if not quotapackage:
                pass
                # create_user_action_log(action='Create Organisation Auto Approve Onboarding Request', status='Fail',
                #                        session_uuid=session['uuid'], error_message="No Default Quotapackage found")
                # abort(
                #     code=HTTPStatus.UNPROCESSABLE_ENTITY,
                #     message="No Default Quotapackage found"
                # )
            # requested_by = args.pop('requested_by')
            # with db.session.begin():
            #     user = User.query.filter_by(email=requested_by).first()
            #     if not user:
            #         user = User(email=requested_by, username=requested_by, password='test@Pass!23')
            #         db.session.add(user)

            # requested_organisation_user = OrganisationOnboardingUserRequest.query.filter_by(
            #     orgbanisation_onboarding_request_id=onboard_request_id).all()
            # provider_default_zone = ResourceAvailabilityZones.query.filter(
            #     ResourceAvailabilityZones.provider_id == provider.id,
            #     ResourceAvailabilityZones.resource_name.ilike('compute'),
            #     ResourceAvailabilityZones.status.ilike('available'), ResourceAvailabilityZones.is_default == True).first()
            # if provider_default_zone is None:
            #     create_user_action_log(action='Create Organisation Auto Approve Onboarding Request', status='Fail',
            #                            session_uuid=session['uuid'], error_message="Default availability zone is not set to provider")
            #     abort(
            #         code=HTTPStatus.BAD_REQUEST,
            #         message='Default availability zone is not set to provider'
            #     )
            # quotapackage_name = quotapackage.quotapackage_name
            with db.session.begin():
                # qoutapackage = db.session.query(QuotaPackage).filter(QuotaPackage.name.ilike(quotapackage_name),
                #                                                      QuotaPackage.is_active == True).first()
                # if qoutapackage:
                quotapackage_id = quotapackage.id
                # else:
                #     create_user_action_log(action='Approve Organisation Onboarding Request by ID', status='Fail',
                #                            session_uuid=session['uuid'], resource_id=onboard_request_id,
                #                            resource_type='Onboard Request',
                #                            error_message="Invalid value for quotapackage")
                #     abort(
                #         code=HTTPStatus.BAD_REQUEST,
                #         message="Invalid value for quotapackage"
                #     )

                # organisation = Organisation.query.filter_by(name=args['name']).filter_by(
                #     description=args['description']).filter_by(
                #     org_reg_code=args['org_reg_code']).first()
                organisation = Organisation.query.filter_by(org_id=args['org_id']).first()
                if organisation is None:
                    organisation = Organisation(**args)
                    db.session.add(organisation)
                    log.info("Organisation created successfully.")



                elif not organisation.org_reg_code:
                    for key, value in args.items():
                        setattr(organisation, key, value)
                    db.session.merge(organisation)
                    log.info("Organisation filled successfully.")
                else:
                    pass
                    # create_user_action_log(action='Approve Organisation Onboarding Request by ID', status='Fail',
                    #                        session_uuid=session['uuid'],
                    #                        error_message="Organisation already exists")
                    # abort(
                    #     code=HTTPStatus.BAD_REQUEST,
                    #     message="Organisation already exists"
                    # )

                # else:
                #     create_user_action_log(action='Approve Organisation Onboarding Request by ID', status='Fail',
                #                            session_uuid=session['uuid'], resource_id=onboard_request_id,
                #                            resource_type='Onboard Request',
                #                            error_message="Invalid value for organisation")
                #     abort(
                #         code=HTTPStatus.BAD_REQUEST,
                #         message="Invalid value for organisation"
                #     )

                # if not organisation:
            # with db.session.begin():
            #
            #     user_role = UserRole(organisation_id=organisation.id,
            #                          user_id=user.id, user_role=1)
            #     db.session.add(user_role)
            #     log.info("User Role Assigned successfully.")



                check_org_quotapackage = OrganisationQuotaPackage.query.filter_by(
                    quotapackage_id=quotapackage_id).filter_by(provider_id=provider.id).filter_by(
                    organisation_id=organisation.id).first()


                if check_org_quotapackage is None:
                    new_organisation_quotapackage = OrganisationQuotaPackage(quotapackage_id=quotapackage_id,
                                                                             provider_id=provider.id,
                                                                             organisation_id=organisation.id)
                    db.session.add(new_organisation_quotapackage)
                    log.info("Quotapackage successfully assinged with Organisation.")

                # if 'zone_details' in args:
                #     zones = json.loads(args['zone_details'])
                #     if zones:
                #         for zone in zones:
                #             check_org_zone_mapping = OrganisationZoneMapping.query.filter_by(
                #                 organisation_id=organisation.id, provider_id=provider.id,
                #                 availability_zone_id=zone['id'], resource_name=zone['resource_name']).first()
                #             if check_org_zone_mapping is None:
                #                 organisation_zone_request = OrganisationZoneMapping(organisation_id=organisation.id,
                #                                                                     provider_id=provider.id,
                #                                                                     availability_zone_id=zone['id'],
                #                                                                     resource_name=zone['resource_name'])
                #                 db.session.add(organisation_zone_request)
                # else:
                #     zones = ResourceAvailabilityZones.query.filter_by(provider_id=provider.id).filter_by(
                #         resource_name='compute').filter_by(is_default=True).filter_by(status='Available'.lower()).first()
                #     check_org_zone_mapping = OrganisationZoneMapping.query.filter_by(organisation_id=organisation.id,
                #                                                                      provider_id=provider.id,
                #                                                                      availability_zone_id=zones.id,
                #                                                                      resource_name=zones.resource_name).first()
                #     if check_org_zone_mapping is None:
                #         organisation_zone_request = OrganisationZoneMapping(organisation_id=organisation.id,
                #                                                             provider_id=provider.id,
                #                                                             availability_zone_id=zones.id,
                #                                                             resource_name=zones.resource_name)
                #         db.session.add(organisation_zone_request)

            # create_user_action_log(action='Create Organisation Auto Approve Onboarding Request', status='Success',
            #                        session_uuid=session['uuid'])
            log.info("Organisation created successfully.")
            return organisation

        except Exception as e:
            log.info(e)
            # create_user_action_log(action='Create Organisation Auto Approve Onboarding Request', status='Fail',
            #                        session_uuid=session['uuid'], error_message=str(e))
            with db.session.begin():
                organisation = Organisation.query.filter_by(
                    org_id=args['org_id']).first()
                if organisation is None:
                    pass
                    # create_user_action_log(action='Create Organisation Auto Approve Onboarding Request', status='Fail',
                    #                        session_uuid=session['uuid'], error_message=str(e))
                    # abort(
                    #     code=HTTPStatus.BAD_REQUEST,
                    #     mesaage=e
                    # )
                organisation_quotapackage = OrganisationQuotaPackage.query.filter_by(
                    organisation_id=organisation.id).first()
                if organisation_quotapackage is not None:
                    db.session.delete(organisation_quotapackage)

                db.session.delete(organisation)

                abort(
                    code=HTTPStatus.BAD_REQUEST,
                    mesaage=e
                )

#
# @api.route('/project/init')
# class ProjectInitialization(Resource):
#     @create_user_action_trails(action='Initialize Project Request by ID')
#     @api.login_required(oauth_scopes=['auth:read'])
#     @ratelimit(rate=RateConfig.medium)
#     @api.parameters(parameters.BaseSubscriptionParameters())
#     @api.response(BaseProjectSchema())
#     @api.response(code=HTTPStatus.CONFLICT)
#     def post(self, args):
#         try:
#             # Default eula_id assigned 1 if not provided
#             if not args.get('eula_id'):
#                 args['eula_id'] = 1
#             log.info(f"current_user : {current_user}")
#             user_id = current_user.id
#             user_obj = User.query.filter_by(id=user_id).first()
#             if not user_obj.user_id:
#                 abort(
#                     code=HTTPStatus.BAD_REQUEST,
#                     message="User does not exist"
#                 )
#             user_role = UserRole.query.filter_by(project_id=None,
#                                                  user_id=user_id, user_role=1).first()
#
#             print("user_role", user_role)
#             if not user_role:
#                 log.info("User doesn't have org-admin role for unsubscribed organisation")
#                 create_user_action_log(action='Project Initialization', status='Fail',
#                                        session_uuid=session['uuid'], resource_id=user_id,
#                                        resource_type='User Id',
#                                        error_message="User doesn't have org-admin role for unsubscribed organisation")
#                 abort(
#                     code=HTTPStatus.BAD_REQUEST,
#                     message="User doesn't have org-admin role for unsubscribed organisation"
#                 )
#
#
#             organisation_id = user_role.organisation_id
#             organisation = Organisation.query.filter_by(id=organisation_id).first()
#
#             print("organisation_id", organisation)
#             if not organisation.org_reg_code:
#                 log.info("Organisation is not Onboarded")
#                 create_user_action_log(action='Project Initialization', status='Fail',
#                                        session_uuid=session['uuid'], resource_id=organisation_id,
#                                        resource_type='Organisation Id',
#                                        error_message="Organisation is not Onboarded")
#                 #Throwing error as organisation doesn't have name, so it is not possible to create project
#                 abort(
#                     code=HTTPStatus.BAD_REQUEST,
#                     message="Organisation is not Onboarded"
#                 )
#             if not organisation.name:
#
#                 log.info("Organisation doesn't have name")
#                 create_user_action_log(action='Project Initialization', status='Fail',
#                                        session_uuid=session['uuid'], resource_id=organisation_id,
#                                        resource_type='Organisation Id',
#                                        error_message="Organisation doesn't have name")
#                 #Throwing error as organisation doesn't have name, so it is not possible to create project
#                 abort(
#                     code=HTTPStatus.BAD_REQUEST,
#                     message="Organisation is not created"
#                 )
#             project_name = organisation.org_reg_code + '_default'
#             project_description = project_name
#             provider = Provider.query.filter_by(default=True).first()
#             print("provider", provider)
#             project = Project.query.filter_by(name=project_name).filter_by(organisation_id=organisation.id).first()
#             print("project", project)
#             if project is None:
#                 with db.session.begin():
#                     project = Project(organisation=organisation, name=project_name,
#                                       description=project_description,
#                                       user_id=current_user.id, project_type='system')
#                     db.session.add(project)
#                     log.info("Project created successfully.")
#             else:
#                 log.info("Project already exists.")
#                 create_user_action_log(action='Project Initialization', status='Fail',
#                                        session_uuid=session['uuid'], resource_id=organisation_id,
#                                        resource_type='Organisation Id', error_message="Already Created")
#                 abort(
#                     code=HTTPStatus.CONFLICT,
#                     message="Project Already Created"
#                 )
#
#             with db.session.begin():
#                 eula_id = args.pop('eula_id')
#                 project_id = generate_hash_for_number(project.id, 'project')
#                 project.project_id = project_id
#                 db.session.merge(project)
#                 # subscribe = Subscription(user_id=current_user.id, organisation_id=organisation.id,
#                 #                          provider_id=provider.id, project_id=project.id, eula_id=eula_id)
#                 # db.session.add(subscribe)
#                 user_role.project_id = project.id
#                 db.session.merge(user_role)
#
#             check_org_project_user = OrganisationProjectUser.query.filter_by(organisation_id=organisation.id).filter_by(
#                 project_id=project.id).filter_by(user_id=current_user.id).first()
#             if check_org_project_user is None:
#                 with db.session.begin():
#                     organisation_project_user = OrganisationProjectUser(organisation_id=organisation.id,
#                                                                         project_id=project.id, user_id=current_user.id)
#                     db.session.add(organisation_project_user)
#
#             task_id = tasks.projectInit_post.delay(organisation_id, provider.id, project.id, current_user.id, eula_id)
#             redis_obj = redis.Redis(BaseConfig.REDIS_HOST, charset="utf-8", decode_responses=True)
#             redis_obj.set(str(task_id), 'active')
#             redis_obj.expire(str(task_id), 12000)
#
#             with db.session.begin():
#                 project.action = "Initialising"
#                 project.task_id = str(task_id)
#                 db.session.merge(project)
#             create_user_action_log(action='Initialize Project Request by ID', status='Success',
#                                    session_uuid=session['uuid'], resource_id=organisation_id,
#                                    resource_type='Organisation Id')
#             return project
#         except Exception as e:
#             log.info(e)
#             create_user_action_log(action='Initialize Project Request by ID', status='Fail',
#                                    session_uuid=session['uuid'], resource_id=current_user.id,
#                                    resource_type='User Id', error_message=str(e))
#             user_role = UserRole.query.filter_by(project_id=None,
#                                                  user_id=current_user.id, user_role=1).first()
#             if not user_role:
#                 abort(
#                     code=HTTPStatus.BAD_REQUEST,
#                     message=str(e)
#                 )
#             project = Project.query.filter_by(organisation_id=user_role.organisation_id).first()
#             if not e.__dict__.get('data', {}).get('status') == HTTPStatus.CONFLICT and project is not None:
#                 db.session.delete(project)
#                 abort(
#                     code=HTTPStatus.BAD_REQUEST,
#                     message=str(e)
#                 )
#             else:
#                 abort(
#                     code=HTTPStatus.CONFLICT,
#                     message=str(e)
#                 )

#
# @api.route('/is_subscribed')
# class IsSubscribed(Resource):
#     @create_user_action_trails(action='Check Subscription Status')
#     @api.login_required(oauth_scopes=['auth:read'])
#     @ratelimit(rate=RateConfig.medium)
#     @api.response(schemas.BaseSubscriptionSchema())
#     def get(self):
#         try:
#             user_role = UserRole.query.filter_by(user_id=current_user.id).first()
#             organisation_id = user_role.organisation_id
#             subscription_obj = Subscription.query.filter_by(organisation_id=organisation_id).first()
#             if subscription_obj:
#                 create_user_action_log(action='Check Subscription Status', status='Success',
#                                        session_uuid=session['uuid'], resource_id=subscription_obj.id,
#                                        resource_type='Subscription Id',
#                                        error_message="User Doesn't have required Permission")
#                 return subscription_obj
#             else:
#                 create_user_action_log(action='Check Subscription Status', status='Success',
#                                        session_uuid=session['uuid'], resource_id=current_user.id,
#                                        resource_type='User Id'
#                                        )
#                 return {}
#
#
#         except Exception as e:
#             log.error(e)
#             create_user_action_log(action='Check Subscription Status', status='Fail',
#                                    session_uuid=session['uuid'], resource_id=current_user.id,
#                                    resource_type='User Id', error_message=str(e))
#             abort(
#                 code=HTTPStatus.BAD_REQUEST,
#                 message=str(e)
#             )