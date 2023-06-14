# encoding: utf-8
# pylint: disable=invalid-name,wrong-import-position,wrong-import-order
"""
Extensions setup
================

Extensions provide access to common resources of the application.

Please, put new extension instantiations and initializations here.
"""
from contextlib import contextmanager

from .logging import Logging

logging = Logging()

from flask_cors import CORS

cross_origin_resource_sharing = CORS()

from .flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .sio import SIO

sio = SIO()

from .providers import OpenStackProvider, DockerProvider, NetworkerApi, ExternalProvider, VAApi, \
    VaultProvider, CephObjStorageProvider

Openstack = OpenStackProvider()
Docker = DockerProvider()
Networker = NetworkerApi()
External = ExternalProvider()
Vault = VaultProvider()

CephObjStorage = CephObjStorageProvider()

from .audit_trail import AuditTrail

audit_trail = AuditTrail()
VA = VAApi()
from sqlalchemy_utils import force_auto_coercion, force_instant_defaults

force_auto_coercion()
force_instant_defaults()

from flask_login import LoginManager

login_manager = LoginManager()

from flask_marshmallow import Marshmallow

marshmallow = Marshmallow()

from .auth import OAuth2Provider, OidcProvider

oauth2 = OAuth2Provider()
oidc = OidcProvider()

from . import api


def init_app(app):
    """
    Application extensions initialization.
    """
    for extension in (
            logging,
            cross_origin_resource_sharing,
            db,
            login_manager,
            marshmallow,
            api,
            Openstack,
            Docker,
            Networker,
            External,
            Vault,
            oauth2,
            VA,
            oidc,
            sio,
            audit_trail,
            CephObjStorage
    ):
        extension.init_app(app)


class SendMAIL:

    def __init__(self):
        pass

    @contextmanager
    def _secured_smtp_connection(self, host, port):
        import smtplib, ssl, os

        context = ssl.create_default_context()
        AUTH_EMAIL_ADDRESS = os.getenv('AUTH_EMAIL_ADDRESS')
        AUTH_EMAIL_PASSWORD = os.getenv('AUTH_EMAIL_PASSWORD')

        try:
            server = smtplib.SMTP(host, port)
            server.starttls(context=context)
            server.login(user=AUTH_EMAIL_ADDRESS, password=AUTH_EMAIL_PASSWORD)
            yield server
        finally:
            server.quit()

    @staticmethod
    def send_mail(from_mail, to_mail, subject, message=None, html=True, cc_emails=None):

        import smtplib
        from email.mime.multipart import MIMEMultipart
        from email.header import Header
        from email.mime.text import MIMEText
        from email.message import EmailMessage
        import os
        import logging
        log = logging.getLogger(__name__)
        try:
            SMTP_SERVICE_URL = os.getenv('SMTP_SERVICE_URL', 'relay.yntraa.com')
            SMTP_SERVICE_PORT = os.getenv('SMTP_SERVICE_PORT', '25')
            FROM_NAME = os.getenv('FROM_NAME', 'Yntraa Cloud Platform')

            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject  # "Openstack Test"
            msg['From'] = FROM_NAME + " <" + from_mail + ">"
            msg['To'] = to_mail
            if cc_emails:
                msg['Cc'] = ', '.join(cc_emails[0].encode('utf-8'))
            if html:
                email_content = MIMEText(message, 'html')
            else:
                email_content = MIMEText(message, 'plain')

            msg.attach(email_content)

            s = smtplib.SMTP(SMTP_SERVICE_URL + ':' + SMTP_SERVICE_PORT)
            s.ehlo()
            # s.starttls()
            recipients = to_mail.split(',')
            if len(recipients) > 1:
                # toaddr = to_mail[0].encode('utf-8') + cc_emails[0].encode('utf-8')
                resp = s.sendmail(from_mail, recipients, msg.as_string())
            else:
                resp = s.sendmail(from_mail, to_mail, msg.as_string())
            return resp
        except Exception as e:
            log.info(e)
            return False

    @staticmethod
    def send_mail_secured(from_mail, to_mail, subject, message=None, html=True, cc_emails=None):

        from email.mime.multipart import MIMEMultipart
        from email.mime.text import MIMEText
        import logging, os
        log = logging.getLogger(__name__)

        try:
            SMTP_SERVICE_URL = os.getenv('SMTP_SERVICE_URL', 'relay.yntraa.com')
            SMTP_SERVICE_PORT = int(os.getenv('SMTP_SERVICE_PORT', 25))
            FROM_NAME = os.getenv('FROM_NAME', 'Yntraa Cloud Platform')

            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = FROM_NAME + " <" + from_mail + ">"
            msg['To'] = to_mail
            if cc_emails:
                msg['Cc'] = ', '.join(cc_emails[0].encode('utf-8'))
            if html:
                email_content = MIMEText(message, 'html')
            else:
                email_content = MIMEText(message, 'plain')

            msg.attach(email_content)

            with SendMAIL()._secured_smtp_connection(SMTP_SERVICE_URL, SMTP_SERVICE_PORT) as s:
                recipients = to_mail.split(',')
                if len(recipients) > 1:
                    resp = s.sendmail(from_mail, recipients, msg.as_string())
                else:
                    resp = s.sendmail(from_mail, to_mail, msg.as_string())
                return resp

        except Exception as e:
            log.info(e)
            return False

    @staticmethod
    def send_mail_wrapper(from_mail, to_mail, subject, message=None, html=True, cc_emails=None):
        import os
        import logging, os
        log = logging.getLogger(__name__)

        ENABLE_EMAIL_TLS = os.getenv('ENABLE_EMAIL_TLS', 'true').lower() == 'true'

        if ENABLE_EMAIL_TLS:
            log.info('without TLS')
            return SendMAIL.send_mail_secured(from_mail, to_mail, subject, message, html, cc_emails)
        else:
            log.info('with TLS')
            return SendMAIL.send_mail(from_mail, to_mail, subject, message, html, cc_emails)


# Function for generating authorization token for given username and password
def generateHashAuthToken(username, password):
    import base64
    import os
    import hashlib
    import logging
    log = logging.getLogger(__name__)
    message_bytes = username.encode('ascii')
    base64_bytes = base64.b64encode(message_bytes)
    base64_message = base64_bytes.decode('ascii')
    result = hashlib.md5(password.encode())
    x = ":"
    authToken = base64_message + x + result.hexdigest()
    return authToken


# Function for base64 encoding the username
def generateBase64encoding(username):
    import base64
    import os
    message_bytes = username.encode('ascii')
    base64_bytes = base64.b64encode(message_bytes)
    base64_message = base64_bytes.decode('ascii')
    encodedUser = base64_message
    return encodedUser


# Function for generating MD5 hashed password
def generateMD5HashedPassword(password):
    import os
    import hashlib
    result = hashlib.md5(password.encode())
    retMD5Password = result.hexdigest()
    return retMD5Password