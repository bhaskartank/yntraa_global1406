# encoding: utf-8
# pylint: disable=too-few-public-methods
"""
Auth schemas
------------
"""

from flask_marshmallow import base_fields
from flask_restplus_patched import ModelSchema

from .models import OAuth2Client, OAuth2Token


class BaseOAuth2ClientSchema(ModelSchema):
    """
    Base OAuth2 client schema exposes only the most general fields.
    """
    default_scopes = base_fields.List(base_fields.String, required=True)
    redirect_uris = base_fields.List(base_fields.String, required=True)

    class Meta:
        # pylint: disable=missing-docstring
        model = OAuth2Client
        fields = (
            OAuth2Client.user_id.key,
            OAuth2Client.client_id.key,
            OAuth2Client.client_type.key,
            OAuth2Client.default_scopes.key,
            OAuth2Client.redirect_uris.key,
        )
        dump_only = (
            OAuth2Client.user_id.key,
            OAuth2Client.client_id.key,
        )


class DetailedOAuth2ClientSchema(BaseOAuth2ClientSchema):
    """
    Detailed OAuth2 client schema exposes all useful fields.
    """

    class Meta(BaseOAuth2ClientSchema.Meta):
        fields = BaseOAuth2ClientSchema.Meta.fields + (
            OAuth2Client.client_secret.key,
        )

class BaseOAuth2TokenSchema(ModelSchema):
    """
    Base OAuth2 token schema exposes only the most general fields.
    """
    scopes = base_fields.List(base_fields.String, required=True)

    class Meta:
        # pylint: disable=missing-docstring
        model = OAuth2Token
        fields = (
            OAuth2Token.user_id.key,
            OAuth2Token.client_id.key,
            OAuth2Token.token_type.key,
            OAuth2Token.access_token.key,
            OAuth2Token.refresh_token.key,
            OAuth2Token.expires.key,
            OAuth2Token.scopes.key,
            OAuth2Token.project_id.key,
        )
        dump_only = (
            OAuth2Token.user_id.key,
            OAuth2Token.client_id.key,
        )

class BaseOAuth2UserTokenSchema(ModelSchema):
    """
    Base OAuth2 user token schema exposes only the most general fields.
    """
    scopes = base_fields.List(base_fields.String, required=True)

    class Meta:
        # pylint: disable=missing-docstring
        model = OAuth2Token
        fields = (
            OAuth2Token.user_id.key,
            OAuth2Token.access_token.key,
            OAuth2Token.scopes.key,
            OAuth2Token.project_id.key,
        )
        dump_only = (
            OAuth2Token.user_id.key,
        )
