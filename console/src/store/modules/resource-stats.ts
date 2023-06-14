import { createSlice } from "@reduxjs/toolkit";

import resourceStatApis from "api/resource-stats";

import authRedux, { THE_GREAT_RESET } from "./auth";

const name = "resourceStats";

const initialState = {
  stats: null,
  resourceStatsList: null,
};

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    setStats(state, { payload: stats }) {
      state.stats = stats;
    },
    setResourceStatsList(state, { payload: stats }) {
      state.resourceStatsList = stats;
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
  stats: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const organisationId = authRedux.getters.selectedOrganisationId(rootState);

      const response = await resourceStatApis.stats(organisationId, providerId, { ...payload, organisationId, providerId });

      dispatch(slice.actions.setStats(response?.data));
      dispatch(slice.actions.setResourceStatsList(Object.entries(response.data?.action_log[0]?.resource_action_log)));
    } catch (err) {
      console.error(err);
    }
  },
};

export const getters = {
  stats(rootState) {
    const state = rootState[name];
    return state.stats;
  },
  resourceStatsList(rootState) {
    const state = rootState[name];
    return state.resourceStatsList;
  },
};

export default {
  slice,
  actions,
  getters,
};
