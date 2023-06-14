# encoding: utf-8
"""
OAuth2 provider models.

It is based on the code from the example:
https://github.com/lepture/example-oauth2-server

More details are available here:
* http://flask-oauthlib.readthedocs.org/en/latest/oauth2.html
* http://lepture.com/en/2013/create-oauth-server
"""
import enum

from sqlalchemy_utils.types import ScalarListType

from sqlalchemy_utils import types as column_types, Timestamp

from app.extensions import db
from app.extensions.api import abort
from flask_restplus_patched._http import HTTPStatus
from app.modules.users.models import User
from sqlalchemy.dialects.postgresql import JSON
from app.modules.providers.models import Provider
#from app.modules.projects.models import Project
#from app.modules.role_permission.models import RolePermissionGroup


import logging
log = logging.getLogger(__name__)



class OAuth2Client(db.Model):
    """
    Model that binds OAuth2 Client ID and Secret to a specific User.
    """

    __tablename__ = 'oauth2_client'

    client_id = db.Column(db.String(length=40), primary_key=True)
    client_secret = db.Column(
        column_types.PasswordType(
            max_length=128,
            schemes=('bcrypt', )
        ),
        nullable=False
    )
    # db.Column(db.String(length=55), nullable=False)
    user_id = db.Column(db.ForeignKey('user.id', ondelete='CASCADE'), index=True, nullable=False)
    user = db.relationship(User)

    class ClientTypes(str, enum.Enum):
        public = 'public'
        confidential = 'confidential'

    client_type = db.Column(db.Enum(ClientTypes), default=ClientTypes.public, nullable=False)
    redirect_uris = db.Column(ScalarListType(separator=' '), default=[], nullable=True)
    default_scopes = db.Column(ScalarListType(separator=' '), nullable=True, default=["auth:read"])

    # role_permission_group_id = db.Column(db.ForeignKey('role_permission_group.id', ondelete='CASCADE'), default=0)
    # role_permission_group = db.relationship(
    #     'RolePermissionGroup',
    #     backref=db.backref('oauth2clint_role_permission_group', cascade='delete, delete-orphan')
    # )

    # project_id = db.Column(db.ForeignKey('project.id', ondelete='CASCADE'), default=0)
    # project = db.relationship(
    #     'Project',
    #     backref=db.backref('oauth2clint_project', cascade='delete, delete-orphan')
    # )
    

    @property
    def default_redirect_uri(self):
        redirect_uris = self.redirect_uris
        if redirect_uris:
            return redirect_uris[0]
        return None

    @classmethod
    def find(cls, client_id):

        if not client_id:
            abort(
                code=HTTPStatus.UNAUTHORIZED,
                message="Invalid username or client ID"
            )
        client = cls.query.get(client_id)
        if client is None:

            abort(
                code=HTTPStatus.UNAUTHORIZED,
                message="Invalid username or client ID"
            )
        else:
            return client

class OAuth2Grant(db.Model):
    """
    Intermediate temporary helper for OAuth2 Grants.
    """

    __tablename__ = 'oauth2_grant'

    id = db.Column(db.Integer, primary_key=True)  # pylint: disable=invalid-name

    user_id = db.Column(db.ForeignKey('user.id', ondelete='CASCADE'), index=True, nullable=False)
    user = db.relationship('User')

    client_id = db.Column(
        db.String(length=40),
        db.ForeignKey('oauth2_client.client_id'),
        index=True,
        nullable=False,
    )
    client = db.relationship('OAuth2Client')

    code = db.Column(db.String(length=255), index=True, nullable=False)

    redirect_uri = db.Column(db.String(length=255), nullable=False)
    expires = db.Column(db.DateTime, nullable=False)

    scopes = db.Column(ScalarListType(separator=' '), nullable=False)

    def delete(self):
        db.session.delete(self)
        db.session.commit()
        return self

    @classmethod
    def find(cls, client_id, code):
        return cls.query.filter_by(client_id=client_id, code=code).first()


class OAuth2Token(db.Model):
    """
    OAuth2 Access Tokens storage model.
    """

    __tablename__ = 'oauth2_token'

    id = db.Column(db.Integer, primary_key=True)  # pylint: disable=invalid-name
    client_id = db.Column(
        db.String(length=40),
        db.ForeignKey('oauth2_client.client_id'),
        index=True,
        nullable=False,
    )
    client = db.relationship('OAuth2Client')

    user_id = db.Column(db.ForeignKey('user.id', ondelete='CASCADE'), index=True, nullable=False)
    user = db.relationship('User')
    # project_id = db.Column(db.ForeignKey('project.id', ondelete='CASCADE'), index=True, default=0, nullable=False)
    # project = db.relationship('Project')
    project_id = db.Column(db.Integer, default=0)
    class TokenTypes(str, enum.Enum):
        # currently only bearer is supported
        Bearer = 'Bearer'
    token_type = db.Column(db.Enum(TokenTypes), nullable=False)
    access_token = db.Column(db.String(length=255), unique=True, nullable=False)
    refresh_token = db.Column(db.String(length=255), unique=True, nullable=True)
    expires = db.Column(db.DateTime, nullable=False)
    scopes = db.Column(ScalarListType(separator=' '), nullable=False)

    @classmethod
    def find(cls, access_token=None, refresh_token=None):
        if access_token:
            return cls.query.filter_by(access_token=access_token).first()

        elif refresh_token:
            return cls.query.filter_by(refresh_token=refresh_token).first()

    def delete(self):
        with db.session.begin():
            db.session.delete(self)
    
class OAuth2AdminToken(db.Model):
    """
    OAuth2 Admin Access Tokens storage model.
    """

    __tablename__ = 'oauth2_admin_token'

    id = db.Column(db.Integer, primary_key=True)  # pylint: disable=invalid-name
    client_id = db.Column(
        db.String(length=40),
        db.ForeignKey('oauth2_client.client_id'),
        index=True,
        nullable=False,
    )
    client = db.relationship('OAuth2Client')

    user_id = db.Column(db.ForeignKey('user.id', ondelete='CASCADE'), index=True, nullable=False)
    user = db.relationship('User')
    class AdminTokenTypes(str, enum.Enum):
        # currently only bearer is supported
        Bearer = 'Bearer'
    token_type = db.Column(db.Enum(AdminTokenTypes), nullable=False)
    access_token = db.Column(db.String(length=255), unique=True, nullable=False)
    refresh_token = db.Column(db.String(length=255), unique=True, nullable=True)
    expires = db.Column(db.DateTime, nullable=False)
    scopes = db.Column(JSON, nullable=False)

    @classmethod
    def find(cls, access_token=None, refresh_token=None):
        if access_token:
            return cls.query.filter_by(access_token=access_token).first()

        elif refresh_token:
            return cls.query.filter_by(refresh_token=refresh_token).first()

    def delete(self):
        with db.session.begin():
            db.session.delete(self)

class HashToken(db.Model, Timestamp):
    "Hash table for generate project, provider and organisation id."

    __tablename__ = 'hash_token'

    id = db.Column(db.Integer, primary_key=True)  # pylint: disable=invalid-name
    project_code_length = db.Column(db.Integer, nullable=True)
    provider_code_length = db.Column(db.Integer, nullable=True)
    org_code_length = db.Column(db.Integer, nullable=True)

class ApiStatus(db.Model, Timestamp):

    __tablename__ = 'api_status'

    id = db.Column(db.Integer, primary_key=True)  # pylint: disable=invalid-name
    isActive = db.Column(db.Boolean, nullable=False)
    setInterval = db.Column(db.Integer, nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    provider_id = db.Column(db.Integer, db.ForeignKey('provider.id'), nullable=True)
    provider = db.relationship(
        'Provider',
        backref=db.backref('provider_api_status', cascade='delete, delete-orphan')
    )

    def __repr__(self):
        return f'<{self.__class__.__name__}(id={self.id}, isActive={self.isActive}, setInterval={self.setInterval}, start_time={self.start_time}, provider_id={self.provider_id})>'

