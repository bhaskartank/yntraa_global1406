# encoding: utf-8
# pylint: disable=too-few-public-methods,invalid-name,bad-continuation
"""
RESTful API User resources
--------------------------
"""

import logging
import datetime
import socket, os
import traceback

from flask import request, current_app

from flask_login import current_user
from sqlalchemy import or_

from flask_restplus_patched import Resource
from flask_restplus_patched._http import HTTPStatus

from app.extensions.api import Namespace, abort
from app.extensions.api.parameters import SortPaginateParameters
#from app.extensions import ratelimit

from app.extensions import sio, audit_trail
from . import permissions, schemas, parameters
from app.modules.users.permissions import check_permission
from .models import db, User
from app.modules.auth.models import OAuth2Client,OAuth2Token
from app.modules.organisations.models import OrganisationProjectUser, Organisation, Subscription
from app.modules.role_permission.models import UserRole
from app.modules.projects.models import Project
#from app.modules.organisations.models import OrganisationProjectUser
from flask import jsonify, session
from app.modules import RateConfig,verify_parameters, send_sms, sync_resource_allocation_data, create_user_action_log, create_user_action_trails, check_scope_and_auth_token
from app.extensions.flask_limiter import ratelimit
from .tasks import get_me
from app.modules.utils.models import SmsTemplate
#from config import BaseConfig

log = logging.getLogger(__name__)
api = Namespace('users', description="Users")


@api.route('/')
class Users(Resource):
    """
    Manipulations with users.
    """
    @create_user_action_trails(action='Get List of Users')
    @check_scope_and_auth_token('users:read')
    @api.login_required(oauth_scopes=['users:read'])
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    @api.parameters(parameters.UserListGetParameter())
    @api.response(schemas.BaseUserSchema(many=True))
    @api.paginate()
    @api.sort()
    def get(self, args):
        """
        List of users.

        Returns a list of users starting from ``offset`` limited by ``limit``
        parameter.
        """
        # resource_type = 'storage'
        # resp = sync_resource_allocation_data(resource_type)
        # log.info("resp =============>>>>> %s", resp)
        #return User.query.offset(args['offset']).limit(args['limit'])
        try:

            # if 'is_super_admin' in current_user.__dict__ and current_user.is_super_admin:
            if current_user.is_internal:
                return User.query  # .offset(args['offset']).limit(args['limit'])

            elif current_user.is_admin:

                authorisation_token = request.headers.get('Authorization')
                authorisation_token_details = list(authorisation_token.split(" "))
                authorisation_token = authorisation_token_details[1]
                oauth2_last_token = OAuth2Token.query.filter_by(access_token=authorisation_token,
                                                                user_id=current_user.id).one_or_none()

                project_id = oauth2_last_token.project_id
                project_details = Project.query.filter_by(id=project_id).one_or_none()
                organisation_user_list = db.session.query(OrganisationProjectUser).filter_by(
                    organisation_id=project_details.organisation_id).distinct(OrganisationProjectUser.user_id).all()

                users_ids = list()
                for data in organisation_user_list:

                    users_ids.append(data.user_id)

                if len(users_ids) > 0:
                    users_ids = tuple(users_ids)
                    create_user_action_log(action='Get List of Users',status='Success',session_uuid=session['uuid'])
                    if 'username' in args:
                        if len(args['username']) > 2:
                            return db.session.query(User).filter(User.id.in_(users_ids)).filter(or_(User.username.ilike('%' + args['username'] + '%'),
                                                                     User.email.ilike('%' + args['username'] + '%')))
                    return db.session.query(User).filter(User.id.in_(users_ids))

                else:
                    create_user_action_log(action='Get List of Users',status='Fail',session_uuid=session['uuid'], error_message="user not found")
                    abort(
                        code=HTTPStatus.NOT_FOUND,
                        message="user not found."
                    )

            else:

                authorisation_token = request.headers.get('Authorization')
                authorisation_token_details = list(authorisation_token.split(" "))
                authorisation_token = authorisation_token_details[1]
                oauth2_last_token = OAuth2Token.query.filter_by(access_token=authorisation_token,
                                                                user_id=current_user.id).one_or_none()

                project_id = oauth2_last_token.project_id
                organisation_project_details = db.session.query(OrganisationProjectUser).filter(
                    OrganisationProjectUser.project_id == project_id).distinct(
                    OrganisationProjectUser.user_id).all()

                users_ids = list()

                for data in organisation_project_details:
                    users_ids.append(data.user_id)

                if len(users_ids) > 0:
                    users_ids = tuple(users_ids)
                    create_user_action_log(action='Get List of Users',status='Success',session_uuid=session['uuid'])
                    if 'username' in args:
                        if len(args['username']) > 2:
                            return db.session.query(User).filter(User.id.in_(users_ids)).filter(or_(User.username.ilike('%' + args['username'] + '%'),
                                                                     User.email.ilike('%' + args['username'] + '%')))
                    return db.session.query(User).filter(User.id.in_(users_ids))


                abort(
                    code=HTTPStatus.NOT_FOUND,
                    message="user not found."
                )
        except Exception as e:
            log.info("Exception: %s", e)
            create_user_action_log(action='Get List of Users',status='Fail',session_uuid=session['uuid'], error_message=str(e))
            abort(
                code=HTTPStatus.BAD_REQUEST,
                message="%s" % e
            )

    @create_user_action_trails(action='Create New User')
    @check_scope_and_auth_token('users:write')
    @api.login_required(oauth_scopes=['users:read'])
    @api.permission_required(permissions.AdminRolePermission())
    @api.parameters(parameters.AddUserParameters())
    @api.response(schemas.DetailedUserSchema())
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    @api.response(code=HTTPStatus.FORBIDDEN)
    @api.response(code=HTTPStatus.CONFLICT)
    @api.doc(id='create_user')
    def post(self, args):
        """
        Create a new user and their Client ID and Secret Key.
        """
        error_code = None
        error_msg = None
        try:
            with api.commit_or_abort(
                    db.session,
                    default_error_message="Failed to create a new user."
                ):
                username = args['username']
                user = User.query.filter_by(email=args['email']).first()
                if user is not None:
                    create_user_action_log(action='Create New User',status='Fail',session_uuid=session['uuid'])
                    error_code = HTTPStatus.CONFLICT
                    error_msg = "Email is already exists."
                    abort(
                        code=HTTPStatus.CONFLICT,
                        message="Email is already exists."
                    )
                new_user = User(**args)
                # Code 36864 for 'Regular User'
                new_user.static_roles = 0x2000
                db.session.add(new_user)
                created_user_details = User.query.filter_by(username=username).one_or_none()
                if created_user_details is None:
                    create_user_action_log(action='Create New User',status='Fail',session_uuid=session['uuid'])
                    error_code = HTTPStatus.NOT_FOUND
                    error_msg = "User %s doesn\'t' exists so Client ID and Secret Key have not been created." % username
                    abort(
                        code=HTTPStatus.NOT_FOUND,
                        message="User %s doesn\'t' exists so Client ID and Secret Key have not been created." % username
                    )
                else:
                    new_OAuth2Client = OAuth2Client(client_id=created_user_details.username, client_secret=created_user_details.username, user_id=created_user_details.id, client_type='public')
                    db.session.add(new_OAuth2Client)

                # create_resource_action_log(db,
                #     resource_type='user',
                #     resource_record_id=created_user_details.id,
                #     action='created',
                #     resource_configuration='User Created',
                #     user_id=current_user.id,
                #     project_id=0,
                #     organisation_id=0,
                #     provider_id=0
                # )

                # print(request.headers)
                # audit_id = audit_trail.mongo.db.auditTrail.insert_one({"time_stamp":datetime.datetime.now().timestamp(), "ip_address":socket.gethostbyname(socket.gethostname()), "user_id":username,"action_type": "create_user", "message": "User Created Successfully", "request_url":request.url}).inserted_id
                # log.info("Audit log id: %s", audit_id)
                # audit_log = audit_trail.mongo.db.auditTrail.find_one({"user_id": username})
                # log.info("Audit log: %s", audit_log)

            create_user_action_log(action='Create New User',status='Success',session_uuid=session['uuid'])
            return new_user
        except Exception as e:
            log.info("Exception: %s", e)
            create_user_action_log(action='Create New User',status='Fail',session_uuid=session['uuid'])
            if error_code is None:
                abort(
                    code=HTTPStatus.BAD_REQUEST,
                    message="%s" % e
                )
            else:
                abort(
                    code=error_code,
                    message=error_msg
                )

@api.route('/find/')
class UserFind(Resource):
    """
    Manipulations with users.
    """

    @create_user_action_trails(action='Find User')
    @check_scope_and_auth_token('users:read')
    @api.login_required(oauth_scopes=['users:read'])
    #@api.permission_required(permissions.AdminRolePermission())
    #@check_permission('users:write')
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    @api.parameters(parameters.FindUserParameters())
    @api.response(schemas.BaseFindUserSchema(many=True))
    def post(self, args):
        """
        List of users find.

        Returns a list of users starting from ``offset`` limited by ``limit``
        parameter.
        """
        try:
            from sqlalchemy import or_
            search_data = args['email']
            if len(search_data) < 3:
                create_user_action_log(action='Find User',status='Fail',session_uuid=session['uuid'])
                abort(
                        code=HTTPStatus.NOT_FOUND,
                        message="Search Keyword has to be at least 3 characters long."
                    )
            #log.info("search_data %s " % search_data)
            create_user_action_log(action='Find User',status='Success',session_uuid=session['uuid'])
            return db.session.query(User).filter(or_(User.email.ilike('%' + search_data + '%'),User.first_name.ilike('%' + search_data + '%'),User.middle_name.ilike('%' + search_data + '%'),User.last_name.ilike('%' + search_data + '%'),User.mobile_no.ilike('%' + search_data + '%'))).all()
        except Exception as e:
            log.info("Exception: %s", e)
            create_user_action_log(action='Find User',status='Fail',session_uuid=session['uuid'])
            abort(
                code=HTTPStatus.BAD_REQUEST,
                message="%s" % e
            )
#
# @api.route('/signup_form')
# class UserSignupForm(Resource):
#
#     @api.response(schemas.UserSignupFormSchema())
#     @ratelimit(rate=RateConfig.medium)
#     def get(self):
#         """
#         Get signup form keys.
#
#         This endpoint must be used in order to get a server reCAPTCHA public key which
#         must be used to receive a reCAPTCHA secret key for POST /users/ form.
#         """
#         # TODO:
#         return {"recaptcha_server_key": "TODO"}


@api.route('/<int:user_id>')
@api.response(
    code=HTTPStatus.NOT_FOUND,
    description="User not found.",
)
@api.resolve_object_by_model(User, 'user')
class UserByID(Resource):
    """
    Manipulations with a specific user.
    """

    # @api.permission_required(
    #     permissions.OwnerRolePermission,
    #     kwargs_on_request=lambda kwargs: {'obj': kwargs['user']}
    # )
    #@check_permission('users:read')
    @create_user_action_trails(action='Get User details by ID')
    @check_scope_and_auth_token('users:read')
    @api.login_required(oauth_scopes=['users:read'])
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    @api.response(schemas.DetailedUserSchema())
    def get(self, user):
        """
        Get user details by ID.
        """
        create_user_action_log(action='Get User details by ID',status='Success',session_uuid=session['uuid'],resource_id=user.id,resource_type='User')
        return user

    @create_user_action_trails(action='Patch User details by ID')
    @check_scope_and_auth_token('users:write')
    @api.login_required(oauth_scopes=['users:read'])
    @api.parameters(parameters.PatchUserDetailsParameters())
    @api.response(schemas.DetailedUserSchema())
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    @api.response(code=HTTPStatus.CONFLICT)
    def patch(self, args, user):
        """
        Patch user details by ID.
        """
        with api.commit_or_abort(
                db.session,
                default_error_message="Failed to update user details."
            ):
            parameters.PatchUserDetailsParameters.perform_patch(args, user)
            db.session.merge(user)
        create_user_action_log(action='Patch User details by ID',status='Success',session_uuid=session['uuid'],resource_id=user.id,resource_type='User')
        return user


@api.route('/me')
class UserMe(Resource):
    """
    Useful reference to the authenticated user itself.
    """

    @create_user_action_trails(action='Get Current User details')
    @check_scope_and_auth_token('users:read')
    @api.login_required(oauth_scopes=['users:read'])
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    @api.response(schemas.DetailedUserSchema())
    def get(self):
        """
        Get current user details.
        """
        #import redis
        # task_id = get_me.delay({"data": current_user.id })
        # redis_obj = redis.Redis(BaseConfig.REDIS_HOST, charset="utf-8", decode_responses=True)
        # redis_obj.set('test123456', 'processing')

        # audit_id = audit_trail.mongo.db.auditTrail.insert_one({"action": "/me", "user_id": current_user.id}).inserted_id
        # log.info("Audit log id: %s", audit_id)
        # audit_log = audit_trail.mongo.db.auditTrail.find_one({"user_id": current_user.id})
        # log.info("Audit log: %s", audit_log)
        create_user_action_log(action='Get Current User details',status='Success',session_uuid=session['uuid'])
        return User.query.get_or_404(current_user.id)
        # data = {'task_id': str(task_id)}
        # response = jsonify(data)
        # response.status_code = 202
        # return response

@api.route('/change_role/<int:user_id>')
@api.response(
    code=HTTPStatus.NOT_FOUND,
    description="User not found.",
)
@api.resolve_object_by_model(User, 'user')
class ChangeUserRole(Resource):
    """
    Change user type of specific user
    """
    @create_user_action_trails(action='Update User Type')
    @check_scope_and_auth_token('users:write')
    @api.login_required(oauth_scopes=['users:read'])
    @api.permission_required(permissions.AdminRolePermission())
    @api.parameters(parameters.ChangeUserRoleParameters())
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    @api.response(schemas.DetailedUserSchema())
    def post(self, args, user):
        """
        Update user type ( admin, regular, internal)
        """
        try:
            with api.commit_or_abort(
                    db.session,
                    default_error_message="Failed to update user details."
                ):
                static_role = {'admin': 0x4000, 'internal': 0x8000, 'regular': 0x2000}
                is_active = 0x1000
                role = args['user_role']

                if role.lower() in static_role:
                    value = static_role[role.lower()] + is_active
                    user.static_roles = value
                    db.session.merge(user)
                else:
                    error_msg = "Invalid user role. User role should be either admin, internal or regular."
                    create_user_action_log(action='Update User Type',status='Fail',session_uuid=session['uuid'],resource_id=user.id,resource_type='User', error_message=error_msg)
                    abort(
                        code=HTTPStatus.NOT_FOUND,
                        message=error_msg
                    )
            create_user_action_log(action='Update User Type',status='Success',session_uuid=session['uuid'],resource_id=user.id,resource_type='User')
            return user
        except Exception as e:
            log.info("Exception: %s", e)
            create_user_action_log(action='Update User Type',status='Fail',session_uuid=session['uuid'],resource_id=user.id,resource_type='User', error_message=str(e))
            abort(
                code=HTTPStatus.BAD_REQUEST,
                message="%s" % e
            )


@api.route('/change_password/')
class ChangeUserPassword(Resource):
    """
    Manipulation with user password
    """

    @create_user_action_trails(action='Update User Password')
    @check_scope_and_auth_token('users:write')
    @api.login_required(oauth_scopes=['users:read'])
    @ratelimit(rate=RateConfig.medium)
    @api.parameters(parameters.ChangePasswordParameters())
    @api.response(schemas.DetailedUserSchema())
    def post(self, args):
        """
        Update user password
        """
        with api.commit_or_abort(
                db.session,
                default_error_message="Failed to update user details."
        ):
            user = User.query.get(current_user.id)
            current_password = args['current_password']
            username = user.username

            new_user = User.find_with_password(username, current_password)
            if new_user is None:
                create_user_action_log(action='Update User Password',status='Fail',session_uuid=session['uuid'], error_message="Invalid user")
                abort(
                    code=HTTPStatus.BAD_REQUEST,
                    message="Invalid user"
                )

            new_password = args['new_password']
            confirm_password = args['confirm_password']

            if new_password != confirm_password:
                error_msg = "new password and confirm password does not match"
                create_user_action_log(action='Update User Password',status='Fail',session_uuid=session['uuid'], error_message=error_msg)
                abort(
                    code=HTTPStatus.BAD_REQUEST,
                    message=error_msg
                )
                new_user.password = new_password
            db.session.merge(new_user)

            sms_template = SmsTemplate.query.filter_by(template_name='password', template_type='reset').first()
            if sms_template is None:
                message = "Dear Sir/Madam, Your password has been reset. Please use password: "+str(new_password)+" to login into the Yntraa Cloud Service Portal. -Regards, Yntraa/YntraaSI Cloud Support"      
                send_sms_status = send_sms(new_user.mobile_no, message, template_id='1107166696317419631')
            else:
                message = sms_template.custom_template.format(password=str(new_password))
                send_sms_status = send_sms(new_user.mobile_no, message, template_id=sms_template.template_id)

            create_user_action_log(action='Update User Password',status='Success',session_uuid=session['uuid'])
            return new_user

@api.route('/onboarding-request/')
class UserOnboarding(Resource):
    """
    This class includes endpoint to create new user
    """

    @create_user_action_trails(action='Create New User')
    # @api.login_required(oauth_scopes=['users:write'])
    @api.parameters(parameters.AddUserParameters())
    @api.response(schemas.DetailedUserSchema())
    @ratelimit(rate=RateConfig.medium)
    # @verify_parameters()
    @api.response(code=HTTPStatus.FORBIDDEN)
    @api.response(code=HTTPStatus.CONFLICT)
    @api.doc(id='create_user')
    def post(self, args):
        """
        Create a new user and their Client ID and Secret Key.
        """
        from tasks.app.users import create_sso_user
        error_code = None
        error_msg = None
        try:
            if not args['org_id']:
                log.info("No org_id provided")
                error_msg = "Please provide organization ID"
                error_code = HTTPStatus.BAD_REQUEST
                raise Exception(error_msg)
            with api.commit_or_abort(
                    db.session,
                    default_error_message="Failed to create a new user."
            ):
                # user = User.query.filter(or_(User.email == args['email'], User.username == args['username'],))
                print("inside try")
                user = User.query.filter_by(email=args['email']).first()
                print("user", user)
                if user and user.user_id:
                    create_user_action_log(action='Create New User', status='Fail', session_uuid=session['uuid'],
                                           resource_type="User", error_message="User already exists.")
                    error_code = HTTPStatus.CONFLICT
                    error_msg = "User already exists."
                    abort(
                        code=HTTPStatus.CONFLICT,
                        message="User already exists."
                    )
                else:
                    # static_role = {'admin': 0x4000, 'internal': 0x8000}
                    is_active = 0x1000
                    # if 'user_role' in args:
                    # user_role = args['user_role'].lower()
                    user_type = args['contact_type'].lower()
                    user_type_list = user_type.split(':')
                    if 'primary' in user_type_list:
                        print("if primary")
                        print("user_type_list", user_type_list)
                        user_role_value = 0x4000 + is_active
                        user_role = 1  #Org-Admin
                    else:
                        user_role_value = 0x2000 + is_active
                        user_role = 3  #Project-User
                    # if user_role not in static_role:
                    #     error_msg = "Invalid user role. User role should be either admin, internal or regular."
                    # if user_role in static_role:
                    # else:
                    #     create_user_action_log(action='Create New User', status='Fail', session_uuid=session['uuid'],
                    #                            resource_type="User", error_message="Invalid user type")
                    #     abort(
                    #         code=HTTPStatus.BAD_REQUEST,
                    #         message="Invalid user type"
                    #     )
                    del args['user_role']
                    org_id = args.pop('org_id')
                    if not args.get('password'):
                        args['password'] = 'test@Pass!23'
                    if user is None:
                        new_user = User(**args)
                        new_user.static_roles = user_role_value
                        db.session.add(new_user)
                    else:
                        for key, value in args.items():
                            setattr(user, key, value)
                        new_user = user
                        new_user.static_roles = user_role_value
                        db.session.merge(user)
                organisation_obj = Organisation.query.filter_by(org_id=org_id).first()
                project_id = None
                if not organisation_obj:
                    organisation_obj = Organisation(org_id=org_id)
                    db.session.add(organisation_obj)
                    log.info(f'Organisation with org_id {org_id} doesn\'t exists, so creating one')
                else:
                    org_is_subscribed = Subscription.query.filter_by(organisation_id=organisation_obj.id).first()
                    if org_is_subscribed:
                        project_id = org_is_subscribed.project_id
            with api.commit_or_abort(
                db.session,
                default_error_message="Failed to create a new user."
            ):


                #TODO User Role to be give 3 as 3 is the Project User. Setting 1 for the demo
                print("""
                
                
                
                hello """)
                user_role_obj = UserRole(organisation_id=organisation_obj.id,
                                         user_id=new_user.id, user_role=user_role, project_id=project_id)


                db.session.add(user_role_obj)
                organisation_project_user_check = OrganisationProjectUser.query.filter_by(organisation_id = organisation_obj.id, project_id=project_id, user_id = new_user.id).one_or_none()
                if organisation_project_user_check is not None:
                    log.info("User already mapped with this Organisation's Project")
                else:
                    only_organisation_user = db.session.query(OrganisationProjectUser).filter(
                        OrganisationProjectUser.organisation_id == organisation_obj.id,
                        OrganisationProjectUser.user_id == new_user.id,
                        OrganisationProjectUser.project_id == None).first()
                    if only_organisation_user:
                        only_organisation_user.project_id = project_id
                        db.session.merge(only_organisation_user)
                    else:
                        new_organisation_project_user = OrganisationProjectUser(organisation_id=organisation_obj.id,
                                                                                project_id=project_id,
                                                                                user_id=new_user.id)
                        db.session.add(new_organisation_project_user)

                    log.info("User successfully mapped with this Organisation's Project")
                    new_OAuth2Client = OAuth2Client(client_id=new_user.username,
                                                    client_secret=new_user.username,
                                                    user_id=new_user.id, client_type='public')
                    db.session.add(new_OAuth2Client)

                # create_resource_action_log(db,
                #                            resource_type='user',
                #                            resource_record_id=new_user.id,
                #                            action='created',
                #                            resource_configuration='User Created',
                #                            user_id=new_user.id,
                #                            project_id=0,
                #                            organisation_id=0,
                #                            provider_id=0
                #                            )

            create_user_action_log(action='User Onboarding', status='Success', session_uuid=session['uuid'],
                                   resource_type="User")

            if current_app.config['IS_OIDC_ENABLED']:
                create_sso_user(current_app, new_user)

            return new_user
        except Exception as e:
            traceback.print_exc()
            print(e.__dict__)
            log.info("Exception: %s", e)
            create_user_action_log(action='Create New User', status='Fail', session_uuid=session['uuid'],
                                   resource_type="User", error_message=str(e))
            if error_code is None:
                abort(
                    code=HTTPStatus.BAD_REQUEST,
                    message="%s" % e
                )
            else:
                abort(
                    code=error_code,
                    message=error_msg
                )

