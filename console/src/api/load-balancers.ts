import qs from "qs";

import apiInstance from "utils/api";

export default {
  async loadBalancers(providerId, projectId, payload) {
    return await apiInstance.get(`/api/v1/load-balancers/${providerId}/${projectId}/`, { params: payload });
  },
  async loadBalancerById(providerId, projectId, loadBalancerId) {
    return await apiInstance.get(`/api/v1/load-balancers/${providerId}/${projectId}/${loadBalancerId}`);
  },
  async createLoadBalancer(providerId, projectId, payload) {
    return await apiInstance.post(`/api/v1/load-balancers/${providerId}/${projectId}/create-lb-with-meta/`, qs.stringify(payload));
  },
  async updateLoadBalancer(providerId, projectId, payload, loadBalancerId, serverFarmId) {
    return await apiInstance.post(`/api/v1/load-balancers/${providerId}/${projectId}/update-lb-with-meta/${loadBalancerId}/server-farm/${serverFarmId}`, qs.stringify(payload));
  },
  async configureSSLRequest(providerId, projectId, payload) {
    return await apiInstance.post(`/api/v1/load-balancers/${providerId}/${projectId}/ssl-configuration-request/`, qs.stringify(payload));
  },
  async performActionSSLRequest(providerId, projectId, sslConfigureRequestId, payload) {
    return await apiInstance.post(`/api/v1/load-balancers/${providerId}/${projectId}/ssl-configuration-request/${sslConfigureRequestId}`, qs.stringify(payload));
  },
  async deleteLoadBalancer(providerId, projectId, id) {
    return await apiInstance.delete(`/api/v1/load-balancers/${providerId}/${projectId}/${id}`);
  },
  async associateFloatingIP(providerId, projectId, loadBalancerId, payload) {
    return await apiInstance.post(`/api/v1/load-balancers/${providerId}/${projectId}/loadbalancer/${loadBalancerId}/associate_floating_ip/`, qs.stringify(payload));
  },
  async disassociateFloatingIP(providerId, projectId, loadBalancerId) {
    return await apiInstance.get(`/api/v1/load-balancers/${providerId}/${projectId}/loadbalancer/${loadBalancerId}/disassociate_floating_ip/`);
  },
  async createCertificate(providerId, projectId, payload) {
    return await apiInstance.post(`/api/v1/certificates/${providerId}/${projectId}`, qs.stringify(payload));
  },
  async certificates(providerId, projectId, payload) {
    return await apiInstance.get(`/api/v1/certificates/${providerId}/${projectId}`, { params: payload });
  },
  async validateSSlCert(payload) {
    return await apiInstance.post(`/api/v1/certificates/validate`, qs.stringify(payload));
  },
  async certificateById(payload) {
    return await apiInstance.get(`api/v1/certificates/${payload?.providerId}/${payload?.projectId}/${payload?.certificateId}`);
  },
  async deleteCertificate(payload) {
    return await apiInstance.delete(`api/v1/certificates/${payload?.providerId}/${payload?.projectId}/${payload?.certificateId}`);
  },
  async loadBalancerLogs(payload) {
    return await apiInstance.get(`api/v1/load-balancers/${payload?.providerId}/${payload?.projectId}/loadbalancer/${payload?.loadBalancerId}/logs/`);
  },
  async testBackendEndpoint(payload) {
    return await apiInstance.get(`api/v1/load-balancers/${payload?.providerId}/${payload?.projectId}/loadbalancer/${payload?.loadBalancerId}/curl/`);
  },
  async testBackendReachability(payload) {
    return await apiInstance.get(`api/v1/load-balancers/${payload?.providerId}/${payload?.projectId}/loadbalancer/${payload?.loadBalancerId}/telnet/`);
  },
};
