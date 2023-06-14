import { createSlice } from "@reduxjs/toolkit";

import securityGroupApis from "api/security-groups";

import { apiHeaderTotalCount } from "utils";

import authRedux, { THE_GREAT_RESET } from "./auth";

const name = "securityGroups";

const initialState = {
  securityGroups: { list: [], totalRecords: 0 },
  securityGroupRules: { list: [], totalRecords: 0 },
  securityGroupById: null,
  attachedResources: [],
};

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    setSecurityGroups(state, { payload }) {
      state.securityGroups = payload;
    },
    setSecurityGroupRules(state, { payload }) {
      state.securityGroupRules = payload;
    },
    setSecurityGroupById(state, { payload }) {
      state.securityGroupById = payload;
    },
    setAttachedResources(state, { payload }) {
      state.attachedResources = payload;
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
  securityGroups: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      const response = await securityGroupApis.securityGroups(providerId, projectId, payload);

      dispatch(slice.actions.setSecurityGroups({ list: response?.data, totalRecords: apiHeaderTotalCount(response?.headers) }));
    } catch (err) {
      console.error(err);
    }
  },
  securityGroupById: (securityGroupId) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      const response = await securityGroupApis.securityGroupById(providerId, projectId, securityGroupId);

      dispatch(slice.actions.setSecurityGroupById(response?.data));
    } catch (err) {
      console.error(err);
    }
  },
  createSecurityGroup: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      await securityGroupApis.createSecurityGroup(providerId, projectId, payload);
    } catch (err) {
      console.error(err);
    }
  },
  deleteSecurityGroup:
    ({ sgId }) =>
    async (dispatch, getState) => {
      try {
        const rootState = getState();
        const providerId = authRedux.getters.selectedProviderId(rootState);
        const projectId = authRedux.getters.selectedProjectId(rootState);

        await securityGroupApis.deleteSecurityGroup(providerId, projectId, sgId);
      } catch (err) {
        console.error(err);
      }
    },
  attachedResources: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      const response = await securityGroupApis.attachedResources(providerId, projectId, payload.securityGroupId);

      dispatch(slice.actions.setAttachedResources(response?.data));
    } catch (err) {
      console.error(err);
    }
  },
};

export const getters = {
  securityGroups(rootState) {
    const state = rootState[name];
    return state.securityGroups;
  },
  securityGroupById(rootState) {
    const state = rootState[name];
    return state.securityGroupById;
  },
  attachedResources(rootState) {
    const state = rootState[name];
    return state.attachedResources;
  },
};

export default {
  slice,
  actions,
  getters,
};
