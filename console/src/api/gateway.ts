import qs from "qs";

import apiInstance from "utils/api";

export default {
  async getDetails(providerId, projectId) {
    return await apiInstance.get(`/api/v1/organisation/${providerId}/${projectId}/gateway/`);
  },
  async services(providerId, projectId, payload) {
    return await apiInstance.get(`/api/v1/organisation/${providerId}/${projectId}/gateway_services/`, {
      params: payload,
    });
  },
  async createService(providerId, projectId, payload) {
    return await apiInstance.post(`/api/v1/organisation/${providerId}/${projectId}/gateway_services/`, qs.stringify(payload));
  },
  async performAction(providerId, projectId, gatewayServiceId, action) {
    return await apiInstance.post(`/api/v1/organisation/${providerId}/${projectId}/${gatewayServiceId}/${action}/`);
  },
};
