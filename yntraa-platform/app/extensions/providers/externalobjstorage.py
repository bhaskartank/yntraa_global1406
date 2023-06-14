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
import pycurl
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
#from app.modules import generateAuthToken

log = logging.getLogger(__name__)
NS='/namespaces'
PROT='/protocols'
USER='/userAccounts'
DATAACCESSPERM='/dataAccessPermissions'
TENANTURL='/mapi/tenants/'
AUTHCONSTANT="Authorization: HCP "
CEPHAUTHCONSTANT="Authorization: Bearer "
AUTHN_URL='https://ceph-dashboard.cloud.yntraa.com/api/auth'
CEPH_USER_URL='https://ceph-dashboard.cloud.yntraa.com/api/rgw/user'
CEPH_BUCKET_URL='https://ceph-dashboard.cloud.yntraa.com/api/rgw/bucket'

class ExternalObjStorageProvider(object):
    def __init__(self, app=None):
        if app:
            self.init_app(app)

    def init_app(self, app):
        return self
        
    def connect(self, provider):
        log.info("Inside connect")
        conn = None
        try:
            log.info(("provider in connect: %s", provider))
            #if provider.provider_name == 'F5 SDK':10.246.104.182
            conn = NativeAuthorization('api','api@1234')
            log.info(conn)
            t=Target("api.staasdl.yntraa.com",conn,port=8000)
            log.info(t)
            c = Connection(t)
            log.info(c)
            c.close()

        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )
        finally:
            pass
        return t

     #Function for getting connection...       
    def get_conn(self, provider, **kwargs):
        log.info("provider in list_lbs: %s", provider)
        try:
            conn = self.connect(provider)
            return 1
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )
    # #Function for creating tenant...       
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
    #         #curl.setopt(pycurl.READFUNCTION, filehandle.read)
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
    #         ns=kwargs['nsparams']
    #         nsparams=json.dumps(ns)
    #         log.info("Dumping the parameters")
    #         log.info(nsparams)
    #         postmark_url = provider.auth_url+TENANTURL+kwargs['tenantName']
    #         log.info(postmark_url)
    #         log.info("generating the token")
    #         curl = pycurl.Curl()
    #         authToken=generateAuthToken(provider.username,provider.password)
    #         log.info(authToken)
    #         auth=AUTHCONSTANT+authToken
    #         curl.setopt(pycurl.HTTPHEADER, ["Content-Type: application/json",auth])
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
    #     except curl.error as ex:
    #         (code,message)=ex
    #         status=404
    #         text=message
    #         log.info(message)

    # #Function for modifying namespace for a tenant...       
    # def modify_namespace(self, provider, **kwargs):
    #     log.info("provider in modify namespace: %s", provider)
    #     try:
    #         ns=kwargs['nsparams']
    #         nsparams=json.dumps(ns)
    #         log.info("Dumping the parameters")
    #         log.info(nsparams)
    #         postmark_url = provider.auth_url+TENANTURL+kwargs['tenantName']
    #         ns=NS+'/'+kwargs['nsName']
    #         log.info("generating the token")
    #         curl = pycurl.Curl()
    #         authToken=generateAuthToken(provider.username,provider.password)
    #         log.info(authToken)
    #         auth=AUTHCONSTANT+authToken
    #         curl.setopt(pycurl.HTTPHEADER, ["Content-Type: application/json",auth])
    #         curl.setopt(curl.URL,postmark_url +ns)
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
    #     except curl.error as ex:
    #         (code,message)=ex
    #         status=404
    #         text=message
    #         log.info(message)

    # #Function for creating bucket...       
    # def create_bucket(self, provider, **kwargs):
    #     log.info("provider in create bucket: %s", provider)
    #     try:
    #         bucket=kwargs['params']
    #         nsparams=json.dumps(bucket)
    #         postmark_url = CEPH_BUCKET_URL
    #         curl = pycurl.Curl()
    #         curl.setopt(pycurl.HTTPHEADER, ["Content-Type: application/json",kwargs['token']])
    #         curl.setopt(curl.URL,postmark_url)
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

    # #Function for delete bucket...       
    # def delete_bucket(self, provider, **kwargs):
    #     log.info("provider in delete bucket: %s", provider)
    #     try:
    #         postmark_url = 'https://ceph-dashboard.cloud.yntraa.com/api/rgw/bucket'+"/"+kwargs['bucket']
    #         curl = pycurl.Curl()
    #         curl.setopt(pycurl.HTTPHEADER, ["Content-Type: application/json",kwargs['token']])
    #         curl.setopt(curl.URL,postmark_url)
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

    # #Function for creating user and assiogning namespace...       
    # def create_user(self, provider, **kwargs):
    #     log.info("provider in create user: %s", provider)
    #     try:
    #         if provider.provider_name=="HCP SDK":
    #             ns=kwargs['user']
    #             nsparams=json.dumps(ns)
    #             log.info(nsparams)
    #             password="?password=" +kwargs['password']
    #             useracct=USER +password
    #             postmark_url = provider.auth_url+TENANTURL+kwargs['tenantName']
    #             authToken=generateAuthToken(provider.username, provider.password)
    #             auth=AUTHCONSTANT+authToken
    #             curl = pycurl.Curl()
    #             curl.setopt(pycurl.HTTPHEADER, ["Content-Type: application/json",auth])
    #             curl.setopt(curl.URL,postmark_url +useracct)
    #             log.info(curl.getinfo(curl.EFFECTIVE_URL))
    #             curl.setopt(curl.SSL_VERIFYPEER, 0)
    #             curl.setopt(curl.SSL_VERIFYHOST, 0)
    #             curl.setopt(curl.UPLOAD, 1)
    #             buffer=BytesIO(nsparams.encode('utf-8'))
    #             curl.setopt(curl.READDATA,buffer)
    #             curl.perform()
    #             responseCode=curl.getinfo(curl.RESPONSE_CODE)
    #             log.info(curl.getinfo(curl.RESPONSE_CODE))
    #             curl.close()
    #         elif provider.provider_name=="CEPH SDK":
    #             log.info("For creating a ceph user")
    #             ns=kwargs['user']
    #             nsparams=json.dumps(ns)
    #             log.info(nsparams)
    #             postmark_url = CEPH_USER_URL
    #             curl = pycurl.Curl()
    #             curl.setopt(pycurl.HTTPHEADER, ["Content-Type: application/json",kwargs['token']])
    #             curl.setopt(curl.URL,postmark_url)
    #             log.info(curl.getinfo(curl.EFFECTIVE_URL))
    #             curl.setopt(curl.SSL_VERIFYPEER, 0)
    #             curl.setopt(curl.SSL_VERIFYHOST, 0)
    #             curl.setopt(curl.UPLOAD, 1)
    #             curl.setopt(curl.CUSTOMREQUEST, "POST")
    #             buffer=BytesIO(nsparams.encode('utf-8'))
    #             demo=BytesIO()
    #             curl.setopt(curl.READDATA,buffer)
    #             curl.setopt(curl.WRITEFUNCTION,demo.write)
    #             curl.perform()
    #             x=json.loads(demo.getvalue())
    #             log.info(x)
    #             retParams={}
    #             userData=x['keys']
    #             log.info(userData)
    #             for uD in userData:
    #                 retParams={
    #                 "access_key":uD["access_key"],
    #                 "secret_key":uD["secret_key"]
    #                 }
    #             curl.close()
    #             return retParams    
    #     except curl.error as ex:
    #         (code,message)=ex
    #         status=404
    #         text=message
    #         log.info(message)

    # #Function for creating user and assiogning namespace...       
    # def update_user(self, provider, **kwargs):
    #     log.info("provider in create user: %s", provider)
    #     try:
    #         if provider.provider_name=="HCP SDK":
    #             ns=kwargs['user']
    #             nsparams=json.dumps(ns)
    #             log.info(nsparams)
    #             password="?password=" +kwargs['password']
    #             useracct=USER +password
    #             postmark_url = provider.auth_url+TENANTURL+kwargs['tenantName']
    #             authToken=generateAuthToken(provider.username, provider.password)
    #             auth=AUTHCONSTANT+authToken
    #             curl = pycurl.Curl()
    #             curl.setopt(pycurl.HTTPHEADER, ["Content-Type: application/json",auth])
    #             curl.setopt(curl.URL,postmark_url +useracct)
    #             log.info(curl.getinfo(curl.EFFECTIVE_URL))
    #             curl.setopt(curl.SSL_VERIFYPEER, 0)
    #             curl.setopt(curl.SSL_VERIFYHOST, 0)
    #             curl.setopt(curl.UPLOAD, 1)
    #             buffer=BytesIO(nsparams.encode('utf-8'))
    #             curl.setopt(curl.READDATA,buffer)
    #             curl.perform()
    #             responseCode=curl.getinfo(curl.RESPONSE_CODE)
    #             log.info(curl.getinfo(curl.RESPONSE_CODE))
    #             curl.close()
    #         elif provider.provider_name=="CEPH SDK":
    #             log.info("For updating a ceph user")
    #             ns=kwargs['user']
    #             nsparams=json.dumps(ns)
    #             log.info(nsparams)
    #             postmark_url = CEPH_USER_URL+"/"+kwargs['username']
    #             curl = pycurl.Curl()
    #             curl.setopt(pycurl.HTTPHEADER, ["Content-Type: application/json",kwargs['token']])
    #             curl.setopt(curl.URL,postmark_url)
    #             log.info(curl.getinfo(curl.EFFECTIVE_URL))
    #             curl.setopt(curl.SSL_VERIFYPEER, 0)
    #             curl.setopt(curl.SSL_VERIFYHOST, 0)
    #             curl.setopt(curl.UPLOAD, 1)
    #             curl.setopt(curl.CUSTOMREQUEST, "PUT")
    #             buffer=BytesIO(nsparams.encode('utf-8'))
    #             demo=BytesIO()
    #             curl.setopt(curl.READDATA,buffer)
    #             curl.setopt(curl.WRITEFUNCTION,demo.write)
    #             curl.perform()
    #             curl.close()
    #             log.info("Successfull updation of the user")    
    #     except curl.error as ex:
    #         (code,message)=ex
    #         status=404
    #         text=message
    #         log.info(message)        

    # #Function for delete user...       
    # def delete_user(self, provider, **kwargs):
    #     log.info("provider in delete user: %s", provider)
    #     try:
    #         postmark_url = CEPH_USER_URL+"/"+kwargs['user']
    #         curl = pycurl.Curl()
    #         curl.setopt(pycurl.HTTPHEADER, ["Content-Type: application/json",kwargs['token']])
    #         curl.setopt(curl.URL,postmark_url)
    #         log.info(curl.getinfo(curl.EFFECTIVE_URL))
    #         curl.setopt(curl.SSL_VERIFYPEER, 0)
    #         curl.setopt(curl.SSL_VERIFYHOST, 0)
    #         curl.setopt(curl.CUSTOMREQUEST, "DELETE")
    #         log.info("delete here")
    #         curl.perform()
    #         curl.close()   
    #     except curl.error as ex:
    #         (code,message)=ex
    #         status=404
    #         text=message
    #         log.info(message)

    # def get_cephtoken(self,provider):
    #     # try:
    #     log.info("setting the ceph token")
    #     auth_url = AUTHN_URL
    #     cred={
    #     "username":provider.username,
    #     "password":provider.password
    #     }
    #     log.info(cred)
    #     credparams=json.dumps(cred)
    #     curl = pycurl.Curl()
    #     curl.setopt(pycurl.HTTPHEADER, ["Content-Type:application/json"])
    #     curl.setopt(curl.URL,auth_url)
    #     log.info(curl.getinfo(curl.EFFECTIVE_URL))
    #     curl.setopt(curl.SSL_VERIFYPEER, 0)
    #     curl.setopt(curl.SSL_VERIFYHOST, 0)
    #     curl.setopt(curl.UPLOAD, 1)
    #     curl.setopt(curl.CUSTOMREQUEST, "POST")
    #     demo=BytesIO()
    #     buffer=BytesIO(credparams.encode('utf-8'))
    #     curl.setopt(curl.READDATA,buffer)
    #     curl.setopt(curl.WRITEFUNCTION, demo.write)
    #     curl.perform()
    #     tex=json.loads(demo.getvalue())
    #     log.info("obtained the ceph token")
    #     authToken=tex["token"]
    #     curl.close()
    #     return authToken
    #     # except curl.error as ex:
    #     #     (code,message)=ex
    #     #     status=404
    #     #     text=message
    #     #     log.info(message)
    # #Function for modifying user account
    # def modifyUserAcct(self, provider, **kwargs):
    #     log.info("provider in modify user account: %s", provider)
    #     try:
    #         ns=kwargs['user']
    #         nsparams=json.dumps(ns)
    #         log.info(nsparams)
    #         useracct=USER +kwargs['userName']
    #         postmark_url = provider.auth_url+TENANTURL+kwargs['tenantName']
    #         authToken=generateAuthToken(provider.username, provider.password)
    #         auth=AUTHCONSTANT+authToken
    #         curl = pycurl.Curl()
    #         curl.setopt(pycurl.HTTPHEADER, ["Content-Type: application/json",auth])
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
    #         postmark_url = provider.auth_url+TENANTURL+kwargs['tenantName']
    #         authToken=generateAuthToken(provider.username, provider.password)
    #         auth=AUTHCONSTANT+authToken
    #         curl = pycurl.Curl()
    #         curl.setopt(pycurl.HTTPHEADER, ["Content-Type: application/json",auth])
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
    #     try:
    #         nsPermissions=kwargs['namespacePermission']
    #         nsparams=json.dumps(nsPermissions)
    #         log.info(nsparams)
    #         permissions=USER+'/'+kwargs["userName"]+DATAACCESSPERM
    #         postmark_url = provider.auth_url+TENANTURL+kwargs['tenantName']
    #         authToken=generateAuthToken(provider.username, provider.password)
    #         auth=AUTHCONSTANT+authToken
    #         curl = pycurl.Curl()
    #         curl.setopt(pycurl.HTTPHEADER, ["Content-Type: application/json",auth])
    #         curl.setopt(curl.URL,postmark_url +permissions)
    #         log.info(curl.getinfo(curl.EFFECTIVE_URL))
    #         curl.setopt(curl.SSL_VERIFYPEER, 0)
    #         curl.setopt(curl.SSL_VERIFYHOST, 0)
    #         curl.setopt(curl.UPLOAD, 1)
    #         curl.setopt(curl.CUSTOMREQUEST, "POST")
    #         buffer=BytesIO(nsparams.encode('utf-8'))
    #         curl.setopt(curl.READDATA,buffer)
    #         curl.perform()
    #         log.info(curl.getinfo(pycurl.RESPONSE_CODE))
    #         log.info("sbgjdgdsja")
    #         curl.close()
    #     except curl.error as ex:
    #         (code,message)=ex
    #         status=404
    #         text=message
    #         log.info(message)

    # #Function for configuring protocol...       
    # def configureProtocol(self,provider, **kwargs):
    #     log.info("provider in configure protocol: %s", provider)
    #     try:
    #         nsPermissions=kwargs['configureProtocol']
    #         nsparams=json.dumps(nsPermissions)
    #         log.info(nsparams)
    #         postmark_url=provider.auth_url+TENANTURL+kwargs['tenantName']+ NS+'/'+kwargs['namespaceName']+PROT+'/'+kwargs['protocol']
    #         authToken=generateAuthToken(provider.username, provider.password)
    #         auth=AUTHCONSTANT+authToken
    #         log.info(auth)
    #         curl = pycurl.Curl()
    #         curl.setopt(pycurl.HTTPHEADER, ["Content-Type: application/json",auth])
    #         curl.setopt(curl.URL,postmark_url)
    #         log.info(curl.getinfo(curl.EFFECTIVE_URL))
    #         curl.setopt(curl.SSL_VERIFYPEER, 0)
    #         curl.setopt(curl.SSL_VERIFYHOST, 0)
    #         curl.setopt(curl.UPLOAD, 1)
    #         curl.setopt(curl.CUSTOMREQUEST, "POST")
    #         buffer=BytesIO(nsparams.encode('utf-8'))
    #         curl.setopt(curl.READDATA,buffer)
    #         #curl.perform()
    #         log.info(curl.getinfo(pycurl.RESPONSE_CODE))
    #         curl.close()
    #     except curl.error as ex:
    #         (code,message)=ex
    #         status=404
    #         text=message
    #         log.info(message)

    # #Function for deleting namespace...       
    # def deleteNamespace(provider, **kwargs):
    #     log.info("provider in delete namespace: %s", provider)
    #     try:
    #         postmark_url = provider.auth_url+TENANTURL+ NS+kwargs['namespaceName']
    #         authToken=generateAuthToken(provider.username, provider.password)
    #         auth=AUTHCONSTANT+authToken
    #         curl = pycurl.Curl()
    #         curl.setopt(pycurl.HTTPHEADER, ["Content-Type: application/json",auth])
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

    # #Function for deleting user...       
    # def deleteUser(provider, **kwargs):
    #     log.info("provider in delete user: %s", provider)
    #     try:
    #         postmark_url = provider.auth_url+TENANTURL+ USER+kwargs['userName']
    #         authToken=generateAuthToken(provider.username, provider.password)
    #         auth=AUTHCONSTANT+authToken
    #         curl = pycurl.Curl()
    #         curl.setopt(pycurl.HTTPHEADER, ["Content-Type: application/json",auth])
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


