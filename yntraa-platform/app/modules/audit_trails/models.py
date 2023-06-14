# encoding: utf-8
"""
Audit Trails database models
--------------------
"""

from sqlalchemy_utils import Timestamp

from app.extensions import db


class AuditTrail(db.Model, Timestamp):
    """
    Audit Trails database model.
    """

    id = db.Column(db.Integer, primary_key=True) # pylint: disable=invalid-name
    ip_address = db.Column(db.String(length=100), nullable=False)
    user_id = db.Column(db.Integer(), nullable=False)
    user_name = db.Column(db.String(length=100), nullable=False)
    action_type = db.Column(db.String(length=100), nullable=False)
    message = db.Column(db.String(length=1000), nullable=False)
    request_url = db.Column(db.String(length=400), nullable=False)

    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "ip_address=\"{self.ip_address}\", "
            "user_id={self.user_id},"
            "user_name=\"{self.user_name}\", "
            "action_type=\"{self.action_type}\","
            "message=\"{self.message}\", "
            "request_url=\"{self.request_url}\","
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )

class AuditTrailLog(db.Model, Timestamp):
    """
    user activity logs database model
    """
    __tablename__ = 'audit_trail_log'

    id = db.Column(db.Integer, primary_key=True) # pylint: disable=invalid-name
    
    user_id = db.Column(db.Integer(), nullable=True)
    user_name = db.Column(db.String(length=100), nullable=True)
    
    organisation_id = db.Column(db.Integer(), nullable=True)
    organisation_name = db.Column(db.String(length=100), nullable=True)
    
    project_id = db.Column(db.Integer(), nullable=True)
    project_name = db.Column(db.String(length=100), nullable=True)
    provider_id = db.Column(db.Integer(), nullable=True)
    provider_name = db.Column(db.String(length=100), nullable=True)
    action = db.Column(db.String(length=100), nullable=True)
    action_url = db.Column(db.String(length=100), nullable=True)
    action_method = db.Column(db.String(length=100), nullable=True)
    status = db.Column(db.String(length=100), nullable=True)
    status_message = db.Column(db.String(length=100), nullable=True)
    ref_task_id = db.Column(db.String(length=100), nullable=True)
    session_uuid = db.Column(db.String(length=100), nullable=True)
    resource_id = db.Column(db.Integer(), nullable=True)
    resource_type = db.Column(db.String(length=200), nullable=True)
    error_message = db.Column(db.Text, nullable=True)
    resource_name = db.Column(db.String(length=200), nullable=True)
    api_parameters = db.Column(db.Text, nullable=True)
    x_real_ip = db.Column(db.String(length=15), nullable=True)
    origin = db.Column(db.String(length=100), nullable=True)
    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "organisation_id=\"{self.organisation_id}\", "
            "organisation_name=\"{self.organisation_name}\", "
            "user_id={self.user_id},"
            "user_name=\"{self.user_name}\", "
            "project_id=\"{self.project_id}\","
            "project_name=\"{self.project_name}\","
            "provider_id=\"{self.provider_id}\", "
            "provider_name=\"{self.provider_name}\","
            "action=\"{self.action}\", "
            "action_url=\"{self.action_url}\","
            "action_method=\"{self.action_method}\","
            "status=\"{self.status}\","
            "status_message=\"{self.status_message}\","
            "ref_task_id=\"{self.ref_task_id}\","
            "resource_id=\"{self.resource_id}\","
            "session_uuid=\"{self.session_uuid}\","
            "resource_type=\"{self.resource_type}\","
            "error_message=\"{self.error_message}\","
            "resource_name=\"{self.resource_name}\","
            "x_real_ip=\"{self.x_real_ip}\","
            "origin=\"{self.origin}\","
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )

class AdminAuditTrailLog(db.Model, Timestamp):
    """
    admin activity logs database model
    """
    __tablename__ = 'admin_audit_trail_log'

    id = db.Column(db.Integer, primary_key=True) # pylint: disable=invalid-name
    
    user_id = db.Column(db.Integer(), nullable=True)
    user_name = db.Column(db.String(length=100), nullable=True)
    
    organisation_id = db.Column(db.Integer(), nullable=True)
    organisation_name = db.Column(db.String(length=100), nullable=True)
    
    project_id = db.Column(db.Integer(), nullable=True)
    project_name = db.Column(db.String(length=100), nullable=True)
    provider_id = db.Column(db.Integer(), nullable=True)
    provider_name = db.Column(db.String(length=100), nullable=True)
    action = db.Column(db.String(length=100), nullable=True)
    action_url = db.Column(db.String(length=100), nullable=True)
    action_method = db.Column(db.String(length=100), nullable=True)
    status = db.Column(db.String(length=100), nullable=True)
    status_message = db.Column(db.String(length=100), nullable=True)
    ref_task_id = db.Column(db.String(length=100), nullable=True)
    session_uuid = db.Column(db.String(length=100), nullable=True)
    resource_id = db.Column(db.Integer(), nullable=True)
    resource_type = db.Column(db.String(length=200), nullable=True)
    error_message = db.Column(db.Text, nullable=True)
    resource_name = db.Column(db.String(length=200), nullable=True)
    api_parameters = db.Column(db.Text, nullable=True)
    x_real_ip = db.Column(db.String(length=15), nullable=True)
    origin = db.Column(db.String(length=100), nullable=True)
    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "organisation_id=\"{self.organisation_id}\", "
            "organisation_name=\"{self.organisation_name}\", "
            "user_id={self.user_id},"
            "user_name=\"{self.user_name}\", "
            "project_id=\"{self.project_id}\","
            "project_name=\"{self.project_name}\","
            "provider_id=\"{self.provider_id}\", "
            "provider_name=\"{self.provider_name}\","
            "action=\"{self.action}\", "
            "action_url=\"{self.action_url}\","
            "action_method=\"{self.action_method}\","
            "status=\"{self.status}\","
            "status_message=\"{self.status_message}\","
            "ref_task_id=\"{self.ref_task_id}\","
            "session_uuid=\"{self.session_uuid}\","
            "resource_id=\"{self.resource_id}\","
            "resource_type=\"{self.resource_type}\","
            "error_message=\"{self.error_message}\","
            "resource_name=\"{self.resource_name}\","
            "x_real_ip=\"{self.x_real_ip}\","
            "origin=\"{self.origin}\","
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )

