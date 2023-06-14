# encoding: utf-8
# pylint: disable=no-self-use
"""
Networker Backup setup.
"""

import requests, ssl, json
from requests.auth import HTTPBasicAuth

import logging
log = logging.getLogger(__name__)
class NetworkerApi(object):

    def __init__(self, app=None):
        if app:
            self.init_app(app)

    def init_app(self, app):
        self.headers = {
            'Content-Type': "application/json",
            'Cache-Control': "no-cache"
        }
        return self
    
    def connect(self, service_provider_meta):        
        
        kwargs = {}
        for meta in service_provider_meta:
            if meta.meta_key == 'backup_server_ip' :
                kwargs['backup_server_api'] = meta.meta_value
            if meta.meta_key == 'backup_server_port' :
                kwargs['backup_server_port'] = meta.meta_value
            if meta.meta_key == 'username' :
                kwargs['username'] = meta.meta_value
            if meta.meta_key == 'password' :
                kwargs['password'] = meta.meta_value
                
        return kwargs
        
    def get_all_clients(self, service_provider_meta, **kwargs):
        backupargs = self.connect(service_provider_meta)
        url = "https://{}:{}/nwrestapi/v3/global/clients".format(backupargs['backup_server_api'],backupargs['backup_server_port'])
        response = requests.get(url, auth=HTTPBasicAuth(backupargs['username'], backupargs['password']), headers=self.headers, verify=False)
        log.info(response.text)

        return response.text

    def get_backup_details(self, service_provider_meta, **kwargs):
        backupargs = self.connect(service_provider_meta)
        url = "https://{}:{}/nwrestapi/v3/global/clients/{}/backups".format(backupargs['backup_server_api'],
                                                                 backupargs['backup_server_port'], kwargs['client_id'])

        response = requests.get(url, auth=HTTPBasicAuth(backupargs['username'], backupargs['password']), headers=self.headers,
                                verify=False)
        log.info(response.text)
        return response.text

    def create_protection_group(self, service_provider_meta, **kwargs):
        backupargs = self.connect(service_provider_meta)
        url = "https://{}:{}/nwrestapi/v2/global/protectiongroups".format(backupargs['backup_server_api'],backupargs['backup_server_port'])
        
        payload = {"workItemType": "Client", "name": kwargs['protection_group_name'], "workItems":[]}
        response = requests.post(url, data=json.dumps(payload), auth=HTTPBasicAuth(backupargs['username'], backupargs['password']),
                                 headers=self.headers, verify=False)
        log.info(response)
        return response.text

    def get_protection_group(self, service_provider_meta, **kwargs):
        backupargs = self.connect(service_provider_meta)
        url = "https://{}:{}/nwrestapi/v2/global/protectiongroups/{}".format(backupargs['backup_server_api'],
                                                                         backupargs['backup_server_port'], kwargs['protection_group_name'])
        response = requests.get(url,
                                 auth=HTTPBasicAuth(backupargs['username'], backupargs['password']),
                                 headers=self.headers, verify=False)
        return response.text

    def create_workflow(self, service_provider_meta, **kwargs):
        backupargs = self.connect(service_provider_meta)
        url = "https://{}:{}/nwrestapi/v2/global/protectionpolicies/{}/workflows".format(backupargs['backup_server_api'],
                                                                         backupargs['backup_server_port'], kwargs['protection_policy_name'])
        payload = {"actions": [{"actionSpecificData": {"backup": {"backupSpecificData": {"traditional": {"forceBackupLevel":"", "destinationPool":"101944012","verifySyntheticFull": True,"revertToFullWhenSyntheticFullFails": True,"fileInactivityThresholdInDays": 0,"fileInactivityAlertThresholdPercentage": 0,"timestampFormat":"None","estimate": False}},"clientOverride":"ClientCanOverride", "destinationStorageNodes": ["nsrserverhost"],"retentionPeriod": "1 Months", "overrideRetentionPeriod": False, "overrideBackupSchedule": False, "successThreshold":"Success"}}, "completionNotification": {"command":"", "executeOn":"Ignore"},"concurrent": False, "drivenBy":"", "enabled": True, "failureImpact":"Continue", "hardLimit":"00:00", "inactivityTimeoutInMin": 30, "name": "Backup", "parallelism": 100, "retries":1, "retryDelayInSec": 30, "scheduleActivities": ["full","incr","incr","incr","incr","incr","incr"], "schedulePeriod":"Week","softLimit": "00:00"}], "autoStartEnabled": True,"comment":"", "completionNotification": {"command":"", "executeOn":"Ignore"}, "description": "Traditional Backup to pool Default, with expiration 1 Months;", "enabled": True, "endTime":"21:00", "name":kwargs['protection_group_name']+"_workflow", "protectionGroups": [kwargs['protection_group_name']], "restartTimeWindow":"12:00", "startInterval":"24:00", "startTime":"01:00"}
        try:
            response = requests.post(url, data=json.dumps(payload),
                                     auth=HTTPBasicAuth(backupargs['username'], backupargs['password']),
                                     headers=self.headers, verify=False)
        except Exception as e:
            log.info("Exception: %s", e)
            return e
        log.info(response.text)

        return response.text

    def create_backup_action(self, service_provider_meta, **kwargs):
        backupargs = self.connect(service_provider_meta)
        url = "https://{}:{}/nwrestapi/v2/global/protectionpolicies/{}/workflows/{}".format(backupargs['backup_server_api'],
                                                                                            backupargs[
                                                                                                'backup_server_port'],
                                                                                            kwargs[
                                                                                                'protection_policy_name'], 'test')

        created_backup_action = requests.put(url,data=json.dumps(kwargs['payload']), auth=HTTPBasicAuth(backupargs['username'], backupargs['password']),
                                 headers=self.headers, verify=False)

        log.info(created_backup_action)
        return created_backup_action

    def get_workflow(self, service_provider_meta, **kwargs):
        backupargs = self.connect(service_provider_meta)
        url = "https://{}:{}/nwrestapi/v2/global/protectionpolicies/{}/workflows".format(backupargs['backup_server_api'],
                                                                                         backupargs['backup_server_port'],
                                                                                         kwargs['protection_policy_name'])
        response = requests.get(url,
                                 auth=HTTPBasicAuth(backupargs['username'], backupargs['password']),
                                 headers=self.headers, verify=False)
        log.info(response)
        return response.text

    def register_client(self, service_provider_meta, **kwargs):
        backupargs = self.connect(service_provider_meta)
        log.info(kwargs['payload'])
        # url = "https://{}:{}/nwrestapi/v3/global/clients".format(backupargs['backup_server_api'], backupargs['backup_server_port'])

        # log.info(url)
        # response = requests.post(url, data=json.dumps(kwargs['payload']), auth=HTTPBasicAuth(backupargs['username'], backupargs['password']),
        #                          headers=self.headers, verify=False)
        # location = response.headers
        # log.info(location)
        # location = location['Location']
        # client_id = location.split('/')[-1]

        # response = requests.get(url, data=json.dumps(kwargs['payload']),
        #                          auth=HTTPBasicAuth(kwargs['username'], kwargs['password']),
        #                          headers=self.headers, verify=False)
        # log.info(response.text)
        # url = "https://{}:{}/nwrestapi/v3/global/protectiongroups/{}".format(kwargs['backup_server_api'],kwargs['backup_server_port'], kwargs['protection_group_name'])
        # data = {"workItems": [client_id]}

        # log.info(url)
        # response = requests.put(url, data=json.dumps(data), auth=HTTPBasicAuth(kwargs['username'], kwargs['password']),
        #                         headers=self.headers, verify=False)
        # log.info(response)
        # return client_id

        if kwargs['flag']:
            log.info("update")
            url = "https://{}:{}/nwrestapi/v2/global/clients/{}".format(backupargs['backup_server_api'],
                                                                     backupargs['backup_server_port'], kwargs['client_id'])
            response = requests.put(url, data=json.dumps(kwargs['payload']),
                                     auth=HTTPBasicAuth(backupargs['username'], backupargs['password']),
                                     headers=self.headers, verify=False)
            log.info(response.text)
            return response
        else:
            log.info("create")
            url = "https://{}:{}/nwrestapi/v2/global/clients".format(backupargs['backup_server_api'],
                                                                     backupargs['backup_server_port'])
            response = requests.post(url, data=json.dumps(kwargs['payload']), auth=HTTPBasicAuth(backupargs['username'], backupargs['password']),
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

    def create_protection_policy(self, service_provider_meta, **kwargs):
        backupargs = self.connect(service_provider_meta)
        
        url = "https://{}:{}/nwrestapi/v2/global/protectionpolicies".format(backupargs['backup_server_api'],backupargs['backup_server_port'])
        payload = {
            "name": "Bronze_"+kwargs['project_id']
        }
        try:
            response = requests.post(url, data=json.dumps(payload), auth=HTTPBasicAuth(backupargs['username'], backupargs['password']),
                                     headers=self.headers, verify=False)
            return response
        except Exception as e:
            log.info("Exception: %s", e)
            return e
            # abort(
            #     code=HTTPStatus.UNPROCESSABLE_ENTITY,
            #     message="%s" % e
            # )

    def get_protection_policy(self, service_provider_meta, **kwargs):
        backupargs = self.connect(service_provider_meta)
        
        url = "https://{}:{}/nwrestapi/v2/global/protectionpolicies/{}".format(backupargs['backup_server_api'],
                                                                            backupargs['backup_server_port'], "Bronze_"+kwargs['project_id'])
        response = requests.get(url,
                                 auth=HTTPBasicAuth(backupargs['username'], backupargs['password']),
                                 headers=self.headers, verify=False)
        return response.text
