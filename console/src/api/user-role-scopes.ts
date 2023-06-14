import apiInstance from "utils/api";

export default {
  async getScopes() {
    return await apiInstance.get(`/api/v1/auth/user_role_scopes`);
  },
};
