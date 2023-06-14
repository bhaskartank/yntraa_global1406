
from flask_restplus_patched._http import HTTPStatus
from flask_restplus_patched import Resource
from app.extensions.api.parameters import PaginationParameters
from app.extensions import db
from app.extensions.api import Namespace, abort
from . import schemas, parameters
from .models import db, UserRole, RolePermissionGroup, UsersDefaultScope
from app.modules.users import permissions
from app.modules import RateConfig, verify_parameters, create_user_action_log, create_user_action_trails, check_scope_and_auth_token
from app.extensions.flask_limiter import ratelimit
from app.modules.organisations.models import OrganisationProjectUser
from app.modules.users.models import User
from flask import session
from flask_login import current_user
# from . import ConstactRole
import logging

log = logging.getLogger(__name__)

# api = Namespace('role_permission', description="role_permission")



api = Namespace('role_permission_group', description="role_permission_group")


@api.route('/')
class RolePermissionGroups(Resource):
    """
    Manipulations with RolePermissionGroup.
    """
    @create_user_action_trails(action='Get List of Permission Group Scope')
    @check_scope_and_auth_token('role_permission:read')
    @api.login_required(oauth_scopes=['role_permission:read'])
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    #@api.parameters(PaginationParameters())
    @api.response(schemas.BaseRolePermissionGroupSchema(many=True))
    @api.paginate()
    def get(self, args):
        """
        List of permissions group scope.

        Returns a list of users starting from ``offset`` limited by ``limit``
        parameter.
        """

        with db.session.begin():
            try:
                rolepermissiongroup = db.session.query(RolePermissionGroup).filter(RolePermissionGroup.status != 'deleted', RolePermissionGroup.is_active==True)
                create_user_action_log(action='Get List of Permission Group Scope',status='Success',session_uuid=session['uuid'])
                return rolepermissiongroup
            except Exception as e:
                log.info("Exception: %s", e)
                create_user_action_log(action='Get List of Permission Group Scope',status='Fail',session_uuid=session['uuid'])
                abort(
                    code=HTTPStatus.NOT_FOUND,
                    message="Record not found"
                )
            

    @create_user_action_trails(action='Create Role Permission Group with Scope')
    @api.parameters(parameters.CreateRolePermissionGroupParameters())
    @check_scope_and_auth_token('role_permission:write')
    @api.login_required(oauth_scopes=['role_permission:read'])
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    @api.response(schemas.BaseRolePermissionGroupSchema())
    @api.response(code=HTTPStatus.FORBIDDEN)
    @api.response(code=HTTPStatus.CONFLICT)
    def post(self, args):
        """
        Create Role permission group with scope
        """
        with api.commit_or_abort(
                db.session,
                default_error_message="Failed to create permission group scope."
            ):
            rolepermissiongroup = db.session.query(RolePermissionGroup).filter(RolePermissionGroup.group_name==args['group_name'], RolePermissionGroup.status != 'deleted').first()
            if rolepermissiongroup is not None:
                create_user_action_log(action='Create Role Permission Group with Scope',status='Fail',session_uuid=session['uuid'], error_message="rolepermissiongroup already exists")
                abort(
                    code=HTTPStatus.CONFLICT,
                    message="rolepermissiongroup is already exists."
                )

            new_rolepermissiongroup = RolePermissionGroup(**args)
            # log.info('new_record : %s', new_rolepermissiongroup)
            db.session.add(new_rolepermissiongroup)
        create_user_action_log(action='Create Role Permission Group with Scope',status='Success',session_uuid=session['uuid'])
        return new_rolepermissiongroup

@api.route('/default/')
class DefaultRolePermissionGroups(Resource):
    """
    Manipulations with Default RolePermissionGroup.
    """
    @create_user_action_trails(action='Get List of Default Permission Group')
    @check_scope_and_auth_token('users:read')
    @api.login_required(oauth_scopes=['users:read'])
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    @api.response(schemas.BaseRolePermissionGroupSchema(many=True))
    @api.response(code=HTTPStatus.FORBIDDEN)
    @api.response(code=HTTPStatus.CONFLICT)
    def get(self):
        """
        List of default permissions group.

        Returns a list of users starting from ``offset`` limited by ``limit``
        parameter.
        """
        create_user_action_log(action='Get List of Default Permission Group',status='Success',session_uuid=session['uuid'])
        return RolePermissionGroup.query.filter_by(organisation_id=0).all()


@api.route('/organisation/')
class RolePermissionGroupsofOrganisation(Resource):
    """
    Manipulations with RolePermissionGroup of Organisation.
    """
    @create_user_action_trails(action='Get List of Permission Group of an Organisation')
    @check_scope_and_auth_token('users:read')
    @api.login_required(oauth_scopes=['users:read'])
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    @api.parameters(parameters.RolePermissionGroupofOrganisationParameters())
    @api.response(schemas.BaseRolePermissionGroupSchema(many=True))
    @api.paginate()
    @api.sort()
    def get(self, args):
        """
        List of permissions group of an Organisation.

        Returns a list of users starting from ``offset`` limited by ``limit``
        parameter.
        """
        # if include_global is None:
        #     include_global = True
        try:
            include_global = True
            if 'include_global' in args :
                include_global = args['include_global']
            organisation_id = args['organisation_id']
            log.info("include_global %s" % include_global)
            if include_global :
                create_user_action_log(action='Get List of Permission Group of an Organisation',status='Success',session_uuid=session['uuid'])
                return RolePermissionGroup.query.filter(organisation_id in (0,organisation_id))
            else :
                create_user_action_log(action='Get List of Permission Group of an Organisation',status='Success',session_uuid=session['uuid'])
                return RolePermissionGroup.query.filter_by(organisation_id=organisation_id)
        except Exception as e:
            log.info("Exception: %s", e)
            create_user_action_log(action='Get List of Permission Group of an Organisation',status='Fail',session_uuid=session['uuid'])
            abort(
                code=HTTPStatus.BAD_REQUEST,
                message="%s" % e
            )

@api.route('/<int:rolepermissiongroup_id>/')
@api.response(
    code=HTTPStatus.NOT_FOUND,
    description="RolePermission group not found.",
)
@api.resolve_object_by_model(RolePermissionGroup, 'rolepermissiongroup')
class RolePermissionGroupByID(Resource):
    """
    Manipulations with a specific RolePermissionGroup.
    """

    @create_user_action_trails(action='Get Role Permission Group details by ID')
    @check_scope_and_auth_token('users:read')
    @api.login_required(oauth_scopes=['users:read'])
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    @api.response(schemas.DetailedRolePermissionGroupSchema())
    def get(self, rolepermissiongroup):
        """
        Get RolePermissionGroup details by ID.
        """
        create_user_action_log(action='Get Role Permission Group details by ID',status='Fail',session_uuid=session['uuid'],resource_id=rolepermissiongroup.id,resource_type='RolePermissionGroup')
        return rolepermissiongroup

    @create_user_action_trails(action='Update Role Permission Group details by ID')
    @check_scope_and_auth_token('users:read')
    @api.login_required(oauth_scopes=['users:read'])
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    @api.parameters(parameters.CreateRolePermissionGroupParameters())
    @api.response(schemas.DetailedRolePermissionGroupSchema())
    @api.response(code=HTTPStatus.CONFLICT)
    def put(self, args, rolepermissiongroup):
        """
        Update instance of RolePermissionGroup.
        """
        try:
            with api.commit_or_abort(
                    db.session,
                    default_error_message="Failed to update a new RolePermissionGroup"
                ):
                group_name = args.pop('group_name')
                group_description = args.pop('group_description')
                scope = args.pop('scope')
                organisation_id = args.pop('organisation_id')

                rolepermissiongroup_details = RolePermissionGroup.query.filter_by(id=rolepermissiongroup.id).first_or_404()
                rolepermissiongroup_details.group_name = group_name
                rolepermissiongroup_details.group_description = group_description
                rolepermissiongroup_details.scope = scope
                rolepermissiongroup_details.organisation_id = organisation_id

                db.session.merge(rolepermissiongroup_details)

            create_user_action_log(action='Update Role Permission Group details by ID',status='Success',session_uuid=session['uuid'],resource_id=rolepermissiongroup.id,resource_type='RolePermissionGroup')
            return rolepermissiongroup_details
        except Exception as e:
            log.info("Exception: %s", e)
            create_user_action_log(action='Update Role Permission Group details by ID',status='Fail',session_uuid=session['uuid'],resource_id=rolepermissiongroup.id,resource_type='RolePermissionGroup')
            abort(
                code=HTTPStatus.BAD_REQUEST,
                message="%s" % e
            )

    @create_user_action_trails(action='Delete Role Permission Group by ID')
    @check_scope_and_auth_token('users:read')
    @api.login_required(oauth_scopes=['users:read'])     
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    @api.response(code=HTTPStatus.CONFLICT)
    def delete(self, rolepermissiongroup):
        """
        delete role permission group by id
        """
        with api.commit_or_abort(
                db.session,
                default_error_message="Failed to delete provider."
            ):
            
            old_rolepermissiongroup = RolePermissionGroup.query.get(rolepermissiongroup.id)
            old_rolepermissiongroup.is_active = False
            old_rolepermissiongroup.public = False
            old_rolepermissiongroup.status = "deleted"
            db.session.merge(old_rolepermissiongroup)

        create_user_action_log(action='Delete Role Permission Group by ID',status='Success',session_uuid=session['uuid'],resource_id=rolepermissiongroup.id,resource_type='RolePermissionGroup')
        return ['role permissiongroup deleted successfully.']

@api.route('/user_role_scope/<int:user_id>/')
@api.response(
    code=HTTPStatus.NOT_FOUND,
    description="users not found.",
)
@api.resolve_object_by_model(User, 'user')
class UserRoleScope(Resource):
    """
    Manipulations with RolePermission.
    """
    @create_user_action_trails(action='Get List of Permission Scope of User')
    @check_scope_and_auth_token('users:read')
    @api.login_required(oauth_scopes=['users:read'])
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    @api.parameters(PaginationParameters())
    @api.response(schemas.DetailedUserRoleSchema(many=True))
    def get(self, args, user):
        """
        List of permissions scope for the user.
# 
        Returns a list of permission starting from ``offset`` limited by ``limit``
        parameter.
        """
        try:
            resp = UserRole.query.filter_by(user_id=user.id)
            create_user_action_log(action='Get List of Permission Scope of User',status='Success',session_uuid=session['uuid'],resource_id=user.id,resource_type='User')
            return resp
        except Exception as e:
            log.info("Exception: %s", e)
            create_user_action_log(action='Get List of Permission Scope of User',status='Fail',session_uuid=session['uuid'],resource_id=user.id,resource_type='User')
            abort(
                code=HTTPStatus.NOT_FOUND,
                message="Record not found"
            )

    @create_user_action_trails(action='Assign Permission Role and Scope to User')
    @check_scope_and_auth_token('users:write')
    @api.login_required(oauth_scopes=['users:read'])
    @api.parameters(parameters.AddUserRoleParameters())
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    @api.response(schemas.BaseUserRoleSchema())
    @api.response(code=HTTPStatus.FORBIDDEN)
    @api.response(code=HTTPStatus.CONFLICT)
    def post(self, args, user):
        """
        Assign permission role and scope to user for organisation projects
        """
        #try:
        user_id = user.id
        with api.commit_or_abort(
                db.session,
                default_error_message="Failed to assign permission role and scope."
            ):
            organisation_project_user_check = OrganisationProjectUser.query.filter_by(organisation_id=args['organisation_id'],
                                                                                      project_id=args['project_id'],
                                                                                      user_id=user_id).one_or_none()
            if organisation_project_user_check is not None:
                user_role_details = UserRole.query.filter_by(user_id=user_id, project_id = args['project_id'], organisation_id = args['organisation_id']).one_or_none()
                if user_role_details is None :
                    new_record = UserRole(**args)
                    new_record.user_id = user_id
                    db.session.add(new_record)
                    create_user_action_log(action='Assign Permission Role and Scope to User',status='Success',session_uuid=session['uuid'],resource_id=user_id,resource_type='User')
                    return new_record
                else :
                    create_user_action_log(action='Assign Permission Role and Scope to User',status='Fail',session_uuid=session['uuid'],resource_id=user_id,resource_type='User')
                    abort(
                        code=HTTPStatus.NOT_FOUND,
                        message="Permission for this project exist."
                    )
            else:
                create_user_action_log(action='Assign Permission Role and Scope to User',status='Fail',session_uuid=session['uuid'],resource_id=user_id,resource_type='User')
                abort(
                    code=HTTPStatus.NOT_FOUND,
                    message="Project not found for this user."
                )
        # except Exception as e:
        #     log.info("Exception: %s", e)
        #     abort(
        #         code=HTTPStatus.BAD_REQUEST,
        #         message="%s" % e
        #     )

@api.route('/user_role_scope/<int:user_id>/<int:user_roles_id>/')
@api.response(
    code=HTTPStatus.NOT_FOUND,
    description="Record not found.",
)
@api.resolve_object_by_model(UserRole, 'user_roles')
class UserRoleScopeById(Resource):

    @create_user_action_trails(action='Get User Role and Scope details by ID')
    @check_scope_and_auth_token('users:read')
    @api.login_required(oauth_scopes=['users:read'])
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    @api.response(schemas.DetailedUserRoleSchema())
    def get(self, user_id, user_roles):
        """
        Get User Role and Scope details by ID.
        """
        create_user_action_log(action='Get User Role and Scope details by ID',status='Success',session_uuid=session['uuid'],resource_id=user_id,resource_type='User')
        return UserRole.query.filter_by(user_id=user_id, id=user_roles.id).first_or_404()

    @create_user_action_trails(action='Patch User Scope Permission')
    @check_scope_and_auth_token('users:write')
    @api.login_required(oauth_scopes=['users:read'])
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    #@api.permission_required(permissions.WriteAccessPermission())
    @api.parameters(parameters.PatchUserRolesDetailsParameters())
    @api.response(schemas.DetailedUserRoleSchema())
    @api.response(code=HTTPStatus.CONFLICT)
    def patch(self, args, user_id, user_roles):
        """
        Patch user scope permission.
        """
        with api.commit_or_abort(
                db.session,
                default_error_message="Failed to update User role scope details."
        ):
            parameters.PatchUserRolesDetailsParameters.perform_patch(args, obj=user_roles)
            db.session.merge(user_roles)

        create_user_action_log(action='Patch User Scope Permission',status='Success',session_uuid=session['uuid'],resource_id=user_id,resource_type='User')
        return user_roles

    @create_user_action_trails(action='Update User Role and Scope')
    @check_scope_and_auth_token('users:write')
    @api.login_required(oauth_scopes=['users:read'])
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    @api.parameters(parameters.UpdateUserRoleParameters())
    @api.response(schemas.DetailedUserRoleSchema())
    @api.response(code=HTTPStatus.CONFLICT)
    def put(self, args, user_id, user_roles):
        """
        Update instance of User Role and Scope.
        """
        try:
            with api.commit_or_abort(
                    db.session,
                    default_error_message="Failed to update User Role and Scope"
                ):
                organisation_id = 0
                if 'organisation_id' in args :
                    organisation_id = args['organisation_id']
                project_id = 0
                if 'project_id' in args :
                    project_id = args['project_id']
                user_scope = None
                if 'user_scope' in args :
                    user_scope = args['user_scope']
                user_role = 0
                if 'user_role' in args :
                    user_role = args['user_role']

                user_roles_details = UserRole.query.filter_by(id=user_roles.id).first_or_404()
                user_roles_details.organisation_id = organisation_id
                user_roles_details.project_id = project_id
                user_roles_details.user_scope = user_scope
                user_roles_details.user_role = user_role

                db.session.merge(user_roles_details)
                
            create_user_action_log(action='Update User Role and Scope',status='Success',session_uuid=session['uuid'],resource_id=user_id,resource_type='User')
            return user_roles_details
        except Exception as e:
            log.info("Exception: %s", e)
            create_user_action_log(action='Update User Role and Scope',status='Fail',session_uuid=session['uuid'],resource_id=user_id,resource_type='User')
            abort(
                code=HTTPStatus.BAD_REQUEST,
                message="%s" % e
            )

    @create_user_action_trails(action='Delete User Permission Scope by ID')
    @check_scope_and_auth_token('users:write')
    @api.login_required(oauth_scopes=['users:read'])
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    #@api.permission_required(permissions.WriteAccessPermission())
    @api.response(code=HTTPStatus.CONFLICT)
    @api.response(code=HTTPStatus.NO_CONTENT)
    def delete(self, user_id, user_roles):
        """
        Delete a user permission scope by  ID.
        """
        with api.commit_or_abort(
                db.session,
                default_error_message="Failed to delete user permission scope."
            ):
            type_details = UserRole.query.filter_by(id=user_roles.id).first_or_404()
            db.session.delete(type_details)

        create_user_action_log(action='Delete User Permission Scope by ID',status='Success',session_uuid=session['uuid'],resource_id=user_id,resource_type='User')
        return None


@api.route('/user_type_by_default_scope/')
class UserTypeByDefaultScopeList(Resource):
    """
    Manipulations with UserTypeByDefaultScopeList of User.
    """
    @create_user_action_trails(action='Get List of Default Scope for User Type')
    @check_scope_and_auth_token('users:read')
    @api.login_required(oauth_scopes=['users:read'])
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    @api.parameters(parameters.UserTypeForDefaultScopeParameters())
    @api.response(schemas.BaseUserTypeForDefaultScopeSchema())
    def get(self, args):
        """
        List of Default Scope for User Type.

        Returns a list of default scope starting from ``offset`` limited by ``limit``
        parameter.
        """
        user_scope_type = args['user_scope_type'].lower()
        
        try:
            resp = UsersDefaultScope.query.filter_by(user_scope_type=user_scope_type).first_or_404()
            create_user_action_log(action='Get List of Default Scope for User Type',status='Success',session_uuid=session['uuid'])
            return resp
        except Exception as e:
            log.info("Exception: %s", e)
            create_user_action_log(action='Get List of Default Scope for User Type',status='Fail',session_uuid=session['uuid'])
            abort(
                code=HTTPStatus.NOT_FOUND,
                message="Record not found"
            )




# @api.route('/<int:organisation_id>/user_role/')
# @api.response(
#     code=HTTPStatus.NOT_FOUND,
#     description="Record not found.",
# )
# class UserRoleScopeByOrganisation(Resource):

#     @api.parameters(PaginationParameters())
#     @api.response(schemas.BaseUserRoleSchema(many=True))
#     def get(self, args, organisation_id):
#         """
#         Get user scope by organisation_id.
#         """
#         user_scope_list = UserRole.query.filter_by(organisation_id=organisation_id).offset(
#             args['offset']).limit(args['limit'])
#         return user_scope_list

@api.route('/user_role_scope')
@api.response(
    code=HTTPStatus.NOT_FOUND,
    description="users not found.",
)
class UserRoleScopeV2(Resource):
    """
    Manipulations with RolePermission.
    """
    @create_user_action_trails(action='Get List of Permission Scope of User')
    @check_scope_and_auth_token('users:read')
    @api.login_required(oauth_scopes=['users:read'])
    @ratelimit(rate=RateConfig.medium)
    @verify_parameters()
    @api.parameters(PaginationParameters())
    @api.response(schemas.DetailedUserRoleSchema(many=True))
    def get(self, args):
        """
        List of permissions scope for the user.
#
        Returns a list of permission starting from ``offset`` limited by ``limit``
        parameter.
        """
        try:
            user_id = current_user.id
            resp = UserRole.query.filter_by(user_id=user_id)
            create_user_action_log(action='Get List of Permission Scope of User',status='Success',session_uuid=session['uuid'],resource_id=user_id,resource_type='User')
            return resp
        except Exception as e:
            log.info("Exception: %s", e)
            create_user_action_log(action='Get List of Permission Scope of User',status='Fail',session_uuid=session['uuid'],resource_id=user_id,resource_type='User')
            abort(
                code=HTTPStatus.NOT_FOUND,
                message="Record not found"
            )


