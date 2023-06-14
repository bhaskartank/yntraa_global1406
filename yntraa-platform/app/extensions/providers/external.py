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
import os
import types
from flask_login import current_user
from flask_restplus_patched import Resource
from flask_restplus_patched._http import HTTPStatus
from app.extensions.api import Namespace, abort
import sqlalchemy
import os
from app.extensions import api, db
from f5.bigip import ManagementRoot
from f5.bigip.tm.cm import Cm
from f5.bigip.tm.cm.device import Devices

log = logging.getLogger(__name__)

class ExternalProvider(object):
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
            conn = ManagementRoot(provider.auth_url, provider.username, provider.password,port=443)
            log.info(("conn: %s", conn))
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )
        finally:
            pass
        return conn

    def create_virtual_server(self, provider, **kwargs):
        retMessage=None
        try:
            log.info("Inside create virtual server method")
            mgmt = self.connect(provider)
            ltm = mgmt.tm.ltm
            log.info(kwargs)
            ltm.virtuals.virtual.create(**kwargs)
            log.info("Successful creation operation for VS")
            retMessage="Virtual Server created successfully"
            return retMessage
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def add_attach_traffic_group(self, provider, **kwargs):
        retMessage=None
        try:
            log.info("Inside attach traffic group method")
            mgmt = self.connect(provider)
            ltm = mgmt.tm.ltm
            log.info(kwargs)
            vac=ltm.virtual_address_s
            if vac.virtual_address.exists(name=kwargs['name'], partition=kwargs['partition']):
                va=vac.virtual_address.load(name=kwargs['name'], partition=kwargs['partition'])
                va.update(trafficGroup=kwargs['trafficGroup'])
            else:
                 va=vac.virtual_address.create(**kwargs)  
            log.info("Successful attached traffic group")
            retMessage="Traffic group attached successfully"
            return retMessage
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )  

    def add_protocol_profile(self, provider, **kwargs):
        retMessage=None
        try:
            log.info("Inside attach protocol profile method")
            mgmt = self.connect(provider)
            ltm = mgmt.tm.ltm
            log.info(kwargs)
            vs=ltm.virtuals.virtual
            v1=vs.load(name=kwargs['vsname'],partition=kwargs['partition'])
            v1.profiles_s.profiles.update(name=kwargs['name'],
                                        partition=kwargs['partition'],
                                        context=kwargs['context']) 
            log.info("Successful attached protocol profile")
            retMessage="Protocol profile attached successfully"
            return retMessage
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )                  

    def delete_virtual_server(self, provider,**kwargs):
        retMessage=None
        try:
            log.info("Inside delete virtual server method")
            mgmt = self.connect(provider)
            ltm = mgmt.tm.ltm
            if ltm.virtuals.virtual.exists(partition=kwargs['partition'], name=kwargs['name']):
                virtual = ltm.virtuals.virtual.load(
                partition=kwargs['partition'], name=kwargs['name'])
                virtual.delete()
                retMessage="successfully deleted the virtual server"
            else:
                print("Virtual server does not exist")
                retMessage="The server you are trying to delete doesn't exist/has already been deleted"
            return retMessage 

        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def list_vlans(self, provider, **kwargs):
        log.info("provider in list_vlans: %s", provider)
        try:
            mgmt = self.connect(provider)
            vc = mgmt.tm.net.vlans
            #Calling the get collection function for getting the list
            vlans=vc.get_collection()
            return vlans
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )
    def create_vlan(self, provider, **kwargs):
        try:
            log.info("Inside create vlan method")
            mgmt = self.connect(provider)
            vc = mgmt.tm.net.vlans.vlan
            log.info(kwargs)
            vc.create(**kwargs)
            log.info("Successful creation operation for vlan")
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )
    def delete_vlan(self, provider,**kwargs):
        try:
            log.info("Inside delete vlan method")
            mgmt = self.connect(provider)
            vc = mgmt.tm.net.vlans
            if vc.vlan.exists(partition=kwargs['partition'], name=kwargs['name']):
                vlan = vc.vlan.load(partition=kwargs['partition'], name=kwargs['name'])
                vlan.delete()
            else:
                print("The VLAN does not exist")

        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )        

    #Function for getting the list of virtual servers present in Big IP cluster.  
    def list_virtual_servers_tg(self, provider, **kwargs):
        try:
            mgmt = self.connect(provider)
            ltm = mgmt.tm.ltm
            # What virtual servers are on this F5?
            vas = ltm.virtual_address_s.get_collection()
            return vas        
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )


    #Function for getting the list of virtual servers present in Big IP cluster.  
    def list_virtual_servers(self, provider, **kwargs):
        try:
            mgmt = self.connect(provider)
            ltm = mgmt.tm.ltm
            # What virtual servers are on this F5?
            vas = ltm.virtuals.get_collection()
            return vas       
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )


    #Function for getting the list of virtual servers present in Big IP cluster.  
    def list_virtual_servers_profile(self, provider, **kwargs):
        try:
            mgmt = self.connect(provider)
            vs = mgmt.tm.ltm.virtuals.virtual
            v1=vs.load(**kwargs)
            # What virtual servers profiles are on this F5?
            log.info("Going to get profiles")
            virtuals = v1.profiles_s.get_collection()
            log.info("Got the profiles")
            return virtuals
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )    
        
    #Function for getting the list of devices present in Big IP cluster.        
    def list_lbs(self, provider, **kwargs):
        log.info("provider in list_lbs: %s", provider)
        try:
            conn = self.connect(provider)
            #Calling the get collection function of the device module
            devices= conn.tm.cm.devices.get_collection()
            return devices
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def list_pools(self, provider, **kwargs):
        log.info("provider in list_lbs: %s", provider)
        try:
            mgmt = self.connect(provider)
            ltm = mgmt.tm.ltm
            #Calling the get collection function for getting the list
            pools=ltm.pools.get_collection()
            return pools
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )
    def create_pool(self, provider, **kwargs):

        retMessage=None
        try:
            log.info("Inside create pool method")
            mgmt = self.connect(provider)
            ltm = mgmt.tm.ltm
            log.info(kwargs)
            ltm.pools.pool.create(**kwargs)
            log.info("Successful creation operation for pool")
            retMessage="Successful creation operation for pool"
            return retMessage
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )
    #Th VS needs to be deleted first with which the pool is associated        
    def delete_pool(self, provider,**kwargs):
        retMessage=None
        try:
            log.info("Inside delete pool method")
            mgmt = self.connect(provider)
            ltm = mgmt.tm.ltm
            if ltm.pools.pool.exists(name=kwargs['name']):
                pool = ltm.pools.pool.load(name=kwargs['name'])
                pool.delete()
                retMessage="successfully deleted the pool"
            else:
                print("Pool does not exist")
                retMessage="Pool doesnt exist/already been deleted"
            return retMessage    
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )
    #The following method discusses how to add node to a pool
    #This method will be called in the case where the node list parameter is not empty        
    def add_node_to_pool(self,provider,**kwargs):
        #There are two methods of addition of node to a pool
        #First by creating a new node and adding it to pool
        #second by adding an existing node to the pool
        #First method implementation will be done by creating a node
        #and adding its entry to the DB/pushing it to big ip server
        #While second method is implemented by getting the node details
        #either from the DB or from the big IP server.

        log.info("Going to add node to a pool")
        retMessage=None
        try:
            log.info("Inside create pool method")
            mgmt = self.connect(provider)
            ltm = mgmt.tm.ltm
            log.info(kwargs)
            log.info("Inside get pool method for adding members")
            pool = ltm.pools.pool.load(name=kwargs['name'])
            #Current implementation is for single node addition. 
            log.info(kwargs)                            
            pool.members_s.members.create(partition='Common', name=kwargs['nodeName'])
            retMessage="Successful pool creation with the adition of node" 

            return retMessage      
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    #The following method discusses how to remove node from a pool
    #This method will be called in the case where the node list parameter is not empty        
    def remove_node_from_pool(self,provider,**kwargs):
        #Removing of node from pool

        log.info("Going to remove node to a pool")
        retMessage=None
        try:
            log.info("Inside remove pool method")
            mgmt = self.connect(provider)
            ltm = mgmt.tm.ltm
            log.info(kwargs)
            log.info("Inside remove node method for Removing members")
            pool = ltm.pools.pool.load(name=kwargs['name'])
            #Current implementation is for single node addition.                           
            member=pool.members_s.members.load( name=kwargs['nodeName'],partition='Common')
            member.delete()
            retMessage="Successful member removal from pool" 

            return retMessage      
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )        


    def list_nodes(self, provider, **kwargs):
        log.info("provider in list_nodes: %s", provider)
        try:
            mgmt = self.connect(provider)
            ltm = mgmt.tm.ltm
            #Calling the get collection function for getting the list
            nodes=ltm.nodes.get_collection()
            return nodes
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )
    def create_node(self, provider, **kwargs):
        retMessage=None
        try:
            log.info("Inside create node method")
            mgmt = self.connect(provider)
            ltm = mgmt.tm.ltm
            log.info(kwargs)
            ltm.nodes.node.create(**kwargs)
            log.info("Successful creation operation for node")
            retMessage="Node successfully created"
            return retMessage

        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )
    def delete_node(self, provider,**kwargs):
        try:
            log.info("Inside delete node method")
            mgmt = self.connect(provider)
            ltm = mgmt.tm.ltm
            if ltm.nodes.node.exists(partition=kwargs['partition'], name=kwargs['name']):
                node = ltm.nodes.node.load(partition=kwargs['partition'], name=kwargs['name'])
                node.delete()
            else:
                print("Node does not exist")

        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def list_client_profiles(self, provider, **kwargs):
        try:
            log.info("Inside list profile method")
            mgmt = self.connect(provider)
            sslclientprofiles = mgmt.tm.ltm.profile.client_ssls.get_collection()
            return sslclientprofiles
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def list_tcp_profiles(self, provider, **kwargs):
        try:
            log.info("Inside list tcp profile method")
            mgmt = self.connect(provider)
            profiles = mgmt.tm.ltm.profile.tcps.get_collection()
            return profiles
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def list_udp_profiles(self, provider, **kwargs):
        try:
            log.info("Inside list udp profile method")
            mgmt = self.connect(provider)
            profiles = mgmt.tm.ltm.profile.udps.get_collection()
            return profiles
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )        
    
    def list_sctp_profiles(self, provider, **kwargs):
        try:
            log.info("Inside list sctp profile method")
            mgmt = self.connect(provider)
            profiles = mgmt.tm.ltm.profile.sctps.get_collection()
            return profiles
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            ) 

    def list_fastl4_profiles(self, provider, **kwargs):
        try:
            log.info("Inside list fastl4 profile method")
            mgmt = self.connect(provider)
            profiles = mgmt.tm.ltm.profile.fastl4s.get_collection()
            return profiles
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def list_fasthttp_profiles(self, provider, **kwargs):
        try:
            log.info("Inside list fasthttp profile method")
            mgmt = self.connect(provider)
            profiles = mgmt.tm.ltm.profile.fasthttps.get_collection()
            return profiles
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )
    def list_others_profiles(self, provider, **kwargs):
        try:
            log.info("Inside list others profile method")
            mgmt = self.connect(provider)
            profiles = mgmt.tm.ltm.profile.http-proxy-connect.get_collection()
            log.info(profiles.__dict__)
            for prof in profiles:
                log.info(prof.__dict__)
            return profiles
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )                                                  
    def create_client_profile(self, provider, **kwargs):

        try:
            log.info("Inside create client profile method")
            mgmt = self.connect(provider)
            headerK="-----BEGIN RSA PRIVATE KEY-----\n"
            keytext=kwargs['keytext']
            footerK="\n-----END RSA PRIVATE KEY-----"

            headerC="-----BEGIN CERTIFICATE-----\n"
            certtext=kwargs['certtext']
            footerC="\n-----END CERTIFICATE-----"

            finalkeytext=headerK+keytext+footerK
            finalcerttext=headerC+certtext+footerC

            ntf_key = NamedTemporaryFile(mode='w+b',suffix='.key', delete=False)
            ntf_key_basename = os.path.basename(ntf_key.name)
            keyval=crypto.load_privatekey(crypto.FILETYPE_PEM, finalkeytext)
            ntf_key.write(crypto.dump_privatekey(crypto.FILETYPE_PEM, keyval))
            ntf_key_sourcepath = 'file:/var/config/rest/downloads/{0}'.format(
            ntf_key_basename)
            ntf_key.seek(0)

            ntf_cert = NamedTemporaryFile(mode='w+b',suffix='.crt', delete=False)
            ntf_cert_basename = os.path.basename(ntf_cert.name)
            certval=crypto.load_certificate(crypto.FILETYPE_PEM, finalcerttext)
            ntf_cert.write(crypto.dump_certificate(crypto.FILETYPE_PEM, certval))
            ntf_cert_sourcepath = 'file:/var/config/rest/downloads/{0}'.format(
            ntf_cert_basename)
            ntf_cert.seek(0)

            uploader = mgmt.shared.file_transfer.uploads
            uploader.upload_file(ntf_key.name)
            uploader.upload_file(ntf_cert.name)

            log.info("Above steps done*************")
            key = mgmt.tm.sys.file.ssl_keys.ssl_key.create(
                name=kwargs['name']+".key", 
                partition="Common",
                sourcePath=ntf_key_sourcepath)

            cert = mgmt.tm.sys.file.ssl_certs.ssl_cert.create(name=kwargs['name']+".crt",partition="Common",sourcePath=ntf_cert_sourcepath)
            certName="/Common/"+kwargs['name']+".crt"
            keyName="/Common/"+kwargs['name']+".key"
            profile_name=kwargs['name']+"-default-clientssl"
            chain = [{'name': kwargs['name'] ,
                    'cert': certName,
                    'key': keyName}]
            ssl_client_profile = mgmt.tm.ltm.profile.client_ssls.client_ssl
            ssl_client_profile.create(name=profile_name, certKeyChain=chain)
            log.info("Successful creation operation for client profile along with cert and key")
            return "successfully created the client profile"
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )
    def delete_client_profile(self, provider,**kwargs):
        try:
            log.info("Inside delete client profile method")
            mgmt = self.connect(provider)
            sslclientprofiles = mgmt.tm.ltm.profile.client_ssls.get_collection()
            for sscp in sslclientprofiles:
                if sscp.name ==kwargs['name'] and sscp.partition==kwargs['partition']:
                    sscp.delete()
                    return "successfully deleted the client profile"

        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    #Function for getting the list of virtual servers present in Big IP cluster.  
    def update_virtual_servers(self, provider, **kwargs):
        try:
            mgmt = self.connect(provider)
            ltm = mgmt.tm.ltm
            # What virtual servers are on this F5?
            vas = ltm.virtuals.get_collection()
            for va in vas:
                if va.name=="demonewvs":
                    va.modify(pool="newpool")
            return vas       
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )        

    def delete_cookie_persistent_profile(self, provider,**kwargs):
        try:
            log.info("Inside delete cookie based persistent profile method")
            mgmt = self.connect(provider)
            persistenceprofiles = mgmt.tm.ltm.persistence.cookies.get_collection()
            for pp in persistenceprofiles:
                if pp.name ==kwargs['name'] and pp.partition==kwargs['partition']:
                    pp.delete()
                    return "successfully deleted the cookie persistence profile"

        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def delete_cookie_persistent_profile(self, provider,**kwargs):
        try:
            log.info("Inside delete cookie based persistent profile method")
            mgmt = self.connect(provider)
            persistenceprofiles = mgmt.tm.ltm.persistence.source_addrs.get_collection()
            for pp in persistenceprofiles:
                if pp.name ==kwargs['name'] and pp.partition==kwargs['partition']:
                    pp.delete()
                    return "successfully deleted the ip based persistence profile"

        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )                

    def list_server_profiles(self, provider, **kwargs):
        try:
            log.info("Inside list server profile method")
            mgmt = self.connect(provider)
            sslserverprofiles = mgmt.tm.ltm.profile.server_ssls.get_collection()
            return sslserverprofiles
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def delete_server_profile(self, provider,**kwargs):
        try:
            log.info("Inside delete server profile method")
            mgmt = self.connect(provider)
            sslserverprofiles = mgmt.tm.ltm.profile.server_ssls.get_collection()
            for sscp in sslserverprofiles:
                if sscp.name ==kwargs['name'] and sscp.partition==kwargs['partition']:
                    sscp.delete()
                    return "successfully deleted the server profile"
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            ) 

    def create_server_profile(self, provider, **kwargs):

        try:
            log.info("Inside create server profile method")
            mgmt = self.connect(provider)
            ssl_server_profile = mgmt.tm.ltm.profile.server_ssls.server_ssl
            ssl_server_profile.create(**kwargs)
            log.info("Successful creation operation for server profile")
            return "successfully created the server profile"
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )              

    def list_https_profiles(self, provider, **kwargs):
        try:
            log.info("Inside list Https profile method")
            mgmt = self.connect(provider)
            httpprofiles = mgmt.tm.ltm.profile.https.get_collection()
            return httpprofiles
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def list_traffic_groups(self, provider, **kwargs):
        try:
            log.info("Inside list traffic groups method")
            mgmt = self.connect(provider)
            httpprofiles = mgmt.tm.cm.traffic_groups.get_collection()
            return httpprofiles
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )
    
    def delete_ssl_cert(self, provider, **kwargs):
        try:
            log.info("Inside list ssl certs method")
            mgmt = self.connect(provider)
            certs = mgmt.tm.sys.file.ssl_certs.get_collection()
            for cert in certs:
                if cert.name ==kwargs['name']:
                    cert.delete()
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )
    def delete_ssl_key(self, provider, **kwargs):
        try:
            log.info("Inside list ssl certs method")
            mgmt = self.connect(provider)
            keys = mgmt.tm.sys.file.ssl_keys.get_collection()
            for key in keys:
                if key.name ==kwargs['name']:
                    key.delete()
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def list_ssl_certs(self, provider, **kwargs):
        try:
            log.info("Inside list ssl certs method")
            mgmt = self.connect(provider)
            httpprofiles = mgmt.tm.sys.file.ssl_certs.get_collection()
            return httpprofiles
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )                
    def create_ssl__cert_n_key(self, provider, **kwargs):
        try:
            log.info("Inside create ssl keys method")
            mgmt = self.connect(provider)
            headerK="-----BEGIN RSA PRIVATE KEY-----\n"
            keytext=kwargs['keytext']
            footerK="\n-----END RSA PRIVATE KEY-----"

            headerC="-----BEGIN CERTIFICATE-----\n"
            certtext=kwargs['certtext']
            footerC="\n-----END CERTIFICATE-----"

            finalkeytext=headerK+keytext+footerK
            finalcerttext=headerC+certtext+footerC

            ntf_key = NamedTemporaryFile(mode='w+b',suffix='.key', delete=False)
            ntf_key_basename = os.path.basename(ntf_key.name)
            keyval=crypto.load_privatekey(crypto.FILETYPE_PEM, finalkeytext)
            ntf_key.write(crypto.dump_privatekey(crypto.FILETYPE_PEM, keyval))
            ntf_key_sourcepath = 'file:/var/config/rest/downloads/{0}'.format(
            ntf_key_basename)
            ntf_key.seek(0)

            ntf_cert = NamedTemporaryFile(mode='w+b',suffix='.crt', delete=False)
            ntf_cert_basename = os.path.basename(ntf_cert.name)
            certval=crypto.load_certificate(crypto.FILETYPE_PEM, finalcerttext)
            ntf_cert.write(crypto.dump_certificate(crypto.FILETYPE_PEM, certval))
            ntf_cert_sourcepath = 'file:/var/config/rest/downloads/{0}'.format(
            ntf_cert_basename)
            ntf_cert.seek(0)

            uploader = mgmt.shared.file_transfer.uploads
            uploader.upload_file(ntf_key.name)
            uploader.upload_file(ntf_cert.name)

            log.info("Above steps done*************")
            key = mgmt.tm.sys.file.ssl_keys.ssl_key.create(
                name=kwargs['name']+".key", 
                partition=kwargs['partition'],
                sourcePath=ntf_key_sourcepath)

            cert = mgmt.tm.sys.file.ssl_certs.ssl_cert.create(name=kwargs['name']+".crt", partition=kwargs['partition'],sourcePath=ntf_cert_sourcepath)

            return "Successfully created the key and certificate"
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )              

    def list_ssl_keys(self, provider, **kwargs):
        try:
            log.info("Inside list ssl keys method")
            mgmt = self.connect(provider)
            httpprofiles = mgmt.tm.sys.file.ssl_keys.get_collection()
            return httpprofiles
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )                        

    def create_traffic_group(self, provider, **kwargs):
        try:
            log.info("Inside create traffic groups method")
            mgmt = self.connect(provider)
            tg = mgmt.tm.cm.traffic_groups.traffic_group
            log.info("Creating traffic group")
            tg.create(**kwargs)
            log.info("Successful creation operation for traffic group")
            return "successfully created the traffic group"
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )                  

    def create_ipbased_persistent_profile(self, provider, **kwargs):
        try:
            mgmt = self.connect(provider)
            persistent_prof = mgmt.tm.ltm.persistence.source_addrs.source_addr
            log.info("Creating ip based persistent profile method")
            persistent_prof.create(**kwargs)
            log.info("Successful creation operation for persistent profile of IP based type")
            return "successfully created the ip based persistent profile profile"
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def create_cookiebased_persistent_profile(self, provider, **kwargs):
        try:
            log.info("Inside list cookie based persistent profile method")
            mgmt = self.connect(provider)
            persistent_prof = mgmt.tm.ltm.persistence.cookies.cookie
            persistent_prof.create(**kwargs)
            log.info("Successful creation operation for persistent profile of Cookie based type")
            return "successfully created the cookie based persistent profile profile"
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def list_persistent_profiles(self, provider, **kwargs):
        try:
            log.info("Inside list cookie based persistent profile method")
            mgmt = self.connect(provider)
            persistent_prof = mgmt.tm.ltm.persistence.cookies
            prof=persistent_prof.get_collection(**kwargs)
            log.info("Successful creation operation for persistent profile of Cookie based type")
            return prof
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )        

    def create_http_profile(self, provider, **kwargs):

        try:
            log.info("Inside create http profile method")
            mgmt = self.connect(provider)
            http_profile = mgmt.tm.ltm.profile.https.http
            http_profile.create(**kwargs)
            log.info("Successful creation operation for http profile")
            return "successfully created the http profile"
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )               

    def delete_http_profile(self, provider,**kwargs):
        try:
            log.info("Inside delete http profile method")
            mgmt = self.connect(provider)
            httpprofiles = mgmt.tm.ltm.profile.https.get_collection()
            for sscp in httpprofiles:
                if sscp.name ==kwargs['name'] and sscp.partition==kwargs['partition']:
                    sscp.delete()
                    return "successfully deleted the http profile"

        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            ) 

    def create_snat_translation(self, provider, **kwargs):

        try:
            log.info("Inside create snat translation method")
            mgmt = self.connect(provider)
            mgmt.tm.ltm.snat_translations.snat_translation.create(**kwargs)
            log.info("Successful creation operation for snat translation")
            return "successfully created the snat translation"
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )            

    def list_snat_translation(self, provider, **kwargs):
        try:
            log.info("Inside list snat translation method")
            mgmt = self.connect(provider)
            snats = mgmt.tm.ltm.snat_translations.get_collection()
            return snats
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def delete_snat_translation(self, provider,**kwargs):
        try:
            log.info("Inside delete snat translation method")
            mgmt = self.connect(provider)
            if mgmt.tm.ltm.snat_translations.snat_translation.exists(**kwargs):
                snat=mgmt.tm.ltm.snat_translations.snat_translation.load(**kwargs)
                snat.delete()
                return "successfully deleted the snat translation"

        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def create_snat_pool(self, provider, **kwargs):

        try:
            log.info("Inside create snat pool method")
            mgmt = self.connect(provider)
            mgmt.tm.ltm.snatpools.snatpool.create(**kwargs)
            log.info("Successful creation operation for snat pool")
            return "successfully created the snat pool"
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )            

    def list_snat_pool(self, provider, **kwargs):
        try:
            log.info("Inside list snat pool method")
            mgmt = self.connect(provider)
            snats = mgmt.tm.ltm.snatpools.get_collection()
            return snats
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def delete_snat_pool(self, provider,**kwargs):
        try:
            log.info("Inside delete snat pool method")
            mgmt = self.connect(provider)
            if mgmt.tm.ltm.snatpools.snatpool.exists(**kwargs):
                snat=mgmt.tm.ltm.snatpools.snatpool.load(**kwargs)
                snat.delete()
                return "successfully deleted the snat pool"

        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            ) 

    def create_snat(self, provider, **kwargs):
        try:
            log.info("Inside create snat method")
            mgmt = self.connect(provider)
            mgmt.tm.ltm.snats.snat.create(**kwargs)
            log.info("Successful creation operation for snat")
            return "successfully created the snat"
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )            

    def list_snats(self, provider, **kwargs):
        try:
            log.info("Inside list snat method")
            mgmt = self.connect(provider)
            snats = mgmt.tm.ltm.snats.get_collection()
            return snats
        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )

    def delete_snat(self, provider,**kwargs):
        try:
            log.info("Inside delete snat method")
            mgmt = self.connect(provider)
            if mgmt.tm.ltm.snats.snat.exists(**kwargs):
                snat=mgmt.tm.ltm.snats.snat.load(**kwargs)
                snat.delete()
                return "successfully deleted the snat"

        except Exception as e:
            log.info("Exception: %s", e)
            abort(
                code=HTTPStatus.UNPROCESSABLE_ENTITY,
                message="%s" % e
            )               

