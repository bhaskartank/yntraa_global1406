import qs from "qs";

import apiInstance from "utils/api";

export default {
  async listRoutableIP(organisationId, providerId, projectId) {
    return await apiInstance.get(`/api/v1/organisation/${organisationId}/${providerId}/${projectId}/routable_ip/`);
  },
  async listAllocatedIPsByProject(projectId) {
    return await apiInstance.get(`/api/v1/organisation/publicip/${projectId}/allocated_public_ip/`);
  },
  async listAllocatedIPsByProvider(providerId) {
    return await apiInstance.get(`/api/v1/organisation/publicip/${providerId}/allocated_public_ip/`);
  },
  async listAllocatedIPsByProviderAndProject(providerId, projectId, payload) {
    return await apiInstance.get(`/api/v1/organisation/publicip/allocated_public_ip/?providerId=` + providerId + "&projectId=" + projectId, { params: payload });
  },
  async listRequestedIPs(providerId, projectId, payload) {
    return await apiInstance.get(`/api/v1/organisation/publicip/${providerId}/${projectId}/request_public_ip/`, {
      params: payload,
    });
  },
  async listImportedIPsByProvider(providerId) {
    return await apiInstance.get(`/api/v1/organisation/publicip/${providerId}/public_ip/`);
  },
  async detailsById(providerId, publicIpId) {
    return await apiInstance.get(`/api/v1/organisation/publicip/${providerId}/${publicIpId}`);
  },
  async requestPublicIP(providerId, projectId, payload) {
    return await apiInstance.post(`/api/v1/organisation/publicip/${providerId}/${projectId}/request_public_ip/`, qs.stringify(payload));
  },
  async changeRequest(providerId, projectId, payload, publicIpId) {
    return await apiInstance.post(`/api/v1/organisation/${providerId}/${projectId}/public_ip/${publicIpId}/change_request/`, qs.stringify(payload));
  },
  async getChangeRequests(providerId, projectId, publicIpId, payload) {
    return await apiInstance.get(`/api/v1/organisation/${providerId}/${projectId}/public_ip/${publicIpId}/change_request/`, { params: payload });
  },
  async cancelChangeRequest(providerId, projectId, publicIpId, changeRequestId, payload) {
    return await apiInstance.post(`/api/v1/organisation/${providerId}/${projectId}/public_ip/${publicIpId}/change_request/${changeRequestId}/cancel/`, qs.stringify(payload));
  },
  async withdrawPublicIP(providerId, projectId, payload) {
    return await apiInstance.post(`/api/v1/organisation/publicip/${providerId}/${projectId}/public_ip_withdrawal_request/${payload?.requestId}/`, qs.stringify(payload));
  },
  async getWithdrawnPublicIPs(providerId, projectId, payload) {
    return await apiInstance.get(`/api/v1/organisation/publicip/${providerId}/${projectId}/public_ip_withdrawal_request/`, { params: payload });
  },
  async getWithdrawalConsents(payload) {
    return await apiInstance.get(`/api/v1/utils/get_consent_data/`, { params: payload });
  },
};
