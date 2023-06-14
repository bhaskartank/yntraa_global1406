import { createSlice } from "@reduxjs/toolkit";

import resourceMetricsApis from "api/resource-metrics";

import authRedux, { THE_GREAT_RESET } from "./auth";

const name = "resourceMetrics";
const initialState = {};

export const slice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(THE_GREAT_RESET, () => {
      return initialState;
    });
  },
});

export const { reducer } = slice;

export const actions = {
  usageGraph: (payload) => async (dispatch, getState) => {
    // dispatch(loaderRedux.actions.addMessage({ type: "resource-metrices-graphs", msg: "Fetching Resource Metrices Graphs!" }));

    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      const response = await resourceMetricsApis.usageGraph(providerId, projectId, payload?.computeId, payload);

      return response?.data;
    } catch (err) {
      console.error(err);
    }

    // dispatch(loaderRedux.actions.removeMessage({ type: "resource-metrices-graphs" }));
  },
  resourceMetrics: (payload) => async (dispatch, getState) => {
    // dispatch(loaderRedux.actions.addMessage({ type: "resource-metrices-labels", msg: "Fetching Resource Metrices Labels!" }));

    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);

      const response = await resourceMetricsApis.resourceMetrics(providerId, payload);

      return response?.data;
    } catch (err) {
      console.error(err);
    }

    // dispatch(loaderRedux.actions.removeMessage({ type: "resource-metrices-labels" }));
  },
};

export const getters = {};

export default {
  slice,
  actions,
  getters,
};
