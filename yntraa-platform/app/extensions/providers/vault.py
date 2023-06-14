# encoding: utf-8
# pylint: disable=no-self-use
"""
Hashicorp Vault Provider.
"""

import json
import logging
import requests
from flask_restplus_patched._http import HTTPStatus
from app.extensions.api import abort
from app.extensions import api, db

log = logging.getLogger(__name__)

class VaultProvider(object):
    def __init__(self, app=None):
        if app:
            self.init_app(app)

    def init_app(self, app):
        self._vault_addr = app.config.get('VAULT_ADDR')
        self._vault_token = app.config.get('VAULT_TOKEN', 'root')
        self._vault_kv_path = app.config.get('VAULT_KV_PATH', 'v1/secret')
        self._verify_ssl = app.config.get('VERIFY_VAULT_SSL', True) 
        self._vault_enabled = app.config.get('VAULT_ENABLED', False)   
        self._auth_headers = {"X-Vault-Token": self._vault_token}
        log.info("Vault init done.")
      
        return self
        
    def save_cert(self, provider_id, project_id, cert_id, certificate, private_key, inter_certs):
        """
        Store certificate into vault and override it if it already exists.
        :param provider_id provider Id
        :param project_id Project Id
        :param cert_id SSL Certificate Id
        :param certificate Certificate
        :param private_key Private key for certificate
        :param inter_certs Intermidatory certificates.
        """
        try:
            self._create_new_cert(provider_id, project_id, cert_id, certificate, private_key, inter_certs)
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )
    
    
    def _create_new_cert(self, provider_id, project_id, cert_id, certificate, private_key, inter_certs):
        """
        Create new version of secret in vault.
        """
        payload = {
                    "data": {
                        "ssl_cert_key": certificate, 
                        "ssl_private_key": private_key, 
                        "ca_certificate":inter_certs
                        },
                    "options": {"cas":0}
                    }
        endpoint=f'{self._vault_addr}/{self._vault_kv_path}/data/certs/{provider_id}/{project_id}/{cert_id}'
        
        # if self.delete_cert(provider_id, project_id, lb_id):
        #     log.info("Deleted old certificate from vault.")
        log.info(f"storing ssl certs at {provider_id} Project: {project_id} and CertificateId : {cert_id}")
        resp = requests.post(endpoint, data=json.dumps(payload), headers=self._auth_headers, 
                                verify=self._verify_ssl)
        if resp.status_code == 200:
            self._update_secret_meta(provider_id, project_id, cert_id)
            log.info('Certificates stored in vault.')
        else:
            log.warn(f'Got error from vault {resp.content}')
            raise Exception(f'Error uploading certs with code: {resp.status_code}')
        
        return resp.content
    
    def _add_new_version_of_cert(self, provider_id, project_id, cert_id, certificate, private_key, inter_certs):
        """
        Create new version of secret in vault.
        """
        payload = {
                    "data": {
                        "ssl_cert_key": certificate, 
                        "ssl_private_key": private_key, 
                        "ca_certificate":inter_certs
                        },
                    "options": {"cas":1}
                    }
        endpoint=f'{self._vault_addr}/{self._vault_kv_path}/data/certs/{provider_id}/{project_id}/{cert_id}'
        log.info(f"storing ssl certs at {provider_id} Project: {project_id} and CertificateId : {cert_id}")
        resp = requests.put(endpoint, data=json.dumps(payload), headers=self._auth_headers, 
                                verify=self._verify_ssl)
        if resp.status_code == 204:
            log.info('Certificates stored in vault.')
        else:
            log.warn(f'Got error from vault {resp.content}')
            raise Exception(f'Error uploading certs with code: {resp.status_code}')
        
        return resp.content
    
    def _update_secret_meta(self, provider_id, project_id, cert_id):
        """
        Update metadata of secret in vault.
        """
        payload = {"id":"test",
                   "max_versions":2,
                   "cas_required":False,
                   "delete_version_after":"0"}
        endpoint=f'{self._vault_addr}/{self._vault_kv_path}/metadata/certs/{provider_id}/{project_id}/{cert_id}'
        log.info(f"Updating ssl certs at {provider_id} Project: {project_id} and CertificateId : {cert_id}")
        resp = requests.put(endpoint, data=json.dumps(payload), headers=self._auth_headers, 
                             verify=self._verify_ssl)
        if resp.status_code == 204:
            log.info('Certificates metadata updated in vault.')
        else:
            log.warn(f'Got error from vault {resp.content}')
            raise Exception(f'Error uploading certs with code: {resp.status_code}')
        
        return resp.content
        
    def get_cert(self, provider_id, project_id, cert_id):
        """
        Store certificate into vault.
        :param provider_id provider Id
        :param project_id Project Id
        :param cert_id SSL Certificate Id
        """
        data = {}
        try:
            endpoint=f'{self._vault_addr}/{self._vault_kv_path}/data/certs/{provider_id}/{project_id}/{cert_id}'            
            log.info(f"Retriving ssl certs from {provider_id} Project: {project_id} and CertificateId : {cert_id}")
            resp = requests.get(endpoint, headers=self._auth_headers, verify=self._verify_ssl)
            if resp.status_code == 200:
                log.info('Certificate Retrived from vault.')
                data = json.loads(resp.content)["data"]["data"]
            elif resp.status_code == 404:
                log.info(f"Certificate not found for {provider_id} Project: {project_id} and CertificateId : {cert_id}")
            else:
                log.warn(f'Got error from vault with status {resp.status_code} and msg: {resp.content} ')
                raise Exception(f'Error uploading certs with code: {resp.status_code}')
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )
        
        return data
    
    def delete_cert(self, provider_id, project_id, cert_id):
        """
        Store certificate into vault.
        :param provider_id provider Id
        :param project_id Project Id
        :param cert_id SSL Certificate Id
        """
        isDeleted = False
        if not self._vault_enabled:
            log.info("Vault storage is disabled.")
            return isDeleted
        
        try:
            endpoint=f'{self._vault_addr}/{self._vault_kv_path}/metadata/certs/{provider_id}/{project_id}/{cert_id}'
            log.info(f"Deleting ssl certs for Provider: {provider_id} Project: {project_id} and CertificateId : {cert_id}")
            resp = requests.delete(endpoint, headers=self._auth_headers, verify=self._verify_ssl)
            if resp.status_code == 204:
                log.info('Certificates deleted from vault.')
                isDeleted = True
            else:
                log.warn(f'Got error from vault {resp.content}')
                raise Exception(resp.content)
        except Exception as e:
            log.info("Error Deleting cert from vault : %s", e)
        
        return isDeleted
                 

