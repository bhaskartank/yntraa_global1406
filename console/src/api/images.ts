import apiInstance from "utils/api";

export default {
  async images(providerId, queryParams) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/compute/images/`, { params: queryParams });
  },
};
