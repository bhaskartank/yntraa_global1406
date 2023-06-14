import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import gatewayApis from "api/gateway";

import authRedux, { THE_GREAT_RESET } from "./auth";
import loaderRedux from "./loader";
import securityGroupRulesRedux from "./security-group-rules";

const name = "gateway";
const initialState = {
  gateway: {},
  services: [],
  totalServices: 0,
};

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    SET_GATEWAY(state, { payload }) {
      state.gateway = payload;
    },
    SET_SERVICES(state, { payload }) {
      state.services = payload;
    },
    SET_TOTAL_SERVICES(state, { payload }) {
      state.totalServices = payload && !!payload["x-total-count"] ? parseInt(payload["x-total-count"], 10) : 0;
    },
    RESET(state) {
      state.gateway = {};
      state.services = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(THE_GREAT_RESET, () => {
      return initialState;
    });
  },
});

export const { reducer } = slice;

export const actions = {
  createService:
    ({ providerId, projectId, payload }) =>
    async (dispatch, getState) => {
      dispatch(loaderRedux.actions.addMessage({ type: "gateway-service-create", msg: "Creating Gateway Service!" }));
      return gatewayApis.createService(providerId, projectId, payload).finally(() => {
        const state = getState()[name];

        dispatch(actions.services({}));
        dispatch(securityGroupRulesRedux.actions.securityGroupRules(state.gateway.security_group_id));

        dispatch(loaderRedux.actions.removeMessage({ type: "gateway-service-create" }));
      });
    },

  services:
    ({ providerId, projectId, payload }: any) =>
    async (dispatch, getState) => {
      dispatch(loaderRedux.actions.addMessage({ type: "gateway-service-list", msg: "Loading Gateway Services!" }));

      const rootState = getState();
      if (!providerId) {
        providerId = authRedux.getters.selectedProviderId(rootState);
      }
      if (!projectId) {
        projectId = authRedux.getters.selectedProjectId(rootState);
      }

      return gatewayApis
        .services(providerId, projectId, payload)
        .then((response) => {
          dispatch(slice.actions.SET_SERVICES(response.data));
          dispatch(slice.actions.SET_TOTAL_SERVICES(response.headers));
          return response;
        })
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "gateway-service-list" }));
        });
    },

  details:
    ({ providerId, projectId }: any) =>
    async (dispatch, getState) => {
      const rootState = getState();

      if (!providerId) {
        providerId = authRedux.getters.selectedProviderId(rootState);
      }
      if (!projectId) {
        projectId = authRedux.getters.selectedProjectId(rootState);
      }
      if (!projectId || !providerId) {
        return Promise.reject(new Error("No project and provider Details"));
      }
      dispatch(loaderRedux.actions.addMessage({ type: "gateway-details", msg: "Loading Gateway Details!" }));

      // return your ajax request as promise
      return gatewayApis
        .getDetails(providerId, projectId)
        .then((gateway) => {
          dispatch(slice.actions.SET_GATEWAY(gateway));
          return gateway;
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "gateway-details" }));
        });
    },

  stopService:
    ({ projectId, providerId, gatewayServiceId }: any) =>
    async (dispatch, getState) => {
      dispatch(loaderRedux.actions.addMessage({ type: "gateway-service-stop", msg: "Stopping Gateway Service!" }));
      const rootState = getState();

      if (!providerId) {
        providerId = authRedux.getters.selectedProviderId(rootState);
      }
      if (!projectId) {
        projectId = authRedux.getters.selectedProjectId(rootState);
      }
      // return your ajax request as promise
      return gatewayApis
        .performAction(providerId, projectId, gatewayServiceId, "stop")
        .then((state) => {
          toast.success("Gateway Service Stopped Successfully");
          return state;
        })
        .finally(() => {
          dispatch(actions.services({}));
          dispatch(loaderRedux.actions.removeMessage({ type: "gateway-service-stop" }));
        });
    },

  startService:
    ({ projectId, providerId, gatewayServiceId }: any) =>
    async (dispatch, getState) => {
      dispatch(loaderRedux.actions.addMessage({ type: "gateway-service-start", msg: "Starting Gateway Service!" }));
      const rootState = getState();

      if (!providerId) {
        providerId = authRedux.getters.selectedProviderId(rootState);
      }
      if (!projectId) {
        projectId = authRedux.getters.selectedProjectId(rootState);
      }
      // return your ajax request as promise
      return gatewayApis
        .performAction(providerId, projectId, gatewayServiceId, "start")
        .then((state) => {
          toast.success("Gateway Service Started Successfully");
          return state;
        })
        .finally(() => {
          dispatch(actions.services({}));
          dispatch(loaderRedux.actions.removeMessage({ type: "gateway-service-start" }));
        });
    },

  removeService:
    ({ projectId, providerId, gatewayServiceId }: any) =>
    async (dispatch, getState) => {
      dispatch(loaderRedux.actions.addMessage({ type: "gateway-service-remove", msg: "Removing Gateway Service!" }));
      const rootState = getState();

      if (!providerId) {
        providerId = authRedux.getters.selectedProviderId(rootState);
      }
      if (!projectId) {
        projectId = authRedux.getters.selectedProjectId(rootState);
      }
      // return your ajax request as promise
      return gatewayApis
        .performAction(providerId, projectId, gatewayServiceId, "remove")
        .then((state) => {
          toast.success("Gateway Service Removed Successfully");
          return state;
        })
        .finally(() => {
          const state = getState()[name];

          dispatch(actions.services({}));

          dispatch(securityGroupRulesRedux.actions.securityGroupRules(state.gateway.security_group_id));

          dispatch(loaderRedux.actions.removeMessage({ type: "gateway-service-remove" }));
        });
    },
};

export const getters = {
  gateway(rootState) {
    const state = rootState[name];
    return state.gateway;
  },
  services(rootState) {
    const state = rootState[name];
    return state.services;
  },
  totalServices(rootState) {
    const state = rootState[name];
    return state.totalServices;
  },
  gatewayIp(rootState) {
    const state = rootState[name];
    return state.gateway.gw_device_ip;
  },
};

export default {
  slice,
  actions,
  getters,
};
