import qs from "qs";

import apiInstance from "utils/api";

export default {
  async userRoles(organisationId, payload) {
    return await apiInstance.get(`/api/v1/role_permission_group/organisation/?organisation_id=${organisationId}`, {
      params: payload,
    });
  },
  async createRole(payload) {
    return await apiInstance.post(`/api/v1/role_permission_group/`, qs.stringify(payload));
  },
};
