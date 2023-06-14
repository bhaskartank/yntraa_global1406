# encoding: utf-8
# pylint: disable=no-self-use
"""
OpenStack provider setup.
"""
import traceback
from datetime import datetime, timedelta
import functools
import logging
import tempfile

import openstack
import openstack.cloud
import types
from shade import *
from novaclient import client
from heatclient import client as heat_client
from retrying import retry
from flask_login import current_user
from flask_restplus_patched import Resource
from flask_restplus_patched._http import HTTPStatus
from app.extensions.api import Namespace, abort
from config import BaseConfig
import sqlalchemy
import os
import time
from app.extensions import api, db

import requests, ssl, json
from requests.auth import HTTPBasicAuth
import json

log = logging.getLogger(__name__)
openstack.enable_logging()


def create_named_tempfile(data):
    file = tempfile.NamedTemporaryFile()
    with open(file.name, 'w') as f:
        f.write(data)
    return file


class OpenStackProvider(object):
    def __init__(self, app=None):
        if app:
            self.init_app(app)

    def init_app(self, app):
        self.headers = {
            'Content-Type': "application/json",
            'Cache-Control': "no-cache"
        }
        return self

    def connect(self, provider):
        if provider.identity_api_version == 3:
            conn = openstack.connect(
                auth_url=provider.auth_url,
                project_name=provider.project_name,
                username=provider.username,
                password=provider.password,
                region_name=provider.region_name,
                app_name='api',
                app_version='1.0',
                verify=False,
                identity_api_version=provider.identity_api_version,
                user_domain_name=provider.user_domain_id,
                project_domain_id=provider.user_domain_id,
            )
        elif provider.identity_api_version == 2:
            conn = openstack.connect(
                auth_url=provider.auth_url,
                tenant_name=provider.project_name,
                username=provider.username,
                password=provider.password,
                region_name=provider.region_name,
                app_name='api',
                app_version='1.0',
                verify=False,
                identity_api_version=provider.identity_api_version,
            )
        log.info("returning connection")
        return conn

    def create_provider(self, provider):
        try:
            conn = self.connect(provider)
            new_provider = {}
            _images = []
            images = conn.list_images()
            # log.info("images list %s :",images)
            for image in images:
                # log.info("image in image list %s :",image)
                if image.visibility == 'public':
                    name = ''
                    size = 0
                    minRam = 0
                    minDisk = 0
                    os = ''
                    os_version = ''
                    os_architecture = ''
                    cost = 0
                    if 'name' in image:
                        name = image.name
                    if 'size' in image:
                        size = image.size
                    if 'minRam' in image:
                        minRam = image.minRam
                    if 'minDisk' in image:
                        minDisk = image.minDisk
                    if 'os' in image:
                        os = image.os
                    if 'os_version' in image:
                        os_version = image.os_version
                    if 'os_architecture' in image:
                        os_architecture = image.os_architecture
                    if 'cost' in image:
                        cost = image.cost
                    temp = {
                        'id': image.id,
                        'name': name,
                        'size': size,
                        'min_ram': minRam,
                        'min_disk': minDisk,
                        'os': os,
                        'os_version': os_version,
                        'os_architecture': os_architecture,
                        'cost': cost
                    }
                    _images.append(temp)
            new_provider['images'] = _images
            _flavors = []
            flavors = conn.list_flavors()
            flavor_name_weight_value = {"Small-I": 100, "Small-II": 200,
                                        "Small-III": 300, "Small-IV": 400,
                                        "Small-V": 500, "Medium-I": 600,
                                        "Medium-II": 700, "Medium-III": 800,
                                        "Medium-IV": 900, "Medium-V": 1000,
                                        "Medium-VI": 1100, "Large-I": 1200,
                                        "Large-II": 1300, "Large-III": 1400,
                                        "Large-IV": 1500, "Large-V": 1600,
                                        "Large-VI": 1700, "Large-VII": 1800,
                                        "gateway-flavor": 750}
            for flavor in flavors:
                weight_value = 0
                if 'weight' in flavor:
                    weight_value = flavor.weight
                elif flavor.name in flavor_name_weight_value:
                    weight_value = flavor_name_weight_value[flavor.name]

                cost_value = 0
                if 'cost' in flavor:
                    cost_value = flavor.cost

                _flavor = {
                    'id': flavor.id,
                    'name': flavor.name,
                    'ram': flavor.ram,
                    'vcpus': flavor.vcpus,
                    'disk': flavor.disk,
                    'weight': weight_value,
                    'cost': cost_value,
                }
                _flavors.append(_flavor)
            new_provider['flavors'] = _flavors
            return new_provider
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def create_flavor(self, provider, **kwargs):
        conn = self.connect(provider)
        flavor = conn.create_flavor(kwargs['name'], kwargs['ram'],
                                    kwargs['vcpus'], kwargs['disk'],
                                    flavorid='auto', ephemeral=0, swap=0,
                                    rxtx_factor=1.0, is_public=True)
        log.info(flavor)
        return flavor

    def delete_flavor(self, provider, name_or_id):
        conn = self.connect(provider)
        deleted_falvor = conn.delete_flavor(name_or_id)
        log.info(deleted_falvor)
        return deleted_falvor

    def get_flavors(self, provider):
        conn = self.connect(provider)
        _flavors = []
        flavors = conn.list_flavors()
        flavor_name_weight_value = {"Small-I": 100, "Small-II": 200,
                                    "Small-III": 300, "Small-IV": 400,
                                    "Small-V": 500,
                                    "Medium-I": 600, "Medium-II": 700,
                                    "Medium-III": 800, "Medium-IV": 900,
                                    "Medium-V": 1000, "Medium-VI": 1100,
                                    "Large-I": 1200, "Large-II": 1300,
                                    "Large-III": 1400, "Large-IV": 1500,
                                    "Large-V": 1600, "Large-VI": 1700,
                                    "Large-VII": 1800, "gateway-flavor": 750}
        for flavor in flavors:
            weight_value = 0
            if 'weight' in flavor:
                weight_value = flavor.weight
            elif flavor.name in flavor_name_weight_value:
                weight_value = flavor_name_weight_value[flavor.name]

            cost_value = 0
            if 'cost' in flavor:
                cost_value = flavor.cost

            _flavor = {
                'id': flavor.id,
                'name': flavor.name,
                'ram': flavor.ram,
                'vcpus': flavor.vcpus,
                'disk': flavor.disk,
                'weight': weight_value,
                'cost': cost_value,
            }
            _flavors.append(_flavor)

        return _flavors

    def create_server(self, provider, **kwargs):
        try:
            log.info("Creating Server for Project ID: %s",
                     kwargs['project_name'])
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            server_meta = {"Image ID": kwargs['image'],
                           "Image Name": kwargs['image_name']}

            if 'userdata' in kwargs:
                log.info(kwargs.get('userdata'))

            if 'availability_zone' in kwargs:
                _instance = conn.create_server(wait=True, auto_ip=False,
                                               name=kwargs['name'],
                                               image=kwargs['image'],
                                               flavor=kwargs['flavor'],
                                               network=kwargs['network'],
                                               userdata=kwargs['userdata'],
                                               boot_from_volume=kwargs[
                                                   'boot_from_volume'],
                                               volume_size=kwargs[
                                                   'volume_size'],
                                               timeout=3600,
                                               terminate_volume=True,
                                               meta=server_meta,
                                               security_groups=kwargs[
                                                   'security_groups'],
                                               availability_zone=kwargs[
                                                   'availability_zone']
                                               )
            else:
                _instance = conn.create_server(wait=True, auto_ip=False,
                                               name=kwargs['name'],
                                               image=kwargs['image'],
                                               flavor=kwargs['flavor'],
                                               network=kwargs['network'],
                                               userdata=kwargs['userdata'],
                                               boot_from_volume=kwargs[
                                                   'boot_from_volume'],
                                               volume_size=kwargs[
                                                   'volume_size'],
                                               timeout=3600,
                                               terminate_volume=True,
                                               meta=server_meta,
                                               security_groups=kwargs[
                                                   'security_groups']
                                               )

            return _instance
        except Exception as e:
            traceback.print_exc()
            raise ConnectionError(f'Server Create Exception: {e}')
            # log.info("Server Create Exception: %s", e)
            # return e
            # abort(
            #     code=HTTPStatus.UNPROCESSABLE_ENTITY,
            #     message="%s" % e
            # )

    def update_server(self, provider, **kwargs):
        # try:
        # log.info("Creating Server for Project ID: %s", kwargs['project_name'])
        conn = self.connect(provider)
        if 'project_name' in kwargs:
            conn = conn.connect_as_project(kwargs['project_name'])
        _instance = conn.update_server(
            kwargs['server_id'],
            networks=kwargs['network'],
            timeout=3600,
        )
        return _instance


    def list_servers(self, provider, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            if 'filters' in kwargs:
                return conn.list_servers(detailed=False, all_projects=False,
                                         bare=False, filters=kwargs['filters'])
            else:
                return conn.list_servers(detailed=False, all_projects=False,
                                         bare=False, filters=None)
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def get_server(self, provider, name_or_id, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.get_server(name_or_id)
        except Exception as e:
            log.info("Exception: %s", e)
            get_current_status = kwargs.get('get_current_status')
            if get_current_status:
                raise ConnectionError(str(e))
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def get_server_by_id(self, provider, server_id, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.get_server_by_id(server_id)
        except Exception as e:
            log.info("Exception: %s", e)
            return None

    def delete_server(self, provider, name_or_id, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.delete_server(name_or_id, wait=True, timeout=3600,
                                      delete_ips=True, delete_ip_retry=5)
        except Exception as e:
            raise ConnectionError(f'Openstack delete server Exception: {e}')

    def get_secret(self, provider, secret, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.key_manager.get_secret(secret)
        except Exception as e:
            log.info("Exception: %s", e)
            raise ConnectionError(e)

    def list_secrets(self, provider, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.key_manager.secrets(**kwargs)
        except Exception as e:
            log.info("Exception: %s", e)
            raise ConnectionError(e)

    def create_secret(self, provider, payload, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            _secret = conn.key_manager.create_secret(
                payload=payload,
                payload_content_type=kwargs.get('payload_content_type', 'text/plain'),
                payload_content_encoding=kwargs.get('payload_content_encoding'),
                name=kwargs.get('secret_name'),
                expiration=kwargs.get('expiration'),
                algorithm=kwargs.get('algorithm'),
                secret_type=kwargs.get('secret_type'),
                bit_length=kwargs.get('bit_length'),
                mode=kwargs.get('mode'),
            )
            return _secret
        except Exception as e:
            log.info("Exception: %s", e)
            raise ConnectionError(f"Secret Create Exception: {e}")

    def delete_secret(self, provider, secret_uuid, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.key_manager.delete_secret(secret_uuid)
        except Exception as e:
            log.info("Exception: %s", e)
            raise ConnectionError(f"Secret Delete Exception: {e}")

    def create_lb_octavia(self, provider, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            vip_network_id = kwargs.pop('vip_network_id', None)
            vip_port_id = kwargs.pop('vip_port_id', None)
            vip_subnet_id = kwargs.pop('vip_subnet_id', None)
            if not (vip_network_id or vip_port_id or vip_subnet_id):
                abort(
                    code=HTTPStatus.BAD_REQUEST,
                    message="Virtual IP must contain one of: vip_port_id, vip_network_id, vip_subnet_id"
                )

            _load_balancer = conn.load_balancer.create_load_balancer(
                name=kwargs.pop('name', None),
                admin_state_up=kwargs.pop('admin_state_up', True),
                description=kwargs.pop('description', None),
                vip_network_id=vip_network_id,
                vip_port_id=vip_port_id,
                vip_subnet_id=vip_subnet_id,
                listeners=kwargs.pop('listeners', []),
                pools=kwargs.pop('pools', []),
                **kwargs
            )
            return _load_balancer
        except Exception as e:
            log.info("Exception: %s", e)
            raise ConnectionError(f"Load Balancer Create Exception: {e}")

    def delete_lb_octavia(self, provider, load_balancer_uuid, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.load_balancer.delete_load_balancer(load_balancer_uuid, ignore_missing=False, cascade=True)
        except Exception as e:
            log.info("Exception: %s", e)
            raise ConnectionError(f"Load Balancer Delete Exception: {e}")

    def update_lb_octavia(self, provider, load_balancer_id, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])

            _load_balancer = conn.load_balancer.update_load_balancer(
                load_balancer=load_balancer_id,
                **kwargs
            )
            for _ in range(10):
                time.sleep(3)
                lb_info = self.get_lb_octavia(provider, load_balancer_id, **kwargs)
                if lb_info.provisioning_status == 'ACTIVE':
                    break
                elif lb_info.provisioning_status == 'ERROR':
                    raise Exception(f'Load Balancer Update Exception: {lb_info}')
            return _load_balancer
        except Exception as e:
            log.info("Exception: %s", e)
            raise ConnectionError(f"Load Balancer Update Exception: {e}")

    def get_lb_octavia(self, provider, load_balancer_id, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.load_balancer.get_load_balancer(load_balancer_id)
        except Exception as e:
            log.info("Exception: %s", e)
            raise ConnectionError(f"Load Balancer Get Exception: {e}")

    def create_listener(self, provider, load_balancer_id, protocol, protocol_port, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            _listener = conn.load_balancer.create_listener(
                load_balancer_id=load_balancer_id,
                protocol=protocol,
                protocol_port=protocol_port,
                name=kwargs.pop('name', None),
                description=kwargs.pop('description', None),
                tags=kwargs.pop('tags', []),
                admin_state_up=kwargs.pop('admin_state_up', True),
                **kwargs
            )
            return _listener
        except Exception as e:
            log.info("Exception: %s", e)
            raise ConnectionError(f"Listener Create Exception: {e}")

    def delete_listener(self, provider, listener_uuid, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.load_balancer.delete_listener(listener_uuid)
        except Exception as e:
            log.info("Exception: %s", e)
            raise ConnectionError(f"Listener Delete Exception: {e}")

    def update_listener(self, provider, listener_id, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            _listener = conn.load_balancer.update_listener(
                listener=listener_id,
                **kwargs
            )
            for _ in range(10):
                time.sleep(3)
                lb_info = self.get_listener(provider, listener_id, **kwargs)
                if lb_info.provisioning_status == 'ACTIVE':
                    break
                elif lb_info.provisioning_status == 'ERROR':
                    raise Exception(f'Listener Update Exception: {lb_info}')
            return _listener
        except Exception as e:
            log.info("Exception: %s", e)
            raise ConnectionError(f"Listener Update Exception: {e}")

    def get_listener(self, provider, listener_id, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.load_balancer.get_listener(listener=listener_id)
        except Exception as e:
            log.info("Exception: %s", e)
            raise ConnectionError(f"Listener Get Exception: {e}")

    def create_pool(self, provider, lb_algorithm, protocol, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            listener_id = kwargs.pop('listener_id', None)
            loadbalancer_id = kwargs.pop('loadbalancer_id', None)
            if not (listener_id or loadbalancer_id):
                abort(
                    code=HTTPStatus.BAD_REQUEST,
                    message="Either listener_id or loadbalancer_id must be specified."
                )
            _pool = conn.load_balancer.create_pool(
                lb_algorithm=lb_algorithm,
                protocol=protocol,
                listener_id=listener_id,
                loadbalancer_id=loadbalancer_id,
                name=kwargs.pop('name', None),
                description=kwargs.pop('description', None),
                tags=kwargs.pop('tags', []),
                admin_state_up=kwargs.pop('admin_state_up', True),
                **kwargs
            )
            return _pool
        except Exception as e:
            log.info("Exception: %s", e)
            raise ConnectionError(f"Pool Create Exception: {e}")

    def delete_pool(self, provider, pool_uuid, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.load_balancer.delete_pool(pool_uuid)
        except Exception as e:
            log.info("Exception: %s", e)
            raise ConnectionError(f"Pool Delete Exception: {e}")

    def update_pool(self, provider, pool_id, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])

            _pool = conn.load_balancer.update_pool(pool=pool_id, **kwargs)

            for _ in range(10):
                time.sleep(3)
                lb_info = self.get_pool(provider, pool_id, **kwargs)
                if lb_info.provisioning_status == 'ACTIVE':
                    break
                elif lb_info.provisioning_status == 'ERROR':
                    raise Exception(f'Pool Update Exception: {lb_info}')
            return _pool
        except Exception as e:
            log.info("Exception: %s", e)
            raise ConnectionError(f"Pool Update Exception: {e}")

    def get_pool(self, provider, pool_id, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.load_balancer.get_pool(pool_id)
        except Exception as e:
            log.info("Exception: %s", e)
            raise ConnectionError(f"Pool Get Exception: {e}")

    def create_pool_member(self, provider, pool_id, address, protocol_port, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])

            _member = conn.load_balancer.create_member(
                pool=pool_id,
                address=address,
                protocol_port=protocol_port,
                name=kwargs.get('name', None),
                tags=kwargs.get('tags', []),
                admin_state_up=kwargs.get('admin_state_up', True),
                backup=kwargs.get('backup', False),
                monitor_address=kwargs.get('monitor_address'),
                monitor_port=kwargs.get('monitor_port'),
                subnet_id=kwargs.get('subnet_id'),
                weight=kwargs.get('weight', 1)
            )
            return _member
        except Exception as e:
            log.info("Exception: %s", e)
            raise ConnectionError(f"Pool Member Create Exception: {e}")

    def delete_pool_member(self, provider, member_uuid, pool_uuid, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.load_balancer.delete_member(
                member=member_uuid,
                pool=pool_uuid
            )
        except Exception as e:
            log.info("Exception: %s", e)
            raise ConnectionError(f"Pool Member Delete Exception: {e}")

    def get_pool_member(self, provider, member_id, pool_id, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.load_balancer.get_member(member=member_id, pool=pool_id)
        except Exception as e:
            log.info("Exception: %s", e)
            raise ConnectionError(f"Pool Member Get Exception: {e}")

    def create_health_monitor(self, provider, delay, max_retries, pool_id, timeout, type, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            _health_monitor = conn.load_balancer.create_health_monitor(
                delay=delay,
                max_retries=max_retries,
                pool_id=pool_id,
                timeout=timeout,
                type=type,
                name=kwargs.get('name', None),
                tags=kwargs.get('tags', []),
                domain_name=kwargs.get('domain_name', None),
                admin_state_up=kwargs.get('admin_state_up', True),
                expected_codes=kwargs.get('expected_codes', '200'),
                http_method=kwargs.get('http_method', 'GET'),
                http_version=kwargs.get('http_version', 1.0),
                max_retries_down=kwargs.get('max_retries_down', 3),
                url_path=kwargs.get('url_path', '/')
            )
            return _health_monitor
        except Exception as e:
            log.info("Exception: %s", e)
            raise ConnectionError(f"Health Monitor Create Exception: {e}")

    def delete_health_monitor(self, provider, health_monitor_uuid, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.load_balancer.delete_health_monitor(health_monitor_uuid)
        except Exception as e:
            log.info("Exception: %s", e)
            raise ConnectionError(f"Health Monitor Delete Exception: {e}")

    def update_health_monitor(self, provider, healthmonitor_id, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            _health_monitor = conn.load_balancer.update_health_monitor(
                healthmonitor=healthmonitor_id,
                **kwargs
            )
            for _ in range(10):
                time.sleep(3)
                lb_info = self.get_health_monitor(provider, healthmonitor_id, **kwargs)
                if lb_info.provisioning_status == 'ACTIVE':
                    break
                elif lb_info.provisioning_status == 'ERROR':
                    raise Exception(f'Health Monitor Update Exception: {lb_info}')
            return _health_monitor
        except Exception as e:
            log.info("Exception: %s", e)
            raise ConnectionError(f"Health Monitor Update Exception: {e}")

    def get_health_monitor(self, provider, healthmonitor_id, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.load_balancer.get_health_monitor(healthmonitor=healthmonitor_id)
        except Exception as e:
            log.info("Exception: %s", e)
            raise ConnectionError(f"Health Monitor Get Exception: {e}")


    def server_rebuild(self, provider, server_id, server_name, admin_password,
                       **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
                resp = conn.compute.rebuild_server(server_id, server_name,
                                                   admin_password)
                log.info(resp)
                return resp
        except Exception as e:
            log.info(e)
            return e
    # change_server_password(server, new_password)
    def change_server_admin_password(self, provider, server_id, new_password,
                                     **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
                resp = conn.compute.change_server_password(server_id,
                                                           new_password)
                log.info(resp)
                return resp
        except Exception as e:
            log.info(e)
            return e

    def server_action(self, provider, name_or_id, action, **kwargs):
        try:
            conn = self.connect(provider)
            _e_status = 'ACTIVE'
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            if action == 'reboot':
                conn.compute.reboot_server(name_or_id, 'SOFT')
                _e_status = 'ACTIVE'
            elif action == 'hard_reboot':
                conn.compute.reboot_server(name_or_id, 'HARD')
                _e_status = 'ACTIVE'
            elif action == 'pause':
                conn.compute.pause_server(name_or_id)
                _e_status = 'PAUSED'
            elif action == 'unpause':
                conn.compute.unpause_server(name_or_id)
                _e_status = 'ACTIVE'
            elif action == 'rebuild':
                conn.compute.rebuild_server(name_or_id)
                _e_status = 'ACTIVE'
            elif action == 'start':
                conn.compute.start_server(name_or_id)
                _e_status = 'ACTIVE'
            elif action == 'stop':
                conn.compute.stop_server(name_or_id)
                _e_status = 'SHUTOFF'
            elif action == 'resize_server':
                _e_status = 'ACTIVE'
                conn.compute.resize_server(name_or_id,
                                           kwargs['provider_flavor_id'])
            elif action == 'confirm_server_resize':
                conn.compute.confirm_server_resize(name_or_id)
                _e_status = 'ACTIVE'
            elif action == 'revert_server_resize':
                conn.compute.revert_server_resize(name_or_id)
                _e_status = 'ACTIVE'
            elif action == 'status':
                _e_status = 'STATUS'
                log.info('action to carry out: %s', action)
            else:
                abort(
                    code=HTTPStatus.NOT_FOUND,
                    message="Action does not exist"
                )
            return _e_status
        except Exception as e:
            log.info("Openstack Exception: %s", e)
            raise ConnectionError(e)
        finally:
            if action == 'resize_server':
                return _e_status

    def get_server_console(self, provider, name_or_id, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.get_server_console(name_or_id, kwargs['length'])
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def get_server_console_url(self, provider, name_or_id, **kwargs):
        try:
            if provider.identity_api_version == 3:
                conn = client.Client(2, provider.username, provider.password,
                                     kwargs['project_name'], provider.auth_url,
                                     user_domain_id=provider.user_domain_id)
            else:
                conn = client.Client(2, provider.username, provider.password,
                                     kwargs['project_name'], provider.auth_url)
            server = conn.servers.get(name_or_id)
            if 'console_type' in kwargs:
                console_type = kwargs['console_type']
            else:
                console_type = 'novnc'
            server_console = server.get_console_url(console_type)
            return server_console['console']['url']
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def list_images(self, provider, **kwargs):
        try:
            conn = self.connect(provider)
            return conn.list_images()
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )


    def list_projects(self, provider, **kwargs):
        try:
            conn = self.connect(provider)
            return conn.list_projects()
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def list_zones(self, provider, **kwargs):
        try:
            conn = self.connect(provider)
            _zones = []
            if kwargs['resource_name'].lower() == 'compute':
                zone_details = conn.compute.availability_zones(details=True)
                for zone in zone_details:
                    _zone = {
                        'name': zone.name,
                        'state': zone.state,
                        'hosts': zone.hosts,
                    }
                    _zones.append(_zone)
            elif kwargs['resource_name'].lower() == 'network':
                zone_details = conn.network.availability_zones()
                for zone in zone_details:
                    _zone = {
                        'name': zone.name,
                        'state': zone.state,
                        'resource': zone.resource,
                    }
                    _zones.append(_zone)

            return _zones
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def list_flavors(self, provider, **kwargs):
        try:
            conn = self.connect(provider)
            return conn.list_flavors()
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def create_image_snapshot(self, provider, name, server, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.create_image_snapshot(name, server, wait=True,
                                              timeout=3600)
        except Exception as e:
            raise ConnectionError(f'Openstack Connection Exception: {e}')
            # log.info("Exception: %s", e)
            # abort(
            #     code=HTTPStatus.UNPROCESSABLE_ENTITY,
            #     message="%s" % e
            # )

    def get_image_by_id(self, provider, name_or_id, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            image_details = conn.get_image(name_or_id)
            return image_details
        except Exception as e:
            log.info("Exception: %s", e)
            if 'raise_exception' in kwargs and kwargs['raise_exception']:
                raise ConnectionError(f'{str(e)}')
            else:
                abort(
                    code=HTTPStatus.UNPROCESSABLE_ENTITY,
                    message="%s" % e
                )

    def delete_image(self, provider, name, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
                image_details = conn.get_image(name)
                # try:
                #     block_device_mapping = json.loads(image_details.block_device_mapping)
                #     log.info(block_device_mapping)
                #     for volume_snapshot in block_device_mapping:
                #         log.info("----------------------")
                #         log.info(volume_snapshot)
                #         log.info("volume_snapshot_id = %s", volume_snapshot['snapshot_id'])
                #         delete_volume_snapshot = conn.delete_volume_snapshot(volume_snapshot['snapshot_id'], wait=False, timeout=3600)
                #         log.info("delete_volume_snapshot %s", delete_volume_snapshot)
                # except Exception as e:
                #     log.info("except")
                #     log.info(e)
            return conn.delete_image(name, wait=False, timeout=3600,
                                     delete_objects=True)
        except Exception as e:
            raise ConnectionError(f'Openstack Connection Exception: {e}')
            # log.info("Exception: %s", e)
            # abort(
            #     code=HTTPStatus.UNPROCESSABLE_ENTITY,
            #     message="%s" % e
            # )

    def delete_snapshot(self, provider, name, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.delete_volume_snapshot(name, wait=False, timeout=3600)
        except Exception as e:
            log.info("Exception: %s", e)
            raise ConnectionError(f'Openstack Exception: {e}')

    def list_networks(self, provider, external=False, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            _networks = []
            networks = conn.list_networks({'router:external': external})
            for network in networks:
                _network = {}
                _network['id'] = network.id
                log.debug("Network: %s", network.id)
                _network['name'] = network.name
                _network['status'] = network.status
                _network['external'] = network['router:external']
                _subnet_networks = []
                for network_subnet in network.subnet_ids:
                    _network_subnet = {}
                    subnet = conn.get_subnet(network_subnet)
                    _network_subnet['subnet_id'] = subnet.id
                    _network_subnet['subnet_name'] = subnet.name
                    _network_subnet['subnet_cidr'] = subnet.cidr
                    _network_subnet['subnet_gateway_ip'] = subnet.gateway_ip
                    _network_subnet['subnet_ip_version'] = subnet.ip_version
                    _subnet_networks.append(_network_subnet)
                _network['subnet'] = _subnet_networks
                _networks.append(_network)
            return _networks
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def search_ports(self, provider, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.search_ports(
                name_or_id=None,
                filters=kwargs['filters']
            )
        except Exception as e:
            raise ConnectionError(
                f'Exception in Openstack Search Ports API: {str(e)}')

    # remove_router_interface(router, subnet_id=None, port_id=None)
    def remove_interface_from_router(self, provider, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.remove_router_interface(
                router=kwargs['router'],
                subnet_id=kwargs['subnet_id'],
                port_id=None
            )
        except Exception as e:
            raise ConnectionError(
                f'Exception in Openstack Remove Router Interface API: {str(e)}')

    def create_network(self, provider, name, project_id, external=False,
                       **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.create_network(name, external=external,
                                       project_id=project_id)
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def delete_network(self, provider, name, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
                network = conn.search_networks(name)
                log.info(network)
                if len(network) < 1:
                    return True
                ports = conn.search_ports(filters={'network_id': network[0].id})
                for port in ports:
                    log.info(port)
                    try:
                        resps = conn.remove_router_interface(kwargs['router'],
                                                             port.id)
                        log.info(resps)
                    except Exception as e:
                        log.info(e)
                    try:
                        resp = conn.delete_port(port.id)
                        log.info(resp)
                    except Exception as e:
                        log.info(e)
                for example_subnet in network[0].subnets:
                    subnet = conn.search_subnets(example_subnet)
                    log.info(subnet[0])
                    try:
                        conn.remove_router_interface(kwargs['router'],
                                                     subnet[0].id)
                    except Exception as e:
                        log.info(e)
                    try:
                        conn.network.delete_subnet(example_subnet,
                                                   ignore_missing=False)
                    except Exception as e:
                        log.info(e)
                resp = conn.network.delete_network(name, ignore_missing=False)
                log.info(resp)
                return resp
            # return conn.delete_network(name)
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def get_subnet_by_id(self, provider, id, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.get_subnet_by_id(id)
        except Exception as e:
            raise ConnectionError(f'Openstack Exception: {str(e)}')

    def create_subnet(self, provider, **kwargs):
        result = types.SimpleNamespace()

        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.create_subnet(kwargs['network_name_or_id'],
                                      cidr=kwargs['cidr'],
                                      ip_version=kwargs['ip_version'],
                                      enable_dhcp=kwargs['enable_dhcp'],
                                      subnet_name=kwargs['subnet_name'],
                                      tenant_id=kwargs['tenant_id'],
                                      allocation_pools=None,
                                      gateway_ip=None,
                                      disable_gateway_ip=kwargs[
                                          'disable_gateway_ip'],
                                      dns_nameservers=kwargs['dns_nameservers'],
                                      host_routes=None,
                                      ipv6_ra_mode=None,
                                      ipv6_address_mode=None,
                                      use_default_subnetpool=False)
        except Exception as e:
            result.error = str(e)
            return e
            # abort(
            #     code=HTTPStatus.UNPROCESSABLE_ENTITY,
            #     message="%s" % e
            # )

    def update_subnet(self, provider, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.update_subnet(kwargs['provider_subnet_id'],
                                      enable_dhcp=kwargs['enable_dhcp'],
                                      gateway_ip=kwargs['gateway_ip'],
                                      disable_gateway_ip=kwargs[
                                          'disable_gateway_ip'],
                                      allocation_pools=kwargs[
                                          'allocation_pools'],
                                      dns_nameservers=kwargs['dns_nameservers'],
                                      host_routes=None
                                      )
        except Exception as e:
            raise ConnectionError(
                f'Exception in Openstack Update Subnet API: {str(e)}')

    def delete_subnet(self, provider, name, **kwargs):
        result = types.SimpleNamespace()
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            try:
                conn.remove_router_interface(kwargs['router'], name)
            except Exception as e:
                log.info(e)
            resp = conn.delete_subnet(name)
            result.error = "success"
            result.msg = resp
            log.info(result)
            log.info("------- success above--------------")
            return result
        except Exception as e:
            log.info("vfffrferferfer")
            log.info("Exception: %s", e)
            result.error = "error"
            result.msg = str(e)
            log.info(result)
            return result
            # abort(
            #     code=HTTPStatus.UNPROCESSABLE_ENTITY,
            #     message="%s" % e
            # )

    def create_router(self, provider, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.create_router(name=kwargs['name'],
                                      admin_state_up=True,
                                      ext_gateway_net_id=None,
                                      enable_snat=None,
                                      ext_fixed_ips=None,
                                      project_id=kwargs['project_id'],
                                      availability_zone_hints=None
                                      )
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def delete_router(self, provider, name, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.delete_router(name)
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def create_security_group(self, provider, **kwargs):
        result = types.SimpleNamespace()
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.create_security_group(kwargs['name'],
                                              description=kwargs['description'],
                                              project_id=kwargs['project_id'])
        except Exception as e:
            log.info("Exception: %s", e)
            result.error = str(e)
            return result
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def delete_security_group(self, provider, name, **kwargs):
        result = types.SimpleNamespace()
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.delete_security_group(name)
        except Exception as e:
            log.info("Exception: %s", e)
            result.error = str(e)
            return result
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def get_security_group_by_id(self, provider, name, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.get_security_group_by_id(name)
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def get_security_group(self, provider, name, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.get_security_group(name, filters={
                "tenant_id": kwargs['tenant_id']})
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def create_security_group_rule(self, provider, **kwargs):
        log.info(provider)
        result = types.SimpleNamespace()
        if 'description' in kwargs:
            description = kwargs['description']
        else:
            description = ' '

        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            if kwargs['port_range_min']:
                return conn.network.create_security_group_rule(
                    security_group_id=kwargs['secgroup_name_or_id'],
                    port_range_min=kwargs['port_range_min'],
                    port_range_max=kwargs['port_range_max'],
                    protocol=kwargs['protocol'],
                    remote_ip_prefix=kwargs['remote_ip_prefix'],
                    remote_group_id=kwargs['remote_group_id'],
                    direction=kwargs['direction'],
                    ethertype=kwargs['ethertype'],
                    project_id=kwargs['project_id'],
                    description=description
                )
            else:
                return conn.network.create_security_group_rule(
                    security_group_id=kwargs['secgroup_name_or_id'],
                    protocol=kwargs['protocol'],
                    remote_ip_prefix=kwargs['remote_ip_prefix'],
                    remote_group_id=kwargs['remote_group_id'],
                    direction=kwargs['direction'],
                    ethertype=kwargs['ethertype'],
                    project_id=kwargs['project_id'],
                    description=description
                )

        except Exception as e:
            log.info("Security Group Rule Exception: %s", e)
            result.error = str(e)
            return result
            # return None
            # abort(
            #     code=HTTPStatus.UNPROCESSABLE_ENTITY,
            #     message="%s" % e
            # )

    def delete_security_group_rule(self, provider, security_group_rule_id,
                                   **kwargs):
        result = types.SimpleNamespace()
        try:
            conn = self.connect(provider)

            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])

                # security_group_rule = conn.get_security_group_by_id(security_group_rule_id)
                # log.info(security_group_rule)
                # if security_group_rule is None:
                #     return True
            log.info(security_group_rule_id)
            resp = conn.delete_security_group_rule(security_group_rule_id)
            log.info(resp)
            return resp

        except Exception as e:
            log.info("Exception: %s", e)
            result.error = str(e)
            return result
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def find_security_group_rule(self, provider, security_group_rule_id,
                                 **kwargs):
        result = types.SimpleNamespace()
        try:
            conn = self.connect(provider)

            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            log.info(security_group_rule_id)
            resp = conn.find_security_group_rule(security_group_rule_id)
            log.info(resp)
            return resp

        except Exception as e:
            log.info("Exception: %s", e)
            result.error = str(e)
            return result
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def create_project_stack(self, provider, **kwargs):
        conn = self.connect(provider)
        parameters = {
            "tenant_name": kwargs['project_name'],
            "tenant_net_name": kwargs['project_name'] + "_int_net",
            "public_net_name": kwargs['external_network'],
            "tenant_router_name": kwargs['project_name'] + "_router",
            "tenant_description": kwargs['description'],
            "tenant_user": provider.username
        }

        stack_name = kwargs['project_name'] + '_project_stack'
        template_path = os.path.abspath(
            os.path.join(os.path.dirname(__file__), 'templates/openstack',
                         "create_project.yaml"))
        _project = conn.create_stack(stack_name, tags=None,
                                     template_file=template_path,
                                     template_url=None, template_object=None,
                                     files=None, rollback=True, wait=True,
                                     timeout=3600, environment_files=None,
                                     **parameters)
        log.info(_project)

        def retry_if_result_none(result):

            """Return True if we should retry (in this case when result is None), False otherwise"""
            return result is None

        @retry(wait_fixed=10000, stop_max_delay=200000
            , retry_on_result=retry_if_result_none)
        def check_project_status(stack_name):
            _project = conn.get_stack(stack_name, filters=None,
                                      resolve_outputs=True)
            log.info(_project)
            if _project.action == 'ROLLBACK':
                return None
            if _project.status == 'IN_PROGRESS':
                return check_project_status(stack_name)

            new_project = types.SimpleNamespace()
            log.info(_project.outputs)
            for resources in _project.outputs:
                log.info(resources)
                try:

                    if resources.output_key == 'tenant_id':
                        new_project.tenant_id = resources.output_value
                        new_project.id = resources.output_value
                    elif resources.output_key == 'network_id':
                        new_project.network_id = resources.output_value
                    elif resources.output_key == 'subnet_id':
                        new_project.subnet_id = resources.output_value
                    elif resources.output_key == 'router_id':
                        new_project.router_id = resources.output_value
                except:

                    if resources['output_key'] == 'tenant_id':
                        new_project.tenant_id = resources['output_value']
                        new_project.id = resources['output_value']
                    elif resources['output_key'] == 'network_id':
                        new_project.network_id = resources['output_value']
                    elif resources['output_key'] == 'subnet_id':
                        new_project.subnet_id = resources['output_value']
                    elif resources['output_key'] == 'router_id':
                        new_project.router_id = resources['output_value']

            new_conn = conn.connect_as_project(kwargs['project_name'])
            _sec_groups = new_conn.list_security_groups(
                filters={"tenant_id": new_project.id, "name": "default"})
            log.info(_sec_groups)
            for _sec_group_rule in _sec_groups[0].security_group_rules:
                new_conn.delete_security_group_rule(_sec_group_rule['id'])
            new_project.sec_group_id = _sec_groups[0].id
            # CreateInternal SSH security Group Rule
            internal_ssh_rule_id = new_conn.create_security_group_rule(
                new_project.sec_group_id,
                port_range_min=22,
                port_range_max=22,
                protocol="tcp",
                remote_ip_prefix="192.168.3.0/24",
                project_id=new_project.id
            )
            internal_av_firewall_rule_id = new_conn.create_security_group_rule(
                new_project.sec_group_id,
                port_range_min=BaseConfig.INGRESS_SECG_AV_PORT.value,
                port_range_max=BaseConfig.INGRESS_SECG_AV_PORT.value,
                protocol="tcp",
                remote_ip_prefix="0.0.0.0/0",
                project_id=new_project.id
            )
            internal_monitoring_firewall_rule_id = new_conn.create_security_group_rule(
                new_project.sec_group_id,
                port_range_min=BaseConfig.INGRESS_SECG_MONITORING_PORT.value,
                port_range_max=BaseConfig.INGRESS_SECG_MONITORING_PORT.value,
                protocol="tcp",
                remote_ip_prefix="0.0.0.0/0",
                project_id=new_project.id
            )
            internal_egress_rule_id = new_conn.create_security_group_rule(
                new_project.sec_group_id,
                port_range_min=1,
                port_range_max=65535,
                protocol="tcp",
                direction="egress",
                remote_ip_prefix="0.0.0.0/0",
                project_id=new_project.id
            )
            new_project.internal_ssh_rule_id = internal_ssh_rule_id
            log.info(new_project)
            return new_project

        return check_project_status(stack_name)

    def create_gateway_stack(self, provider, **kwargs):
        conn = self.connect(provider)
        stack_name = 'vtrwt-aeja2j-squs_project_stack'
        _project = conn.get_stack(stack_name, filters=None,
                                  resolve_outputs=True)

        new_conn = conn.connect_as_project(kwargs['project_name'])

        new_gateway = types.SimpleNamespace()
        gw_parameters = {
            "sshgw_vm_name": kwargs['project_getway_name'] + "_gateway_vm",
            "internal_network_id": kwargs['project_name'] + "_int_net",
            "public_net_name": kwargs['external_network'],
            "docker_registry": provider.docker_registry,
            "boot_vol_size": kwargs['boot_vol_size'],
            "image_name": kwargs['image_name'],
            "flavor_name": kwargs['flavor_name']

        }
        if 'availability_zone' in kwargs and kwargs[
            'availability_zone'] is not None:
            gw_parameters['availability_zone'] = kwargs['availability_zone']

        stackname = kwargs['project_getway_name'] + '_gateway_stack'

        gw_template_path = os.path.abspath(
            os.path.join(os.path.dirname(__file__), 'templates/openstack',
                         "create_project_gw.yaml"))
        _gw_vm = new_conn.create_stack(stackname, tags=None,
                                       template_file=gw_template_path,
                                       template_url=None, template_object=None,
                                       files=None, rollback=True, wait=True,
                                       timeout=3600, environment_files=None,
                                       **gw_parameters)

        def retry_if_result_in_progress(result):
            return result is None

        @retry(wait_fixed=1000, stop_max_delay=10000
            , retry_on_result=retry_if_result_in_progress)
        def get_gw_stack(stackname):
            # new_conn = conn.connect_as_project(kwargs['project_name'])
            new_conn = conn.connect_as_project(kwargs['project_name'])
            log.info("inside gw function")
            _gw_project = new_conn.get_stack(stackname, filters=None,
                                             resolve_outputs=True)
            log.info(_gw_project)
            if _gw_project.status == 'IN_PROGRESS':
                _gw_project = None
                return get_gw_stack(stackname)
            if _gw_project.action == 'ROLLBACK':
                return None
            log.info(_gw_project.outputs)
            for gw_resources in _gw_project.outputs:
                try:

                    if gw_resources.output_key == 'internal_security_group_id':
                        new_gateway.gw_sec_group_id = gw_resources.output_value
                    elif gw_resources.output_key == 'sshgw_vm_id':
                        log.info(gw_resources.output_value)
                        new_gateway.gw_provider_instance_id = gw_resources.output_value
                except:
                    if gw_resources[
                        'output_key'] == 'internal_security_group_id':
                        new_gateway.gw_sec_group_id = gw_resources[
                            'output_value']
                    elif gw_resources['output_key'] == 'sshgw_vm_id':
                        log.info(gw_resources['output_value'])
                        new_gateway.gw_provider_instance_id = gw_resources[
                            'output_value']

            _gw_vm_details = new_conn.get_server_by_id(
                new_gateway.gw_provider_instance_id)
            try:
                new_gateway.gw_provider_instance_ip = _gw_vm_details.public_v4
            except:
                new_gateway.gw_provider_instance_ip = _gw_vm_details[
                    'public_v4']
            log.info(new_gateway)
            return new_gateway

        return get_gw_stack(stackname)

    def get_stack_detail(self, provider, stack_name, **kwargs):

        conn = self.connect(provider)
        if 'project_name' in kwargs:
            conn = conn.connect_as_project(kwargs['project_name'])
        # new_conn = conn.connect_as_project(kwargs['project_name'])
        _project = conn.get_stack(stack_name, filters=None,
                                  resolve_outputs=True)

        return _project

    def create_project(self, provider, **kwargs):

        try:
            conn = self.connect(provider)
            parameters = {
                "tenant_name": kwargs['project_name'],
                "tenant_net_name": kwargs['project_name'] + "_int_net",
                "public_net_name": kwargs['external_network'],
                "tenant_router_name": kwargs['project_name'] + "_router",
                "tenant_description": kwargs['description'],
                "tenant_user": provider.username
            }
            stack_name = kwargs['project_name'] + '_project_stack'
            template_path = os.path.abspath(
                os.path.join(os.path.dirname(__file__), 'templates/openstack', "create_project.yaml"))
            _project = conn.create_stack(stack_name, tags=None, template_file=template_path, template_url=None,
                                         template_object=None, files=None, rollback=True, wait=True, timeout=3600,
                                         environment_files=None, **parameters)

            def retry_if_result_none(result):

                """Return True if we should retry (in this case when result is None), False otherwise"""
                return result is None

            @retry(wait_fixed=1000, stop_max_delay=10000
                , retry_on_result=retry_if_result_none)
            def check_project_status(stack_name):
                _project = conn.get_stack(stack_name, filters=None, resolve_outputs=True)
                log.info(_project, "This is the project stack status")
                if _project.status == 'IN_PROGRESS':
                    return check_project_status(stack_name)

                if _project.status == 'ROLLBACK_COMPLETE':
                    return None
                new_project = types.SimpleNamespace()
                for resources in _project.outputs:

                    try:

                        if resources.output_key == 'tenant_id':
                            new_project.tenant_id = resources.output_value
                            new_project.id = resources.output_value
                        elif resources.output_key == 'network_id':
                            new_project.network_id = resources.output_value
                        elif resources.output_key == 'subnet_id':
                            new_project.subnet_id = resources.output_value
                        elif resources.output_key == 'router_id':
                            new_project.router_id = resources.output_value
                    except:

                        if resources['output_key'] == 'tenant_id':
                            new_project.tenant_id = resources['output_value']
                            new_project.id = resources['output_value']
                        elif resources['output_key'] == 'network_id':
                            new_project.network_id = resources['output_value']
                        elif resources['output_key'] == 'subnet_id':
                            new_project.subnet_id = resources['output_value']
                        elif resources['output_key'] == 'router_id':
                            new_project.router_id = resources['output_value']

                log.info(new_project)
                if new_project.id != '' and new_project.id is not None and new_project.network_id is not None:
                    log.info("project created")

                    try:
                        new_conn = conn.connect_as_project(kwargs['project_name'])
                        _sec_groups = new_conn.list_security_groups(
                            filters={"tenant_id": new_project.id, "name": "default"})

                        for _sec_group_rule in _sec_groups[0].security_group_rules:
                            new_conn.delete_security_group_rule(_sec_group_rule['id'])
                        new_project.sec_group_id = _sec_groups[0].id
                        #
                        #     gw_parameters = {
                        #         "sshgw_vm_name": kwargs['project_gateway_name'] + "_gateway_vm",
                        #         "internal_network_id": kwargs['project_name'] + "_int_net",
                        #         "public_net_name": kwargs['external_network'],
                        #         "docker_registry": provider.docker_registry,
                        #         "boot_vol_size": kwargs['boot_vol_size'],
                        #         "flavor_name": kwargs['flavor_name'],
                        #         "image_name": kwargs['image_name']
                        #     }
                        #     if 'availability_zone' in kwargs and kwargs['availability_zone'] is not None:
                        #         gw_parameters['availability_zone'] = kwargs['availability_zone']
                        #
                        #     log.info(gw_parameters, "this is gw parameters")
                        #     stackname = kwargs['project_gateway_name'] + '_gateway_stack'
                        #     gw_template_path = os.path.abspath(
                        #         os.path.join(os.path.dirname(__file__), 'templates/openstack', "create_project_gw.yaml"))
                        #     _gw_vm = new_conn.create_stack(stackname, tags=None, template_file=gw_template_path,
                        #                                    template_url=None, template_object=None, files=None,
                        #                                    rollback=True, wait=True, timeout=3600, environment_files=None,
                        #                                    **gw_parameters)
                        #
                        #     def retry_if_result_in_progress(result):
                        #         return result is None
                        #
                        #     @retry(wait_fixed=1000, stop_max_delay=5000
                        #         , retry_on_result=retry_if_result_in_progress)
                        #     def get_gw_stack(stackname):
                        #         # new_conn = conn.connect_as_project(kwargs['project_name'])
                        #         # new_conn = conn.connect_as_project(kwargs['project_name'])
                        #         log.info("inside gw function")
                        #         _gw_project = new_conn.get_stack(stackname, filters=None, resolve_outputs=True)
                        #         log.info(_gw_project)
                        #         if _gw_project.status == 'IN_PROGRESS':
                        #             _gw_project = None
                        #             return get_gw_stack(stackname)
                        #         if _gw_project.status == 'ROLLBACK_COMPLETE':
                        #             return None
                        #         log.info(_gw_project.outputs)
                        #         for gw_resources in _gw_project.outputs:
                        #             try:
                        #
                        #                 if gw_resources.output_key == 'internal_security_group_id':
                        #                     new_project.gw_sec_group_id = gw_resources.output_value
                        #                 elif gw_resources.output_key == 'sshgw_vm_id':
                        #                     log.info(gw_resources.output_value)
                        #                     new_project.gw_provider_instance_id = gw_resources.output_value
                        #             except:
                        #                 if gw_resources['output_key'] == 'internal_security_group_id':
                        #                     new_project.gw_sec_group_id = gw_resources['output_value']
                        #                 elif gw_resources['output_key'] == 'sshgw_vm_id':
                        #                     log.info(gw_resources['output_value'])
                        #                     new_project.gw_provider_instance_id = gw_resources['output_value']
                        #
                        #         _gw_vm_details = new_conn.get_server_by_id(new_project.gw_provider_instance_id)
                        #         try:
                        #             new_project.gw_provider_instance_ip = _gw_vm_details.public_v4
                        #         except:
                        #             new_project.gw_provider_instance_ip = _gw_vm_details['public_v4']
                        #         log.info(new_project)
                        return new_project
                    #
                    #     return get_gw_stack(stackname)
                    except Exception as e:
                        log.info(e)
                    #     log.info("executeOn")
                    #     _sec_groups = new_conn.list_security_groups(
                    #         filters={"tenant_id": new_project.id, "name": "default"})
                    #     log.info(_sec_groups)
                    #     for _sec_group_rule in _sec_groups[0].security_group_rules:
                    #         new_conn.delete_security_group_rule(_sec_group_rule['id'])
                    #     new_project.sec_group_id = _sec_groups[0].id
                    #     return new_project
                    # return get_gw_stack(stackname)
                else:
                    return None

            return check_project_status(stack_name)
        except Exception as e:
            log.info("Exception: %s", e)
            return None
            # abort(
            #     code=HTTPStatus.UNPROCESSABLE_ENTITY,
            #     message="%s" % e
            # )

    def create_volume(self, provider, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.create_volume(kwargs['volume_size'],
                                      wait=True,
                                      timeout=None,
                                      bootable=kwargs['bootable'],
                                      name=kwargs['name'],
                                      volume_type=kwargs['volume_type'])
        except Exception as e:
            raise ConnectionError(f'Openstack Create Volume Exception: {e}')
            # log.info("Exception: %s", e)
            # abort(
            #     code=HTTPStatus.UNPROCESSABLE_ENTITY,
            #     message="%s" % e
            # )

    def get_volume(self, provider, volume_id, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.get_volume(volume_id, filters=None)
        except Exception as e:
            log.info("Exception: %s", e)
            return None
            # abort(
            #     code=HTTPStatus.UNPROCESSABLE_ENTITY,
            #     message="%s" % e
            # )

    def get_list_volumes(self, provider, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.block_storage.volumes(details=True)
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def get_volume_attachments(self, provider, server_id, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.compute.volume_attachments(server_id)
        except Exception as e:
            log.info("Exception: %s", e)
            return []
            # abort(
            #     code=HTTPStatus.UNPROCESSABLE_ENTITY,
            #     message="%s" % e
            # )

    def delete_volume(self, provider, volume_id, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.delete_volume(volume_id)
        except Exception as e:
            raise ConnectionError(f'Openstack Delete Volume Exception: {e}')
            # log.info("Exception: %s", e)
            # return e
            # abort(
            #     code=HTTPStatus.UNPROCESSABLE_ENTITY,
            #     message="%s" % e
            # )

    def set_volume_metadata(self, provider, volume_id, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn.connect_as_project(kwargs['project_name'])
            return conn.block_storage.set_volume_metadata(volume=volume_id,
                                                          **kwargs['metadata'])
        except Exception as e:
            log.info("Set Volume Metadata Exception: %s", e)
            raise ConnectionError(f"Set Volume Metadata Exception: {e}")

    def get_volume_metadata(self, provider, volume_id, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn.connect_as_project(kwargs['project_name'])
            return conn.block_storage.get_volume_metadata(volume=volume_id)
        except Exception as e:
            log.info("Get Volume Metadata Exception: %s", e)
            raise ConnectionError(f"Get Volume Metadata Exception: {e}")

    def delete_volume_metadata(self, provider, volume_id, keys=None, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn.connect_as_project(kwargs['project_name'])
            return conn.block_storage.delete_volume_metadata(volume=volume_id,
                                                             keys=keys)
        except Exception as e:
            log.info("Delete Volume Metadata Exception: %s", e)
            raise ConnectionError(f"Delete Volume Metadata Exception: {e}")

    def list_volume_snapshots(self, provider, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.list_volume_snapshots(detailed=kwargs['detailed'],
                                              search_opts=kwargs['search_opts'])
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def create_volume_snapshot(self, provider, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.create_volume_snapshot(kwargs['provider_volume_id'],
                                               force=False, wait=True,
                                               timeout=None)
        except Exception as e:
            error_info = f"create_volume_snapshot exception: {str(e)}"
            log.info(error_info)
            raise ConnectionError(error_info)

    def get_volume_snapshot_by_id(self, provider, volume_id, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.get_volume_snapshot_by_id(volume_id)
        except Exception as e:
            error = {'msg': str(e), 'code': e.status_code}
            raise ConnectionError(json.dumps(error))

    def delete_volume_snapshot(self, provider, volume_id, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.delete_volume_snapshot(volume_id, wait=False,
                                               timeout=3600)
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def set_volume_snapshot_metadata(self, provider, snapshot_id, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn.connect_as_project(kwargs['project_name'])
            return conn.block_storage.set_snapshot_metadata(
                snapshot=snapshot_id, **kwargs['metadata'])
        except Exception as e:
            log.info("Set Snapshot Metadata Exception: %s", e)
            raise ConnectionError(f"Set Snapshot Metadata Exception: {e}")

    def get_volume_snapshot_metadata(self, provider, snapshot_id, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn.connect_as_project(kwargs['project_name'])
            return conn.block_storage.get_snapshot_metadata(
                snapshot=snapshot_id)
        except Exception as e:
            log.info("Get Snapshot Metadata Exception: %s", e)
            raise ConnectionError(f"Get Snapshot Metadata Exception: {e}")

    def delete_volume_snapshot_metadata(self, provider, snapshot_id, keys=None,
                                        **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn.connect_as_project(kwargs['project_name'])
            return conn.block_storage.delete_snapshot_metadata(
                snapshot=snapshot_id, keys=keys)
        except Exception as e:
            log.info("Delete Snapshot Metadata Exception: %s", e)
            raise ConnectionError(f"Delete Snapshot Metadata Exception: {e}")

    def attach_volume(self, provider, **kwargs):
        result = types.SimpleNamespace()
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.attach_volume(kwargs['server'], kwargs['volume'],
                                      device=kwargs['device'],
                                      wait=True,
                                      timeout=3600)
        except Exception as e:
            log.info("Exception: %s", e)
            result.error = str(e)
            return result

    def detach_volume(self, provider, **kwargs):
        result = types.SimpleNamespace()
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.detach_volume(kwargs['server'], kwargs['volume'],
                                      wait=True,
                                      timeout=3600)
        except Exception as e:
            log.info("Exception: %s", e)
            result.error = str(e)
            return result
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def networkList(self, provider, **kwargs):
        conn = self.connect(provider)
        if 'project_name' in kwargs:
            conn = conn.connect_as_project(kwargs['project_name'])
        return conn.network.networks()

    def get_limits(self, provider, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.compute.get_limits()
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def create_load_balancer(self, provider, **kwargs):
        new_lb = types.SimpleNamespace()
        try:
            conn = self.connect(provider)
            new_conn = conn.connect_as_project(kwargs['project_name'])
            if kwargs['image_name'] is None:
                stack_parameters = {
                    "internal_network_id": kwargs['project_name'] + "_int_net",
                    # "public_net_name" : kwargs['external_network'],
                    "sec_group_name": kwargs['lb_name'] + "_sec_group",
                    # "docker_registry" : provider.docker_registry,
                    "lb_vm_name": kwargs['lb_name'] + "_lb_vm",
                    "flavor_name": kwargs['flavor_name']
                }
            else:
                stack_parameters = {
                    "internal_network_id": kwargs['project_name'] + "_int_net",
                    # "public_net_name" : kwargs['external_network'],
                    "sec_group_name": kwargs['lb_name'] + "_sec_group",
                    # "docker_registry" : provider.docker_registry,
                    "lb_vm_name": kwargs['lb_name'] + "_lb_vm",
                    "image_name": kwargs['image_name'],
                    "flavor_name": kwargs['flavor_name']
                }
            if 'availability_zone' in kwargs:
                stack_parameters['availability_zone'] = kwargs[
                    'availability_zone']

            lb_version = kwargs.get('lb_version', 'v2')
            log.info(f'Creating LB with version: {lb_version}')

            init_file_name = "Caddyfile_v3"
            lb_template_name = "create_project_lb.yaml"
            stack_parameters["lb_env_conf"] = kwargs.get("caddy_params", "")
            stack_parameters["boot_vol_size"] = kwargs.get("disk_size", "70")
            log.info(stack_parameters)

            # NOTE: Check lb_version to select appropriate template. Defaults to v3 template.
            _LB_VERSIONS_FOR_MANUAL_PROVISING_ = ["v1", "v2"]
            if lb_version in _LB_VERSIONS_FOR_MANUAL_PROVISING_:
                init_file_name = "Caddyfile_v2"
                # lb_parameters["lb_config_path"] = "/var/lib/caddy/Caddyfile"

            init_file_path = os.path.abspath(
                os.path.join(os.path.dirname(__file__), 'templates/openstack',
                             init_file_name))
            init_file_cotent = ""
            with open(init_file_path) as init_file:
                init_file_cotent = init_file.read()

            stack_parameters["lb_init_conf"] = init_file_cotent
            stack_parameters["lb_version"] = lb_version

            log.info(f"Creating LB with init file as {init_file_path}")
            log.info(f'Creating LB using template : {lb_template_name}')

            lb_template_path = os.path.abspath(
                os.path.join(os.path.dirname(__file__), 'templates/openstack',
                             lb_template_name))
            _lb_vm = new_conn.create_stack(kwargs['lb_name'] + "_lb_stack",
                                           tags=None,
                                           template_file=lb_template_path,
                                           template_url=None,
                                           template_object=None, files=None,
                                           rollback=True, wait=True,
                                           timeout=3600, environment_files=None,
                                           **stack_parameters)

            stackname = kwargs['lb_name'] + "_lb_stack"

            def retry_if_result_in_progress(result):
                return result is None

            @retry(wait_fixed=1000, stop_max_delay=5000
                , retry_on_result=retry_if_result_in_progress)
            def get_lb_stack(stackname):
                _lb_vm = new_conn.get_stack(stackname, filters=None,
                                            resolve_outputs=True)
                log.info(_lb_vm)
                if _lb_vm is None:
                    new_lb.status = "error"
                    new_lb.msg = "Loadbalancer stack not found on provider."
                    return new_lb
                if _lb_vm.status == 'IN_PROGRESS':
                    _lb_vm = None
                    return get_lb_stack(stackname)
                if _lb_vm.action == 'ROLLBACK':
                    new_lb.status = "rollback"
                    new_lb.msg = "Loadbalancer stack ROLLBACK on provider."
                    new_lb.stack_id = _lb_vm['id'] if isinstance(_lb_vm,
                                                                 dict) else _lb_vm.id
                    new_lb.rollback_reason = _lb_vm[
                        'status_reason'] if isinstance(_lb_vm,
                                                       dict) else _lb_vm.status_reason
                    return new_lb

                new_lb.status = "success"
                new_lb.stack_id = _lb_vm['id'] if isinstance(_lb_vm,
                                                             dict) else _lb_vm.id
                try:

                    for lb_resources in _lb_vm.outputs:

                        if lb_resources.output_key == 'internal_security_group_id':
                            new_lb.lb_sec_group_id = lb_resources.output_value
                        elif lb_resources.output_key == 'lb_vm_id':
                            new_lb.lb_provider_instance_id = lb_resources.output_value
                    # return new_lb
                except:

                    for lb_resources in _lb_vm['outputs']:
                        if lb_resources[
                            'output_key'] == 'internal_security_group_id':
                            new_lb.lb_sec_group_id = lb_resources[
                                'output_value']
                        elif lb_resources['output_key'] == 'lb_vm_id':
                            new_lb.lb_provider_instance_id = lb_resources[
                                'output_value']
                    # return new_lb

                _lb_vm_details = new_conn.get_server_by_id(
                    new_lb.lb_provider_instance_id)
                new_lb.lb_provider_instance_ip = _lb_vm_details.public_v4

                return new_lb

            return get_lb_stack(stackname)

        except Exception as e:
            log.info("Exception: %s", e)
            new_lb.status = "error"
            new_lb.msg = str(e)
            return new_lb
            # abort(
            #     code=HTTPStatus.UNPROCESSABLE_ENTITY,
            #     message="%s" % e
            # )

    def create_bucket(self, provider, name, **kwargs):
        try:
            conn = self.connect(provider)
            public = False
            if 'public' in kwargs:
                public = kwargs['public']
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.create_container(name, public=public)
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def list_buckets(self, provider, **kwargs):
        try:
            conn = self.connect(provider)
            full_listing = True
            if 'full_listing' in kwargs:
                full_listing = kwargs['full_listing']
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.list_containers(full_listing=full_listing)
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def create_object(self, provider, bucket, name, **kwargs):
        try:
            conn = self.connect(provider)

            filename = None
            md5 = None
            sha256 = None
            segment_size = None
            use_slo = True
            metadata = None
            if 'filename' in kwargs:
                filename = kwargs['filename']
            if 'md5' in kwargs:
                md5 = kwargs['md5']
            if 'sha256' in kwargs:
                sha256 = kwargs['sha256']
            if 'segment_size' in kwargs:
                segment_size = kwargs['segment_size']
            if 'use_slo' in kwargs:
                use_slo = kwargs['use_slo']
            if 'metadata' in kwargs:
                metadata = kwargs['metadata']
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.create_object(bucket, name, filename=filename, md5=md5,
                                      sha256=sha256, segment_size=segment_size,
                                      use_slo=use_slo, metadata=metadata)
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def list_objects(self, provider, bucket, **kwargs):
        try:
            conn = self.connect(provider)
            full_listing = True
            if 'full_listing' in kwargs:
                full_listing = kwargs['full_listing']
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.list_objects(bucket, full_listing=full_listing)
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def get_object(self, provider, bucket, name, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.get_object(bucket, name, query_string=None,
                                   resp_chunk_size=1024, outfile=None)
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def update_object(self, provider, bucket, name, **kwargs):
        try:
            conn = self.connect(provider)
            metadata = None
            if 'metadata' in kwargs:
                metadata = kwargs['metadata']
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.update_object(bucket, name, metadata=metadata,
                                      **headers)
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def delete_object(self, provider, bucket, name, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.delete_object(bucket, name)
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def list_cluster_templates(self, provider, **kwargs):
        try:
            conn = self.connect(provider)
            cluster_templates = conn.list_cluster_templates()
            return cluster_templates
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def create_cluster(self, provider, name, cluster_template_id, **kwargs):
        try:
            conn = self.connect(provider)
            if kwargs.get('provider_id'):
                kwargs.pop('provider_id')
            cluster = conn.create_coe_cluster(name, cluster_template_id,
                                              **kwargs)
            return cluster.uuid
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def get_cluster_details(self, provider, cluster_id):
        try:
            conn = self.connect(provider)
            cluster = conn.get_coe_cluster(cluster_id)
            return cluster
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def delete_cluster(self, provider, cluster_id):
        try:
            conn = self.connect(provider)
            conn.delete_coe_cluster(cluster_id)
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def create_server_group(self, provider, **kwargs):

        ticket_id = None
        new_server_group = types.SimpleNamespace()
        new_lb = types.SimpleNamespace()
        try:
            conn = self.connect(provider)
            new_conn = conn.connect_as_project(kwargs['project_name'])
            server_parameters = {
                "stackname": kwargs['stackname'],
                "image": kwargs['image'],
                "flavor": kwargs['flavor'],
                "private_network": kwargs['private_network'],
                "public_network": kwargs['public_network'],
                "docker_registry": provider.docker_registry,
                "cluster_size": kwargs['cluster_size'],
                "lb_sec_group_name": kwargs['lb_sec_group_name'],
                "lb_vm_name": kwargs['lb_vm_name'],
                "lb_private_network": kwargs['lb_private_network'],
                "boot_vol_size": kwargs['boot_vol_size'],
                "lb_image": kwargs['lb_image_name'],
                # "userdata":kwargs['userdata']
                # "lb_flavor": kwargs['lb_flavor'],
                # "lb_image": kwargs['lb_image']
            }
            if 'availability_zone' in kwargs:
                server_parameters['availability_zone'] = kwargs[
                    'availability_zone']
            lb_template_path = os.path.abspath(
                os.path.join(os.path.dirname(__file__), 'templates/openstack',
                             "serverGroup.yaml"))
            env_path = os.path.abspath(
                os.path.join(os.path.dirname(__file__), 'templates/openstack',
                             "env.yaml"))

            _lb_vm = new_conn.create_stack(kwargs['stackname'] + "_sg_stack",
                                           tags=None,
                                           template_file=lb_template_path,
                                           template_url=None,
                                           template_object=None, files=None,
                                           rollback=True, wait=True,
                                           timeout=3600,
                                           environment_files=[env_path],
                                           **server_parameters)
            ticket_id = _lb_vm.id
            log.info(_lb_vm)
            stackname = kwargs['stackname'] + "_sg_stack"

            def retry_if_result_in_progress(result):
                return result is None

            @retry(wait_fixed=1000, stop_max_delay=5000, retries=10
                , retry_on_result=retry_if_result_in_progress)
            def get_sg_stack(stackname):
                _lb_vm = new_conn.get_stack(stackname, filters=None,
                                            resolve_outputs=True)
                log.info(_lb_vm)
                if _lb_vm is None:
                    new_lb.status = "error"
                    new_lb.msg = "Loadbalancer stack not found on provider."
                if _lb_vm.status == 'IN_PROGRESS':
                    _lb_vm = None
                    return get_sg_stack(stackname)
                if _lb_vm.action == 'ROLLBACK':
                    return None

                try:
                    log.info(_lb_vm.stack_status)
                    if _lb_vm.stack_status == 'CREATE_COMPLETE':
                        log.info("stack compute")
                        for lb_resources in _lb_vm.outputs:
                            log.info(lb_resources['output_value'])
                            if lb_resources[
                                'output_key'] == 'internal_security_group_id':
                                new_server_group.lb_sec_group_id = lb_resources[
                                    'output_value']
                            elif lb_resources['output_key'] == 'lb_vm_id':
                                new_server_group.lb_provider_instance_id = \
                                    lb_resources['output_value']
                            elif lb_resources['output_key'] == 'server_id':
                                new_server_group.server_id = lb_resources[
                                    'output_value']
                            elif lb_resources['output_key'] == 'server_ip':
                                new_server_group.server_ip = lb_resources[
                                    'output_value']
                            elif lb_resources['output_key'] == 'server_name':
                                new_server_group.server_name = lb_resources[
                                    'output_value']
                        _lb_vm_details = new_conn.get_server_by_id(
                            new_server_group.lb_provider_instance_id)
                        new_server_group.lb_provider_instance_ip = _lb_vm_details.public_v4
                    else:
                        new_server_group.ticket_id = ticket_id
                        return new_server_group

                except Exception as e:
                    log.info("Stack Exception: %s", e)
                    new_server_group.ticket_id = ticket_id
                    return new_server_group

                return new_server_group

            return get_sg_stack(stackname)

        except Exception as e:
            log.info("Exception: %s", e)
            new_server_group.ticket_id = ticket_id
            return new_server_group
            # abort(
            #     code=HTTPStatus.UNPROCESSABLE_ENTITY,
            #     message="%s" % e
            # )

    def stack_details_get(self, provider, **kwargs):
        time.sleep(15)
        conn = self.connect(provider)
        new_conn = conn.connect_as_project('w8xw')
        stack_details = new_conn.get_stack(
            'new-dem-nis-cluster-chenisq_cn_stack')
        log.info(stack_details)
        return stack_details

    def create_nodes_stack(self, provider, **kwargs):
        ticket_id = None
        new_server_group = types.SimpleNamespace()
        new_node = types.SimpleNamespace()
        try:
            conn = self.connect(provider)
            new_conn = conn.connect_as_project(kwargs['project_name'])
            server_parameters = {
                "stackname": kwargs['name'],
                "image_name": kwargs['image'],
                "flavor_name": kwargs['flavor'],
                "internal_network_id": kwargs['private_network'],
                "sec_group_name": kwargs['sec_group_name'],
                "boot_vol_size": kwargs['boot_vol_size'],
                "cluster_size": kwargs['cluster_size'],
                "cluster_role": kwargs['cluster_role'],
                "join_command": kwargs['join_command']
            }
            log.info("creating stack")
            lb_template_path = os.path.abspath(
                os.path.join(os.path.dirname(__file__), 'templates/openstack',
                             "clusterNodes.yaml"))
            if kwargs['production'] == False:
                env_path = os.path.abspath(
                    os.path.join(os.path.dirname(__file__),
                                 'templates/openstack', "envForNodes.yaml"))
            else:
                env_path = os.path.abspath(
                    os.path.join(os.path.dirname(__file__),
                                 'templates/openstack', "envForNodes.yaml"))
            _nodes_vm = new_conn.create_stack(kwargs['name'] + "_cn_stack",
                                              tags=None,
                                              template_file=lb_template_path,
                                              template_url=None,
                                              template_object=None, files=None,
                                              rollback=True, wait=True,
                                              timeout=3600,
                                              environment_files=[env_path],
                                              **server_parameters)
            ticket_id = _nodes_vm.id

            stackname = kwargs['name'] + "_cn_stack"

            def retry_if_result_in_progress(result):
                return result is None

            @retry(wait_fixed=1000, stop_max_delay=5000
                , retry_on_result=retry_if_result_in_progress)
            def get_cn_stack(stackname):
                _nodes_vm = new_conn.get_stack(stackname, filters=None,
                                               resolve_outputs=True)

                if _nodes_vm is None:
                    new_node.status = "error"
                    new_node.msg = "Node stack not found on provider."
                if _nodes_vm.status == 'IN_PROGRESS':
                    _nodes_vm = None
                    return get_cn_stack(stackname)
                if _nodes_vm.action == 'ROLLBACK':
                    return None

                try:
                    if _nodes_vm.stack_status == 'CREATE_COMPLETE':
                        for nodes_resources in _nodes_vm.outputs:
                            if nodes_resources[
                                'output_key'] == 'server_private_ip':
                                new_server_group.private_ip = nodes_resources[
                                    'output_value']
                            elif nodes_resources['output_key'] == 'server_id':
                                new_server_group.server_id = nodes_resources[
                                    'output_value']
                            elif nodes_resources['output_key'] == 'server_ip':
                                new_server_group.server_ip = nodes_resources[
                                    'output_value']
                            elif nodes_resources['output_key'] == 'server_name':
                                new_server_group.server_name = nodes_resources[
                                    'output_value']
                    else:
                        new_server_group.ticket_id = ticket_id
                        return new_server_group

                except Exception as e:
                    log.info("Stack Exception: %s", e)
                    new_server_group.ticket_id = ticket_id
                    return new_server_group

                return new_server_group

            return get_cn_stack(stackname)

        except Exception as e:
            log.info("Exception: %s", e)
            new_server_group.ticket_id = ticket_id
            return new_server_group

    def delete_nodes_stack(self, provider, **kwargs):
        conn = self.connect(provider)
        if 'project_name' in kwargs:
            new_conn = conn.connect_as_project(kwargs['project_name'])
        _nodes_vm = new_conn.get_stack(kwargs['name'], filters=None,
                                       resolve_outputs=True)

        if _nodes_vm is not None:
            new_conn.delete_stack(kwargs['name'], wait=True)
            log.info("Already deleted")
        else:
            return False
        return True

    def update_node_stack(self, provider, **kwargs):
        try:
            conn = self.connect(provider)
            conn = conn.connect_as_project(kwargs['project_name'])
            server_parameters = {
                "stackname": kwargs['name'],
                "image_name": kwargs['image'],
                "flavor_name": kwargs['flavor'],
                "internal_network_id": kwargs['private_network'],
                "public_net_name": kwargs['public_network'],
                "sec_group_name": kwargs['sec_group_name'],
                "boot_vol_size": kwargs['boot_vol_size'],
                "cluster_size": kwargs['cluster_size'],
                "cluster_role": kwargs['cluster_role'],
                "join_command": kwargs['join_command']
            }
            log.info(server_parameters)
            lb_template_path = os.path.abspath(
                os.path.join(os.path.dirname(__file__), 'templates/openstack',
                             "clusterNodes.yaml"))
            env_path = os.path.abspath(
                os.path.join(os.path.dirname(__file__), 'templates/openstack',
                             "envForNodes.yaml"))

            _server_response = conn.update_stack(
                kwargs['stackname'] + "_cn_stack", tags=None,
                template_file=lb_template_path, template_url=None,
                template_object=None, files=None, rollback=True, wait=True,
                timeout=3600, environment_files=[env_path], **server_parameters)
            log.info(_server_response)
            new_server_group = types.SimpleNamespace()
            try:
                if _server_response.action.lower() == 'rollback':
                    log.info('rollback')
                    new_server_group.status = 'rollback'
                    return new_server_group

            except Exception as e:
                log.info(e)

            for nodes_resources in _server_response.outputs:
                if nodes_resources['output_key'] == 'server_private_ip':
                    new_server_group.private_ip = nodes_resources[
                        'output_value']
                elif nodes_resources['output_key'] == 'server_id':
                    new_server_group.server_id = nodes_resources['output_value']
                elif nodes_resources['output_key'] == 'server_ip':
                    new_server_group.server_ip = nodes_resources['output_value']
                elif nodes_resources['output_key'] == 'server_name':
                    new_server_group.server_name = nodes_resources[
                        'output_value']
            new_server_group.status = 'success'
            return new_server_group

        except Exception as e:
            log.info("Exception: %s", e)
            new_server_group = types.SimpleNamespace()
            new_server_group.status = 'rollback'
            return new_server_group

    def update_server_group(self, provider, **kwargs):
        try:
            conn = self.connect(provider)
            updated_server_group = types.SimpleNamespace()
            conn = conn.connect_as_project(kwargs['project_name'])

            log.info(kwargs['private_network'])
            parameters = {
                "stackname": kwargs['stackname'],
                "image": kwargs['image'],
                "flavor": kwargs['flavor'],
                "private_network": kwargs['private_network'],
                "public_network": kwargs['public_network'],
                "cluster_size": kwargs['cluster_size'],
                "lb_sec_group_name": kwargs['lb_sec_group_name'],
                "lb_vm_name": kwargs['lb_vm_name'],
                "lb_private_network": kwargs['lb_private_network'],
            }
            lb_template_path = os.path.abspath(
                os.path.join(os.path.dirname(__file__), 'templates/openstack',
                             "serverGroup.yaml"))
            env_path = os.path.abspath(
                os.path.join(os.path.dirname(__file__), 'templates/openstack',
                             "env.yaml"))

            _server_response = conn.update_stack(
                kwargs['stackname'] + "_sg_stack",
                template_file=lb_template_path,
                template_url=None, template_object=None, files=None,
                rollback=True,
                wait=True, timeout=3600, environment_files=[env_path],
                **parameters)
            log.info(_server_response)
            new_server_group = types.SimpleNamespace()
            try:
                if _server_response.action.lower() == 'rollback':
                    log.info('rollback')
                    new_server_group.status = 'rollback'
                    return new_server_group

            except Exception as e:
                log.info(e)

            for lb_resources in _server_response.outputs:
                if lb_resources['output_key'] == 'internal_security_group_id':
                    new_server_group.lb_sec_group_id = lb_resources[
                        'output_value']
                elif lb_resources['output_key'] == 'lb_vm_id':
                    new_server_group.lb_provider_instance_id = lb_resources[
                        'output_value']
                elif lb_resources['output_key'] == 'server_id':
                    new_server_group.server_id = lb_resources['output_value']
                elif lb_resources['output_key'] == 'server_ip':
                    new_server_group.server_ip = lb_resources['output_value']
                elif lb_resources['output_key'] == 'server_name':
                    new_server_group.server_name = lb_resources['output_value']

            _lb_vm_details = conn.get_server_by_id(
                new_server_group.lb_provider_instance_id)
            new_server_group.lb_provider_instance_ip = _lb_vm_details.public_v4
            new_server_group.status = 'success'
            return new_server_group

        except Exception as e:
            log.info("Exception: %s", e)
            new_server_group = types.SimpleNamespace()
            new_server_group.status = 'rollback'
            return new_server_group
            # abort(
            #     code=HTTPStatus.UNPROCESSABLE_ENTITY,
            #     message="%s" % e
            # )

    def create_nks_stack(self, provider, **kwargs):
        result = types.SimpleNamespace()
        ticket_id = None
        try:
            conn = self.connect(provider)
            new_conn = conn.connect_as_project(kwargs['project_name'])
            stack_parameters = {
                "stackname": kwargs['stackname'],
                "private_network": kwargs['private_network'],
                "controller_image": kwargs['controller_image'],
                "controller_flavor": kwargs['controller_flavor'],
                "controller_count": kwargs['controller_count'],
                "controller_availability_zone": kwargs[
                    'controller_availability_zone'],
                "controller_block_size": kwargs['controller_block_size'],
                "controller_userdata": kwargs['controller_userdata'],
                "controller_sg_name": kwargs['controller_sg_name']
            }

            log.info(f"creating nks stack with parameters: {stack_parameters}")
            template_path = os.path.abspath(
                os.path.join(os.path.dirname(__file__), 'templates/openstack',
                             'nks_cluster.yaml'))

            env_path = os.path.abspath(
                os.path.join(os.path.dirname(__file__), 'templates/openstack',
                             'env.yaml'))
            log.info(env_path)
            _cluster_detail = new_conn.create_stack(
                stack_parameters['stackname'], tags=None,
                template_file=template_path, template_url=None,
                template_object=None, files=None, rollback=True, wait=True,
                timeout=3600, environment_files=[env_path], **stack_parameters)
            ticket_id = _cluster_detail.id

            stackname = stack_parameters['stackname']

            def retry_if_result_in_progress(result):
                return result is None

            @retry(wait_fixed=1000, stop_max_delay=5000,
                   retry_on_result=retry_if_result_in_progress)
            def get_cluster_stack(stackname):
                _cluster_detail = new_conn.get_stack(stackname, filters=None,
                                                     resolve_outputs=True)

                if _cluster_detail is None:
                    result.status = 'Error'
                    result.msg = f'stack with name {stackname} not found'

                if _cluster_detail.status == 'IN_PROGRESS':
                    _cluster_detail = None
                    return get_cluster_stack(stackname)

                if _cluster_detail.action == 'ROLLBACK':
                    return None

                try:
                    if _cluster_detail.stack_status == 'CREATE_COMPLETE':
                        for resource in _cluster_detail.outputs:
                            if resource['output_key'] == 'affinity_group_id':
                                result.affinity_group_id = resource[
                                    'output_value']
                            if resource['output_key'] == 'affinity_group_name':
                                result.affinity_group_name = resource[
                                    'output_value']
                            if resource[
                                'output_key'] == 'nks_security_group_id':
                                result.nks_security_group_id = resource[
                                    'output_value']
                            if resource[
                                'output_key'] == 'nks_security_group_name':
                                result.nks_security_group_name = resource[
                                    'output_value']
                            if resource['output_key'] == 'controller_id':
                                result.controller_ids = resource['output_value']
                            if resource['output_key'] == 'controller_name':
                                result.controller_names = resource[
                                    'output_value']
                            if resource['output_key'] == 'controller_ip':
                                result.controller_ips = resource['output_value']
                            if resource['output_key'] == 'controller_volume_id':
                                result.controller_volume_ids = resource[
                                    'output_value']
                            if resource[
                                'output_key'] == 'controller_volume_name':
                                result.controller_volume_names = resource[
                                    'output_value']
                            if resource[
                                'output_key'] == 'controller_volume_size':
                                result.controller_volume_sizes = resource[
                                    'output_value']
                    else:
                        result.ticket_id = ticket_id
                        return result

                except Exception as e:
                    log.info(f'Stack Exception: {str(e)}')
                    result.ticket_id = ticket_id
                    return result

                return result

            return get_cluster_stack(stackname)

        except Exception as e:
            log.info(f'Exception while creating nks stack: {str(e)}')
            result.ticket_id = ticket_id
            return result

    def delete_server_group(self, provider, name_or_id, **kwargs):
        conn = self.connect(provider)
        # updated_server_group = types.SimpleNamespace()
        if 'project_name' in kwargs:
            conn = conn.connect_as_project(kwargs['project_name'])
        _server_response = conn.delete_stack(name_or_id, wait=True)
        log.info(_server_response)
        return _server_response

    def set_server_metadata(self, provider, name_or_id, **kwargs):
        conn = self.connect(provider)
        # updated_server_group = types.SimpleNamespace()
        conn = conn.connect_as_project(kwargs['project_name'])
        _server_response = conn.set_server_metadata(name_or_id,
                                                    metadata=kwargs['metadata'])
        return _server_response

    def delete_server_metadata(self, provider, name_or_id, **kwargs):
        conn = self.connect(provider)
        conn = conn.connect_as_project(kwargs['project_name'])
        _server_response = conn.set_server_metadata(name_or_id,
                                                    metadata_keys=kwargs[
                                                        'metadata_keys'])
        return _server_response

    def add_network_to_server(self, provider, **kwargs):
        conn = self.connect(provider)
        conn = conn.connect_as_project(kwargs['project_name'])
        _response = conn.compute.create_server_interface(kwargs['server_id'],
                                                         net_id=kwargs[
                                                             'network_id'])
        return _response

    def get_server_interface(self, provider, **kwargs):
        conn = self.connect(provider)
        if 'project_name' in kwargs:
            conn = conn.connect_as_project(kwargs['project_name'])
        _response = conn.compute.server_interfaces(kwargs['server_id'])
        log.info(_response)
        return _response

    def remove_network_to_server(self, provider, **kwargs):
        conn = self.connect(provider)
        conn = conn.connect_as_project(kwargs['project_name'])
        _response = conn.compute.delete_server_interface(kwargs['interface_id'],
                                                         kwargs['server_id'])
        log.info(_response)
        return _response

    def create_network_port(self, provider, **kwargs):
        conn = self.connect(provider)
        conn = conn.connect_as_project(kwargs['project_name'])

        _response = conn.network.create_port(project_id=kwargs['project_id'],
                                             network_id=kwargs['network_id'],
                                             security_groups=[
                                                 kwargs['sec_group_id']])
        return _response

    def get_stack_details(self, provider, **kwargs):
        conn = self.connect(provider)
        new_conn = conn.connect_as_project(kwargs['project_name'])
        stack_details = new_conn.get_server_group(kwargs['stack_id'])
        log.info(stack_details)
        return stack_details

    def add_interface_to_router(self, provider, **kwargs):
        conn = self.connect(provider)
        new_conn = conn.connect_as_project(kwargs['project_name'])

        router = new_conn.get_router(kwargs['router'], filters=None)
        log.info(router)
        response = new_conn.add_router_interface(router,
                                                 subnet_id=kwargs['subnet_id'],
                                                 port_id=None)
        log.info(response)
        return response

    def get_router(self, provider, **kwargs):
        conn = self.connect(provider)
        new_conn = conn.connect_as_project(kwargs['project_name'])
        response = new_conn.get_router(kwargs['router_id'], filters=None)
        # log.info(response.external_gateway_info['external_fixed_ips'][0]['ip_address'])
        return response

    def attach_security_groups(self, provider, **kwargs):
        conn = self.connect(provider)
        new_conn = conn.connect_as_project(kwargs['project_name'])
        log.info(kwargs['security_groups'])
        response = new_conn.add_server_security_groups(kwargs['server'], kwargs[
            'security_groups'])
        return response

    def detach_security_groups(self, provider, **kwargs):
        conn = self.connect(provider)
        new_conn = conn.connect_as_project(kwargs['project_name'])
        response = new_conn.remove_server_security_groups(kwargs['server'],
                                                          kwargs[
                                                              'security_groups'])
        return response

    def list_floating_ips(self, provider, **kwargs):
        try:
            fixed_ip_address = None
            floating_ip_address = None
            project_id = None
            subnet_id = None
            router_id = None
            status = None

            if 'fixed_ip_address' in kwargs:
                fixed_ip_address = kwargs['fixed_ip_address']
            if 'floating_ip_address' in kwargs:
                floating_ip_address = kwargs['floating_ip_address']
            if 'project_id' in kwargs:
                project_id = kwargs['project_id']
            if 'subnet_id' in kwargs:
                subnet_id = kwargs['subnet_id']
            if 'router_id' in kwargs:
                router_id = kwargs['router_id']
            if 'status' in kwargs:
                status = kwargs['status']

            conn = self.connect(provider)
            return conn.list_floating_ips(
                filters={'fixed_ip_address': fixed_ip_address,
                         'floating_ip_address': floating_ip_address,
                         'project_id': project_id, 'subnet_id': subnet_id,
                         'router_id': router_id, 'status': status})
        except Exception as e:
            log.info("Exception: %s", e)
            return []

    def create_floating_ip(self, provider, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            if 'floating_ip_address' in kwargs:
                return conn.network.create_ip(
                    floating_network_id=kwargs['network_id'],
                    description=kwargs['description'],
                    floating_ip_address=kwargs['floating_ip_address'],
                    project_id=kwargs['project_id'])
            else:
                return conn.network.create_ip(
                    floating_network_id=kwargs['network_id'],
                    description=kwargs['description'],
                    project_id=kwargs['project_id'])
        except Exception as e:
            raise ConnectionError(f'Openstack Exception: {str(e)}')

    def delete_floating_ip(self, provider, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.network.delete_ip(kwargs['floating_ip_id'],
                                          ignore_missing=False)
        except Exception as e:
            raise ConnectionError(f'Openstack Exception: {str(e)}')

    def add_floating_ip_to_server(self, provider, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.compute.add_floating_ip_to_server(
                kwargs['provider_instance_id'], kwargs['floating_ip'],
                fixed_address=None)
        except Exception as e:
            raise ConnectionError(f'Openstack Exception: {str(e)}')
            # log.info("Exception: %s", e)
            # abort(
            #     code=HTTPStatus.UNPROCESSABLE_ENTITY,
            #     message="%s" % e
            # )

    def remove_floating_ip_from_server(self, provider, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.compute.remove_floating_ip_from_server(
                kwargs['provider_instance_id'], kwargs['floating_ip'])
        except Exception as e:
            log.info("Exception: %s", e)
            raise_exception = kwargs.get('raise_exception', False)
            if raise_exception:
                raise ConnectionError(f'{str(e)}')
            else:
                abort(
                    code=HTTPStatus.UNPROCESSABLE_ENTITY,
                    message="%s" % e
                )

    def update_project_compute_quota(self, provider, project_id, **kwargs):
        try:

            conn = self.connect(provider)
            kwargs['ram'] = int(kwargs['ram'] * 1024)
            return conn.set_compute_quotas(project_id, **kwargs)
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def update_project_volume_quota(self, provider, project_id, **kwargs):
        try:

            conn = self.connect(provider)
            return conn.set_volume_quotas(project_id, **kwargs)
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def update_project_network_quota(self, provider, project_id, **kwargs):
        try:

            conn = self.connect(provider)
            return conn.set_network_quotas(project_id, **kwargs)
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    """
        ================== networker api =================================
    """

    def get_all_clients(self, provider, **kwargs):
        url = "https://{}:{}/nwrestapi/v3/global/clients".format(
            kwargs['backup_server_api'], kwargs['backup_server_port'])
        response = requests.get(url, auth=HTTPBasicAuth(kwargs['username'],
                                                        kwargs['password']),
                                headers=self.headers, verify=False)
        log.info(response.text)

        return response.text

    def get_backup_details(self, provider, **kwargs):

        url = "https://{}:{}/nwrestapi/v3/global/clients/{}/backups".format(
            kwargs['backup_server_api'],
            kwargs['backup_server_port'], kwargs['client_id'])

        response = requests.get(url, auth=HTTPBasicAuth(kwargs['username'],
                                                        kwargs['password']),
                                headers=self.headers,
                                verify=False)

        return response.text

    def create_protection_group(self, provider, **kwargs):

        url = "https://{}:{}/nwrestapi/v2/global/protectiongroups".format(
            kwargs['backup_server_api'], kwargs['backup_server_port'])
        payload = {"workItemType": "Client",
                   "name": kwargs['protection_group_name'], "workItems": []}
        response = requests.post(url, data=json.dumps(payload),
                                 auth=HTTPBasicAuth(kwargs['username'],
                                                    kwargs['password']),
                                 headers=self.headers, verify=False)
        return response.text

    def get_protection_group(self, provider, **kwargs):
        url = "https://{}:{}/nwrestapi/v2/global/protectiongroups/{}".format(
            kwargs['backup_server_api'],
            kwargs['backup_server_port'], kwargs['protection_group_name'])
        response = requests.get(url,
                                auth=HTTPBasicAuth(kwargs['username'],
                                                   kwargs['password']),
                                headers=self.headers, verify=False)
        return response.text

    def create_workflow(self, provider, **kwargs):
        url = "https://{}:{}/nwrestapi/v2/global/protectionpolicies/{}/workflows".format(
            kwargs['backup_server_api'],
            kwargs['backup_server_port'], kwargs['protection_policy_name'])
        payload = {"actions": [{"actionSpecificData": {"backup": {
            "backupSpecificData": {"traditional": {"forceBackupLevel": "",
                                                   "destinationPool": "101944012",
                                                   "verifySyntheticFull": True,
                                                   "revertToFullWhenSyntheticFullFails": True,
                                                   "fileInactivityThresholdInDays": 0,
                                                   "fileInactivityAlertThresholdPercentage": 0,
                                                   "timestampFormat": "None",
                                                   "estimate": False}},
            "clientOverride": "ClientCanOverride",
            "destinationStorageNodes": ["nsrserverhost"],
            "retentionPeriod": "1 Months", "overrideRetentionPeriod": False,
            "overrideBackupSchedule": False, "successThreshold": "Success"}},
            "completionNotification": {"command": "",
                                       "executeOn": "Ignore"},
            "concurrent": False, "drivenBy": "",
            "enabled": True, "failureImpact": "Continue",
            "hardLimit": "00:00",
            "inactivityTimeoutInMin": 30, "name": "Backup",
            "parallelism": 100, "retries": 1,
            "retryDelayInSec": 30,
            "scheduleActivities": ["full", "incr", "incr",
                                   "incr", "incr", "incr",
                                   "incr"],
            "schedulePeriod": "Week",
            "softLimit": "00:00"}],
            "autoStartEnabled": True, "comment": "",
            "completionNotification": {"command": "",
                                       "executeOn": "Ignore"},
            "description": "Traditional Backup to pool Default, with expiration 1 Months;",
            "enabled": True, "endTime": "21:00",
            "name": kwargs['protection_group_name'] + "_workflow",
            "protectionGroups": [kwargs['protection_group_name']],
            "restartTimeWindow": "12:00", "startInterval": "24:00",
            "startTime": "01:00"}
        try:
            response = requests.post(url, data=json.dumps(payload),
                                     auth=HTTPBasicAuth(kwargs['username'],
                                                        kwargs['password']),
                                     headers=self.headers, verify=False)
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )
        log.info(response.text)

        return response.text

    def create_backup_action(self, provider, **kwargs):

        url = "https://{}:{}/nwrestapi/v2/global/protectionpolicies/{}/workflows/{}".format(
            kwargs['backup_server_api'],
            kwargs[
                'backup_server_port'],
            kwargs[
                'protection_policy_name'], 'test')

        created_backup_action = requests.put(url,
                                             data=json.dumps(kwargs['payload']),
                                             auth=HTTPBasicAuth(
                                                 kwargs['username'],
                                                 kwargs['password']),
                                             headers=self.headers, verify=False)

        log.info(created_backup_action)
        return created_backup_action

    def get_workflow(self, provider, **kwargs):
        url = "https://{}:{}/nwrestapi/v2/global/protectionpolicies/{}/workflows".format(
            kwargs['backup_server_api'],
            kwargs['backup_server_port'],
            kwargs[
                'protection_policy_name'])
        response = requests.get(url,
                                auth=HTTPBasicAuth(kwargs['username'],
                                                   kwargs['password']),
                                headers=self.headers, verify=False)

        return response.text

    def register_client(self, provider, **kwargs):
        log.info(kwargs['payload'])

        if kwargs['flag']:
            log.info("update")
            url = "https://{}:{}/nwrestapi/v2/global/clients/{}".format(
                kwargs['backup_server_api'],
                kwargs['backup_server_port'], kwargs['client_id'])
            response = requests.put(url, data=json.dumps(kwargs['payload']),
                                    auth=HTTPBasicAuth(kwargs['username'],
                                                       kwargs['password']),
                                    headers=self.headers, verify=False)
            log.info(response.text)
            return response
        else:
            log.info("create")
            url = "https://{}:{}/nwrestapi/v2/global/clients".format(
                kwargs['backup_server_api'],
                kwargs['backup_server_port'])
            response = requests.post(url, data=json.dumps(kwargs['payload']),
                                     auth=HTTPBasicAuth(kwargs['username'],
                                                        kwargs['password']),
                                     headers=self.headers, verify=False)
            log.info(response.text)

            try:
                location = response.headers
                location = location['Location']
                client_id = location.split('/')[-1]
            except Exception as e:
                log.info(e)
                client_id = None
            return client_id

        # response = requests.get(url, data=json.dumps(kwargs['payload']),
        #                          auth=HTTPBasicAuth(kwargs['username'], kwargs['password']),
        #                          headers=self.headers, verify=False)
        # log.info(response.text)
        # url = "https://{}:{}/nwrestapi/v3/global/protectiongroups/{}".format(kwargs['backup_server_api'],kwargs['backup_server_port'], kwargs['protection_group_name'])
        # data = {"workItems": [client_id]}
        #
        # log.info(url)
        # response = requests.put(url, data=json.dumps(data), auth=HTTPBasicAuth(kwargs['username'], kwargs['password']),
        #                         headers=self.headers, verify=False)
        # log.info(response)

    def create_protection_policy(self, provider, **kwargs):
        url = "https://{}:{}/nwrestapi/v2/global/protectionpolicies".format(
            kwargs['backup_server_api'], kwargs['backup_server_port'])
        payload = {
            "name": "Bronze_" + kwargs['project_id']
        }
        try:
            response = requests.post(url, data=json.dumps(payload),
                                     auth=HTTPBasicAuth(kwargs['username'],
                                                        kwargs['password']),
                                     headers=self.headers, verify=False)

            return response
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def get_protection_policy(self, provider, **kwargs):
        url = "https://{}:{}/nwrestapi/v2/global/protectionpolicies/{}".format(
            kwargs['backup_server_api'],
            kwargs['backup_server_port'], "Bronze_" + kwargs['project_id'])
        response = requests.get(url,
                                auth=HTTPBasicAuth(kwargs['username'],
                                                   kwargs['password']),
                                headers=self.headers, verify=False)

        return response.text

    '''
    Get backup instances 
    '''

    def get_backup_instance(self, provider, **kwargs):
        url = "https://{}:{}/nwrestapi/v3/global/backups".format(
            kwargs['backup_server_api'],
            kwargs['backup_server_port'])
        backup_instances = requests.get(url,
                                        auth=HTTPBasicAuth(kwargs['username'],
                                                           kwargs['password']),
                                        headers=self.headers, verify=False)

        log.info(backup_instances)
        return backup_instances.text

    '''
    Get specific backup instance by backup id.
    '''

    def get_instance_by_backupId(self, provider, **kwargs):
        url = "https://{}:{}/nwrestapi/v3/global/backups/{}/instances".format(
            kwargs['backup_server_api'],
            kwargs['backup_server_port'], kwargs['backupId'])

        instance = requests.get(url,
                                auth=HTTPBasicAuth(kwargs['username'],
                                                   kwargs['password']),
                                headers=self.headers, verify=False)
        log.info(instance.text)
        return instance.text

    # '''
    # Recovering Filesystem backup by saveset
    # '''
    # def create_backup_recovery(self, provider, **kwargs):

    def create_response(self, message, status_code):

        response = {
            'message': message,
            'status': status_code
        }
        return json.dumps(response)

    def create_stack(self, provider, **kwargs):
        try:
            if kwargs['template']:
                template = tempfile.NamedTemporaryFile()
                template_data = kwargs.pop('template')
                with open(template.name, 'w') as f:
                    f.write(template_data)
                kwargs['template_file'] = template.name
            if 'environment_files_data' in kwargs:
                environment_files = []
                for env_data in kwargs['environment_files_data']:
                    file = tempfile.NamedTemporaryFile()
                    with open(file.name, 'w') as f:
                        f.write(env_data)
                    environment_files.append(file.name)
                kwargs['environment_files_data'] = environment_files
            log.info(kwargs)

            log.info("Creating Stack for Project ID: %s",
                     kwargs['project_name'])
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            _stack = conn.create_stack(
                name=kwargs.get('stack_name'), tags=kwargs.get('tags'),
                template_file=kwargs.get('template_file'),
                template_url=kwargs.get('template_url'),
                template_object=kwargs.get('template_object'),
                files=kwargs.get('files'),
                rollback=kwargs.get('rollback', False),
                wait=kwargs.get('wait', True),
                timeout=kwargs.get('timeout', 3600),
                environment_files=kwargs.get('environment_files_data'),
                **kwargs.get('parameters'))

            return _stack
        except Exception as e:
            raise ConnectionError(f'Stack Create Exception: {e}')

    def update_stack(self, provider, **kwargs):
        try:
            if kwargs['template']:
                template = tempfile.NamedTemporaryFile()
                template_data = kwargs.pop('template').replace("\\n", "\n")
                with open(template.name, 'w') as f:
                    f.write(template_data)
                kwargs['template_file'] = template.name

            if kwargs['environment_files_data']:
                environment_files = []
                for env_data in kwargs['environment_files_data']:
                    file = tempfile.NamedTemporaryFile()
                    env_data = env_data.replace("\\n", "\n")
                    with open(file.name, 'w') as f:
                        f.write(env_data)
                    environment_files.append(file.name)
                kwargs['environment_files_data'] = environment_files

            log.info("Updating Stack for Project ID: %s",
                     kwargs['project_name'])
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            _stack = conn.update_stack(
                name_or_id=kwargs.get('stack_id'), tags=kwargs.get('tags'),
                template_file=kwargs.get('template_file'),
                template_url=kwargs.get('template_url'),
                template_object=kwargs.get('template_object'),
                files=kwargs.get('files'),
                rollback=kwargs.get('rollback', True),
                wait=kwargs.get('wait', True),
                timeout=kwargs.get('timeout', 3600),
                environment_files=kwargs.get('environment_files'),
                **kwargs.get('parameters'))
            return _stack
        except Exception as e:
            raise ConnectionError(f'Stack Update Exception: {e}')

    def list_stack(self, provider, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.list_stacks()
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def get_stack(self, provider, name_or_id, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.get_stack(name_or_id)
        except Exception as e:
            log.info("Exception: %s", e)
            get_current_status = kwargs.get('get_current_status')
            if get_current_status:
                raise ConnectionError(e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def delete_stack(self, provider, name_or_id, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.delete_stack(name_or_id,
                                     wait=kwargs.get('wait', True), )
        except Exception as e:
            raise ConnectionError(f'Openstack delete server Exception: {e}')

    def get_stack_resources(self, provider, name_or_id, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.orchestration.resources(name_or_id)
        except Exception as e:
            raise ConnectionError(
                f'Openstack get stack resources Exception: {e}')

    def suspend_stack(self, provider, stack_id, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            client = heat_client.Client('1', session=conn.session)
            client.actions.suspend(stack_id)

            def retry_if_suspend_in_progress(result):
                return result is None

            @retry(wait_fixed=2000, stop_max_delay=10000,
                   retry_on_result=retry_if_suspend_in_progress)
            def get_stack_status(stack_id):
                stack_status = conn.get_stack(stack_id).stack_status

                if stack_status == 'SUSPEND_COMPLETE':
                    return True
                if stack_status == 'SUSPEND_FAILED':
                    return False
                return None
        except Exception as e:
            raise ConnectionError(f'Openstack suspend server Exception: {e}')

        return get_stack_status(stack_id)

    def resume_stack(self, provider, stack_id, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            client = heat_client.Client('1', session=conn.session)
            client.actions.resume(stack_id)

            def retry_if_resume_in_progress(result):
                return result is None

            @retry(wait_fixed=2000, stop_max_delay=10000,
                   retry_on_result=retry_if_resume_in_progress)
            def get_stack_status(stack_id):
                stack_status = conn.get_stack(stack_id).stack_status

                if stack_status == 'RESUME_COMPLETE':
                    return True
                if stack_status == 'RESUME_FAILED':
                    return False
                return None
        except Exception as e:
            raise ConnectionError(f'Openstack resume server Exception: {e}')

        return get_stack_status(stack_id)

    def get_secret(self, provider, secret, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.key_manager.get_secret(secret)
        except Exception as e:
            log.info("Exception: %s", e)
            raise ConnectionError(f"Get Secret Exception: {e}")

    def list_secrets(self, provider, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.key_manager.secrets(**kwargs)
        except Exception as e:
            log.info("Exception: %s", e)
            raise ConnectionError(f"List Secret Exception: {e}")

    def create_secret(self, provider, payload, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            if 'secret_name' in kwargs:
                kwargs['name'] = kwargs.pop('secret_name')
            _secret = conn.key_manager.create_secret(
                payload=payload,
                payload_content_type=kwargs.pop('payload_content_type',
                                                'text/plain'),
                secret_type=kwargs.pop('secret_type', 'opaque'),
                **kwargs
            )
            return _secret
        except Exception as e:
            log.info("Exception: %s", e)
            raise ConnectionError(f"Create Secret Exception: {e}")

    def delete_secret(self, provider, secret_uuid, **kwargs):
        try:
            conn = self.connect(provider)
            if 'project_name' in kwargs:
                conn = conn.connect_as_project(kwargs['project_name'])
            return conn.key_manager.delete_secret(secret_uuid)
        except Exception as e:
            log.info("Exception: %s", e)
            raise ConnectionError(f"Delete Secret Exception: {e}")
