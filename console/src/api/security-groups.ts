import qs from "qs";

import apiInstance from "utils/api";

export default {
  async securityGroups(providerId, projectId, payload) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/${projectId}/securitygroup/`, { params: payload });
  },
  async createSecurityGroup(providerId, projectId, payload) {
    return await apiInstance.post(`/api/v1/provider/${providerId}/${projectId}/securitygroup/`, qs.stringify(payload));
  },
  async deleteSecurityGroup(providerId, projectId, securityGroupId) {
    return await apiInstance.delete(`/api/v1/provider/${providerId}/${projectId}/securitygroup/${securityGroupId}/`);
  },
  async securityGroupById(providerId, projectId, securityGroupId) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/${projectId}/securitygroup/${securityGroupId}/`);
  },
  async attachedResources(providerId, projectId, securityGroupId) {
    return await apiInstance.get(`/api/v1/provider/${projectId}/${providerId}/security_group/${securityGroupId}/attached_resources/`);
  },
  async securityGroupRules(providerId, projectId, securityGroupId, payload) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/${projectId}/securitygroup/${securityGroupId}/securitygrouprule/`, { params: payload });
  },
  async deleteSecurityGroupRule(providerId, projectId, securityGroupId, securityGroupRuleId) {
    return await apiInstance.delete(`/api/v1/provider/${providerId}/${projectId}/securitygroup/${securityGroupId}/securitygrouprule/${securityGroupRuleId}/`);
  },
  async createSecurityGroupRule(providerId, projectId, securityGroupId, payload) {
    return await apiInstance.post(`/api/v1/provider/${providerId}/${projectId}/securitygroup/${securityGroupId}/securitygrouprule/`, qs.stringify(payload));
  },
};
