import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import floatingIPApis from "api/floating-ips";

import { apiHeaderTotalCount } from "utils";

import authRedux, { THE_GREAT_RESET } from "./auth";

const name = "floatingIP";

const initialState = {
  floatingIPs: { list: [], totalRecords: 0 },
};

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    setFloatingIPs(state, { payload }) {
      state.floatingIPs = payload;
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
  floatingIPs: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      const response = await floatingIPApis.floatingIPs(providerId, projectId, payload);

      dispatch(slice.actions.setFloatingIPs({ list: response?.data, totalRecords: apiHeaderTotalCount(response?.headers) }));
    } catch (err) {
      console.error(err);
    }
  },
  createFloatingIP: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      await floatingIPApis.createFloatingIP(providerId, projectId, payload.networkId, payload);

      toast.success("Floating IP Created Successfully");
    } catch (err) {
      console.error(err);
    }
  },
  releaseFloatingIP: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      await floatingIPApis.releaseFloatingIP(providerId, projectId, payload.reserveFloatingIpId);

      toast.success("Floating IP Released Successfully");
    } catch (err) {
      console.error(err);
    }
  },
};

export const getters = {
  floatingIPs(rootState) {
    const state = rootState[name];
    return state.floatingIPs;
  },
};

export default {
  slice,
  actions,
  getters,
};
