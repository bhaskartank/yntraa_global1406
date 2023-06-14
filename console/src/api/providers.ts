import qs from "qs";

import apiInstance from "utils/api";

export default {
  async providers() {
    return await apiInstance.get(`/api/v1/providers/`);
  },
  async availableProviders(payload) {
    return await apiInstance.get(`/api/v1/organisation/available_providers`, { params: payload });
  },
  async requestVPNPermission(organisationId, providerId, projectId, payload) {
    return await apiInstance.get(`/api/v1/provider/${organisationId}/${providerId}/${projectId}/get_vpn_permission/`, {
      params: payload,
    });
  },
  async createProvider(payload) {
    return await apiInstance.post(`/api/v1/providers/`, payload);
  },
  async providerTypes() {
    return await apiInstance.get(`/api/v1/providers/type`);
  },
  async providerTypeById(id) {
    return await apiInstance.get(`/api/v1/providers/type/${id}`);
  },
  async providerById(providerId) {
    return await apiInstance.get(`/api/v1/providers/${providerId}`);
  },
  async sendVpnRequest(providerId, projectId, payload) {
    return await apiInstance.post(`/api/v1/provider/${providerId}/${projectId}/send-vpn-permission-request/`, qs.stringify(payload));
  },
  async enabledServices(providerId) {
    return await apiInstance.get(`/api/v1/providers/${providerId}/enabled-services/`);
  },
};
