import qs from "qs";

import apiInstance from "utils/api";

export default {
  async volumes(providerId, projectId, payload) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/${projectId}/volume/`, { params: payload });
  },
  async volumeById(providerId, projectId, volumeId) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/${projectId}/volume/${volumeId}/`);
  },
  async resourceAnnotations(providerId, projectId) {
    return await apiInstance.get(`/api/v1/resource-annotations/${providerId}/${projectId}/?resource_type=volume`);
  },
  async createVolume(providerId, projectId, payload) {
    return await apiInstance.post(`/api/v1/provider/${providerId}/${projectId}/volume/`, qs.stringify(payload));
  },
  async deleteVolume(providerId, projectId, volumeId, payload) {
    return await apiInstance.delete(`/api/v1/provider/${providerId}/${projectId}/volume/${volumeId}/`, {
      data: qs.stringify(payload),
    });
  },
  async attachVolume(providerId, projectId, volumeId, payload) {
    return await apiInstance.post(`/api/v1/provider/${providerId}/${projectId}/volume/volume_attach/${volumeId}/`, qs.stringify(payload));
  },
  async detachVolume(providerId, projectId, volumeId, payload) {
    return await apiInstance.post(`/api/v1/provider/${providerId}/${projectId}/volume/volume_detach/${volumeId}/`, qs.stringify(payload));
  },

  async createSnapshot(providerId, projectId, volumeId, payload) {
    return await apiInstance.post(`/api/v1/provider/${providerId}/${projectId}/volume/${volumeId}/snapshot/`, qs.stringify(payload));
  },
  async snapshots(providerId, projectId, volumeId, payload) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/${projectId}/volume/${volumeId}/snapshot/`, {
      params: qs.stringify(payload),
    });
  },
};
