# encoding: utf-8
"""
Organisations database models
--------------------
"""
from sqlalchemy_utils import types as column_types, Timestamp
from app.extensions import db
from app.modules import validate_name
#from app.modules.users.models import _get_is_static_role_property
import enum
from sqlalchemy.dialects.postgresql import JSON

class CloudPortalDetails(db.Model, Timestamp):
    """
    cloud portal database model
    """
    __tablename__ = 'cloud_portal_details'
    id = db.Column(db.Integer, primary_key=True) # pylint: disable=invalid-name
    name = db.Column(db.String(length=500), nullable=True)
    url = db.Column(db.String(length=500), nullable=True)
    status = db.Column(db.String(length=50), nullable=True, default="Active")

    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "name=\"{self.name}\", "
            "description=\"{self.url}\", "
            "org_reg_code=\"{self.status}\", "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )

class Organisation(db.Model, Timestamp):
    """
    Organisations database model.
    """
    id = db.Column(db.Integer, primary_key=True) # pylint: disable=invalid-name
    org_id = db.Column(db.String(length=50), unique=True, nullable=False)
    name = db.Column(db.String(length=100), nullable=True)
    description = db.Column(db.String(length=1000), nullable=True)
    org_reg_code = db.Column(db.String(length=50), nullable=True)
    org_reg_code_generated_from = db.Column(db.Integer, db.ForeignKey('cloud_portal_details.id'), default=1, nullable=True)
    cloud_portal_details = db.relationship(
        'CloudPortalDetails',
        backref=db.backref('cloud_portal_details_organisation', cascade='delete, delete-orphan')
    )
    type = db.Column(db.String(length=50), nullable=True)

    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "name=\"{self.name}\", "
            "description=\"{self.description}\", "
            "org_reg_code=\"{self.org_reg_code}\", "
            "org_reg_code_generated_from=\"{self.org_reg_code_generated_from}\", "
            # "default=\"{self.default}\","
            "type=\"{self.type}\","
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )
    # @db.validates('name')
    # def validate_name(self, key, name): # pylint: disable=unused-argument,no-self-use
    #     # if len(name) < 5:
    #     #     raise ValueError("Name has to be at least 3 characters long.")
    #     # return name
    #     temp_name = validate_name(key, name)
    #     return temp_name

class OrganisationProjectUser(db.Model, Timestamp):
    """
    Organisations User and Project Mapping database model.
    """
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship(
        'User',
        backref=db.backref('organisation_project_user_user', cascade='delete, delete-orphan')
    )
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=True)
    project = db.relationship(
        'Project',
        backref=db.backref('organisation_project_user_project', cascade='delete, delete-orphan')
    )
    organisation_id = db.Column(db.Integer, db.ForeignKey('organisation.id'), nullable=False)
    organisation = db.relationship(
        'Organisation',
        backref=db.backref('organisation_project_user_organisation', cascade='delete, delete-orphan')
    )


    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "user_id=\"{self.user_id}\", "
            "project_id=\"{self.project_id}\", "
            "organisation_id=\"{self.organisation_id}\", "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )

class OrganisationQuotaPackage(db.Model, Timestamp):
    """
    Organisations QuotaPackage database model.
    """
    __tablename__ = 'organisation_quotapackage'
    id = db.Column(db.Integer, primary_key=True) # pylint: disable=invalid-name
    

    organisation_id = db.Column(db.Integer, db.ForeignKey('organisation.id'), nullable=False)
    organisation = db.relationship(
        'Organisation',
        backref=db.backref('organisation_quotapackage_organisation', cascade='delete, delete-orphan')
    )

    quotapackage_id = db.Column(db.Integer, db.ForeignKey('quotapackage.id'), nullable=False)
    quotapackage = db.relationship(
        'QuotaPackage',
        backref=db.backref('organisation_quotapackage_quotapackage', cascade='delete, delete-orphan')
    )


    provider_id = db.Column(db.Integer, db.ForeignKey('provider.id'), nullable=False)
    provider = db.relationship(
        'Provider',
        backref=db.backref('organisation_quotapackage_provider', cascade='delete, delete-orphan')
    )
    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "            
            "organisation_id=\"{self.organisation_id}\", "
            "quotapackage_id=\"{self.quotapackage_id}\", "
            "provider_id=\"{self.provider_id}\", "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )

def _get_is_static_role_property(role_name, static_role):
    """
    A helper function that aims to provide a property getter and setter
    for static roles.

    Args:
        role_name (str)
        static_role (int) - a bit mask for a specific role

    Returns:
        property_method (property) - preconfigured getter and setter property
        for accessing role.
    """
    @property
    def _is_static_role_property(self):
        return self.has_static_role(static_role)

    @_is_static_role_property.setter
    def _is_static_role_property(self, value):
        if value:
            self.set_static_role(static_role)
        else:
            self.unset_static_role(static_role)

    _is_static_role_property.fget.__name__ = role_name
    return _is_static_role_property

class OrganisationOnboardingRequest(db.Model, Timestamp):
    __tablename__ = 'organisation_onboarding_request'
    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)  # pylint: disable=invalid-name
    name = db.Column(db.String(length=100), nullable=True)
    description = db.Column(db.String(length=1000), nullable=True)
    org_reg_code = db.Column(db.String(length=50), nullable=True)
    org_id = db.Column(db.String(length=50), nullable=False)
    # project_name = db.Column(db.String(length=100), nullable=True)
    # project_description = db.Column(db.String(length=1000), nullable=True)
    # project_meta = db.Column(db.String(length=256), nullable=True)
    quotapackage_name = db.Column(db.String(length=256), nullable=True)
    provider_location = db.Column(db.String(length=256), nullable=True)
    request_origin = db.Column(db.String(length=256), nullable=True)
    requested_by = db.Column(db.String(length=100), nullable=True)
    # remarks = db.Column(db.   String(length=1024), nullable=True)
    status = db.Column(db.String(length=50), nullable=True)
    type = db.Column(db.String(length=50), nullable=True)
    
    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "            
            "name=\"{self.name}\", "
            "description=\"{self.description}\", "
            "org_reg_code=\"{self.org_reg_code}\", "
            "org_id=\"{self.org_id}\", "
            # "project_name=\"{self.project_name}\", "
            # "project_description=\"{self.project_description}\", "
            # "project_meta=\"{self.project_meta}\","
            "quotapackage_name=\"{self.quotapackage_name}\","
            "provider_location=\"{self.provider_location}\","
            "request_origin=\"{self.request_origin}\","
            "requested_by=\"{self.requested_by}\","
            "status=\"{self.status}\","
            "type=\"{self.type}\","
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )

# def _get_is_static_role_property(role_name, static_role):
#     """
#     A helper function that aims to provide a property getter and setter
#     for static roles.
#
#     Args:
#         role_name (str)
#         static_role (int) - a bit mask for a specific role
#
#     Returns:
#         property_method (property) - preconfigured getter and setter property
#         for accessing role.
#     """
#     @property
#     def _is_static_role_property(self):
#         return self.has_static_role(static_role)
#
#     @_is_static_role_property.setter
#     def _is_static_role_property(self, value):
#         if value:
#             self.set_static_role(static_role)
#         else:
#             self.unset_static_role(static_role)
#
#     _is_static_role_property.fget.__name__ = role_name
#     return _is_static_role_property

class OrganisationOnboardingUserRequest(db.Model, Timestamp):

    __tablename__ = 'organisation_onboarding_user_request'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)  # pylint: disable=invalid-name
    username = db.Column(db.String(length=80), nullable=False)
    password = db.Column(
        column_types.PasswordType(
            max_length=128,
            schemes=('bcrypt',)
        ),
        nullable=False
    )
    email = db.Column(db.String(length=120),  nullable=False)
    first_name = db.Column(db.String(length=30), default='', nullable=False)
    middle_name = db.Column(db.String(length=30), default='', nullable=True)
    last_name = db.Column(db.String(length=30), default='', nullable=True)
    mobile_no = db.Column(db.String(length=30), nullable=True)
    class StaticRoles(enum.Enum):
        # pylint: disable=missing-docstring,unsubscriptable-object
        INTERNAL = (0x8000, "Internal")
        ADMIN = (0x4000, "Admin")
        REGULAR_USER = (0x2000, "Regular User")
        ACTIVE = (0x1000, "Active Account")

        @property
        def mask(self):
            return self.value[0]

        @property
        def title(self):
            return self.value[1]
    static_roles = db.Column(db.Integer, default=0, nullable=False)
    organisation_onboarding_request_id = db.Column(db.Integer, db.ForeignKey('organisation_onboarding_request.id'), nullable=False)
    organisation_onboarding_request = db.relationship(
        'OrganisationOnboardingRequest',
        backref=db.backref('organisation_onboarding_request_user', cascade='delete, delete-orphan')
    )
    is_internal = _get_is_static_role_property('is_internal', StaticRoles.INTERNAL)
    is_admin = _get_is_static_role_property('is_admin', StaticRoles.ADMIN)
    is_regular_user = _get_is_static_role_property('is_regular_user', StaticRoles.REGULAR_USER)
    is_active = _get_is_static_role_property('is_active', StaticRoles.ACTIVE)

    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "username=\"{self.username}\", "
            "email=\"{self.email}\", "
            "mobile_no=\"{self.mobile_no}\", "
            "organisation_onboarding_request_id={self.organisation_onboarding_request_id},"
            "is_internal={self.is_internal}, "
            "is_admin={self.is_admin}, "
            "is_regular_user={self.is_regular_user}, "
            "is_active={self.is_active}, "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )

    def has_static_role(self, role):
        return (self.static_roles & role.mask) != 0

    def set_static_role(self, role):
        if self.has_static_role(role):
            return
        self.static_roles |= role.mask

    def unset_static_role(self, role):
        if not self.has_static_role(role):
            return
        self.static_roles ^= role.mask

    def check_owner(self, user):
        return self == user

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

class QuotaPackageUpdateRequest(db.Model, Timestamp):
    """
    QuotaPackage Update Request database model.
    """
    __tablename__ = 'quotapackage_update_request'
    id = db.Column(db.Integer, primary_key=True) # pylint: disable=invalid-name
    

    organisation_id = db.Column(db.Integer, db.ForeignKey('organisation.id'), nullable=False)
    organisation = db.relationship(
        'Organisation',
        backref=db.backref('quotapackage_update_organisation', cascade='delete, delete-orphan')
    )

    provider_id = db.Column(db.Integer, db.ForeignKey('provider.id'), nullable=False)
    provider = db.relationship(
        'Provider',
        backref=db.backref('quotapackage_update_provider', cascade='delete, delete-orphan')
    )

    quotapackage_id = db.Column(db.Integer, db.ForeignKey('quotapackage.id'), nullable=False)
    quotapackage = db.relationship(
        'QuotaPackage',
        backref=db.backref('quotapackage_update_quotapackage', cascade='delete, delete-orphan')
    )

    allocation_date = db.Column(db.DateTime(), nullable=True)
    requested_by = db.Column(db.Integer,  nullable=True)
    allocated_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    user = db.relationship(
        'User',
        backref=db.backref('quotapackage_update_user', cascade='delete, delete-orphan')
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
            "quotapackage_id=\"{self.quotapackage_id}\", "
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


class OrganisationOnboardingUpdateRequest(db.Model, Timestamp):
    _tablename_ = 'organisation_onboarding_update_request'
    id = db.Column(db.Integer, primary_key=True, unique=True, autoincrement=True)  # pylint: disable=invalid-name
    name = db.Column(db.String(length=100), nullable=True)
    description = db.Column(db.String(length=1000), nullable=True)
    org_reg_code = db.Column(db.String(length=50), db.ForeignKey('organisation.org_reg_code'), nullable=False)
    organisation = db.relationship(
        'Organisation',
        backref=db.backref('onboarding_organisation_reg_code', cascade='delete, delete-orphan')
    )
    project_name = db.Column(db.String(length=100), nullable=True)
    project_description = db.Column(db.String(length=1000), nullable=True)
    user_details = db.Column(JSON, nullable=True)
    action_date = db.Column(db.DateTime(), nullable=True)
    requested_by = db.Column(db.Integer, nullable=True)
    allocated_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    user = db.relationship(
        'User',
        backref=db.backref('onboarding_update_user', cascade='delete, delete-orphan')
    )
    status = db.Column(db.String(length=50), nullable=True)
    remarks = db.Column(db.String(length=1000), nullable=True)
    
    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "            
            "name=\"{self.name}\", "
            "description=\"{self.description}\", "
            "org_reg_code=\"{self.org_reg_code}\", "
            "project_name=\"{self.project_name}\", "
            "project_description=\"{self.project_description}\", "
            "user_details=\"{self.user_details}\","
            "action_date=\"{self.action_date}\","
            "requested_by=\"{self.requested_by}\","
            "allocated_by=\"{self.allocated_by}\","
            "status=\"{self.status}\","
            "remarks=\"{self.remarks}\","
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )


class OrganisationZoneMapping(db.Model, Timestamp):
    """
    Organisation Zone Mapping database model.
    """
    _tablename_ = 'organisation_zone_mapping'
    id = db.Column(db.Integer, primary_key=True) # pylint: disable=invalid-name
    
    organisation_id = db.Column(db.Integer, db.ForeignKey('organisation.id'), nullable=False)
    organisation = db.relationship(
        'Organisation',
        backref=db.backref('organisation_zone', cascade='delete, delete-orphan')
    )
    provider_id = db.Column(db.Integer, db.ForeignKey('provider.id'), nullable=False)
    provider = db.relationship(
        'Provider',
        backref=db.backref('organisation_zone_provider', cascade='delete, delete-orphan')
    )
    availability_zone_id = db.Column(db.Integer, db.ForeignKey('resource_availability_zones.id'), nullable=False)
    resource_availability_zones = db.relationship(
        'ResourceAvailabilityZones',
        backref=db.backref('organisation_availability_zones', cascade='delete, delete-orphan')
    )
    resource_name = db.Column(db.String(length=120), nullable=True)
    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "            
            "organisation_id=\"{self.organisation_id}\", "
            "provider_id=\"{self.provider_id}\", "
            "availability_zone_id=\"{self.availability_zone_id}\", "
            "resource_name=\"{self.resource_name}\", "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )

class Subscription(db.Model, Timestamp):
    """
    Organisation Zone Mapping database model.
    """
    __tablename__ = 'subscription'
    id = db.Column(db.Integer, primary_key=True)  # pylint: disable=invalid-name

    organisation_id = db.Column(db.Integer, db.ForeignKey('organisation.id'), nullable=False)
    provider_id = db.Column(db.Integer, db.ForeignKey('provider.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    eula_id = db.Column(db.Integer, db.ForeignKey('eula.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "organisation_id=\"{self.organisation_id}\", "
            "provider_id=\"{self.provider_id}\", "
            "project_id=\"{self.project_id}\", "
            "eula_id=\"{self.eula_id}\", "
            "user_id=\"{self.user_id}\", "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )