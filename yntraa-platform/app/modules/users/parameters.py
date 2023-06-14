# encoding: utf-8
# pylint: disable=wrong-import-order
"""
Input arguments (Parameters) for User resources RESTful API
-----------------------------------------------------------
"""

from flask_login import current_user
from flask_marshmallow import base_fields
from flask_restplus_patched import PostFormParameters, PatchJSONParameters
from flask_restplus_patched._http import HTTPStatus
from marshmallow import validates_schema, ValidationError

from app.extensions.api import abort

from . import schemas, permissions
from .models import User
from app.extensions.api.parameters import SortPaginateParameters


# class AddUserParameters(PostFormParameters, schemas.BaseUserSchema):
#     """
#     New user creation (sign up) parameters.
#     """
#
#     username = base_fields.String(description="Example: root", required=True)
#     email = base_fields.Email(description="Example: root@gmail.com", required=True)
#     password = base_fields.String(description="No rules yet", required=True)
#     mobile_no = base_fields.String(description="Example: Mobile No", required=False)
#     recaptcha_key = base_fields.String(
#         description=(
#             "See `/users/signup_form` for details. It is required for everybody, except admins"
#         ),
#         required=False
#     )
#
#     class Meta(schemas.BaseUserSchema.Meta):
#         fields = schemas.BaseUserSchema.Meta.fields + (
#             'email',
#             'password',
#             'mobile_no',
#             'recaptcha_key',
#         )
#
#     @validates_schema
#     def validate_captcha(self, data):
#         """"
#         Check reCAPTCHA if necessary.
#
#         NOTE: we remove 'recaptcha_key' from data once checked because we don't need it
#         in the resource
#         """
#         recaptcha_key = data.pop('recaptcha_key', None)
#         captcha_is_valid = False
#         if not recaptcha_key:
#             no_captcha_permission = permissions.AdminRolePermission()
#             if no_captcha_permission.check():
#                 captcha_is_valid = True
#         # NOTE: This hardcoded CAPTCHA key is just for demo purposes.
#         elif recaptcha_key == 'secret_key':
#             captcha_is_valid = True
#
#         if not captcha_is_valid:
#             abort(code=HTTPStatus.FORBIDDEN, message="CAPTCHA key is incorrect.")
class AddUserParameters(PostFormParameters):
    """
    New user creation (sign up) parameters.
    """

    username = base_fields.String(description="Example: root", required=True)
    first_name = base_fields.String(description="Example: Test Name", required=True)
    middle_name = base_fields.String(description="Example: Test Name", required=False)
    last_name = base_fields.String(description="Example: Test Name", required=False)
    user_role = base_fields.String(description="Example: admin, internal", required=True)
    email = base_fields.Email(description="Example: root@gmail.com", required=True)
    password = base_fields.String(description="No rules yet", required=False)
    mobile_no = base_fields.String(description="Example: Mobile No", required=False)
    user_type = base_fields.String(description="Example: api, normal", required=False)
    is_csrf_token = base_fields.Boolean(description="CSRF Token enable or disable", required=False)
    is_2fa = base_fields.Boolean(description="Two factor authentication enable or disable", required=False)
    status = base_fields.String(description="Example: active, inactive", required=False)
    external_crm_uuid = base_fields.String(description="External CRM UUID", required=False)
    org_id = base_fields.String(description="Organization ID", required=True)
    customer_reg_code = base_fields.String(description="Customer Registration Code", required=False)
    user_id = base_fields.String(description="User ID", required=False)
    contact_type = base_fields.String(description="Contact Type", required=False)
    # recaptcha_key = base_fields.String(
    #     description=(
    #         "See `/users/signup_form` for details. It is required for everybody, except admins"
    #     ),
    #     required=False
    # )

    class Meta():
        fields = (
            'username',
            'first_name',
            'middle_name',
            'last_name',
            'user_role',
            'email',
            'password',
            'mobile_no',
            'status',
            'external_crm_uuid',
            'org_id',
            'customer_reg_code',
            'user_id',
            'contact_type',
            'is_csrf_token',
            'is_2fa',
            'user_type'
            #'recaptcha_key',
        )
class FindUserParameters(PostFormParameters, schemas.BaseUserSchema):
    """
    Find user parameters.
    """
    email = base_fields.String(description="Example: test@yntraa.com", required=True)
    class Meta(schemas.BaseUserSchema.Meta):
        fields = (
            'email',
        )


class ChangePasswordParameters(PostFormParameters):
    current_password = base_fields.String(description="Example: current_password", required=True)
    new_password = base_fields.String(description="new_password", required=True)
    confirm_password = base_fields.String(description="confirm_password", required=True)


class ChangeUserRoleParameters(PostFormParameters, schemas.BaseUserSchema):
    """
    Change user role parameters. Expamle: Admin, Internal, Regular.
    """
    user_role = base_fields.String(description="Example: Admin, Internal, Regular", required=True)
    class Meta(schemas.BaseUserSchema.Meta):
        fields = (
            'user_role',
        )

class PatchUserDetailsParameters(PatchJSONParameters):
    # pylint: disable=abstract-method
    """
    User details updating parameters following PATCH JSON RFC.
    """

    PATH_CHOICES = tuple(
        '/%s' % field for field in (
            User.first_name.key,
            User.middle_name.key,
            User.last_name.key,
            User.password.key,
            User.email.key,
            User.mobile_no.key,
            User.is_active.fget.__name__,
            User.is_regular_user.fget.__name__,
            User.is_admin.fget.__name__,
        )
    )

    @classmethod
    def test(cls, obj, field, value, state):
        """
        Additional check for 'current_password' as User hasn't field 'current_password'
        """
        if field == 'current_password':
            if current_user.password != value and obj.password != value:
                abort(code=HTTPStatus.FORBIDDEN, message="Wrong password")
            else:
                state['current_password'] = value
                return True
        return PatchJSONParameters.test(obj, field, value, state)

    @classmethod
    def replace(cls, obj, field, value, state):
        """
        Some fields require extra permissions to be changed.

        Changing `is_active` and `is_regular_user` properties, current user
        must be a supervisor of the changing user, and `current_password` of
        the current user should be provided.

        Changing `is_admin` property requires current user to be Admin, and
        `current_password` of the current user should be provided..
        """
        if 'current_password' not in state:
            raise ValidationError(
                "Updating sensitive user settings requires `current_password` test operation "
                "performed before replacements."
            )

        if field in {User.is_active.fget.__name__, User.is_regular_user.fget.__name__}:
            with permissions.SupervisorRolePermission(
                    obj=obj,
                    password_required=True,
                    password=state['current_password']
                ):
                # Access granted
                pass
        elif field == User.is_admin.fget.__name__:
            with permissions.AdminRolePermission(
                    password_required=True,
                    password=state['current_password']
                ):
                # Access granted
                pass
        return super(PatchUserDetailsParameters, cls).replace(obj, field, value, state)


class UserListGetParameter(SortPaginateParameters):
    username = base_fields.String(description="Example: root@gmail.com", required=False)


