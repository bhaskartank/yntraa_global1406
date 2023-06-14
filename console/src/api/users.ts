import apiInstance from "utils/api";

export default {
  async users(payload) {
    return await apiInstance.get(`/api/v1/users/`, { params: payload });
  },
  async userById(id) {
    return await apiInstance.get(`/api/v1/users/${id}`);
  },
  async checkToken() {
    return await apiInstance.get(`/api/v1/users/me`);
  },
};
