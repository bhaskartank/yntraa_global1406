import logging
log = logging.getLogger(__name__)
from app.extensions import db, Openstack, Docker, VA, Networker
class Constants:
    def __init__(self):
        self.UBUNTU_1804_INIT_SCRIPT = '''#cloud-config
                                    hostname: [instance_name]
                                    users:
                                        - name: [vm_username]
                                        password: [vm_password]
                                        sudo: ['ALL=(ALL) ALL']
                                        groups: sudo
                                        shell: /bin/bash
                                        ssh_pwauth: True
                                        lock_passwd: False
                                        plain_text_passwd: [vm_password]
                                    '''
        
        self.UBUNTU_2004_INIT_SCRIPT = '''#cloud-config
                                    hostname: [instance_name]
                                    users:
                                        - name: [vm_username]
                                        password: [vm_password]
                                        sudo: ['ALL=(ALL) ALL']
                                        groups: sudo
                                        shell: /bin/bash
                                        ssh_pwauth: True
                                        lock_passwd: False
                                        plain_text_passwd: [vm_password]
                                    '''
        self.CENTOS_76_INIT_SCRIPT =   '''#cloud-config
                                    hostname: [instance_name]
                                    users:
                                        - name: [vm_username]
                                        password: [vm_password]
                                        sudo: ['ALL=(ALL) ALL']
                                        groups: sudo
                                        shell: /bin/bash
                                        ssh_pwauth: True
                                        lock_passwd: False
                                        plain_text_passwd: [vm_password]
                                    '''

    # @classmethod
    # def get_cloud_init_script(cls, template_id):
    #     from app.modules.compute.models import Images, ImageInitScriptMapping
    #     from app.modules.providers.models import Provider

    #     cloud_init_script = None
    #     template = Images.query.get(template_id)
    #     provider = Provider.query.get(template.provider_id)
    #     image_init_script = ImageInitScriptMapping.query.filter_by(image_id = template_id).filter(ImageInitScriptMapping.script_type.ilike('system')).first()
    #     if image_init_script is not None and image_init_script.init_script:
    #         user_data_script_name = template.os.upper()+"_"+template.os_version.replace('.','')+"_INIT_SCRIPT"

    #         cloud_init_script = cls.user_data_script_name+image_init_script.init_script
    #     return cloud_init_script
    
    
    @classmethod
    def prepared_cloud_init_script(cls, **kwargs):
        import yaml, base64
        from app.modules.compute.models import ImageInitScriptMapping, ImageInitScriptVariable
        from app.modules.compute.models import Images
        from app.modules.providers.models import Provider
        image_script = ImageInitScriptMapping.query.filter_by(image_id = kwargs['image_id']).filter(ImageInitScriptMapping.script_type.ilike('system')).first()
        
        init_message = ''
        if image_script:
            try:
                base64_message = image_script.init_script
                base64_bytes = base64_message.encode('ascii')
                message_bytes = base64.b64decode(base64_bytes)
                init_message = message_bytes.decode('ascii')

                image_init_script_variable = ImageInitScriptVariable.query.all()

                for init_variable in image_init_script_variable:

                    if init_variable.variable_name == 'username':
                        init_message = init_message.replace('[username]', kwargs['vm_username'])
                    elif init_variable.variable_name == 'hostname':
                        init_message = init_message.replace('[hostname]', kwargs['instance_name'])
                    elif init_variable.variable_name == 'password':
                        init_message = init_message.replace('[password]', kwargs['vm_password'])
                    elif init_variable.variable_name == 'cloud_agent_activation_key':
                        init_message = init_message.replace('[cloud_agent_activation_key]', kwargs['cloud_agent_activation_key'])

            except Exception as e:
                log.info(e)
                return False
        else:
            try:
                images = Images.query.get(kwargs['image_id'])
                provider = Provider.query.get(kwargs['provider_id'])
                if images.os == 'Windows' :
                    init_message = '''#ps1
                                & $Env:ProgramFiles"\Trend Micro\Deep Security Agent\dsa_control" -r
                                & $Env:ProgramFiles"\Trend Micro\Deep Security Agent\dsa_control" -a dsm://10.248.4.59:4120/ "policyid:20" "groupid:1"
                    '''
                elif (images.os).lower() == 'centos' and images.os_version == '7.6':
                    init_message = '''#cloud-config
                                hostname: '''+ kwargs['instance_name'] +'''
                                manage_etc_hosts: true
                                users:
                                  - name: '''+ kwargs['vm_username'] +'''
                                    password: '''+ kwargs['vm_password'] +'''
                                    sudo: ['ALL=(ALL) ALL']
                                    groups: sudo
                                    shell: /bin/bash
                                    ssh_pwauth: True
                                    lock_passwd: False
                                    plain_text_passwd: '''+ kwargs['vm_password'] +'''
                                runcmd:
                                  - sed -i -e '/^##UseDNS/s/^.*$/UseDNS no/' /etc/ssh/sshd_config
                                  - sed -i -e '/^GSSAPIAuthentication/s/^.*$/GSSAPIAuthentication no/' /etc/ssh/sshd_config
                                  - [service, sshd, restart]
                                  - curl -LO '''+ provider.cloud_init_script_full_path +''' >> cloud_init.sh
                                  - chmod +x cloud_init.sh
                                  - ./cloud_init.sh  '''+ provider.cloud_init_script_location +''' '''+kwargs['backup_server_private_ip']+''' '''+kwargs['backup_host_name']+''' '''+kwargs['cloud_agent_activation_key']
                                
                elif (images.os).lower() == 'ubuntu' and images.os_version == '20.04':
                    init_message = '''#cloud-config
                                hostname: '''+ kwargs['instance_name'] +'''
                                manage_etc_hosts: true
                                users:
                                  - name: '''+ kwargs['vm_username'] +'''
                                    password: '''+ kwargs['vm_password'] +'''
                                    sudo: ['ALL=(ALL) ALL']
                                    groups: sudo
                                    shell: /bin/bash
                                    ssh_pwauth: True
                                    lock_passwd: False
                                    plain_text_passwd: '''+ kwargs['vm_password'] +'''
                                apt:
                                    preserve_sources_list: true
                                runcmd:
                                  - curl -LO '''+ provider.cloud_init_script_full_path +''' >> cloud_init.sh
                                  - chmod +x cloud_init.sh
                                  - ./cloud_init.sh '''+ provider.cloud_init_script_location +''' '''+kwargs['backup_server_private_ip']+''' '''+kwargs['backup_host_name']+''' '''+kwargs['cloud_agent_activation_key']
                                
                elif (images.os).lower() == 'ubuntu' and images.os_version == '18.04':
                    
                    init_message = '''#cloud-config
                                hostname: '''+ kwargs['instance_name'] +'''
                                users:
                                  - name: '''+ kwargs['vm_username'] +'''
                                    password: '''+ kwargs['vm_password'] +'''
                                    sudo: ['ALL=(ALL) ALL']
                                    groups: sudo
                                    shell: /bin/bash
                                    ssh_pwauth: True
                                    lock_passwd: False
                                    plain_text_passwd: '''+ kwargs['vm_password'] +'''
                                runcmd:
                                  - curl -LO '''+ provider.cloud_init_script_full_path +''' >> cloud_init.sh
                                  - chmod +x cloud_init.sh
                                  - ./cloud_init.sh '''+ provider.cloud_init_script_location +''' '''+kwargs['backup_server_private_ip']+''' '''+kwargs['backup_host_name']+''' '''+kwargs['cloud_agent_activation_key']
            
            except Exception as e:
                log.info(e)
                #return False
        return init_message       

