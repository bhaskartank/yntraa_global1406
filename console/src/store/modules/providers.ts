import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import providerApis from "api/providers";

import authRedux, { THE_GREAT_RESET } from "./auth";

const name = "providers";

const initialState = {
  providers: [],
  providerById: null,
  availableProviders: [],
  enabledServices: [],
};

const slice = createSlice({
  name,
  initialState,
  reducers: {
    setProviders(state, { payload }) {
      state.providers = payload;
    },
    setProviderById(state, { payload }) {
      state.providerById = payload;
    },
    setEnabledServices(state, { payload }) {
      state.enabledServices = payload;
    },
    setAvailableProviders(state, { payload }) {
      state.availableProviders = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(THE_GREAT_RESET, () => {
      return initialState;
    });
  },
});

export const { reducer } = slice;

const actions = {
  providers: () => async (dispatch) => {
    try {
      const response = await providerApis.providers();

      dispatch(slice.actions.setProviders(response?.data));
    } catch (err) {
      console.error(err);
    }
  },
  enabledServices: () => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);

      const response = await providerApis.enabledServices(providerId);

      dispatch(slice.actions.setEnabledServices(response?.data));
    } catch (err) {
      console.error(err);
    }
  },
  providerById:
    ({ providerId }) =>
    async (dispatch) => {
      try {
        const response = await providerApis.providerById(providerId);

        dispatch(slice.actions.setProviderById(response?.data));

        return response?.data;
      } catch (err) {
        console.error(err);
      }
    },
  requestVPNPermission: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const organisationId = authRedux.getters.selectedOrganisationId(rootState);
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      await providerApis.requestVPNPermission(organisationId, providerId, projectId, payload);

      toast.success("Submitted Request for VPN Permission!");
    } catch (err) {
      console.error(err);
    }
  },
  availableProviders: (payload) => async (dispatch) => {
    try {
      const response = await providerApis.availableProviders(payload);

      dispatch(slice.actions.setAvailableProviders(response?.data));
    } catch (err) {
      console.error(err);
    }
  },
};

export const getters = {
  providers(rootState) {
    const state = rootState[name];
    return state.providers;
  },
  enabledServices(rootState) {
    const state = rootState[name];
    return state.enabledServices;
  },
  availableProviders(rootState) {
    const state = rootState[name];
    return state.availableProviders;
  },
  providerById(rootState) {
    const state = rootState[name];
    return state.providerById;
  },
};

export default {
  actions,
  slice,
  getters,
};
