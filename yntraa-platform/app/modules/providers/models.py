# encoding: utf-8
"""
Provider database models
--------------------
"""
import enum

from sqlalchemy_utils import types as column_types, Timestamp

from app.extensions import db
from app.modules import validate_name


  
class Provider(db.Model, Timestamp):
    """
    Provider database model.
    """

    id = db.Column(db.Integer, primary_key=True) # pylint: disable=invalid-name
    provider_id = db.Column(db.String(length=120), unique=True, nullable=True)
    provider_name = db.Column(db.String(length=120), unique=True, nullable=False)
    provider_location = db.Column(db.String(length=50), unique=False, nullable=True)
    provider_description = db.Column(db.String(length=500), unique=False, nullable=True)
    provider_type_id = db.Column(db.Integer, db.ForeignKey('provider_type.id'), nullable=False)
    provider_type = db.relationship(
        'ProviderType',
        backref=db.backref('compute_provider_type', cascade='delete, delete-orphan')
    )
    auth_url = db.Column(db.String(length=120), unique=True, nullable=False)
    identity_api_version = db.Column(db.Integer, default=3, nullable=False)
    username = db.Column(db.String(length=80), nullable=False)
    # password = db.Column(
    #     column_types.PasswordType(
    #         max_length=128,
    #         schemes=('bcrypt', )
    #     ),
    #     nullable=False
    # )
    password = db.Column(db.String(length=80), nullable=False)
    region_name = db.Column(db.String(length=80), default='', nullable=True)
    project_name = db.Column(db.String(length=80), default='', nullable=True)
    user_domain_id = db.Column(db.String(length=80), default='', nullable=True)
    docker_registry = db.Column(db.String(length=80), default='', nullable=True)
    public = db.Column(db.Boolean(), default=True)
    is_active = db.Column(db.Boolean(), default=True)
    status = db.Column(db.String(length=50), default = 'Active', nullable=True)
    cloud_init_script_location = db.Column(db.String(length=500), nullable=True)
    cloud_init_script_full_path = db.Column(db.String(length=500), nullable=True)
    is_sso_enabled = db.Column(db.Boolean(), default=False, nullable=True)
    idp_name = db.Column(db.String(length=80), nullable=True)
    default = db.Column(db.Boolean, default=False, nullable=True)


    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "provider_name=\"{self.provider_name}\", "
            "provider_location=\"{self.provider_location}\", "
            "provider_description=\"{self.provider_description}\", "
            "auth_url=\"{self.auth_url}\", "
            "username=\"{self.username}\", "
            "region_name=\"{self.region_name}\", "
            "project_name=\"{self.project_name}\", "
            "user_domain_id=\"{self.user_domain_id}\", "
            "identity_api_version=\"{self.identity_api_version}\", "
            "docker_registry=\"{self.docker_registry}\", "
            "public=\"{self.public}\","
            "is_active=\"{self.is_active}\","
            "status=\"{self.status}\","
            "cloud_init_script_location=\"{self.cloud_init_script_location}\","
            "cloud_init_script_full_path=\"{self.cloud_init_script_full_path}\","
            "default=\"{self.default}\","
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )
    @db.validates('provider_name')
    def validate_provider_name(self, key, provider_name):  # pylint: disable=unused-argument,no-self-use
        # if len(provider_name) < 3:
        #     raise ValueError("Provider Name has to be at least 3 characters long.")
        # return provider_name
        temp_name = validate_name(key, provider_name)
        return temp_name


class ProviderType(db.Model, Timestamp):
    """
    Provider-Type database model.
    """
    __tablename__ = 'provider_type'
    id = db.Column(db.Integer, primary_key=True) # pylint: disable=invalid-name
    name = db.Column(db.String(length=120), unique=True, nullable=False)
    description = db.Column(db.String(length=120), unique=False, nullable=True)

    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "name=\"{self.name}\", "
            "description=\"{self.description}\", "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )


class ResourceAvailabilityZones(db.Model, Timestamp):
    """
    Resource-Availability-Zones database model.
    """
    _tablename_ = 'resource_availability_zones'
    id = db.Column(db.Integer, primary_key=True) # pylint: disable=invalid-name
    provider_id = db.Column(db.Integer, db.ForeignKey('provider.id'), nullable=True)
    provider = db.relationship(
        'Provider',
        backref=db.backref('zone_provider', cascade='delete, delete-orphan')
    )
    resource_name = db.Column(db.String(length=120), nullable=False)
    zone_name = db.Column(db.String(length=120), nullable=False)
    status = db.Column(db.String(length=50), default = 'Available', nullable=True)
    is_public = db.Column(db.Boolean(), default=True)
    is_default = db.Column(db.Boolean(), default=False)
    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "provider_id=\"{self.provider_id}\", "
            "zone_name=\"{self.zone_name}\", "
            "resource_name=\"{self.resource_name}\", "
            "status=\"{self.status}\", "
            "is_public=\"{self.is_active}\", "
            "id_default=\"{self.id_default}\", "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )

class ServiceType(db.Model, Timestamp):
    """
    Service-Type database model.
    """
    _tablename_ = 'service_type'
    id = db.Column(db.Integer, primary_key=True) # pylint: disable=invalid-name
    name = db.Column(db.String(length=120), unique=True, nullable=False)
    description = db.Column(db.String(length=500), nullable=True)

    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "name=\"{self.name}\", "
            "description=\"{self.description}\", "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )

class ServiceProvider(db.Model, Timestamp):
    """
    Service-Provider database model.
    """
    _tablename_ = 'service_provider'
    id = db.Column(db.Integer, primary_key=True) # pylint: disable=invalid-name
    service_type_id = db.Column(db.Integer, db.ForeignKey('service_type.id'), nullable=False)
    service_type = db.relationship(
        'ServiceType',
        backref=db.backref('service_provider_type', cascade='delete, delete-orphan')
    )
    provider_id = db.Column(db.Integer, db.ForeignKey('provider.id'), nullable=False)
    provider = db.relationship(
        'Provider',
        backref=db.backref('provider_serviceprovider', cascade='delete, delete-orphan')
    )
    service_provider_name = db.Column(db.String(length=120), nullable=False)
    service_provider_description = db.Column(db.String(length=500), nullable=True)
    configurable_by = db.Column(db.String(length=120), nullable=False)
    is_active = db.Column(db.Boolean(), default=True)
    is_public = db.Column(db.Boolean(), default=True)

    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "service_type_id=\"{self.service_type_id}\", "
            "provider_id=\"{self.provider_id}\", "
            "service_provider_name=\"{self.service_provider_name}\", "
            "service_provider_description=\"{self.service_provider_description}\", "
            "configurable_by=\"{self.configurable_by}\", "
            "is_active=\"{self.is_active}\", "
            "is_public=\"{self.is_public}\", "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )

class ServiceProviderMetaData(db.Model, Timestamp):
    """
    ServiceProvider MetaData database model.
    """
    _tablename_ = 'service_provider_metadata'
    id = db.Column(db.Integer, primary_key=True)  # pylint: disable=invalid-name
    service_provider_id = db.Column(db.Integer, db.ForeignKey('service_provider.id'), nullable=False)
    service_provider = db.relationship(
        'ServiceProvider',
        backref=db.backref('service_provider_type_metadata', cascade='delete, delete-orphan')
    )
    meta_key = db.Column(db.String(length=256), nullable=True)
    meta_value = db.Column(db.String(length=256), nullable=True)
    
    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "service_provider_id=\"{self.service_provider_id}\", "
            "meta_key=\"{self.meta_key}\", "
            "meta_value=\"{self.meta_value}\", "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )

class ProviderMetadata(db.Model, Timestamp):
    """
    provider metadata database model.
    """
    _tablename_ = 'provider_metadata'
    id = db.Column(db.Integer, primary_key=True) # pylint: disable=invalid-name
    provider_id = db.Column(db.Integer, db.ForeignKey('provider.id'), nullable=True)
    provider = db.relationship(
        'Provider',
        backref=db.backref('provider_metadata_provider', cascade='delete, delete-orphan')
    )
    meta_key = db.Column(db.String(length=1024), nullable=True)
    meta_value = db.Column(db.String(length=120), nullable=True)
   
    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "provider_id=\"{self.metric_level}\", "
            "meta_key=\"{self.report_label}\", "
            "meta_value=\"{self.resource_type}\", "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )

class ProviderPublicKey(db.Model, Timestamp):
    """
    Provider Public Key Database Model
    """
    __tablename__ = 'provider_public_key'
    id = db.Column(db.Integer, primary_key=True) # pylint: disable=invalid-name
    provider_id = db.Column(db.Integer, db.ForeignKey('provider.id'), nullable=True)
    provider = db.relationship(
        'Provider',
        backref=db.backref('provider_public_key_provider', cascade='delete, delete-orphan')
    )
    public_key = db.Column(db.Text, nullable=False)
    key_usability = db.Column(db.String(length=50), nullable=False)
    status = db.Column(db.String(length=50), nullable=False)

    def __repr__(self):
        return f'<{self.__class__.__name__}(id={self.id}, provider_id={self.provider_id}, public_key={self.public_key}, key_usability={self.key_usability}, status={self.status})>'
        

class OpenstackObjectStorageProviderMapping(db.Model, Timestamp):
    """
    Openstack Object Storage Provider Mapping Database Model
    """
    __tablename__ = 'openstack_object_storage_provider_mapping'
    id = db.Column(db.Integer, primary_key=True) # pylint: disable=invalid-name
    provider_id = db.Column(db.Integer, db.ForeignKey('provider.id'), nullable=True)
    provider = db.relationship(
        'Provider',
        backref=db.backref('openstack_object_storage_provider', cascade='delete, delete-orphan')
    )
    object_storage_provider_name = db.Column(db.String(length=120), nullable=False)
    object_storage_provider_id = db.Column(db.Integer, nullable=False)
    object_storage_provider_type_name = db.Column(db.String(length=120), nullable=False)
    public = db.Column(db.Boolean(), default=True)
    is_active = db.Column(db.Boolean(), default=True)
    status = db.Column(db.String(length=50), default = 'Active', nullable=True)
    
    def __repr__(self):
        return f'<{self.__class__.__name__}(id={self.id}, provider_id={self.provider_id}, object_storage_provider_name={self.object_storage_provider_name}, object_storage_provider_id={self.object_storage_provider_id}, object_storage_provider_type_name={self.object_storage_provider_type_name}, public={self.public}, is_active={self.is_active}, status={self.status})>'