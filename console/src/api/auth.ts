import keycloak from "plugins/keycloak";
import qs from "qs";

import apiInstance from "utils/api";

export default {
  async userSubscription() {
    return await apiInstance.get(`/api/v1/organisation/is_subscribed`);
  },
  async eula() {
    return await apiInstance.get(`/api/v1/utils/eula`);
  },
  async changeProjectScope(projectId, payload) {
    return await apiInstance.post(`/api/v1/auth/change_project_scope/${projectId}`, payload);
  },
  async userScopes() {
    return await apiInstance.get(`/api/v1/auth/user_token_scope`);
  },
  async userRoleScope() {
    return await apiInstance.get(`/api/v1/role_permission_group/user_role_scope`);
  },
  async getToken(payload) {
    return await apiInstance.post(`/auth/oauth2/token`, qs.stringify({ ...payload, grant_type: "password" }));
  },
  async getTokenWithOIDC() {
    const bodyFormData = new URLSearchParams();
    bodyFormData.append("access_token", keycloak.token);
    bodyFormData.append("expires_in", String(keycloak.tokenParsed?.exp));
    bodyFormData.append("token_type", keycloak.tokenParsed?.token_type);
    bodyFormData.append("id_token", keycloak.idToken);
    return await apiInstance.post(`/auth/oidc/token`, bodyFormData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
  },
  async logout() {
    return await apiInstance.post(`/api/v1/auth/logout/`);
  },
  async validateOtp(otp) {
    return await apiInstance.post(`/api/v1/auth/validate_otp/`, qs.stringify({ otp }));
  },
  async resendOtp() {
    return await apiInstance.get(`/api/v1/auth/resend_otp/`);
  },
  async forgetPassword(payload) {
    return await apiInstance.post(`/api/v1/auth/forget-password/`, qs.stringify(payload));
  },
  async validateForgetPasswordOtp(payload) {
    return await apiInstance.post(`/api/v1/auth/validate-forgot-password-otp/`, qs.stringify(payload));
  },
  async resetPassword(payload) {
    return await apiInstance.post(`/api/v1/auth/create-new-password/`, qs.stringify(payload));
  },
};
