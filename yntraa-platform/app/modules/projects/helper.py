from app.extensions import db, VA
from app.modules.providers.models import ServiceType, ServiceProvider, ServiceProviderMetaData
from app.modules import allocated_topup_quota_details, project_compute_quota, project_network_quota, project_volume_quota
from .models import ProjectProviderServiceMapping, ProjectProviderServiceMetaData
from app.modules.backup_services.helper import enable_backup_service
import xml.etree.ElementTree as ET

import logging
log = logging.getLogger(__name__)

def enable_service(provider, project, **kwargs):
    message_status = []
    service_provider = db.session.query(ServiceProvider, ServiceType).filter(ServiceProvider.service_type_id == ServiceType.id).filter_by(provider_id=provider.id, is_public=True).all()
    
    for service in service_provider :   
        try: 
            if service.ServiceType.name.lower() == 'backup' :
                status = enable_backup_service(provider, project, service_provider_id=service.ServiceProvider.id, service_provider_name=service.ServiceProvider.service_provider_name, project_id=kwargs['project_id'], user_id=kwargs['user_id'], organisation_id=kwargs['organisation_id'], tenant_id=kwargs['tenant_id'], task_id=kwargs['task_id'])
                message_status.append(status)
        except Exception as e:
            log.info(e)
        
        try:
            if service.ServiceType.name.lower() == 'va' :
                status = enable_va_service(provider, project, service_provider_id=service.ServiceProvider.id, service_provider_name=service.ServiceProvider.service_provider_name, tag_name=kwargs['tag_name'])
                message_status.append(status)
        except Exception as e:
            log.info(e)
    
    return message_status

def enable_va_service(provider, project, **kwargs):
    message_status = []
    if kwargs['service_provider_name'].lower() == 'qualys' :
        service_provider_meta = ServiceProviderMetaData.query.filter_by(service_provider_id=kwargs['service_provider_id']).all()
        log.info(service_provider_meta)
        
        service_mapping_details = ProjectProviderServiceMapping.query.filter_by(project_id=project.id, provider_id=provider.id, service_provider_id=kwargs['service_provider_id'], status='Active').first()
        if service_mapping_details is None:
            
            with db.session.begin():
                service_mapping = ProjectProviderServiceMapping(project_id=project.id,provider_id=provider.id,service_provider_id=kwargs['service_provider_id'],status='InProgress')
                db.session.add(service_mapping)
                
            parameter = {
                'tag_name': kwargs['tag_name'],
                'tag_text': project.project_id
            }
            
            create_tag_response = VA.create_tag(service_provider_meta, **parameter)
            log.info("create_tag ====================%s", create_tag_response)
            tag_data = ET.fromstring(create_tag_response)
            log.info(tag_data.find('responseCode').text)
            if tag_data.find('responseCode').text == 'SUCCESS' :
                tag_id = tag_data.find('data/Tag/id').text
                with db.session.begin():
                    tag_id_details = ProjectProviderServiceMetaData(project_provider_service_mapping_id=service_mapping.id,meta_key='tag_id',meta_value=tag_id)
                    db.session.add(tag_id_details)
                    
                    tag_name_details = ProjectProviderServiceMetaData(project_provider_service_mapping_id=service_mapping.id,meta_key='tag_name',meta_value=kwargs['tag_name'])
                    db.session.add(tag_name_details)
                message_status.append("Project Tag created successfully")
                
                parameter = {
                    'tag_id': tag_id,
                    'tag_name': kwargs['tag_name']
                }
                
                activation_key_response = VA.create_activation_key(service_provider_meta, **parameter)
                log.info("create_activation ====================%s", activation_key_response)
                key_data = ET.fromstring(activation_key_response)
                log.info(key_data.find('responseCode').text)
                if key_data.find('responseCode').text == 'SUCCESS' :
                    activation_key = key_data.find('data/AgentActKey/activationKey').text
                    activation_key_id = key_data.find('data/AgentActKey/id').text
                    with db.session.begin():
                        tag_key_id = ProjectProviderServiceMetaData(project_provider_service_mapping_id=service_mapping.id,meta_key='activation_key_id',meta_value=activation_key_id)
                        db.session.add(tag_key_id)

                        tag_key_details = ProjectProviderServiceMetaData(project_provider_service_mapping_id=service_mapping.id,meta_key='activation_key',meta_value=activation_key)
                        db.session.add(tag_key_details)
                    message_status.append("Project Activation Key created successfully")
                    
                    with db.session.begin():
                        service_mapping.status = 'Active'
                        db.session.merge(service_mapping)
                    message_status.append('Successfully create tag and activation key')
                else :
                    message_status.append("Project Activation Key not created successfully")
            else :
                    message_status.append("Project Tag not created successfully")
        else :
            message_status.append("VA Service is already enabled for this project")
    else :
            message_status.append("VA not available for this provider")
        
    return message_status

def sync_organisation_quota(organisation_id, provider_id, project_id):
    from app.modules.providers.models import Provider, ProviderType
    from app.modules.organisations.models import OrganisationQuotaPackage
    from app.modules.quotapackages.models import QuotaPackage
    
    org_quotapackage = OrganisationQuotaPackage.query.filter_by(provider_id=provider_id).filter_by(organisation_id=organisation_id).first()
        
    quotapackage_details = QuotaPackage.query.filter_by(id=org_quotapackage.quotapackage_id).first()

    prev_topup = allocated_topup_quota_details(organisation_id,provider_id)
    
    compute_quota_args = project_compute_quota(prev_topup, quotapackage_details, provider_id)
    volume_quota_args = project_volume_quota(prev_topup, quotapackage_details, provider_id)
    network_quota_args = project_network_quota(prev_topup, quotapackage_details, provider_id)
    
    message_status = []
    provider = Provider.query.get(provider_id)
    provider_type = ProviderType.query.get(provider.provider_type_id)
    _provider = globals()[provider_type.name]

    try :
        _provider.update_project_compute_quota(provider, project_id, **compute_quota_args)
        _provider.update_project_volume_quota(provider, project_id, **volume_quota_args)
        _provider.update_project_network_quota(provider, project_id, **network_quota_args)
        message_status.append("Quota sync successfully")
    except Exception as e:
        log.info("Exception: %s", e)
        message_status.append(str(e))
        
    return message_status

