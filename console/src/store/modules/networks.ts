import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import networkApis from "api/networks";

import { apiHeaderTotalCount } from "utils";

import authRedux, { THE_GREAT_RESET } from "./auth";

const name = "networks";
const initialState = {
  networks: { list: [], totalRecords: 0 },
  networkById: null,
};

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    setNetworks(state, { payload }) {
      state.networks = payload;
    },
    setNetworkById(state, { payload }) {
      state.networkById = payload;
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
  networks: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      const response = await networkApis.networks(providerId, projectId, payload);

      dispatch(slice.actions.setNetworks({ list: response?.data, totalRecords: apiHeaderTotalCount(response?.headers) }));
    } catch (err) {
      console.error(err);
    }
  },
  createNetwork: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      await networkApis.createNetwork(providerId, projectId, payload);

      toast.success("Network Created Successfully");
    } catch (err) {
      console.error(err);
    }
  },
  createSubNetwork:
    ({ payload }) =>
    async (dispatch, getState) => {
      try {
        const rootState = getState();
        const providerId = authRedux.getters.selectedProviderId(rootState);
        const projectId = authRedux.getters.selectedProjectId(rootState);
        const networkId = payload?.network_id;

        await networkApis.createSubNetwork(providerId, projectId, networkId, payload);

        toast.success("Sub Network Created Successfully");
      } catch (err) {
        console.error(err);
      }
    },
  networkById: (networkId) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      const response = await networkApis.networkById(providerId, projectId, networkId);

      dispatch(slice.actions.setNetworkById(response?.data));
    } catch (err) {
      console.error(err);
    }
  },
  deleteSubNetwork: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);
      const networkId = payload?.networkId;
      const subnetId = payload?.subnetId;

      await networkApis.deleteSubNetwork(providerId, projectId, networkId, subnetId);

      toast.success("Sub Network Deleted Successfully");
    } catch (err) {
      console.error(err);
    }
  },
  deleteNetwork: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);
      const networkId = payload?.networkId;

      await networkApis.deleteNetwork(providerId, projectId, networkId);

      toast.success("Network Deleted Successfully");
    } catch (err) {
      console.error(err);
    }
  },
  attachNetwork: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);
      const computeId = payload?.compute_id;

      await networkApis.attachNetwork(providerId, projectId, computeId, payload);

      toast.success("Network Attached Successfully");
    } catch (err) {
      console.error(err);
    }
  },
  detachNetwork: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);
      const computeId = payload?.compute_id;
      const networkId = payload?.network_id;

      await networkApis.detachNetwork(providerId, projectId, computeId, networkId, payload);

      toast.success("Network Detached Successfully");
    } catch (err) {
      console.error(err);
    }
  },
};

export const getters = {
  networks(rootState) {
    const state = rootState[name];
    return state.networks;
  },
  networkById(rootState) {
    const state = rootState[name];
    return state.networkById;
  },
};

export default {
  slice,
  actions,
  getters,
};
