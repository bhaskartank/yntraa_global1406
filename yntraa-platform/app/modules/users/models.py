# encoding: utf-8
"""
User database models
--------------------
"""
import enum

from sqlalchemy_utils import types as column_types, Timestamp

from app.extensions import db


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


class User(db.Model, Timestamp):
    """
    User database model.
    """

    id = db.Column(db.Integer, primary_key=True) # pylint: disable=invalid-name
    username = db.Column(db.String(length=80), unique=True, nullable=False)
    password = db.Column(
        column_types.PasswordType(
            max_length=128,
            schemes=('bcrypt', )
        ),
        nullable=False
    )
    email = db.Column(db.String(length=120), unique=True, nullable=False)
    first_name = db.Column(db.String(length=30), default='', nullable=False)
    middle_name = db.Column(db.String(length=30), default='', nullable=False)
    last_name = db.Column(db.String(length=30), default='', nullable=False)
    mobile_no = db.Column(db.String(length=30), nullable=True)
    user_type = db.Column(db.String(length=30), default='normal', nullable=False)
    is_csrf_token = db.Column(db.Boolean(), default=True)
    is_2fa = db.Column(db.Boolean(), default=True)
    status = db.Column(db.String(length=50), nullable=True)
    external_crm_uuid = db.Column(db.String(length=50), nullable=True)
    # org_id = db.Column(db.String, db.ForeignKey('organization.org_id'), nullable=False)
    customer_reg_code = db.Column(db.String(length=50), nullable=True)
    user_id = db.Column(db.String(length=50), nullable=True)
    contact_type = db.Column(db.String(length=50), nullable=True)
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

    is_internal = _get_is_static_role_property('is_internal', StaticRoles.INTERNAL)
    is_admin = _get_is_static_role_property('is_admin', StaticRoles.ADMIN)
    is_regular_user = _get_is_static_role_property('is_regular_user', StaticRoles.REGULAR_USER)
    is_active = _get_is_static_role_property('is_active', StaticRoles.ACTIVE)


    def __repr__(self):
        return (
            "<{class_name}("
            "id={self.id}, "
            "username=\"{self.username}\", "
            "first_name=\"{self.first_name}\", "
            "middle_name=\"{self.middle_name}\", "
            "last_name=\"{self.last_name}\", "
            "email=\"{self.email}\", "
            "mobile_no=\"{self.mobile_no}\", "
            "user_type=\"{self.user_type}\", "
            "is_csrf_token=\"{self.is_csrf_token}\", "
            "is_2fa=\"{self.is_2fa}\", "
            "status=\"{self.status}\", "
            "is_internal={self.is_internal}, "
            "is_admin={self.is_admin}, "
            "is_regular_user={self.is_regular_user}, "
            "is_active={self.is_active}, "
            "external_crm_uuid=\"{self.external_crm_uuid}\", "
            # "org_id=\"{self.org_id}\", "
            "customer_reg_code=\"{self.customer_reg_code}\", "
            "contact_type=\"{self.contact_type}\", "
            "static_roles={self.static_roles}, "
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

    @classmethod
    def find_with_password(cls, username, password):
        """
        Args:
            username (str)
            password (str) - plain-text password

        Returns:
            user (User) - if there is a user with a specified username and
            password, None otherwise.
        """
        user = cls.query.filter_by(username=username).first()
        if not user:
            return None
        if user.password == password:
            return user
        return None

