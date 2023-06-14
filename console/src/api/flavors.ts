import apiInstance from "utils/api";

export default {
  async flavors(providerId, payload) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/compute/flavors/`, { params: payload });
  },
};
