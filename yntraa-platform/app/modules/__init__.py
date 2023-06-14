# encoding: utf-8
"""
Modules
=======

Modules enable logical resource separation.

You may control enabled modules by modifying ``ENABLED_MODULES`` config
variable.
"""
import json
from functools import wraps
import hashlib
import os
import random

import jinja2
import requests, ssl
import urllib.parse
import urllib.request
import urllib3, ssl
import requests
from werkzeug.datastructures import Headers
from flask_login import current_user
from collections import OrderedDict
from datetime import date, datetime, timedelta
from config import BaseConfig


# from requests.packages.urllib3.exceptions import InsecureRequestWarning

from app.extensions import audit_trail

from flask_restplus_patched._http import HTTPStatus
from app.extensions.api import Namespace, abort
from app.extensions import db, Openstack, Docker
import logging
import json
log = logging.getLogger(__name__)


def init_app(app, **kwargs):
    from importlib import import_module

    for module_name in app.config['ENABLED_MODULES']:
        import_module('.%s' % module_name, package=__name__).init_app(app, **kwargs)

"""
Function name: Validate_name
Functionality: validating name
Parameters: Actual key name, name value and minimum length
Return: name value 
"""
def validate_name(key_name, name, min_length=3):
    import re
    regex = re.compile('[@!#$%^&*()<>?/\|}{~:]_')
    if key_name == 'snapshot_name':
        pass
    # elif not name[0].isalpha():
    #     raise ValueError(key_name + " should start with a letter")
    if len(name) < min_length:
        raise ValueError(key_name + " has to be at least "+str(min_length)+" characters long.")
    if (regex.search(name) != None):
        raise ValueError(key_name + " should not contain any special character.")
    if ' ' in name:
        raise ValueError(key_name + " should not contain blank space")

    return name


def calcute_resource_topup(organisation_id, provider_id):
    from app.modules.quotapackages.models import ResourceTopup, OrganisationTopupMapping

    topup_request_details = OrganisationTopupMapping.query.filter_by(organisation_id=organisation_id, provider_id=provider_id).all()
    topup_args = {}
    if topup_request_details is not None :
        for topup in topup_request_details :
            resource_topup_details = ResourceTopup.query.filter_by(id=topup.resource_topup_id).first()
            if resource_topup_details.topup_type in topup_args :
                topup_args[resource_topup_details.topup_type] = topup_args[resource_topup_details.topup_type] + resource_topup_details.topup_value
            else :
                topup_args[resource_topup_details.topup_type] = resource_topup_details.topup_value

    return topup_args

def allocated_topup_quota_details(organisation_id, provider_id, **kwargs):
    """
    Returns: Topup Quota Detail for organisation on provider
    required parameters: organsation_id, provider_id
    optional parameters: to_date
    """
    from app.modules.quotapackages.models import ResourceTopup, OrganisationTopupMapping

    topup_quota_detail = {}

    if 'to_date' in kwargs:
        to_date = kwargs['to_date']
        topup_request_details = OrganisationTopupMapping.query.filter_by(organisation_id=organisation_id, provider_id=provider_id).filter(OrganisationTopupMapping.created < to_date).all()
    else:
        topup_request_details = OrganisationTopupMapping.query.filter_by(organisation_id=organisation_id, provider_id=provider_id).all()

    if topup_request_details is not None :
        for topup in topup_request_details :
            resource_topup_details = ResourceTopup.query.filter_by(id=topup.resource_topup_id).first()
            if resource_topup_details.topup_type in topup_quota_detail :
                topup_quota_detail[resource_topup_details.topup_type] = topup_quota_detail[resource_topup_details.topup_type] + resource_topup_details.topup_value
            else :
                topup_quota_detail[resource_topup_details.topup_type] = resource_topup_details.topup_value

    return topup_quota_detail

def allocated_base_quota_details(organisation_id, provider_id, **kwargs):
    """
    Returns: Base Quota Detail for organisation on provider
    required parameters: organsation_id, provider_id
    optional parameters: to_date
    """
    from app.modules.organisations.models import OrganisationQuotaPackage, QuotaPackageUpdateRequest
    from app.modules.quotapackages.models import QuotaPackage

    base_quota_detail = {}

    if 'to_date' in kwargs:
        to_date = kwargs.get('to_date')

        quota_update_request_exists = QuotaPackageUpdateRequest.query.filter(QuotaPackageUpdateRequest.organisation_id==organisation_id, QuotaPackageUpdateRequest.provider_id==provider_id, QuotaPackageUpdateRequest.status.ilike('approved')).all()

        if not quota_update_request_exists:
            quota_package = OrganisationQuotaPackage.query.filter_by(organisation_id=organisation_id, provider_id=provider_id).one_or_none()
            if quota_package is None:
                return base_quota_detail
            quota_package_details = QuotaPackage.query.get(quota_package.quotapackage_id)

        else:
            any_previous_quota_update_request = QuotaPackageUpdateRequest.query.filter(QuotaPackageUpdateRequest.organisation_id==organisation_id, QuotaPackageUpdateRequest.provider_id==provider_id, QuotaPackageUpdateRequest.status.ilike('approved'), QuotaPackageUpdateRequest.allocation_date < to_date).first()
            if any_previous_quota_update_request is None:
                quota_package_details = QuotaPackage.query.filter(QuotaPackage.name.ilike('small'), QuotaPackage.version.ilike('v1')).first()
            else:
                last_quota_update_request_before_to_date = QuotaPackageUpdateRequest.query.filter(QuotaPackageUpdateRequest.organisation_id==organisation_id, QuotaPackageUpdateRequest.provider_id==provider_id, QuotaPackageUpdateRequest.status.ilike('approved'), QuotaPackageUpdateRequest.allocation_date < to_date).order_by('allocation_date desc').first()
                quotapackage_id = last_quota_update_request_before_to_date.quotapackage_id
                quota_package_details = QuotaPackage.query.get(quotapackage_id)
    else:
        quota_package = OrganisationQuotaPackage.query.filter_by(organisation_id=organisation_id, provider_id=provider_id).one_or_none()
        if quota_package is None:
            return base_quota_detail
        quota_package_details = QuotaPackage.query.get(quota_package.quotapackage_id)

    quota_package_details = quota_package_details.__dict__
    for quota in quota_package_details:
        if quota not in ("id", "_sa_instance_state", "updated", "created", "name", "description",  "is_active", "version", "effective_from", "valid_till"):
            base_quota_detail[quota.replace("_","")] =  {
                "allocated":{
                    "value": quota_package_details[quota],
                    "quotapackage_breakup": [{"base": {"value": quota_package_details[quota]}}]
                    },
                "name" : quota.replace("_","")
                }

    return base_quota_detail

def prepare_quota_package_allocation_details(base_quota, topup_quota):
    """
    Returns: prepared final quota allocation for an organisation on provider
    """
    filtered_topup_quota = {topup_type.replace('_', ''):topup_value for topup_type,topup_value in topup_quota.items()}
    for resource in base_quota:
        if resource in filtered_topup_quota:
            base_quota[resource]['allocated']['value'] += filtered_topup_quota[resource]
            base_quota[resource]['allocated']['quotapackage_breakup'].append({'topup': {'value': filtered_topup_quota[resource]}})

    return base_quota

def get_allocated_quota_detail(organisation_id, provider_id, **kwargs):
    """
    Returns: Organisation quota allocation on provider
    """
    base_quota = allocated_base_quota_details(organisation_id, provider_id, **kwargs)
    topup_quota = allocated_topup_quota_details(organisation_id, provider_id, **kwargs)
    final_allocated_quota = prepare_quota_package_allocation_details(base_quota, topup_quota)
    return final_allocated_quota

def prepare_consumed_initial_dict():
    from app.modules.quotapackages.models import QuotaPackage
    consumed_dict = {}
    quota_package_keys = QuotaPackage.__table__.columns.keys()
    for key in quota_package_keys:
        resource_name = key.replace("_", "")
        if key not in ("id", "updated", "created", "name", "description",  "is_active", "version", "effective_from", "valid_till"):
            consumed_dict[resource_name] =  {
                "consumed":{
                    "value": 0,
                },
                "name" : resource_name
                }
        # if resource_name == 'loadbalancer':
        #     consumed_dict[resource_name]["consumed"]["resource_breakup"] = {"vcpu": {"value": 0}, "ram": {"value": 0}, "storage": {"value": 0}}
        # # if resource_name == 'storage':
        # #     consumed_dict[resource_name]["consumed"]["consume_breakup"] = [{"block_storage": {"value": 0}}, {"nas_storage": {"value": 0}}, {"object_storage": {"value": 0}}]
        # if resource_name == 'project':
        #     consumed_dict[resource_name]["consumed"]["resource_breakup"] = {"gateway": {"vcpu": {"value": 0}, "ram": {"value": 0}, "storage": {"value": 0}}}
        # if resource_name == 'vm':
        #     consumed_dict[resource_name]["consumed"]["resource_breakup"] = {"normal_vm": {"value": 0}, "nks_worker": {"value": 0}}
        # if resource_name == 'volumesnapshot' or resource_name == 'vmsnapshot':
        #     consumed_dict[resource_name]["consumed"]["storage"] = 0
        # if resource_name == 'nkscluster':
        #     consumed_dict[resource_name]['consumed']["resource_breakup"] = {"nks_controller": {"vm": {"value": 0}, "vcpu": {"value": 0}, "ram": {"value": 0}, "storage": {"value": 0}}}

    return consumed_dict

def calculate_resource_action_log_consumption(resource_action_logs):

    consumed_resources = prepare_consumed_initial_dict()

    for resource_action_log in resource_action_logs:
        resource_configuration = resource_action_log.resource_configuration
        resource_type = resource_action_log.resource_type.lower().replace("_","")
        action = resource_action_log.action.lower()

        if resource_type == "project":
            if action == 'initialized':
                consumed_resources[resource_type]['consumed']['value'] += 1
            elif action == 'uninitialized':
                consumed_resources[resource_type]['consumed']['value'] -= 1

        # elif resource_type == 'loadbalancer':
        #     resource_details = json.loads(str(resource_configuration[resource_configuration.index('{'):resource_configuration.find('}')+1]))
        #     if action == 'created':
        #         consumed_resources[resource_type]['consumed']['value'] += 1
        #         consumed_resources[resource_type]['consumed']['resource_breakup']['vcpu']['value'] += int(resource_details.get('vcpu'))
        #         consumed_resources[resource_type]['consumed']['resource_breakup']['ram']['value'] += int(resource_details.get('ram'))
        #         consumed_resources[resource_type]['consumed']['resource_breakup']['storage']['value'] += int(resource_details.get('storage'))
        #     elif action == 'deleted':
        #         consumed_resources[resource_type]['consumed']['value'] -= 1
        #         consumed_resources[resource_type]['consumed']['resource_breakup']['vcpu']['value'] -= int(resource_details.get('vcpu'))
        #         consumed_resources[resource_type]['consumed']['resource_breakup']['ram']['value'] -= int(resource_details.get('ram'))
        #         consumed_resources[resource_type]['consumed']['resource_breakup']['storage']['value'] -= int(resource_details.get('storage'))
        #
        # elif resource_type == 'gateway vm':
        #     resource_details = json.loads(str(resource_configuration[resource_configuration.index('{'):resource_configuration.find('}')+1]))
        #     if action == 'created':
        #         consumed_resources['project']['consumed']['resource_breakup']['gateway']['vcpu']['value'] += int(resource_details.get('vcpu'))
        #         consumed_resources['project']['consumed']['resource_breakup']['gateway']['ram']['value'] += int(resource_details.get('ram'))
        #         consumed_resources['project']['consumed']['resource_breakup']['gateway']['storage']['value'] += int(resource_details.get('storage'))
        #     elif action == 'deleted':
        #         consumed_resources['project']['consumed']['resource_breakup']['gateway']['vcpu']['value'] -= int(resource_details.get('vcpu'))
        #         consumed_resources['project']['consumed']['resource_breakup']['gateway']['ram']['value'] -= int(resource_details.get('ram'))
        #         consumed_resources['project']['consumed']['resource_breakup']['gateway']['storage']['value'] -= int(resource_details.get('storage'))
        #
        # elif resource_type == 'nkscluster':
        #     resource_details = json.loads(str(resource_configuration[resource_configuration.index('{'):resource_configuration.find('}')+1]))
        #     if action == 'created':
        #         consumed_resources[resource_type]['consumed']['value'] += 1
        #         consumed_resources[resource_type]['consumed']['resource_breakup']['nks_controller']['vm']['value'] += int(resource_details.get('vm'))
        #         consumed_resources[resource_type]['consumed']['resource_breakup']['nks_controller']['vcpu']['value'] += int(resource_details.get('vcpu'))
        #         consumed_resources[resource_type]['consumed']['resource_breakup']['nks_controller']['ram']['value'] += int(resource_details.get('ram'))
        #         consumed_resources[resource_type]['consumed']['resource_breakup']['nks_controller']['storage']['value'] += int(resource_details.get('storage'))
        #     elif action == 'deleted':
        #         consumed_resources[resource_type]['consumed']['value'] -= 1
        #         consumed_resources[resource_type]['consumed']['resource_breakup']['nks_controller']['vm']['value'] -= int(resource_details.get('vm'))
        #         consumed_resources[resource_type]['consumed']['resource_breakup']['nks_controller']['vcpu']['value'] -= int(resource_details.get('vcpu'))
        #         consumed_resources[resource_type]['consumed']['resource_breakup']['nks_controller']['ram']['value'] -= int(resource_details.get('ram'))
        #         consumed_resources[resource_type]['consumed']['resource_breakup']['nks_controller']['storage']['value'] -= int(resource_details.get('storage'))
        #
        # elif resource_type == 'vm' or resource_type == 'nksworker':
        #     resource_details = json.loads(str(resource_configuration[resource_configuration.index('{'):resource_configuration.find('}')+1]))
        #     if action == 'created':
        #         if resource_type == 'vm':
        #             consumed_resources['vm']['consumed']['resource_breakup']['normal_vm']['value'] += 1
        #         elif resource_type == 'nksworker':
        #             consumed_resources['vm']['consumed']['resource_breakup']['nks_worker']['value'] += 1
        #         consumed_resources['vm']['consumed']['value'] += 1
        #         consumed_resources['vcpu']['consumed']['value'] += int(resource_details['vcpu'])
        #         consumed_resources['ram']['consumed']['value'] += int(resource_details['ram'])
        #         consumed_resources['storage']['consumed']['value'] += int(resource_details['storage'])
        #         # consumed_resources['storage']['consumed']['consume_breakup'][0]['block_storage']['value'] += int(resource_details['storage'])
        #
        #         vcpu_cost = get_resource_cost('vcpu', resource_details['vcpu'], resource_action_log.created, 'production')
        #         ram_cost = get_resource_cost('ram', resource_details['ram'], resource_action_log.created, 'production')
        #         storage_cost = get_resource_cost('storage', resource_details['storage'], resource_action_log.created, 'production')
        #         image_cost = get_resource_cost(resource_details['os'], 1, resource_action_log.created, 'production')
        #         consumed_resources['quotapackagevalue']['consumed']['value'] += int(vcpu_cost + ram_cost + storage_cost + image_cost)
        #     elif action =='deleted':
        #         if resource_type == 'vm':
        #             consumed_resources['vm']['consumed']['resource_breakup']['normal_vm']['value'] -= 1
        #         elif resource_type == 'nksworker':
        #             consumed_resources['vm']['consumed']['resource_breakup']['nks_worker']['value'] -= 1
        #         consumed_resources['vm']['consumed']['value'] -= 1
        #         consumed_resources['vcpu']['consumed']['value'] -= int(resource_details['vcpu'])
        #         consumed_resources['ram']['consumed']['value'] -= int(resource_details['ram'])
        #         consumed_resources['storage']['consumed']['value'] -= int(resource_details['storage'])
        #         # consumed_resources['storage']['consumed']['consume_breakup'][0]['block_storage']['value'] -= int(resource_details['storage'])
        #
        #         vcpu_cost = get_resource_cost('vcpu', resource_details['vcpu'], resource_action_log.created, 'production')
        #         ram_cost = get_resource_cost('ram', resource_details['ram'], resource_action_log.created, 'production')
        #         storage_cost = get_resource_cost('storage', resource_details['storage'], resource_action_log.created, 'production')
        #         image_cost = get_resource_cost(resource_details['os'], 1, resource_action_log.created, 'production')
        #         consumed_resources['quotapackagevalue']['consumed']['value'] -= int(vcpu_cost + ram_cost + storage_cost + image_cost)
        #
        # elif resource_type == 'vmsnapshot' or resource_type == 'volumesnapshot':
        #     resource_details = json.loads(str(resource_configuration[resource_configuration.index('{'):resource_configuration.find('}')+1]))
        #     if action == 'created':
        #         consumed_resources[resource_type]['consumed']['value'] += 1
        #         consumed_resources['storage']['consumed']['value'] += int(resource_details['storage'])
        #         # consumed_resources['storage']['consumed']['consume_breakup'][0]['block_storage']['value'] += int(resource_details['storage'])
        #         storage_cost = get_resource_cost('storage', resource_details['storage'], resource_action_log.created, 'production')
        #         consumed_resources['quotapackagevalue']['consumed']['value'] += int(storage_cost)
        #     elif action == 'deleted':
        #         consumed_resources[resource_type]['consumed']['value'] += 1
        #         consumed_resources['storage']['consumed']['value'] -= int(resource_details['storage'])
        #         # consumed_resources['storage']['consumed']['consume_breakup'][0]['block_storage']['value'] -= int(resource_details['storage'])
        #         storage_cost = get_resource_cost('storage', resource_details['storage'], resource_action_log.created, 'production')
        #         consumed_resources['quotapackagevalue']['consumed']['value'] -= int(storage_cost)
        #     pass
        #
        # elif resource_type == 'storage':
        #     resource_details = json.loads(str(resource_configuration[resource_configuration.index('{'):resource_configuration.find('}')+1]))
        #     if action == 'created':
        #         if 'nas_storage' in resource_details:
        #             consumed_resources['nasstorage']['consumed']['value'] += int(resource_details['nas_storage'])
        #             # consumed_resources[resource_type]['consumed']['value'] += int(resource_details['nas_storage'])
        #             # consumed_resources[resource_type]['consumed']['consume_breakup'][1]['nas_storage']['value'] += int(resource_details['nas_storage'])
        #             storage_cost = get_resource_cost('storage', resource_details['nas_storage'], resource_action_log.created, 'production')
        #         elif 'object_storage' in resource_details:
        #             pass
        #             # consumed_resources['objectstorage']['consumed']['value'] += int(resource_details['object_storage'])
        #             # consumed_resources[resource_type]['consumed']['value'] += int(resource_details['object_storage'])
        #             # consumed_resources[resource_type]['consumed']['consume_breakup'][2]['object_storage']['value'] += int(resource_details['object_storage'])
        #             # storage_cost = get_resource_cost('storage', resource_details['object_storage'], resource_action_log.created, 'production')
        #         else:
        #             consumed_resources[resource_type]['consumed']['value'] += int(resource_details['storage'])
        #             # consumed_resources[resource_type]['consumed']['consume_breakup'][0]['block_storage']['value'] += int(resource_details['storage'])
        #             storage_cost = get_resource_cost('storage', resource_details['storage'], resource_action_log.created, 'production')
        #         consumed_resources['quotapackagevalue']['consumed']['value'] += int(storage_cost)
        #     elif action == 'deleted':
        #         if 'nas_storage' in resource_details:
        #             consumed_resources['nasstorage']['consumed']['value'] -= int(resource_details['nas_storage'])
        #             # consumed_resources[resource_type]['consumed']['value'] -= int(resource_details['nas_storage'])
        #             # consumed_resources[resource_type]['consumed']['consume_breakup'][1]['nas_storage']['value'] -= int(resource_details['nas_storage'])
        #             storage_cost = get_resource_cost('storage', resource_details['nas_storage'], resource_action_log.created, 'production')
        #         elif 'object_storage' in resource_details:
        #             pass
        #             # consumed_resources['objectstorage']['consumed']['value'] -= int(resource_details['object_storage'])
        #             # consumed_resources[resource_type]['consumed']['value'] -= int(resource_details['object_storage'])
        #             # consumed_resources[resource_type]['consumed']['consume_breakup'][2]['object_storage']['value'] -= int(resource_details['object_storage'])
        #             # storage_cost = get_resource_cost('storage', resource_details['object_storage'], resource_action_log.created, 'production')
        #         else:
        #             consumed_resources[resource_type]['consumed']['value'] -= int(resource_details['storage'])
        #             # consumed_resources[resource_type]['consumed']['consume_breakup'][0]['block_storage']['value'] -= int(resource_details['storage'])
        #             storage_cost = get_resource_cost('storage', resource_details['storage'], resource_action_log.created, 'production')
        #         consumed_resources['quotapackagevalue']['consumed']['value'] -= int(storage_cost)

        # elif resource_type in consumed_resources and resource_type not in ('loadbalancer', 'gateway vm', 'nkscluster', 'vm', 'nksworker', 'vmsnapshot', 'volumesnapshot', 'storage', 'nasstorage'):
        #     if action == 'created':
        #        consumed_resources[resource_type]['consumed']['value'] += 1
        #     elif action == 'deleted':
        #         consumed_resources[resource_type]['consumed']['value'] -= 1
        #     elif action == 'withdraw':
        #         consumed_resources[resource_type]['consumed']['value'] -= 1

    return consumed_resources

def calculate_available_resources_from_allocated(allocated_quota, consumed_resources):
    available_resources = {}
    for resource_type in allocated_quota.keys():
        available_resources[resource_type] = {
            'available': {
                'value': allocated_quota[resource_type]['allocated']['value'] - consumed_resources[resource_type]['consumed']['value']
            },
            'name': allocated_quota[resource_type]['name']
        }

    return available_resources

def prepare_resource_utilization_dict(allocated_quota, consumed_resources, available_resources):
    final_resource_utilization = {}
    for resource_type in allocated_quota.keys():
        final_resource_utilization[resource_type] = {
            'name': allocated_quota[resource_type]['name'],
            'allocated': allocated_quota[resource_type]['allocated'],
            'consumed': consumed_resources[resource_type]['consumed'],
            'available': available_resources[resource_type]['available']
        }
    return final_resource_utilization

def combine_cron_current_utlization(cron_utilization, current_utilization):
    combined_utlization = {}
    for resource_type in current_utilization.keys():
        combined_utlization[resource_type] = {'name': current_utilization[resource_type]['name']}
        # if resource_type not in ('nkscluster', 'nasstorage'):
        #     combined_utlization[resource_type] = {
        #         'consumed': {
        #             'value': cron_utilization[resource_type]['consumed']['value'] + current_utilization[resource_type]['consumed']['value']
        #         }
        #     }
        # if resource_type == 'vmsnapshot' or resource_type =='volumesnapshot':
        #    combined_utlization[resource_type]['consumed']['storage'] = cron_utilization[resource_type]['consumed']['storage'] + current_utilization[resource_type]['consumed']['storage']
        #
        # if resource_type == 'loadbalancer':
        #     combined_utlization[resource_type]['consumed']['resource_breakup'] = {
        #         'vcpu': {
        #             'value': cron_utilization[resource_type]['consumed']['resource_breakup']['vcpu']['value'] + current_utilization[resource_type]['consumed']['resource_breakup']['vcpu']['value']
        #         },
        #         'ram': {
        #             'value': cron_utilization[resource_type]['consumed']['resource_breakup']['ram']['value'] + current_utilization[resource_type]['consumed']['resource_breakup']['ram']['value']
        #         },
        #         'storage': {
        #             'value': cron_utilization[resource_type]['consumed']['resource_breakup']['storage']['value'] + current_utilization[resource_type]['consumed']['resource_breakup']['storage']['value']
        #         }
        #     }
        #
        # if resource_type == 'project':
        #     combined_utlization[resource_type]['consumed']['resource_breakup'] = {
        #         'gateway':{
        #             'vcpu': {
        #                 'value': cron_utilization[resource_type]['consumed']['resource_breakup']['gateway']['vcpu']['value'] + current_utilization[resource_type]['consumed']['resource_breakup']['gateway']['vcpu']['value']
        #             },
        #             'ram': {
        #                 'value': cron_utilization[resource_type]['consumed']['resource_breakup']['gateway']['ram']['value'] + current_utilization[resource_type]['consumed']['resource_breakup']['gateway']['ram']['value']
        #             },
        #             'storage': {
        #                 'value': cron_utilization[resource_type]['consumed']['resource_breakup']['gateway']['storage']['value'] + current_utilization[resource_type]['consumed']['resource_breakup']['gateway']['storage']['value']
        #             }
        #         }
        #     }

        # if resource_type == 'storage':
        #     combined_utlization[resource_type]['consumed']['consume_breakup'] = []
        #     combined_utlization[resource_type]['consumed']['consume_breakup'].append({
        #     'block_storage': {'value': cron_utilization[resource_type]['consumed']['consume_breakup'][0]['block_storage']['value'] + current_utilization[resource_type]['consumed']['consume_breakup'][0]['block_storage']['value']}
        #     })
        #     combined_utlization[resource_type]['consumed']['consume_breakup'].append({
        #     'nas_storage': {'value': cron_utilization[resource_type]['consumed']['consume_breakup'][1]['nas_storage']['value'] + current_utilization[resource_type]['consumed']['consume_breakup'][1]['nas_storage']['value']}
        #     })
        #     if len(cron_utilization[resource_type]['consumed']['consume_breakup']) > 2:
        #         combined_utlization[resource_type]['consumed']['consume_breakup'].append({
        #         'object_storage': {'value': cron_utilization[resource_type]['consumed']['consume_breakup'][2]['object_storage']['value'] + current_utilization[resource_type]['consumed']['consume_breakup'][2]['object_storage']['value']}
        #         })
        #     else:
        #         combined_utlization[resource_type]['consumed']['consume_breakup'].append({
        #         'object_storage': {'value': current_utilization[resource_type]['consumed']['consume_breakup'][2]['object_storage']['value']}
        #         })

        # if resource_type == 'nasstorage':
        #     if 'nasstorage' not in cron_utilization:
        #         combined_utlization[resource_type] = {
        #             'consumed': current_utilization[resource_type]['consumed']
        #         }
        #         if 'consume_breakup' in cron_utilization['storage']['consumed'] and len(cron_utilization['storage']['consumed']['consume_breakup']) > 1:
        #             combined_utlization[resource_type]['consumed']['value'] += cron_utilization['storage']['consumed']['consume_breakup'][1]['nas_storage']['value']
        #     else:
        #         combined_utlization[resource_type] = {
        #         'consumed': {
        #             'value': cron_utilization[resource_type]['consumed']['value'] + current_utilization[resource_type]['consumed']['value']
        #         }}
        #
        # if resource_type == 'vm':
        #     if 'resource_breakup' in cron_utilization[resource_type]['consumed']:
        #         combined_utlization[resource_type]['consumed']['resource_breakup'] = {
        #             'normal_vm': {
        #                 'value': cron_utilization[resource_type]['consumed']['resource_breakup']['normal_vm']['value'] + current_utilization[resource_type]['consumed']['resource_breakup']['normal_vm']['value']
        #             },
        #             'nks_worker': {
        #                 'value': cron_utilization[resource_type]['consumed']['resource_breakup']['nks_worker']['value'] + current_utilization[resource_type]['consumed']['resource_breakup']['nks_worker']['value']
        #             }
        #         }
        #     else:
        #         combined_utlization[resource_type]['consumed']['resource_breakup'] = {
        #             'normal_vm': {
        #                 'value': cron_utilization['vm']['consumed']['value'] + current_utilization[resource_type]['consumed']['resource_breakup']['normal_vm']['value']
        #             },
        #             'nks_worker': {
        #                 'value': current_utilization[resource_type]['consumed']['resource_breakup']['nks_worker']['value']
        #             }
        #         }
        #
        # if resource_type == 'nkscluster':
        #     if 'nkscluster' not in cron_utilization:
        #         combined_utlization[resource_type] = {
        #             'consumed': current_utilization[resource_type]['consumed']
        #         }
        #     else:
        #         combined_utlization[resource_type] = {
        #         'consumed': {
        #             'value': cron_utilization[resource_type]['consumed']['value'] + current_utilization[resource_type]['consumed']['value']
        #         }}
        #         combined_utlization[resource_type]['consumed']['resource_breakup'] = {
        #             'nks_controller':{
        #                 'vm': {
        #                     'value': cron_utilization[resource_type]['consumed']['resource_breakup']['nks_controller']['vm']['value'] + current_utilization[resource_type]['consumed']['resource_breakup']['nks_controller']['vm']['value']
        #                 },
        #                 'vcpu': {
        #                     'value': cron_utilization[resource_type]['consumed']['resource_breakup']['nks_controller']['vcpu']['value'] + current_utilization[resource_type]['consumed']['resource_breakup']['nks_controller']['vcpu']['value']
        #                 },
        #                 'ram': {
        #                     'value': cron_utilization[resource_type]['consumed']['resource_breakup']['nks_controller']['ram']['value'] + current_utilization[resource_type]['consumed']['resource_breakup']['nks_controller']['ram']['value']
        #                 },
        #                 'storage': {
        #                     'value': cron_utilization[resource_type]['consumed']['resource_breakup']['nks_controller']['storage']['value'] + current_utilization[resource_type]['consumed']['resource_breakup']['nks_controller']['storage']['value']
        #                 }
        #             }
        #         }

    return combined_utlization

def calculate_current_utlization_from_resource_action_logs(organisation_id, provider_id, resource_action_logs, **kwargs):

    allocated_resources = get_allocated_quota_detail(organisation_id, provider_id, **kwargs)
    if len(allocated_resources) == 0:
        return {}

    if resource_action_logs is None:
        abort(
            code=HTTPStatus.BAD_REQUEST,
            message="Resources Data is not valid !!!!!"
        )

    consumed_resources = calculate_resource_action_log_consumption(resource_action_logs)
    available_resources = calculate_available_resources_from_allocated(allocated_resources, consumed_resources)
    result = prepare_resource_utilization_dict(allocated_resources, consumed_resources, available_resources)

    return result

def get_resource_cost(resource_type, resource, resource_action_date, environment):

    import logging
    import json
    from app.modules.resource_costs.models import ResourceCost
    log = logging.getLogger(__name__)

    resource_cost = 0
    resource_production_cost = 0

    resource_cost_price = ResourceCost.query.filter_by(item=resource_type).one_or_none()
    if resource_cost_price is not None:
        if environment == 'production':
            resource_production_cost = resource_cost_price.cost_production
    resource_cost = resource * resource_production_cost

    return resource_cost

# def create_resource_action_log(db, **kwargs):
#     from app.modules.resource_action_logs.models import ResourceActionLog
#     from app.modules.load_balancers.models import LoadBalancer
#     # from app.modules.compute.models import Compute, Images, ComputeSnapshot
#     # from app.modules.networks.models import Network, SecurityGroup, ReserveFloatingIP
#     from app.modules.volumes.models import Volume, VolumeSnapshot
#     resource_type=None,
#     resource_record_id=None,
#     action=None,
#     resource_configuration=None,
#     user_id=None,
#     project_id=0,
#     organisation_id=0,
#     provider_id=0
#
#     if 'resource_type' in kwargs:
#         resource_type = kwargs['resource_type'].lower()
#     if 'resource_record_id' in kwargs:
#         resource_record_id = kwargs['resource_record_id']
#     if 'action' in kwargs:
#         action = kwargs['action'].lower()
#     if 'resource_configuration' in kwargs:
#         resource_configuration = kwargs['resource_configuration']
#     if 'user_id' in kwargs:
#         user_id = kwargs['user_id']
#     if 'project_id' in kwargs:
#         project_id = kwargs['project_id']
#     if 'organisation_id' in kwargs:
#         organisation_id = kwargs['organisation_id']
#     if 'provider_id' in kwargs:
#         provider_id = kwargs['provider_id']
#     import json
#     new_resource_action_log = ResourceActionLog(
#                                 resource_type=resource_type,
#                                 resource_record_id=resource_record_id,
#                                 action=action,
#                                 resource_configuration=resource_configuration,
#                                 user_id=user_id,
#                                 project_id=project_id,
#                                 organisation_id=organisation_id,
#                                 provider_id=provider_id
#                                 )
#     db.session.add(new_resource_action_log)
#
#     # resource_name = "None"
#
#     # if resource_record_id:
#     #     if resource_type.lower() == 'storage':
#     #         volume_detail = Volume.query.get(resource_record_id)
#     #         if volume_detail is not None:
#     #             resource_name = volume_detail.volume_name
#     #     if resource_type.lower() == 'vm':
#     #         compute_detail = Compute.query.get(resource_record_id)
#     #         if compute_detail is not None:
#     #             resource_name = compute_detail.instance_name
#     #     if resource_type.lower() == 'vmsnapshot':
#     #         image_detail = Images.query.get(resource_record_id)
#     #         if image_detail is not None:
#     #             resource_name = image_detail.name
#     #     if resource_type.lower() == 'network':
#     #         network_detail = Network.query.get(resource_record_id)
#     #         if network_detail is not None:
#     #             resource_name = network_detail.network_name
#     #     if resource_type.lower() == 'securitygroup':
#     #         security_group_detail = SecurityGroup.query.get(resource_record_id)
#     #         if security_group_detail is not None:
#     #             resource_name = security_group_detail.security_group_name
#     #     if resource_type.lower() == 'floating_ip':
#     #         floating_ip_detail = ReserveFloatingIP.query.get(resource_record_id)
#     #         if floating_ip_detail is not None:
#     #             resource_name = floating_ip_detail.floating_ip
#     #     if resource_type.lower() == 'volumesnapshot':
#     #         volume_snapshot_details = VolumeSnapshot.query.get(resource_record_id)
#     #         if volume_snapshot_details is not None:
#     #             resource_name = volume_snapshot_details.snapshot_name
#
#         # from app.modules.invoices.helpers import InvoiceResourceUsageLog
#         # invoice_resource_type = InvoiceResourceUsageLog.get_invoice_resource_usage_resource_type(
#         #     resource_type=resource_type)
#
#         # if invoice_resource_type:
#         #     InvoiceResourceUsageLog(
#         #         db=db,
#         #         provider_id=provider_id,
#         #         project_id=project_id,
#         #         resource_id=resource_record_id,
#         #         resource_name=resource_name,
#         #         resource_type=invoice_resource_type,
#         #         resource_info=InvoiceResourceUsageLog.get_invoice_resource_usage_info(
#         #             resource_type=resource_type,
#         #             resource_configuration=resource_configuration
#         #         ),
#         #         action=InvoiceResourceUsageLog.get_invoice_resource_usage_action(action=action)
#         #     )
#
#     # new_resource_action_log = new_resource_action_log.tojson()
#     # sio.emit('send_log', {"data": "test"})
#
#     return new_resource_action_log





def get_token():
    from flask import request
    authorisation_token = request.headers.get('Authorization')
    authorisation_token_details = list(authorisation_token.split(" "))
    authorisation_token = authorisation_token_details[1]

    return authorisation_token

def create_user_action_log(action=None, status=None, ref_task_id=None, project_id=None, provider_id=None, organisation_id=None, session_uuid=None, resource_id=None, resource_type=None, resource_name=None, error_message=None, api_parameters=None):
    from flask import request, g, current_app
    from flask_login import current_user
    import logging
    from app.modules.audit_trails.models import AuditTrailLog
    from app.modules.projects.models import Project, ProjectGatewayService
    from app.modules.organisations.models import Organisation, OrganisationOnboardingRequest
    from app.modules.providers.models import Provider
    from app.modules.users.models import User
    # from app.modules.load_balancers.models import LoadBalancer
    # from app.modules.compute.models import Compute, Flavors, Images, ComputeSnapshot
    # from app.modules.invoices.models import Invoice, InvoicePriceRules
    # from app.modules.nas_volumes.models import NasRequest
    # from app.modules.networks.models import Network, SecurityGroup, ReserveFloatingIP
    from app.modules.quotapackages.models import ResourceTopup, QuotaPackage
    # from app.modules.public_ips.models import PublicIPRequest
    from app.modules.role_permission.models import RolePermissionGroup
    # from app.modules.scaling_groups.models import ScalingGroup
    # from app.modules.volumes.models import Volume
    from app.extensions import api, db
    import uuid
    log = logging.getLogger(__name__)
    request_method =  request.method
    current_path = request.path

    try:
        x_real_ip = request.headers.get('X-Real-Ip')
        request_url = request.headers.get('Referer')
        origin = request.headers.get('Origin')
        organisation_name = None
        provider_name = None
        project_name = None
        user_id = None
        resource_name = None
        username = None
        #project_id=None
        #provider_id=None
        #organisation_id=None

        try:
            user_id = current_user.id
            username = current_user.username
        except Exception as e:
            if 'username' in request.form:
                username = request.form.get('username')
                user = User.query.filter_by(username=username).first()
                if user is not None:
                    user_id = user.id
            elif current_app.config.get('IS_OIDC_ENABLED') and 'preferred_username' in g.oidc_token_info:
                username=g.oidc_token_info['preferred_username']
                user = User.query.filter_by(username=username).first()
                if user is not None:
                    user_id = user.id

        if provider_id is None:
            if 'provider_id' in request.view_args:
                provider_id = request.view_args['provider_id']
            elif 'provider_id' in request.form:
                provider_id = request.form.get('provider_id')

        if provider_id:
            provider = Provider.query.get(provider_id)
            provider_name = provider.provider_name
        try:
            if project_id is None:
                if 'project_id' in request.view_args:
                    project_id = request.view_args['project_id']
                elif 'project_id' in request.form:
                    project_id = request.form.get('project_id')

                if project_id:
                    project = Project.query.get(project_id)
                    organisation_id = project.organisation_id
                    project_name =  project.name
            else:
                project = Project.query.get(project_id)
                project_name =  project.name
                organisation_id = project.organisation_id
        except Exception as e:
            log.info(str(e))

        if organisation_id is None:
            if 'organisation_id' in request.view_args:
                organisation_id = request.view_args['organisation_id']
            elif 'organisation_id' in request.form:
                organisation_id = request.form.get('organisation_id')

        if organisation_id:
            organisation = Organisation.query.get(organisation_id)
            organisation_name = organisation.name

        if resource_id:
            if resource_type == 'User':
                user_detail = User.query.get(resource_id)
                if user_detail is not None:
                    resource_name = user_detail.username
            # if resource_type == 'Compute':
            #     compute_detail = Compute.query.get(resource_id)
            #     if compute_detail is not None:
            #         resource_name = compute_detail.instance_name
            # if resource_type == 'Flavor':
            #     flavor_detail = Flavors.query.get(resource_id)
            #     if flavor_detail is not None:
            #         resource_name = flavor_detail.name
            # if resource_type == 'Image':
            #     image_detail = Images.query.get(resource_id)
            #     if image_detail is not None:
            #         resource_name = image_detail.name
            # if resource_type == 'LoadBalancer':
            #     lb_detail = LoadBalancer.query.get(resource_id)
            #     if lb_detail is not None:
            #         resource_name = lb_detail.name
            # if resource_type == 'NAS':
            #     nas_detail = NasRequest.query.get(resource_id)
            #     if nas_detail is not None:
            #         resource_name = nas_detail.nas_volume_name
            # if resource_type == 'Network':
            #     network_detail = Network.query.get(resource_id)
            #     if network_detail is not None:
            #         resource_name = network_detail.network_name
            # if resource_type == 'SecurityGroup':
            #     security_group_detail = SecurityGroup.query.get(resource_id)
            #     if security_group_detail is not None:
            #         resource_name = security_group_detail.security_group_name
            # if resource_type == 'Onboard Request':
            #     onboard_detail = OrganisationOnboardingRequest.query.get(resource_id)
            #     if onboard_detail is not None:
            #         resource_name = onboard_detail.name
            # if resource_type == 'Resource Topup':
            #     topup_detail = ResourceTopup.query.get(resource_id)
            #     if topup_detail is not None:
            #         resource_name = topup_detail.topup_item
            # if resource_type == 'ProjectGatewayService':
            #     project_gateway_detail = ProjectGatewayService.query.get(resource_id)
            #     if project_gateway_detail is not None:
            #         resource_name = project_gateway_detail.service_name
            # if resource_type == 'PublicIP':
            #     public_ip_request_detail = PublicIPRequest.query.get(resource_id)
            #     if public_ip_request_detail is not None:
            #         resource_name = public_ip_request_detail.application_name
            # if resource_type == 'QuotaPackage':
            #     organisation_detail = Organisation.query.get(resource_id)
            #     if organisation_detail is not None:
            #         resource_name = organisation_detail.name
            # if resource_type == 'RolePermissionGroup':
            #     admin_role_detail = RolePermissionGroup.query.get(resource_id)
            #     if admin_role_detail is not None:
            #         resource_name = admin_role_detail.group_name
            # if resource_type == 'ScalingGroup':
            #     scaling_group_detail = ScalingGroup.query.get(resource_id)
            #     if scaling_group_detail is not None:
            #         resource_name = scaling_group_detail.name
            # if resource_type == 'Volume':
            #     volume_detail = Volume.query.get(resource_id)
            #     if volume_detail is not None:
            #         resource_name = volume_detail.volume_name
            # if resource_type == 'Floating IP':
            #     floating_ip_detail = ReserveFloatingIP.query.get(resource_id)
            #     if floating_ip_detail is not None:
            #         resource_name = floating_ip_detail.floating_ip
            # if resource_type == 'ComputeSnapshot':
            #     compute_ss_detail = ComputeSnapshot.query.get(resource_id)
            #     if compute_ss_detail is not None:
            #         resource_name = compute_ss_detail.snapshot_name
            # if resource_type == 'InvoicePriceRule':
            #     price_rule_detail = InvoicePriceRules.query.get(resource_id)
            #     if price_rule_detail is not None:
            #         resource_name = price_rule_detail.name
            # if resource_type == 'Invoice':
            #     invoice_detail = Invoice.query.get(resource_id)
            #     if invoice_detail is not None:
            #         resource_name = invoice_detail.name

        try:

            with db.session.begin():
                #log.info(str(session_uuid))
                audit_log = AuditTrailLog.query.filter_by(session_uuid = str(session_uuid)).first()
                if audit_log is not None:
                    audit_log.organisation_id = organisation_id
                    audit_log.organisation_name = organisation_name
                    audit_log.provider_id = provider_id
                    audit_log.provider_name = provider_name
                    audit_log.project_id = project_id
                    audit_log.project_name = project_name
                    audit_log.action = action
                    audit_log.status = status
                    audit_log.action_url = current_path
                    audit_log.action_method = request.method
                    audit_log.ref_task_id = str(ref_task_id)
                    audit_log.resource_id = resource_id
                    audit_log.resource_type = resource_type
                    audit_log.resource_name = resource_name
                    audit_log.error_message = error_message

                    db.session.merge(audit_log)

                else :
                    audit_trail_log = AuditTrailLog(
                            user_id=user_id,
                            user_name=username,
                            organisation_id=organisation_id,
                            organisation_name=organisation_name,
                            provider_id=provider_id,
                            provider_name=provider_name,
                            project_id=project_id,
                            project_name=project_name,
                            action=action,
                            status=status,
                            action_url=current_path,
                            action_method=request.method,
                            ref_task_id = ref_task_id,
                            session_uuid = session_uuid,
                            resource_id = resource_id,
                            resource_type = resource_type,
                            resource_name = resource_name,
                            error_message = error_message,
                            api_parameters = api_parameters,
                            x_real_ip = x_real_ip,
                            origin = origin
                        )
                    db.session.add(audit_trail_log)
        except Exception as e:
            log.info(e)

            audit_log = AuditTrailLog.query.filter_by(session_uuid = str(session_uuid)).first()
            if audit_log is not None:
                audit_log.organisation_id = organisation_id
                audit_log.organisation_name = organisation_name
                audit_log.provider_id = provider_id
                audit_log.provider_name = provider_name
                audit_log.project_id = project_id
                audit_log.project_name = project_name
                audit_log.action = action
                audit_log.status = status
                audit_log.action_url = current_path
                audit_log.action_method = request.method
                audit_log.ref_task_id = str(ref_task_id)
                audit_log.resource_id = resource_id
                audit_log.resource_type = resource_type
                audit_log.resource_name = resource_name
                audit_log.error_message = error_message

                db.session.merge(audit_log)

            else :
                audit_trail_log = AuditTrailLog(
                        user_id=user_id,
                        user_name=username,
                        organisation_id=organisation_id,
                        organisation_name=organisation_name,
                        provider_id=provider_id,
                        provider_name=provider_name,
                        project_id=project_id,
                        project_name=project_name,
                        action=action,
                        status=status,
                        action_url=current_path,
                        action_method=request.method,
                        ref_task_id = ref_task_id,
                        session_uuid = session_uuid,
                        resource_id = resource_id,
                        resource_type = resource_type,
                        resource_name = resource_name,
                        error_message = error_message,
                        api_parameters = api_parameters,
                        x_real_ip = x_real_ip,
                        origin = origin
                    )


        return True

    except Exception as e:
        log.info(e)

def create_user_action_trails(**newargs):
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):

            from flask import request, session
            from flask_login import current_user
            import logging
            from app.modules.audit_trails.models import AuditTrailLog
            from app.modules.projects.models import Project
            from app.modules.organisations.models import Organisation
            from app.modules.providers.models import Provider
            from app.modules.users.models import User
            from app.extensions import api, db
            import uuid
            from app.modules.auth.models import ApiStatus
            from sqlalchemy import or_
            log = logging.getLogger(__name__)

            flag = False

            log.info(kwargs)

            if 'provider' in kwargs or 'provider_id' in kwargs:

                if 'provider' in kwargs:
                    provider_id = kwargs['provider'].id
                else:
                    provider_id = kwargs['provider_id']

                log.info(provider_id)

                api_status = db.session.query(ApiStatus).filter(or_(ApiStatus.provider_id == provider_id, ApiStatus.provider_id == None)).first()

                if api_status is None or api_status.isActive:
                    flag = False

                elif api_status is not None and not api_status.isActive:
                    start_time = api_status.start_time
                    current_time = datetime.now() + timedelta(hours=5, minutes=30)
                    log.info(current_time)
                    interval = timedelta(minutes=api_status.setInterval)
                    if current_time >= start_time and current_time < (start_time + interval):
                        flag = True
                    else:
                        if current_time > (start_time + interval):
                            with db.session.begin():
                                db.session.delete(api_status)
                        flag = False

            message = ""
            action = ""
            status = ""
            project_id = None
            provider_id = None
            organisation_id = None
            ref_task_id = ""
            session['uuid'] = uuid.uuid4()
            session_uuid = session['uuid']
            resource_id = None
            resource_type = ""
            resource_name = ""
            error_message = ""
            if 'action' in newargs :
                if newargs['action'] == 'Perform action on Compute by ID':
                    action = f"{newargs['action']}: {kwargs['action']}"
                else:
                    action = newargs['action']
            if 'status' in newargs :
                status = newargs['status']
            if 'ref_task_id' in newargs :
                ref_task_id = newargs['ref_task_id']
            if 'project_id' in kwargs :
                project_id = kwargs['project_id']
            if 'provider_id' in kwargs :
                provider_id = kwargs['provider_id']
            if 'organisation_id' in kwargs :
                organisation_id = kwargs['organisation_id']
            if 'resource_id' in kwargs :
                resource_id = kwargs['resource_id']
            if 'resource_type' in kwargs :
                resource_type = kwargs['resource_type']
            if 'resource_name' in kwargs:
                resource_name = kwargs['resource_name']
            if  'error_message' in kwargs:
                error_message = kwargs['error_message']

            request_data = None
            mask_keys = ('admin_password', 'vm_password', 'vm_confirm_password', 'password', 'new_password', 'confirm_password', 'current_password', 'otp', 'username', 'vm_username', 'access_token', 'recaptcha_key', 'ssl_private_key', 'ssl_cert_key', 'ca_certificate')

            query_parameters = request.args.to_dict()
            form_data = request.form.to_dict()
            masked_form_data = {key: 'x'*len(form_data[key]) if key in mask_keys else form_data[key] for key in form_data}
            json_data = request.get_json()
            if any(var for var in (query_parameters, masked_form_data, json_data)):
                request_data = f'Received request with query parameters: {json.dumps(query_parameters)}, form data: {json.dumps(masked_form_data)}, and json data: {json.dumps(json_data)}'
                log.info(request_data)

            if not flag:
                create_user_action_log(action, status, ref_task_id, project_id, provider_id, organisation_id, session_uuid, resource_id, resource_type, resource_name, error_message, api_parameters=request_data)
                ret = f(*args, **kwargs)
                return ret

            else:
                status = 'Fail'
                error_message = 'Services are under scheduled maintenance'
                create_user_action_log(action, status, ref_task_id, project_id, provider_id, organisation_id, session_uuid, resource_id, resource_type, resource_name, error_message, api_parameters=request_data)

                start_time_str = api_status.start_time.strftime('%d-%m-%Y %H:%M:%S')
                end_time = start_time + timedelta(minutes=api_status.setInterval)
                end_time_str = end_time.strftime('%d-%m-%Y %H:%M:%S')
                return abort(
                    code = HTTPStatus.SERVICE_UNAVAILABLE,
                    message = f'Services are under scheduled maintenance for the period from {start_time_str} to {end_time_str}. Service will be available after {end_time_str}. Sorry for the inconvenience!!!'
                )

        return wrapped
    return decorator


def update_status_action_log(status=None, ref_task_id=None, error_message=None):
    import logging
    from app.modules.audit_trails.models import AuditTrailLog
    from app.extensions import api, db
    log = logging.getLogger(__name__)

    try:

        with db.session.begin():
            audit_log = AuditTrailLog.query.filter_by(ref_task_id = str(ref_task_id)).first()
            if audit_log is not None:
                audit_log.status = status
                if error_message is not None:
                    audit_log.error_message = error_message
                db.session.merge(audit_log)
    except Exception as e:
        log.info(e)
        audit_log = AuditTrailLog.query.filter_by(ref_task_id = str(ref_task_id)).first()
        if audit_log is not None:
            audit_log.status = status
            if error_message is not None:
                audit_log.error_message = error_message
            db.session.merge(audit_log)

def project_compute_quota(prev_topup, quotapackage_details, provider_id):
    import types
    from app.modules.compute.models import Flavors, ResourceImageFlavorMapping
    from app.modules.providers.models import ServiceProvider, ServiceType
    compute_quota_args = {}
    topup_key_list = list(prev_topup.keys())
    DEFAULT_CONTROLLER_COUNT = 3

    gateway_resource_mapping = ResourceImageFlavorMapping.query.filter_by(provider_id=provider_id,resource_type='gateway').one_or_none()
    if gateway_resource_mapping is None:
        gateway_flavor = Flavors.query.filter_by(provider_id=provider_id, is_active=True).filter(Flavors.name.ilike("gateway-flavor")).first()
    else:
        gateway_flavor = Flavors.query.get(gateway_resource_mapping.flavor_id)

    lb_resource_mapping = ResourceImageFlavorMapping.query.filter_by(resource_type='lb', provider_id=provider_id).first()
    if lb_resource_mapping is None:
        lb_flavor = Flavors.query.filter_by(provider_id=provider_id, is_active=True).filter(Flavors.name.ilike("gateway-flavor")).first()
    else:
        lb_flavor = Flavors.query.get(lb_resource_mapping.flavor_id)

    nks_enabled = ServiceProvider.query.join(ServiceType).filter(ServiceType.name.ilike('nks'), ServiceProvider.provider_id==provider_id, ServiceProvider.is_active==True, ServiceProvider.is_public==True).first()
    if nks_enabled:
        nks_controller_resource_mapping = ResourceImageFlavorMapping.query.filter_by(resource_type='nks-controller', provider_id=provider_id).first()
        if nks_controller_resource_mapping is None:
            nks_controller_flavor = Flavors.query.filter_by(provider_id=provider_id, is_active=True).filter(Flavors.name.ilike("gateway-flavor")).first()
        else:
            nks_controller_flavor = Flavors.query.get(nks_controller_resource_mapping.flavor_id)
        allocated_nks_cluster = quotapackage_details.nks_cluster
    else:
        nks_controller_flavor = types.SimpleNamespace()
        allocated_nks_cluster = 0
        nks_controller_flavor.vcpus = 0
        nks_controller_flavor.ram = 0

    if any(item in topup_key_list for item in ['vm','vcpu','ram','key_pair']) :
        vm_key = False
        vcpu_key = False
        ram_key = False
        key_pair_key = False
        for key in prev_topup :
            if key == 'vm' or key == 'project' or key == 'load_balancer' or key == 'scaling_group' :
                vm_key = True
                compute_quota_args['instances'] = prev_topup[key] + quotapackage_details.vm + quotapackage_details.project + quotapackage_details.load_balancer + quotapackage_details.scaling_group + DEFAULT_CONTROLLER_COUNT*allocated_nks_cluster
            elif vm_key == False:
                compute_quota_args['instances'] = quotapackage_details.vm + quotapackage_details.project + quotapackage_details.load_balancer + quotapackage_details.scaling_group + DEFAULT_CONTROLLER_COUNT*allocated_nks_cluster
            if key == 'vcpu' :
                vcpu_key = True
                compute_quota_args['cores'] = prev_topup[key] + quotapackage_details.vcpu + (quotapackage_details.project * int(gateway_flavor.vcpus)) + (quotapackage_details.load_balancer * int(lb_flavor.vcpus)) + (quotapackage_details.scaling_group * int(lb_flavor.vcpus)) + DEFAULT_CONTROLLER_COUNT*(allocated_nks_cluster * int(nks_controller_flavor.vcpus))
            elif vcpu_key == False:
                compute_quota_args['cores'] = quotapackage_details.vcpu + (quotapackage_details.project * int(gateway_flavor.vcpus)) + (quotapackage_details.load_balancer * int(lb_flavor.vcpus)) + (quotapackage_details.scaling_group * int(lb_flavor.vcpus)) + DEFAULT_CONTROLLER_COUNT*(allocated_nks_cluster * int(nks_controller_flavor.vcpus))
            if key == 'ram' :
                ram_key = True
                compute_quota_args['ram'] = prev_topup[key] + quotapackage_details.ram + (quotapackage_details.project * int(gateway_flavor.ram) / 1024) + (quotapackage_details.load_balancer * int(lb_flavor.ram) / 1024) + (quotapackage_details.scaling_group * int(lb_flavor.ram) / 1024) + DEFAULT_CONTROLLER_COUNT*(allocated_nks_cluster * int(nks_controller_flavor.ram) / 1024)
            elif ram_key == False:
                compute_quota_args['ram'] = quotapackage_details.ram + (quotapackage_details.project * int(gateway_flavor.ram) / 1024) + (quotapackage_details.load_balancer * int(lb_flavor.ram) / 1024) + (quotapackage_details.scaling_group * int(lb_flavor.ram) / 1024) + DEFAULT_CONTROLLER_COUNT*(allocated_nks_cluster * int(nks_controller_flavor.ram) / 1024)
            if key == 'key_pair' :
                key_pair_key = True
                compute_quota_args['key_pairs'] = prev_topup[key] + quotapackage_details.key_pair
            elif key_pair_key == False:
                compute_quota_args['key_pairs'] = quotapackage_details.key_pair
    else :
        compute_quota_args = {
            'instances': quotapackage_details.vm + quotapackage_details.project + quotapackage_details.load_balancer + quotapackage_details.scaling_group + DEFAULT_CONTROLLER_COUNT*allocated_nks_cluster,
            'cores': quotapackage_details.vcpu + (quotapackage_details.project * int(gateway_flavor.vcpus)) + (quotapackage_details.load_balancer * int(lb_flavor.vcpus)) + (quotapackage_details.scaling_group * int(lb_flavor.vcpus)) + DEFAULT_CONTROLLER_COUNT*(allocated_nks_cluster * int(nks_controller_flavor.vcpus)),
            'ram': quotapackage_details.ram + (quotapackage_details.project * int(gateway_flavor.ram) / 1024) + (quotapackage_details.load_balancer * int(lb_flavor.ram) / 1024) + (quotapackage_details.scaling_group * int(lb_flavor.ram) / 1024) + DEFAULT_CONTROLLER_COUNT*(allocated_nks_cluster * int(nks_controller_flavor.ram) / 1024),
            'key_pairs': quotapackage_details.key_pair
        }

    return compute_quota_args

def project_volume_quota(prev_topup, quotapackage_details, provider_id):
    import types
    from app.modules.compute.models import Flavors, ResourceImageFlavorMapping
    from app.modules.providers.models import ServiceProvider, ServiceType
    volume_quota_args = {}
    topup_key_list = list(prev_topup.keys())
    DEFAULT_CONTROLLER_COUNT = 3

    gateway_resource_mapping = ResourceImageFlavorMapping.query.filter_by(provider_id=provider_id,resource_type='gateway').one_or_none()
    if gateway_resource_mapping is None:
        gateway_flavor = Flavors.query.filter_by(provider_id=provider_id, is_active=True).filter(Flavors.name.ilike("gateway-flavor")).first()
    else:
        gateway_flavor = Flavors.query.get(gateway_resource_mapping.flavor_id)

    lb_resource_mapping = ResourceImageFlavorMapping.query.filter_by(resource_type='lb', provider_id=provider_id).first()
    if lb_resource_mapping is None:
        lb_flavor = Flavors.query.filter_by(provider_id=provider_id, is_active=True).filter(Flavors.name.ilike("gateway-flavor")).first()
    else:
        lb_flavor = Flavors.query.get(lb_resource_mapping.flavor_id)

    nks_enabled = ServiceProvider.query.join(ServiceType).filter(ServiceType.name.ilike('nks'), ServiceProvider.provider_id==provider_id, ServiceProvider.is_active==True, ServiceProvider.is_public==True).first()
    if nks_enabled:
        nks_controller_resource_mapping = ResourceImageFlavorMapping.query.filter_by(resource_type='nks-controller', provider_id=provider_id).first()
        if nks_controller_resource_mapping is None:
            nks_controller_flavor = Flavors.query.filter_by(provider_id=provider_id, is_active=True).filter(Flavors.name.ilike("gateway-flavor")).first()
        else:
            nks_controller_flavor = Flavors.query.get(nks_controller_resource_mapping.flavor_id)
        allocated_nks_cluster = quotapackage_details.nks_cluster
    else:
        allocated_nks_cluster = 0
        nks_controller_flavor = types.SimpleNamespace()
        nks_controller_flavor.disk = 0

    if any(item in topup_key_list for item in ['storage','volume_snapshot']) :
        storage_key = False
        volume_snapshot_key = False
        for key in prev_topup :
            if key == 'storage' :
                storage_key = True
                volume_quota_args['volumes'] = prev_topup[key] + quotapackage_details.storage + (quotapackage_details.project * int(gateway_flavor.disk)) + (quotapackage_details.load_balancer * int(lb_flavor.disk)) + (quotapackage_details.scaling_group * int(lb_flavor.disk)) + DEFAULT_CONTROLLER_COUNT*(allocated_nks_cluster * int(nks_controller_flavor.disk))
                volume_quota_args['gigabytes'] = prev_topup[key] + quotapackage_details.storage + (quotapackage_details.project * int(gateway_flavor.disk)) + (quotapackage_details.load_balancer * int(lb_flavor.disk)) + (quotapackage_details.scaling_group * int(lb_flavor.disk)) + DEFAULT_CONTROLLER_COUNT*(allocated_nks_cluster * int(nks_controller_flavor.disk))
            elif storage_key == False:
                volume_quota_args['volumes'] = quotapackage_details.storage + (quotapackage_details.project * int(gateway_flavor.disk)) + (quotapackage_details.load_balancer * int(lb_flavor.disk)) + (quotapackage_details.scaling_group * int(lb_flavor.disk)) + DEFAULT_CONTROLLER_COUNT*(allocated_nks_cluster * int(nks_controller_flavor.disk))
                volume_quota_args['gigabytes'] = quotapackage_details.storage + (quotapackage_details.project * int(gateway_flavor.disk)) + (quotapackage_details.load_balancer * int(lb_flavor.disk)) + (quotapackage_details.scaling_group * int(lb_flavor.disk)) + DEFAULT_CONTROLLER_COUNT*(allocated_nks_cluster * int(nks_controller_flavor.disk))
            if key == 'volume_snapshot' :
                volume_snapshot_key = True
                volume_quota_args['snapshots'] = prev_topup[key] + quotapackage_details.volume_snapshot
            elif volume_snapshot_key == False:
                volume_quota_args['snapshots'] = quotapackage_details.volume_snapshot
    else :
        volume_quota_args = {
                'volumes': quotapackage_details.storage + (quotapackage_details.project * int(gateway_flavor.disk)) + (quotapackage_details.load_balancer * int(lb_flavor.disk)) + (quotapackage_details.scaling_group * int(lb_flavor.disk)) + DEFAULT_CONTROLLER_COUNT*(allocated_nks_cluster * int(nks_controller_flavor.disk)),
                'snapshots': quotapackage_details.volume_snapshot,
                'gigabytes': quotapackage_details.storage + (quotapackage_details.project * int(gateway_flavor.disk)) + (quotapackage_details.load_balancer * int(lb_flavor.disk)) + (quotapackage_details.scaling_group * int(lb_flavor.disk)) + DEFAULT_CONTROLLER_COUNT*(allocated_nks_cluster * int(nks_controller_flavor.disk))
        }

    return volume_quota_args

def project_network_quota(prev_topup, quotapackage_details, provider_id):
    network_quota_args = {}
    topup_key_list = list(prev_topup.keys())

    if any(item in topup_key_list for item in ['network','subnet','port','router','floating_ip','security_group','security_group_rule']) :
        network_key = False
        subnet_key = False
        port_key = False
        router_key = False
        floating_ip_key = False
        security_group_key = False
        security_group_rule_key = False
        for key in prev_topup :
            if key == 'network' :
                network_key = True
                network_quota_args['network'] = prev_topup[key] + quotapackage_details.network
            elif network_key == False:
                network_quota_args['network'] = quotapackage_details.network
            if key == 'subnet' :
                subnet_key = True
                network_quota_args['subnet'] = prev_topup[key] + quotapackage_details.subnet
            elif subnet_key == False:
                network_quota_args['subnet'] = quotapackage_details.subnet
            if key == 'port' :
                port_key = True
                network_quota_args['port'] = prev_topup[key] + quotapackage_details.port
            elif port_key == False:
                network_quota_args['port'] = quotapackage_details.port
            if key == 'router' :
                router_key = True
                network_quota_args['router'] = prev_topup[key] + quotapackage_details.router
            elif router_key == False:
                network_quota_args['router'] = quotapackage_details.router
            if key == 'floating_ip' :
                floating_ip_key = True
                network_quota_args['floatingip'] = prev_topup[key] + quotapackage_details.floating_ip
            elif floating_ip_key == False:
                network_quota_args['floatingip'] = quotapackage_details.floating_ip
            if key == 'security_group' :
                security_group_key = True
                network_quota_args['security_group'] = prev_topup[key] + quotapackage_details.security_group
            elif security_group_key == False:
                network_quota_args['security_group'] = quotapackage_details.security_group
            if key == 'security_group_rule' :
                security_group_rule_key = True
                network_quota_args['security_group_rule'] = prev_topup[key] + quotapackage_details.security_group_rule
            elif security_group_rule_key == False:
                network_quota_args['security_group_rule'] = quotapackage_details.security_group_rule
    else :
        network_quota_args = {
                'floatingip': quotapackage_details.floating_ip,
                'network': quotapackage_details.network,
                'subnet': quotapackage_details.subnet,
                'port': quotapackage_details.port,
                'router': quotapackage_details.router,
                'security_group': quotapackage_details.security_group,
                'security_group_rule': quotapackage_details.security_group_rule
        }

    return network_quota_args


from sqlalchemy.ext.declarative import DeclarativeMeta
class AlchemyEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o.__class__, DeclarativeMeta):
            data = {}
            fields = o.__json__() if hasattr(o, '__json__') else dir(o)
            for field in [f for f in fields if not f.startswith('_') and f not in ['metadata', 'query', 'query_class']]:
                value = o.__getattribute__(field)
                try:
                    json.dumps(value)
                    data[field] = value
                except TypeError:
                    data[field] = None
            return data
        return json.JSONEncoder.default(self, o)

def to_provider(json_data):
    from app.modules.providers.models import Provider
    p = Provider()
    p.__dict__.update(json_data)
    return p

def check_available_resources(resource_type):
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            from flask import request
            import json
            from flask_restplus_patched._http import HTTPStatus
            from app.modules.compute.models import Flavors
            from app.modules.volumes.models import Volume
            from app.modules.projects.models import Project
            from app.modules.resource_action_logs.models import ResourceActionLog, ProviderResourceActionLog
            from app.modules.volumes.models import VolumeAttach
            from app.modules.providers.models import Provider

            if resource_type != 'project':
                if 'project_code' in request.form:
                    project = Project.query.filter_by(project_id=request.form.get('project_code')).first()
                elif 'project' in kwargs:
                    project_id = kwargs['project'].id
                    project = Project.query.get(project_id)
                else:
                    project_id = kwargs['project_id']
                    project = Project.query.get(project_id)

                if project is not None:
                    organisation_id = project.organisation_id
            else:
                organisation_id = kwargs['organisation'].id

            if 'provider_code' in request.form:
                provider = Provider.query.filter_by(provider_id=request.form.get('provider_code')).first()
            else:
                provider = kwargs['provider']

            allocated_resources = get_allocated_quota_detail(organisation_id, provider.id)

            last_cron_data = ProviderResourceActionLog.query.filter_by(provider=provider).filter_by(organisation_id=organisation_id).order_by("action_log_date desc").first()

            if last_cron_data is None:
                resource_action_logs = ResourceActionLog.query.filter_by(organisation_id=organisation_id, provider_id=provider.id).all()
                consumed_resources = calculate_resource_action_log_consumption(resource_action_logs)

            else:
                cron_data_till = datetime.combine(last_cron_data.action_log_date, datetime.max.time())
                current_resource_action_logs = ResourceActionLog.query.filter_by(organisation_id=organisation_id, provider_id=provider.id).filter(ResourceActionLog.created > cron_data_till).all()
                current_utilization = calculate_resource_action_log_consumption(current_resource_action_logs)
                consumed_resources = combine_cron_current_utlization(cron_utilization=last_cron_data.action_log[0]['resource_action_log'], current_utilization=current_utilization)

            available_resources = calculate_available_resources_from_allocated(allocated_resources, consumed_resources)
            resource_data = prepare_resource_utilization_dict(allocated_resources, consumed_resources, available_resources)

            resource_set = {
                "compute": ['ram', 'vcpu', 'storage', 'vm'],
                "scalinggroup": ['ram', 'vcpu', 'storage', 'vm', 'scalinggroup', 'loadbalancer'],
                "network": ['network', 'subnet'],
                "vmsnapshot": ['vmsnapshot', 'volumesnapshot', 'storage'],
                "volumesnapshot": ['volumesnapshot', 'storage'],
                "object_storage": ['objectstorage','buckets'],
            }

            log.info(resource_data)
            worker_flag = False

            if resource_type in resource_set:
                resource_check_list = resource_set[resource_type]

            if resource_type in ['compute', 'scalinggroup']:
                if resource_type == 'scalinggroup':
                    cluster_size = int(args[1]['cluster_size'])
                else:
                    cluster_size = 1
                flavor_id = args[1]['flavor_id']
                flavors = Flavors.query.get(flavor_id)
                if flavors is None:
                    abort(
                        code=HTTPStatus.NOT_FOUND,
                        message="Flavor with id %d does not exist" % flavor_id
                    )

                for resource in resource_check_list:
                    available = resource_data[resource]['available']['value']

                    flag = False
                    if resource == 'ram' and (int(flavors.ram)/1024)*cluster_size > int(available):
                        abort(
                            code=HTTPStatus.UNPROCESSABLE_ENTITY,
                            message="Quota exceeded for ram"
                        )
                    elif resource == 'vcpu' and int(flavors.vcpus)*cluster_size > int(available):
                        abort(
                            code=HTTPStatus.UNPROCESSABLE_ENTITY,
                            message="Quota exceeded for vcpus"
                        )
                    elif resource == 'storage' and int(flavors.disk)*cluster_size > int(available):
                        abort(
                            code=HTTPStatus.UNPROCESSABLE_ENTITY,
                            message="Quota exceeded for Storage"
                        )
                    elif resource == 'vm' and int(available) <= 0:
                        abort(
                            code=HTTPStatus.UNPROCESSABLE_ENTITY,
                            message="Quota exceeded for vm"
                        )
                    elif resource_type == 'scalinggroup' and resource == 'scalinggroup' and int(available) <= 0:
                        abort(
                            code=HTTPStatus.UNPROCESSABLE_ENTITY,
                            message="Quota exceeded for scalinggroup"
                        )
                    elif resource_type == 'scalinggroup' and resource == 'loadbalancer' and int(available) <= 0:
                        abort(
                            code=HTTPStatus.UNPROCESSABLE_ENTITY,
                            message="Quota exceeded for loadbalancer"
                        )
                    else:
                        flag = True

                if flag:
                    return f(*args, **kwargs)

            elif resource_type == 'cluster_with_nodes':
                available_cluster_quota = resource_data['nkscluster']['available']['value']
                if int(available_cluster_quota) <= 0:
                    abort(
                        code=HTTPStatus.UNPROCESSABLE_ENTITY,
                        message="Quota exceeded for nkscluster"
                    )
                worker_flag = True

            elif resource_type == 'nksworker':
                worker_flag = True

            elif resource_type == 'network':
                for resource in resource_check_list:
                    available = resource_data[resource]['available']['value']
                    if int(available) <= 0:
                        abort(
                            code=HTTPStatus.UNPROCESSABLE_ENTITY,
                            message=f"Quota exceeded for {resource_type}"
                        )
                return f(*args, **kwargs)

            elif resource_type in ['object_storage']:
                for recource in resource_check_list:
                    available = resource_data[recource]['available']['value']
                    if int(available) <= 0:
                        abort(
                            code=HTTPStatus.UNPROCESSABLE_ENTITY,
                            message=f"Quota exceeded for {resource_type}"
                        )

                return f(*args, **kwargs)


            elif resource_type == 'vmsnapshot':
                compute_id = kwargs['compute'].id
                attached_volumes = VolumeAttach.query.filter_by(compute_id=compute_id)
                snapshots_size = 0
                for attached_vol in attached_volumes:
                    volume_info = Volume.query.get(attached_vol.volume_id)
                    snapshots_size += int(volume_info.volume_size)

                for resource in resource_check_list:
                    available = resource_data[resource]['available']['value']
                    if resource == 'storage' and snapshots_size > int(available):
                        abort(
                            code=HTTPStatus.UNPROCESSABLE_ENTITY,
                            message="Quota exceeded for storage"
                        )
                    elif resource == 'vmsnapshot' and int(available) <= 0:
                        abort(
                            code=HTTPStatus.UNPROCESSABLE_ENTITY,
                            message="Quota exceeded for vmsnapshot"
                        )
                    elif resource == 'volumesnapshot' and int(available) <= 0:
                        abort(
                            code=HTTPStatus.UNPROCESSABLE_ENTITY,
                            message="Quota exceeded for volumesnapshot"
                        )
                return f(*args, **kwargs)

            elif resource_type == 'volumesnapshot':
                volume = Volume.query.get(kwargs['volume_id'])
                if volume is None:
                    abort(
                        code=HTTPStatus.NOT_FOUND,
                        message="Volume with id %d does not exist" % kwargs['volume_id']
                    )
                for resource in resource_check_list:
                    available = resource_data[resource]['available']['value']
                    if resource == 'storage' and int(volume.volume_size) > int(available):
                        abort(
                            code=HTTPStatus.UNPROCESSABLE_ENTITY,
                            message="Quota exceeded for storage"
                        )
                    elif resource == 'volumesnapshot' and int(available) <= 0:
                        abort(
                            code=HTTPStatus.UNPROCESSABLE_ENTITY,
                            message="Quota exceeded for volumesnapshot"
                        )
                return f(*args, **kwargs)

            elif resource_type in ('storage', 'securitygroup', 'securitygrouprule', 'floatingip', 'publicip', 'loadbalancer',
            'nasstorage', 'project'):
                available = resource_data[resource_type]['available']['value']
                if resource_type == 'storage' and int(args[1]['volume_size']) > int(available):
                    abort(
                        code=HTTPStatus.UNPROCESSABLE_ENTITY,
                        message="Quota exceeded for storage"
                    )
                elif resource_type == 'nasstorage' and int(args[1]['volume_size']) > int(available):
                    abort(
                        code=HTTPStatus.UNPROCESSABLE_ENTITY,
                        message="Quota exceeded for nas storage"
                    )
                elif int(available) <= 0:
                    abort(
                        code=HTTPStatus.UNPROCESSABLE_ENTITY,
                        message=f"Quota exceeded for {resource_type}"
                    )
                return f(*args, **kwargs)

            else:
                return f(*args, **kwargs)

            if worker_flag:
                worker_count = request.form.get('worker_count')
                worker_flavor_json = request.form.get('worker_flavor')
                worker_flavor_dict = json.loads(worker_flavor_json)
                if 'id' in worker_flavor_dict:
                    worker_flavor = Flavors.query.filter_by(id=worker_flavor_dict['id'], is_active=True).first()
                else:
                    worker_flavor = Flavors.query.filter_by(provider_id=provider.id, name=worker_flavor_dict['name'], vcpus=worker_flavor_dict['vcpus'], ram=worker_flavor_dict['ram'], disk=worker_flavor_dict['disk'], is_active=True).first()
                if worker_flavor is None:
                    abort(
                        code=HTTPStatus.UNPROCESSABLE_ENTITY,
                        message='Worker flavor does not exists'
                    )
                for resource in resource_set['compute']:
                    available = resource_data[resource]['available']['value']

                    flag = False
                    if resource == 'ram' and (int(worker_flavor.ram)/1024)*int(worker_count) > int(available):
                        abort(
                            code=HTTPStatus.UNPROCESSABLE_ENTITY,
                            message="Quota exceeded for ram"
                        )
                    elif resource == 'vcpu' and int(worker_flavor.vcpus)*int(worker_count) > int(available):
                        abort(
                            code=HTTPStatus.UNPROCESSABLE_ENTITY,
                            message="Quota exceeded for vcpus"
                        )
                    elif resource == 'storage' and int(worker_flavor.disk)*int(worker_count) > int(available):
                        abort(
                            code=HTTPStatus.UNPROCESSABLE_ENTITY,
                            message="Quota exceeded for Storage"
                        )
                    elif resource == 'vm' and int(worker_count) > int(available):
                        abort(
                            code=HTTPStatus.UNPROCESSABLE_ENTITY,
                            message="Quota exceeded for vm"
                        )
                    else:
                        flag = True
                if flag:
                    return f(*args, **kwargs)

        return wrapped
    return decorator

"""
This decorator allow only defined characters. 
"""
def verify_parameters():
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            from flask import request
            from flask_restplus_patched._http import HTTPStatus
            import re

            exclude_params =[
                'password',
                'confirm_password',
                'vm_password',
                'vm_confirm_password',
                'confirm'
                'request_url',
                'url',
                'auth_url',
                'health_check',
                'remote_ip_prefix',
                'docker_registry',
                'description',
                'project_description',
                'provider_location',
                'loadbalancingmode',
                'keytext',
                'certtext',
                'ssl_private_key',
                'server_farm_info',
                'lb_url_redirection_info',
                'provider_name',
                'ssl_cert_key',
                'backend_list',
                'backends',
                'template',
                'template_url',
                'parameters',
                'username',
                'sslPvtKey',
                'sslCert',
                'caCert',
                'domain'
            ]

            match_character = "^[A-Za-z0-9_/, .:@-]*$"
            for key in request.values:

                if key not in exclude_params:
                    val = (request.values[key])
                    if re.match(match_character, val):
                        if 'name' in key and val is not None and val != '':
                            regex = re.compile("[@_!#$%^&*()<>?/\|}{~:]")
                            if len(val) < 3:
                                return abort(code=HTTPStatus.BAD_REQUEST,
                                             message=key + " has to be at least 3 characters long.")
                            if len(val) > 40:
                                return abort(code=HTTPStatus.BAD_REQUEST,
                                             message=key + " is too long.")
                            if regex.search(val) is not None:
                                return abort(code=HTTPStatus.BAD_REQUEST,
                                             message=key + " should not contain any special character.")
                            if ' ' in val:
                                return abort(code=HTTPStatus.BAD_REQUEST,
                                             message=key + " should not contain space")
                        pass
                    else:
                        log.info(key)
                        return abort(code=HTTPStatus.BAD_REQUEST,
                                     message="Bad input")
            ret = f(*args, **kwargs)
            return ret
        return wrapped
    return decorator


class RateConfig(object):
    high = '1000/s'
    medium = '100/s'
    low = '10/s'
    very_low = '1/m'

class StaticValue(object):
    token_expiry_time = 1800 #43200


def send_vpn_fw_permission_email(cloud_ref_no, provider_id,destination_ip, destination_port):
    # if is_lb_or_scaling:
    #     destination_port = '80,443'
    # else:
    #     destination_port = '20,21,22,80,443,3389,8443'
    remote_url_for_vpn = 'https://cloud.yntraa.com/admin/get_vpn_fw_permission_for_ips.php?reference_number='+cloud_ref_no+'&destination_ip='+destination_ip+'&destination_port='+destination_port+'&datacenter_name='+provider_id+'&username=&token='
    log.info("remote_url_for_vpn %s", remote_url_for_vpn)
    message_status = requests.get(remote_url_for_vpn, verify=False).text
    log.info("message_status %s",message_status)
    return message_status

def delete_vpn_fw_permission_email(cloud_ref_no, provider_id,destination_ip, destination_port):
    remote_url_for_vpn = 'https://cloud.yntraa.com/admin/revoke_vpn_fw_permission_for_ips.php?reference_number='+cloud_ref_no+'&destination_ip='+destination_ip+'&destination_port='+destination_port+'&datacenter_name='+provider_id+'&username=&token='
    log.info("remote_url_for_vpn %s", remote_url_for_vpn)
    message_status = requests.get(remote_url_for_vpn, verify=False).text
    log.info("message_status %s",message_status)
    return message_status


def send_publicIPrequest_data(backup_info=None, **kwargs):
    token = "NsTWawUESnpy9v32yfbOPJW8oKugaM"
    if kwargs['action'] == 'create':
        payloads = {
            'api_pip_request_id': kwargs['api_pip_request_id'],
            'reference_number': kwargs['reference_number'],
            'org_code': kwargs['org_code'],
            'application_url':kwargs['application_url'],
            'traffic_flow': kwargs['traffic_flow'],
            'protocol': kwargs['protocol'],
            'public_ip_mapping_for': kwargs['public_ip_mapping_for'],
            'private_ip': kwargs['private_ip'],
            'pip_project_id': kwargs['pip_project_id'],
            'creation_date': kwargs['creation_date'],
            'action': 'create',
            **backup_info
        }
    elif kwargs['action'] == 'withdraw':
        payloads = {
            'api_pip_request_id': kwargs['api_pip_request_id'],
            'public_ip': kwargs['public_ip'],
            'creation_date': kwargs['creation_date'],
            'action': 'withdraw',
            'remarks': kwargs['remarks']
        }
    headers = {'Content-Type': 'application/xml', 'Authorization': 'Bearer '+str(token)}
    log.info(headers)
    remote_url = "http://cloud.yntraa.com/admin/api_add_publicip_request_detail_v2.php"
    message_status = requests.post(remote_url, data=payloads, headers=headers, verify=False)
    log.info(message_status.text)
    return message_status

def send_publicIP_change_request_data(backup_info=None, **kwargs):
    token = "NsTWawUESnpy9v32yfbOPJW8oKugaM"
    payloads = {
        'api_publicip_request_id': kwargs['api_publicip_request_id'],
        'request_id': kwargs['request_id'],
        'reference_number': kwargs['reference_number'],
        'org_code': kwargs['org_code'],
        'application_url':kwargs['application_url'],
        'traffic_flow': kwargs['traffic_flow'],
        'protocol': kwargs['protocol'],
        'public_ip_mapping_for': kwargs['public_ip_mapping_for'],
        'private_ip':kwargs['private_ip'],
        'pip_project_id':kwargs['pip_project_id'],
        'creation_date': kwargs['creation_date'],
        'action': kwargs['action'],
        **backup_info
    }
    headers = {'Content-Type': 'application/xml', 'Authorization': 'Bearer '+str(token)}
    log.info(headers)
    remote_url = "http://cloud.yntraa.com//admin/api_add_publicip_change_request.php"
    message_status = requests.post(remote_url, data=payloads, headers=headers, verify=False)
    log.info(message_status.text)
    return message_status

def send_cancelled_PIP_change_details(**kwargs):
    token = "NsTWawUESnpy9v32yfbOPJW8oKugaM"
    payloads = {
        'api_publicip_request_id': kwargs['api_publicip_request_id'],
        'request_id': kwargs['request_id'],
        'org_code': kwargs['org_code'],
        'update_date': kwargs['update_date'],
        'updated_by': kwargs['updated_by'],
        'status': 'cancelled',
        'reject_reason': '',
        'action': 'update',
    }
    headers = {'Content-Type': 'application/xml', 'Authorization': 'Bearer '+str(token)}
    remote_url = "http://cloud.yntraa.com//admin/api_add_publicip_change_request.php"
    message_status = requests.get(remote_url, params=payloads, headers=headers, verify=False)
    log.info(message_status)
    return message_status

def send_org_onboard_details(**kwargs):
    today = date.today()
    token_data = 'OPENSTACK_PERMISSION_'+str(today)
    token_data = token_data.encode('utf-8')
    token = hashlib.md5(token_data).hexdigest()
    remote_url = "http://cloud.yntraa.com/admin/api_add_openstack_org_detail.php"
    payloads = {
        'reference_number':kwargs['reference_number'],
        'org_code':kwargs['org_code'],
        'datacenter_name':kwargs['datacenter_name'],
        'creation_date':kwargs['creation_date'],
        'stack': 'Openstack'
    }
    headers = {'Content-Type': 'application/xml', 'Authorization': 'Bearer '+str(token)}
    log.info(payloads)
    message_status = requests.get(remote_url, params=payloads, headers=headers, verify=False)

    return message_status

def send_allocated_PIP_details(**kwargs):
    # today = date.today()
    # token_data = 'PIP_PERMISSION_' + str(today)
    # token_data = token_data.encode('utf-8')
    # token = hashlib.md5(token_data).hexdigest()
    token = "NsTWawUESnpy9v32yfbOPJW8oKugaM"
    remote_url = "http://cloud.yntraa.com/admin/api_add_publicip_request_detail.php"
    params = {
        'reference_number':kwargs['reference_number'],
        'org_code':kwargs['org_code'],
        'api_pip_request_id': kwargs['publicip_request_id'],
        'public_ip': kwargs['public_ip'],
        'update_date':kwargs['update_date'],
        'updated_by': kwargs['updated_by'],
        'status': kwargs['status'],
        'action': 'update',
        #'token': token
    }
    headers = {'Content-Type': 'application/xml', 'Authorization': 'Bearer '+str(token)}
    log.info(headers)
    message_status = requests.get(remote_url, params=params, headers=headers, verify=False)
    return message_status

def send_sms(mobile_numbers, message, **kwargs):
    from app.modules.users import tasks
    try:
        log.info("inside send sms")
        message = message.replace("%","~~~~~");
        message = message.replace("#","%23");
        message = message.replace("&","%26");
        message = message.replace("$","%24");
        message = message.replace("~~~~~","%25");

        sms_userid = os.getenv('SMS_SERVICE_USERID', 'cloudyntraa.otp')
        sms_userpin = os.getenv('SMS_SERVICE_USERPIN')
        sms_ssid = os.getenv('SMS_SERVICE_SSID', 'YntraaCCS')
        sms_url = os.getenv('SMS_SERVICE_URL', 'https://smsgw.sms.yntraa.com/failsafe/HttpLink?')

        data = {'username':sms_userid,
                'pin':sms_userpin,
                'mnumber':mobile_numbers,
                'message':message,
                'signature':sms_ssid,
                'dlt_entity_id':'110100001364',
                'dlt_template_id': kwargs['template_id'] if 'template_id' in kwargs else '1107160880099196287'
                }
        data = urllib.parse.urlencode(data)

        # log.info("SMS Data %s",data)
        # ctx = ssl.create_default_context()
        # ctx.check_hostname = False
        # ctx.verify_mode = ssl.CERT_NONE
        url = sms_url+data
        # requests.packages.urllib3.disable_warnings(InsecureRequestWarning)
        message_status = tasks.send_otp_sms.delay(url)
        log.info(message_status)
        return message_status
        # message_status = requests.get(url, verify=False).text
        #
        # message_delivery_status = False
        # if ('Accepted' in message_status):
        #     message_delivery_status = True
        # return message_delivery_status
    except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )


def user_action_log(message, status):
    from flask import request
    from flask_login import current_user
    import logging
    #from app.modules.audit_trails.models import AuditTrail
    from app.extensions import api, db

    log = logging.getLogger(__name__)

    current_path = request.path
    #action = request.method + "_" + str(current_path)
    ip_address = request.headers.get('X-Real-Ip')
    request_url = request.headers.get('Referer')
    user_id = current_user.id
    # with db.session.begin():
    #     audit_trails = AuditTrail(ip_address=ip_address, user_id=user_id, request_url=request_url,
    #                               action_type=status, message=message, user_name=current_user.username)
    #     db.session.add(audit_trails)


def sync_resource_allocation_data(resource_type):
    from app.extensions import api, db
    from app.modules.resource_action_logs.models import ResourceActionLog
    from app.modules.compute.models import Compute, Images, Flavors
    from app.modules.volumes.models import Volume
    log = logging.getLogger(__name__)

    with db.session.begin():
        created_resource = ResourceActionLog.query.filter_by(resource_type=resource_type, action='created').all()
        deleted_resource = ResourceActionLog.query.filter_by(resource_type=resource_type, action='deleted').all()
        if resource_type == 'vm':
            computeList = Compute.query.all()
            for compute in computeList:
                resource_log = ResourceActionLog.query.filter_by(resource_type='vm', action='created',
                                                                 resource_record_id=compute.id).first()
                if resource_log is None:
                    flavors = Flavors.query.get(compute.flavor_id)
                    images = Images.query.get(compute.image_id)
                    create_resource_action_log(db,
                                               resource_type='vm',
                                               resource_record_id=compute.id,
                                               action='created',
                                               resource_configuration='VM Created with Resources : { "vcpu":' + flavors.vcpus + ' , "ram":' + str(
                                                   int(
                                                       flavors.ram) / 1024) + ' , "storage":' + flavors.disk + ' , "os":"' + images.os + '_' + images.os_version + '" }',
                                               user_id=compute.user_id,
                                               project_id=compute.project_id,
                                               organisation_id=1,
                                               provider_id=compute.provider_id
                                               )
            for created_data in created_resource:

                is_data_match = False
                for deleted_data in deleted_resource:
                    log.info(deleted_data)
                    if deleted_data.resource_record_id == created_data.resource_record_id:
                        is_data_match = True
                if is_data_match is not True:
                    is_log_available = False
                    for compute in computeList:
                        if created_data.resource_record_id == compute.id:
                            is_log_available = True

                    if is_log_available is not True:
                        db.session.delete(created_data)


            for deleted_data in deleted_resource:
                is_data_match = False
                for created_data in created_resource:

                    if deleted_data.resource_record_id == created_data.resource_record_id:
                        is_data_match = True
                if is_data_match is not True:

                    db.session.delete(deleted_data)

        elif resource_type == 'storage':
            volumesList = Volume.query.all()

            for volume in volumesList:

                resource_log = ResourceActionLog.query.filter_by(resource_type='storage', action='created',
                                                                 resource_record_id=volume.id).first()

                if resource_log is None:
                    create_resource_action_log(db,
                                               resource_type='storage',
                                               resource_record_id=volume.id,
                                               action='created',
                                               resource_configuration='Storage Created with Resources : { "storage":' + str(
                                                   volume.volume_size) + ' }',
                                               user_id=volume.user_id,
                                               project_id=volume.project_id,
                                               organisation_id=1,
                                               provider_id=volume.provider_id
                                               )
            for created_data in created_resource:

                is_data_match = False
                for deleted_data in deleted_resource:

                    if deleted_data.resource_record_id == created_data.resource_record_id:
                        is_data_match = True
                if is_data_match is not True:

                    db.session.delete(created_data)
            for deleted_data in deleted_resource:

                is_data_match = False
                for created_data in created_resource:

                    if deleted_data.resource_record_id == created_data.resource_record_id:
                        is_data_match = True
                if is_data_match is not True:
                    log.info(created_data)
                    db.session.delete(deleted_data)
        return True

# def update_token_expiry_time(user_id):

#     from app.modules.auth.models import OAuth2Token
#     from app.extensions import db
#     from datetime import datetime, timedelta
#     import redis
#     from app.modules.users.models import User

#     user_oauth_token = OAuth2Token.query.filter_by(user_id=user_id).first()
#     user = User.query.get(user_id)
#     #if user_id == 60 or user_id == 45:
#     if user_id == 133:
#         return True
#     if user.user_type.lower() == 'api':
#         return True

#     if user_oauth_token is not None:
#         expires_in = StaticValue.token_expiry_time
#         expires = datetime.utcnow() + timedelta(seconds=expires_in)
#         with db.session.begin():

#             user_oauth_token.expires = expires
#             db.session.merge(user_oauth_token)

#         redis_obj = redis.Redis(BaseConfig.REDIS_HOST, charset="utf-8", decode_responses=True)
#         access_token = user_oauth_token.access_token
#         redis_obj.set(access_token, user_oauth_token.user_id)
#         redis_obj.expireat(access_token, expires)

#         client_key_for_redis = "client_" + str(access_token)
#         csrf_auth = "csrf_"+str(access_token)
#         csrf_token = redis_obj.get(csrf_auth)
#         redis_obj.expire(csrf_token, expires_in)
#         redis_obj.expire(csrf_auth, expires_in)
#         resp = redis_obj.get(client_key_for_redis)

#         redis_obj.expireat(str(resp), expires)
#         redis_obj.expire(str(resp), expires_in)

#         socket_id = redis_obj.get(resp)
#         redis_obj.expireat(str(socket_id), expires)


def generate_hash_for_number(num, resource_type):
    from app.modules.auth.models import HashToken
    code_length = HashToken.query.first()

    if resource_type == 'organisation':
        length = code_length.org_code_length
    elif resource_type == 'project':
        length = code_length.project_code_length
    elif resource_type == 'provider':
        length = code_length.provider_code_length

    hash_value_table = "cyadgwvspkzbeh28tqm54fj3xurn67"
    hash_value_table_len = 10
    full_length_number = str(num).zfill(length)
    number_len = len(full_length_number)
    cindex = 0
    multiply_factor = 0
    hash_value = ''
    for char in full_length_number:
        cindex += 1
        multiply_factor += 1
        char_val = int(char)
        hash_value_index = (char_val + (cindex * 10) + number_len)
        if (number_len - cindex) > 1:
            hash_value_index += int(full_length_number[number_len - 2:])
        hash_value_index = (hash_value_index % (cindex * 10))
        hash_value_index = (hash_value_index % 10)
        hash_value_index = hash_value_index + ((multiply_factor - 1) * 10)
        if (multiply_factor == 3):
            multiply_factor = 0
        hash_digit_value = hash_value_table[hash_value_index]
        hash_value += hash_digit_value

    return hash_value


def map_security_group_with_compute():
    from app.modules.compute.models import Compute
    from app.modules.networks.models import SecurityGroupComputeMapping
    from app.extensions import db
    compute = Compute.query.all()
    with db.session.begin():
        for vm in compute:

            security_group_compute = SecurityGroupComputeMapping.query.filter_by(compute_id=vm.id, security_group_id=vm.sec_group_id).first()

            if security_group_compute is None:
                sec_group_compute_mapping = SecurityGroupComputeMapping(compute_id=vm.id, security_group_id=vm.sec_group_id)
                db.session.add(sec_group_compute_mapping)

    return True


def ipRange(start_ip, end_ip):
    start = list(map(int, start_ip.split(".")))
    end = list(map(int, end_ip.split(".")))
    temp = start
    ip_range = []
    ip_range.append(start_ip)
    while temp != end and temp < end:
        start[3] += 1
        for i in (3, 2, 1):
            if temp[i] == 256:
                temp[i] = 0
                temp[i - 1] += 1

        ip_range.append(".".join(map(str, temp)))

    return ip_range

def custom_query(args):
    filter_args = {}
    for k in args:
        if k not in ['limit', 'offset', 'field', 'order', 'sort_by', 'sort_desc']:
            filter_args[k] = args[k]
    criteria = OrderedDict(filter_args.items())
    return criteria

"""
send forget password otp
"""
def sendOtp(email, mobile_no, user_id, is_email=True):

    import redis
    from app.extensions import SendMAIL
    from app.modules.utils.models import SmsTemplate

    redis_obj = redis.Redis(BaseConfig.REDIS_HOST, charset="utf-8", decode_responses=True)

    allowed_chars = 'ABCDEFGHKMNPQRSTUVWXYZ123456789'
    code_chars = '0123456789'
    flask_config = os.getenv('FLASK_CONFIG')
    if flask_config and flask_config.lower() == 'production':
        otp_code = ''.join(random.choice(code_chars) for _ in range(4))
        otp_value = ''.join(random.choice(allowed_chars) for _ in range(6))
        user_mobile_number = '91'+str(mobile_no)

        sms_template = SmsTemplate.query.filter_by(template_name='otp', template_type='login').first()
        if sms_template is None:
            message = "Dear Sir/Madam, Please use OTP: "+str(otp_value)+" to login into the Yntraa Cloud Service Portal. -Regards, Yntraa/YntraaSI Cloud Support"
            send_sms_status = send_sms(user_mobile_number, message, template_id='1107166696307646045')
        else:
            message = sms_template.custom_template.format(otp_value=otp_value)
            send_sms_status = send_sms(user_mobile_number, message, template_id=sms_template.template_id)
        log.debug("send_sms_status %s",send_sms_status)
        if is_email is True:
            subject = 'Fortgot Password (OTP) : Yntraa Cloud Service Portal'
            message = '<p>Dear Sir/Ma\'am, <br/><br/> The One Time Password (OTP) to reset password your Service Cloud Portal is <strong>'+str(otp_value)+'</strong>  <br/><br/>This OTP is valid for only 5 minutes. Please do not share this OTP with anyone.<br/><br/>Thanks & regards, <br/>Cloud Support Team</p>'
            log.debug("send_mail_message %s",message)

            noreply_email = os.getenv('FROM_EMAIL', 'noreply@cloud.yntraa.com')
            send_mail_status = SendMAIL.send_mail_wrapper(noreply_email, email, subject, message, True)
            log.debug("send_mail_status %s",send_mail_status)

    else :
        otp_value = 654321

    redis_obj.set(email, otp_value)
    redis_obj.expire(email, 300)

#Function for generating authorization token for given username and password...
def generateAuthToken(username,password):
    import base64
    import os
    import hashlib
    log.info("Here to generate auth token")
    message_bytes = username.encode('ascii')
    base64_bytes = base64.b64encode(message_bytes)
    base64_message = base64_bytes.decode('ascii')
    result = hashlib.md5(password.encode())
    x=":"
    authToken=base64_message+x+result.hexdigest()
    return authToken

def validateNamePattern(name, organisation_id, project_key, provider_key):

    from app.modules.organisations.models import Organisation

    organisation = Organisation.query.get(organisation_id)
    log.info(organisation)

    name_pattern = organisation.org_id+"-"+project_key+"-"+provider_key
    log.info(name)
    log.info(name_pattern)
    if name_pattern in name and not name.endswith('-'):
        return True
    else:
        return False

def sendServiceRequestConfirmationMail(project_id, message, team_name, cloud_location, **kwargs):

    from app.modules.projects.models import Project
    from app.modules.organisations.models import Organisation

    project = Project.query.get(project_id)
    organisation = Organisation.query.get(project.organisation_id)
    custom_messgae = "Cloud Reg. A/c No : "+organisation.org_reg_code+", Organization: "+organisation.name+" ("+organisation.org_id+"), Project: "+project.name+" ("+project.project_id+"), Cloud Location: "+cloud_location+" "
    subject = "Yntraa Cloud Services: "+custom_messgae+", "+message
    action = kwargs.get('action', 'received')
    mail_message = '<p>Dear Sir/Madam, <br/><br/> In reference to your '+custom_messgae+message+' has been '+action+'. Please visit our admin portal (https://admin.cloud.yntraa.com/login) for more details.<br/><br/>Regards, <br/> Yntraa Cloud Support Team</p>'

    token = "NsTWawUESnpy9v32yfbOPJW8oKugaM"
    remote_url = " https://cloud.yntraa.com/admin/send_team_custom_email.php"
    payloads = {
        'reference_number': organisation.org_reg_code,
        'datacenter_name': cloud_location,
        'org_code': organisation.org_id,
        'team_name': team_name,
        'mail_subject': subject,
        'mail_body': mail_message
    }
    headers = {'Authorization': 'Bearer '+str(token)}
    log.info(payloads)
    message_status = requests.post(remote_url, data=payloads, headers=headers, verify=False)
    log.info(message_status.text)
    return message_status

def sendOrganisationServiceRequestConfirmationMail(organisation_id, message, team_name, cloud_location):

    from app.modules.organisations.models import Organisation

    organisation = Organisation.query.get(organisation_id)
    custom_messgae = "Cloud Reg. A/c No : "+organisation.org_reg_code+", Organization: "+organisation.name+" ("+organisation.org_id+"), Cloud Location: "+cloud_location+' '
    subject = "Yntraa Cloud Services: Cloud Reg. A/c No : "+custom_messgae+", "+message
    mail_message = '<p>Dear Sir/Madam, <br/><br/> In reference to your '+custom_messgae+message+' has received. Please visit our admin portal (https://admin.cloud.yntraa.com/login) for more details.<br/><br/>Regards, <br/> Yntraa Cloud Support Team</p>'

    token = "NsTWawUESnpy9v32yfbOPJW8oKugaM"
    remote_url = " https://cloud.yntraa.com/admin/send_team_custom_email.php"
    payloads = {
        'reference_number': organisation.org_reg_code,
        'datacenter_name': cloud_location,
        'org_code': organisation.org_id,
        'team_name': team_name,
        'mail_subject': subject,
        'mail_body': mail_message
    }
    headers = {'Authorization': 'Bearer '+str(token)}
    log.info(payloads)
    message_status = requests.post(remote_url, data=payloads, headers=headers, verify=False)
    log.info(message_status)
    return message_status

def check_scope_and_auth_token(scope):
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            from flask import request
            from flask_restplus_patched._http import HTTPStatus
            from app.modules.auth.models import OAuth2Token

            not_authorized = None
            authorisation_token = request.headers.get('Authorization')
            if authorisation_token:
                authorisation_token_details = list(authorisation_token.split(" "))
                authorisation_token = authorisation_token_details[1]
                oauth2_last_token = OAuth2Token.query.filter_by(access_token=authorisation_token).first()
                if oauth2_last_token is None:
                    not_authorized = True
            else:
                not_authorized = True

            if not_authorized:
                return abort(code=HTTPStatus.UNAUTHORIZED,
                             message="The server could not verify that you are authorized to access the URL requested. You either supplied the wrong credentials (e.g. a bad password), or your browser doesn't understand how to supply the credentials required")

            if scope in oauth2_last_token.scopes:

                ret = f(*args, **kwargs)
                return ret
            else:
                return abort(code=HTTPStatus.FORBIDDEN,
                             message="Forbidden: You do not have valid scope to access this resource !!!!!")

        return wrapped
    return decorator

def calculate_from_resource_action_log(from_date, till_date, organisation_id, provider_id):
    from app.modules.resource_action_logs.models import ResourceActionLog
    from app.modules.organisations.models import Organisation

    resource_details = ResourceActionLog.query.filter(ResourceActionLog.organisation_id == organisation_id).filter(ResourceActionLog.provider_id == provider_id).filter(ResourceActionLog.created.between(from_date,till_date))

    resource_action_log_data = [data for data in resource_details]
    calculated_action_log = {}
    organisation = Organisation.query.get(organisation_id)
    resource_data = calculate_current_utlization_from_resource_action_logs(organisation_id, provider_id, resource_action_log_data)
    calculated_action_log['resource_action_log'] = resource_data
    calculated_action_log['organisation'] = json.loads(json.dumps(organisation, cls=AlchemyEncoder))

    return calculated_action_log

def combine_calculated_log_and_cron_log(current_resource_data, cron_resource_data, **kwargs):

    organisation_id = kwargs['organisation_id']
    provider_id = kwargs['provider_id']
    allocated_resources = get_allocated_quota_detail(organisation_id, provider_id)

    combined_consumed_resources = combine_cron_current_utlization(cron_utilization=cron_resource_data, current_utilization=current_resource_data)

    available_resources = calculate_available_resources_from_allocated(allocated_resources, combined_consumed_resources)
    combined_stats = prepare_resource_utilization_dict(allocated_resources, combined_consumed_resources, available_resources)

    return combined_stats

def get_organisation_resource_details_on_provider(organisation_id, provider_id):
    from app.modules.resource_action_logs.models import ProviderResourceActionLog, ResourceActionLog

    provider_action_log = ProviderResourceActionLog.query.filter_by(organisation_id=organisation_id, provider_id=provider_id).order_by('action_log_date desc').first()
    resource_action_log = ResourceActionLog.query.filter_by(organisation_id=organisation_id, provider_id=provider_id)
    if provider_action_log:
        last_action_log_date = provider_action_log.action_log_date
        from_date = str(datetime.combine(last_action_log_date+timedelta(days=1), datetime.min.time()))
        to_date = str(datetime.now())
        resource_action_log = resource_action_log.filter(ResourceActionLog.created.between(from_date, to_date))
    resource_action_log = resource_action_log.all()

    resource_stats = calculate_current_utlization_from_resource_action_logs(organisation_id, provider_id,resource_action_log)
    if provider_action_log:
        resource_stats = combine_calculated_log_and_cron_log(resource_stats, provider_action_log.action_log[0]['resource_action_log'], organisation_id=organisation_id, provider_id=provider_id)

    return resource_stats

def check_2fa_status(user_id):

    from app.modules.users.models import User
    from flask import current_app

    otp_integration = current_app.config['OTP_INTEGRATION'].lower()!='false'

    user_details = User.query.get(user_id)
    is_2fa = user_details.is_2fa

    if otp_integration and is_2fa:
        return True
    else:
        return False


def render_html(template_name, context=None):
    """
    Render html page using jinja
    """
    if context is None:
        context = {}
    template_loader = jinja2.FileSystemLoader(searchpath="app/modules/invoices")
    template_env = jinja2.Environment(loader=template_loader)
    template = template_env.get_template(template_name)
    output_text = template.render(**context)

    return output_text

def get_backup_status(**kwargs):
    """
    Required Parameter: request_id
    """
    from app.modules.backup_services.models import BackupJobs
    backup_detail = BackupJobs.query.filter_by(request_id=kwargs['request_id']).first()
    return backup_detail.backup_job_status

def get_organisation_current_resource_utlization_on_provider(organisation_id, provider_id):
    """
    Returns organisation current utlization on provider
    """
    from app.modules.resource_action_logs.models import ProviderResourceActionLog, ResourceActionLog

    allocated_resources = get_allocated_quota_detail(organisation_id, provider_id)
    last_cron_data = ProviderResourceActionLog.query.filter_by(provider_id=provider_id, organisation_id=organisation_id).order_by("action_log_date desc").first()

    if last_cron_data is None:
        resource_action_logs = ResourceActionLog.query.filter_by(organisation_id=organisation_id, provider_id=provider_id).all()
        consumed_resources = calculate_resource_action_log_consumption(resource_action_logs)

    else:
        cron_data_till = datetime.combine(last_cron_data.action_log_date, datetime.max.time())
        current_resource_action_logs = ResourceActionLog.query.filter_by(organisation_id=organisation_id, provider_id=provider_id).filter(ResourceActionLog.created > cron_data_till).all()
        current_utilization = calculate_resource_action_log_consumption(current_resource_action_logs)
        consumed_resources = combine_cron_current_utlization(cron_utilization=last_cron_data.action_log[0]['resource_action_log'], current_utilization=current_utilization)

    available_resources = calculate_available_resources_from_allocated(allocated_resources, consumed_resources)
    resource_data = prepare_resource_utilization_dict(allocated_resources, consumed_resources, available_resources)

    return resource_data

def sort_queryset(model):
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            import flask_sqlalchemy

            table_name = model.__tablename__

            sort_by = args[1].pop('sort_by')
            sort_asc = args[1].pop('sort_asc')

            if sort_asc:
                sort_order = ''
            else:
                sort_order = ' desc'

            result = f(*args, **kwargs)

            if isinstance(result, flask_sqlalchemy.BaseQuery):
                log.info('Inside Sorting Decorator')
                return result.order_by(f'{table_name}.{sort_by}{sort_order}')
            else:
                return result

        return wrapped
    return decorator


def sync_organisation_quota(organisation_id, provider_id, project_id):
    from app.modules.providers.models import Provider, ProviderType
    from app.modules.organisations.models import OrganisationQuotaPackage
    from app.modules.quotapackages.models import QuotaPackage

    org_quotapackage = OrganisationQuotaPackage.query.filter_by(provider_id=provider_id).filter_by(
        organisation_id=organisation_id).first()

    quotapackage_details = QuotaPackage.query.filter_by(id=org_quotapackage.quotapackage_id).first()

    prev_topup = allocated_topup_quota_details(organisation_id, provider_id)

    compute_quota_args = project_compute_quota(prev_topup, quotapackage_details, provider_id)
    volume_quota_args = project_volume_quota(prev_topup, quotapackage_details, provider_id)
    network_quota_args = project_network_quota(prev_topup, quotapackage_details, provider_id)

    message_status = []
    provider = Provider.query.get(provider_id)
    provider_type = ProviderType.query.get(provider.provider_type_id)
    _provider = globals()[provider_type.name]

    try:
        _provider.update_project_compute_quota(provider, project_id, **compute_quota_args)
        _provider.update_project_volume_quota(provider, project_id, **volume_quota_args)
        _provider.update_project_network_quota(provider, project_id, **network_quota_args)
        message_status.append("Quota sync successfully")
    except Exception as e:
        log.info("Exception: %s", e)
        message_status.append(str(e))

    return message_status