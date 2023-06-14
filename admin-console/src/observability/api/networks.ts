import qs from "qs";

import apiInstance from "utilities/api";

export default {
  async networks(queryParams = {}) {
    return await apiInstance.get(`/network/networks-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async routers(queryParams = {}) {
    return await apiInstance.get(`/network/routers-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async securityGroups(queryParams = {}) {
    return await apiInstance.get(`/network/security-groups-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async securityGroupRules(queryParams = {}) {
    return await apiInstance.get(`/network/security-groups-rules-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async floatingIPs(queryParams = {}) {
    return await apiInstance.get(`/network/floating-ips-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async publicIPs(queryParams = {}) {
    return await apiInstance.get(`/public-ip/public-ips-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async requestedPublicIPs(queryParams = {}) {
    return await apiInstance.get(`/public-ip/publicip-requests-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async withdrawPublicIPs(queryParams = {}) {
    return await apiInstance.get(`/public-ip/publicip-withdrawal-requests-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async publicIPUpdateRequest(queryParams = {}) {
    return await apiInstance.get(`/public-ip/publicip-change-requests-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async computeFloatingIpOwnerDetails({ providerId, floatingIpId }) {
    return await apiInstance.get(`/network/${providerId}/floating-ips/${floatingIpId}/owner-details/`);
  },
  async computeNetworkOwnerDetails({ providerId, networkId }) {
    return await apiInstance.get(`/network/${providerId}/networks/${networkId}/owner-details/`);
  },
  async computeRouterOwnerDetails({ providerId, routerId }) {
    return await apiInstance.get(`/network/${providerId}/routers/${routerId}/owner-details/`);
  },
  async computeSecurityGroupOwnerDetails({ providerId, securityGroupId }) {
    return await apiInstance.get(`/network/${providerId}/security-groups/${securityGroupId}/owner-details/`);
  },
  async computePublicIpWithdrawalOwnerDetails({ providerId, publicIpWithdrawalId }) {
    return await apiInstance.get(`/public-ip/${providerId}/public-ip-withdrawal-requests/${publicIpWithdrawalId}/owner-details/`);
  },
  async computePublicIpRequestOwnerDetails({ providerId, publicIpRequestsId }) {
    return await apiInstance.get(`/public-ip/${providerId}/public-ip-requests/${publicIpRequestsId}/owner-details/`);
  },
  async computePublicIpUpdateOwnerDetails({ providerId, publicIpUpdateId }) {
    return await apiInstance.get(`/public-ip/${providerId}/public-ip-change-requests/${publicIpUpdateId}/owner-details/`);
  },
  async syncSGRules(providerId, projectId, securityGroupId, payload) {
    return await apiInstance.post(`/network/provider/${providerId}/project/${projectId}/security_group/${securityGroupId}/rules/sync/`, qs.stringify(payload, { skipNulls: true }));
  },
  async listRouterNetworkDetails({ routerId, providerId, projectId }, queryParams = {}) {
    return await apiInstance.get(`/network/provider/${providerId}/project/${projectId}/router/${routerId}/network-details?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async reserveFloatingIP(networkId, providerId, projectId, payload) {
    return await apiInstance.post(
      `/network/provider/${providerId}/project/${projectId}/network/${networkId}/reserve-floating-ip/`,
      qs.stringify(payload, { skipNulls: true, arrayFormat: "repeat" }),
    );
  },
  async releaseFloatingIP({ providerId, projectId, floatingIpId }) {
    return await apiInstance.get(`/network/provider/${providerId}/project/${projectId}/floating-ip/${floatingIpId}/release/`);
  },
  async deletePublicIP({ providerId, publicIpId }) {
    return await apiInstance.delete(`/public-ip/provider/${providerId}/public-ip/${publicIpId}`);
  },
  async updatePublicIP(providerId, publicIpId, payload) {
    return await apiInstance.put(`/public-ip/provider/${providerId}/public-ip/${publicIpId}`, qs.stringify(payload));
  },
  async importPublicIPPool(providerId, payload) {
    return await apiInstance.post(`/public-ip/provider/${providerId}/public-ip-pool/`, qs.stringify(payload));
  },
  async deletePublicIPPool(providerId, payload) {
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };
    return await apiInstance.delete(`/public-ip/provider/${providerId}/public-ip-pool/`, { data: qs.stringify(payload), headers });
  },
  async createSecurityGroupRule(providerId, projectId, securityGroupId, payload) {
    return await apiInstance.post(
      `/network/provider/${providerId}/project/${projectId}/security-group/${securityGroupId}/rules/`,
      qs.stringify(payload, { skipNulls: true, arrayFormat: "repeat" }),
    );
  },
  async deleteSGRules(providerId, projectId, securityGroupId, payload) {
    return await apiInstance.post(
      `/network/provider/${providerId}/project/${projectId}/security-group/${securityGroupId}/rules/delete/`,
      qs.stringify(payload, { skipNulls: true, arrayFormat: "repeat" }),
    );
  },
  async rejectRequestedPublicIps(providerId, projectId, requestId, payload) {
    return await apiInstance.post(`/public-ip/provider/${providerId}/project/${projectId}/${requestId}/reject-public-ip-request/`, qs.stringify(payload));
  },
  async approveRequestedPublicIps(providerId, projectId, requestId) {
    return await apiInstance.post(`/public-ip/provider/${providerId}/project/${projectId}/${requestId}/approve-public-ip-request/`);
  },
  async rejectPublicIpWithdraw(providerId, projectId, requestId, payload) {
    return await apiInstance.post(`/public-ip/provider/${providerId}/project/${projectId}/${requestId}/reject-public-ip-withdraw-request/`, qs.stringify(payload));
  },
  async approvePublicIpWithdraw(providerId, projectId, requestId) {
    return await apiInstance.get(`/public-ip/provider/${providerId}/project/${projectId}/${requestId}/approve-public-ip-withdraw-request/`);
  },
  async rejectPublicIpUpdateRequest(providerId, requestId, action, payload) {
    return await apiInstance.post(`/public-ip/provider/${providerId}/public-ip-change-request/${requestId}/${action}/`, qs.stringify(payload));
  },
  async approvePublicIpUpdateRequest(providerId, requestId, action) {
    return await apiInstance.post(`/public-ip/provider/${providerId}/public-ip-change-request/${requestId}/${action}/`);
  },
};
