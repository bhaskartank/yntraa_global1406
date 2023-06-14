# encoding: utf-8
"""
Resource Action Logs database models
--------------------
"""

from sqlalchemy_utils import Timestamp
from sqlalchemy.dialects.postgresql import JSON
from app.extensions import db


class ResourceActionLog(db.Model, Timestamp):
    """
    Resource Action Logs database model.
    """

    id = db.Column(db.Integer, primary_key=True) # pylint: disable=invalid-name
    resource_type = db.Column(db.String(length=100), nullable=False)
    resource_record_id = db.Column(db.Integer(), nullable=False)
    action = db.Column(db.String(length=100), nullable=False)
    resource_configuration = db.Column(db.String(length=500), nullable=False)
    user_id = db.Column(db.Integer(), nullable=False)
    project_id = db.Column(db.Integer(), nullable=False)
    organisation_id = db.Column(db.Integer(), nullable=False)
    provider_id = db.Column(db.Integer(), nullable=False)

    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "resource_type=\"{self.resource_type}\", "
            "resource_record_id={self.resource_record_id}, "
            "action=\"{self.action}\", "
            "resource_configuration=\"{self.resource_configuration}\", "
            "user_id={self.user_id}, "
            "project_id={self.project_id}, "
            "organisation_id={self.organisation_id}, "
            "provider_id={self.provider_id}, "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )


class ProviderResourceActionLog(db.Model, Timestamp):
    """
    Provider Resource Action Logs database model.
    """
    __tablename__ = 'provider_resource_action_log'

    id = db.Column(db.Integer, primary_key=True) # pylint: disable=invalid-name
    organisation_id = db.Column(db.ForeignKey('organisation.id'), nullable=False)
    organisation = db.relationship(
        'Organisation',
        backref=db.backref('action_log_organisation', cascade='delete, delete-orphan')
    )
    provider_id = db.Column(db.ForeignKey('provider.id'), nullable=False)
    provider = db.relationship(
        'Provider',
        backref=db.backref('action_log_provider', cascade='delete, delete-orphan')
    )
    action_log = db.Column(JSON, nullable=True)
    including_internal_resources = db.Column(JSON, nullable=True)
    action_log_date = db.Column(db.Date, nullable=True)

    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "organisation_id={self.organisation_id}, "
            "provider_id={self.provider_id}, "
            "action_log={self.action_log}, "
            "including_internal_resources={self.including_internal_resources}, "
            "action_log_date={self.action_log_date}, "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )

class OrganisationResourceActionLog(db.Model, Timestamp):
    """
    Organisation Resource Action Logs database model.
    """
    __tablename__ = 'organisation_resource_action_log'

    id = db.Column(db.Integer, primary_key=True) # pylint: disable=invalid-name
    organisation_id = db.Column(db.ForeignKey('organisation.id'), nullable=False)
    organisation = db.relationship(
        'Organisation',
        backref=db.backref('organisation_action_log', cascade='delete, delete-orphan')
    )
    provider_id = db.Column(db.ForeignKey('provider.id'), nullable=False)
    provider = db.relationship(
        'Provider',
        backref=db.backref('provider_action_log', cascade='delete, delete-orphan')
    )
    action_log = db.Column(JSON, nullable=True)
    action_log_date = db.Column(db.Date, nullable=True)

    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "organisation_id={self.organisation_id}, "
            "provider_id={self.provider_id}, "
            "action_log={self.action_log}, "
            "action_log_date={self.action_log_date}, "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )

class ProjectResourceActionLog(db.Model, Timestamp):
    """
    Project Resource Action Logs database model.
    """
    _tablename_ = 'project_resource_action_log'
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True) # pylint: disable=invalid-name
    organisation_id = db.Column(db.ForeignKey('organisation.id'), nullable=False)
    organisation = db.relationship(
        'Organisation',
        backref=db.backref('project_org_action_log', cascade='delete, delete-orphan')
    )
    provider_id = db.Column(db.ForeignKey('provider.id'), nullable=False)
    provider = db.relationship(
        'Provider',
        backref=db.backref('project_provider_action_log', cascade='delete, delete-orphan')
    )
    project_id = db.Column(db.ForeignKey('project.id'), nullable=False)
    project = db.relationship(
        'Project',
        backref=db.backref('project_action_log', cascade='delete, delete-orphan')
    )
    action_log = db.Column(JSON, nullable=False)
    including_internal_resources = db.Column(JSON, nullable=True)
    action_log_date = db.Column(db.Date, nullable=False)

    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "organisation_id={self.organisation_id}, "
            "provider_id={self.provider_id}, "
            "project_id={self.project_id}, "
            "action_log={self.action_log}, "
            "including_internal_resources={self.including_internal_resources}, "
            "action_log_date={self.action_log_date}, "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )

class ResourceActionLogReport(db.Model, Timestamp):
    """
    Resource Action Logs Report database model.
    """
    __tablename__ = 'resource_action_log_report'

    id = db.Column(db.Integer, primary_key=True) # pylint: disable=invalid-name
    organisation_name = db.Column(db.String(length=500), nullable=False)
    org_reg_code = db.Column(db.String(length=50), nullable=False)
    cloud_unit_code = db.Column(db.String(length=10), nullable=False)
    vm_allocated = db.Column(db.Integer, nullable=True)
    cpu_allocated = db.Column(db.Integer, nullable=True)
    memory_allocated = db.Column(db.Integer, nullable=True)
    storage_allocated = db.Column(db.Integer, nullable=True)
    vm_consumed = db.Column(db.Integer, nullable=True)
    cpu_consumed = db.Column(db.Integer, nullable=True)
    memory_consumed = db.Column(db.Integer, nullable=True)
    storage_consumed = db.Column(db.Integer, nullable=True)
    provider_id = db.Column(db.String(length=10), nullable=False)
    provider_location = db.Column(db.String(length=50), nullable=False)
    action_log_date = db.Column(db.Date, nullable=False)

    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "organisation_name={self.organisation_name}, "
            "org_reg_code={self.org_reg_code}, "
            "cloud_unit_code={self.cloud_unit_code}, "
            "vm_allocated={self.vm_allocated}, "
            "cpu_allocated={self.cpu_allocated}, "
            "memory_allocated={self.memory_allocated}, "
            "storage_allocated={self.storage_allocated}, "
            "vm_consumed={self.vm_consumed}, "
            "cpu_consumed={self.cpu_consumed}, "
            "memory_consumed={self.memory_consumed}, "
            "storage_consumed={self.storage_consumed}, "
            "provider_id={self.provider_id}, "
            "provider_location={self.provider_location}, "
            "action_log_date={self.action_log_date}, "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )

