import apiInstance from "utils/api";

export default {
  async usageGraph(providerId, projectId, computeId, payload) {
    return await apiInstance.get(`api/v1/resource-metrices/${providerId}/project/${projectId}/compute/${computeId}/report/`, { params: payload });
  },
  async resourceMetrics(providerId, payload) {
    return await apiInstance.get(`/api/v1/resource-metrices/${providerId}/resource-metrice/`, { params: payload });
  },
};
