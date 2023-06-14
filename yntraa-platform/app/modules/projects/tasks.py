from datetime import datetime
import json
import logging
import os
import redis
import types

from flask_restplus_patched._http import HTTPStatus

from .helper import enable_service

from .models import Project, ProjectProviderMapping, ProjectGatewayService
from app.modules.networks.models import Network, Subnet, Router, SecurityGroup, SecurityGroupRule, DefaultAccessPorts, \
    NetworkComputeMapping, ReserveFloatingIP
from app.modules.compute.models import Flavors, Compute, Images, ResourceImageFlavorMapping
from app.modules.providers.models import Provider, ProviderType, ResourceAvailabilityZones
from app.modules.organisations.models import Organisation, OrganisationZoneMapping, Subscription, OrganisationProjectUser
from app.modules.resource_action_logs.models import ResourceActionLog

from app import celery, create_app
from app.extensions import db, Openstack, Docker
from app.modules import calculate_current_utlization_from_resource_action_logs, create_resource_action_log, \
    AlchemyEncoder, send_vpn_fw_permission_email, update_status_action_log, sync_organisation_quota
from app.extensions.api import abort
from app.modules.networks.helper import addDefaultRuleOnObject, removeDefaultRuleFromSG
from config import BaseConfig

log = logging.getLogger(__name__)


# api = Namespace('organisation', description="Projects")

@celery.task
def projectInit_post(organisation_id, provider_id, project_id, user_id, eula_id, retry=0):
    try:
        error_logs = []
        app = create_app(os.getenv('FLASK_CONFIG', 'base'))
        app.app_context().push()

        task_id = celery.current_task.request.id
        redis_obj = redis.Redis(BaseConfig.REDIS_HOST, charset="utf-8", decode_responses=True)
        provider = Provider.query.get(provider_id)
        resource_mapping = ResourceImageFlavorMapping.query.filter_by(provider_id=provider.id,
                                                                      resource_type='gateway'.lower()).one_or_none()
        log.debug(resource_mapping)
        flavors = Flavors.query.get(resource_mapping.flavor_id)
        images = Images.query.get(resource_mapping.image_id)

        is_project_created = False
        with db.session.begin():
            new_project = Project.query.get(project_id)
            resource_data = None
            resource_log = ResourceActionLog.query.filter_by(provider_id=provider.id, project_id=new_project.id,
                                                             organisation_id=new_project.organisation_id).all()
            resource_data = calculate_current_utlization_from_resource_action_logs(new_project.organisation_id, provider.id,
                                                                                   resource_log)

            if resource_data['floatingip']['consumed']['value'] >= resource_data['floatingip']['allocated']['value']:
                log.info("You have consumed more floating_ip than allocated.")
                redis_obj.delete(task_id)
                new_project.action = 'Init_Error'
                new_project.task_id = ''
                db.session.merge(new_project)
                update_status_action_log(status='Fail', ref_task_id=task_id,
                                         error_message="consumed more floating_ip than allocated")
                # sio.emit('set_session', {"message": "Unexpected error, Action is rolling back. Please contact to administrator", "task_id": str(task_id), 'status_code': 422})
                return
            else:
                project_name = new_project.project_id
                project_description = new_project.description
                organisation = Organisation.query.get(organisation_id)
                new_project_provider_mapping = ProjectProviderMapping(provider=provider, project=new_project)
                provider_type = ProviderType.query.get(provider.provider_type_id)
                _provider = globals()[provider_type.name]
                log.debug(f"Providers : {_provider}")
                external_network = _provider.list_networks(provider, True)
                log.debug(f"external_network: {external_network}")
                project_gateway_name = organisation.org_id + "-" + project_name + "-" + provider.provider_id
                project_created = types.SimpleNamespace()
                project_stack_name = project_gateway_name + "_project_stack"

                # get project stack status from provider
                _project = _provider.get_stack_detail(provider, project_stack_name)
                # log.info(_project)
                project_rollback = False
                gateway_rollback = False

                availability_zone = None
                try:
                    resource_availability_zone = OrganisationZoneMapping.query.filter_by(provider_id=provider.id,
                                                                                         organisation_id=organisation_id).first()
                    if resource_availability_zone is not None:
                        zone_details = ResourceAvailabilityZones.query.get(resource_availability_zone.availability_zone_id)
                        if zone_details is not None and zone_details.resource_name.lower() == 'compute':
                            availability_zone = zone_details.zone_name
                except Exception as e:
                    error = 'zone not found'
                    log.info(error)
                    error_logs.append(error)
                    update_status_action_log(status='Fail', ref_task_id=task_id, error_message=json.dumps(error_logs))
                # if stack action is rollback, then delete that stack
                if _project is not None and _project.status == 'ROLLBACK_COMPLETE':
                    project_rollback = True
                    _delete_project_stack = _provider.delete_server_group(provider, _project.id)
                    log.info(_delete_project_stack)

                if _project is not None and _project.status == 'CREATE_COMPLETE':
                    for resources in _project.outputs:
                        try:
                            if resources.output_key == 'tenant_id':
                                project_created.tenant_id = resources.output_value
                                project_created.id = resources.output_value
                            elif resources.output_key == 'network_id':
                                project_created.network_id = resources.output_value
                            elif resources.output_key == 'subnet_id':
                                project_created.subnet_id = resources.output_value
                            elif resources.output_key == 'router_id':
                                project_created.router_id = resources.output_value
                        except:
                            if resources['output_key'] == 'tenant_id':
                                project_created.tenant_id = resources['output_value']
                                project_created.id = resources['output_value']
                            elif resources['output_key'] == 'network_id':
                                project_created.network_id = resources['output_value']
                            elif resources['output_key'] == 'subnet_id':
                                project_created.subnet_id = resources['output_value']
                            elif resources['output_key'] == 'router_id':
                                project_created.router_id = resources['output_value']

                    _sec_groups = _provider.list_security_groups(provider, tenant_id=project_created.id,
                                                                 project_name=project_name)
                    log.info(_sec_groups, "Security Groups")
                    project_created.sec_group_id = _sec_groups[0].id

                    log.info(project_created, "Project Created")
                    project_gateway_stack_name = project_gateway_name + "_gateway_stack"

                    _project_gateway = _provider.get_stack_detail(provider, project_gateway_stack_name,
                                                                  project_name=project_name)
                    log.info(_project_gateway, "Project Gateway")

                    if _project_gateway is not None and _project_gateway.status == 'ROLLBACK_COMPLETE':
                        gateway_rollback = True
                        _delete_project_gateway_stack = _provider.delete_server_group(provider, _project_gateway.id)
                        log.info(_delete_project_gateway_stack)

                    if _project_gateway is not None and _project_gateway.status == 'CREATE_COMPLETE':
                        for gw_resources in _project_gateway.outputs:
                            try:
                                if gw_resources.output_key == 'internal_security_group_id':
                                    project_created.gw_sec_group_id = gw_resources.output_value
                                elif gw_resources.output_key == 'sshgw_vm_id':
                                    project_created.gw_provider_instance_id = gw_resources.output_value
                            except:
                                if gw_resources['output_key'] == 'internal_security_group_id':
                                    project_created.gw_sec_group_id = gw_resources['output_value']
                                elif gw_resources['output_key'] == 'sshgw_vm_id':
                                    project_created.gw_provider_instance_id = gw_resources['output_value']

                        _gw_vm_details = _provider.get_server_by_id(provider, project_created.gw_provider_instance_id,
                                                                    project_name=project_name)

                        if _gw_vm_details is None:
                            error = 'Could not get Gateway VM server details'
                            redis_obj.delete(task_id)
                            new_project.action = 'Init_Error'
                            new_project.task_id = ''
                            db.session.merge(new_project)
                            update_status_action_log(status='Fail', ref_task_id=task_id, error_message=error)
                            return

                        try:
                            project_created.gw_provider_instance_ip = _gw_vm_details.public_v4
                        except:
                            project_created.gw_provider_instance_ip = _gw_vm_details['public_v4']
                        log.info(project_created)

                    if _project_gateway is None or gateway_rollback is True:
                        project_gateway_object = _provider.create_gateway_stack(provider, project_name=project_name,
                                                                                external_network=external_network[0][
                                                                                    'name'],
                                                                                project_gateway_name=project_gateway_name,
                                                                                boot_vol_size=flavors.disk,
                                                                                flavor_name=flavors.provider_flavor_id,
                                                                                image_name=images.provider_image_id,
                                                                                availability_zone=availability_zone)
                        log.info(project_gateway_object)

                        if project_gateway_object:
                            project_created.gw_sec_group_id = project_gateway_object.gw_sec_group_id
                            project_created.gw_provider_instance_id = project_gateway_object.gw_provider_instance_id
                            project_created.gw_provider_instance_ip = project_gateway_object.gw_provider_instance_ip

                # creating project stack after deleting stack which was in action rollback or new stack
                if _project is None or project_rollback is True:
                    log.info("creating project stack")
                    project_created = _provider.create_project(provider, project_name=project_name,
                                                               description=project_description,
                                                               external_network=external_network[0]['name'])
                                                               # project_gateway_name=project_gateway_name,
                                                               # image_name=images.provider_image_id,
                                                               # availability_zone=availability_zone)
                    log.info(project_created, "Project created")

                if project_created is None:
                    redis_obj.delete(task_id)
                    organisation_project_user = OrganisationProjectUser.query.filter_by(organisation_id=organisation_id,
                                                                                        project_id=new_project.id).first()
                    db.session.delete(organisation_project_user)
                    db.session.delete(new_project)
                    update_status_action_log(status='Fail', ref_task_id=task_id,
                                             error_message='Could not create project stack')
                    # sio.emit('set_session', {"message": "Unexpected error, Action is rolling back. Please contact to administrator", "task_id": str(task_id), 'status_code': 422})
                    return

                else:
                    is_project_created = True
                    subscribe = Subscription(user_id=user_id, organisation_id=organisation.id,
                                             provider_id=provider.id, project_id=project_id, eula_id=eula_id)
                    db.session.add(subscribe)
                    # # is_gateway_vm_created = True
                    new_project_provider_mapping.provider_project_id = project_created.id
                    # try:
                    #     # new_project_provider_mapping.gw_device_id = project_created.gw_provider_instance_id
                    #     # new_project_provider_mapping.gw_device_ip = project_created.gw_provider_instance_ip
                    #     # new_project_provider_mapping.action = 'success'
                    # except Exception as e:
                    #     traceback.print_exc()
                    #     error = 'project gateway not created'
                    #     log.info(error)
                    #     error_logs.append(error)
                    #     update_status_action_log(status='Fail', ref_task_id=task_id, error_message=json.dumps(error_logs))
                    #     is_gateway_vm_created = False
                    #     new_project_provider_mapping.gw_device_id = "dummy-device-id"
                    #     new_project_provider_mapping.gw_device_ip = "dummy-device-ip"
                    #     new_project_provider_mapping.action = 'Init_Error'

                    check_project_provider_mapping = ProjectProviderMapping.query.filter_by(
                        provider_project_id=project_created.id).one_or_none()
                    if check_project_provider_mapping is None:
                        db.session.add(new_project_provider_mapping)
                    # else:
                        # try:
                        #     check_project_provider_mapping.gw_device_id = project_created.gw_provider_instance_id
                        #     check_project_provider_mapping.gw_device_ip = project_created.gw_provider_instance_ip
                        #     check_project_provider_mapping.action = 'success'
                        # except:
                        #     check_project_provider_mapping.gw_device_id = "dummy-device-id"
                        #     check_project_provider_mapping.gw_device_ip = "dummy-device-ip"
                        #     check_project_provider_mapping.action = 'Init_Error'
                        # db.session.merge(check_project_provider_mapping)

                    new_project.action = "success"
                    new_project.task_id = ''
                    db.session.merge(new_project)

                    sync_message = sync_organisation_quota(organisation_id, provider_id, project_name)
                    log.info(sync_message)

        if is_project_created:
            check_project_resource = ResourceActionLog.query.filter_by(project_id=project_id, provider_id=provider_id,
                                                                       organisation_id=organisation_id,
                                                                       action='initialized',
                                                                       resource_type='project').first()
            if check_project_resource is None:
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

            check_ext_network = Network.query.filter_by(project_id=project_id, provider_id=provider_id,
                                                        provider_network_id=external_network[0]['id'],
                                                        status='Active').one_or_none()
            if check_ext_network is None:
                with db.session.begin():
                    log.info("external network %s", external_network)
                    _external_network = Network(
                        provider_id=provider.id,
                        project_id=new_project.id,
                        user_id=user_id,
                        external=True,
                        network_name=new_project.project_id + "_" + external_network[0]['name'],
                        provider_network_id=external_network[0]['id'],
                        managed_by='system',
                        status="Active"
                    )
                    db.session.add(_external_network)

                for external_subnets in external_network[0]['subnet']:

                    try:
                        with db.session.begin():
                            log.info("external_subnets %s", external_subnets)
                            _external_network_subnet = Subnet(
                                network_id=_external_network.id,
                                subnet_name=new_project.project_id + "_" + external_subnets['subnet_name'],
                                network_address=external_subnets['subnet_cidr'],
                                gateway_ip=external_subnets['subnet_gateway_ip'],
                                disable_gateway_ip=False,
                                ip_version='IPv4',
                                provider_subnet_id=external_subnets['subnet_id'],
                                project_id=new_project.id,
                                provider_id=provider.id,
                                managed_by='system'
                            )
                            log.info("_external_network_subnet %s", _external_network_subnet)
                            db.session.add(_external_network_subnet)

                    except Exception as e:
                        error = f'External Network Subnet Exception: {str(e)}'
                        log.info(error)
                        error_logs.append(error)
                        update_status_action_log(status='Fail', ref_task_id=task_id, error_message=json.dumps(error_logs))

            new_network = Network.query.filter_by(project_id=project_id, provider_id=provider_id,
                                                  provider_network_id=project_created.network_id,
                                                  status='Active').one_or_none()
            if new_network is None:
                with db.session.begin():
                    new_network = Network(
                        provider_id=provider.id,
                        project_id=new_project.id,
                        user_id=user_id,
                        external=False,
                        network_name=new_project.project_id + '_int_net',
                        provider_network_id=project_created.network_id,
                        managed_by='system',
                        status="Active"
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
                        subnet_name=new_project.project_id + '_int_subnet',
                        network_address='192.168.3.0/24',
                        gateway_ip='192.168.3.1',
                        disable_gateway_ip=False,
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

            # remove default any rules from security group
            try:
                removeDefaultRuleFromSG(provider.id, new_project.id, project_created.sec_group_id, user_id=user_id)
            except:
                error = 'Unable to remove rules which are created by default in project_default'
                log.info(error)
                error_logs.append(error)
                update_status_action_log(status='Fail', ref_task_id=task_id, error_message=json.dumps(error_logs))

            securitygroup = SecurityGroup.query.filter_by(project_id=project_id, provider_id=provider_id,
                                                          provider_security_group_id=project_created.sec_group_id,
                                                          status='Active').one_or_none()
            if securitygroup is None:
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

                try:
                    add_defult_rule_params = {
                        'project_id': new_project.id,
                        'provider_id': provider_id,
                        'resource_type': 'vm',
                        'project_name': project_name,
                        'provider_security_group_id': project_created.sec_group_id,
                        'security_group_id': securitygroup.id,
                        'user_id': user_id
                    }
                    log.info(add_defult_rule_params)
                    addDefaultRuleOnObject(**add_defult_rule_params)

                except Exception as e:
                    error = f'failed to add default rules: {str(e)}'
                    log.info(error)
                    error_logs.append(error)
                    update_status_action_log(status='Fail', ref_task_id=task_id, error_message=json.dumps(error_logs))

            snat_ip = ''
            try:
                provider_router = _provider.get_router(provider, project_name=project_name,
                                                       router_id=project_created.router_id)
                log.info(provider_router)
                snat_ip = provider_router.external_gateway_info['external_fixed_ips'][0]['ip_address']
                log.info("snat_ip ================>>>> %s", snat_ip)
            except Exception as e:
                error = f'router snat ip not found: {str(e)}'
                log.info(error)
                error_logs.append(error)
                update_status_action_log(status='Fail', ref_task_id=task_id, error_message=json.dumps(error_logs))

            check_router = Router.query.filter_by(project_id=project_id, provider_id=provider_id,
                                                  provider_router_id=project_created.router_id).one_or_none()
            if check_router is None:
                with db.session.begin():
                    router = Router(
                        provider_id=provider.id,
                        project_id=new_project.id,
                        user_id=user_id,
                        router_name=new_project.project_id + '_router',
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

            # check_gateway_service = ProjectGatewayService.query.filter_by(project_id=project_id, provider_id=provider_id,
            #                                                               service_name='sshpiper').first()
            # if check_gateway_service is None:
            #     with db.session.begin():
            #         gateway_services = ProjectGatewayService(
            #             provider_id=provider.id,
            #             project_id=new_project.id,
            #             service_protocol='tcp',
            #             service_gw_port=22,
            #             service_destination='0.0.0.0:22',
            #             service_name='sshpiper',
            #             service_status='running',
            #             device_status='running',
            #             managed_by='system'
            #         )
            #         db.session.add(gateway_services)

                # create_resource_action_log(db,
                #                            resource_type='ProjectGatewayService',
                #                            resource_record_id=gateway_services.id,
                #                            action='Created',
                #                            resource_configuration='ProjectGatewayService Created',
                #                            user_id=user_id,
                #                            project_id=project_id,
                #                            organisation_id=organisation_id,
                #                            provider_id=provider_id
                #                            )

            # if is_gateway_vm_created:
            #     try:
            #         gw_vm = _provider.get_server_by_id(provider, project_created.gw_provider_instance_id,
            #                                            project_name=new_project.project_id)
            #         if gw_vm is None:
            #             error = "Could not get Gateway VM server details"
            #             redis_obj.delete(task_id)
            #             new_project.action = 'Init_Error'
            #             new_project.task_id = ''
            #             db.session.merge(new_project)
            #             new_project_provider_mapping.action = 'Init_Error'
            #             db.session.merge(new_project_provider_mapping)
            #             update_status_action_log(status='Fail', ref_task_id=task_id, error_message=error)
            #             return
            #
            #         resource_mapping = ResourceImageFlavorMapping.query.filter_by(provider_id=provider.id,
            #                                                                       resource_type='gateway'.lower()).one_or_none()
            #         flavor = Flavors.query.get(resource_mapping.flavor_id)
            #         image = Images.query.get(resource_mapping.image_id)
            #         log.info("===============gw_vm ====================================")
            #         log.info(gw_vm)
            #         log.info("===============gw_vm ====================================")
            #         filter_args = {}
            #         floating_ip_id = None
            #         floating_ip_list = _provider.list_floating_ips(provider, **filter_args)
            #         for ip in floating_ip_list:
            #             if ip.floating_ip_address == gw_vm.public_v4:
            #                 floating_ip_id = ip.id
            #
            #         check_compute = Compute.query.filter_by(project_id=project_id, provider_id=provider_id,
            #                                                 provider_instance_id=gw_vm.id, status='Active').one_or_none()
            #         if check_compute is None:
            #             compute = Compute(instance_name=gw_vm.name, provider_instance_id=gw_vm.id,
            #                               project_id=new_project.id, provider_id=provider.id, user_id=user_id,
            #                               sec_group_id=securitygroup.id, network_id=new_network.id, action='ACTIVE',
            #                               status='Active', instance_type='gateway_vm', private_ip=gw_vm.private_v4,
            #                               floating_ip=gw_vm.public_v4, flavor_id=flavor.id, image_id=image.id)
            #
            #             with db.session.begin():
            #                 compute.availability_zone = availability_zone
            #                 db.session.add(compute)
            #
            #             create_resource_action_log(db,
            #                                        resource_type='gateway vm',
            #                                        resource_record_id=compute.id,
            #                                        action='created',
            #                                        resource_configuration='Gateway VM Created with Resources : { "vcpu":' + flavor.vcpus + ' , "ram":' + str(
            #                                            int(flavor.ram) / 1024) + ' , "storage":' + flavor.disk + ' , "os":"' + image.os + '_' + image.os_version + '" }',
            #                                        user_id=user_id,
            #                                        project_id=project_id,
            #                                        organisation_id=organisation_id,
            #                                        provider_id=provider_id
            #                                        )
            #
            #             network_compute_mapping = NetworkComputeMapping(network_id=new_network.id, compute_id=compute.id,
            #                                                             project_id=new_project.id, provider_id=provider.id,
            #                                                             server_interface_id=gw_vm.id,
            #                                                             private_ip=gw_vm.private_v4)
            #             with db.session.begin():
            #                 db.session.add(network_compute_mapping)
            #
            #         check_reserve_floating_ip = ReserveFloatingIP.query.filter_by(project_id=project_id,
            #                                                                       provider_id=provider_id,
            #                                                                       organisation_id=organisation_id,
            #                                                                       attached_with_resource='gateway_vm',
            #                                                                       floating_ip=gw_vm.public_v4).one_or_none()
            #         if check_reserve_floating_ip is None:
            #             if check_compute is None:
            #                 with db.session.begin():
            #                     reserve_ip = ReserveFloatingIP(provider_id=provider_id, project_id=project_id,
            #                                                    organisation_id=organisation_id, floating_ip=gw_vm.public_v4,
            #                                                    provider_floating_ip_id=floating_ip_id, imported_by=user_id,
            #                                                    is_available=False,
            #                                                    attached_with_resource=compute.instance_type,
            #                                                    compute_id=compute.id, attached_on=datetime.utcnow())
            #                     db.session.add(reserve_ip)
            #             else:
            #                 with db.session.begin():
            #                     reserve_ip = ReserveFloatingIP(provider_id=provider_id, project_id=project_id,
            #                                                    organisation_id=organisation_id,
            #                                                    floating_ip=check_compute.floating_ip,
            #                                                    provider_floating_ip_id=floating_ip_id, imported_by=user_id,
            #                                                    is_available=False,
            #                                                    attached_with_resource=check_compute.instance_type,
            #                                                    compute_id=check_compute.id,
            #                                                    attached_on=check_compute.created)
            #                     db.session.add(reserve_ip)
            #
            #             create_resource_action_log(db,
            #                                        resource_type='floating_ip',
            #                                        resource_record_id=reserve_ip.id,
            #                                        action='Created',
            #                                        resource_configuration='FloatingIP Created',
            #                                        user_id=user_id,
            #                                        project_id=project_id,
            #                                        organisation_id=organisation_id,
            #                                        provider_id=provider.id,
            #                                        )
            #
            #     except Exception as e:
            #         error = f'{str(e)}'
            #         log.info(error)
            #         error_logs.append(error)
            #         update_status_action_log(status='Fail', ref_task_id=task_id, error_message=json.dumps(error_logs))
            #
            #     try:
            #         removeDefaultRuleFromSG(provider.id, new_project.id, project_created.gw_sec_group_id, user_id=user_id)
            #     except:
            #         error = 'Unable to remove rules which are created by default from gw_sec_group'
            #         log.info(error)
            #         error_logs.append(error)
            #         update_status_action_log(status='Fail', ref_task_id=task_id, error_message=json.dumps(error_logs))
            #
            #     check_gw_security_group = SecurityGroup.query.filter_by(project_id=project_id, provider_id=provider_id,
            #                                                             provider_security_group_id=project_created.gw_sec_group_id,
            #                                                             security_group_name='gw_sec_group',
            #                                                             status='Active').one_or_none()
            #     if check_gw_security_group is None:
            #         with db.session.begin():
            #             gwsecuritygroup = SecurityGroup(
            #                 provider_id=provider.id,
            #                 project_id=new_project.id,
            #                 user_id=user_id,
            #                 security_group_name='gw_sec_group',
            #                 provider_security_group_id=project_created.gw_sec_group_id,
            #                 is_gw_security_group=True,
            #                 is_lb_security_group=False,
            #                 security_group_type='gateway',
            #                 status='Active',
            #                 managed_by='system'
            #             )
            #             db.session.add(gwsecuritygroup)
            #
            #         create_resource_action_log(db,
            #                                    resource_type='SecurityGroup',
            #                                    resource_record_id=gwsecuritygroup.id,
            #                                    action='Created',
            #                                    resource_configuration='Gateway SecurityGroup Created',
            #                                    user_id=user_id,
            #                                    project_id=project_id,
            #                                    organisation_id=organisation_id,
            #                                    provider_id=provider_id
            #                                    )
            #
            #         gw_sec_group = _provider.get_security_group_by_id(provider, project_created.gw_sec_group_id,
            #                                                           project_name=project_name)
            #
            #         for _gw_sec_group_rule in gw_sec_group.security_group_rules:
            #             try:
            #                 with db.session.begin():
            #                     rule_record = SecurityGroupRule(
            #                         security_group_id=gwsecuritygroup.id,
            #                         user_id=user_id,
            #                         port_range_min=_gw_sec_group_rule.port_range_min,
            #                         port_range_max=_gw_sec_group_rule.port_range_max,
            #                         protocol=_gw_sec_group_rule.protocol,
            #                         remote_ip_prefix=_gw_sec_group_rule.remote_ip_prefix,
            #                         direction=_gw_sec_group_rule.direction,
            #                         ethertype=_gw_sec_group_rule.ethertype,
            #                         provider_security_group_rule_id=_gw_sec_group_rule.id,
            #                         status='Active',
            #                         managed_by='system'
            #                     )
            #                     db.session.add(rule_record)
            #             except:
            #                 with db.session.begin():
            #                     rule_record = SecurityGroupRule(
            #                         security_group_id=gwsecuritygroup.id,
            #                         user_id=user_id,
            #                         port_range_min=_gw_sec_group_rule['port_range_min'],
            #                         port_range_max=_gw_sec_group_rule['port_range_max'],
            #                         protocol=_gw_sec_group_rule['protocol'],
            #                         remote_ip_prefix=_gw_sec_group_rule['remote_ip_prefix'],
            #                         direction=_gw_sec_group_rule['direction'],
            #                         ethertype=_gw_sec_group_rule['ethertype'],
            #                         provider_security_group_rule_id=_gw_sec_group_rule['id'],
            #                         status='Active',
            #                         managed_by='system'
            #                     )
            #                     db.session.add(rule_record)
            #             finally:
            #                 with db.session.begin():
            #                     create_resource_action_log(db,
            #                                                resource_type='SecurityGroupRule',
            #                                                resource_record_id=rule_record.id,
            #                                                action='Created',
            #                                                resource_configuration='SecurityGroupRule Created',
            #                                                user_id=user_id,
            #                                                project_id=project_id,
            #                                                organisation_id=organisation_id,
            #                                                provider_id=provider_id,
            #                                                )
            #
            #         try:
            #             add_defult_rule_params = {
            #                 'project_id': new_project.id,
            #                 'provider_id': provider_id,
            #                 'resource_type': 'gateway',
            #                 'project_name': project_name,
            #                 'provider_security_group_id': project_created.gw_sec_group_id,
            #                 'security_group_id': gwsecuritygroup.id,
            #                 'user_id': user_id
            #             }
            #             log.info(add_defult_rule_params)
            #             addDefaultRuleOnObject(**add_defult_rule_params)
            #
            #         except Exception as e:
            #             error = f'failed to add default rules: {str(e)}'
            #             log.info(error)
            #             error_logs.append(error)
            #             update_status_action_log(status='Fail', ref_task_id=task_id, error_message=json.dumps(error_logs))
            #
            #     try:
            #         default_access_port = DefaultAccessPorts.query.filter_by(resource_type='gateway').first()
            #         ports = default_access_port.port
            #         cloud_ref_no = organisation.org_reg_code
            #         destination_ip = new_project_provider_mapping.gw_device_ip
            #         send_vpn_fw_permission_email(cloud_ref_no, provider.provider_location, destination_ip,
            #                                      organisation.org_reg_code_generated_from, ports)
            #     except Exception as e:
            #         error = f'failed to send vpn fw permission email: {str(e)}'
            #         log.info(error)
            #         error_logs.append(error)
            #         update_status_action_log(status='Fail', ref_task_id=task_id, error_message=json.dumps(error_logs))

            project_json = json.dumps(new_project, cls=AlchemyEncoder)
            try:
                message_status = enable_service(provider, new_project, tag_name=project_gateway_name,
                                                project_id=project_created.id, user_id=user_id,
                                                organisation_id=organisation_id,
                                                tenant_id=new_project_provider_mapping.provider_project_id, task_id=task_id)
                log.info(message_status)
            except Exception as e:
                error = f'Exception in enable_service: {str(e)}'
                log.info(error)
                error_logs.append(error)
                update_status_action_log(status='Fail', ref_task_id=task_id, error_message=json.dumps(error_logs))

            sync_message = sync_organisation_quota(organisation_id, provider_id, project_name)
            log.info(f'sync_organisation_quota result: {sync_message}')
            update_status_action_log(status='Success', ref_task_id=task_id)
            redis_obj.delete(task_id)
            # sio.emit('set_session', {"message": project_json, "task_id": str(task_id), 'status_code': 201})

    except Exception as e:
        error = f'Exception in create_project_for_provider: {str(e)}'
        log.info(error)
        error_logs.append(error)

    finally:
        if error_logs:
            task_id = celery.current_task.request.id
            update_status_action_log(status='Fail', ref_task_id=task_id, error_message=json.dumps(error_logs))


### create Project gateway Instance ###
###                                 ###
@celery.task
def createProjectGatewayVM(organisation_id, provider_id, project_id, user_id):
    app = create_app(os.getenv('FLASK_CONFIG', 'base'))
    app.app_context().push()

    task_id = celery.current_task.request.id
    redis_obj = redis.Redis(BaseConfig.REDIS_HOST, charset="utf-8", decode_responses=True)
    provider = Provider.query.get(provider_id)
    resource_mapping = ResourceImageFlavorMapping.query.filter_by(provider_id=provider.id,
                                                                  resource_type='gateway'.lower()).one_or_none()
    flavors = Flavors.query.get(resource_mapping.flavor_id)
    images = Images.query.get(resource_mapping.image_id)
    new_project = Project.query.get(project_id)
    project_name = new_project.project_id
    project_description = new_project.description
    organisation = Organisation.query.get(organisation_id)
    project_provider_mapping = ProjectProviderMapping.query.filter_by(provider_id=provider_id,
                                                                      project_id=project_id).first()
    provider_type = ProviderType.query.get(provider.provider_type_id)
    _provider = globals()[provider_type.name]
    external_network = _provider.list_networks(provider, True)
    project_gateway_name = organisation.org_id + "-" + project_name + "-" + provider.provider_id
    project_gateway_object = types.SimpleNamespace()
    project_gateway_stack_name = project_gateway_name + "_gateway_stack"
    gateway_rollback = False
    _project_gateway = _provider.get_stack_detail(provider, project_gateway_stack_name, project_name=project_name)
    log.info(_project_gateway)

    availability_zone = None
    try:
        resource_availability_zone = OrganisationZoneMapping.query.filter_by(provider_id=provider.id,
                                                                             organisation_id=organisation_id).first()
        if resource_availability_zone is not None:
            zone_details = ResourceAvailabilityZones.query.get(resource_availability_zone.availability_zone_id)
            if zone_details is not None and zone_details.resource_name.lower() == 'compute':
                availability_zone = zone_details.zone_name
    except Exception as e:
        log.info(e)
        log.info('zone not found')

    if _project_gateway is not None and _project_gateway.status == 'ROLLBACK_COMPLETE':
        gateway_rollback = True
        _delete_project_gateway_stack = _provider.delete_server_group(provider, _project_gateway.id)
        log.info(_delete_project_gateway_stack)

    if _project_gateway is not None and _project_gateway.status == 'CREATE_COMPLETE':
        for gw_resources in _project_gateway.outputs:
            try:
                if gw_resources.output_key == 'internal_security_group_id':
                    project_gateway_object.gw_sec_group_id = gw_resources.output_value
                elif gw_resources.output_key == 'sshgw_vm_id':
                    project_gateway_object.gw_provider_instance_id = gw_resources.output_value
            except:
                if gw_resources['output_key'] == 'internal_security_group_id':
                    project_gateway_object.gw_sec_group_id = gw_resources['output_value']
                elif gw_resources['output_key'] == 'sshgw_vm_id':
                    project_gateway_object.gw_provider_instance_id = gw_resources['output_value']

        _gw_vm_details = _provider.get_server_by_id(provider, project_gateway_object.gw_provider_instance_id,
                                                    project_name=project_name)
        if _gw_vm_details is None:
            error = "Could not get Gateway VM server details"
            log.info(error)
            redis_obj.delete(task_id)
            update_status_action_log(status='Fail', ref_task_id=task_id, error_message=error)
            return
        try:
            project_gateway_object.gw_provider_instance_ip = _gw_vm_details.public_v4
        except:
            project_gateway_object.gw_provider_instance_ip = _gw_vm_details['public_v4']
        log.info(project_gateway_object)

    resource_data = None
    resource_log = ResourceActionLog.query.filter_by(provider_id=provider.id, project_id=new_project.id,
                                                     organisation_id=new_project.organisation_id).all()
    resource_data = calculate_current_utlization_from_resource_action_logs(new_project.organisation_id, provider.id,
                                                                           resource_log)

    if resource_data['floatingip']['consumed']['value'] >= resource_data['floatingip']['allocated']['value']:
        error = 'Consumed more floating IP than allocated'
        log.info(error)
        redis_obj.delete(task_id)
        update_status_action_log(status='Fail', ref_task_id=task_id, error_message=error)
        return
    else:
        if _project_gateway is None or gateway_rollback is True:
            project_gateway_object = _provider.create_gateway_stack(provider, project_name=project_name,
                                                                    external_network=external_network[0]['name'],
                                                                    project_gateway_name=project_gateway_name,
                                                                    boot_vol_size=flavors.disk,
                                                                    flavor_name=flavors.provider_flavor_id,
                                                                    image_name=images.provider_image_id,
                                                                    availability_zone=availability_zone)
            log.info(project_gateway_object)

    try:
        if project_gateway_object:
            gw_vm = _provider.get_server_by_id(provider, project_gateway_object.gw_provider_instance_id,
                                               project_name=project_name)
            if gw_vm is None:
                error = "Could not get Gateway VM server details"
                log.info(error)
                redis_obj.delete(task_id)
                update_status_action_log(status='Fail', ref_task_id=task_id, error_message=error)
                return
            log.info("===============gateway_vm===================")
            log.info(gw_vm)

            project_provider_mapping.gw_device_id = project_gateway_object.gw_provider_instance_id
            project_provider_mapping.gw_device_ip = project_gateway_object.gw_provider_instance_ip

            try:
                removeDefaultRuleFromSG(provider.id, new_project.id, project_gateway_object.gw_sec_group_id,
                                        user_id=user_id)
            except:
                log.info('Unable to remove rules which are created by default')

            gwsecuritygroup = SecurityGroup.query.filter_by(project_id=project_id, provider_id=provider_id,
                                                            provider_security_group_id=project_gateway_object.gw_sec_group_id,
                                                            security_group_name='gw_sec_group',
                                                            status='Active').one_or_none()
            if gwsecuritygroup is None:
                with db.session.begin():
                    gwsecuritygroup = SecurityGroup(
                        provider_id=provider.id,
                        project_id=new_project.id,
                        user_id=user_id,
                        security_group_name='gw_sec_group',
                        provider_security_group_id=project_gateway_object.gw_sec_group_id,
                        is_gw_security_group=True,
                        is_lb_security_group=False,
                        security_group_type='gateway',
                        status='Active',
                        managed_by='system'
                    )
                    db.session.add(gwsecuritygroup)

                create_resource_action_log(db,
                                           resource_type='SecurityGroup',
                                           resource_record_id=gwsecuritygroup.id,
                                           action='Created',
                                           resource_configuration='Gateway SecurityGroup Created',
                                           user_id=user_id,
                                           project_id=project_id,
                                           organisation_id=organisation_id,
                                           provider_id=provider_id
                                           )

                gw_sec_group = _provider.get_security_group_by_id(provider, project_gateway_object.gw_sec_group_id,
                                                                  project_name=project_name)
                for _gw_sec_group_rule in gw_sec_group.security_group_rules:
                    try:
                        with db.session.begin():
                            rule_record = SecurityGroupRule(
                                security_group_id=gwsecuritygroup.id,
                                user_id=user_id,
                                port_range_min=_gw_sec_group_rule.port_range_min,
                                port_range_max=_gw_sec_group_rule.port_range_max,
                                protocol=_gw_sec_group_rule.protocol,
                                remote_ip_prefix=_gw_sec_group_rule.remote_ip_prefix,
                                direction=_gw_sec_group_rule.direction,
                                ethertype=_gw_sec_group_rule.ethertype,
                                provider_security_group_rule_id=_gw_sec_group_rule.id,
                                status='Active',
                                managed_by='system'
                            )
                            db.session.add(rule_record)
                    except:
                        with db.session.begin():
                            rule_record = SecurityGroupRule(
                                security_group_id=gwsecuritygroup.id,
                                user_id=user_id,
                                port_range_min=_gw_sec_group_rule['port_range_min'],
                                port_range_max=_gw_sec_group_rule['port_range_max'],
                                protocol=_gw_sec_group_rule['protocol'],
                                remote_ip_prefix=_gw_sec_group_rule['remote_ip_prefix'],
                                direction=_gw_sec_group_rule['direction'],
                                ethertype=_gw_sec_group_rule['ethertype'],
                                provider_security_group_rule_id=_gw_sec_group_rule['id'],
                                status='Active',
                                managed_by='system'
                            )
                            db.session.add(rule_record)
                    finally:
                        with db.session.begin():
                            create_resource_action_log(db,
                                                       resource_type='SecurityGroupRule',
                                                       resource_record_id=rule_record.id,
                                                       action='Created',
                                                       resource_configuration='SecurityGroupRule Created',
                                                       user_id=user_id,
                                                       project_id=project_id,
                                                       organisation_id=organisation_id,
                                                       provider_id=provider_id,
                                                       )

                try:
                    add_defult_rule_params = {
                        'project_id': new_project.id,
                        'provider_id': provider_id,
                        'resource_type': 'gateway',
                        'project_name': project_name,
                        'provider_security_group_id': project_gateway_object.gw_sec_group_id,
                        'security_group_id': gwsecuritygroup.id,
                        'user_id': user_id
                    }
                    log.info(add_defult_rule_params)
                    addDefaultRuleOnObject(**add_defult_rule_params)

                except Exception as e:
                    update_status_action_log(status='Fail', ref_task_id=task_id,
                                             error_message='default rules not added to gw_sec_group')
                    log.info(e)
            try:
                project_int_net = f'{new_project.project_id}_int_net'
                new_network = Network.query.filter_by(provider_id=provider.id, project_id=new_project.id,
                                                      network_name=project_int_net).first()
                if new_network is None:
                    new_network = Network.query.filter_by(provider_id=provider.id, project_id=new_project.id,
                                                          network_name=new_project.name + '_int_net').first()

                filter_args = {}
                floating_ip_id = None
                floating_ip_list = _provider.list_floating_ips(provider, **filter_args)
                for ip in floating_ip_list:
                    if ip.floating_ip_address == gw_vm.public_v4:
                        floating_ip_id = ip.id

                check_compute = Compute.query.filter_by(project_id=project_id, provider_id=provider_id,
                                                        provider_instance_id=gw_vm.id, status='Active').one_or_none()
                if check_compute is None:
                    compute = Compute(instance_name=gw_vm.name, provider_instance_id=gw_vm.id,
                                      project_id=new_project.id, provider_id=provider.id, user_id=user_id,
                                      sec_group_id=gwsecuritygroup.id, network_id=new_network.id, action='ACTIVE',
                                      status='Active', instance_type='gateway_vm', private_ip=gw_vm.private_v4,
                                      floating_ip=gw_vm.public_v4, flavor_id=flavors.id, image_id=images.id)
                    with db.session.begin():
                        compute.availability_zone = availability_zone
                        db.session.add(compute)

                    create_resource_action_log(db,
                                               resource_type='gateway vm',
                                               resource_record_id=compute.id,
                                               action='created',
                                               resource_configuration='Gateway VM Created with Resources : { "vcpu":' + flavors.vcpus + ' , "ram":' + str(
                                                   int(flavors.ram) / 1024) + ' , "storage":' + flavors.disk + ' , "os":"' + images.os + '_' + images.os_version + '" }',
                                               user_id=user_id,
                                               project_id=project_id,
                                               organisation_id=organisation_id,
                                               provider_id=provider_id
                                               )

                    network_compute_mapping = NetworkComputeMapping(network_id=new_network.id, compute_id=compute.id,
                                                                    project_id=new_project.id, provider_id=provider.id,
                                                                    server_interface_id=gw_vm.id,
                                                                    private_ip=gw_vm.private_v4)
                    with db.session.begin():
                        db.session.add(network_compute_mapping)

                check_reserve_floating_ip = ReserveFloatingIP.query.filter_by(project_id=project_id,
                                                                              provider_id=provider_id,
                                                                              organisation_id=organisation_id,
                                                                              attached_with_resource='gateway_vm',
                                                                              floating_ip=gw_vm.public_v4).one_or_none()
                if check_reserve_floating_ip is None:
                    if check_compute is None:
                        with db.session.begin():
                            reserve_ip = ReserveFloatingIP(provider_id=provider_id, project_id=project_id,
                                                           organisation_id=organisation_id, floating_ip=gw_vm.public_v4,
                                                           provider_floating_ip_id=floating_ip_id, imported_by=user_id,
                                                           is_available=False,
                                                           attached_with_resource=compute.instance_type,
                                                           compute_id=compute.id, attached_on=datetime.utcnow())
                            db.session.add(reserve_ip)
                    else:
                        with db.session.begin():
                            reserve_ip = ReserveFloatingIP(provider_id=provider_id, project_id=project_id,
                                                           organisation_id=organisation_id,
                                                           floating_ip=check_compute.floating_ip,
                                                           provider_floating_ip_id=floating_ip_id, imported_by=user_id,
                                                           is_available=False,
                                                           attached_with_resource=check_compute.instance_type,
                                                           compute_id=check_compute.id,
                                                           attached_on=check_compute.created)
                            db.session.add(reserve_ip)

                    create_resource_action_log(db,
                                               resource_type='floating_ip',
                                               resource_record_id=reserve_ip.id,
                                               action='Created',
                                               resource_configuration='FloatingIP Created',
                                               user_id=user_id,
                                               project_id=project_id,
                                               organisation_id=organisation_id,
                                               provider_id=provider.id,
                                               )
            except Exception as e:
                update_status_action_log(status='Fail', ref_task_id=task_id, error_message=str(e))
                log.info(e)
            try:
                default_access_port = DefaultAccessPorts.query.filter_by(resource_type='gateway').first()
                ports = default_access_port.port
                cloud_ref_no = organisation.org_reg_code
                destination_ip = project_gateway_object.gw_provider_instance_ip
             # send_vpn_fw_permission_email(cloud_ref_no, provider.provider_location, destination_ip,organisation.org_reg_code_generated_from, ports)
            except Exception as e:
                update_status_action_log(status='Fail', ref_task_id=task_id,
                                         error_message='failed to send vp fw permission email')
                log.info(e)

            with db.session.begin():
                project_provider_mapping.action = 'success'
                db.session.merge(project_provider_mapping)
            update_status_action_log(status='Success', ref_task_id=task_id)
            redis_obj.delete(task_id)

        else:
            update_status_action_log(status='Fail', ref_task_id=task_id,
                                     error_message='project gateway object not found')
            redis_obj.delete(task_id)

    except Exception as e:
        log.info(e)
        update_status_action_log(status='Fail', ref_task_id=task_id, error_message=str(e))
        redis_obj.delete(task_id)


@celery.task
def ProjectGatewayServceByID_get(project_id, provider_id):
    app = create_app(os.getenv('FLASK_CONFIG', 'base'))
    app.app_context().push()
    task_id = celery.current_task.request.id

    try:
        # project = Project.query.get(project_id)
        _gateway = ProjectProviderMapping.query.filter_by(project_id=project_id, provider_id=provider_id).first_or_404()
        _gateway_services = ProjectGatewayService.query.filter_by(project_id=project_id, provider_id=provider_id).all()
        docker_provider = types.SimpleNamespace()
        docker_provider.auth_url = "tcp://" + _gateway.gw_device_ip + ":5000"
        for i, _gateway_service in enumerate(_gateway_services):
            _service = Docker.get_server(docker_provider, _gateway_service.service_name)
            _gateway_service.service_status = _service.status
            _gateway_service.device_status = _service.status
            _gateway_services[i] = _gateway_service

        # sio.emit('set_session', {"message": json.dumps(_gateway_services)})
    except Exception as e:
        log.info("Exception: %s", e)
        abort(
            code=HTTPStatus.UNPROCESSABLE_ENTITY,
            message="%s" % e
        )
