import apiInstance from "utils/api";

export default {
  async stats(organisationId, providerId, payload) {
    return await apiInstance.get(`/api/v1/resource-action-logs/${organisationId}/${providerId}/resourcestat/`, {
      params: payload,
    });
  },
};
