# encoding: utf-8
"""
Input arguments (Parameters) for QuotaPackage resources RESTful API
-----------------------------------------------------------
"""

from flask_marshmallow import base_fields
from flask_restplus_patched import PostFormParameters, PatchJSONParameters
#from app.modules.users.parameters import AddUserParameters
from app.modules.users import schemas
from flask_restplus_patched import Parameters


class InitUserToProjectParameters(PostFormParameters):

    email = base_fields.Email(description="Example: test@yntraa.com", required=True)
    password = base_fields.String(description="No rules yet", required=True)
    first_name = base_fields.String(description="Example: Test Name", required=True)
    middle_name = base_fields.String(description="Example: Test Name", required=False)
    last_name = base_fields.String(description="Example: Test Name", required=False)
    mobile_no = base_fields.String(description="Example: 9876543210", required=False)
    user_role = base_fields.Integer(description="Example: 1", required=False)    
    user_scope = base_fields.List(base_fields.String, required=False)
    project_id = base_fields.List(base_fields.String, required=True)
    user_type = base_fields.String(description="Example: admin, regular, internal", required=False)
    client_id = base_fields.String(description="Example: Client ID for Authentication", required=False)
    client_secret = base_fields.String(description="Example: Client Secret for Verification", required=False)
    class Meta():

        fields =(
            'email',
            'password',
            'first_name',
            'middle_name',
            'last_name',
            'mobile_no',
            'user_role',
            'user_scope',
            'project_id',
            'client_id',
            'client_secret',
            'user_type',
        )

class ListConsentDataParameters(Parameters):
    module = base_fields.String(description="Example: user", required=True)
    service = base_fields.String(description="Example: public_ip", required=True)
    action = base_fields.String(description="Example: withdrawal", required=True)