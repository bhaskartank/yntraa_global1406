# encoding: utf-8
# pylint: disable=missing-docstring
"""
This file contains initialization data for development usage only.

You can execute this code via ``invoke app.db.init_development_data``
"""
import os
import uuid

import yaml

from app.extensions import db, api
from app.extensions.providers.openstack import OpenStackProvider
from app.extensions import Openstack

from app.modules.users.models import User
from app.modules.providers.models import Provider, ProviderType, ResourceAvailabilityZones
from app.modules.organisations.models import Organisation, CloudPortalDetails, OrganisationProjectUser, \
    OrganisationQuotaPackage, Subscription
# from app.modules.projects.models import Project, ProjectProviderMapping
from app.modules.auth.models import OAuth2Client
from app.modules.role_permission.models import RolePermissionGroup, UserRole, UsersDefaultScope, AllowedAdmin
from app.modules.quotapackages.models import QuotaPackage
from app.modules.utils.models import EULA


def init_provider_type():
    with db.session.begin():
        provider_type = ProviderType(
            name='Openstack',
            description='Openstack Cloud'
        )
        db.session.add(provider_type)
    return provider_type


def init_provider():
    provider_type = ProviderType.query.first()
    provider_list = []
    with open('cloud.yaml', 'r') as file:
        data = yaml.safe_load(file)
        providers = data['providers']
        for _provider in providers:
            provider = providers[_provider]
            with db.session.begin():
                prov = Provider(
                    provider_name=provider['cloud_name'],
                    provider_type_id=provider_type.id,
                    auth_url=provider['auth']['auth_url'],
                    identity_api_version=provider['identity_api_version'],
                    provider_location='Noida',
                    provider_id=provider['provider_id'],
                    region_name=provider['region_name'],
                    project_name=provider['auth']['project_name'],
                    user_domain_id=provider['auth']['user_domain_id'],
                    username=provider['auth']['username'],
                    password=provider['auth']['password'],
                    default = provider.get('default', False),
                )
                db.session.add(prov)
                provider_list.append(prov)
    return provider_list


# def init_cloud_portal_details():
#     with db.session.begin():
#         cloud_portal = CloudPortalDetails(
#             name='yntraa',
#             url='https://console.yntraa.com/',
#             status='active'
#         )
#         db.session.add(cloud_portal)
#
#     return cloud_portal


def init_organisation():
    with db.session.begin():
        organisation = Organisation(
            name='Global_Organisation',
            description='Global Organisation',
            org_reg_code='NCS01-20180101-00000000',
            id='1',
            org_id=uuid.uuid4()
        )
        db.session.add(organisation)
    return organisation


# def init_project(organisation, user):
#     with db.session.begin():
#         project = Project(
#             name='Global_Project',
#             project_id='81052',
#             description='Global Project',
#             organisation_id=organisation.id,
#             user_id=user.id,
#             id='1'
#         )
#         db.session.add(project)
#     return project


def init_users():
    with db.session.begin():
        # SET
        # password = 'q', updated =?, id =?, username =?, password =?, email =?, first_name =?, middle_name =?, last_name =?, static_roles =?, mobile_no =?, is_2fa =?, is_csrf_token =?, user_type =?, status =?, external_crm_uuid =?, contact_type =?, customer_reg_code =?, user_id =?

        root_user = User(
            username='root',
            email='root@localhost',
            password='q',
            external_crm_uuid='external_crm_uuid_root',
            customer_reg_code='customer_reg_code_root',
            user_id='user_id_root',
            contact_type='contact_type_root',
            # mobile_no='7781000801',
            is_active=True,
            is_regular_user=False,
            is_admin=True
        )
        db.session.add(root_user)
        docs_user = User(
            username='documentation',
            email='documentation@localhost',
            password='w',
            external_crm_uuid='external_crm_uuid_doc',
            customer_reg_code='customer_reg_code_doc',
            user_id='user_id_doc',
            contact_type='contact_type_doc',
            # mobile_no='7781000801',
            is_active=False
        )
        db.session.add(docs_user)
        regular_user = User(
            username='user',
            email='user@localhost',
            password='w',
            external_crm_uuid='external_crm_uuid_regular',
            customer_reg_code='customer_reg_code_regular',
            user_id='user_id_regular',
            contact_type='contact_type_regular',
            # mobile_no='7781000801',
            is_active=True,
            is_regular_user=True
        )
        db.session.add(regular_user)
        internal_user = User(
            username='internal',
            email='internal@localhost',
            password='q',
            external_crm_uuid='external_crm_uuid_internal',
            customer_reg_code='customer_reg_code_internal',
            user_id='user_id_internal',
            contact_type='contact_type_internal',
            # mobile_no='7781000801',
            is_active=True,
            is_internal=True
        )
        db.session.add(internal_user)
        kafka_user = User(
            username='kafka',
            email='kafka@localhost',
            password='q',
            external_crm_uuid='external_crm_uuid_kafka',
            customer_reg_code='customer_reg_code_internal',
            user_id='user_id_internal',
            contact_type='contact_type_internal',
            # mobile_no='7781000801',
            is_active=True,
            is_internal=True
        )
        db.session.add(kafka_user)
    return root_user, docs_user, regular_user, internal_user, kafka_user


def init_allowed_admin():
    users = User.query.all()
    for user in users:
        with db.session.begin():
            allowed_admin_obj = AllowedAdmin(user_id=user.id)
            db.session.add(allowed_admin_obj)


def init_auth(root_user, internal_user):
    # TODO: OpenAPI documentation has to have OAuth2 Implicit Flow instead
    # of Resource Owner Password Credentials Flow
    with db.session.begin():
        oauth2_client = OAuth2Client(
            client_id='root',
            client_secret='q',
            user_id=root_user.id,
            redirect_uris=[],
            default_scopes='auth:read'
        )
        db.session.add(oauth2_client)

        oauth2_client_2 = OAuth2Client(
            client_id='internal',
            client_secret='q',
            user_id=internal_user.id,
            redirect_uris=[],
            default_scopes='auth:read'
        )
        db.session.add(oauth2_client_2)

    return oauth2_client, oauth2_client_2


def init_role_permission_group(organisation):
    with db.session.begin():
        role_permission_group1 = RolePermissionGroup(
            group_name='Default_User_Role',
            group_description='Default User Role Permission',
            organisation_id=organisation.id,
            scope=['role_permission:read'],
            id = '0'
        )
        db.session.add(role_permission_group1)
        role_permission_group2 = RolePermissionGroup(
            group_name='Organisation_Administrator',
            group_description='Default Organisation Administrator Role',
            organisation_id=organisation.id,
            scope=['role_permission:read', 'role_permission:write', 'compute:read', 'object-storages:read',
                   'object-storages:write', 'compute:write', 'project_gateway:read', 'project_gateway:write',
                   'networks:read', 'networks:write', 'volumes:read', 'volumes:write', 'load-balancers:read',
                   'load-balancers:write', 'scaling-groups:read', 'scaling-groups:write', 'cluster:read',
                   'cluster:write']
        )
        db.session.add(role_permission_group2)
        role_permission_group3 = RolePermissionGroup(
            group_name='Project_Administrator',
            group_description='Default Project Administrator Role',
            organisation_id=organisation.id,
            scope=['role_permission:read', 'compute:read', 'object-storages:read', 'object-storages:write',
                   'compute:write', 'project_gateway:read', 'networks:read', 'networks:write', 'volumes:read',
                   'volumes:write', 'load-balancers:read', 'load-balancers:write', 'scaling-groups:read',
                   'scaling-groups:write', 'ticket:write', 'project_gateway:write', 'cluster:read', 'cluster:write',
                   'ticket:read']
        )

        db.session.add(role_permission_group3)
        role_permission_group4 = RolePermissionGroup(
            group_name='Project_user',
            group_description='Default Project User Role',
            organisation_id=organisation.id,
            scope=['role_permission:read', 'compute:read', 'object-storages:read', 'object-storages:write',
                   'compute:write', 'project_gateway:read', 'networks:read', 'networks:write', 'volumes:read',
                   'volumes:write', 'load-balancers:read', 'load-balancers:write', 'scaling-groups:read',
                   'scaling-groups:write', 'ticket:write', 'cluster:read', 'cluster:write', 'ticket:read']
        )
        db.session.add(role_permission_group4)
        role_permission_group5 = RolePermissionGroup(
            group_name='Organisation_user',
            group_description='Default Organisation User Role',
            organisation_id=organisation.id,
            scope=['role_permission:read', 'compute:read', 'project_gateway:read', 'networks:read',
                   'volumes:read', 'load-balancers:read', 'cluster:read', 'cluster:write']
        )
        db.session.add(role_permission_group5)

        role_permission_group6 = RolePermissionGroup(
            group_name='Project_reader',
            group_description='Default Project Reader Role',
            organisation_id=organisation.id,
            scope=['role_permission:read', 'compute:read', 'project_gateway:read', 'networks:read',
                   'volumes:read', 'load-balancers:read', 'ticket:read', 'cluster:read']

        )
        db.session.add(role_permission_group6)

    return role_permission_group1, role_permission_group2, role_permission_group3, role_permission_group4, \
        role_permission_group5, role_permission_group6


def init_quota_package():
    with db.session.begin():
        quota_package_1 = QuotaPackage(
            name='Small',
            description='Small Project Package',
            quotapackage_value=200000,
            user=10,
            project=5,
            vm=20,
            vcpu=80,
            ram=320,
            storage=3000,
            network=5,
            subnet=15,
            port=400,
            router=5,
            security_group=100,
            security_group_rule=1000,
            load_balancer=10,
            vm_snapshot=40,
            volume_snapshot=40,
            key_pair=20,
            floating_ip=20,
            public_ip=5,
            scaling_group=5,
            nks_cluster=2,
            nas_storage=3000,
            version='v1',
            is_active=True,
            default=True
        )
        db.session.add(quota_package_1)

        quota_package_2 = QuotaPackage(
            name='Medium',
            description='Medium Project Package',
            quotapackage_value=1000000,
            user=30,
            project=15,
            vm=60,
            vcpu=240,
            ram=1024,
            storage=9000,
            network=15,
            subnet=45,
            port=1200,
            router=15,
            security_group=200,
            security_group_rule=2000,
            load_balancer=30,
            vm_snapshot=180,
            volume_snapshot=180,
            key_pair=60,
            floating_ip=60,
            public_ip=15,
            scaling_group=15,
            nks_cluster=5,
            nas_storage=9000,
            version='v1',
            is_active=True
        )
        db.session.add(quota_package_2)

        quota_package_3 = QuotaPackage(
            name='Large',
            description='Large Project Package',
            quotapackage_value=2400000,
            user=120,
            project=30,
            vm=240,
            vcpu=960,
            ram=4096,
            storage=36000,
            network=30,
            subnet=120,
            port=4200,
            router=30,
            security_group=400,
            security_group_rule=5000,
            load_balancer=120,
            vm_snapshot=1020,
            volume_snapshot=1020,
            key_pair=240,
            floating_ip=150,
            public_ip=30,
            scaling_group=30,
            nks_cluster=10,
            nas_storage=36000,
            version='v1',
            is_active=True
        )
        db.session.add(quota_package_3)

        quota_package_4 = QuotaPackage(
            name='Mega',
            description='Mega Project Package',
            quotapackage_value=10000000,
            user=1000,
            project=100,
            vm=1000,
            vcpu=1600,
            ram=6400,
            storage=110000,
            network=100,
            subnet=500,
            port=22000,
            router=100,
            security_group=1000,
            security_group_rule=10000,
            load_balancer=1000,
            vm_snapshot=10000,
            volume_snapshot=10000,
            key_pair=1000,
            floating_ip=500,
            public_ip=100,
            scaling_group=100,
            nks_cluster=20,
            nas_storage=110000,
            version='v1',
            is_active=True
        )
        db.session.add(quota_package_4)
    return quota_package_1, quota_package_2, quota_package_3, quota_package_4




def init_user_default_scope():
    with db.session.begin():
        init_user_default_scope1 = UsersDefaultScope(
            user_scope_type='global',
            scope=['auth:read', 'auth:write', 'users:read', 'teams:read', 'organisations:read',
                   'object-storages:read', 'object-storages:write', 'projects:read', 'providers:read',
                   'role_permission:read', 'quotapackages:read', 'project_gateway:read', 'utils:read',
                   'audit-trails:read', 'audit-trails:write', 'resource-action-logs:read',
                   'resource-action-logs:write', 'resource-costs:read']
        )
        db.session.add(init_user_default_scope1)

        init_user_default_scope2 = UsersDefaultScope(
            user_scope_type='user',
            scope=['role_permission:read', 'object-storages:read', 'object-storages:write',
                   'role_permission:write', 'compute:read', 'compute:write', 'project_gateway:read',
                   'project_gateway:write', 'networks:read', 'networks:write', 'volumes:read',
                   'volumes:write', 'load-balancers:read', 'load-balancers:write', 'orchestrators:read',
                   'orchestrators:write']
        )
        db.session.add(init_user_default_scope2)

        init_user_default_scope3 = UsersDefaultScope(
            user_scope_type='admin',
            scope=['role_permission:write', 'projects:write', 'users:write', 'auth:read', 'auth:write',
                   'users:read', 'teams:read', 'organisations:read', 'projects:read', 'providers:read',
                   'role_permission:read', 'quotapackages:read', 'project_gateway:read', 'utils:read',
                   'audit-trails:read',
                   'audit-trails:write', 'resource-action-logs:read', 'resource-action-logs:write']
        )
        db.session.add(init_user_default_scope3)

        init_user_default_scope4 = UsersDefaultScope(
            user_scope_type='internal',
            scope=['auth:read', 'auth:write', 'users:read', 'teams:read', 'organisations:read', 'organisations:write',
                   'providers:write', 'projects:read', 'providers:read', 'role_permission:read', 'quotapackages:read',
                   'project_gateway:read', 'utils:read', 'audit-trails:read', 'audit-trails:write',
                   'resource-action-logs:read',
                   'resource-action-logs:write', 'utils:write', 'resource-costs:read', 'resource-costs:write',
                   'role_permission:write', 'projects:write', 'users:write', 'organisations:write', 'providers:write',
                   'resource-costs:write', 'utils:write']
        )
        db.session.add(init_user_default_scope4)

        init_user_default_scope5 = UsersDefaultScope(
            user_scope_type='regular',
            scope=['auth:read', 'auth:write', 'users:read', 'teams:read', 'organisations:read', 'projects:read',
                   'providers:read', 'role_permission:read', 'quotapackages:read', 'project_gateway:read', 'utils:read',
                   'audit-trails:read', 'audit-trails:write', 'resource-action-logs:read', 'resource-action-logs:write']
        )
        db.session.add(init_user_default_scope5)

    return init_user_default_scope1, init_user_default_scope2, init_user_default_scope3, init_user_default_scope4, init_user_default_scope5


def init_user_role(project, organisation):
    users = User.query.all()
    with db.session.begin():
        for user in users:
            role_permission_group = RolePermissionGroup.query.get(3)
            if user.username in ['internal','kafka']:
                role_permission_group = RolePermissionGroup.query.get(1)
            elif user.username == 'root':
                role_permission_group = RolePermissionGroup.query.get(2)
            userrole = UserRole(
                user_id=user.id,
                organisation_id=organisation.id,
                project_id=project.id,
                user_scope=api.api_v1.authorizations['oauth2_password']['scopes'],
                user_role=role_permission_group.id
            )
            db.session.add(userrole)



def init_azs_sync():
    provider = Provider.query.first()
    provider_type = ProviderType.query.get(provider.provider_type_id)
    _provider = globals()[provider_type.name]
    for resource in ['compute', 'network']:
        azs = _provider.list_zones(provider, resource_name=resource)
        with db.session.begin():
            for az in azs:
                az = ResourceAvailabilityZones(
                    provider_id=provider.id,
                    resource_name=resource,
                    zone_name=az['name']
                )
                db.session.add(az)


def init_organisation_project_user_mapping(organisation, project):
    users = User.query.all()
    with db.session.begin():
        for user in users:
            organisation_project_user_mapping = OrganisationProjectUser(
                organisation_id=organisation.id,
                project_id=project.id,
                user_id=user.id
            )
            db.session.add(organisation_project_user_mapping)


def init_project_provide_mapping(project, provider):
    provider_type = ProviderType.query.get(provider.provider_type_id)
    _provider = globals()[provider_type.name]
    projects_list = _provider.list_projects(provider)
    with db.session.begin():
        new_project_provider_mapping = ProjectProviderMapping(
            provider=provider,
            project=project,
            gw_device_id="dummy-device-id",
            gw_device_ip="dummy-device-ip",
            provider_project_id=projects_list[0].id
        )
        db.session.add(new_project_provider_mapping)


def init_organisation_quotapackage(quota_package, organisation, provider):
    with db.session.begin():
        organisation_quota_packages = OrganisationQuotaPackage(
            organisation_id=organisation.id,
            provider_id=provider.id,
            quotapackage_id=quota_package.id
        )
        db.session.add(organisation_quota_packages)


def init_eula():
    with db.session.begin():
        eula = EULA(
            content='''End User License Agreement

This End User License Agreement ("Agreement") is a legal agreement between you (referred to as "User" or "you") and YNTRAA (referred to as "Provider" or "we") for the use of the Yntraa Cloud Services (referred to as the "Service"). By using the Service, you agree to be bound by the terms and conditions of this Agreement.

1. License Grant
   Provider grants you a limited, non-exclusive, non-transferable license to use the Service in accordance with the terms and conditions set forth in this Agreement.

2. Use of the Service
   a. You may use the Service for your personal or business purposes, subject to the restrictions outlined in this Agreement.
   b. You are responsible for maintaining the confidentiality of your account credentials and for any activities or actions that occur under your account.

3. Restrictions
   a. You shall not, directly or indirectly, copy, modify, distribute, sell, lease, sublicense, or otherwise transfer any portion of the Service.
   b. You shall not use the Service for any illegal or unauthorized purpose.
   c. You shall not interfere with or disrupt the Service or its associated networks.

4. Intellectual Property
   The Service and its original content, features, and functionality are owned by Provider and are protected by intellectual property laws. You shall not remove or modify any copyright or proprietary notices on the Service.

5. Disclaimer of Warranty
   The Service is provided on an "as is" basis, without warranties of any kind, either express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.

6. Limitation of Liability
   In no event shall Provider be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or in connection with the use or inability to use the Service.

7. Termination
   Provider reserves the right to suspend or terminate your access to the Service at any time, with or without cause or notice.

8. Governing Law
   This Agreement shall be governed by and construed in accordance with the laws of [Your Jurisdiction]. Any disputes arising under or in connection with this Agreement shall be subject to the exclusive jurisdiction of the courts of [Your Jurisdiction].

9. Entire Agreement
   This Agreement constitutes the entire agreement between you and Provider regarding the use of the Service and supersedes all prior agreements and understandings.

Please read this Agreement carefully. By using the Service, you acknowledge that you have read, understood, and agreed to be bound by its terms and conditions.

Date: 2023-05-22
''',
            version='v1'
        )
        db.session.add(eula)
    return eula

# from invoke import ctask as task

def init_subscription(org_id, proj_id, prov_id,eula_id):
    users = User.query.all()
    for user in users:
        if user.username == 'internal':
            with db.session.begin():
                subscription = Subscription(
                    organisation_id=org_id,
                    project_id=proj_id,
                    provider_id=prov_id,
                    eula_id=eula_id,
                    user_id = user.id)
                db.session.add(subscription)



def init():
    # return None
    # Automatically update `default_scopes` for `documentation` OAuth2 Client,
    # as it is yntraae to have an ability to evaluate all available API calls.
    with db.session.begin():
        OAuth2Client.query.filter(OAuth2Client.client_id == 'documentation').update({
            OAuth2Client.default_scopes: api.api_v1.authorizations['oauth2_password']['scopes'],
        })

    assert User.query.count() == 0, \
        "Database is not empty. You should not re-apply fixtures! Aborted."

    # init_cloud_portal_details()

    init_provider_type()

    provider_list = init_provider()

    root_user, docs_user, regular_user, internal_user, kafka_user = init_users()

    init_user_default_scope()


    # init_allowed_admin()

    init_auth(root_user, internal_user)


    init_azs_sync()

    eula = init_eula()

    if os.getenv('FLASK_CONFIG') != 'production':
        organisation = init_organisation()

        # project = init_project(organisation, internal_user)

        quota_package_1, quota_package_2, quota_package_3, quota_package_4 = init_quota_package()

        # init_organisation_project_user_mapping(organisation, project)

        role_permission_group1, role_permission_group2, role_permission_group3, role_permission_group4, role_permission_group5, role_permission_group6 = init_role_permission_group(
            organisation)

        # init_user_role(project, organisation)

        # init_project_provide_mapping(project, provider_list[0])

        init_organisation_quotapackage(quota_package_3, organisation, provider_list[0])

        # init_subscription(organisation.id, project.id, provider_list[0].id, eula.id)





