# encoding: utf-8
"""
Role Permission database models
--------------------
"""

from sqlalchemy_utils import Timestamp
from sqlalchemy_utils.types import ScalarListType
from app.extensions import db

from app.modules.providers.models import Provider
# from app.modules.projects.models import Project
from app.modules.quotapackages.models import QuotaPackage
from app.modules import validate_name
import logging
log = logging.getLogger(__name__)


# from sqlalchemy_utils import types as column_types, Timestamp


# from app.extensions import db
# from app.modules.providers.models import Provider

class UserRole(db.Model, Timestamp):
    """
    UserRole Database Model
    """
    __tablename__ = 'user_roles'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.ForeignKey('user.id', ondelete='CASCADE'), index=True, nullable=False)
    user = db.relationship('User', backref=db.backref('user_roles_user', cascade='delete, delete-orphan'))
    organisation_id = db.Column(db.ForeignKey('organisation.id', ondelete='CASCADE'), nullable=False)
    organisation = db.relationship(
        'Organisation',
        backref=db.backref('user_roles_organisation', cascade='delete, delete-orphan')
    )
    # provider_id = db.Column(db.ForeignKey('provider.id'), nullable=False)
    # provider = db.relationship(
    #     'Provider',
    #     backref=db.backref('user_roles_provider', cascade='delete, delete-orphan')
    # )

    project_id = db.Column(db.Integer, nullable=True)
    # project = db.relationship(
    #     'Project',
    #     backref=db.backref('user_roles_project', cascade='delete, delete-orphan')
    # )
    user_scope = db.Column(ScalarListType(separator=' '), nullable=True)
    user_role = db.Column(db.ForeignKey('role_permission_group.id', ondelete='CASCADE'), default=0)
    role_permission_group = db.relationship(
        'RolePermissionGroup',
        backref=db.backref('user_roles_role_permission_group', cascade='delete, delete-orphan')
    )

    def __repr__(self):
        return (
            "<{class_name}("
            "id=\"{self.id}\", "
            "user_id=\"{self.user_id}\", "
            "organisation_id=\"{self.organisation_id}\", "
            # "project_id=\"{self.project_id}\", "
            "user_scope=\"{self.user_scope}\","
            "user_role=\"{self.user_role}\","
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )

    @classmethod
    def find(cls, organisation_id, project_id, user_id):
        role_object = cls.query.filter_by(organisation_id=organisation_id, project_id=project_id,user_id=user_id).first()
        return role_object



class RolePermissionGroup(db.Model, Timestamp):
    """
    RolePermissionGroup Database Model
    """
    __tablename__ = 'role_permission_group'

    id = db.Column(db.Integer, primary_key=True)
    group_name = db.Column(db.String(length=50), nullable=False)
    group_description = db.Column(db.String(length=200), nullable=False)
    organisation_id = db.Column(db.ForeignKey('organisation.id', ondelete='CASCADE'), default=0)
    organisation = db.relationship(
        'Organisation',
        backref=db.backref('role_permission_group_organisation', cascade='delete, delete-orphan')
    )   
    scope = db.Column(ScalarListType(separator=' '), nullable=True)
    public = db.Column(db.Boolean(), default=True)
    is_active = db.Column(db.Boolean(), default=True)
    status = db.Column(db.String(length=50), default = 'Active', nullable=True)
    role_type = db.Column(db.String(length=50), nullable=True)

    #scope = db.Column(db.VARCHAR(length=500), nullable=False)

    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "group_name=\"{self.group_name}\", "
            "group_description=\"{self.group_description}\", "
            "organisation_id={self.organisation_id}, "
            "scope={self.scope},"
            "public=\"{self.public}\","
            "is_active=\"{self.is_active}\","
            "status=\"{self.status}\","
            "role_type=\"{self.role_type}\","
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )

    @db.validates('group_name')
    def validate_name(self, key, group_name): # pylint: disable=unused-argument,no-self-use
        name = validate_name(key, group_name)
        return name
        # if len(group_name) < 5:
        #     raise ValueError("Group Name has to be at least 5 characters long.")
        # return group_name

class UsersDefaultScope(db.Model, Timestamp):
    """
    UserDefaultScope Database Model
    """
    __tablename__ = 'user_default_scope'

    id = db.Column(db.Integer, primary_key=True)
    user_scope_type = db.Column(db.String(length=50), nullable=False)      
    scope = db.Column(ScalarListType(separator=' '), nullable=True)
    #scope = db.Column(db.VARCHAR(length=500), nullable=False)

    # class UserScopeType(enum.Enum):
    #     # pylint: disable=missing-docstring,unsubscriptable-object
    #     DEFAULT = ('default', "Default")
    #     USER = ('user', "User")
    #     ADMIN = ('admin', "Admin")
    #     INTRNAL = ('internal', "Internal")
    #     REGULAR = ('regular', "Regular")

    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "user_scope_type=\"{self.user_scope_type}\", "
            "scope={self.scope},"
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )

    @db.validates('user_scope_type')
    def validate_name(self, key, user_scope_type): # pylint: disable=unused-argument,no-self-use
        scope_type = validate_name(key, user_scope_type)
        return scope_type


class AllowedAdmin(db.Model, Timestamp):
    """
    AllowedAdmin Database Model
    """
    __tablename__ = 'allowed_admin'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.ForeignKey('user.id', ondelete='CASCADE'), index=True, nullable=False)
    user = db.relationship('User', backref=db.backref('admin_roles_user', cascade='delete, delete-orphan'))

    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "user_id=\"{self.user_id}\", "
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )

class AdminRoleScope(db.Model, Timestamp):
    """
    AdminRoleScope Database Model
    """
    __tablename__ = 'admin_role_scope'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.ForeignKey('user.id', ondelete='CASCADE'), index=True, nullable=False)
    user = db.relationship('User', backref=db.backref('user_roles_admin', cascade='delete, delete-orphan'))
    provider_id = db.Column(db.ForeignKey('provider.id', ondelete='CASCADE'), index=True, nullable=False)
    provider = db.relationship('Provider', backref=db.backref('admin_roles_provider', cascade='delete, delete-orphan'))
    admin_role = db.Column(db.ForeignKey('admin_role_permission_group.id', ondelete='CASCADE'), nullable=False)
    role_permission_group = db.relationship(
        'AdminRolePermissionGroup',
        backref=db.backref('admin_roles_role_permission_group', cascade='delete, delete-orphan')
    )
    scope = db.Column(ScalarListType(separator=' '), nullable=True)
    is_active = db.Column(db.Boolean(), default=True)

    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "user_id=\"{self.user_id}\", "
            "provider_id={self.provider_id}, "
            "admin_role={self.admin_role}, "
            "scope={self.scope},"
            "is_active=\"{self.is_active}\","
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )

class AdminRolePermissionGroup(db.Model, Timestamp):
    """
    AdminRolePermissionGroup Database Model
    """
    __tablename__ = 'admin_role_permission_group'

    id = db.Column(db.Integer, primary_key=True)
    group_name = db.Column(db.String(length=50), nullable=False)

    group_description = db.Column(db.String(length=200), nullable=False)
    scope = db.Column(ScalarListType(separator=' '), nullable=True)
    public = db.Column(db.Boolean(), default=True)
    is_active = db.Column(db.Boolean(), default=True)
    status = db.Column(db.String(length=50), default = 'Active', nullable=True)
    role_type = db.Column(db.String(length=50), nullable=True)

    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "group_name=\"{self.group_name}\", "
            "group_description=\"{self.group_description}\", "
            "scope={self.scope},"
            "public=\"{self.public}\","
            "is_active=\"{self.is_active}\","
            "status=\"{self.status}\","
            "role_type=\"{self.role_type}\","
            ")>".format(
                class_name=self.__class__.__name__,
                self=self
            )
        )

    @db.validates('group_name')
    def validate_name(self, key, group_name): # pylint: disable=unused-argument,no-self-use
        name = validate_name(key, group_name)
        return name
