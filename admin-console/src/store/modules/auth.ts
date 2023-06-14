import { createAction, createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import AuthAPI from "observability/api/auth";
import keycloak from "plugins/sso";
import { toast } from "react-toastify";

import { validateEnv } from "utilities";
import apiInstance from "utilities/api";

import loaderRedux from "./loader";

export const GLOBAL_RESET = createAction("GLOBAL_RESET");

const name = "auth";
const initialState = {
  authDetails: {},
  userDetails: null,
  selectedDomain: {},
  userScopes: {},
  providerId: null,
  userId: null,
  showDomainSelectionModal: false,
  internalType: false,

  isPasswordAuthenticated: false,
  isSentForgotPasswordOTP: false,
  isOtpValidated: false,
  isUpdatePasswordActive: false,
  is2FAEnabled: true,
  otpExpiryTime: 120,
  isLoggedIn: false,
};
const slice = createSlice({
  name,
  initialState,
  reducers: {
    SET_AUTH_DETAILS(state, { payload }) {
      state.authDetails = payload;
    },
    SET_USER_SCOPES(state, { payload }) {
      state.userScopes = payload;
    },
    SET_AUTH_HEADER(state, { payload }) {
      apiInstance.defaults.headers.common.authorization = `Bearer ${payload}`;
    },
    SET_DOMAIN_SELECTION_MODAL_VISIBILITY(state, { payload }) {
      state.showDomainSelectionModal = payload;
    },
    SET_USER(state, { payload }) {
      state.userDetails = payload;
    },
    SELECT_DOMAIN(state, { payload }) {
      state.selectedDomain = payload;
    },
    RESET(state) {
      state.authDetails = {};
      state.userDetails = {};
      state.selectedDomain = {};
      state.userScopes = {};
      state.providerId = null;
      state.userId = null;
      state.internalType = false;
      state.showDomainSelectionModal = false;
      state.isPasswordAuthenticated = false;
      state.isSentForgotPasswordOTP = false;
      state.isOtpValidated = false;
      state.isUpdatePasswordActive = false;
      state.isUpdatePasswordActive = false;
      state.is2FAEnabled = true;
      state.otpExpiryTime = 120;
    },
    SET_PROVIDER_ID(state, { payload }) {
      state.providerId = payload;
    },
    SET_USER_ID(state, { payload }) {
      state.userId = payload;
    },
    SET_INTERNAL_USER(state, { payload }) {
      state.internalType = payload;
    },
    SET_PASSWORD_AUTHENTICATED(state, { payload }) {
      state.isPasswordAuthenticated = payload;
    },
    SET_SENT_FORGOT_PASSWORD_OTP(state, { payload }) {
      state.isSentForgotPasswordOTP = payload;
    },
    SET_UPDATE_PASSWORD_STATE(state, { payload }) {
      state.isUpdatePasswordActive = payload;
    },
    SET_IS_LOGGED_IN(state, { payload }) {
      state.isLoggedIn = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(GLOBAL_RESET, () => {
      return initialState;
    });
  },
});

export const { reducer } = slice;

export const actions = {
  setLogoutTimer: (expirationTime) => (dispatch) => {
    setTimeout(() => {
      dispatch({ type: "GLOBAL_RESET" });
    }, expirationTime);
  },
  autoLogin: () => (dispatch, getState) => {
    const rootState = getState();
    const token = getters.token(rootState);
    return dispatch(actions.setHeaderToken(token));
  },
  validateOtp:
    ({ otp }) =>
    (dispatch) => {
      return AuthAPI.validateOtp(otp).then((response) => {
        const user = response.data;

        dispatch(slice.actions.SET_IS_LOGGED_IN(true));

        if (user.scopes.length <= 1) {
          dispatch(slice.actions.SET_USER_SCOPES(user.scopes[0].provider_scope));
          dispatch(slice.actions.SET_PROVIDER_ID(user.scopes[0].provider_id));
        }

        dispatch(slice.actions.SET_USER_ID(user?.user_id));
        dispatch(slice.actions.SET_INTERNAL_USER(user?.user?.is_internal));

        return user;
      });
    },
  resendOtp: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "resend-otp", msg: "Resending OTP!" }));

    return AuthAPI.resendOtp()
      .then((res) => {
        toast.success("OTP Resent Successfully!");
        return res;
      })
      .catch((error) => {
        throw error;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "resend-otp" }));
      });
  },
  login: (user) => (dispatch) => {
    user.client_id = user.username;
    return AuthAPI.getToken(user)
      .then((response) => {
        const authDetails = response.data;
        const token = authDetails?.access_token;

        dispatch(slice.actions.SET_AUTH_DETAILS(authDetails));

        if (authDetails && !authDetails["2f_auth"]) {
          dispatch(slice.actions.SET_IS_LOGGED_IN(true));
        }

        dispatch(actions.setLogoutTimer(authDetails.expires_in * 1000));
        return dispatch(actions.setHeaderToken(token));
      })
      .catch((error) => {
        toast.error("Invalid Username or Password!");
        throw error;
      });
  },
  loginWithOidc:
    (user = null) =>
    async (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "oidc-login", msg: "Logging you In!" }));

      return AuthAPI.getTokenUsingOidc()
        .then((response) => {
          const authDetails = response.data;
          dispatch(slice.actions.SET_IS_LOGGED_IN(true));

          const token = authDetails?.access_token;

          dispatch(slice.actions.SET_AUTH_DETAILS(authDetails));
          dispatch(actions.setLogoutTimer(authDetails?.expires_in * 1000));
          dispatch(actions.setHeaderToken(token));

          if (authDetails.scope.length <= 1) {
            dispatch(slice.actions.SET_USER_SCOPES(user?.scopes[0]?.provider_scope));
            dispatch(slice.actions.SET_PROVIDER_ID(user?.scopes[0]?.provider_id));
          }

          dispatch(slice.actions.SET_USER_ID(authDetails?.user_id));

          return authDetails;
        })
        .catch((error) => {
          throw error;
        })
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "oidc-login" }));
        });
    },
  showDomainSelectionModal: () => (dispatch) => {
    dispatch(slice.actions.SET_DOMAIN_SELECTION_MODAL_VISIBILITY(Math.floor(Math.random() * Math.floor(10000))));
  },
  setHeaderToken: (token) => async (dispatch) => {
    dispatch(slice.actions.SET_AUTH_HEADER(token));
    return Promise.resolve();
  },
  logout:
    ({ keepSession, triggerLogoutEndPoint }) =>
    async (dispatch) => {
      if (!keepSession) {
        dispatch({ type: "GLOBAL_RESET" });

        if (triggerLogoutEndPoint) {
          if (validateEnv(process.env.REACT_APP_OIDC_ENABLED, "true")) {
            keycloak.logout();
          }

          AuthAPI.logout();
        }
      }

      return Promise.resolve();
    },
  selectDomain: (domain) => (dispatch) => {
    dispatch(slice.actions.SELECT_DOMAIN(domain));
  },
  checkAuthToken: () => (dispatch) => {
    return AuthAPI.checkToken().then((response) => {
      const user = response.data;

      dispatch(slice.actions.SET_USER(user));

      if (user.scopes.length <= 1) {
        dispatch(slice.actions.SET_USER_SCOPES(user.scopes[0].provider_scope));
        dispatch(slice.actions.SET_PROVIDER_ID(user.scopes[0].provider_id));
      }
      dispatch(slice.actions.SET_USER_ID(user.id));
      dispatch(slice.actions.SET_INTERNAL_USER(user.is_internal));
      return user;
    });
  },
  forgotPassword:
    ({ username }) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "forget-password", msg: "Sending OTP" }));
      return AuthAPI.forgotPassword(username)
        .then((response) => {
          dispatch(slice.actions.SET_AUTH_DETAILS(response.data));
          dispatch(slice.actions.SET_USER(username));
          dispatch(slice.actions.SET_SENT_FORGOT_PASSWORD_OTP(true));
          return response.data;
        })
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "forget-password" }));
        });
    },
  validateForgotPasswordOtp: (data) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "validate-forget-password-otp", msg: "Validating OTP" }));
    return AuthAPI.validateForgotPasswordOtp(data)
      .then((data) => {
        dispatch(slice.actions.SET_AUTH_DETAILS(data));
        toast.success("Password Reset Successful!");
        return data;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "validate-forget-password-otp" }));
      });
  },
  resetPassword: (payload) => async (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "reset-password", msg: "Resetting Password" }));
    return AuthAPI.resetPassword(payload)
      .then((result) => {
        toast.success("Password Reset Successful");

        return result;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "reset-password" }));
      });
  },
  resetAuthentication: () => async (dispatch) => {
    dispatch({ type: "GLOBAL_RESET" });
    return Promise.resolve();
  },
  updatePasswordModalActive: (payload) => async (dispatch) => {
    dispatch(slice.actions.SET_UPDATE_PASSWORD_STATE(payload));
    return Promise.resolve();
  },
  changePassword: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "update-password", msg: "Updating Password" }));

    return AuthAPI.changePassword(payload)
      .then((user) => {
        toast.success("Password Updated Successfully!");
        return user;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "update-password" }));
      });
  },
};

const getters = {
  userScopes(rootState) {
    const state = rootState[name];
    return state.userScopes;
  },
  token(rootState) {
    const state = rootState[name];
    return state.authDetails.access_token;
  },
  authDetails(rootState) {
    const state = rootState[name];
    return state.authDetails;
  },
  showDomainSelectionModal(rootState) {
    const state = rootState[name];
    return state.showDomainSelectionModal;
  },
  userDetails(rootState) {
    const state = rootState[name];
    return state.userDetails;
  },
  userId(rootState) {
    const state = rootState[name];
    return state.userId;
  },
  internalType(rootState) {
    const state = rootState[name];
    return state.internalType;
  },
  organisationId(rootState) {
    const state = rootState[name];
    return state.selectedDomain.organisationId ? state.selectedDomain.organisationId : null;
  },
  selectedDomain(rootState) {
    const state = rootState[name];
    return state.selectedDomain;
  },
  selectedProject(rootState) {
    const state = rootState[name];
    return state.selectedDomain.projectId ? state.selectedDomain.projectId : null;
  },
  selectedProvider(rootState) {
    const state = rootState[name];
    return state.providerId ? state.providerId : null;
  },
  selectedOrganisation(rootState) {
    const state = rootState[name];
    return state.selectedDomain.organisationId ? state.selectedDomain.organisationId : null;
  },
  availableDomains(rootState) {
    const state = rootState[name];
    const domains = [];
    !!state.userDetails.organisation_project_user_user &&
      _.forEach(state.userDetails.organisation_project_user_user, ({ organisation, project }) => {
        _.map(project.project_provider_mapping_project, (provider) => {
          domains.push({ projectId: project.id, providerId: provider.provider_id, organisationId: organisation.id });
        });
      });
    return domains;
  },
  myScope(rootState) {
    const state = rootState[name];
    return state.userScopes || [];
  },
  isSentForgotPasswordOTP(rootState) {
    const state = rootState[name];
    return state.isSentForgotPasswordOTP;
  },
  isUpdatePasswordActive(rootState) {
    const state = rootState[name];
    return state.isUpdatePasswordActive;
  },
  is2FAEnabled(rootState) {
    const state = rootState[name];
    return state.is2FAEnabled;
  },
  otpExpiryTime(rootState) {
    const state = rootState[name];
    return state.otpExpiryTime;
  },
  isLoggedIn(rootState) {
    const state = rootState[name];
    return state.isLoggedIn;
  },
};

export default {
  actions,
  getters,
  slice,
};
