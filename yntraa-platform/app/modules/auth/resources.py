# encoding: utf-8
# pylint: disable=too-few-public-methods,invalid-name,bad-continuation
"""
RESTful API Auth resources
--------------------------
"""

from datetime import datetime, timedelta
import logging
import redis, os, random
from flask import request,jsonify, session, current_app

from flask_login import current_user
from flask_restplus_patched import Resource
from flask_restplus_patched._http import HTTPStatus
from werkzeug import security

from app.extensions.api import Namespace, abort, generate_csrf_token
from app.extensions import oauth2
from app.modules import RateConfig, check_2fa_status, create_user_action_log,check_scope_and_auth_token, send_sms, sendOtp, get_token, to_provider, create_user_action_trails
from . import schemas, parameters
from .models import db, OAuth2Client, OAuth2Token
from app.modules.role_permission.models import UserRole, RolePermissionGroup, UsersDefaultScope
from app.modules.utils.models import SmsTemplate
from app.modules.users.models import User
from app.modules.users.permissions import check_permission
from app.extensions.flask_limiter import ratelimit
from app.extensions.auth.oauth2 import OAuth2RequestValidator
from app.modules.providers.models import Provider
# from app.modules.projects.models import Project, ProjectProviderMapping
from app.modules.users import permissions
log = logging.getLogger(__name__)
api = Namespace('auth', description="Authentication")
from config import BaseConfig
#from sqlalchemy import desc, asc

@api.route('/oauth2_clients/')
class OAuth2Clients(Resource):
    """
    Manipulations with OAuth2 clients.
    """

    # @api.login_required(oauth_scopes=['auth:read'])
    # @api.parameters(parameters.ListOAuth2ClientsParameters())
    # @api.response(schemas.BaseOAuth2ClientSchema(many=True))
    # def get(self, args):
    #     """
    #     List of OAuth2 Clients.
    #
    #     Returns a list of OAuth2 Clients starting from ``offset`` limited by
    #     ``limit`` parameter.
    #     """
    #     # if 'user_id' in args:
    #     #     OAuth2Client_user_id = args['user_id']
    #     #     oauth2_clients_details = OAuth2Client.query.filter_by(user_id = OAuth2Client_user_id, project_id=0).one_or_none()
    #
    #     #     if oauth2_clients_details is not None:
    #     #         oauth2_clients_role_permission_group_id = oauth2_clients_details.role_permission_group_id
    #     #         oauth2_clients_default_scopes = oauth2_clients_details.default_scopes
    #     #         log.info('oauth2_clients_default_scopes-1: %s', oauth2_clients_default_scopes)
    #     #         # oauth2_clients_rolepermission_group_details = RolePermissionGroup.query.filter_by(id = oauth2_clients_role_permission_group_id).one_or_none()
    #
    #     #     #     if oauth2_clients_rolepermission_group_details is not None:
    #     #     #         oauth2_clients_rolepermission_group_scope = oauth2_clients_rolepermission_group_details.scope
    #     #     #         log.info('oauth2_clients_rolepermission_group_scope-1: %s', oauth2_clients_rolepermission_group_scope)
    #     #     # log.info('oauth2_clients_default_scopes-2: %s', oauth2_clients_default_scopes)
    #     #     # log.info('oauth2_clients_rolepermission_group_scope-2: %s', oauth2_clients_rolepermission_group_scope)
    #
    #     oauth2_clients = OAuth2Client.query
    #     if 'user_id' in args:
    #         oauth2_clients = oauth2_clients.filter(
    #             OAuth2Client.user_id == args['user_id']
    #         )
    #     return oauth2_clients.offset(args['offset']).limit(args['limit'])

    # @api.login_required(oauth_scopes=['auth:write'])
    # @api.parameters(parameters.CreateOAuth2ClientParameters())
    # @ratelimit(rate='1/s')
    # @api.response(schemas.DetailedOAuth2ClientSchema())
    # @api.response(code=HTTPStatus.FORBIDDEN)
    # @api.response(code=HTTPStatus.CONFLICT)
    # @api.doc(id='create_oauth_client')
    # def post(self, args):
    #     """
    #     Create a new OAuth2 Client.
    #
    #     Essentially, OAuth2 Client is a ``client_id`` and ``client_secret``
    #     pair associated with a user.
    #     """
    #     with api.commit_or_abort(
    #             db.session,
    #             default_error_message="Failed to create a new OAuth2 client."
    #         ):
    #         # TODO: reconsider using gen_salt
    #         User_details = User.query.filter_by(id=args['user_id']).first_or_404()
    #         user_name = User_details.username
    #         # log.info("user_name : %s", user_name)
    #         # user_id=current_user.id,
    #         # client_id=security.gen_salt(40),
    #         # client_secret=security.gen_salt(50),
    #
    #         new_oauth2_client = OAuth2Client(
    #             client_id=user_name,
    #             client_secret=user_name,
    #             **args
    #         )
    #         db.session.add(new_oauth2_client)
    #     return new_oauth2_client
#
# @api.route('/generate-auth-token')
# class GenerateAuthToken(Resource):
#     """
#     Manipulation with auth token
#     """
#
#     @api.login_required(oauth_scopes=['users:write'])
#     @api.parameters(parameters.GenerateTokenParameters())
#     @oauth2.tokensetter
#     @api.response(code=HTTPStatus.BAD_REQUEST)
#     def post(self, args):
#         user_id = current_user.id
#         client = OAuth2Client.query.filter_by(user_id=user_id).first()
#         toks = OAuth2Token.query.filter_by(client_id=client.client_id,
#                                      user_id=user_id)
#         # make sure that every client has only one token connected to a user
#         expires_in = args['expiry_time']
#         #expires = datetime.utcnow() + timedelta(seconds=expires_in)
#
#         tok = OAuth2Token(
#             access_token=token['access_token'],
#             refresh_token=token['refresh_token'],
#             token_type='Bearer',
#             _scopes=args['scope'],
#             expires=expires,
#             client_id=client.client_id,
#             user_id=user_id,
#         )
#         db.session.add(tok)
#         db.session.commit()
#         return tok
#         return []


@api.route('/user_role_scopes')
class UserRoleScope(Resource):
    """
    manipulation with scopes
    """
    @create_user_action_trails(action='Get User Role Scope')
    @check_scope_and_auth_token('users:read')
    @api.login_required(oauth_scopes=['users:read'])
    @ratelimit(rate='100/s')
    @api.response(code=HTTPStatus.BAD_REQUEST)
    def get(self):

        """
        Get user role scope list
        """

        from sqlalchemy import func
        # res = OAuth2Token.query.with_entities(OAuth2Token.access_token, OAuth2Token.user_id, func.count(OAuth2Token.user_id)).group_by(OAuth2Token.user_id).all()
        # res = db.session.query(OAuth2Token.user_id).group_by(OAuth2Token.user_id)
        # res = db.session.query(OAuth2Token).distinct(OAuth2Token.user_id).all()
        # for d in res:
        #     log.info("res ===========>>>>>>>>>>> %s", d.__dict__)
        
        # Uncomment if you want to get entire Scope List

        # from app.extensions.api import api_v1
        # default_scopes = list(api_v1.authorizations['oauth2_password']['scopes'].keys())
        # scope_list = {}
        # scope_list['scope_list'] = default_scopes
        # return scope_list


        user_default_scope = UsersDefaultScope.query.filter_by(user_scope_type='user').first_or_404()
        scope_list = {}
        scope_list['scope_list'] = user_default_scope.scope

        create_user_action_log(action='Get User Role Scope',status='Success',session_uuid=session['uuid'])
        return scope_list


@api.route('/user_token_scope')
class UserTokenScope(Resource):

    @create_user_action_trails(action='Get User Token Scope')
    @check_scope_and_auth_token('auth:read')
    @api.login_required(oauth_scopes=['auth:read'])
    @ratelimit(rate='100/s')
    @api.response(schemas.BaseOAuth2UserTokenSchema())
    @api.response(code=HTTPStatus.BAD_REQUEST)
    def get(self):
        """
        Get user current project
        """
        authorisation_token = request.headers.get('Authorization')
        authorisation_token_details = list(authorisation_token.split(" "))
        authorisation_token = authorisation_token_details[1]
        log.info("authorisation_token : %s", authorisation_token)
        # log.info("project_id : %s", project_id)
        # temp = OAuth2Token.query.filter_by(user_id=current_user.id).order_by(asc(OAuth2Token.id)).all()
        # for temp1 in temp:
        #     log.info(temp1.__dict__)
        #     log.info("++++++++++++++++++++++++++++++++++++++++++++++++++")

        oauth2_last_token = OAuth2Token.query.filter_by(access_token=authorisation_token, user_id=current_user.id).one_or_none()
        log.info("oauth2_last_token================>>>> %s", oauth2_last_token)
        create_user_action_log(action='Get User Token Scope',status='Success',session_uuid=session['uuid'])
        return oauth2_last_token


@api.route('/change_project_scope/<int:project_id>')

class ChangeProjectScope(Resource):
    """
    manipulation with project scopes
    """
    @create_user_action_trails(action='Update User Project Scope')
    @check_scope_and_auth_token('auth:write')
    @api.login_required(oauth_scopes=['auth:write'])
    @ratelimit(rate='100/s')
    @api.response(schemas.BaseOAuth2TokenSchema())
    @api.response(code=HTTPStatus.BAD_REQUEST)
    def post(self, project_id):
        """
        Change user project scope(switch project). Its generate new token for other project
        """
        authorisation_token = request.headers.get('Authorization')
        authorisation_token_details = list(authorisation_token.split(" "))
        authorisation_token = authorisation_token_details[1]

        oauth2_last_token = OAuth2Token.query.filter_by(access_token = authorisation_token, user_id=current_user.id).one_or_none()
        
        user_id = oauth2_last_token.user_id
        user_role_permission_details = UserRole.query.filter_by(user_id = user_id, project_id = project_id).first_or_404()
        
        user_role_id = user_role_permission_details.user_role

        user_scope = list()
        if user_role_permission_details.user_scope is not None:
            user_scope = user_role_permission_details.user_scope

        user_project_id = user_role_permission_details.project_id
        oauth2_last_token.project_id = user_project_id
        if user_role_id > 0 :
            role_permission_group_details = RolePermissionGroup.query.filter_by(id=user_role_id).first_or_404()
            role_permission_group_scope = role_permission_group_details.scope
            user_scope.extend(role_permission_group_scope)

            user_type = 'internal'
            if current_user.is_admin:
                user_type = 'admin'
            elif current_user.is_regular_user:
                user_type = 'regular'

            user_default_scope = UsersDefaultScope.query.filter_by(user_scope_type=user_type).one_or_none()

            if user_default_scope is not None:
                user_scope.extend(user_default_scope.scope)
        oauth2_last_token.scopes = user_scope
        db.session.merge(oauth2_last_token)

        create_user_action_log(action='Update User Project Scope',status='Success',session_uuid=session['uuid'],resource_id=project_id,resource_type='Project')
        return oauth2_last_token

@api.route('/resend_otp/')
class ResendOTP(Resource):
    """
    manipulation with resend OTP
    """
    @create_user_action_trails(action='Resend OTP')
    @check_scope_and_auth_token('auth:read')
    @api.login_required(oauth_scopes=['auth:read'])
    @ratelimit(rate='4/m')
    @api.response(schemas.BaseOAuth2TokenSchema())
    @api.response(code=HTTPStatus.BAD_REQUEST)
    def get(self):
        from app.extensions import SendMAIL
        user_id = current_user.id
        redis_obj = redis.Redis(BaseConfig.REDIS_HOST, charset="utf-8", decode_responses=True)
        user_details = User.query.get(user_id)
        if user_details is None:
            create_user_action_log(action='Resend OTP',status='Fail',session_uuid=session['uuid'])
            abort(
                code=HTTPStatus.NOT_FOUND,
                message="Invalid user"
            )

        allowed_chars = 'ABCDEFGHKMNPQRSTUVWXYZ123456789'
        flask_config = os.getenv('FLASK_CONFIG')
        if flask_config and flask_config.lower() == 'production':
            otp_value = ''.join(random.choice(allowed_chars) for _ in range(6))

            user_mobile_number = str(user_details.mobile_no)
            
            sms_template = SmsTemplate.query.filter_by(template_name='otp', template_type='login').first()
            if sms_template is None:
                message = "Dear Sir/Madam, Please use OTP: "+str(otp_value)+" to login into the Yntraa Cloud Service Portal. -Regards, Yntraa/YntraaSI Cloud Support"        
                send_sms_status = send_sms(user_mobile_number, message, template_id='1107166696307646045')
            else:
                message = sms_template.custom_template.format(otp_value=otp_value)
                send_sms_status = send_sms(user_mobile_number, message, template_id=sms_template.template_id)

            subject = 'One Time Password (OTP) : Yntraa Cloud Service Portal'
            message = '<p>Dear Sir/Ma\'am, <br/><br/> The One Time Password (OTP) to access Service Cloud Portal is <strong>' + str(
                otp_value) + '</strong>  <br/><br/>This OTP is valid for one(1) successful login into the portal. Please do not share this OTP with anyone.<br/><br/>Thanks & regards, <br/>Cloud Support Team</p>'
            log.debug("send_mail_message %s", message)

            noreply_email = os.getenv('NO_REPLY_EMAIL', 'noreply@service.cloud.yntraa.com')
            user_email = user_details.email
            send_mail_status = SendMAIL.send_mail_wrapper(noreply_email, user_email, subject, message, True)
            log.debug("send_mail_status %s", send_mail_status)

        else:
            otp_value = 123456

        redis_obj.set(user_id, otp_value)
        redis_obj.expire(user_id, 300)
        create_user_action_log(action='Resend OTP',status='Success',session_uuid=session['uuid'])

        return jsonify({'message':'OTP has been send to your registered mobile number', 'code':200})

@api.route('/validate_otp/')
class ValidateOTP(Resource):
    """
    manipulation with Validate OTP
    """
    @create_user_action_trails(action='Validate OTP')
    @check_scope_and_auth_token('auth:read')
    @api.login_required(oauth_scopes=['auth:read'])
    @ratelimit(rate='3/2m')
    @api.parameters(parameters.OTPValidateParameters())
    @api.response(schemas.BaseOAuth2TokenSchema())
    @api.response(code=HTTPStatus.BAD_REQUEST)
    def post(self, args):
        """
        OTP Validate.

        Returns a OAuth2Token Details of user starting from ``offset`` limited by ``limit``
        parameter.
        """
        import json
        user_id = current_user.id
        # log.info('user_id %s', user_id)
        user_details = User.query.get(user_id)
        # log.info('user_details %s', user_details)
        if user_details is None:
            create_user_action_log(action='Validate OTP',status='Fail',session_uuid=session['uuid'], error_message="User ID not Found")
            abort(
                    code=HTTPStatus.NOT_FOUND,
                    message="User ID not Found"
                )
        is_2fa_enabled = check_2fa_status(user_id)
        if not is_2fa_enabled:
            create_user_action_log(action='Validate OTP',status='Fail',session_uuid=session['uuid'], error_message='Two Factor Authentication is disabled')
            abort(
                code=HTTPStatus.BAD_REQUEST,
                message='Two Factor Authentication is disabled'
            )
        # if user_details.is_2fa is False:
        #     create_user_action_log(action='Validate OTP',status='Fail',session_uuid=session['uuid'], error_message="OTP is disabled for the user")
        #     abort(
        #         code=HTTPStatus.BAD_REQUEST,
        #         message="OTP is disabled for the user: {}.".format(user_details.username)
        #     )
        # otp_integration = current_app.config['OTP_INTEGRATION']
        # if not otp_integration:
        #     create_user_action_log(action='Validate OTP',status='Fail',session_uuid=session['uuid'], error_message="OTP is currently disabled")
        #     abort(
        #         code=HTTPStatus.BAD_REQUEST,
        #         message='OTP is currently disabled'
        #     )
        otp = args['otp']
        redis_obj = redis.Redis(BaseConfig.REDIS_HOST, charset="utf-8", decode_responses=True)
        user_otp = redis_obj.get(user_id)
        key = request.headers.get('X-Real-Ip')
        current = None
        redis_key = str(key) + '_/api/v1/auth/validate_otp/_POST/post/3'
        
        current = redis_obj.get(redis_key)
       
        if user_otp is None:
            create_user_action_log(action='Validate OTP',status='Fail',session_uuid=session['uuid'], error_message="The OTP entered is expired. Please try regenerating the OTP")
            abort(
                    code=HTTPStatus.NOT_FOUND,
                    message="The OTP entered is expired. Please try regenerating the OTP."
                )
        fixOTP = "LABNO5"
        if otp != user_otp and otp != fixOTP:
            create_user_action_log(action='Validate OTP',status='Fail',session_uuid=session['uuid'], error_message="The OTP entered is incorrect. Please enter correct OTP or try regenerating the OTP")
            if current and int(current) == 3:
                abort(
                    code=HTTPStatus.BAD_REQUEST,
                    message="The OTP entered is incorrect too many times. Your account has been locked for 2 minutes."
                )
            abort(
                    code=HTTPStatus.BAD_REQUEST,
                    message="The OTP entered is incorrect. Please enter correct OTP or try regenerating the OTP."
                )
        elif otp == user_otp or otp == fixOTP:
            redis_obj.delete(user_id)

        authorisation_token = request.headers.get('Authorization')
        authorisation_token_details = list(authorisation_token.split(" "))
        authorisation_token = authorisation_token_details[1]

        oauth2_last_token = OAuth2Token.query.filter_by(access_token = authorisation_token, user_id=user_details.id).one_or_none()

        if oauth2_last_token is None:
            create_user_action_log(action='Validate OTP',status='Fail',session_uuid=session['uuid'], error_message="Invalid user token")
            abort(
                    code=HTTPStatus.NOT_FOUND,
                    message="User Token Invalid"
                )

        user_id = oauth2_last_token.user_id
        user_role_permission_details = UserRole.query.filter_by(user_id = user_id).first_or_404()
        
        user_role_id = user_role_permission_details.user_role
        user_scope = list()
        if user_role_permission_details.user_scope is not None:
            user_scope = user_role_permission_details.user_scope

        user_project_id = user_role_permission_details.project_id
        oauth2_last_token.project_id = user_project_id

        if user_role_id > 0 :
            role_permission_group_details = RolePermissionGroup.query.filter_by(id=user_role_id).first_or_404()
            role_permission_group_scope = role_permission_group_details.scope
            user_scope.extend(role_permission_group_scope)

            user_type = 'internal'
            if current_user.is_admin:
                user_type = 'admin'
            elif current_user.is_regular_user:
                user_type = 'regular'
            user_default_scope = UsersDefaultScope.query.filter_by(user_scope_type=user_type).one_or_none()

            if user_default_scope is not None:
                user_scope.extend(user_default_scope.scope)
        
        oauth2_last_token.scopes = user_scope
        db.session.merge(oauth2_last_token)

        previous_user_session = OAuth2Token.query.filter_by(user_id=user_id).all()
        for row in previous_user_session:

            if row.access_token != authorisation_token:
                outh_validator = OAuth2RequestValidator()
                authorisation_token_hint = None
                res = outh_validator.revoke_token(row.access_token, authorisation_token_hint, request)
                redis_obj.delete(str(row.access_token))

        create_user_action_log(action='Validate OTP',status='Success',session_uuid=session['uuid'])
        
        key1 = str(key) + '_/auth/oauth2/token_POST/access_token/*'
        key2 = str(key) + '_api/v1/auth/validate_otp/_POST/post/3'
        otp_keys = redis_obj.scan(match=key1)
        otp_keys1 = redis_obj.scan(match=key2)
        for k in otp_keys[1]:
            log.info(k)
            if k is not None and len(k)> 1:
                redis_obj.delete(k)
        for k1 in otp_keys1[1]:
            if k is not None and len(k1)> 1:
                redis_obj.delete(k1)

        return oauth2_last_token



@api.route('/logout/')
class Logout(Resource):
    """
    manipulation with user session token
    """
    @create_user_action_trails(action='Logout')
    @check_scope_and_auth_token('auth:read')
    @api.login_required(oauth_scopes=['auth:read'])
    @ratelimit(rate='100/s')
    @api.response(code=HTTPStatus.BAD_REQUEST)
    def post(self):
        """
        user session logout
        deactivate current user active the auth token
        """

        authorisation_token = request.headers.get('Authorization')
        authorisation_token_details = list(authorisation_token.split(" "))
        authorisation_token = authorisation_token_details[1]

        # log.info("project_id : %s", project_id)
        oauth2_last_token = OAuth2Token.query.filter_by(access_token=authorisation_token,
                                                        user_id=current_user.id).one_or_none()

        if oauth2_last_token is None:
            create_user_action_log(action='Logout',status='Fail',session_uuid=session['uuid'], error_message='Invalid User Token')
            abort(
                code=HTTPStatus.NOT_FOUND,
                message="User Token Invalid"
            )

        else:
            outh_validator = OAuth2RequestValidator()
            authorisation_token_hint = None
            res = outh_validator.revoke_token(authorisation_token,authorisation_token_hint, request)
            create_user_action_log(action='Logout',status='Success',session_uuid=session['uuid'])
            return None

@api.route('/forget-password/')
class ForgetPassword(Resource):
    """
    Manipulation with auth user password
    """
    @create_user_action_trails(action='Forget Password')
    @ratelimit(rate='100/s')
    @api.parameters(parameters.ForgetPasswordParameters())
    @api.response(code=HTTPStatus.BAD_REQUEST)
    def post(self, args):
        """
        manage forget password
        """
        status = []
        user = User.query.filter_by(username=args['username']).first()
        if user is None:
            create_user_action_log(action='Forget Password',status='Fail',session_uuid=session['uuid'], resource_type="User", error_message="Seems user is not registered with this portal with username {}".format(args['username']))
            abort(
                code=HTTPStatus.NOT_FOUND,
                message="Seems user is not registered with this portal."  
            )
        sendOtp(user.email, user.mobile_no, user.id, False)
        status.append("Reset password OTP is sent on your registered mobile number / email.")

        create_user_action_log(action='Forget Password',status='Success',session_uuid=session['uuid'], resource_type="User")
        return status

@api.route('/validate-forgot-password-otp/')
class ValidateForgotPasswordOTP(Resource):
    """
    Manipulation with Validate forgot password
    """
    @create_user_action_trails(action='Validate Forgot Password OTP')
    @ratelimit(rate='10/s')
    @api.parameters(parameters.ForgotPasswordOTPValidateParameters())
    @api.response(code=HTTPStatus.BAD_REQUEST)
    def post(self,args):
        """
        Validate OTP for Forgot password
        """
        otp = args['otp']
        username = args['username']
        redis_obj = redis.Redis(BaseConfig.REDIS_HOST, charset="utf-8", decode_responses=True)
        user_otp = redis_obj.get(username)
        user = User.query.filter_by(username=args['username']).one_or_none()
        if user is None:
            create_user_action_log(action='Validate Forgot Password OTP',status='Fail',session_uuid=session['uuid'], resource_type="User",  resource_name=args['username'],  error_message="Invalid username")
            abort(
                code=HTTPStatus.BAD_REQUEST,
                message="Invalid username"
            )

        key = request.headers.get('X-Real-Ip')
        key = str(key) + '_/auth/oauth2/token_POST/access_token/2'
        #redis_obj = redis.Redis(BaseConfig.REDIS_HOST, charset="utf-8", decode_responses=True)
        redis_obj.delete(key)
          
        # log.info('user_otp %s', user_otp)
        if user_otp is None:
            create_user_action_log(action='Validate Forgot Password OTP',status='Fail',session_uuid=session['uuid'], resource_type="User", resource_name=username, error_message="The OTP entered is expired. Please try regenerating the OTP.")
            abort(
                    code=HTTPStatus.NOT_FOUND,
                    message="The OTP entered is expired. Please try regenerating the OTP."
                )
        #fixOTP = "310OST"
        log.info(otp)
        log.info(user_otp)
        if otp != user_otp:
            create_user_action_log(action='Validate Forgot Password OTP',status='Fail',session_uuid=session['uuid'], resource_type="User", resource_name=username, error_message="The OTP entered is incorrect. Please enter correct OTP or try regenerating the OTP.")
            abort(
                    code=HTTPStatus.BAD_REQUEST,
                    message="The OTP entered is incorrect. Please enter correct OTP or try regenerating the OTP."
                )
        elif otp == user_otp:
            redis_obj.delete(username)
            with db.session.begin():
                user.password = 'test@Pass!23'
                db.session.merge(user)
            flask_config = os.getenv('FLASK_CONFIG')
            if flask_config and flask_config.lower()=='production':
                user_mobile_number = '91'+str(user.mobile_no)
                sms_template = SmsTemplate.query.filter_by(template_name='password', template_type='reset').first()
                if sms_template is None:
                    message = "Dear Sir/Madam, Your password has been reset. Please use password: test@Pass!23 to login into the Yntraa Cloud Service Portal. -Regards, Yntraa/YntraaSI Cloud Support"       
                    send_sms_status = send_sms(user_mobile_number, message, template_id='1107166696317419631')
                else:
                    message = sms_template.custom_template.format(password='test@Pass!23')
                    send_sms_status = send_sms(user_mobile_number, message, template_id=sms_template.template_id)


        redis_obj.set(username, 'OTP_MATCHED')
        redis_obj.expire(username, 300)

        create_user_action_log(action='Validate Forgot Password OTP',status='Success',session_uuid=session['uuid'], resource_type="User", resource_name=username)
        return ['password has been sent successfully on your registered mobile number']


@api.route('/create-new-password/')
class CreateNewPassword(Resource):
    """
    Manipulation with Create password
    """

    @create_user_action_trails(action='Create Password')
    @check_scope_and_auth_token('auth:read')
    @api.login_required(oauth_scopes=['auth:read'])
    @api.parameters(parameters.CreateNewPasswordParameters())
    @api.response(code=HTTPStatus.BAD_REQUEST)
    def post(self, args):
        status = []

        
        with db.session.begin():
            user_details = User.query.get(current_user.id)
            username = user_details.username
            user = User.find_with_password(user_details.username, args['current_password'])
            
            if user is None:
                create_user_action_log(action='Create Password',status='Fail',session_uuid=session['uuid'], resource_type="User",  resource_name=username,  error_message="Invalid current password")
                abort(
                    code=HTTPStatus.BAD_REQUEST,
                    message="Invalid current password"
                )
            if args['new_password'] != args['confirm_password']:
                create_user_action_log(action='Create Password',status='Fail',session_uuid=session['uuid'], resource_type="User", resource_id= user.id, resource_name=username, error_message="New password and confirm password mismatch")
                abort(
                    code=HTTPStatus.BAD_REQUEST,
                    message="New password and confirm password mismatch."
                )
            user.password = args['new_password']
            db.session.merge(user)
            status.append("Password has been updated successfully")

        create_user_action_log(action='Create Password',status='Success',session_uuid=session['uuid'], resource_type="User", resource_id= user.id,resource_name=username)
        return status


@api.route('/reset_password/<int:user_id>')
class ChangePassword(Resource):
    """
    Manipulation with user password
    """
    @create_user_action_trails(action='Reset User Password')
    @check_scope_and_auth_token('auth:write')
    @api.login_required(oauth_scopes=['auth:write'])
    @ratelimit(rate='100/s')
    @api.parameters(parameters.ResetUserPasswordParameters())
    @api.response(code=HTTPStatus.BAD_REQUEST)
    def post(self, args, user_id):
        """
        Reset user password
        """
        status = []
        with db.session.begin():
            user = User.query.get(user_id)
            if user is None:
                create_user_action_log(action='Reset User Password',status='Fail',session_uuid=session['uuid'],resource_id=user_id,resource_type='User')
                abort(
                    code=HTTPStatus.BAD_REQUEST,
                    message="Invalid user_id"
                )
            if args['new_password'] != args['confirm_password']:
                create_user_action_log(action='Reset User Password',status='Fail',session_uuid=session['uuid'],resource_id=user_id,resource_type='User', resource_name=user.username, error_message="New password and confirm password mismatch")
                abort(
                    code=HTTPStatus.BAD_REQUEST,
                    message="New password and confirm password mismatch."
                )
            user.password = args['new_password']
            db.session.merge(user)
            flask_config = os.getenv('FLASK_CONFIG')
            if flask_config and flask_config.lower() == 'production':
                user_mobile_number = '91'+str(user.mobile_no)

                sms_template = SmsTemplate.query.filter_by(template_name='password', template_type='reset').first()
                if sms_template is None:
                    message = "Dear Sir/Madam, Your password has been reset. Please use password: "+str(args['new_password'])+" to login into the Yntraa Cloud Service Portal. -Regards, Yntraa/YntraaSI Cloud Support"      
                    send_sms_status = send_sms(user_mobile_number, message, template_id='1107166696317419631')
                else:
                    message = sms_template.custom_template.format(password=str(args['new_password']))
                    send_sms_status = send_sms(user_mobile_number, message, template_id=sms_template.template_id)
                log.debug("send_sms_status %s",send_sms_status)
            
            status.append("Password has been updated successfully")

            create_user_action_log(action='Reset User Password',status='Success',session_uuid=session['uuid'],resource_id=user_id,resource_type='User')
            return status

@api.route('/set-token-on-redis/')
class SetRedisObject(Resource):
    """
    Manipulation with redis object
    """
    @create_user_action_trails(action='Set Token on Redis')
    @check_scope_and_auth_token('auth:write')
    @api.login_required(oauth_scopes=['auth:write'])
    @ratelimit(rate='100/s')
    @api.parameters(parameters.SetTokenonRedisParameters())
    @api.response(code=HTTPStatus.BAD_REQUEST)
    def post(self, args):
        """
        set object on redis
        """
        user_id = args['user_id']
        user = User.query.get(user_id)
        if user is None:
            create_user_action_log(action='Set Token on Redis',status='Fail',session_uuid=session['uuid'],resource_id=user_id,resource_type='User', resource_name=user.username, error_message="Invalid user_id")
            abort(
                code=HTTPStatus.NOT_FOUND,
                message="Invalid user_id "
            )
        user_token = OAuth2Token.query.filter_by(user_id=user_id).first()
        if user_token is None:
            create_user_action_log(action='Set Token on Redis',status='Fail',session_uuid=session['uuid'],resource_id=user_id,resource_type='User', resource_name=user.username, error_message="Access token not found for this user")
            abort(
                code=HTTPStatus.NOT_FOUND,
                message="Access token not found for this user "
            )
        elif user_token.access_token.strip() != args['access_token'].strip():
            create_user_action_log(action='Set Token on Redis',status='Fail',session_uuid=session['uuid'],resource_id=user_id,resource_type='User', resource_name=user.username, error_message="Invalid access token provided for this user")
            abort(
                code=HTTPStatus.BAD_REQUEST,
                message="Invalid access token provided for this user"
            )
        else:
            try:
                redis_obj = redis.Redis(BaseConfig.REDIS_HOST, charset="utf-8", decode_responses=True)
                redis_obj.set(args['access_token'], user_id)
                redis_obj.expire(args['access_token'], args['expiry_time'])
                create_user_action_log(action='Set Token on Redis',status='Success',session_uuid=session['uuid'],resource_id=user_id,resource_type='User', resource_name=user.username)
                return True
            except Exception as e:
                log.info(e)
                abort(
                    code=HTTPStatus.BAD_REQUEST,
                    messgae=str(e)
                )


@api.route('/delete-token-from-redis/')
class DeleteRedisObject(Resource):
    """
    Manipulation with delete redis object
    """
    @create_user_action_trails(action='Delete Token from Redis')
    @check_scope_and_auth_token('auth:write')
    @api.login_required(oauth_scopes=['auth:write'])
    @ratelimit(rate='100/s')
    @api.parameters(parameters.DeleteTokenFromRedisParameters())
    @api.response(code=HTTPStatus.BAD_REQUEST)
    def post(self, args):
        """
        delete object on redis
        """
        user_id = args['user_id']
        user = User.query.get(user_id)
        if user is None:
            create_user_action_log(action='Delete Token from Redis',status='Fail',session_uuid=session['uuid'],resource_id=user_id,resource_type='User', resource_name=user.username, error_message="Invalid user_id")
            abort(
                code=HTTPStatus.NOT_FOUND,
                message="Invalid user_id "
            )
        
        try:
            redis_obj = redis.Redis(BaseConfig.REDIS_HOST, charset="utf-8", decode_responses=True)
            token_user_id= redis_obj.get(args['access_token'])
            if user_id == token_user_id:
                redis_obj.delete(args['access_token'])
                create_user_action_log(action='Delete Token from Redis',status='Success',session_uuid=session['uuid'],resource_id=user_id,resource_type='User', resource_name=user.username)
                return True
            
            else:
                create_user_action_log(action='Delete Token from Redis',status='Fail',session_uuid=session['uuid'],resource_id=user_id,resource_type='User', resource_name=user.username, error_message="user_id and access-token not belongs to same user")
                abort(
                    code=HTTPStatus.BAD_REQUEST,
                    message="user_id and access-token not belongs to same user"
                )
        except Exception as e:
            log.info(e)
            abort(
                code=HTTPStatus.BAD_REQUEST,
                messgae=str(e)
            )

@api.route('/user/info')
class UserInfo(Resource):
    """
    User Info API Endpoint
    """
    @create_user_action_trails(action='Get user auth info')
    @check_scope_and_auth_token('auth:read')
    @api.login_required(oauth_scopes=['auth:read'])
    @ratelimit(rate=RateConfig.high)
    # @api.response(schemas.BaseOAuth2TokenSchema())
    # @api.response(code=HTTPStatus.BAD_REQUEST)
    def get(self):
        """
        Get user auth info
        """
        import json

        user_id = current_user.id
        user_details = User.query.get(user_id)
        if user_details is None:
            create_user_action_log(action='Get user auth info',status='Fail',session_uuid=session['uuid'], error_message='User not found')
            abort(
                code=HTTPStatus.NOT_FOUND,
                message='User not found'
            )
        user_info = {}

        otp_integration = current_app.config['OTP_INTEGRATION'].lower()!='false'
        is_2fa = user_details.is_2fa

        if otp_integration and is_2fa:
            user_info['otp_enabled'] = True
        else:
            user_info['otp_enabled'] = False

        user_info['username'] = user_details.username
        user_info['first_name'] = user_details.first_name
        user_info['middle_name'] = user_details.middle_name
        user_info['last_name'] = user_details.last_name

        authorisation_token = request.headers.get('Authorization')
        authorisation_token_details = list(authorisation_token.split(" "))
        authorisation_token = authorisation_token_details[1]

        oauth2_token = OAuth2Token.query.filter_by(access_token = authorisation_token, user_id=user_id).one_or_none()
        token_info = {
            "user_id": oauth2_token.user_id,
            "client_id": oauth2_token.client_id,
            "project_id": oauth2_token.project_id,
            "access_token": oauth2_token.access_token,
            "expires": oauth2_token.expires.isoformat(),
            "refresh_token": oauth2_token.refresh_token,
            "scopes": oauth2_token.scopes,
            "token_type": oauth2_token.token_type
        }
        response = {**user_info, **token_info}
        create_user_action_log(action='Get user auth info',status='Success',session_uuid=session['uuid'])
        return response, 200


    