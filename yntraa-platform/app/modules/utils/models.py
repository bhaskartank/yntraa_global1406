# encoding: utf-8
"""
QuotaPackages database models
--------------------
"""

from sqlalchemy_utils import Timestamp
from sqlalchemy.dialects.postgresql import JSON

from app.extensions import db
from app.modules import validate_name

class NotificationTemplateDetails(db.Model, Timestamp):
    """
    Notification Template Details database model.
    """
    tablename = 'notification_template_details'
    id = db.Column(db.Integer, primary_key=True)  # pylint: disable=invalid-name
    template_name = db.Column(db.String(length=50), nullable=False)
    template_type = db.Column(db.String(length=50), nullable=False)
    template_data = db.Column(JSON, nullable=False)
    module_name = db.Column(db.String(length=50), nullable=False)
    module_service = db.Column(db.String(length=50), nullable=False)
    status =  db.Column(db.String(length=50), default = 'Active', nullable=True)
    
    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "template_name={self.template_name}, "
            "template_type=\"{self.template_type}\", "
            "template_data=\"{self.template_data}\", "
            "module_name=\"{self.module_name}\", "
            "module_service=\"{self.module_service}\", "
            "status=\"{self.status}\", "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )
        
class MasterModuleServiceAction(db.Model, Timestamp):
    """
    Master Module Service Action database model.
    """
    tablename = 'master_module_service_action'
    id = db.Column(db.Integer, primary_key=True)  # pylint: disable=invalid-name
    module_name = db.Column(db.String(length=50), nullable=False)
    module_service = db.Column(db.String(length=50), nullable=False)
    service_action = db.Column(db.String(length=50), nullable=False)
    
    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "module_name=\"{self.module_name}\", "
            "module_service=\"{self.module_service}\", "
            "service_action=\"{self.service_action}\", "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )
        
class ModuleServiceTemplateMapping(db.Model, Timestamp):
    """
    Module Service Template Mapping database model.
    """
    tablename = 'module_service_template_mapping'
    id = db.Column(db.Integer, primary_key=True)  # pylint: disable=invalid-name
    master_module_service_action_id = db.Column(db.Integer, db.ForeignKey('master_module_service_action.id'), nullable=False)
    master_module_service_action = db.relationship(
        'MasterModuleServiceAction',
        backref=db.backref('module_service_template_action_mapping', cascade='delete, delete-orphan')
    )
    notification_template_details_id = db.Column(db.Integer, db.ForeignKey('notification_template_details.id'), nullable=False)
    notification_template_details = db.relationship(
        'NotificationTemplateDetails',
        backref=db.backref('notification_template_details_mapping', cascade='delete, delete-orphan')
    )
    
    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "master_module_service_action_id=\"{self.master_module_service_action_id}\", "
            "notification_template_details_id=\"{self.notification_template_details_id}\", "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )
        
class ModuleServiceUserMapping(db.Model, Timestamp):
    """
    Module Service User Mapping database model.
    """
    tablename = 'module_service_user_mapping'
    id = db.Column(db.Integer, primary_key=True)  # pylint: disable=invalid-name
    master_module_service_action_id = db.Column(db.Integer, db.ForeignKey('master_module_service_action.id'), nullable=False)
    master_module_service_action = db.relationship(
        'MasterModuleServiceAction',
        backref=db.backref('module_service_user_action_mapping', cascade='delete, delete-orphan')
    )
    subscriber_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship(
        'User',
        backref=db.backref('module_service_user_mapping_user', cascade='delete, delete-orphan')
    )
    notification_medium = db.Column(db.String(length=50), nullable=False)
    
    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "master_module_service_action_id=\"{self.master_module_service_action_id}\", "
            "subscriber_id=\"{self.subscriber_id}\", "
            "notification_medium=\"{self.notification_medium}\", "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )

class SmsTemplate(db.Model, Timestamp):
    """
    Model for SMS Template
    """
    __tablename__ = 'sms_template'
    id = db.Column(db.Integer, primary_key=True)
    template_id = db.Column(db.String(length=32), nullable=True)
    template_name = db.Column(db.String(length=32), nullable=True)
    template_type = db.Column(db.String(length=32), nullable=True)
    orginal_template = db.Column(db.Text, nullable=True)
    custom_template = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(length=32), default='Active', nullable=True)

    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "template_id=\"{self.template_id}\", "
            "template_name=\"{self.template_name}\", "
            "template_type=\"{self.template_type}\", "
            "original_template=\"{self.original_template}\", "
            "custom_template=\"{self.custom_template}\", "
            "status=\"{self.status}\", "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )

class ConsentData(db.Model, Timestamp):
    """
    Model for Consent Data
    """
    __tablename__ = "consent_data"
    id = db.Column(db.Integer, primary_key=True) # pylint: disable=invalid-name
    module = db.Column(db.String(50), nullable=False)
    service = db.Column(db.String(50), nullable=False)
    action = db.Column(db.String(32), nullable=False)
    priority = db.Column(db.String(8), nullable=False)
    consent_text = db.Column(db.Text(), nullable=True)
    is_mandatory = db.Column(db.Boolean(), default=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    user = db.relationship(
        'User',
        backref=db.backref('consent_data_user', cascade='delete, delete-orphan')
    )
    status = db.Column(db.String(length=32), default='Active', nullable=True)

    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "module=\"{self.module}\", "
            "service=\"{self.service}\", "
            "action=\"{self.action}\", "
            "priority=\"{self.priority}\", "
            "consent_text=\"{self.consent_text}\", "
            "is_mandatory=\"{self.is_mandatory}\", "
            "user_id=\"{self.user_id}\", "
            "status=\"{self.status}\", "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )

class EULA(db.Model, Timestamp):
    """
    Model for EULA
    """
    __tablename__ = "eula"
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text(), nullable=False)
    version = db.Column(db.String(length=10), nullable=False)
    status = db.Column(db.String(length=32), default='Active', nullable=True)

    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "content=\"{self.content}\", "
            "version=\"{self.version}\", "
            "status=\"{self.status}\", "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )