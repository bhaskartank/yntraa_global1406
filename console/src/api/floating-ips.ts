import qs from "qs";

import apiInstance from "utils/api";

export default {
  async floatingIPs(providerId, projectId, payload) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/${projectId}/floating_ip/`, { params: payload });
  },
  async createFloatingIP(providerId, projectId, networkId, payload) {
    return await apiInstance.post(`/api/v1/provider/${providerId}/${projectId}/network/${networkId}/create_floating_ip/`, qs.stringify(payload));
  },
  async releaseFloatingIP(providerId, projectId, reserveFloatingIpId) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/${projectId}/${reserveFloatingIpId}/release_floating_ip/`);
  },
};
