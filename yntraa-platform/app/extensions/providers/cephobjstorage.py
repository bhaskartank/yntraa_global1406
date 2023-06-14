# encoding: utf-8
# pylint: disable=no-self-use
"""
external provider setup.
"""

import traceback
import logging
from rgwadmin import RGWAdmin
import boto3
from config import BaseConfig


log = logging.getLogger(__name__)

CEPH_OBJECT_GATEWAY_USER_URL=BaseConfig.CEPH_OBJECT_GATEWAY_USER_URL
CEPH_BUCKET_URL=BaseConfig.CEPH_BUCKET_URL
CEPH_OBJECT_GATEWAY_ACCESS_KEY = BaseConfig.CEPH_OBJECT_GATEWAY_ACCESS_KEY
CEPH_OBJECT_GATEWAY_SECRET_KEY = BaseConfig.CEPH_OBJECT_GATEWAY_SECRET_KEY

class CephObjStorageProvider(object):
    def __init__(self, app=None):
        if app:
            self.init_app(app)

    def init_app(self, app):
        return self


    def rgw(self):
        """This method is used to get rgw object for create user in storage
        :return: rgw object"""
        try:
            return RGWAdmin(access_key=CEPH_OBJECT_GATEWAY_ACCESS_KEY,
                            secret_key=CEPH_OBJECT_GATEWAY_SECRET_KEY,
                            server=CEPH_OBJECT_GATEWAY_USER_URL,
                            verify=False,
                            secure=False,)
        except Exception:
            log.error(traceback.format_exc())

    def create_user(self,storageuser_name,storageuser_email):
        """This method is used to create user in storage
        :return: user object"""

        try:
            cloud_response = self.rgw().create_user(uid=storageuser_email,
                        display_name=storageuser_name,
                        email=storageuser_email,
                        user_caps='buckets=*',
                        max_buckets=1000)


            access_key = cloud_response.get('keys')[0]['access_key']
            secret_key = cloud_response.get('keys')[0]['secret_key']

            return {'access_key': access_key, 'secret_key': secret_key}
        except Exception:
            log.error(traceback.format_exc())


    def create_bucket(self,access_key,secret_key,bucket_name):
        """This method is used to create bucket in storage
        :return: bucket object"""
        log.info("creating bucket in storage")

        session = boto3.Session(
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key
        )

        # Specify the endpoint URL
        endpoint_url = CEPH_BUCKET_URL

        # Create a S3 client
        s3_client = session.client('s3', endpoint_url=endpoint_url)

        bucket_response = s3_client.create_bucket(Bucket=bucket_name)

        return bucket_response


    def upload_object(self,access_key,secret_key,bucket_name,object_key,file_path):
        """This method is used to upload object in storage"""
        try:
            s3 = boto3.client('s3',
                              endpoint_url=CEPH_BUCKET_URL,
                              aws_access_key_id=access_key,
                              aws_secret_access_key=secret_key)

            s3.upload_file(file_path, bucket_name, object_key)
        except Exception:
            log.error(traceback.format_exc())


    def download_object(self, access_key, secret_key, bucket_name, object_key, destination_path):
        try:
            s3 = boto3.client('s3',
                              endpoint_url=CEPH_BUCKET_URL,
                              aws_access_key_id=access_key,
                              aws_secret_access_key=secret_key)

            s3.download_file(bucket_name, object_key, destination_path)
        except Exception:
            log.error(traceback.format_exc())

    def list_bucket_objects(self,access_key, secret_key, bucket_name):
        """
        List all objects in a bucket using boto3 and Ceph.

        :param access_key: Access key for the Ceph bucket
        :param secret_key: Secret key for the Ceph bucket
        :param bucket_name: Name of the Ceph bucket
        :return: List of objects in the bucket
        """
        session = boto3.Session(
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key
        )

        # Specify the endpoint URL
        endpoint_url = CEPH_BUCKET_URL

        # Create an S3 client
        s3_client = session.client('s3', endpoint_url=endpoint_url)

        # List objects in the bucket
        response = s3_client.list_objects_v2(Bucket=bucket_name)

        if 'Contents' in response:
            objects = response['Contents']
            return objects
        else:
            return []







