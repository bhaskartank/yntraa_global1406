# encoding: utf-8
"""
QuotaPackages database models
--------------------
"""

from sqlalchemy_utils import Timestamp

from app.extensions import db
from app.modules import validate_name


class QuotaPackage(db.Model, Timestamp):
    """
    QuotaPackages database model.
    """
    __tablename__ = 'quotapackage'
    id = db.Column(db.Integer, primary_key=True) # pylint: disable=invalid-name
    name = db.Column(db.String(length=50), nullable=False)
    description = db.Column(db.String(length=200), nullable=False)
    quotapackage_value = db.Column(db.Integer, default=0)

    user = db.Column(db.Integer, default=0)
    project = db.Column(db.Integer, default=0)
    vm = db.Column(db.Integer, default=0)
    vcpu = db.Column(db.Integer, default=0)
    ram = db.Column(db.Integer, default=0)
    storage = db.Column(db.Integer, default=0)
    network = db.Column(db.Integer, default=0)
    subnet = db.Column(db.Integer, default=0)
    port = db.Column(db.Integer, default=0)
    router = db.Column(db.Integer, default=0)
    security_group = db.Column(db.Integer, default=0)
    security_group_rule = db.Column(db.Integer, default=0)
    load_balancer = db.Column(db.Integer, default=0)
    vm_snapshot = db.Column(db.Integer, default=0)
    volume_snapshot = db.Column(db.Integer, default=0)
    key_pair = db.Column(db.Integer, default=0)
    floating_ip = db.Column(db.Integer, default=0)
    public_ip = db.Column(db.Integer, default=0)
    scaling_group = db.Column(db.Integer, default=0)
    nks_cluster = db.Column(db.Integer, default=0)
    nas_storage = db.Column(db.Integer, default=0)
    version = db.Column(db.String(length=10), nullable=False, default='v1')
    is_active = db.Column(db.Boolean(), default=True, nullable=False)
    effective_from = db.Column(db.DateTime(), nullable=True)
    valid_till = db.Column(db.DateTime(), nullable=True)
    default = db.Column(db.Boolean, default=False, nullable=True)
    object_storage = db.Column(db.Integer, default=0)
    buckets = db.Column(db.Integer, default=0)

    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "name=\"{self.name}\", "
            "description=\"{self.description}\", "
            "quotapackage_value=\"{self.quotapackage_value}\", "
            "user=\"{self.user}\", "
            "project=\"{self.project}\", "
            "vm=\"{self.vm}\", "
            "vcpu=\"{self.vcpu}\", "
            "ram=\"{self.ram}\", "
            "storage=\"{self.storage}\", "
            "network=\"{self.network}\", "
            "subnet=\"{self.subnet}\", "
            "port=\"{self.port}\", "
            "router=\"{self.router}\", "
            "security_group=\"{self.security_group}\", "
            "security_group_rule=\"{self.security_group_rule}\", "
            "vm_snapshot=\"{self.vm_snapshot}\", "
            "volume_snapshot=\"{self.volume_snapshot}\", "
            "key_pair=\"{self.key_pair}\", "
            "floating_ip=\"{self.floating_ip}\", "
            "public_ip=\"{self.public_ip}\", "
            "scaling_group=\"{self.scaling_group}\", "
            "nks_cluster=\"{self.nks_cluster}\", "
            "nas_storage=\"{self.nas_storage}\", "
            "version=\"{self.version}\", "
            "is_active=\"{self.is_active}\", "
            "default=\"{self.default}\","
            "object_storage=\"{self.object_storage}\", "
            "buckets=\"{self.buckets}\", "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )
    @db.validates('name')
    def validate_name(self, key, name): # pylint: disable=unused-argument,no-self-use
        # if len(name) < 3:
        #     raise ValueError("Name has to be at least 3 characters long.")
        # return name
        temp_name = validate_name(key, name)
        return temp_name


class QuotaPackageProviderMapping(db.Model, Timestamp):
    """
    QuotaPackage Provider Mapping database model.
    """
    __tablename__ = 'quotapackage_provider_mapping'
    id = db.Column(db.Integer, primary_key=True) # pylint: disable=invalid-name
    
    quotapackage_id = db.Column(db.Integer, db.ForeignKey('quotapackage.id'), nullable=False)
    quotapackage = db.relationship(
        'QuotaPackage',
        backref=db.backref('quotapackage_provider_mapping_quotapackage', cascade='delete, delete-orphan')
    )

    provider_id = db.Column(db.Integer, db.ForeignKey('provider.id'), nullable=False)
    provider = db.relationship(
        'Provider',
        backref=db.backref('quotapackage_provider_mapping_provider', cascade='delete, delete-orphan')
    )
    is_public = db.Column(db.Boolean(), default=True, nullable=False)
    
    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "            
            "quotapackage_id=\"{self.quotapackage_id}\", "
            "provider_id=\"{self.provider_id}\", "
            "is_public=\"{self.is_public}\", "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )


class ResourceTopup(db.Model, Timestamp):
    """
    Resource Topup database model.
    """
    __tablename__ = 'resource_topup'
    id = db.Column(db.Integer, primary_key=True) # pylint: disable=invalid-name
    topup_item = db.Column(db.String(length=50), nullable=False)
    topup_type = db.Column(db.String(length=50), nullable=False)
    topup_value = db.Column(db.Integer, default=0)
    public = db.Column(db.Boolean(), default=True)
    is_active = db.Column(db.Boolean(), default=True)
    
    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "            
            "topup_item=\"{self.topup_item}\", "
            "topup_type=\"{self.topup_type}\", "
            "topup_value=\"{self.topup_value}\", "
            "public=\"{self.public}\", "
            "is_active=\"{self.is_active}\", "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )

    @db.validates('topup_item')
    def validate_name(self, key, topup_item): # pylint: disable=unused-argument,no-self-use
        temp_name = validate_name(key, topup_item)
        return temp_name

class ResourceTopupProviderMapping(db.Model, Timestamp):
    """
    Resource Topup Provider Mapping database model
    """
    __tablename__ = 'resource_topup_provider_mapping'
    id = db.Column(db.Integer, primary_key=True) # pylint: disable=invalid-name
    
    provider_id = db.Column(db.Integer, db.ForeignKey('provider.id'), nullable=False)
    provider = db.relationship(
        'Provider',
        backref=db.backref('resource_topup_provider_mapping', cascade='delete, delete-orphan')
    )

    resource_topup_id = db.Column(db.Integer, db.ForeignKey('resource_topup.id'), nullable=False)
    resource_topup = db.relationship(
        'ResourceTopup',
        backref=db.backref('resource_topup_provider_topup', cascade='delete, delete-orphan')
    )

    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "            
            "provider_id=\"{self.provider_id}\", "
            "resource_topup_id=\"{self.resource_topup_id}\", "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )



class ResourceTopupRequest(db.Model, Timestamp):
    """
    Resource Topup Request database model.
    """
    __tablename__ = 'resource_topup_request'
    id = db.Column(db.Integer, primary_key=True) # pylint: disable=invalid-name
    
    organisation_id = db.Column(db.Integer, db.ForeignKey('organisation.id'), nullable=False)
    organisation = db.relationship(
        'Organisation',
        backref=db.backref('resource_topup_organisation', cascade='delete, delete-orphan')
    )

    provider_id = db.Column(db.Integer, db.ForeignKey('provider.id'), nullable=False)
    provider = db.relationship(
        'Provider',
        backref=db.backref('resource_topup_provider', cascade='delete, delete-orphan')
    )

    resource_topup_id = db.Column(db.Integer, db.ForeignKey('resource_topup.id'), nullable=False)
    resource_topup = db.relationship(
        'ResourceTopup',
        backref=db.backref('resource_topup_quota', cascade='delete, delete-orphan')
    )

    allocation_date = db.Column(db.DateTime(), nullable=True)
    requested_by = db.Column(db.Integer,  nullable=True)
    allocated_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    user = db.relationship(
        'User',
        backref=db.backref('resource_topup_user', cascade='delete, delete-orphan')
    )
    status = db.Column(db.String(length=50), nullable=True)
    remarks = db.Column(db.String(length=5000), nullable=True)
    request_id = db.Column(db.String(length=50), nullable=True)
    request_remarks = db.Column(db.String(length=1000), nullable=True)
    request_origin = db.Column(db.String(length=50), nullable=False, default='user_portal')
    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "            
            "organisation_id=\"{self.organisation_id}\", "
            "provider_id=\"{self.provider_id}\", "
            "resource_topup_id=\"{self.resource_topup_id}\", "
            "allocation_date=\"{self.allocation_date}\","
            "requested_by=\"{self.requested_by}\","
            "allocated_by=\"{self.allocated_by}\","
            "status=\"{self.status}\","
            "remarks=\"{self.remarks}\","
            "request_id=\"{self.request_id}\", "
            "request_origin=\"{self.request_origin}\", "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )

class OrganisationTopupMapping(db.Model, Timestamp):
    """
    Organisations Topup Mapping database model.
    """
    __tablename__ = 'organisation_topup_mapping'
    id = db.Column(db.Integer, primary_key=True) # pylint: disable=invalid-name
    
    organisation_id = db.Column(db.Integer, db.ForeignKey('organisation.id'), nullable=False)
    organisation = db.relationship(
        'Organisation',
        backref=db.backref('organisation_topup_mapping_organisation', cascade='delete, delete-orphan')
    )

    provider_id = db.Column(db.Integer, db.ForeignKey('provider.id'), nullable=False)
    provider = db.relationship(
        'Provider',
        backref=db.backref('organisation_topup_mapping_provider', cascade='delete, delete-orphan')
    )

    resource_topup_id = db.Column(db.Integer, db.ForeignKey('resource_topup.id'), nullable=False)
    resource_topup = db.relationship(
        'ResourceTopup',
        backref=db.backref('organisation_topup_mapping_topup', cascade='delete, delete-orphan')
    )
    
    resource_topup_request_id = db.Column(db.Integer, db.ForeignKey('resource_topup_request.id'), nullable=True)
    resource_topup_request = db.relationship(
        'ResourceTopupRequest',
        backref=db.backref('organisation_topup_request_allocation_mapping', cascade='delete, delete-orphan')
    )

    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "            
            "organisation_id=\"{self.organisation_id}\", "
            "provider_id=\"{self.provider_id}\", "
            "resource_topup_id=\"{self.resource_topup_id}\", "
            "resource_topup_request_id=\"{self.resource_topup_request_id}\", "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )

class ResourceTopupWithdrawalRequest(db.Model, Timestamp):
    """
    Resource Topup Withdrawal Request database model.
    """
    __tablename__ = 'resource_topup_withdrawal_request'
    id = db.Column(db.Integer, primary_key=True) # pylint: disable=invalid-name
    
    organisation_id = db.Column(db.Integer, db.ForeignKey('organisation.id'), nullable=False)
    organisation = db.relationship(
        'Organisation',
        backref=db.backref('resource_topup_withdrawal_organisation', cascade='delete, delete-orphan')
    )

    provider_id = db.Column(db.Integer, db.ForeignKey('provider.id'), nullable=False)
    provider = db.relationship(
        'Provider',
        backref=db.backref('resource_topup_withdrawal_provider', cascade='delete, delete-orphan')
    )

    resource_topup_id = db.Column(db.Integer, db.ForeignKey('resource_topup.id'), nullable=False)
    resource_topup = db.relationship(
        'ResourceTopup',
        backref=db.backref('resource_topup_withdrawal_quota', cascade='delete, delete-orphan')
    )

    resource_topup_request_id = db.Column(db.Integer, db.ForeignKey('resource_topup_request.id'), nullable=False)
    resource_topup_request = db.relationship(
        'ResourceTopupRequest',
        backref=db.backref('resource_topup_request_withdrawal', cascade='delete, delete-orphan')
    )

    withdrawal_date = db.Column(db.DateTime(), nullable=True)
    requested_by = db.Column(db.Integer,  nullable=True)
    approved_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    user = db.relationship(
        'User',
        backref=db.backref('resource_topup_withdrawal_user', cascade='delete, delete-orphan')
    )
    status = db.Column(db.String(length=50), nullable=True)
    remarks = db.Column(db.String(length=5000), nullable=True)
    request_id = db.Column(db.String(length=50), nullable=True)
    request_remarks = db.Column(db.String(length=1000), nullable=True)
    request_origin = db.Column(db.String(length=50), nullable=False, default='user_portal')
    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "            
            "organisation_id=\"{self.organisation_id}\", "
            "provider_id=\"{self.provider_id}\", "
            "resource_topup_id=\"{self.resource_topup_id}\", "
            "resource_topup_request_id=\"{self.resource_topup_request_id}\", "
            "withdrawal_date=\"{self.withdrawal_date}\","
            "requested_by=\"{self.requested_by}\","
            "approved_by=\"{self.approved_by}\","
            "status=\"{self.status}\","
            "remarks=\"{self.remarks}\","
            "request_id=\"{self.request_id}\", "
            "request_origin=\"{self.request_origin}\", "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )
