import qs from "qs";

import apiInstance from "utils/api";

export default {
  async networks(providerId, projectId, payload) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/${projectId}/network/`, { params: payload });
  },
  async createNetwork(providerId, projectId, payload) {
    return await apiInstance.post(`/api/v1/provider/${providerId}/${projectId}/network_with_subnet/`, qs.stringify(payload));
  },
  async networkById(providerId, projectId, networkId) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/${projectId}/network/${networkId}/`);
  },
  async subNetworks(providerId, networkId) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/network/${networkId}/subnet/`);
  },
  async createSubNetwork(providerId, projectId, networkId, payload) {
    return await apiInstance.post(`/api/v1/provider/${providerId}/${projectId}/network/${networkId}/subnet/`, qs.stringify(payload));
  },
  async subNetworkById(providerId, networkId, subnetId) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/network/${networkId}/subnet/${subnetId}/`);
  },
  async deleteSubNetwork(providerId, projectId, networkId, subnetId) {
    return await apiInstance.delete(`/api/v1/provider/${providerId}/${projectId}/network/${networkId}/subnet/${subnetId}/`);
  },
  async deleteNetwork(providerId, projectId, networkId) {
    return await apiInstance.delete(`/api/v1/provider/${providerId}/${projectId}/network/${networkId}/`);
  },
  async attachNetwork(providerId, projectId, computeId, payload) {
    return await apiInstance.post(`/api/v1/provider/${providerId}/${projectId}/compute/${computeId}/attach-network/`, qs.stringify(payload));
  },
  async detachNetwork(providerId, projectId, computeId, networkId, payload) {
    return await apiInstance.post(`/api/v1/provider/${providerId}/${projectId}/compute/${computeId}/detach-network/${networkId}`, qs.stringify(payload));
  },
};
