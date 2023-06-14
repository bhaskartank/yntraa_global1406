import qs from "qs";

import apiInstance from "utilities/api";

export default {
  async loadBalancers(queryParams = {}) {
    return await apiInstance.get(`/load-balancers/loadbalancer-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async sslRequests(queryParams = {}) {
    return await apiInstance.get(`/load-balancers/ssl-requests-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async sslCertificates(queryParams = {}) {
    return await apiInstance.get(`/certificates/certificate-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async fetchLbSslCertificatesById(certificateId) {
    return await apiInstance.get(`/certificates/admin/${certificateId}`);
  },
  async computeLoadBalancerOwnerDetails({ providerId, loadBalancerId }) {
    return await apiInstance.get(`/load-balancers/${providerId}/loadbalancers/${loadBalancerId}/owner-details/`);
  },
  async sslRequestViewCertificateDetail({ providerId, sslConfigureRequestId }) {
    return await apiInstance.get(`/load-balancers/provider/${providerId}/ssl-configure-request/${sslConfigureRequestId}/view-certificates/`);
  },
  async computeSSLRequestOwnerDetail({ providerId, sslRequestId }) {
    return await apiInstance.get(`/load-balancers/${providerId}/ssl-configure-requests/${sslRequestId}/owner-details/`);
  },
  async rejectLoadBalancerSSLRequest(providerId, projectId, requestId, payload) {
    return await apiInstance.post(`/load-balancers/provider/${providerId}/project/${projectId}/ssl-configuration-request/${requestId}/action/`, qs.stringify(payload));
  },
  async approveLoadBalancerSSLRequest(providerId, projectId, requestId, payload) {
    return await apiInstance.post(`/load-balancers/provider/${providerId}/project/${projectId}/ssl-configuration-request/${requestId}/action/`, qs.stringify(payload));
  },
  async markLbAsErrorRequest(loadBalancerId, providerId) {
    return await apiInstance.post(`/load-balancers/provider/${providerId}/load-balancer/${loadBalancerId}/mark-as-error/`);
  },
  async fetchAppliedLBConfig(providerId, projectId, lbId) {
    return await apiInstance.get(`/load-balancers/provider/${providerId}/project/${projectId}/load-balancers/${lbId}/params/`);
  },
  async fetchLBLogs(providerId, projectId, lbId) {
    return await apiInstance.get(`/load-balancers/provider/${providerId}/project/${projectId}/load-balancers/${lbId}/logs/`);
  },
  async fetchLBConfigTemplate(providerId, projectId, lbId) {
    return await apiInstance.get(`/load-balancers/provider/${providerId}/project/${projectId}/load-balancers/${lbId}/config/`);
  },
};
