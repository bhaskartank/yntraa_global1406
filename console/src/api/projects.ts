import qs from "qs";

import apiInstance from "utils/api";

export default {
  async initializeProject(payload) {
    return await apiInstance.post(`/api/v1/organisation/project/init`, qs.stringify(payload));
  },
  async projects(organisationId, payload) {
    return await apiInstance.get(`/api/v1/organisation/${organisationId}/project/`, { params: payload });
  },
  async projectUsers(organisationId, projectId, payload) {
    return await apiInstance.get(`/api/v1/organisation/${organisationId}/${projectId}/userlist/`, { params: payload });
  },
  async detachProjectUser(organisationId, projectId, payload) {
    return await apiInstance.post(`/api/v1/organisation/${organisationId}/${projectId}/user/detach`, qs.stringify(payload));
  },
  async attachProjectUser(organisationId, projectId, payload) {
    return await apiInstance.post(`/api/v1/organisation/${organisationId}/${projectId}/user`, qs.stringify(payload));
  },
  async createProject(organisationId, payload) {
    return await apiInstance.post(`/api/v1/organisation/${organisationId}/project/`, qs.stringify(payload, { skipNulls: true, arrayFormat: "repeat" }));
  },
  async initProvider(organisationId, providerId, projectId, payload) {
    return await apiInstance.post(`/api/v1/organisation/${organisationId}/${providerId}/${projectId}/init/`, qs.stringify(payload));
  },
  async projectById(organisationId, projectId) {
    return await apiInstance.get(`/api/v1/organisation/${organisationId}/${projectId}`);
  },
  async deleteProject(organisationId, projectId) {
    return await apiInstance.delete(`/api/v1/organisation/${organisationId}/${projectId}`);
  },
};
