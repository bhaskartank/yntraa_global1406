import qs from "qs";

import apiInstance from "utils/api";

export default {
  async listScalingGroups(providerId, projectId, payload) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/${projectId}/scaling_groups/`, { params: payload });
  },
  async resizeScalingGroup(providerId, projectId, scalingGroupId, payload) {
    return await apiInstance.patch(`/api/v1/provider/${providerId}/${projectId}/scaling_group/${scalingGroupId}`, payload);
  },
  async getDetails(providerId, projectId, scalingGroupId) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/${projectId}/scaling_groups/${scalingGroupId}`);
  },
  async createScalingGroup(providerId, projectId, payload) {
    return await apiInstance.post(`/api/v1/provider/${providerId}/${projectId}/scaling_group/`, qs.stringify(payload));
  },
  async listComputes(providerId, projectId, scalingGroupId) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/${projectId}/scaling_group/${scalingGroupId}/compute/`);
  },
  async deleteScalingGroup(providerId, projectId, scalingGroupId) {
    return await apiInstance.delete(`/api/v1/provider/${providerId}/${projectId}/scaling_group/${scalingGroupId}`);
  },
  async performAction(providerId, projectId, computeId, action) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/${projectId}/compute/${computeId}/${action}`);
  },
  async deleteScalingGroupCompute(providerId, projectId, scalingGroupId, computeId) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/${projectId}/scaling_group/${scalingGroupId}/${computeId}/delete-sg-compute/`);
  },
  async associateFloatingIP(providerId, projectId, scalingGroupId, payload) {
    return await apiInstance.post(`/api/v1/provider/${providerId}/${projectId}/scaling_group/${scalingGroupId}/associate_floating_ip/`, qs.stringify(payload));
  },
  async disassociateFloatingIP(providerId, projectId, scalingGroupId) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/${projectId}/scaling_group/${scalingGroupId}/disassociate_floating_ip/`);
  },
};
