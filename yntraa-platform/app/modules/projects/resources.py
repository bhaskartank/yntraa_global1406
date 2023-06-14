# encoding: utf-8
# pylint: disable=bad-continuation
"""
RESTful API Projects resources
--------------------------
"""

import logging
import os
import types
from app.modules.role_permission.models import UserRole
from flask_login import current_user
from flask_restplus_patched import Resource
from flask_restplus_patched._http import HTTPStatus

from app.extensions import db, Docker
from app.extensions.api import Namespace, abort
from app.extensions.api.parameters import PaginationParameters, SortPaginateParameters
from app.modules.users import permissions
from app.modules.users.permissions import check_permission
from app.modules.users.models import User
from app.modules.networks.models import Network, ReserveFloatingIP, Subnet, Router, SecurityGroup, SecurityGroupRule, DefaulRules, DefaultAccessPorts
from app.modules.compute.models import Flavors, Compute, Images
from app.modules.public_ips.models import PublicIPRequest
from app.modules.load_balancers.models import LoadBalancer
from app.modules.scaling_groups.models import ScalingGroup
from app.modules.nas_volumes.models import NasRequest
from . import parameters, schemas
from app.modules import create_resource_action_log, check_scope_and_auth_token, get_organisation_current_resource_utlization_on_provider, \
    verify_parameters, check_available_resources, get_token, RateConfig, generate_hash_for_number, create_user_action_log, create_user_action_trails
from app.modules.organisations.models import Organisation, OrganisationProjectUser, OrganisationQuotaPackage
from .models import Project, ProjectProviderMapping, ProjectGatewayService,ProjectMeta, ProjectTechnologyDetails
from app.modules.backup_services.models import BackupServerProvider, ProtectionGroup
from app.modules.providers.models import Provider, ProviderType, ServiceProvider, ServiceType
from app.extensions.flask_limiter import ratelimit
from . import tasks
#from app.modules.users import tasks
from flask import jsonify, session
log = logging.getLogger(__name__)  # pylint: disable=invalid-name
api = Namespace('organisation', description="Projects")  # pylint: disable=invalid-name
import redis, json
from config import BaseConfig

@api.route('/projects/')
class ProjectsWithOrganisation(Resource):
    """project
    Manipulations with Organisation.
    """

    @create_user_action_trails(action='Get List of Projects')
    @check_scope_and_auth_token('projects:read')
    @api.login_required(oauth_scopes=['projects:read'])
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    #@api.parameters(PaginationParameters())
    @api.response(schemas.DetailedProjectSchema(many=True))
    @api.paginate()
    def get(self, args):
        """
        List of Project with organisation.
        Returns a list of Project starting from ``offset`` limited by ``limit``
        parameter.
        """
        from sqlalchemy import or_
        #return Project.query.offset(args['offset']).limit(args['limit'])
        try:
            resp = Project.query.filter(or_(Project.status != 'Deleted',Project.status.is_(None)))
            create_user_action_log(action='Get List of Projects',status='Success',session_uuid=session['uuid'], resource_type='Project')
            return resp
        except Exception as e:
            log.info("Exception: %s", e)
            create_user_action_log(action='Get List of Projects',status='Fail',session_uuid=session['uuid'], resource_type='Project', error_message=str(e))
            abort(
                code=HTTPStatus.NOT_FOUND,
                message="Record not found"
            )

@api.route('/<int:organisation_id>/project/')
@api.response(
    code=HTTPStatus.NOT_FOUND,
    description="Organisation not found.",
)
@api.resolve_object_by_model(Organisation, 'organisation')
class Projects(Resource):
    """project
    Manipulations with Projects.
    """
    @create_user_action_trails(action='Get List of Projects by Organisation ID')
    @check_scope_and_auth_token('projects:read')
    @api.login_required(oauth_scopes=['projects:read'])
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    @api.parameters(SortPaginateParameters())
    @api.response(schemas.BaseProjectSchema(many=True))
    @api.paginate()
    @api.sort()
    def get(self, args, organisation):
        """
        List of Project.

        Returns a list of Project starting from ``offset`` limited by ``limit``
        parameter.
        """
        from sqlalchemy import or_

        try:

            org_project_user = OrganisationProjectUser.query.filter_by(user_id=current_user.id,organisation_id=organisation.id).all()
            if (current_user.is_admin and org_project_user is not None) or (current_user.is_internal):
                create_user_action_log(action='Get List of Projects by Organisation ID',status='Success',session_uuid=session['uuid'], resource_type='Project')
                project_list = Project.query.filter(Project.organisation_id == organisation.id, or_(Project.status != 'Deleted', Project.status == None))
                # project_list = [project for project in organisation.project_organisation[args['offset']: args['offset'] + args['limit']] if project.status != 'Deleted']

                return project_list

            else:
                with api.commit_or_abort(
                        db.session,
                        default_error_message="Failed to fetch user project list"
                ):
                    project_ids = list()

                    for data in org_project_user:
                        project_ids.append(data.project_id)

                    if len(project_ids) > 0:
                        project_ids = tuple(project_ids)
                        create_user_action_log(action='Get List of Projects by Organisation ID',status='Success',session_uuid=session['uuid'], resource_type='Project')
                        return db.session.query(Project).filter(Project.id.in_(project_ids))
                    else:
                        create_user_action_log(action='Get List of Projects by Organisation ID',status='Fail',session_uuid=session['uuid'], resource_type='Project', error_message="Project not found for this user")
                        abort(
                            code=HTTPStatus.NOT_FOUND,
                            message="Project not found for this user"
                        )
        except Exception as e:
            log.info("Exception: %s", e)
            create_user_action_log(action='Get List of Projects by Organisation ID',status='Fail',session_uuid=session['uuid'], resource_type='Project', error_message=str(e))
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    @create_user_action_trails(action='Create New Instance of Project')
    @check_scope_and_auth_token('projects:write')
    @api.login_required(oauth_scopes=['projects:read'])
    @ratelimit(rate=RateConfig.low)
    @api.permission_required(permissions.AdminRolePermission())
    @verify_parameters()
    @api.parameters(parameters.CreateProjectParameters())
    @api.response(schemas.DetailedProjectSchema())
    @api.response(code=HTTPStatus.CONFLICT)
    def post(self, args, organisation):
        """
        Create a new instance of Project.
        """
        from app.modules.role_permission.models import UserRole, RolePermissionGroup

        with api.commit_or_abort(
                db.session,
                default_error_message="Failed to create a new Project"
            ):
            error_msg = "Bad request"
            error_code = HTTPStatus.BAD_REQUEST
            meta = ''
            project_name = args.pop('name').lower()
            try:
                user_id = current_user.id

                user = User.query.get(user_id)

                if user is None:
                    error_msg = "User with id {} does not exist".format(user_id)
                    create_user_action_log(action='Create New Instance of Project',status='Fail',session_uuid=session['uuid'], resource_type='Project', resource_name=project_name, error_message=error_msg)
                    error_code = HTTPStatus.NOT_FOUND
                    abort(
                        code=HTTPStatus.NOT_FOUND,
                        message="User with id %d does not exist" % user_id
                    )
                if 'project_meta' in args:
                    meta = args.pop('project_meta')
                    for val in meta:
                        if ':' not in val:
                            error_msg = "Invalid parameter. Meta value should be in 'key:value' format."
                            error_code = HTTPStatus.UNPROCESSABLE_ENTITY
                            create_user_action_log(action='Create New Instance of Project',status='Fail',session_uuid=session['uuid'], resource_type='Project', resource_name=project_name, error_message=error_msg)
                            
                            abort(
                                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                                message="Invalid parameter. Meta value should be in 'key:value' format."
                            )
                new_project = Project(organisation = organisation, user = user,name=project_name, **args)

            except Exception as e:
                log.info("Exception: %s", e)
                create_user_action_log(action='Create New Instance of Project',status='Fail',session_uuid=session['uuid'], resource_type='Project', resource_name=project_name, error_message=str(e))
                abort(
                    code=error_code,
                    message=error_msg
                )


            project = Project.query.filter_by(name=project_name, organisation_id=organisation.id).first()
            if project is not None:
                create_user_action_log(action='Create New Instance of Project',status='Fail',session_uuid=session['uuid'], resource_type='Project', resource_name=project_name, error_message="Project with name '{}' already exist.".format(project_name))
                abort(
                    code=HTTPStatus.CONFLICT,
                    message="Project with name '{}' already exist.".format(project_name)
                )

            project_description = args.pop('description')
            db.session.add(new_project)



        with db.session.begin():
            project_id = generate_hash_for_number(new_project.id, 'project')
            new_project.project_id = project_id
            db.session.merge(new_project)

            create_resource_action_log(db,
                                        resource_type='project', 
                                        resource_record_id=new_project.id, 
                                        action='created', 
                                        resource_configuration='Project Created', 
                                        user_id=current_user.id, 
                                        project_id=new_project.id, 
                                        organisation_id=organisation.id, 
                                        provider_id=0
                                        )

        """
        Assign role and this project to created user 
        """
        with api.commit_or_abort(
                db.session,
                default_error_message="Failed to assign role and project to this user"
            ):

            organisation_id = organisation.id
            project_id = new_project.id
            user_id = user_id
            #scope = ['organisations:read','projects:read','projects:write']
            rolepermission = RolePermissionGroup.query.filter_by(group_name='Organisation_Administrator').one_or_none()

            user_roles = UserRole(user_id=user_id, project_id = project_id, organisation_id = organisation_id, user_role=rolepermission.id)
            db.session.add(user_roles)

            """
            Project Mapping to User
            """
            organisation_project_users = OrganisationProjectUser(user_id=user_id, organisation_id=organisation_id,project_id=project_id)
            db.session.add(organisation_project_users)


        with db.session.begin():
            for val in meta:
                meta_dict = val.split(':')
                key = meta_dict[0]
                value = meta_dict[1]
                project_meta = ProjectMeta(project=new_project, meta_label=str(key), meta_value=str(value))
                db.session.add(project_meta)

        create_user_action_log(action='Create New Instance of Project',status='Success',session_uuid=session['uuid'],resource_type='Project', resource_name=project_name, resource_id=project_id)
        return new_project


@api.route('/<int:organisation_id>/<int:project_id>')
@api.response(
    code=HTTPStatus.NOT_FOUND,
    description="Project not found.",
)
@api.resolve_object_by_model(Organisation, 'organisation')
@api.resolve_object_by_model(Project, 'project')
class ProjectByID(Resource):
    """
    Manipulations with a specific Project.
    """

    @create_user_action_trails(action='Get Project Details by ID')
    @ratelimit(rate=RateConfig.medium)
    @check_scope_and_auth_token('projects:read')
    @api.login_required(oauth_scopes=['projects:read'])
    @verify_parameters()
    @api.response(schemas.DetailedProjectSchema())
    def get(self, project, organisation):
        """
        Get Project details by ID.
        """
        
        try:
            project = Project.query.filter_by(id=project.id, organisation_id=organisation.id).first_or_404()
            create_user_action_log(action='Get Project Details by ID',status='Success',session_uuid=session['uuid'], resource_id=project.id,resource_type='Project', resource_name=project.name)
            return project
        except Exception as e:
            log.info("Exception: %s", e)
            create_user_action_log(action='Get Project Details by ID',status='Fail',session_uuid=session['uuid'], resource_id=project.id,resource_type='Project', resource_name=project.name, error_message=str(e))
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    @create_user_action_trails(action='Patch Project Details by ID')
    @check_scope_and_auth_token('projects:write')
    @api.login_required(oauth_scopes=['projects:read'])
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    @api.parameters(parameters.PatchProjectDetailsParameters())
    @api.response(schemas.DetailedProjectSchema())
    @api.response(code=HTTPStatus.CONFLICT)
    def patch(self, args, project, organisation):
        """
        Patch Project details by ID.
        """
        with api.commit_or_abort(
                db.session,
                default_error_message="Failed to update Project details."
            ):
            try:
                parameters.PatchProjectDetailsParameters.perform_patch(args, obj=project)
                db.session.merge(project)
            except Exception as e:
                log.info("Exception: %s", e)
                create_user_action_log(action='Patch Project Details by ID',status='Fail',session_uuid=session['uuid'],  resource_id=project.id,resource_type='Project', resource_name=project.name, error_message=str(e))
                abort(
                    code=HTTPStatus.UNPROCESSABLE_ENTITY,
                    message="%s" % e
                )

        create_user_action_log(action='Patch Project Details by ID',status='Success',session_uuid=session['uuid'], resource_id=project.id,resource_type='Project', resource_name=project.name)
        return project

    @create_user_action_trails(action='Delete Project by ID')
    @check_scope_and_auth_token('projects:write')
    @api.login_required(oauth_scopes=['projects:write'])
    @ratelimit(rate=RateConfig.medium)
    @api.response(code=HTTPStatus.CONFLICT)
    #@api.response(code=HTTPStatus.NO_CONTENT)
    def delete(self, project, organisation):
        """
        Delete a uninitialized Project by ID.
        """
        project_id = project.id
        error_code = None
        error_msg = None

        try:
            if project.status == 'Deleted':
                error_code = HTTPStatus.BAD_REQUEST
                error_msg = f"Project with id {project.id} already deleted"
                create_user_action_log(action='Delete Project by ID',status='Fail',session_uuid=session['uuid'], resource_id=project.id,resource_type='Project', error_message=error_msg)
                abort(
                    code = error_code,
                    message = error_msg
                )
            chk_project_provider_mapping = ProjectProviderMapping.query.filter_by(project_id=project.id).all()
            if len(chk_project_provider_mapping) > 0:
                provider_list = []
                for mapping in chk_project_provider_mapping:
                    provider = Provider.query.get(mapping.provider_id)
                    log.info(provider.provider_location)
                    provider_list.append(provider.provider_location)

                error_code = HTTPStatus.BAD_REQUEST
                error_msg = f"Project with id {project.id} cannot be deleted, Project is initialized on provider: {provider_list}"
                create_user_action_log(action='Delete Project by ID',status='Fail',session_uuid=session['uuid'], resource_id=project.id,resource_type='Project', error_message=error_msg)
                abort(
                    code = error_code,
                    message = error_msg
                )

            org_users = db.session.query(OrganisationProjectUser).with_entities(OrganisationProjectUser.user_id).filter(OrganisationProjectUser.organisation_id == organisation.id).distinct().all()
            org_user_list = list(*zip(*org_users))

            if current_user.id not in org_user_list:
                error_code = HTTPStatus.FORBIDDEN
                error_msg = "Current user not from organisation"
                create_user_action_log(action='Delete Project by ID',status='Fail',session_uuid=session['uuid'], resource_id=project.id,resource_type='Project', error_message=error_msg)
                abort(
                    code = error_code,
                    message = error_msg
                )

            project_meta_details = ProjectMeta.query.filter_by(project_id=project.id).all()
            if len(project_meta_details) > 0:
                for project_meta in project_meta_details:
                    with db.session.begin():
                        db.session.delete(project_meta)

            project_users = OrganisationProjectUser.query.filter_by(project_id=project.id, organisation_id=organisation.id).all()
            if len(project_users) > 0:
                for user in project_users:
                    with db.session.begin():
                        db.session.delete(user)

            project_user_roles = UserRole.query.filter_by(project_id=project.id, organisation_id=organisation.id).all()
            if len(project_user_roles) > 0:
                for user_role in project_user_roles:
                    with db.session.begin():
                        db.session.delete(user_role)

            with db.session.begin():
                project.status = 'Deleted'
                db.session.merge(project)
                create_resource_action_log(db,
                                        resource_type='project', 
                                        resource_record_id=project_id,
                                        action='deleted', 
                                        resource_configuration='Project Deleted', 
                                        user_id=current_user.id, 
                                        project_id=project_id,
                                        organisation_id=organisation.id,
                                        provider_id=0
                                        )

            create_user_action_log(action='Delete Project by ID',status='Success',session_uuid=session['uuid'],resource_id=project.id,resource_type='Project')
            return {"message": "Successfully Deleted!"}, 202
        except Exception as e:
            if error_code:
                create_user_action_log(action='Delete Project by ID',status='Fail',session_uuid=session['uuid'],resource_id=project_id,resource_type='Project',error_message=error_msg)
                abort(code=error_code,message=error_msg)
            else:
                create_user_action_log(action='Delete Project by ID',status='Fail',session_uuid=session['uuid'],resource_id=project_id,resource_type='Project',error_message=str(e))
                abort(code=HTTPStatus.UNPROCESSABLE_ENTITY, message=f'{str(e)}')

            
        # project_id = project.id
        # organisation_id = organisation.id
        # project = Project.query.get(project_id)
        # if project is None:
        #     create_user_action_log(action='Delete Project by ID',status='Fail',session_uuid=session['uuid'], resource_id=project.id,resource_type='Project', resource_name=project.name, error_message=f"Project with id {project_id} not found")
        #     abort(
        #         code=HTTPStatus.NOT_FOUND,
        #         message="Project with id {} not found".format(project_id)
        #     )

        # with api.commit_or_abort(
        #         db.session,
        #         default_error_message="Failed to delete the Project."
        #     ):
        #     db.session.delete(project)

        # with db.session.begin():
        #     create_resource_action_log(db,
        #                                 resource_type='project', 
        #                                 resource_record_id=project_id,
        #                                 action='deleted', 
        #                                 resource_configuration='Project Deleted', 
        #                                 user_id=current_user.id, 
        #                                 project_id=project_id,
        #                                 organisation_id=organisation_id,
        #                                 provider_id=0
        #                                 )

        # create_user_action_log(action='Delete Project by ID',status='Success',session_uuid=session['uuid'], resource_id=project.id,resource_type='Project', resource_name=project.name)
        # return jsonify({"message":"success"})

@api.route('/<int:organisation_id>/<int:provider_id>/<int:project_id>/init/')
@api.response(
    code=HTTPStatus.NOT_FOUND,
    description="project not found.",
)
@api.resolve_object_by_model(Organisation, 'organisation')
@api.resolve_object_by_model(Provider, 'provider')
@api.resolve_object_by_model(Project, 'project')
class ProjectInit(Resource):

    @create_user_action_trails(action='Initialize Project')
    @check_scope_and_auth_token('projects:write')
    @api.login_required(oauth_scopes=['projects:read'])
    @api.permission_required(permissions.AdminRolePermission())
    @verify_parameters()
    @ratelimit(rate=RateConfig.low)
    #@api.response(schemas.DetailedProjectSchema(), code=202)
    # @api.response(code=HTTPStatus.CONFLICT)
    def post(self, organisation, provider, project):
        """
        Initialise project on openstack
        """
        from sqlalchemy import or_
        if not provider.is_active:
            create_user_action_log(action='Initialize Project',status='Fail',session_uuid=session['uuid'], resource_id=project.id,resource_type='Project', resource_name=project.name, error_message="Requested provider is not active")
            abort(
                code=HTTPStatus.BAD_REQUEST,
                message="Requested provider is not active"
            )
        provider_id = provider.id
        project_id = project.id
        user_id = current_user.id
        project_provider = ProjectProviderMapping.query.filter_by(project_id=project_id, provider_id=provider_id).first()
        if project_provider is not None:
            create_user_action_log(action='Initialize Project',status='Fail',session_uuid=session['uuid'], resource_id=project.id,resource_type='Project', resource_name=project.name, error_message="Project with id {} already available on the provider with id {}".format(project_id,provider_id))
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="Project with id {} already available on the provider with id {}".format(project_id,provider_id)
            )

        organisation_quotaPackage = OrganisationQuotaPackage.query.filter_by(provider_id=provider_id, organisation_id= organisation.id).first()

        if organisation_quotaPackage is None:
            create_user_action_log(action='Initialize Project',status='Fail',session_uuid=session['uuid'], resource_id=project.id,resource_type='Project', resource_name=project.name, error_message="Organisation with id {} have not quota on the provider with id {}".format(organisation.id, provider_id))
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="Organisation with id {} have not quota on the provider with id {}".format(organisation.id, provider_id)
            )

        resources_required_for_project_init = {
            'floatingip': 1,
            'project': 1,
            'network': 2,
            'subnet': 2,
            'router': 1,
        }

        is_backup_enabled = ServiceProvider.query.join(ServiceType).filter(ServiceType.name.ilike('backup'), ServiceProvider.provider_id==provider_id, ServiceProvider.is_active==True).first()
        if is_backup_enabled:
            resources_required_for_project_init['securitygroup'] = 3
            resources_required_for_project_init['securitygrouprule'] = DefaulRules.query.filter(DefaulRules.provider_id==provider_id, or_(DefaulRules.resource_type.ilike('vm'), DefaulRules.resource_type.ilike('gateway'), DefaulRules.resource_type.ilike('backup')), DefaulRules.status.ilike('active')).count()
        else:
            resources_required_for_project_init['securitygroup'] = 2
            resources_required_for_project_init['securitygrouprule'] = DefaulRules.query.filter(DefaulRules.provider_id==provider_id, or_(DefaulRules.resource_type.ilike('vm'), DefaulRules.resource_type.ilike('gateway')), DefaulRules.status.ilike('active')).count()

        org_current_utilization = get_organisation_current_resource_utlization_on_provider(organisation_id=organisation.id, provider_id=provider_id)

        quota_exceeded_list = []
        for resource, count in resources_required_for_project_init.items():
            if org_current_utilization[resource]['available']['value'] < count:
                quota_exceeded_list.append(resource)
            else:
                log.info(f'Has sufficient quota for {resource}')

        if quota_exceeded_list:
            error_message = f'Quota exceeded for {quota_exceeded_list}, cannot initialize project'
            log.info(error_message)
            create_user_action_log(action='Initialize Project',status='Fail',session_uuid=session['uuid'], resource_id=project.id,resource_type='Project', resource_name=project.name, error_message=error_message)
            abort(
                code=HTTPStatus.BAD_REQUEST,
                message=error_message
            )

        with api.commit_or_abort(
                db.session,
                default_error_message="Failed to Initialize a new Project"
            ):
            new_project = Project.query.filter(Project.id==project_id).filter(or_(Project.status != 'Deleted',Project.status.is_(None))).first()
            if new_project is None:
                create_user_action_log(action='Initialize Project',status='Fail',session_uuid=session['uuid'], resource_id=project.id,resource_type='Project', resource_name=project.name, error_message=f'Project with id {project_id} not found')
                abort(
                    code=HTTPStatus.NOT_FOUND,
                    message="Project with id {} not found".format(project_id)
                )

        task_id = tasks.projectInit_post.delay(organisation.id, provider_id, project_id, user_id)
        redis_obj = redis.Redis(BaseConfig.REDIS_HOST, charset="utf-8", decode_responses=True)
        redis_obj.set(str(task_id), 'active')
        redis_obj.expire(str(task_id), 12000)
        create_user_action_log(action='Initialize Project',status='InProgress',ref_task_id=task_id,session_uuid=session['uuid'], resource_id=project.id,resource_type='Project', resource_name=project.name)

        with db.session.begin():
            new_project.action = "Initialising"
            new_project.task_id = str(task_id)
            db.session.merge(new_project)
        data = {'message': 'processing', 'task_id': str(task_id)}
        response = jsonify(data)
        response.status_code = 202
        return response

@api.route('/<int:organisation_id>/<int:provider_id>/<int:project_id>/routable_ip/')
@api.response(
    code=HTTPStatus.NOT_FOUND,
    description="Project not found.",
)
@api.resolve_object_by_model(Organisation, 'organisation')
@api.resolve_object_by_model(Provider, 'provider')
@api.resolve_object_by_model(Project, 'project')
class RoutableIPListinProjectByID(Resource):
    """
    Manipulations with a specific Routable IP List for Organisation Project on Provider.
    """

    @create_user_action_trails(action='Get Routable IP List by Project ID')
    @ratelimit(rate=RateConfig.medium)
    @check_scope_and_auth_token('projects:read')
    @api.login_required(oauth_scopes=['projects:read'])
    #@check_permission('projects:read')
    @verify_parameters()
    @api.response(schemas.RoutableIPSchema(many=True))
    def get(self, organisation, provider, project):
        """
        Get Routable IP List for Organisation Project on Provider by Project ID.
        """
        project_id = project.id
        provider_id = provider.id
        user_id = current_user.id

        routable_ip_list = []

        #-------------- Snat IP ------------------------------------
        project_router = Router.query.filter(Router.project_id==project_id, Router.provider_id==provider_id).first()
        if project_router:
            routable_ip_schema = types.SimpleNamespace()
            routable_ip_schema.routable_ip = project_router.snat_ip
            routable_ip_schema.attached_with = "Snat"
            routable_ip_list.append(routable_ip_schema)

        #------------- To Get Gateway IP ----------------------------
        project_provider = ProjectProviderMapping.query.filter_by(project_id=project_id, provider_id=provider_id).first()
        if project_provider is None:
            error_msg = f"Project with id {project_id} is not available on the provider with id {provider_id}"
            create_user_action_log(action='Get Routable IP List by Project ID',status='Fail',session_uuid=session['uuid'], error_message=error_msg)
            abort(
                code=HTTPStatus.NOT_FOUND,
                message=error_msg
            )
        
        routable_ip_schema = types.SimpleNamespace()
        routable_ip_schema.routable_ip = project_provider.gw_device_ip
        routable_ip_schema.attached_with = "Gateway"
        routable_ip_list.append(routable_ip_schema)

        #------------- To Get LB IP ----------------------------
        loadbalancer_details = LoadBalancer.query.filter_by(project_id=project_id, provider_id=provider_id).filter(LoadBalancer.status.ilike('Active')).all()
        if loadbalancer_details is None:
            error_msg = f"LoadBalancer with project id {project_id} is not available on the provider with id {provider_id}"
            create_user_action_log(action='Get Routable IP List by Project ID',status='Fail',session_uuid=session['uuid'], error_message=error_msg)
            abort(
                code=HTTPStatus.NOT_FOUND,
                message=error_msg
            )
        for lb in loadbalancer_details:
            if lb.lb_device_ip:
                routable_ip_schema = types.SimpleNamespace()
                routable_ip_schema.routable_ip = lb.lb_device_ip
                routable_ip_schema.attached_with = "LoadBalancer"
                routable_ip_list.append(routable_ip_schema)

        #------------- To Get ScalingGroup IP ----------------------------
        scalinggroup_details = ScalingGroup.query.filter_by(project_id=project_id, provider_id=provider_id).filter(ScalingGroup.status.ilike('Active')).all()
        if scalinggroup_details is None:
            error_msg = f"ScalingGroup with project id {project_id} is not available on the provider with id {provider_id}"
            create_user_action_log(action='Get Routable IP List by Project ID',status='Fail',session_uuid=session['uuid'], error_message=error_msg)
            abort(
                code=HTTPStatus.NOT_FOUND,
                message=error_msg
            )

        for sg in scalinggroup_details:
            if sg.lb_vm_ip:
                routable_ip_schema = types.SimpleNamespace()
                routable_ip_schema.routable_ip = sg.lb_vm_ip
                routable_ip_schema.attached_with = "ScalingGroup"
                routable_ip_list.append(routable_ip_schema)

        #----------------To Get VM IP-------------------------------#
        vm_floating_ip_detail = ReserveFloatingIP.query.filter_by(attached_with_resource='vm', project_id=project_id, provider_id=provider_id).join(Compute).filter(Compute.status.ilike('active')).all()
        for vm in vm_floating_ip_detail:
            routable_ip_schema = types.SimpleNamespace()
            routable_ip_schema.routable_ip = vm.floating_ip
            routable_ip_schema.attached_with = "vm"
            routable_ip_list.append(routable_ip_schema)
        log.info("Routable IP {} ".format(routable_ip_list))
        create_user_action_log(action='Get Routable IP List by Project ID',status='Success',session_uuid=session['uuid'])
        return routable_ip_list
        

@api.route('/<int:provider_id>/<int:project_id>/gateway/')
@api.response(
    code=HTTPStatus.NOT_FOUND,
    description="Project not found.",
)
@api.resolve_object_by_model(Provider, 'provider')
@api.resolve_object_by_model(Project, 'project')
class ProjectGatewayByID(Resource):
    """
    Gateway Operations of a specific Project.
    """

    @create_user_action_trails(action='Get Project Gateway Services')
    @check_scope_and_auth_token('project_gateway:read')
    @api.login_required(oauth_scopes=['project_gateway:read'])
    @check_permission('projects:read')
    @verify_parameters()
    @ratelimit(rate=RateConfig.low)
    @api.response(schemas.GatewaySchema())
    @api.paginate()
    def get(self,args, project, provider):
        """
        Get Project Gateway services
        """
        project_id = project.id
        provider_id = provider.id
        try:
            gateway = types.SimpleNamespace()
            project_mapping = ProjectProviderMapping.query.filter_by(project_id=project_id, provider_id=provider_id)
            securitygroup = SecurityGroup.query.filter_by(project_id=project_id, provider_id=provider_id, is_gw_security_group=True).filter(SecurityGroup.status.ilike('Active')).one_or_none()
            project_mapping1 = ProjectProviderMapping.query.filter_by(project_id=project_id,
                                                                     provider_id=provider_id).first_or_404()
            router = Router.query.filter_by(project_id=project_id, provider_id=provider_id).first()
            gateway = project_mapping
            if securitygroup is not None:
                create_user_action_log(action='Get Project Gateway Services',status='Fail',session_uuid=session['uuid'])
                gateway.security_group_id = securitygroup.id
                gateway.gw_device_ip = project_mapping1.gw_device_ip
                gateway.gw_device_id = project_mapping1.gw_device_id
                gateway.provider_id = project_mapping1.provider_id
                gateway.project_id = project_mapping1.project_id
                gateway.snat_ip = router.snat_ip

            create_user_action_log(action='Get Project Gateway Services',status='Success',session_uuid=session['uuid'])
            return gateway
        except Exception as e:
            log.info("Exception: %s", e)
            create_user_action_log(action='Get Project Gateway Services',status='Fail',session_uuid=session['uuid'], error_message=str(e))
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

@api.route('/<int:provider_id>/<int:project_id>/gateway_services/')
@api.response(
    code=HTTPStatus.NOT_FOUND,
    description="Project not found.",
)
@api.resolve_object_by_model(Provider, 'provider')
@api.resolve_object_by_model(Project, 'project')
class ProjectGatewayServceByID(Resource):
    """
    Gateway Operations of a specific Project.
    """

    @create_user_action_trails(action='Get Project Gateway Services by Project ID')
    @check_scope_and_auth_token('project_gateway:read')
    @api.login_required(oauth_scopes=['project_gateway:read'])
    @verify_parameters()
    @ratelimit(rate=RateConfig.medium)
    @api.parameters(SortPaginateParameters())
    # @api.response(schemas.DetailedProjectGatewayServiceSchema(many=True))
    #@api.paginate()
    def get(self, args, project, provider):
        """
        Get Project Gateway services
        """
        from sqlalchemy.exc import ProgrammingError
        provider_id = provider.id
        project_id = project.id
        error_msg = None
        error_code = None

        offset = args.get('offset', 0)
        limit = args.get('limit', 20)
        field = args.get('field', 'id')
        order_by_param = args.get('order', 'desc')

        try:
            project = Project.query.get(project_id)
            if project is None:
                error_msg = "Project not found"
                error_code = HTTPStatus.NOT_FOUND
                create_user_action_log(action='Get Project Gateway Services by Project ID',status='Fail',session_uuid=session['uuid'],resource_type='ProjectGatewayService', error_message=error_msg)
                abort(
                    code = error_code,
                    message = error_msg
                )

            _gateway = ProjectProviderMapping.query.filter_by(project_id=project_id, provider_id=provider_id).first_or_404()

            if order_by_param.lower() == 'desc':
                from sqlalchemy import desc
                field = desc(field)
            _gateway_services_queryset = ProjectGatewayService.query.filter_by(project_id=project_id, provider_id=provider_id).order_by(field)
            # Throws ProgrammingError if invalid field name is provided.
            _gateway_services_queryset.count()

            try:
                total_count = _gateway_services_queryset.count()
            except:
                total_count = len(_gateway_services_queryset)

            _gateway_services = _gateway_services_queryset.offset(offset).limit(limit).all()

            docker_provider = types.SimpleNamespace()
            docker_provider.auth_url = "tcp://"+_gateway.gw_device_ip+":5000"
            for i, _gateway_service in enumerate(_gateway_services):
                try:
                    _service = Docker.get_server(docker_provider,_gateway_service.service_name)
                    _gateway_service.service_status = _service.status
                    _gateway_service.device_status = _service.status
                    _gateway_services[i] = _gateway_service
                except  Exception as e:
                    log.info(e)
                    error_code = HTTPStatus.UNPROCESSABLE_ENTITY
                    error_msg = str(e)
                    create_user_action_log(action='Get Project Gateway Services by Project ID',status='Fail',session_uuid=session['uuid'],resource_type='ProjectGatewayService', error_message=error_msg)
                    if "HTTPConnectionPool" in error_msg:
                        error_msg = "connection time out.Not able connect with gateway server"
                        abort(
                            code = error_code,
                            message = error_msg
                        )
                    else:
                        abort(
                            code = error_code,
                            message = error_msg
                        )

            create_user_action_log(action='Get Project Gateway Services by Project ID',status='Success',resource_type='ProjectGatewayService',session_uuid=session['uuid'])
            _gateway_service_schema = schemas.DetailedProjectGatewayServiceSchema(many=True)
            _gateway_services = _gateway_service_schema.dump(_gateway_services).data

            return (_gateway_services, HTTPStatus.OK, {'X-Total-Count': total_count, 'Access-Control-Expose-Headers':'X-Total-Count'})
        except ProgrammingError:
            error_msg = f"Provided field name '{field}' is invalid."
            log.error(error_msg)
            abort(
                code=HTTPStatus.BAD_REQUEST,
                message=error_msg
            )
        except Exception as e:
            if error_code:
                log.info("Exception: %s", error_msg)
                create_user_action_log(action='Get Project Gateway Services by Project ID',status='Fail',resource_type='ProjectGatewayService',session_uuid=session['uuid'], error_message=error_msg)
                abort(
                    code=error_code,
                    message=error_msg
                )
            else:
                log.info("Exception: %s", e)
                create_user_action_log(action='Get Project Gateway Services by Project ID',status='Fail',resource_type='ProjectGatewayService',session_uuid=session['uuid'], error_message=str(e))
                abort(
                    code=HTTPStatus.UNPROCESSABLE_ENTITY,
                    message="%s" % e
                )


    @create_user_action_trails(action='Create New Instance of Gateway Service')
    @check_scope_and_auth_token('project_gateway:write')
    @api.login_required(oauth_scopes=['project_gateway:write'])
    @api.parameters(parameters.CreateProjectGatewayServiceParameters())
    @verify_parameters()
    @ratelimit(rate=RateConfig.low)
    @api.response(schemas.BaseProjectGatewayServiceSchema())
    @api.response(code=HTTPStatus.UNPROCESSABLE_ENTITY)
    def post(self, args, project, provider):
        """
        Create a new instance of Gateway Service.
        """
        provider_id = provider.id
        project_id = project.id
        error_msg = None,
        error_code = HTTPStatus.UNPROCESSABLE_ENTITY

        if not provider.is_active:
            create_user_action_log(action='Create New Instance of Gateway Service',status='Fail',session_uuid=session['uuid'],resource_type='ProjectGatewayService', error_message='Cannot perform action on inactive provider')
            abort(
                code=HTTPStatus.BAD_REQUEST,
                message='Cannot perform action on inactive provider'
            )
        try:
            try:
                _gateway = ProjectProviderMapping.query.filter_by(project_id=project_id, provider_id=provider_id).first_or_404()
                docker_provider = types.SimpleNamespace()
                docker_provider.auth_url = "tcp://"+_gateway.gw_device_ip+":5000"
                docker_image = provider.docker_registry + "/gateway_proxy"
                _service = Docker.list_servers(docker_provider)
                for service in _service:
                    try:
                        host = ''
                        port = ''
                        protocol = ''
                        port_details = service.ports
                        try:
                            for meta in port_details:
                                protocol = str(meta).split('/')[1]
                                host = port_details[meta][0]['HostIp']
                                port = port_details[meta][0]['HostPort']
                                
                        except Exception as e:
                            log.info(e)
                        service_destination =str(host)+':'+str(port) 
                        pgateway_service = ProjectGatewayService.query.filter_by(provider_id=provider_id, project_id=project_id, service_gw_port=port).first()
                        if pgateway_service is None and port:
                            with db.session.begin():
                                new_service = ProjectGatewayService(provider_id = provider_id, project_id = project_id)
                                new_service.service_name = service.name
                                new_service.device_status = service.status
                                new_service.service_status = service.status
                                new_service.service_protocol = protocol
                                new_service.service_gw_port = int(port)
                                new_service.service_destination = service_destination
                                new_service.managed_by = "system"
                                db.session.add(new_service)

                    except Exception as e:
                        log.info(e)
            except Exception as e:
                log.info(e)  

            new_service = ProjectGatewayService(provider_id = provider_id, project_id = project_id)
            new_service.service_name = args.pop('service_name')
            new_service.service_protocol = args.pop('service_protocol')
            service_gw_port = args.pop('service_gw_port')
            new_service.service_gw_port = service_gw_port
            project_gatway_service = ProjectGatewayService.query.filter_by(provider_id = provider_id, project_id = project_id, service_gw_port=service_gw_port).first()
            if project_gatway_service is not None:
                error_msg = "Service gateway port is already in use."
                error_code = HTTPStatus.CONFLICT
                create_user_action_log(action='Create New Instance of Gateway Service',status='Fail',session_uuid=session['uuid'],resource_type='ProjectGatewayService', error_message=error_msg)
                abort(
                    code=HTTPStatus.CONFLICT,
                    message="Service gateway port is already in use."
                )
            new_service.service_destination = args.pop('service_destination')
            destination = new_service.service_destination.split(":")
            destination_port = int(destination[1])
            if destination_port > 65535 or destination_port < 0:
                error_msg ="Invalid Port! Port mustbe Between 1 to 65535"
                error_code = HTTPStatus.UNPROCESSABLE_ENTITY
                create_user_action_log(action='Create New Instance of Gateway Service',status='Fail',session_uuid=session['uuid'],resource_type='ProjectGatewayService', error_message=error_msg)
                abort(
                    code=HTTPStatus.UNPROCESSABLE_ENTITY,
                    message="Invalid Port! Port mustbe Between 1 to 65535"
                )
            environment = {"PROTOCOL": new_service.service_protocol, "BIND": "0.0.0.0:"+new_service.service_gw_port, "BACKEND": new_service.service_destination}
            ports = {new_service.service_gw_port+'/'+new_service.service_protocol : new_service.service_gw_port}
            project = Project.query.get(project_id)
            provider = Provider.query.get(provider_id)
            provider_type = ProviderType.query.get(provider.provider_type_id)
            _provider = globals()[provider_type.name]
            gw_securitygroup = SecurityGroup.query.filter_by(project_id=project_id, provider_id=provider_id, security_group_name='gw_sec_group').filter(SecurityGroup.status.ilike('Active'), SecurityGroup.security_group_type.ilike('gateway')).first()
            if gw_securitygroup is None:
                error_msg = 'Default Gateway Security group not found'
                error_code = HTTPStatus.NOT_FOUND
                create_user_action_log(action='Create New Instance of Gateway Service',status='Fail',session_uuid=session['uuid'],resource_type='ProjectGatewayService', error_message=error_msg)
                abort(
                    code=error_code,
                    message=error_msg
                )
            gw_securitygroup_id = gw_securitygroup.provider_security_group_id
            default_securitygroup = SecurityGroup.query.filter_by(project_id=project_id, provider_id=provider_id, security_group_name='default').filter(SecurityGroup.status.ilike('Active'), SecurityGroup.security_group_type.ilike('project_default')).first()
            if default_securitygroup is None:
                error_msg = 'Project Default Security Group not found'
                error_code = HTTPStatus.NOT_FOUND
                create_user_action_log(action='Create New Instance of Gateway Service',status='Fail',session_uuid=session['uuid'],resource_type='ProjectGatewayService', error_message=error_msg)
                abort(
                    code=error_code,
                    message=error_msg
                )
            default_securitygroup_id = default_securitygroup.provider_security_group_id
            
            try:
                _new_service = Docker.run_server(docker_provider, image=docker_image, name=new_service.service_name, ports=ports, environment=environment)
                _service = Docker.get_server(docker_provider,new_service.service_name)
            except ConnectionError as e:
                error_msg = e
                error_code = HTTPStatus.UNPROCESSABLE_ENTITY
                create_user_action_log(action='Create New Instance of Gateway Service',status='Fail',session_uuid=session['uuid'],resource_type='ProjectGatewayService', error_message=error_msg)
                abort(
                    code=error_msg,
                    message='Exception in docker api'
                )
            new_service.service_status = _service.status
            new_service.device_status = _service.status
            new_service.managed_by = 'user'
            with db.session.begin():
                db.session.add(new_service)

            # Creating the security group rules for the added service

            #1. Ingress rule on gw_sec_group from VPN
            _gw_sec_group_rule = _provider.create_security_group_rule(provider, project_name=project.project_id, secgroup_name_or_id=gw_securitygroup_id, port_range_min=new_service.service_gw_port , port_range_max=new_service.service_gw_port, protocol=new_service.service_protocol, remote_ip_prefix='10.0.0.0/0', remote_group_id = None, direction='ingress', ethertype='IPv4', project_id=_gateway.provider_project_id)
            try:
                sec_group_rule_error = _gw_sec_group_rule.error
                if 'ConflictException: 409' in sec_group_rule_error:
                    log.info('vpn gw ingress rule already exists')
            except AttributeError:
                log.info('ingress rule on gw successfully added')
                with db.session.begin():
                    vpn_ingress_rule = SecurityGroupRule(
                        security_group_id = gw_securitygroup.id,
                        user_id = current_user.id,
                        port_range_min = _gw_sec_group_rule.port_range_min,
                        port_range_max = _gw_sec_group_rule.port_range_max,
                        protocol = _gw_sec_group_rule.protocol,
                        remote_ip_prefix = _gw_sec_group_rule.remote_ip_prefix,
                        direction = _gw_sec_group_rule.direction,
                        ethertype = "IPv4",
                        provider_security_group_rule_id = _gw_sec_group_rule.id,
                        status="Active",
                        managed_by='system'
                        )
                    db.session.add(vpn_ingress_rule)
                with db.session.begin():
                    create_resource_action_log(db,
                        resource_type='SecurityGroupRule',
                        resource_record_id=vpn_ingress_rule.id,
                        action='Created',
                        resource_configuration='SecurityGroupRule Created',
                        user_id=current_user.id,
                        project_id=project.id,
                        organisation_id=project.organisation_id,
                        provider_id=provider.id,
                        )

            #2. Egress rule on gw_sec_group to destination port and IP
            _gw_sec_group_rule_egress = _provider.create_security_group_rule(provider, project_name=project.project_id, secgroup_name_or_id=gw_securitygroup_id, port_range_min=destination_port, port_range_max=destination_port, protocol=new_service.service_protocol, remote_ip_prefix=destination[0], remote_group_id = None, direction='egress', ethertype='IPv4', project_id=_gateway.provider_project_id)
            try:
                sec_group_rule_error = _gw_sec_group_rule_egress.error
                if 'ConflictException: 409' in sec_group_rule_error:
                    log.info('egress rule on gw sec group already exists')
            except AttributeError:
                log.info('egress rule on gw successfully added')
                with db.session.begin():
                    gw_egress_rule = SecurityGroupRule(
                        security_group_id = gw_securitygroup.id,
                        user_id = current_user.id,
                        port_range_min = _gw_sec_group_rule_egress.port_range_min,
                        port_range_max = _gw_sec_group_rule_egress.port_range_max,
                        protocol = _gw_sec_group_rule_egress.protocol,
                        remote_ip_prefix = _gw_sec_group_rule_egress.remote_ip_prefix,
                        direction = _gw_sec_group_rule_egress.direction,
                        ethertype = "IPv4",
                        provider_security_group_rule_id = _gw_sec_group_rule_egress.id,
                        status="Active",
                        managed_by='system'
                        )
                    db.session.add(gw_egress_rule)
                with db.session.begin():
                    create_resource_action_log(db,
                        resource_type='SecurityGroupRule',
                        resource_record_id=gw_egress_rule.id,
                        action='Created',
                        resource_configuration='SecurityGroupRule Created',
                        user_id=current_user.id,
                        project_id=project.id,
                        organisation_id=project.organisation_id,
                        provider_id=provider.id,
                        )

            #3. Ingress rule on default sec group
            _default_sec_group_rule = _provider.create_security_group_rule(provider, project_name=project.project_id, secgroup_name_or_id=default_securitygroup_id, port_range_min=destination_port , port_range_max=destination_port, protocol=new_service.service_protocol, remote_ip_prefix='192.168.3.0/24', remote_group_id = None, direction='ingress', ethertype='IPv4', project_id=_gateway.provider_project_id)
            try:
                sec_group_rule_error = _default_sec_group_rule.error
                if 'ConflictException: 409' in sec_group_rule_error:
                    log.info('ingress rule on default sec group already exists')
            except AttributeError:
                log.info('ingress rule successfully added to default sec group')
                with db.session.begin():
                    default_ingress_rule = SecurityGroupRule(
                        security_group_id = default_securitygroup.id,
                        user_id = current_user.id,
                        port_range_min = _default_sec_group_rule.port_range_min,
                        port_range_max = _default_sec_group_rule.port_range_max,
                        protocol = _default_sec_group_rule.protocol,
                        remote_ip_prefix = _default_sec_group_rule.remote_ip_prefix,
                        direction = _default_sec_group_rule.direction,
                        ethertype = "IPv4",
                        provider_security_group_rule_id = _default_sec_group_rule.id,
                        status="Active",
                        managed_by='system'
                        )
                    db.session.add(default_ingress_rule)
                with db.session.begin():
                    create_resource_action_log(db,
                        resource_type='SecurityGroupRule',
                        resource_record_id=default_ingress_rule.id,
                        action='Created',
                        resource_configuration='SecurityGroupRule Created',
                        user_id=current_user.id,
                        project_id=project.id,
                        organisation_id=project.organisation_id,
                        provider_id=provider.id,
                        )
                
            create_user_action_log(action='Create New Instance of Gateway Service',status='Success',session_uuid=session['uuid'], resource_id=new_service.id, resource_type="ProjectGatewayService")
            return new_service
        except Exception as e:
            if error_msg:
                log.info("Exception: %s", error_msg)
                create_user_action_log(action='Create New Instance of Gateway Service',status='Fail',session_uuid=session['uuid'], resource_type="ProjectGatewayService", error_message=error_msg)
                abort(
                    code=error_code,
                    message=error_msg
                )
            else:
                log.info("Exception: %s", e)
                create_user_action_log(action='Create New Instance of Gateway Service',status='Fail',session_uuid=session['uuid'], resource_type="ProjectGatewayService", error_message=error_msg)
                abort(
                    code=HTTPStatus.UNPROCESSABLE_ENTITY,
                    message="%s" % e
                )

@api.route('/<int:provider_id>/<int:project_id>/<int:project_gateway_service_id>/<string:action>/')
@api.response(
    code=HTTPStatus.NOT_FOUND,
    description="project gateway_service not found.",
)
@api.resolve_object_by_model(Provider, 'provider')
@api.resolve_object_by_model(Project, 'project')
@api.resolve_object_by_model(ProjectGatewayService, 'project_gateway_service')
class ProjectGatewayServceActionByID(Resource):
    """
    Gateway Service actions of a specific Project.
    """

    @create_user_action_trails(action='Perform Action on Project Gateway Service')
    @check_scope_and_auth_token('project_gateway:write')
    @api.login_required(oauth_scopes=['project_gateway:write'])
    @verify_parameters()
    @ratelimit(rate=RateConfig.medium)
    @api.response(schemas.BaseProjectGatewayServiceSchema())
    @api.response(code=HTTPStatus.NO_CONTENT)
    def post(self, project, provider, project_gateway_service, action):
        """
        create a project gateway service.
        """
        project_id = project.id
        provider_id = provider.id
        error_msg = None
        error_code = HTTPStatus.UNPROCESSABLE_ENTITY

        if not provider.is_active:
            create_user_action_log(action='Perform Action on Project Gateway Service',status='Fail',session_uuid=session['uuid'],resource_id=project_gateway_service.id,resource_type='ProjectGatewayService', error_message='Cannot perform action on inactive provider')
            abort(
                code=HTTPStatus.BAD_REQUEST,
                message='Cannot perform action on inactive provider'
            )
        try:
            provider_type = ProviderType.query.get(provider.provider_type_id)
            _provider = globals()[provider_type.name]
            _gateway = ProjectProviderMapping.query.filter_by(project_id=project_id, provider_id=provider_id).first_or_404()
            docker_provider = types.SimpleNamespace()
            docker_provider.auth_url = "tcp://"+_gateway.gw_device_ip+":5000"
            allowed_action = ['start', 'stop', 'restart', 'pause', 'unpause', 'remove', 'logs']
            if action in allowed_action:
                if action == 'remove':
                    # Don't remove socat, sshpiper, grafana, prometheus services
                    if project_gateway_service.service_name in ('sshpiper', 'socat', 'prometheus', 'grafana'):
                        error_msg = 'Cannot remove system services'
                        error_code = HTTPStatus.FORBIDDEN
                        create_user_action_log(action='Perform Action on Project Gateway Service',status='Fail',session_uuid=session['uuid'],resource_id=project_gateway_service.id,resource_type='ProjectGatewayService', error_message=error_msg)
                        abort(
                        code=error_code,
                        message=error_msg
                        )

                    try:
                        docker_response = Docker.delete_server(docker_provider, project_gateway_service.service_name)
                        log.info(docker_response) 
                    except ConnectionError as e:
                        error_msg = e
                        error_code = HTTPStatus.UNPROCESSABLE_ENTITY
                        create_user_action_log(action='Perform Action on Project Gateway Service',status='Fail',session_uuid=session['uuid'],resource_id=project_gateway_service.id,resource_type='ProjectGatewayService', error_message=error_msg)
                        abort(
                            code=error_code,
                            message=error_msg
                        )

                    gw_securitygroup = SecurityGroup.query.filter_by(project_id=project_id, provider_id=provider_id, security_group_name='gw_sec_group').filter(SecurityGroup.status.ilike('Active'), SecurityGroup.security_group_type.ilike('gateway')).first()
                    # remove ingress-egress rule from gw_sec_group
                    if gw_securitygroup is not None:
                        gw_ingress_rule = SecurityGroupRule.query.filter(SecurityGroupRule.security_group_id==gw_securitygroup.id, SecurityGroupRule.direction.ilike('ingress'), SecurityGroupRule.remote_ip_prefix.contains('10.0.0.0'), SecurityGroupRule.port_range_min==str(project_gateway_service.service_gw_port), SecurityGroupRule.status.ilike('active')).first()
                        if gw_ingress_rule:
                            _provider.delete_security_group_rule(provider, gw_ingress_rule.provider_security_group_rule_id,project_name=project.project_id)
                            with db.session.begin():
                                gw_ingress_rule.status = 'Deleted'
                                db.session.merge(gw_ingress_rule)
                                create_resource_action_log(db,
                                    resource_type='SecurityGroupRule',
                                    resource_record_id=gw_ingress_rule.id,
                                    action='Deleted',
                                    resource_configuration='SecurityGroupRule Deleted',
                                    user_id=current_user.id,
                                    project_id=project_id,
                                    organisation_id=project.organisation_id,
                                    provider_id=provider_id,
                                    )
                        destination = project_gateway_service.service_destination.split(':')
                        destination_ip = destination[0]
                        destination_port = destination[1]
                        gw_egress_rule = SecurityGroupRule.query.filter(SecurityGroupRule.security_group_id==gw_securitygroup.id, SecurityGroupRule.direction.ilike('egress'), SecurityGroupRule.remote_ip_prefix.contains(f'{destination_ip}/32'), SecurityGroupRule.port_range_min==destination_port, SecurityGroupRule.status.ilike('active')).first()
                        if gw_egress_rule:
                            _provider.delete_security_group_rule(provider, gw_egress_rule.provider_security_group_rule_id,project_name=project.project_id)
                            with db.session.begin():
                                gw_egress_rule.status = 'Deleted'
                                db.session.merge(gw_egress_rule)
                                create_resource_action_log(db,
                                    resource_type='SecurityGroupRule',
                                    resource_record_id=gw_egress_rule.id,
                                    action='Deleted',
                                    resource_configuration='SecurityGroupRule Deleted',
                                    user_id=current_user.id,
                                    project_id=project_id,
                                    organisation_id=project.organisation_id,
                                    provider_id=provider_id,
                                    )

                    project_default_sec_group = SecurityGroup.query.filter_by(project_id=project_id, provider_id=provider_id, security_group_name='default').filter(SecurityGroup.status.ilike('Active'), SecurityGroup.security_group_type.ilike('project_default')).first() 
                    # remove ingress rule from default sec group
                    if project_default_sec_group is not None:
                        destination = project_gateway_service.service_destination.split(':')
                        destination_port = destination[1]
                        vm_ingress_rule = SecurityGroupRule.query.filter(SecurityGroupRule.security_group_id==project_default_sec_group.id, SecurityGroupRule.direction.ilike('ingress'), SecurityGroupRule.remote_ip_prefix.contains('192.168.3.0/24'), SecurityGroupRule.port_range_min==destination_port, SecurityGroupRule.status.ilike('active')).first()
                        if vm_ingress_rule:
                            _provider.delete_security_group_rule(provider, vm_ingress_rule.provider_security_group_rule_id,project_name=project.project_id)
                            with db.session.begin():
                                vm_ingress_rule.status = 'Deleted'
                                db.session.merge(vm_ingress_rule)
                                create_resource_action_log(db,
                                    resource_type='SecurityGroupRule',
                                    resource_record_id=vm_ingress_rule.id,
                                    action='Deleted',
                                    resource_configuration='SecurityGroupRule Deleted',
                                    user_id=current_user.id,
                                    project_id=project_id,
                                    organisation_id=project.organisation_id,
                                    provider_id=provider_id,
                                    )

                    with db.session.begin():
                        db.session.delete(project_gateway_service)
                        
                    create_user_action_log(action='Perform Action on Project Gateway Service',status='Success',session_uuid=session['uuid'],resource_id=project_gateway_service.id,resource_type='ProjectGatewayService')
                    return None
                else :
                    try:
                        Docker.server_action(docker_provider, project_gateway_service.service_name, action)
                    except ConnectionError as e:
                        error_msg = e
                        error_code = HTTPStatus.UNPROCESSABLE_ENTITY
                        create_user_action_log(action='Perform Action on Project Gateway Service',status='Fail',session_uuid=session['uuid'],resource_id=project_gateway_service.id,resource_type='ProjectGatewayService', error_message=error_msg)
                        abort(
                            code=error_code,
                            message=error_msg
                        )
                    try:
                        _service = Docker.get_server(docker_provider,project_gateway_service.service_name)
                        with db.session.begin():
                            project_gateway_service.service_status = _service.status
                            project_gateway_service.device_status = _service.status
                            db.session.merge(project_gateway_service)
                    except ConnectionError as e:
                        log.info('Unable to get updated status')
                    create_user_action_log(action='Perform Action on Project Gateway Service',status='Success',session_uuid=session['uuid'],resource_id=project_gateway_service.id,resource_type='ProjectGatewayService')
                    return project_gateway_service
            else :
                error_msg = 'Invalid action'
                error_code = HTTPStatus.BAD_REQUEST
                create_user_action_log(action='Perform Action on Project Gateway Service',status='Fail',session_uuid=session['uuid'],resource_id=project_gateway_service.id,resource_type='ProjectGatewayService', error_message=error_msg)
                abort(
                    code=error_code,
                    message=error_msg
                )
        except Exception as e:
            if error_msg is not None:
                log.info("Exception: %s", error_msg)
                create_user_action_log(action='Perform Action on Project Gateway Service',status='Fail',session_uuid=session['uuid'],resource_id=project_gateway_service.id,resource_type='ProjectGatewayService', error_message=error_msg)
                abort(
                    code=error_code,
                    message=error_msg
                )
            else:
                log.info("Exception: %s", e)
                create_user_action_log(action='Perform Action on Project Gateway Service',status='Fail',session_uuid=session['uuid'],resource_id=project_gateway_service.id,resource_type='ProjectGatewayService', error_message=str(e))
                abort(
                    code=HTTPStatus.UNPROCESSABLE_ENTITY,
                    message="%s" % e
                )

@api.route('/<int:provider_id>/<int:project_id>/<int:project_gateway_service_id>/logs/<int:lines>/')
@api.response(
    code=HTTPStatus.NOT_FOUND,
    description="Project gateway_service not found.",
)
@api.resolve_object_by_model(Provider, 'provider')
@api.resolve_object_by_model(Project, 'project')
@api.resolve_object_by_model(ProjectGatewayService, 'project_gateway_service')
class ProjectGatewayServceLogsByID(Resource):
    """
    Gateway Service actions of a specific Project.
    """
    @create_user_action_trails(action='Get Logs of Project Gateway Service')
    @check_scope_and_auth_token('project_gateway:read')
    @api.login_required(oauth_scopes=['project_gateway:read'])
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    @api.response(schemas.ProjectGatewayServiceLogSchema())
    @api.response(code=HTTPStatus.NO_CONTENT)
    def get(self, project, provider, project_gateway_service, lines=100):

        project_id = project.id
        provider_id = provider.id
        try:
            provider= Provider.query.get(provider_id)
            project= Project.query.get(project_id)
            provider_type = ProviderType.query.get(provider.provider_type_id)
            _provider = globals()[provider_type.name]
            _gateway = ProjectProviderMapping.query.filter_by(project_id=project_id, provider_id=provider_id).first_or_404()
            docker_provider = types.SimpleNamespace()
            docker_provider.auth_url = "tcp://"+_gateway.gw_device_ip+":5000"
            logs = Docker.server_logs(docker_provider, project_gateway_service.service_name, tail=lines)
            docker_logs = types.SimpleNamespace()
            docker_logs.name = project_gateway_service.service_name
            docker_logs.logs = logs
            create_user_action_log(action='Get Logs of Project Gateway Service',status='Success',session_uuid=session['uuid'],resource_id=project_gateway_service.id,resource_type='ProjectGatewayService')
            return docker_logs
        except Exception as e:
            log.info("Exception: %s", e)
            create_user_action_log(action='Get Logs of Project Gateway Service',status='Fail',session_uuid=session['uuid'],resource_id=project_gateway_service.id,resource_type='ProjectGatewayService', error_message=str(e))
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )


@api.route('/<int:provider_id>/<int:project_id>/syncserver/')
@api.response(
    code=HTTPStatus.NOT_FOUND,
    description="Project not found.",
)
@api.resolve_object_by_model(Provider, 'provider')
@api.resolve_object_by_model(Project, 'project')
class GetServerFromOpenstack(Resource):
    """
    Sync project details from Openstack
    """
    @create_user_action_trails(action='Get Project Details from Openstack')
    @check_scope_and_auth_token('projects:read')
    @api.login_required(oauth_scopes=['projects:read'])
    def get(self,provider, project):
        """
        get project details from openstack
        """
        project_id = project.id
        provider_id = provider.id
        project_provider = ProjectProviderMapping.query.filter_by(project_id=project_id, provider_id=provider_id).first()
        if project_provider is None:
            error_msg = f"Project with id {project_id} not available on the provider with id {provider_id}"
            create_user_action_log(action='Get Project Details from Openstack',status='Fail',session_uuid=session['uuid'], error_message=error_msg)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message=error_msg
            )

        provider_type = ProviderType.query.get(provider.provider_type_id)
        _provider = globals()[provider_type.name]

        server_list =_provider.list_servers(provider, project_name=project.project_id)
        create_user_action_log(action='Get Project Details from Openstack',status='Success',session_uuid=session['uuid'])
        return server_list


# @api.route('/update_project_id/')
# class UpdateProjectId(Resource):
#     """
#     Manipulations with a project to auto update project_id.
#     """

#     @api.login_required(oauth_scopes=['projects:read'])
#     @ratelimit(rate=RateConfig.medium)
#     @verify_parameters()
#     @api.response(schemas.BaseProjectSchema(many=True))
#     def get(self):
#         """
#         update project_id of a project.
#         """
#         project_list = Project.query.all()

#         for project in project_list:
#             with db.session.begin():
#                 project_id = generate_hash_for_number(project.id, 'project')
#                 project.project_id = project_id
#                 db.session.merge(project)
#         return project_list


@api.route('/<int:organisation_id>/<int:provider_id>/<int:project_id>/init_project/')
@api.response(
    code=HTTPStatus.NOT_FOUND,
    description="Project not found.",
)
@api.resolve_object_by_model(Organisation, 'organisation')
@api.resolve_object_by_model(Provider, 'provider')
@api.resolve_object_by_model(Project, 'project')
class InitProject(Resource):
    """
    Manipulation data with only only project initialization process
    """
    @create_user_action_trails(action='Initialize Project on Openstack')
    @check_scope_and_auth_token('projects:write')
    @api.login_required(oauth_scopes=['projects:read'])
    @api.permission_required(permissions.AdminRolePermission())
    @verify_parameters()
    @ratelimit(rate=RateConfig.low)
    @api.response(schemas.DetailedProjectSchema(), code=202)
    @api.response(code=HTTPStatus.CONFLICT)
    def post(self, organisation, provider, project):
        """
        Initialise project on openstack
        """
        from sqlalchemy import or_
        organisation_id = organisation.id
        project_id = project.id
        provider_id =provider.id
        # organisation = Organisation.query.get(organisation_id)
        # if organisation is None:
        #     abort(
        #         code=HTTPStatus.NOT_FOUND,
        #         message="organisation with id {} not found".format(organisation_id)
        #     )
        # provider = Provider.query.get(provider_id)
        # if provider is None:
        #     abort(
        #         code=HTTPStatus.NOT_FOUND,
        #         message="Provider with id {} not found".format(provider_id)
        #     )
        backup_proider = BackupServerProvider.query.filter_by(provider_id=provider_id).first()
        user_id = current_user.id
        project_provider = ProjectProviderMapping.query.filter_by(project_id=project_id, provider_id=provider_id).first()
        if project_provider is not None:
            create_user_action_log(action='Initialize Project on Openstack',status='Fail',session_uuid=session['uuid'])
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="Project with id {} already available on the provider with id {}".format(project_id,provider_id)
            )

        organisation_quotaPackage = OrganisationQuotaPackage.query.filter_by(provider_id=provider_id, organisation_id= organisation_id).first()

        if organisation_quotaPackage is None:
            create_user_action_log(action='Initialize Project on Openstack',status='Fail',session_uuid=session['uuid'])
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="Organisation with id {} have not quota on the provider with id {}".format(organisation_id, provider_id)
            )
        new_project = Project.query.filter(Project.id==project_id).filter(or_(Project.status != 'Deleted',Project.status.is_(None)))
        if new_project is None:
            create_user_action_log(action='Initialize Project on Openstack',status='Fail',session_uuid=session['uuid'])
            abort(
                code=HTTPStatus.NOT_FOUND,
                message="Project with id {} not found".format(project_id)
            )

        provider_type = ProviderType.query.get(provider.provider_type_id)
        _provider = globals()[provider_type.name]
        external_network = _provider.list_networks(provider, True)
        project_name = new_project.project_id
        project_description = new_project.description
        project_getway_name = organisation.org_id+"-"+project_name+"-"+provider.provider_id
        project_created = _provider.create_project_stack(provider, project_name=project_name, description=project_description,
                                                   external_network=external_network[0]['name'], project_getway_name=project_getway_name)
        log.info("================== inside resources =========================================")
        log.info(project_created)
        if project_created is None:
            new_project.action = "Init_Error"
            db.session.merge(new_project)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="Something went wrong, unable to complete process."
            )
        with db.session.begin():
            new_project_provider_mapping = ProjectProviderMapping(provider=provider, project=new_project)
            new_project_provider_mapping.provider_project_id = project_created.id
            new_project_provider_mapping.gw_device_id = "dummy-device-id"
            new_project_provider_mapping.gw_device_ip = "dummy-device-ip"
            db.session.add(new_project_provider_mapping)
            new_project.action = "success"
            new_project.task_id = ''
            db.session.merge(new_project)

            create_resource_action_log(db,
                                   resource_type='Project',
                                   resource_record_id=new_project_provider_mapping.id,
                                   action='Initialized',
                                   resource_configuration='Project Initialization on Provider',
                                   user_id=user_id,
                                   project_id=project_id,
                                   organisation_id=organisation_id,
                                   provider_id=provider_id
                                   )


        with db.session.begin():
            log.info("external network %s", external_network)
            _external_network = Network(
                provider_id=provider.id,
                project_id=new_project.id,
                user_id=user_id,
                external=True,
                network_name=new_project.name + "_" + external_network[0]['name'],
                provider_network_id=external_network[0]['id'],
                managed_by='system',
                status='Active'
            )
            db.session.add(_external_network)

        for external_subnets in external_network[0]['subnet']:

            try:
                with db.session.begin():
                    log.info("external_subnets %s", external_subnets)
                    _external_network_subnet = Subnet(
                        network_id=_external_network.id,
                        subnet_name=new_project.name + "_" + external_subnets['subnet_name'],
                        network_address=external_subnets['subnet_cidr'],
                        ip_version='IPv4',
                        provider_subnet_id=external_subnets['subnet_id'],
                        project_id=new_project.id, 
                        provider_id=provider.id,
                        managed_by='system'
                    )
                    log.info("_external_network_subnet %s", _external_network_subnet)
                    db.session.add(_external_network_subnet)
            except Exception as e:
                log.info("External Network Subnet Exception: %s", e)

        with db.session.begin():
            new_network = Network(
                provider_id=provider.id,
                project_id=new_project.id,
                user_id=user_id,
                network_name=new_project.name + '_int_net',
                provider_network_id=project_created.network_id,
                managed_by='system',
                status='Active'
            )
            db.session.add(new_network)

        create_resource_action_log(db,
                                   resource_type='Network',
                                   resource_record_id=new_network.id,
                                   action='Created',
                                   resource_configuration='Network Created',
                                   user_id=user_id,
                                   project_id=project_id,
                                   organisation_id=organisation_id,
                                   provider_id=provider_id
                                   )
        with db.session.begin():
            subnet = Subnet(
                network_id=new_network.id,
                subnet_name=new_project.name + '_int_subnet',
                network_address='192.168.3.0/24',
                ip_version='IPv4',
                provider_subnet_id=project_created.subnet_id,
                project_id=new_project.id, 
                provider_id=provider.id,
                managed_by='system'
            )
            db.session.add(subnet)

        create_resource_action_log(db,
                                   resource_type='Subnet',
                                   resource_record_id=subnet.id,
                                   action='Created',
                                   resource_configuration='Subnet Created',
                                   user_id=user_id,
                                   project_id=project_id,
                                   organisation_id=organisation_id,
                                   provider_id=provider_id
                                   )

        with db.session.begin():
            securitygroup = SecurityGroup(
                provider_id=provider.id,
                project_id=new_project.id,
                user_id=user_id,
                security_group_name='default',
                provider_security_group_id=project_created.sec_group_id,
                security_group_type='project_default',
                is_gw_security_group=False,
                is_lb_security_group=False,
                status='Active',
                managed_by='system'
            )
            db.session.add(securitygroup)

        create_resource_action_log(db,
                                   resource_type='SecurityGroup',
                                   resource_record_id=securitygroup.id,
                                   action='Created',
                                   resource_configuration='SecurityGroup Created',
                                   user_id=user_id,
                                   project_id=project_id,
                                   organisation_id=organisation_id,
                                   provider_id=provider_id
                                   )


        with db.session.begin():
            snat_ip = ''
            try:
                provider_router = _provider.get_router(provider,project_name=project_name, router_id=project_created.router_id)
                log.info(provider_router)
                snat_ip = provider_router.external_gateway_info['external_fixed_ips'][0]['ip_address']
                log.info("snat_ip ================>>>> %s", snat_ip)
            except Exception as e:
                log.info(e)

            router = Router(
                provider_id=provider.id,
                project_id=new_project.id,
                user_id=user_id,
                router_name=new_project.name + '_router',
                provider_router_id=project_created.router_id,
                snat_ip=snat_ip,
                managed_by='system'
            )
            db.session.add(router)

        create_resource_action_log(db,
                                   resource_type='Router',
                                   resource_record_id=router.id,
                                   action='Created',
                                   resource_configuration='Router Created',
                                   user_id=user_id,
                                   project_id=project_id,
                                   organisation_id=organisation_id,
                                   provider_id=provider_id
                                   )
        with db.session.begin():
            gateway_services = ProjectGatewayService(
                provider_id=provider.id,
                project_id=new_project.id,
                service_protocol='tcp',
                service_gw_port=22,
                service_destination='0.0.0.0:22',
                service_name='sshpiper',
                service_status='running',
                device_status='running',
            )
            db.session.add(gateway_services)

        create_resource_action_log(db,
                                   resource_type='ProjectGatewayService',
                                   resource_record_id=gateway_services.id,
                                   action='Created',
                                   resource_configuration='ProjectGatewayService Created',
                                   user_id=user_id,
                                   project_id=project_id,
                                   organisation_id=organisation_id,
                                   provider_id=provider_id
                                   )
        try:
            if  backup_proider is not None:
            
                try:
                    sec_group_name = new_project.project_id+"-dc-backup"
                    backup_sec_group = _provider.create_security_group(provider, name=sec_group_name, description=sec_group_name, project_id=project_created.id,project_name=new_project.project_id)
                    with db.session.begin():
                        backupsecuritygroup = SecurityGroup(
                                provider_id=provider.id,
                                project_id=new_project.id,
                                user_id=user_id,
                                security_group_name=sec_group_name,
                                provider_security_group_id=backup_sec_group.id,
                                is_gw_security_group=False,
                                is_lb_security_group=False,
                                security_group_type='backup',
                                status='Active',
                                managed_by='system'
                        )
                        db.session.add(backupsecuritygroup)
                except Exception as e:
                    log.info(e)

                message_status = []
                protection_group_name = 'Bronze-' + new_project.project_id

                parameter = {
                    'backup_server_api': backup_proider.backup_server_ip,
                    'backup_server_port': backup_proider.backup_server_port,
                    'protection_group_name': protection_group_name,
                    'username': backup_proider.username,
                    'password': backup_proider.password,
                    'project_id': new_project.project_id
                }
                protection_group = _provider.create_protection_group(provider, **parameter)

                protection_group_details = _provider.get_protection_group(provider, **parameter)
                protection_group_details = json.loads(protection_group_details)
                protection_group_id = protection_group_details['resourceId']['id']
                with db.session.begin():

                    protection_group = ProtectionGroup(protection_group_name=protection_group_name, project_id=project_id,
                                                       provider_id=provider_id, status='active',
                                                       protection_group_id=protection_group_id)
                    db.session.add(protection_group)
                    message_status.append("Protection group created successfully")
                parameter = {
                    'backup_server_api': backup_proider.backup_server_ip,
                    'backup_server_port': backup_proider.backup_server_port,
                    'protection_group_name': protection_group_name,
                    'username': backup_proider.username,
                    'password': backup_proider.password,
                    'project_id': new_project.project_id
                }
                protection_policy = _provider.create_protection_policy(provider, **parameter)
                protection_policy_details = _provider.get_protection_policy(provider, **parameter)
                protection_policy_details = json.loads(protection_policy_details)

                # try:
                #     with db.session.begin():
                #         protection_policy_mapping = ProtectionGroupClientMapping(protection_group_id=protection_group.id)
                #         db.session.add(protection_policy_mapping)
                #         message_status.append("protection policy created successfully")
                # except Exception as e:
                #     log.info(e)

                parameter = {
                    'backup_server_api': backup_proider.backup_server_ip,
                    'backup_server_port': backup_proider.backup_server_port,
                    'protection_policy_name': protection_policy_details['name'],
                    'protection_group_name': protection_group_name,
                    'username': backup_proider.username,
                    'password': backup_proider.password,
                    'project_id': new_project.project_id
                }
                workflow = _provider.create_workflow(provider, **parameter)

                workflow_details = _provider.get_workflow(provider, **parameter)
                with db.session.begin():
                    protection_group.attached_policy_details = workflow_details
                    db.session.merge(protection_group)
                #return message_status
        except Exception as e:
            log.info(e)

        create_user_action_log(action='Initialize Project on Openstack',status='Success',session_uuid=session['uuid'])
        return project

@api.route('/<int:provider_id>/<int:project_id>/create-project-gateway/')
@api.response(
    code=HTTPStatus.NOT_FOUND,
    description="Project not found.",
)
@api.resolve_object_by_model(Provider, 'provider')
@api.resolve_object_by_model(Project, 'project')
class CreateProjectGatewayVM(Resource):
    """
    Manipulation with project gateway vm
    """
    @create_user_action_trails(action='Create Project Gateway VM')
    @check_scope_and_auth_token('projects:write')
    @api.login_required(oauth_scopes=['projects:read'])
    @ratelimit(rate=RateConfig.low)
    @api.permission_required(permissions.AdminRolePermission())
    @verify_parameters()
    #@api.parameters(parameters.CreateProjectParameters())
    @api.response(schemas.DetailedProjectSchema())
    @api.response(code=HTTPStatus.CONFLICT)
    def post(self, provider, project):
        """
        Create Project Gateway VM
        """

        task_id = tasks.createProjectGatewayVM.delay(project.organisation_id, provider.id, project.id, current_user.id)
        redis_obj = redis.Redis(BaseConfig.REDIS_HOST, charset="utf-8", decode_responses=True)
        redis_obj.set(str(task_id), 'active')
        redis_obj.expire(str(task_id), 1200)
        create_user_action_log(action='Create Project Gateway VM',status='InProgress',ref_task_id=task_id,session_uuid=session['uuid'])
        # with db.session.begin():
        #     new_project.action = "Initialling"
        #     new_project.task_id = str(task_id)
        #     db.session.merge(new_project)
        data = {'message': 'processing', 'task_id': str(task_id)}
        response = jsonify(data)
        response.status_code = 202
        return response

@api.route('/<int:provider_id>/<int:project_id>/delete-project/')
@api.response(
    code=HTTPStatus.NOT_FOUND,
    description="Project not found.",
)
@api.resolve_object_by_model(Provider, 'provider')
@api.resolve_object_by_model(Project, 'project')
class DeleteProject(Resource):
    """
    Manipulation with Project and Provider
    """
    @check_scope_and_auth_token('projects:write')
    @api.login_required(oauth_scopes=['projects:read'])
    @ratelimit(rate=RateConfig.low)
    @api.permission_required(permissions.AdminRolePermission())
    @api.response(code=HTTPStatus.CONFLICT)
    def delete(self, provider, project):
        """
        delete a project 
        """

        organisation = Organisation.query.get(project.organisation_id)
        user_id = current_user.id
        provider_type = ProviderType.query.get(provider.provider_type_id)
        _provider = globals()[provider_type.name]
        with db.session.begin():
            vm_details= db.session.query(Compute).filter(Compute.project_id==project.id, Compute.provider_id==provider.id, Compute.status.ilike('active'), Compute.instance_type.ilike('vm')).all()
            if len(vm_details) > 0:
                abort(
                    code=HTTPStatus.UNPROCESSABLE_ENTITY,
                    message="Please delete all compute instance before delete project"
                )
            lb = db.session.query(LoadBalancer).filter(LoadBalancer.project_id==project.id, LoadBalancer.provider_id==provider.id, LoadBalancer.status.ilike('Active')).first()
            if lb is not None:
                abort(
                    code=HTTPStatus.UNPROCESSABLE_ENTITY,
                    message="Please delete all loadbalancers before delete project"
                )
            public_ip = db.session.query(PublicIPRequest).filter(PublicIPRequest.project_id==project.id, PublicIPRequest.provider_id==provider.id, PublicIPRequest.status.ilike('allocated')).first() 
            if public_ip is not None:
                abort(
                    code=HTTPStatus.UNPROCESSABLE_ENTITY,
                    message="Please withdraw all allocated public ip before delete project"
                )
            scaling_group = db.session.query(ScalingGroup).filter(ScalingGroup.project_id==project.id, ScalingGroup.provider_id==provider.id, ScalingGroup.status.ilike('Active')).first()
            if scaling_group is not None:
                abort(
                    code=HTTPStatus.UNPROCESSABLE_ENTITY,
                    message="Please delete all scaling_group before delete project"
                )
            nas_storage = db.session.query(NasRequest).filter(NasRequest.project_id==project.id, NasRequest.provider_id==provider.id, NasRequest.status.ilike('approved')).first()
            if nas_storage is not None:
                abort(
                    code=HTTPStatus.UNPROCESSABLE_ENTITY,
                    message="Please delete all active nas_storage before delete project"
                )

        organisation = Organisation.query.get(project.organisation_id)
        project_stack_name =  organisation.org_id+"-"+project.project_id+"-"+provider.provider_id+"_project_stack"
        project_provider_mapping = ProjectProviderMapping.query.filter_by(project_id=project.id, provider_id=provider.id).first()
        project_provider_id = project_provider_mapping.provider_project_id
        gateway_ip = project_provider_mapping.gw_device_ip
        project_getway_stack_name = organisation.org_id+"-"+project.project_id+"-"+provider.provider_id+"_gateway_stack"
        log.info(project_stack_name)
        log.info(project_getway_stack_name)
       
        log.info("--------------------------------project_gateway_stack---------------------------------")
        try:
            _project_gateway = _provider.get_stack_detail(provider, project_getway_stack_name, project_name=project.project_id)
            log.info(_project_gateway)
            if _project_gateway is not None:
                _delete_gateway_stack = _provider.delete_server_group(provider, _project_gateway.id, project_name=project.project_id)
                if _delete_gateway_stack is not True or _delete_gateway_stack is not False:
                    abort(
                        code=HTTPStatus.UNPROCESSABLE_ENTITY,
                        message="Update to delete project gateway. Please contact cloud support admin."
                    )
        except Exception as e:
            log.info(e)

        with db.session.begin():
            gateway_vm = db.session.query(Compute).filter(Compute.project_id==project.id, Compute.provider_id==provider.id, Compute.instance_type.ilike('gateway_vm'), Compute.status.ilike('active')).first()
            if gateway_vm is not None:
                gateway_vm.status = 'Deleted'
                gateway_vm.action = ''
                db.session.merge(gateway_vm)

                image = Images.query.get(gateway_vm.image_id)
                flavor = Flavors.query.get(gateway_vm.flavor_id)

                create_resource_action_log(db,
                    resource_type='gateway vm',
                    resource_record_id=gateway_vm.id,
                    action='deleted',
                    resource_configuration='Gateway VM Deleted with Resources : { "vcpu":' + flavor.vcpus + ' , "ram":' + str(int(flavor.ram) / 1024) + ' , "storage":' + flavor.disk + ' , "os":"' + image.os + '_' + image.os_version + '" }',
                    user_id=user_id,
                    project_id=project.id,
                    organisation_id=organisation.id,
                    provider_id=provider.id
                    )
            try:
                project_gateway_service = db.session.query(ProjectGatewayService).filter(ProjectGatewayService.project_id==project.id, ProjectGatewayService.provider_id==provider.id).all()
                for service in project_gateway_service:
                    db.session.delete(service)

                    try:
                        create_resource_action_log(db,
                               resource_type='ProjectGatewayService',
                               resource_record_id=project_gateway_service.id,
                               action='Deleted',
                               resource_configuration='ProjectGatewayService Deleted',
                               user_id=user_id,
                               project_id=project.id,
                               organisation_id=organisation.id,
                               provider_id=provider.id
                               )
                    except Exception as e:
                        log.info(e)

            except Exception as e:
                log.info("Exception: project_gateway_service %s", e)

            try:
                gateway_security_group = db.session.query(SecurityGroup).filter(SecurityGroup.project_id==project.id, SecurityGroup.provider_id==provider.id, SecurityGroup.security_group_type.ilike('gateway')).first()
                if gateway_security_group is not None:
                    gateway_security_group.status = 'Deleted'
                    db.session.merge(gateway_security_group)
                    try:
                        create_resource_action_log(db,
                                           resource_type='SecurityGroup',
                                           resource_record_id=gateway_security_group.id,
                                           action='Deleted',
                                           resource_configuration='security_group Deleted',
                                           user_id=current_user.id,
                                           project_id=project.id,
                                           organisation_id=project.organisation_id,
                                           provider_id=provider.id
                                           )
                    except Exception as e:
                        log.info(e)

                gateway_security_group_rules = db.session.query(SecurityGroupRule).filter(SecurityGroupRule.security_group_id==gateway_security_group.id, SecurityGroupRule.status.ilike('Active')).all()
                for securitygroup_rule in gateway_security_group_rules:
                    securitygroup_rule.status = "Deleted"
                    db.session.merge(securitygroup_rule)
                    try:
                        create_resource_action_log(db,
                                   resource_type='SecurityGroupRule',
                                   resource_record_id=securitygroup_rule.id,
                                   action='Deleted',
                                   resource_configuration='SecurityGroupRule Deleted',
                                   user_id=current_user.id,
                                   project_id=project.id,
                                   organisation_id=organisation.id,
                                   provider_id=provider.id
                                   )
                    except Exception as e:
                        log.info(e)

            except Exception as e:
                log.info("Exception: gateway security group %s", e)

        _project = _provider.get_stack_detail(provider, project_stack_name)
        log.info("--------------------------------project stack--------------------------")
        log.info(_project)
        if _project is not None:
            _delete_project_stack = _provider.delete_server_group(provider, _project.id)
            log.info(_delete_project_stack)
        
        with db.session.begin():
            subnet_details = db.session.query(Subnet).filter(Subnet.project_id==project.id, Subnet.provider_id==provider.id).all()
            for subnet in subnet_details:
                db.session.delete(subnet)
                create_resource_action_log(db,
                               resource_type='Subnet',
                               resource_record_id=subnet.id,
                               action='Deleted',
                               resource_configuration='Subnet Deleted',
                               user_id=user_id,
                               project_id=project.id,
                               organisation_id=organisation.id,
                               provider_id=provider.id
                               )
            network_details = db.session.query(Network).filter(Network.project_id==project.id, Network.provider_id==provider.id, Network.status.ilike('Active')).all()
            for network in network_details:
                network.status = "Deleted"
                db.session.merge(network)

                create_resource_action_log(db,
                               resource_type='Network',
                               resource_record_id=network.id,
                               action='Deleted',
                               resource_configuration='Network Deleted',
                               user_id=user_id,
                               project_id=project.id,
                               organisation_id=organisation.id,
                               provider_id=provider.id
                               )

            router = Router.query.filter_by(project_id=project.id, provider_id=provider.id).first()
            if router:
                create_resource_action_log(db,
                                   resource_type='Router',
                                   resource_record_id=router.id,
                                   action='Deleted',
                                   resource_configuration='Router Deleted',
                                   user_id=user_id,
                                   project_id=project.id,
                                   organisation_id=organisation.id,
                                   provider_id=provider.id
                                   )
            db.session.delete(router)

            default_security_group = db.session.query(SecurityGroup).filter(SecurityGroup.project_id==project.id, SecurityGroup.provider_id==provider.id, SecurityGroup.security_group_type.ilike('project_default')).first()
            if default_security_group:
                default_security_group.status = "Deleted"
                db.session.merge(default_security_group)

                create_resource_action_log(db,
                                   resource_type='SecurityGroup',
                                   resource_record_id=default_security_group.id,
                                   action='Deleted',
                                   resource_configuration='SecurityGroup Deleted',
                                   user_id=user_id,
                                   project_id=project.id,
                                   organisation_id=organisation.id,
                                   provider_id=provider.id
                                   )

                default_security_group_rule = db.session.query(SecurityGroupRule).filter(SecurityGroupRule.security_group_id==default_security_group.id).all()
                for rules in default_security_group_rule:
                    rules.status = "Deleted"
                    db.session.merge(rules)

            backup_security_group = db.session.query(SecurityGroup).filter(SecurityGroup.project_id==project.id, SecurityGroup.provider_id==provider.id, SecurityGroup.security_group_type.ilike('backup')).first()
            if backup_security_group:
                backup_security_group.status = "Deleted"
                db.session.merge(backup_security_group)

                create_resource_action_log(db,
                                   resource_type='SecurityGroup',
                                   resource_record_id=backup_security_group.id,
                                   action='Deleted',
                                   resource_configuration='SecurityGroup Deleted',
                                   user_id=user_id,
                                   project_id=project.id,
                                   organisation_id=organisation.id,
                                   provider_id=provider.id
                                   )

                backup_security_group_rule = db.session.query(SecurityGroupRule).filter(SecurityGroupRule.security_group_id==backup_security_group.id).all()
                for rules in backup_security_group_rule:
                    rules.status = "Deleted"
                    db.session.merge(rules)

            protection_group = ProtectionGroup.query.filter_by(project_id=project.id, provider_id=provider.id).all()
            for group in protection_group:
                group.status = "Deleted"
                db.session.merge(group)
            db.session.delete(project_provider_mapping)

            try:
                default_access_port = DefaultAccessPorts.query.filter_by(resource_type='gateway').first()
                ports = default_access_port.port
                cloud_ref_no = organisation.org_reg_code
                destination_ip = gateway_ip
              # delete_vpn_fw_permission_email(cloud_ref_no, provider.provider_location, destination_ip, ports)
            except Exception as e:
                log.info(e)
            

        return True

@api.route('/<int:provider_id>/<int:project_id>/fetch_gateway_services/')
@api.response(
    code=HTTPStatus.NOT_FOUND,
    description="Project not found.",
)
@api.resolve_object_by_model(Provider, 'provider')
@api.resolve_object_by_model(Project, 'project')
class FetchGatewayServices(Resource):
    """
    Manipulation with gateway services running on gateway vm
    """
    @create_user_action_trails(action='Fetch all running gateway services')
    @check_scope_and_auth_token('projects:read')
    @api.login_required(oauth_scopes=['projects:read'])
    @ratelimit(rate=RateConfig.low)
    @api.response(code=HTTPStatus.CONFLICT)
    def get(self, provider, project):
        """
        fetch running all gateway services from gateway vm
        """
        docker_provider = types.SimpleNamespace()
        
        _gateway = ProjectProviderMapping.query.filter_by(project_id=project.id, provider_id=provider.id).first_or_404()
        docker_provider.auth_url = "tcp://"+_gateway.gw_device_ip+":5000"  
        result = []
        try:  
            _service = Docker.list_servers(docker_provider)
            log.info(type(_service))
            log.info(_service)
            for service in _service:
                try:
                    c_id = service.id
                except Exception as e:
                    log.info(e)
                    temp = service.split(":")
                    c_id = temp[1].strip()
                service_details = Docker.get_service_details(docker_provider, c_id)
                log.info(service_details.name)
                log.info(service_details.labels)
                log.info(service_details.short_id)
                log.info(service_details.status)
                log.info(service_details.ports)

                result.append(service_details)
        except Exception as e:
            log.info(e)

        return result

@api.route('/project-technology-details/')
class ProjectTechnology(Resource):
    """
    Manipulations with project technology details
    """

    @create_user_action_trails(action='Get project technology details')
    @check_scope_and_auth_token('projects:read')
    @api.login_required(oauth_scopes=['projects:read'])
    @ratelimit(rate=RateConfig.low)
    @api.response(schemas.BaseProjectTechnologyDetailsSchema(many=True))
    @api.response(code=HTTPStatus.CONFLICT)
    @api.paginate()
    def get(self, args):
        """
        get list of project technology details
        """
        return ProjectTechnologyDetails.query





        