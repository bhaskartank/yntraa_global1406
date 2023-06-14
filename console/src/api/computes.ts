import qs from "qs";

import apiInstance from "utils/api";

export default {
  async virtualMachines(providerId, projectId, payload) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/${projectId}/compute/`, { params: payload });
  },
  async searchVirtualMachines(providerId, projectId, payload) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/${projectId}/compute/find/${payload.search}`, {
      params: payload,
    });
  },
  async resizeComputes(providerId, projectId, computeId, flavorId) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/${projectId}/compute/${computeId}/resize/${flavorId}`);
  },
  async performAction(providerId, projectId, computeId, action) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/${projectId}/compute/${computeId}/${action}`);
  },
  async attachSecurityGroup(providerId, projectId, computeId, securityGroupId) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/${projectId}/securitygroup/${securityGroupId}/attach_security_groups/${computeId}`);
  },
  async detachSecurityGroup(providerId, projectId, computeId, securityGroupId) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/${projectId}/securitygroup/${securityGroupId}/detach_security_groups/${computeId}`);
  },
  async createVirtualMachine(payload) {
    return await apiInstance.post(`/api/v1/provider/${payload.provider_id}/${payload.project_id}/compute/`, qs.stringify(payload, { skipNulls: true, arrayFormat: "repeat" }));
  },
  async virtualMachineById(providerId, projectId, computeId) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/${projectId}/compute/${computeId}/`);
  },
  async deleteVirtualMachine(providerId, projectId, computeId) {
    return await apiInstance.delete(`/api/v1/provider/${providerId}/${projectId}/compute/${computeId}/`);
  },
  async computesByProviderId(providerId) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/compute/`);
  },
  async flavors(providerId) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/compute/flavors/`);
  },
  async images(providerId) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/compute/images`);
  },
  async createSnapshot(payload) {
    return await apiInstance.post(`/api/v1/provider/${payload.provider_id}/compute/${payload.compute_id}/snapshot/`, payload);
  },
  async consoleLogs(providerId, projectId, computeId) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/${projectId}/compute/${computeId}/console_full_log/`);
  },
  async consoleURL(providerId, projectId, computeId) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/${projectId}/compute/${computeId}/console_url`);
  },
  async computeIPs(providerId, projectId, computeId) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/${projectId}/compute/${computeId}/egress-ip/`);
  },
  async currentStatus(projectId, computeId, action) {
    return await apiInstance.get(`/api/v1/provider/${projectId}/compute/${computeId}/get_current_status`, action ? { params: { terminate_task: action } } : null);
  },
};
