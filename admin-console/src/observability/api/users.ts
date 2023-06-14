import qs from "qs";

import apiInstance from "../../utilities/api";

export default {
  async admin(queryParams = {}) {
    return await apiInstance.get(`/users/admin-users-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async SSOUsers(queryParams = {}) {
    return await apiInstance.get(`/users/admin/sso_users?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async fetchUserDetailsFromSSO(userId) {
    return await apiInstance.get(`/users/admin/sso_user/${userId}?${qs.stringify({ userId }, { skipNulls: true })}`);
  },
  async users(queryParams = {}) {
    return await apiInstance.get(`/users/users-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async createUser(payload) {
    return await apiInstance.post(`/users/new-users/create/`, qs.stringify(payload));
  },
  async resetPassword(userId) {
    return await apiInstance.post(`/auth/user/${userId}/reset-password/`);
  },
  async syncUserWithSSO(userId) {
    return await apiInstance.post(`/users/admin/sync_sso_user/${userId}`);
  },
  async blockUser(userId) {
    return await apiInstance.post(`/users/admin/block_sso_user/${userId}`);
  },
  async unblockUser(userId) {
    return await apiInstance.post(`/users/admin/unblock_sso_user/${userId}`);
  },
  async fetchUserDetails(userId) {
    return await apiInstance.get(`/users/${userId}/detail/`);
  },
  async adminPortalPermissions(userId, queryParams = {}) {
    return await apiInstance.get(`/role_permission_group/admin-role-scope/users/${userId}/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async assignAdminPortalPermission(userId, payload) {
    return await apiInstance.post(`/role_permission_group/admin-role-scope/users/${userId}/`, qs.stringify(payload));
  },
  async unassignAdminPortalPermission(userId, adminRoleScopeId) {
    return await apiInstance.delete(`/role_permission_group/users/${userId}/admin-role-scope/${adminRoleScopeId}/`);
  },
  async adminPortalPermissionScopes(queryParams = {}) {
    return await apiInstance.get(`/role_permission_group/admin-role-permission-groups/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async servicePortalPermissions(userId, queryParams = {}) {
    return await apiInstance.get(`/role_permission_group/user-role-scopes/users/${userId}/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async assignServicePortalPermission(organisationId, projectId, payload) {
    return await apiInstance.post(`/project/organisation/${organisationId}/project/${projectId}/attach-user`, qs.stringify(payload, { skipNulls: true, arrayFormat: "repeat" }));
  },
  async servicePortalPermissionScopes(queryParams = {}) {
    return await apiInstance.get(`/role_permission_group/user-role-scope/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async getPublicIpRequestUserById(requested_by_id) {
    return await apiInstance.get(`/users/${requested_by_id}/detail/`);
  },
};
