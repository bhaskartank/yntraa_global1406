import apiInstance from "utils/api";

export default {
  async routers(providerId, projectId) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/${projectId}/router/`);
  },
  async routerById(providerId, projectId, routerId) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/${projectId}/router/${routerId}`);
  },
};
