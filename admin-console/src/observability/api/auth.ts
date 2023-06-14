import keycloak from "plugins/sso";
import qs from "qs";

import apiInstance from "utilities/api";

export default {
  async getToken(payload) {
    payload.grant_type = "password";
    return await apiInstance.post(`/auth/admin/oauth2/token`, qs.stringify(payload));
  },
  async getTokenUsingOidc() {
    const bodyFormData = new URLSearchParams();
    bodyFormData.append("access_token", keycloak.token);
    bodyFormData.append("expires_in", String(keycloak.tokenParsed?.exp));
    bodyFormData.append("token_type", String(keycloak.tokenParsed?.token_type));
    bodyFormData.append("id_token", keycloak.idToken);
    return await apiInstance.post(`/auth/admin/oidc/token`, bodyFormData, { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
  },
  async logout() {
    return await apiInstance.post(`auth/logout/`);
  },
  async validateOtp(otp) {
    return await apiInstance.post(`auth/validate_otp/`, qs.stringify({ otp }));
  },
  async resendOtp() {
    return await apiInstance.get(`auth/resend_otp/`);
  },
  async forgotPassword(username) {
    const data = { username };
    return await apiInstance.post(`auth/forget-password/`, qs.stringify(data));
  },
  async validateForgotPasswordOtp(data) {
    return await apiInstance.post(`auth/validate-forgot-password-otp/`, qs.stringify(data));
  },
  async resetPassword(payload) {
    return await apiInstance.post(`auth/create-new-password/`, qs.stringify(payload));
  },
  async checkToken() {
    return await apiInstance.get(`users/me`);
  },
  async changePassword(payload) {
    return await apiInstance.post(`/users/admin/change_password/`, qs.stringify(payload));
  },
};
