import { createAction, createSlice } from "@reduxjs/toolkit";
import keycloak from "plugins/keycloak";
import { toast } from "react-toastify";

import authApis from "api/auth";
import userApis from "api/users";

import { validateEnv } from "utils";
import apiInstance from "utils/api";
import { socket } from "utils/socket";

import loaderRedux from "./loader";

const name = "auth";

const initialState = {
  userSubscription: null,
  eula: null,
  sessionContext: null,
  events: [],
  authDetails: {},
  userDetails: null,
  selectedDomain: {},
  selectedDomainDetails: {},
  userScopes: {},
  userRoleScope: [],
  showDomainSelectionModal: false,
  isPasswordAuthenticated: false,
  isSentForgotPasswordOTP: false,
  isOtpValidated: false,
  isUpdatePasswordActive: false,
  is2FAEnabled: true,
  otpExpiryTime: 120,
};

// dispatcher to reset the slice
export const THE_GREAT_RESET = createAction("THE_GREAT_RESET");

const slice = createSlice({
  name,
  initialState,
  reducers: {
    setUserSubscription(state, { payload }) {
      state.userSubscription = payload;
    },
    setEula(state, { payload }) {
      state.eula = payload;
    },
    setSessionContext(state, { payload }) {
      state.sessionContext = payload;
    },
    setAuthDetails(state, { payload: details }) {
      state.authDetails = details;

      if (details && details["2f_auth"]) {
        state.is2FAEnabled = details["2f_auth"];
      }
      if (details && details.otp_expiry_time) {
        state.otpExpiryTime = details.otp_expiry_time;
      }
    },
    setIsPasswordAuthenticated(state, { payload }) {
      state.isPasswordAuthenticated = payload;
    },
    setSentForgotPasswordOTP(state, { payload }) {
      state.isSentForgotPasswordOTP = payload;
    },

    setIsOTPValidated(state, { payload }) {
      state.isOtpValidated = payload;
    },
    setUserScopes(state, { payload: userScopes }) {
      state.userScopes = userScopes;
    },
    setUserRoleScope(state, { payload: userRoleScope }) {
      state.userRoleScope = userRoleScope;
    },
    setAuthHeader(state, { payload: header }) {
      apiInstance.defaults.headers.common.Authorization = `Bearer ${header}`;
    },
    setDomainSelectionModal(state, { payload: visibility }) {
      state.showDomainSelectionModal = visibility;
    },
    setUserDetails(state, { payload: details }) {
      state.userDetails = details;
    },
    setSelectedDomain(state, { payload: domain }) {
      state.selectedDomain = domain;
    },
    setSelectedDomainDetails(state, { payload: domainDetails }) {
      state.selectedDomainDetails = domainDetails;
    },
    setIsUpdatePasswordActive(state, { payload }) {
      state.isUpdatePasswordActive = payload;
    },
    RESET(state) {
      state.userSubscription = null;
      state.eula = null;
      state.sessionContext = null;
      state.events = [];
      state.authDetails = {};
      state.userDetails = {};
      state.selectedDomain = null;
      state.userScopes = {};
      state.userRoleScope = [];
      state.showDomainSelectionModal = false;
      state.isPasswordAuthenticated = false;
      state.isSentForgotPasswordOTP = false;
      state.isOtpValidated = false;
      state.isUpdatePasswordActive = false;
    },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(THE_GREAT_RESET, () => {
  //     return initialState;
  //   });
  // },
});

export const { reducer } = slice;

export const actions = {
  autoLogin: () => async (dispatch, getState) => {
    const state = getState();
    const token = getters.token(state);
    return dispatch(actions.setHeaderToken(token));
  },
  userSubscription: () => async (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "get-user-subscription", msg: "Fetching Details!" }));
    try {
      const response = await authApis.userSubscription();

      dispatch(slice.actions.setUserSubscription(response?.data));
    } catch (err) {
      console.error(err);
      dispatch(actions.logout());
    }
    dispatch(loaderRedux.actions.removeMessage({ type: "get-user-subscription" }));
  },
  updateSessionContext: (data: { organisationId: number; projectId: number; providerId: number }) => async (dispatch) => {
    dispatch(slice.actions.setSessionContext(data));
    return Promise.resolve();
  },
  eula: () => async (dispatch) => {
    try {
      const response = await authApis.eula();
      dispatch(slice.actions.setEula(response?.data));
    } catch (e) {
      console.error(e);
    }
  },
  changeProjectScope: (selectedDomain) => async (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "user-project-change", msg: "Changing your project!" }));
    try {
      const payload = {
        project_id: selectedDomain?.projectId,
      };

      dispatch({ type: "THE_GREAT_RESET" });

      const response = await authApis.changeProjectScope(selectedDomain?.projectId, payload);

      dispatch(slice.actions.setUserScopes(response?.data));
      dispatch(slice.actions.setSelectedDomain(selectedDomain));
    } catch (err) {
      console.error(err);
    }
    dispatch(loaderRedux.actions.removeMessage({ type: "user-project-change" }));
  },
  validateOtp:
    ({ otp }) =>
    async (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "user-otp-validation", msg: "Validating OTP!" }));
      try {
        await authApis.validateOtp(otp);

        dispatch(slice.actions.setIsOTPValidated(true));
      } catch (err) {
        console.error(err);
      }
      dispatch(loaderRedux.actions.removeMessage({ type: "user-otp-validation" }));
    },
  resendOtp: () => async (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "resend-otp", msg: "Sending new OTP!" }));
    try {
      const response = await authApis.resendOtp();

      toast.success(response?.data?.message);
    } catch (err) {
      console.error(err);
    }
    dispatch(loaderRedux.actions.removeMessage({ type: "resend-otp" }));
  },
  login: (user: any) => async (dispatch, getState) => {
    try {
      dispatch(loaderRedux.actions.addMessage({ type: "user-login", msg: "Logging you In!" }));

      user.client_id = user.username;

      const response = await authApis.getToken(user);

      dispatch(slice.actions.setAuthDetails(response?.data));
      dispatch(slice.actions.setIsPasswordAuthenticated(true));

      if (response?.data && !response?.data["2f_auth"]) {
        dispatch(slice.actions.setIsOTPValidated(true));
      }
      const state = getState();
      const token = getters.token(state);

      socket.emit("session", { token });
      dispatch(actions.setHeaderToken(token));
    } catch (err) {
      console.error(err);
    }

    dispatch(loaderRedux.actions.removeMessage({ type: "user-login" }));
  },
  resetAuthentication: () => (dispatch) => {
    dispatch(slice.actions.setAuthDetails({}));
    dispatch(slice.actions.setIsPasswordAuthenticated(false));
  },
  oidcLogin: (user: any) => async (dispatch, getState) => {
    dispatch(loaderRedux.actions.addMessage({ type: "user-login", msg: "Logging you In!" }));
    try {
      user.client_id = user.username;

      const response = await authApis.getTokenWithOIDC();

      dispatch(slice.actions.setAuthDetails(response?.data));

      const state = getState();
      const token = getters.token(state);

      socket.emit("session", { token });

      dispatch(actions.setHeaderToken(token));
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 401) {
        keycloak.logout();
      }
    }

    dispatch(loaderRedux.actions.removeMessage({ type: "user-login" }));
  },
  showDomainSelectionModal: () => async (dispatch) => {
    dispatch(slice.actions.setDomainSelectionModal(true));
  },
  setHeaderToken: (token) => async (dispatch) => {
    dispatch(slice.actions.setAuthHeader(token));
    return Promise.resolve();
  },
  userScopes: () => async (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "user-scopes", msg: "Fetching User Scopes!" }));

    try {
      const response = await authApis.userScopes();

      dispatch(slice.actions.setUserScopes(response?.data));
    } catch (err) {
      console.error(err);
    }
    dispatch(loaderRedux.actions.removeMessage({ type: "user-scopes" }));
  },
  userRoleScope: () => async (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "user-role-scope", msg: "Fetching User Roles!" }));
    try {
      const response = await authApis.userRoleScope();

      dispatch(slice.actions.setUserRoleScope(response?.data));
    } catch (err) {
      console.error(err);
    }

    dispatch(loaderRedux.actions.removeMessage({ type: "user-role-scope" }));
  },
  logout: () => async (dispatch) => {
    dispatch(slice.actions.RESET());
    if (validateEnv(process.env.REACT_APP_OIDC_ENABLED, "true")) {
      keycloak.logout();
    } else {
      await authApis.logout();
    }
  },
  selectDomain: (domain) => async (dispatch) => {
    dispatch(slice.actions.setSelectedDomain(domain));
  },
  setSelectedDomainDetails: (domainDetails) => async (dispatch) => {
    dispatch(slice.actions.setSelectedDomainDetails(domainDetails));
  },
  checkAuthToken: () => async (dispatch) => {
    try {
      await userApis.checkToken();
    } catch (err) {
      console.error(err);
      dispatch(actions.logout());
    }
  },
  userDetails: () => async (dispatch) => {
    try {
      const response = await userApis.checkToken();

      dispatch(slice.actions.setUserDetails(response?.data));
    } catch (err) {
      console.error(err);
    }
  },
  forgetPassword: (payload) => async (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "forget-password", msg: "Sending OTP!" }));
    try {
      await authApis.forgetPassword(payload);

      dispatch(slice.actions.setUserDetails(payload));
      dispatch(slice.actions.setSentForgotPasswordOTP(true));
    } catch (err) {
      console.error(err);
    }

    dispatch(loaderRedux.actions.removeMessage({ type: "forget-password" }));
  },
  validateForgetPasswordOtp: (payload) => async (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "validate-forget-password-otp", msg: "Validating OTP!" }));

    try {
      await authApis.validateForgetPasswordOtp(payload);
    } catch (err) {
      console.error(err);
    }

    dispatch(loaderRedux.actions.removeMessage({ type: "validate-forget-password-otp" }));
  },
  resetPassword: (payload) => async (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "reset-password", msg: "Resetting Password!" }));

    try {
      await authApis.resetPassword(payload);

      toast.success("Password Reset Successful");
    } catch (err) {
      console.error(err);
    }

    dispatch(loaderRedux.actions.removeMessage({ type: "reset-password" }));
  },
  updatePasswordModalActive: (payload) => async (dispatch) => {
    dispatch(slice.actions.setIsUpdatePasswordActive(payload));
    return Promise.resolve();
  },
};

const getters = {
  userSubscription(rootState) {
    const state = rootState[name];
    return state.userSubscription;
  },
  eula(rootState) {
    const state = rootState[name];
    return state.eula;
  },
  sessionContext(rootState) {
    const state = rootState[name];
    return state.sessionContext;
  },
  userScopes(rootState) {
    const state = rootState[name];
    return state.userScopes;
  },
  userRoleScope(rootState) {
    const state = rootState[name];
    return state.userRoleScope;
  },
  token(rootState) {
    const state = rootState[name];
    return state.authDetails.access_token;
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
    return state.userDetails.id;
  },
  organisationId(rootState) {
    const state = rootState[name];
    return state.selectedDomain.organisationId ? state.selectedDomain.organisationId : null;
  },
  selectedDomain(rootState) {
    const state = rootState[name];
    return state.selectedDomain;
  },
  selectedDomainDetails(rootState) {
    const sessionContext = getters.sessionContext(rootState);

    if (sessionContext) {
      const availableDomains = getters.availableDomains(rootState);

      const domainDetails = { organisation: null, project: null, provider: null };

      const currentOrganisationDetails = availableDomains?.find((domain) => domain?.organisation?.id?.toString() === sessionContext?.organisationId?.toString())?.organisation;
      if (currentOrganisationDetails) {
        domainDetails.organisation = currentOrganisationDetails;
      }

      const currentProjectDetails = currentOrganisationDetails?.projects?.find((project) => project?.id?.toString() === sessionContext?.projectId?.toString());
      if (currentProjectDetails) {
        domainDetails.project = currentProjectDetails;
      }

      const currentProviderDetails = currentProjectDetails?.project_provider_mapping_project?.find(
        (providerMapping) => providerMapping?.provider?.id?.toString() === sessionContext?.providerId?.toString(),
      )?.provider;
      if (currentProviderDetails) {
        domainDetails.provider = currentProviderDetails;
      }

      return domainDetails;
    }

    return null;
  },
  resourceNamePrefix(rootState) {
    // const state = rootState[name];

    const selectedDomainDetails = getters.selectedDomainDetails(rootState);

    return selectedDomainDetails?.organisation?.org_id + "-" + selectedDomainDetails?.project?.project_id + "-" + selectedDomainDetails?.provider?.provider_id + "-";
  },
  selectedProjectId(rootState) {
    const state = rootState[name];
    return state.sessionContext?.projectId;
  },
  selectedProviderId(rootState) {
    const state = rootState[name];
    return state.sessionContext?.providerId;
  },
  selectedOrganisationId(rootState) {
    const state = rootState[name];
    return state.sessionContext?.organisationId;
  },
  availableDomains(rootState) {
    const state = rootState[name];
    let domains = [];

    state.userRoleScope?.forEach(({ organisation, project }) => {
      const existingOrganisation = domains?.find((domain) => domain?.organisation?.id === organisation?.id);

      if (existingOrganisation) {
        domains = domains.map((domain) => {
          if (domain?.organisation?.id === organisation?.id) {
            const mappedData: any = {};

            mappedData.organisation = Object.assign({}, existingOrganisation?.organisation);

            if (mappedData?.organisation?.projects?.length) {
              mappedData.organisation.projects = [...mappedData.organisation.projects, project];
            } else {
              mappedData.organisation.projects = [project];
            }

            return mappedData;
          } else {
            return domain;
          }
        });
      } else {
        if (project?.project_provider_mapping_project?.length) {
          const mappedData: any = {};

          mappedData.organisation = Object.assign({}, organisation);
          mappedData.organisation.projects = [project];

          domains.push(mappedData);
        }
      }
    });

    return domains;
  },
  availableProjectsByOrgId(rootState) {
    return (organisationId) => {
      const availableDomains = getters.availableDomains(rootState);

      return availableDomains?.find((domain) => domain?.organisation?.id?.toString() === organisationId?.toString())?.organisation?.projects;
    };
  },
  availableProvidersByOrgProjId(rootState) {
    return (organisationId, projectId) => {
      const availableDomains = getters.availableDomains(rootState);

      const projects = availableDomains?.find((domain) => domain?.organisation?.id?.toString() === organisationId?.toString())?.organisation?.projects;

      const providers = projects?.find((project) => project?.id?.toString() === projectId?.toString())?.project_provider_mapping_project;

      return providers;
    };
  },
  myScope(rootState) {
    const state = rootState[name];
    return state.userScopes.scopes || [];
  },
  isPasswordAuthenticated(rootState) {
    const state = rootState[name];
    return state.isPasswordAuthenticated;
  },
  isSentForgotPasswordOTP(rootState) {
    const state = rootState[name];
    return state.isSentForgotPasswordOTP;
  },
  isOtpValidated(rootState) {
    const state = rootState[name];
    return state.isOtpValidated;
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
};

export default {
  actions,
  getters,
  slice,
};
