# encoding: utf-8
"""
Projects database models
--------------------
"""
from sqlalchemy_utils import types as column_types, Timestamp

from app.extensions import db

from app.modules.providers.models import Provider
from app.modules.organisations.models import *
from app.modules import validate_name
from app.modules.organisations.models import Organisation
#from app.modules.compute.models import Compute
#from sqlalchemy.dialects.postgresql import JSON


class Project(db.Model, Timestamp):
    """
    Projects database model.
    """
    __tablename__ = 'project'
    id = db.Column(db.Integer, primary_key=True) # pylint: disable=invalid-name
    project_id = db.Column(db.String(length=10),unique=True, nullable=True)
    name = db.Column(db.String(length=100), nullable=False)
    description = db.Column(db.String(length=1000), nullable=True)
    organisation_id = db.Column(db.Integer, db.ForeignKey('organisation.id'), nullable=False)
    organisation = db.relationship(
        'Organisation',
        backref=db.backref('project_organisation', cascade='delete, delete-orphan')
    )
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship(
        'User',
        backref=db.backref('project_user', cascade='delete, delete-orphan')
    )
    action = db.Column(db.String(length=120), nullable=True)
    task_id = db.Column(db.String(length=120), nullable=True)
    project_type = db.Column(db.String(length=40), nullable=True, default='system')
    status = db.Column(db.String(length=20), nullable=True, default='Active')
    
    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "organisation_id={self.organisation_id}, "
            "user_id={self.user_id}, "
            "name=\"{self.name}\", "
            "description=\"{self.description}\", "
            "action=\"{self.action}\", "
            "task_id=\"{self.task_id}\", "
            "project_type=\"{self.project_type}\", "
            "status=\"{self.status}\", "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )

    @db.validates('name')
    def validate_name(self, key, name): # pylint: disable=unused-argument,no-self-use
        # if len(name) < 5:
        #     raise ValueError("Name has to be at least 3 characters long.")
        # return name
        temp_name = validate_name(key, name)
        return temp_name

class ProjectGatewayService(db.Model, Timestamp):
    """
    Project Provider Mapping database model.
    """
    __tablename__ = 'project_gateway_service'
    id = db.Column(db.Integer, primary_key=True) # pylint: disable=invalid-name
    provider_id = db.Column(db.Integer, db.ForeignKey('provider.id'), nullable=False)
    provider = db.relationship(
        'Provider',
        backref=db.backref('project_gateway_service_provider', cascade='delete, delete-orphan')
    )

    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    project = db.relationship(
        'Project',
        backref=db.backref('project_gateway_service_project', cascade='delete, delete-orphan')
    )
    service_name = db.Column(db.String(length=80), nullable=True)
    service_protocol = db.Column(db.String(length=80), nullable=True, default='tcp')
    service_gw_port = db.Column(db.Integer, nullable=True)
    service_destination = db.Column(db.String(length=280), nullable=True)
    service_status = db.Column(db.String(length=80), nullable=True)
    device_status = db.Column(db.String(length=80), nullable=True)
    managed_by = db.Column(db.String(length=80), nullable=True)
    
    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "provider_id={self.provider_id}, "
            "project_id={self.project_id}, "
            "service_name={self.service_name}, "
            "service_protocol={self.service_protocol}, "
            "service_gw_port={self.service_gw_port}, "
            "service_status={self.service_status}, "
            "device_status={self.device_status} "
            "managed_by={self.managed_by} "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )
        
class ProjectProviderMapping(db.Model, Timestamp):
    """
    Project Provider Mapping database model.
    """
    __tablename__ = 'project_provider_mapping'
    id = db.Column(db.Integer, primary_key=True) # pylint: disable=invalid-name
    provider_id = db.Column(db.Integer, db.ForeignKey('provider.id'), nullable=False)
    provider = db.relationship(
        'Provider',
        backref=db.backref('project_provider_mapping_provider', cascade='delete, delete-orphan')
    )

    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    project = db.relationship(
        'Project',
        backref=db.backref('project_provider_mapping_project', cascade='delete, delete-orphan')
    )
    provider_project_id = db.Column(db.String(length=80), unique=True, nullable=False)
    gw_device_id = db.Column(db.String(length=50), nullable=True)
    gw_device_ip = db.Column(db.String(length=50), nullable=True)
    action = db.Column(db.String(length=50), nullable=True)

    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "provider_id={self.provider_id}, "
            "project_id={self.project_id}, "
            "gw_device_id=\"{self.gw_device_id}\", "
            "gw_device_ip=\"{self.gw_device_ip}\", "
            "provider_project_id=\"{self.provider_project_id}\""
            "action={self.action}, "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )

class ProjectMeta(db.Model, Timestamp):
    """
    Project Provider Mapping database model.
    """
    __tablename__ = 'project_meta'
    id = db.Column(db.Integer, primary_key=True)  # pylint: disable=invalid-name
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    project = db.relationship(
        'Project',
        backref=db.backref('project_meta', cascade='delete, delete-orphan')
    )
    meta_label = db.Column(db.String(length=256), nullable=True)
    meta_value = db.Column(db.String(length=256), nullable=True)



class ProjectTechnologyDetails(db.Model, Timestamp):
    """
    Cloud technology details database model.
    """

    __tablename__ = 'project_technology_details'

    id = db.Column(db.Integer, primary_key=True)  #pylint: disable=invalid-name
    technology_type = db.Column(db.String(length=256), nullable=True, default='web_server')
    name = db.Column(db.String(length=256), nullable=True)
    status = db.Column(db.String(length=256), nullable=True, default='Active')

    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "technology_type={self.technology_type}, "
            "name={self.name}, "
            "status=\"{self.status}\", "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )
class ProjectProviderServiceMapping(db.Model, Timestamp):
    """
    Project-Provider-Service-Mapping database model.
    """
    _tablename_ = 'project_provider_service_mapping'
    id = db.Column(db.Integer, primary_key=True)  # pylint: disable=invalid-name
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    project = db.relationship(
        'Project',
        backref=db.backref('service_project', cascade='delete, delete-orphan')
    )
    provider_id = db.Column(db.Integer, db.ForeignKey('provider.id'), nullable=False)
    provider = db.relationship(
        'Provider',
        backref=db.backref('service_provider', cascade='delete, delete-orphan')
    )
    service_provider_id = db.Column(db.Integer, db.ForeignKey('service_provider.id'), nullable=False)
    service_provider = db.relationship(
        'ServiceProvider',
        backref=db.backref('service_provider_map', cascade='delete, delete-orphan')
    )
    status = db.Column(db.String(length=50), nullable=True)
    
    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "project_id=\"{self.project_id}\", "
            "provider_id=\"{self.provider_id}\", "
            "service_provider_id=\"{self.service_provider_id}\", "
            "status=\"{self.status}\", "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )
        
class ProjectProviderServiceMetaData(db.Model, Timestamp):
    """
    ProjectProviderService MetaData database model.
    """
    _tablename_ = 'project_provider_service_metadata'
    id = db.Column(db.Integer, primary_key=True)  # pylint: disable=invalid-name
    project_provider_service_mapping_id = db.Column(db.Integer, db.ForeignKey('project_provider_service_mapping.id'), nullable=False)
    project_provider_service_mapping = db.relationship(
        'ProjectProviderServiceMapping',
        backref=db.backref('project_provider_service_mapping_meta', cascade='delete, delete-orphan')
    )
    meta_key = db.Column(db.String(length=256), nullable=True)
    meta_value = db.Column(db.String(length=256), nullable=True)
    
    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "project_provider_service_mapping_id=\"{self.project_provider_service_mapping_id}\", "
            "meta_key=\"{self.meta_key}\", "
            "meta_value=\"{self.meta_value}\", "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )


# class ReserveFloatingIPMapping(db.Model, Timestamp):
#     """
#     Reserve Floating IP Mapping Database Model.
#     """
#     __tablename__ = 'resource_floating_ip_mapping'
#     id = db.Column(db.Integer, primary_key=True) # pylint: disable=invalid-name
#     resource_type = db.Column(db.String(length=50), nullable=True)
#     reserve_floating_ip_id = db.Column(db.Integer, db.ForeignKey('reserve_floating_ip.id'), nullable=False)
#     reserve_floating_ip = db.relationship(
#         'ReserveFloatingIP',
#         backref=db.backref('reserve_floating_ip_resource_floating_ip_mapping', cascade='delete, delete-orphan')
#     )

#     def __repr__(self):
#         return (
#             "<{class_name}("
#             "id={self.id}, "
#             "reserve_floating_ip_id=\"{self.reserve_floating_ip_id}\", "
#             "resource_type=\"{self.resource_type}\", "
#             ")>".format(
#                 class_name=self.__class__.__name__,
#                 self=self
#             )
#         )


