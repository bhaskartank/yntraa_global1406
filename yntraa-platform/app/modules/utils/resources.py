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
from app.modules.users.permissions import check_permission
from app.modules.users.models import User
from app.modules.role_permission.models import UserRole, RolePermissionGroup
from app.modules.organisations.models import Organisation, OrganisationProjectUser
from app.modules.projects.models import Project
from app.modules.auth.models import OAuth2Client
from app.modules.users.schemas import DetailedUserSchema
from app.extensions.flask_limiter import ratelimit
from app.modules import RateConfig,verify_parameters, create_user_action_log, create_user_action_trails, check_scope_and_auth_token
from flask import session
from app import celery
from .models import ConsentData, EULA
from datetime import datetime
from . import parameters, schemas


log = logging.getLogger(__name__)  # pylint: disable=invalid-name
api = Namespace('utils', description="Utils")  # pylint: disable=invalid-name


@api.route('/<int:organisation_id>/inituserforproject')
class Utils(Resource):
    """
    Manipulations with Util.
    """

    @create_user_action_trails(action='Create New User and Assign all role to a Project')
    @check_scope_and_auth_token('users:write')
    @api.login_required(oauth_scopes=['users:read'])
    @verify_parameters()
    @api.permission_required(permissions.AdminRolePermission())
    @api.parameters(parameters.InitUserToProjectParameters())
    @api.response(code=HTTPStatus.CONFLICT)
    def post(self, args, organisation_id):
        """
        Create a new User and assign all role to a project.
        """
        from sqlalchemy import or_
        staus_message = []
        new_user = None
        email = args['email']
        password = args['password']
        first_name = args['first_name']
        middle_name = None
        last_name = None
        mobile_no = None
        if 'middle_name' in args :
            middle_name = args['middle_name']
        if 'last_name' in args : 
            last_name = args['last_name']
        if 'mobile_no' in args : 
            mobile_no = args['mobile_no']
        user_role = None
        user_scope = None
        if 'user_role' in args :
            user_role = args['user_role']
        if 'user_scope' in args :
            user_scope = list(args['user_scope'])

        if 'client_id' in args :
            client_id = args['client_id']
        else :
            client_id = args['email']

        if 'client_secret' in args :
            client_secret = args['client_secret']
        else :
            client_secret = args['password']

        static_role = {'admin': 0x4000, 'internal': 0x8000, 'regular': 0x2000}
        is_active = 0x1000
        if 'user_type' in args:
            user_type = args['user_type'].lower()

            if user_type in static_role:
                user_type_value = static_role[user_type] + is_active
            else:
                create_user_action_log(action='Create New User and Assign all role to a Project',status='Fail',session_uuid=session['uuid'])
                abort(
                    code=HTTPStatus.BAD_REQUEST,
                    message="Invalid user type"
                )
        else:
            user_type_value = (0x2000 + 0x1000)
        project_id_list = args['project_id']

        with api.commit_or_abort(
                db.session,
                default_error_message="Failed to create a new User"
            ):
            user_details = User.query.filter_by(email=email).one_or_none()
            if user_details is not None:
                create_user_action_log(action='Create New User and Assign all role to a Project',status='Fail',session_uuid=session['uuid'])
                abort(
                    code=HTTPStatus.CONFLICT,
                    message="User %s already exists." % email
                )
            else:
                # REGULAR_USER = (0x2000, "Regular User")
                # ACTIVE = (0x1000, "Active Account")
                new_user = User(username=email, email=email, password=password, first_name=first_name, middle_name=middle_name , last_name=last_name, mobile_no=mobile_no, static_roles=user_type_value, user_type='normal')
                db.session.add(new_user)
                # log.info("User %s successfully created." % new_user.id)
                message = 'User '+email+' successfully created.'
                staus_message.append(message)                

            # --------- Users ClientID and Secret Key ------------------------
            new_user_details = User.query.filter_by(email=email).one_or_none()
            user_id = new_user_details.id
            if new_user_details is None:
                create_user_action_log(action='Create New User and Assign all role to a Project',status='Fail',session_uuid=session['uuid'])
                abort(
                    code=HTTPStatus.NOT_FOUND,
                    message="User %s doesn\'t' exists." % email
                )
            else:
                new_OAuth2Client = OAuth2Client(client_id=client_id, client_secret=client_secret, user_id=new_user_details.id, client_type='public')
                db.session.add(new_OAuth2Client)
                log.info("User %s ClientID and Client Secret Key successfully generated." % email)
                message = 'User '+email+' ClientID and Client Secret Key successfully generated.'
                staus_message.append(message)


            # --------- Organisation Project User Mapping and Role and Scope Mapping------------------------

            organisation = Organisation.query.get(organisation_id)
            if organisation is None:
                log.info("Organisation %d doesn\'t exist." % organisation_id)
                message = 'Organisation '+organisation_id+' doesn\'t exist.'
                staus_message.append(message)
            else :
                #project_id_list = project_id_argument_data.split(",")
                while len(project_id_list) > 0 :
                    project_id_from_list = project_id_list.pop()

                    organisation_project_details = Project.query.filter_by(organisation_id=organisation_id, id=project_id_from_list).filter(or_(Project.status != 'Deleted',Project.status.is_(None))).one_or_none()
                    if organisation_project_details is None:
                        log.info("Project with ID %s doesn't  exist" % project_id_from_list)
                        message = 'Project with ID '+project_id_from_list+' does not exist for this Organisation'+organisation.name+' so Permissions will not be given on this project.'
                        staus_message.append(message)
                    else :
                        new_organisation_project_user = OrganisationProjectUser(organisation_id = organisation_id, project_id=project_id_from_list, user_id = user_id)
                        db.session.add(new_organisation_project_user)
                        log.info("User %s successfully mapped with this Organisation's Project" % email)
                        message = 'User '+email+' successfully mapped with this Organisation\'s ' +organisation.name+' Project '+organisation_project_details.name
                        staus_message.append(message) 

                        user_role_validate = True
                        if user_role is not None:
                            role_details = RolePermissionGroup.query.filter_by(id=user_role).one_or_none()
                            if role_details is None:
                                log.info("Role with ID %s doesn't  exist" % user_role)
                                message = 'Role with ID '+role_details.group_name+' does not exist'
                                staus_message.append(message) 
                                user_role_validate = False 

                        if user_role_validate :
                            new_user_role_scope = UserRole(user_id=user_id, project_id=project_id_from_list, organisation_id = organisation_id, user_role=user_role, user_scope=user_scope)
                            db.session.add(new_user_role_scope)
                            log.info("User\'s' %s Role and Scope successfully mapped for this Organisation's Project" % email)
                            message = 'User\'s '+email+' Role and Scope successfully mapped for this Organisation\'s ' +organisation.name+' Project '+organisation_project_details.name
                            staus_message.append(message)                        

        with db.session.begin():
            pass
            # create_resource_action_log(db,
            #                             resource_type='user',
            #                             resource_record_id=new_user.id,
            #                             action='created',
            #                             resource_configuration='User Created',
            #                             user_id=current_user.id,
            #                             project_id=0,
            #                             organisation_id=organisation_id,
            #                             provider_id=0
            #                             )
            
        create_user_action_log(action='Create New User and Assign all role to a Project',status='Success',session_uuid=session['uuid'])
        return staus_message


@api.route('/active-celery-tasks')
class ActiveCeleryTask(Resource):
    """
    Celery Tasks
    """

    @api.response(code=HTTPStatus.BAD_REQUEST)
    def get(self):
        """
        Get list of active celery tasks.
        """

        inspect = celery.control.inspect()
        tasks = {}
        tasks['active_tasks'] = inspect.active()
        return tasks, 200

@api.route('/current_server_time')
class GetServerTime(Resource):
    """
    Manipulations with Get Server Current Time
    """
    def get(self):

        """
        Get server datetime related info
        """

        from datetime import datetime

        current_server_time = datetime.now()
        timezone_str = str(datetime.astimezone(current_server_time))[-6:]
        timezone_dict = {
            'current_server_time': current_server_time.strftime('%d-%m-%Y %H:%M:%S'),
        }

        if timezone_str[1:] == '00:00':
            timezone_dict['timezone_info'] = 'UTC'
            timezone_dict['timezone_offset'] = timezone_str
        elif timezone_str == '+05:30':
            timezone_dict['timezone_info'] = 'IST'
            timezone_dict['timezone_offset'] = timezone_str 
        else:
            timezone_dict['timezone_info'] = 'not UTC/IST'
            timezone_dict['timezone_offset'] = timezone_str

        return timezone_dict 

@api.route('/get_consent_data/')
class ConsentList(Resource):
    """
    This is class which include endpoint for listing consent data
    """
    @create_user_action_trails(action='Get consent data list')
    @api.login_required(oauth_scopes=['users:read'])
    @ratelimit(rate=RateConfig.high)
    @api.parameters(parameters.ListConsentDataParameters())
    @api.response(schemas.BaseConsentDataSchema(many=True))
    def get(self, args):
        """
        List consent data
        """
        consent_data = ConsentData.query.filter_by(**args).filter(ConsentData.status.ilike('active')).order_by('priority asc').all()
        create_user_action_log(action='Get consent data list', status='Success', session_uuid=session['uuid'])
        return consent_data

@api.route('/eula')
class GetEULA(Resource):
    """
    Manipulation with EULA.
    """
    @create_user_action_trails(action='Get EULA details')
    @ratelimit(rate=RateConfig.medium)
    @api.response(schemas.BaseEulaSchema())
    def get(self):
        """
        Get EULA details
        """
        # eula_file_path = os.path.join('static', 'eula.txt')
        # with open(eula_file_path, 'r') as file:
        #     eula_file_content = file.read()
        try:
            eula_obj = EULA.query.filter_by(status='Active').one_or_none()
            current_date = datetime.now().strftime('%Y-%m-%d')
            eula_obj.content = eula_obj.content.replace('[Current_Date]', current_date)
            create_user_action_log(action='Get EULA details', status='Success', session_uuid=session['uuid'])
            return eula_obj
        except Exception as e:
            log.error(e)
            create_user_action_log(action='Get EULA details', status='Failed', session_uuid=session['uuid'])
            return {'message': 'Failed to get EULA details'}, HTTPStatus.INTERNAL_SERVER_ERROR