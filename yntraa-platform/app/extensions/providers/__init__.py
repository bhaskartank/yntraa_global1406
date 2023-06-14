# encoding: utf-8
"""
Providers extension
==============
"""

from .openstack import OpenStackProvider
from .docker import DockerProvider
from .networker import NetworkerApi
from .external import ExternalProvider
from .f5 import F5Provider
from .hcpobjstorage import HCPObjStorageProvider
from .cephobjstorage import CephObjStorageProvider
from .vulnerabilityassessment import VAApi
from .vault import VaultProvider