# encoding: utf-8
# pylint: disable=no-self-use
"""
external provider setup.
"""

from datetime import datetime, timedelta
from tempfile import NamedTemporaryFile
from OpenSSL import crypto
import functools
import logging
#import pycurl
import os
import types
from flask_login import current_user
from flask_restplus_patched import Resource
from flask_restplus_patched._http import HTTPStatus
from app.extensions.api import Namespace, abort
import sqlalchemy
import json
from app.extensions import api, db
from hcpsdk import NativeAuthorization
from hcpsdk import Target
from hcpsdk import Connection
from urllib.parse import urlencode
from io import BytesIO
import sys
import base64
import hashlib

log = logging.getLogger(__name__)
NS='/namespaces'
PROT='/protocols'
USER='/userAccounts'
DATAACCESSPERM='/dataAccessPermissions'
TENANTURL='/mapi/tenants/'

class HCPObjStorageProvider(object):
    def __init__(self, app=None):
        if app:
            self.init_app(app)

    def init_app(self, app):
        return self

    #Function for creating tenant...       
    # def create_tenant(self, provider, **kwargs):
    #     log.info("provider in create tenant: %s", provider)
    #     try:
    #         data=kwargs['creatensparams']
    #         log.info(data)
    #         postmark_url = 'https://api.staasdl.yntraa.com:9090/mapi/tenant/?'
    #         username=kwargs['username']
    #         pwd=kwargs['password']
    #         userpwd=join("username=",username,"&password=",pwd,"forcePasswordChange=false")
    #         curl = pycurl.Curl()
    #         curl.setopt(pycurl.HTTPHEADER, ["Content-Type: application/json","Authorization:HCP VzdHVzZXI=:ceb6c970658f31504a901b89dcd3e461"])
    #         curl.setopt(pycurl.URL,postmark_url+userpwd)
    #         curl.setopt(pycurl.SSL_VERIFYPEER, 0)
    #         curl.setopt(pycurl.SSL_VERIFYHOST, 0)
    #         curl.setopt(pycurl.UPLOAD, 1)
    #         curl.setopt(pycurl.POSTFIELDS, data)
    #         log.info(curl.getinfo(pycurl.EFFECTIVE_URL))
    #         log.info(curl.getinfo(pycurl.INFO_CERTINFO))
    #         curl.perform()
    #         responseCode=curl.getinfo(pycurl.RESPONSE_CODE)
    #         log.info(curl.getinfo(pycurl.RESPONSE_CODE))
    #         curl.close()
    #         return responseCode
    #     except Exception as e:
    #         log.info("Exception: %s", e)
    #         abort(
    #             code=HTTPStatus.UNPROCESSABLE_ENTITY,
    #             message="%s" % e
    #         )

    # #Function for creating namespace for a tenant...       
    # def create_namespace(self, provider, **kwargs):
    #     log.info("provider in create namespace: %s", provider)
    #     try:
    #         ns=kwargs['params']
    #         nsparams=json.dumps(ns)
    #         log.info("Dumping the parameters")
    #         log.info(nsparams)
    #         postmark_url = provider.auth_url
    #         log.info(postmark_url)
    #         curl = pycurl.Curl()
    #         curl.setopt(pycurl.HTTPHEADER, ["Content-Type: application/json",kwargs['authHeaderToken']])
    #         curl.setopt(curl.URL,postmark_url +NS)
    #         curl.setopt(curl.SSL_VERIFYPEER, 0)
    #         curl.setopt(curl.SSL_VERIFYHOST, 0)
    #         curl.setopt(curl.UPLOAD, 1)
    #         buffer=BytesIO(nsparams.encode('utf-8'))
    #         curl.setopt(curl.READDATA,buffer)
    #         log.info("Checking the URL")
    #         log.info(curl.getinfo(curl.EFFECTIVE_URL))
    #         curl.perform()
    #         responseCode=curl.getinfo(curl.RESPONSE_CODE)
    #         log.info(curl.getinfo(curl.RESPONSE_CODE))
    #         curl.close()
    #         return responseCode
    #     except curl.error as ex:
    #         (code,message)=ex
    #         status=404
    #         text=message
    #         log.info(message)

    # #Function for modifying namespace for a tenant...       
    # def modify_namespace(self, provider, **kwargs):
    #     log.info("provider in modify namespace: %s", provider)
    #     ns=kwargs['nsparams']
    #     nsparams=json.dumps(ns)
    #     log.info("Dumping the parameters")
    #     log.info(nsparams)
    #     postmark_url = provider.auth_url
    #     ns=NS+'/'+kwargs['nsName']
    #     curl = pycurl.Curl()
    #     curl.setopt(pycurl.HTTPHEADER, ["Content-Type: application/json",kwargs['authHeaderToken']])
    #     curl.setopt(curl.URL,postmark_url +ns)
    #     curl.setopt(curl.SSL_VERIFYPEER, 0)
    #     curl.setopt(curl.SSL_VERIFYHOST, 0)
    #     curl.setopt(curl.UPLOAD, 1)
    #     curl.setopt(curl.CUSTOMREQUEST, "POST")
    #     buffer=BytesIO(nsparams.encode('utf-8'))
    #     curl.setopt(curl.READDATA,buffer)
    #     log.info(curl.getinfo(curl.EFFECTIVE_URL))
    #     curl.perform()
    #     responseCode=curl.getinfo(curl.RESPONSE_CODE)
    #     log.info(curl.getinfo(curl.RESPONSE_CODE))
    #     curl.close()
    #     return responseCode               

    # #Function for creating user...       
    # def create_user(self, provider, **kwargs):
    #     log.info("provider in create user: %s", provider)
    #     ns=kwargs['nsparams']
    #     nsparams=json.dumps(ns)
    #     log.info(nsparams)
    #     password="?password=" +kwargs['password']
    #     useracct=USER +password
    #     postmark_url = provider.auth_url 
    #     curl = pycurl.Curl()
    #     curl.setopt(pycurl.HTTPHEADER, ["Content-Type: application/json",kwargs['authHeaderToken']])
    #     curl.setopt(curl.URL,postmark_url +useracct)
    #     log.info(curl.getinfo(curl.EFFECTIVE_URL))
    #     curl.setopt(curl.SSL_VERIFYPEER, 0)
    #     curl.setopt(curl.SSL_VERIFYHOST, 0)
    #     curl.setopt(curl.UPLOAD, 1)
    #     buffer=BytesIO(nsparams.encode('utf-8'))
    #     curl.setopt(curl.READDATA,buffer)
    #     curl.perform()
    #     responseCode=curl.getinfo(curl.RESPONSE_CODE)
    #     log.info(curl.getinfo(curl.RESPONSE_CODE))
    #     curl.close()  
    #     return responseCode  

    # #Function for updating the user     
    # def update_user(self, provider, **kwargs):
    #     log.info("provider in create user: %s", provider)
    #     try:
    #         ns=kwargs['user']
    #         nsparams=json.dumps(ns)
    #         log.info(nsparams)
    #         password="?password=" +kwargs['password']
    #         useracct=USER +password
    #         postmark_url = provider.auth_url         
    #         curl = pycurl.Curl()
    #         curl.setopt(pycurl.HTTPHEADER, ["Content-Type: application/json",kwargs['authHeaderToken']])
    #         curl.setopt(curl.URL,postmark_url +useracct)
    #         log.info(curl.getinfo(curl.EFFECTIVE_URL))
    #         curl.setopt(curl.SSL_VERIFYPEER, 0)
    #         curl.setopt(curl.SSL_VERIFYHOST, 0)
    #         curl.setopt(curl.UPLOAD, 1)
    #         buffer=BytesIO(nsparams.encode('utf-8'))
    #         curl.setopt(curl.READDATA,buffer)
    #         curl.perform()
    #         responseCode=curl.getinfo(curl.RESPONSE_CODE)
    #         log.info(curl.getinfo(curl.RESPONSE_CODE))
    #         curl.close()
    #         log.info("Successfull updation of the user")    
    #     except curl.error as ex:
    #         (code,message)=ex
    #         status=404
    #         text=message
    #         log.info(message)

    # def modifyUserAcct(self, provider, **kwargs):
    #     log.info("provider in modify user account: %s", provider)
    #     try:
    #         ns=kwargs['user']
    #         nsparams=json.dumps(ns)
    #         log.info(nsparams)
    #         useracct=USER +kwargs['userName']
    #         postmark_url = provider.auth_url          
    #         curl = pycurl.Curl()
    #         curl.setopt(pycurl.HTTPHEADER, ["Content-Type: application/json",kwargs['authHeaderToken']])
    #         curl.setopt(curl.URL,postmark_url +useracct)
    #         log.info(curl.getinfo(curl.EFFECTIVE_URL))
    #         curl.setopt(curl.SSL_VERIFYPEER, 0)
    #         curl.setopt(curl.SSL_VERIFYHOST, 0)
    #         curl.setopt(curl.UPLOAD, 1)
    #         curl.setopt(curl.CUSTOMREQUEST, "POST")
    #         buffer=BytesIO(nsparams.encode('utf-8'))
    #         curl.setopt(curl.READDATA,buffer)
    #         curl.perform()
    #         log.info(curl.getinfo(pycurl.RESPONSE_CODE))
    #         curl.close()
    #     except curl.error as ex:
    #         (code,message)=ex
    #         status=404
    #         text=message
    #         log.info(message)        

    # #Function for changing user password
    # def change_userpwd(self, provider, **kwargs):
    #     log.info("provider in change user password: %s", provider)
    #     try:
    #         useracct=USER +kwargs['userName']+'/changePassword'
    #         postmark_url = provider.auth_url           
    #         curl = pycurl.Curl()
    #         curl.setopt(pycurl.HTTPHEADER, ["Content-Type: application/json",kwargs['authHeaderToken']])
    #         curl.setopt(curl.URL,postmark_url +useracct)
    #         print(curl.getinfo(curl.EFFECTIVE_URL))
    #         curl.setopt(curl.SSL_VERIFYPEER, 0)
    #         curl.setopt(curl.SSL_VERIFYHOST, 0)
    #         curl.setopt(curl.UPLOAD, 1)
    #         curl.setopt(curl.CUSTOMREQUEST, "POST")
    #         buffer=BytesIO(nsparams.encode('utf-8'))
    #         curl.setopt(curl.READDATA,buffer)
    #         curl.perform()
    #         print(curl.getinfo(pycurl.RESPONSE_CODE))
    #         curl.close()
    #     except curl.error as ex:
    #         (code,message)=ex
    #         status=404
    #         text=message
    #         log.info(message)        

    # #Function for data access permission for namespace...       
    # def dataAccessPermission(self,provider, **kwargs):
    #     log.info("provider in data access permissions: %s", provider)
    #     #try:
    #     nsPermissions=kwargs['namespacePermission']
    #     nsparams=json.dumps(nsPermissions)
    #     log.info(nsparams)
    #     permissions=USER+'/'+kwargs["userName"]+DATAACCESSPERM
    #     postmark_url = provider.auth_url           
    #     curl = pycurl.Curl()
    #     curl.setopt(pycurl.HTTPHEADER, ["Content-Type: application/json",kwargs['authHeaderToken']])
    #     curl.setopt(curl.URL,postmark_url +permissions)
    #     log.info(curl.getinfo(curl.EFFECTIVE_URL))
    #     curl.setopt(curl.SSL_VERIFYPEER, 0)
    #     curl.setopt(curl.SSL_VERIFYHOST, 0)
    #     curl.setopt(curl.UPLOAD, 1)
    #     curl.setopt(curl.CUSTOMREQUEST, "POST")
    #     buffer=BytesIO(nsparams.encode('utf-8'))
    #     curl.setopt(curl.READDATA,buffer)
    #     curl.perform()
    #     log.info(curl.getinfo(pycurl.RESPONSE_CODE))
    #     curl.close()
    #     # except curl.error as ex:
    #     #     (code,message)=ex
    #     #     status=404
    #     #     text=message
    #     #     log.info(message)

    # #Function for configuring protocol...       
    # def configureProtocol(self,provider, **kwargs):
    #     log.info("provider in configure protocol: %s", provider)
    #     try:
    #         nsProtocol=kwargs['configureProtocol']
    #         nsparams=json.dumps(nsProtocol)
    #         log.info(nsparams)
    #         postmark_url=provider.auth_url+ NS+'/'+kwargs['namespaceName']+PROT+'/'+kwargs['protocol']
    #         curl = pycurl.Curl()
    #         curl.setopt(pycurl.HTTPHEADER, ["Content-Type: application/json",kwargs['authHeaderToken']])
    #         curl.setopt(curl.URL,postmark_url)
    #         log.info(curl.getinfo(curl.EFFECTIVE_URL))
    #         curl.setopt(curl.SSL_VERIFYPEER, 0)
    #         curl.setopt(curl.SSL_VERIFYHOST, 0)
    #         curl.setopt(curl.UPLOAD, 1)
    #         curl.setopt(curl.CUSTOMREQUEST, "POST")
    #         buffer=BytesIO(nsparams.encode('utf-8'))
    #         curl.setopt(curl.READDATA,buffer)
    #         curl.perform()
    #         responseCode=curl.getinfo(curl.RESPONSE_CODE)
    #         log.info(curl.getinfo(curl.RESPONSE_CODE))
    #         curl.close()  
    #         return responseCode
    #     except curl.error as ex:
    #         (code,message)=ex
    #         status=404
    #         text=message
    #         log.info(message)

    # #Function for deleting namespace...       
    # def deleteNamespace(self,provider, **kwargs):
    #     postmark_url = provider.auth_url+TENANTURL+ kwargs['tenantName']+ NS+'/'+kwargs['bucket']         
    #     curl = pycurl.Curl()
    #     curl.setopt(pycurl.HTTPHEADER, ["Content-Type: application/json",kwargs['authHeaderToken']])
    #     curl.setopt(curl.URL,postmark_url)
    #     log.info(curl.getinfo(curl.EFFECTIVE_URL))
    #     curl.setopt(curl.SSL_VERIFYPEER, 0)
    #     curl.setopt(curl.SSL_VERIFYHOST, 0)
    #     curl.setopt(curl.CUSTOMREQUEST, "DELETE")
    #     curl.perform()
    #     responseCode=curl.getinfo(curl.RESPONSE_CODE)
    #     log.info(curl.getinfo(curl.RESPONSE_CODE))
    #     curl.close()
    #     return responseCode

    # #Function for deleting user...       
    # def deleteUser(provider, **kwargs):
    #     log.info("provider in delete user: %s", provider)
    #     try:
    #         postmark_url = provider.auth_url+TENANTURL+ USER+kwargs['userName']           
    #         curl = pycurl.Curl()
    #         curl.setopt(pycurl.HTTPHEADER, ["Content-Type: application/json",kwargs['authHeaderToken']])
    #         curl.setopt(curl.URL,postmark_url +permissions)
    #         print(curl.getinfo(curl.EFFECTIVE_URL))
    #         curl.setopt(curl.SSL_VERIFYPEER, 0)
    #         curl.setopt(curl.SSL_VERIFYHOST, 0)
    #         curl.setopt(curl.CUSTOMREQUEST, "DELETE")
    #         curl.perform()
    #         curl.close()
    #     except curl.error as ex:
    #         (code,message)=ex
    #         status=404
    #         text=message
    #         log.info(message)


