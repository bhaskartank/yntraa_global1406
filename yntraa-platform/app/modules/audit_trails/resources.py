# encoding: utf-8
# pylint: disable=bad-continuation
"""
RESTful API Audit Trails resources
--------------------------
"""

import logging

from flask_login import current_user
from flask_restplus_patched import Resource
from flask_restplus_patched._http import HTTPStatus

from app.extensions import db
from app.extensions import audit_trail
from app.extensions.api import Namespace, abort
from app.extensions.api.parameters import SortPaginateParameters
from app.modules.users import permissions
from app.modules import  verify_parameters, custom_query, create_user_action_log, create_user_action_trails, check_scope_and_auth_token
from app.extensions.flask_limiter import ratelimit
from app.modules.users.models import User
from . import parameters, schemas
from .models import AuditTrailLog
from flask import session


log = logging.getLogger(__name__)  # pylint: disable=invalid-name
api = Namespace('audit-trails', description="Audit Trails")  # pylint: disable=invalid-name

@api.route('/')
class AuditTrails(Resource):
    """
    Manipulations with Audit Trails.
    """
    @create_user_action_trails(action='Get User Audit Trail Log')
    @check_scope_and_auth_token('audit-trails:read')
    @api.login_required(oauth_scopes=['audit-trails:read'])
    @api.parameters(parameters.GetAuditTrailParameters())
    @ratelimit(rate='100/s')
    #@api.response(schemas.DetailedAuditTrailLogSchema(many=True))
    #@api.paginate()
    def get(self, args):
        """
        List of AuditTrail.

        Returns a list of AuditTrail starting from ``offset`` limited by ``limit``
        parameter.
        """
        import re
        from sqlalchemy import or_, and_

        ip_pattern = r'(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)'

        resource_name = None
        status = None
        action_method = None
        field = None
        order = None

        if 'resource_name' in args:
            resource_name = args.pop('resource_name')
        if 'status' in args:
            status = args.pop('status')
        if 'field' in args:
            field = args.pop('field')
        if 'order' in args:
            order = args.pop('order')
        if 'action_method' in args:
            action_method = args.pop('action_method')

        offset = args.get('offset', 0)
        limit = args.get('limit', 20)
        
        filter_args = custom_query(args)
 
        if 'from_date' in args and 'to_date' in args :
            filter_args.pop('from_date')
            filter_args.pop('to_date')
            #return AuditTrailLog.query.filter_by(**filter_args).filter(AuditTrailLog.session_uuid.isnot(None)).filter(and_(AuditTrailLog.created >= args['from_date'], AuditTrailLog.created <= args['to_date'])).order_by('id desc')
            audit_log = AuditTrailLog.query.filter_by(**filter_args).filter(AuditTrailLog.session_uuid.isnot(None)).filter(AuditTrailLog.created.between(args['from_date'],args['to_date']))
            create_user_action_log(action='Get User Audit Trail Log',status='Success',session_uuid=session['uuid'])
            
        elif 'to_date' in args and 'from_date' not in args :
            create_user_action_log(action='Get User Audit Trail Log',status='Fail',session_uuid=session['uuid'])
            abort(
                code=HTTPStatus.BAD_REQUEST,
                message="From Date is required."
            )
        elif 'from_date' in args :
            filter_args.pop('from_date')
            audit_log = AuditTrailLog.query.filter_by(**filter_args).filter(AuditTrailLog.session_uuid.isnot(None)).filter(AuditTrailLog.created >= args['from_date'])
            create_user_action_log(action='Get User Audit Trail Log',status='Success',session_uuid=session['uuid'])
            
        else :
            audit_log = AuditTrailLog.query.filter_by(**filter_args).filter(AuditTrailLog.session_uuid.isnot(None))
            create_user_action_log(action='Get User Audit Trail Log',status='Success',session_uuid=session['uuid'])

        if status:
            audit_log = audit_log.filter(AuditTrailLog.status.ilike(status))

        if resource_name is not None:
            audit_log = audit_log.filter(AuditTrailLog.resource_name.ilike('%' + resource_name + '%'))

        if action_method is not None:
            audit_log = audit_log.filter(AuditTrailLog.action_method.ilike(action_method))

        if field and order:
            queryset = audit_log.order_by(field + ' ' + order)
        else:
            queryset = audit_log.order_by('id desc')

        try:
            total_count = queryset.count()
        except:
            total_count = len(queryset)

        audit_log_queryset = queryset.offset(offset).limit(limit)

        audit_trail_schema = schemas.DetailedAuditTrailLogSchema(many=True)
        audit_logs = audit_trail_schema.dump(audit_log_queryset).data

        for log in audit_logs:
            if log['error_message']:
                matches = re.findall(ip_pattern, log['error_message'])
                for match in matches:
                    ip_addr = '.'.join(match)
                    log['error_message'] = log['error_message'].replace(ip_addr, 'X.X.X.X')

        create_user_action_log(action='Get User Audit Trail Log',status='Success',session_uuid=session['uuid'])
        return (audit_logs, HTTPStatus.OK, {'X-Total-Count': total_count, 'Access-Control-Expose-Headers':'X-Total-Count'})

@api.route('/user/<int:user_id>')
class AuditTrailsByUser(Resource):
    """
    Manipulations with Audit Trails By Users.
    """
    @create_user_action_trails(action='Get User Audit Trail Log by User ID')
    @check_scope_and_auth_token('audit-trails:read')
    @api.login_required(oauth_scopes=['audit-trails:read'])
    @api.parameters(SortPaginateParameters())
    @ratelimit(rate='100/s')
    @api.response(schemas.DetailedAuditTrailLogSchema(many=True))
    @api.paginate()
    @api.sort()
    def get(self, args, user_id):
        """
        List of AuditTrail By User ID.
        """

        user = User.query.get(user_id)
        if user is None:
            create_user_action_log(action='Get User Audit Trail Log by User ID',status='Fail',session_uuid=session['uuid'],resource_id=user_id,resource_type='User')
            abort(
                code=HTTPStatus.NOT_FOUND,
                message="Invalid user_id"
            )
        
        audit_log = AuditTrailLog.query.filter_by(user_id=user_id)

        create_user_action_log(action='Get User Audit Trail Log by User ID',status='Success',session_uuid=session['uuid'],resource_id=user_id,resource_type='User')
        return audit_log

@api.route('/resource-type/')
class AuditTrailReource(Resource):
    """
    manipulation with Resource
    """
    @create_user_action_trails(action='Get Resource type list')
    @check_scope_and_auth_token('audit-trails:read')
    @api.login_required(oauth_scopes=['audit-trails:read'])
    @ratelimit(rate='100/s')
    @api.response(code=HTTPStatus.CONFLICT)
    def get(s):
        """
        Get list of resource type
        """
        resource_list = [
            "Organisation",
            "Provider",
            "Project",
            "User",
            "Compute",
            # "Auth",
            "Network",
            "SecurityGroup",
            "Volume",
            "NAS",
            # "ObjectStorage",
            "ScalingGroup",
            "LoadBalancer",
            "Floating IP",
            "PublicIP",
            "ProjectGatewayService",
            "QuotaPackage",
            # "RolePermission",
            "ComputeSnapshot",
            "VolumeSnapshot"
        ]
        create_user_action_log(action='Get Resource type list',status='Success',session_uuid=session['uuid'])
        return resource_list


@api.route('/audit_trail_by_id/<int:audit_trail_id>')
@api.response(
    code=HTTPStatus.NOT_FOUND,
    description="AuditTrail not found.",
)
@api.resolve_object_by_model(AuditTrailLog, 'audit_trail_log')
class AuditTrailByID(Resource):
    """
    Manipulations with a specific AuditTrail.
    """
    @create_user_action_trails(action='Get User Audit Trail Log by AuditTrailLog ID')
    @check_scope_and_auth_token('audit-trails:read')
    @api.login_required(oauth_scopes=['audit-trails:read'])
    @api.response(schemas.DetailedAuditTrailLogSchema())
    @ratelimit(rate='100/s')
    def get(self, audit_trail_log):
        """
        Get AuditTrail details by ID.
        """

        audit_log = AuditTrailLog.query.get(audit_trail_log.id)

        create_user_action_log(action='Get User Audit Trail Log by AuditTrailLog ID',status='Success',session_uuid=session['uuid'])
        return audit_log

    # @api.login_required(oauth_scopes=['audit-trails:write'])
    # @api.permission_required(permissions.WriteAccessPermission())
    # @api.parameters(parameters.PatchAuditTrailDetailsParameters())
    # @verify_parameters()
    # @ratelimit(rate='1/s')
    # @api.response(schemas.DetailedAuditTrailSchema())
    # @api.response(code=HTTPStatus.CONFLICT)
    # def patch(self, args, audit_trail):
    #     """
    #     Patch AuditTrail details by ID.
    #     """
    #     with api.commit_or_abort(
    #             db.session,
    #             default_error_message="Failed to update AuditTrail details."
    #         ):
    #         parameters.PatchAuditTrailDetailsParameters.perform_patch(args, obj=audit_trail)
    #         db.session.merge(audit_trail)
    #     return audit_trail
    #
    # @api.login_required(oauth_scopes=['audit-trails:write'])
    # @api.permission_required(permissions.WriteAccessPermission())
    # @ratelimit(rate='1/s')
    # @api.response(code=HTTPStatus.CONFLICT)
    # @api.response(code=HTTPStatus.NO_CONTENT)
    # def delete(self, audit_trail):
    #     """
    #     Delete a AuditTrail by ID.
    #     """
    #     with api.commit_or_abort(
    #             db.session,
    #             default_error_message="Failed to delete the AuditTrail."
    #         ):
    #         db.session.delete(audit_trail)
    #     return None


@api.route('/<int:user_id>/user-action-log/')
class UserActionLog(Resource):
    """
    Manipulation with users login / logout action details
    """

    @create_user_action_trails(action='Get User Action Log by User ID')
    @check_scope_and_auth_token('audit-trails:read')
    @api.login_required(oauth_scopes=['audit-trails:read'])
    @api.parameters(parameters.ActionLogFilterParameters())
    @ratelimit(rate='100/s')
    @api.response(schemas.DetailedAuditTrailLogSchema(many=True))
    @api.paginate()
    @api.sort()
    def get(self, args, user_id):
        """
        get user action log bu user ID
        """
        from sqlalchemy import or_
        user_action_log = AuditTrailLog.query.filter_by(user_id=user_id).filter(or_(AuditTrailLog.action_url.ilike('/api/v1/auth/forget-password/'), AuditTrailLog.action_url.ilike('/api/v1/auth/validate-forgot-password-otp/'), AuditTrailLog.action_url.ilike('/api/v1/auth/create-new-password/'), AuditTrailLog.action_url.ilike('/auth/oauth2/token'), AuditTrailLog.action_url.ilike('/api/v1/auth/validate_otp/'), AuditTrailLog.action_url.ilike('/api/v1/auth/logout/'), AuditTrailLog.action_url.ilike('/auth/oidc/token'), AuditTrailLog.action_url.ilike('/auth/oidc/password')))
        if 'from_date' in args and 'to_date' in args :
            user_action_log = user_action_log.filter(AuditTrailLog.created.between(args['from_date'],args['to_date']))

        elif 'to_date' in args and 'from_date' not in args :
            create_user_action_log(action='Get User Action Log by User ID',status='Fail',session_uuid=session['uuid'])
            abort(
                code=HTTPStatus.BAD_REQUEST,
                message="From Date is required."
            )
        
        elif 'from_date' in args :
            user_action_log = user_action_log.filter(AuditTrailLog.created >= args['from_date'])

        if 'status' in args:
            user_action_log = user_action_log.filter(AuditTrailLog.status.ilike(args['status']))
        
        # user_action_log = user_action_log.order_by('id desc')
        create_user_action_log(action='Get User Action Log by User ID',status='Success',session_uuid=session['uuid'])
        return user_action_log
        
