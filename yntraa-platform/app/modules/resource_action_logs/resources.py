# encoding: utf-8
# pylint: disable=bad-continuation
"""
RESTful API Resource Action Logs resources
--------------------------
"""

from app.modules.providers.models import Provider
import logging

from flask_login import current_user
from flask_restplus_patched import Resource
from flask_restplus_patched._http import HTTPStatus

from app.extensions import db
from app.extensions.api import Namespace, abort
from app.extensions.api.parameters import PaginationParameters
from app.modules.users import permissions
import json

from app.modules.projects.models import Project
from . import parameters, schemas
from .models import ResourceActionLog, OrganisationResourceActionLog, ProviderResourceActionLog
from app.modules.organisations.models import Organisation, OrganisationQuotaPackage
from app.modules.quotapackages.models import ResourceTopupRequest, ResourceTopup
from app.modules import calculate_current_utlization_from_resource_action_logs, RateConfig,custom_query, AlchemyEncoder, create_user_action_log, create_user_action_trails, check_scope_and_auth_token, calculate_from_resource_action_log, combine_calculated_log_and_cron_log
from app.extensions.flask_limiter import ratelimit
from flask import session
from datetime import date, datetime, timedelta

log = logging.getLogger(__name__)  # pylint: disable=invalid-name
api = Namespace('resource-action-logs', description="Resource Action Logs")  # pylint: disable=invalid-name

@api.route('/object-storage/insert/')
class InsertResourceActionLog(Resource):
    """
    Manipulation with insert resource action log
    """
    @create_user_action_trails(action='Create object storage resource action log')
    @api.login_required(oauth_scopes=['resource-action-logs:read'])
    @ratelimit(rate=RateConfig.high)
    @api.parameters(parameters.InsertResourceActionLogParameters())
    def post(self, args):
        """
        api to insert resource action log for object storage
        """
        organisation = Organisation.query.filter_by(org_id=args['organisation_code']).first()
        if organisation is None:
            create_user_action_log(action='Create object storage resource action log', status='Fail', session_uuid=session['uuid'], error_message=f"Organisation with {args['organisation_code']} not found")
            abort(
                code=HTTPStatus.NOT_FOUND,
                message=f"Organisation with {args['organisation_code']} not found"
            )

        project = Project.query.filter_by(project_id=args['project_code']).first()
        if project is None:
            create_user_action_log(action='Create object storage resource action log', status='Fail', session_uuid=session['uuid'], error_message=f"Project with {args['project_code']} not found")
            abort(
                code=HTTPStatus.NOT_FOUND,
                message=f"Project with {args['project_code']} not found"
            )

        provider = Provider.query.filter_by(provider_id=args['provider_code']).first()
        if provider is None:
            create_user_action_log(action='Create object storage resource action log', status='Fail', session_uuid=session['uuid'], error_message=f"Project with {args['project_code']} not found")
            abort(
                code=HTTPStatus.NOT_FOUND,
                message=f"Provider with {args['provider_code']} not found"
            )

        organisation_id = organisation.id
        project_id = project.id
        provider_id = provider.id
        resource_record_id = args['record_id']
        action = args['action']

        if action not in ('created', 'deleted'):
            create_user_action_log(action='Create object storage resource action log', status='Fail', session_uuid=session['uuid'], error_message=f"Project with {args['project_code']} not found")
            abort(
                code=HTTPStatus.BAD_REQUEST,
                message='Invalid action'
            )

        with db.session.begin():
            create_resource_action_log(db,
                resource_type='storage',
                resource_record_id=resource_record_id,
                action=action,
                resource_configuration='Storage '+action+' with Resources : { "object_storage":'+args['storage_size']+' }',
                user_id=current_user.id,
                project_id=project_id,
                organisation_id=organisation_id,
                provider_id=provider_id
            )

        create_user_action_log(action='Create object storage resource action log', status='Success', session_uuid=session['uuid'])
        return True, 201


@api.route('/<int:organisation_id>/<int:provider_id>/resourcestat/')
class ResourceDetails(Resource):
    """
    Manipulations wreaith Resource Action Logs.
    """

    @create_user_action_trails(action='Get List of Resource Details')
    @check_scope_and_auth_token('resource-action-logs:read')
    @api.login_required(oauth_scopes=['resource-action-logs:read'])
    @ratelimit(rate=RateConfig.high)
    @api.parameters(parameters.OrganisationResourceActionLogFilterParameters())
    def get(self, args, organisation_id, provider_id):
        """
        List of Resource Details.

        Returns a list of Resource Details starting from ``offset`` limited by ``limit``
        parameter.
        """
        resource_data = None

        organisation_quota_detail = OrganisationQuotaPackage.query.filter_by(organisation_id=organisation_id, provider_id=provider_id).first()
    
        if organisation_quota_detail is None:
            create_user_action_log(action='Get ResourceDetails by Provider ID',status='Fail',session_uuid=session['uuid'], error_message="Quotapackage not assigned on provider")
            abort(
                code=HTTPStatus.BAD_REQUEST,
                message="Quotapackage not assigned on provider"
            )
        if 'to_date' in args and 'from_date' not in args :
            create_user_action_log(action='Get ResourceDetails by Provider ID',status='Fail',session_uuid=session['uuid'], error_message="From Date is required")
            abort(
                code=HTTPStatus.BAD_REQUEST,
                message="From Date is required."
            )

        if 'from_date' in args and 'to_date' in args:
            if args['from_date'] > date.today() or args['to_date'] > date.today():
                create_user_action_log(action='Get ResourceDetails by Provider ID',status='Fail',session_uuid=session['uuid'], error_message="Invalid date, should be equal or less than today date")
                abort(
                    code=HTTPStatus.BAD_REQUEST,
                    message="Invalid date, should be equal or less than today date"
                )
            if args['from_date'] > args['to_date']:
                create_user_action_log(action='Get ResourceDetails by Provider ID',status='Fail',session_uuid=session['uuid'], error_message="to date cant be less than from date")
                abort(
                    code=HTTPStatus.BAD_REQUEST,
                    message="to date cant be less than from date"
                )
            organisation_quota_assigned_date = organisation_quota_detail.created.date()
            if args['to_date'] < organisation_quota_assigned_date:
                create_user_action_log(action='Get ResourceDetails by Provider ID',status='Fail',session_uuid=session['uuid'], error_message="Quota assigned on provider after to_date")
                abort(
                    code=HTTPStatus.BAD_REQUEST,
                    message="Quota assigned on provider after to_date"
                )
            final_result = {}
            result = []
            provider_action_log = ProviderResourceActionLog.query.with_entities(ProviderResourceActionLog.organisation_id,ProviderResourceActionLog.provider_id,ProviderResourceActionLog.action_log,ProviderResourceActionLog.action_log_date).filter_by(organisation_id=organisation_id, provider_id=provider_id).order_by('action_log_date desc').first()
            if provider_action_log is not None:
                last_log_date = provider_action_log.action_log_date
            else:
                last_log_date = organisation_quota_assigned_date

            if args['from_date'] <= args['to_date']:
                from_date = args['from_date']
                till_date = args['to_date']
                if not provider_action_log:
                    if args['from_date'] < organisation_quota_assigned_date:
                        from_date = organisation_quota_assigned_date
                    resource_data = calculate_from_resource_action_log(from_date, till_date, organisation_id, provider_id)
                    result.append(resource_data)
                    final_result['action_log'] = result
                    create_user_action_log(action='Get ResourceDetails by Provider ID',status='Success',session_uuid=session['uuid'])
                    return final_result
                else:
                    to_date = args['to_date']
                    if to_date <= last_log_date and provider_action_log:
                        resource_data =  ProviderResourceActionLog.query.filter_by(organisation_id=organisation_id, provider_id=provider_id).filter(ProviderResourceActionLog.action_log_date==to_date).order_by('created desc').first()
                        result.append(resource_data.action_log[0])
                        final_result['action_log'] = result
                        create_user_action_log(action='Get ResourceDetails by Provider ID',status='Success',session_uuid=session['uuid'])
                        return final_result
                    
                    else:
                        from_date = str(datetime.combine((last_log_date+timedelta(days=1)), datetime.min.time()))
                        till_date = str(datetime.combine(to_date, datetime.max.time()))
                        resource_data = {}
                        resource_details = ResourceActionLog.query.filter(ResourceActionLog.organisation_id == organisation_id).filter(ResourceActionLog.provider_id == provider_id).filter(ResourceActionLog.created.between(from_date,till_date))
                        if resource_details:
                            calculated_resource_data = calculate_from_resource_action_log(from_date, till_date, organisation_id, provider_id)
                            cron_resource_data = provider_action_log.action_log[0]['resource_action_log']
                            resource_data['resource_action_log'] = combine_calculated_log_and_cron_log(calculated_resource_data['resource_action_log'], cron_resource_data, organisation_id=organisation_id, provider_id=provider_id)
                            resource_data['organisation'] = calculated_resource_data['organisation']
                            result.append(resource_data)
                            final_result['action_log'] = result
                            create_user_action_log(action='Get ResourceDetails by Provider ID',status='Success',session_uuid=session['uuid'])
                            return final_result 
                        else:
                            create_user_action_log(action='Get ResourceDetails by Provider ID',status='Success',session_uuid=session['uuid'])
                            return provider_action_log.action_log

        elif 'from_date' in args:
            from_date = args['from_date']
            provider_resource_log = ProviderResourceActionLog.query.filter_by(provider_id=provider_id, organisation_id=organisation_id).filter(ProviderResourceActionLog.action_log_date >= from_date).order_by('id desc').first()
            create_user_action_log(action='Get ResourceDetails by Provider ID',status='Success',session_uuid=session['uuid'])
            resource_data = json.loads(json.dumps(provider_resource_log, cls=AlchemyEncoder))
            return resource_data

        else:
            provider_action_log  = ProviderResourceActionLog.query.filter_by(organisation_id=organisation_id, provider_id=provider_id).order_by("action_log_date desc").first()
            resource_action_log = ResourceActionLog.query.filter_by(organisation_id = organisation_id, provider_id=provider_id)
            if provider_action_log:
                last_log_date = provider_action_log.action_log_date
                from_date = str(datetime.combine((last_log_date+timedelta(days=1)), datetime.min.time()))
                resource_action_log = resource_action_log.filter(ResourceActionLog.created > from_date)
            resource_action_log = resource_action_log.all()

            resource_data = calculate_current_utlization_from_resource_action_logs(organisation_id, provider_id, resource_action_log)
            if provider_action_log:
                resource_data = combine_calculated_log_and_cron_log(resource_data, provider_action_log.action_log[0]['resource_action_log'], organisation_id=organisation_id, provider_id=provider_id)
            create_user_action_log(action='Get ResourceDetails by Provider ID',status='Success',session_uuid=session['uuid'])
            return resource_data
