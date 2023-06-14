# encoding: utf-8
"""
Common reusable Validations classes
--------------------------------------------------------------------------
"""

import logging

import flask_marshmallow
import sqlalchemy

from app.modules.providers.models import Provider
from app.modules.projects.models import Project
from app.modules.organisations.models import Organisation

log = logging.getLogger(__name__)

from functools import wraps


class Validations():
    """
    Having app-specific handlers here.
    """
    def check_project_exists(provider,project):	
        #project_details = Project.query.filter_by(provider=provider, id=project_id).first_or_404()
        #log.info('project_id : %s', project_id)

	    @wraps(provider)
	    def decorated_view(*args,**kwargs):
	        provider = kwargs['provider']
	        project_id = kwargs['project_id']
	        # Do something with value...
	        log.info('provider_id: %s', provider.id)
	        log.info('project_id: %s', project_id)
	    	
	    return decorated_view
    





