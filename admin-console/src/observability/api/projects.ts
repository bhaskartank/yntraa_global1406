import qs from "qs";

import apiInstance from "utilities/api";

export default {
  async projects(queryParams = {}) {
    return await apiInstance.get(`/project/projects-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async computeProjectOwnerDetails({ projectId }) {
    return await apiInstance.get(`/project/${projectId}/owner-details/`);
  },
  async projectProviderMapping(projectId) {
    return await apiInstance.get(`/project/${projectId}/provider-mapping-info/`);
  },
  async projectUsers(organisationId, projectId, queryParams = {}) {
    return await apiInstance.get(`/project/${projectId}/organisation/${organisationId}/list-users/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async attachUser(organisationId, projectId, payload) {
    return await apiInstance.post(`/project/organisation/${organisationId}/project/${projectId}/attach-user`, qs.stringify(payload, { skipNulls: true, arrayFormat: "repeat" }));
  },
  async detachUser(organisationId, projectId, payload) {
    return await apiInstance.post(`/project/organisation/${organisationId}/project/${projectId}/detach-user`, qs.stringify(payload, { skipNulls: true, arrayFormat: "repeat" }));
  },
  async createGateway(providerId, projectId) {
    return await apiInstance.post(`/project/${projectId}/provider/${providerId}/create-project-gateway/`);
  },
  async deleteGateway(providerId, projectId) {
    return await apiInstance.delete(`/project/${projectId}/provider/${providerId}/delete-project-gateway/`);
  },
  async deleteProject(providerId, projectId) {
    return await apiInstance.delete(`/project/${projectId}/provider/${providerId}/delete-project/`);
  },
  async projectResources(providerId, projectId, queryParams = {}) {
    return await apiInstance.get(`/resource-action-logs/provider/${providerId}/project/${projectId}/resource-stats/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async createSecurityGroupByType(providerId, projectId, payload) {
    return await apiInstance.post(`/network/provider/${providerId}/project/${projectId}/system-security-group/create/`, qs.stringify(payload, { skipNulls: true }));
  },
  async securityGroupTypes() {
    return await apiInstance.get(`/network/system-security-group/types/`);
  },
  async applyDefaultRule(providerId, projectId, resourceType) {
    return await apiInstance.get(`/network/provider/${providerId}/project/${projectId}/resource-type/${resourceType}/apply-default-rules/`);
  },
  async projectGatewayServices(providerId, projectId) {
    return await apiInstance.get(`/project/${projectId}/provider/${providerId}/gateway-services/`);
  },
  async updatedProjectGatewayServicesStatus(providerId, projectId) {
    return await apiInstance.get(`/project/${projectId}/provider/${providerId}/gateway-services/update-status/`);
  },
  async createProjectGatewayService(providerId, projectId, payload) {
    return await apiInstance.post(`/project/${projectId}/provider/${providerId}/gateway-services/`, qs.stringify(payload, { skipNulls: true, arrayFormat: "repeat" }));
  },
  async projectGatewayServiceAction(providerId, projectId, serviceId, action) {
    return await apiInstance.post(`/project/${projectId}/provider/${providerId}/gateway-service/${serviceId}/${action}/`);
  },
  async reInitProject(providerId, projectId, orgId) {
    return await apiInstance.post(`/project/${projectId}/organisation/${orgId}/provider/${providerId}/init-project/`);
  },
};
