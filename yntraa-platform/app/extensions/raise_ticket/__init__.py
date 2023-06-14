import logging
from flask_login import current_user
from app.extensions import Openstack, Docker

log = logging.getLogger(__name__)

class RaiseTicket(object):

    def __init__(self):
        pass

    @staticmethod
    def action_status(ticket_id, project_id, provider_id):
        from app.modules.providers.models import Provider, ProviderType
        from app.modules.projects.models import Project

        project = Project.query.get(project_id)
        provider = Provider.query.get(provider_id)
        provider_type = ProviderType.query.get(provider.provider_type_id)
        _provider = globals()[provider_type.name]
        params = {
            "project_name": project.name,
            "stack_id":ticket_id
        }
        resp = _provider.get_stack_details(provider, **params)
        log.info(resp)
        return resp
