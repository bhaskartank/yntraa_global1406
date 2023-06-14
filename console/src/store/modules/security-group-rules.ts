import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import securityGroupApis from "api/security-groups";

import { apiHeaderTotalCount } from "utils";

import authRedux, { THE_GREAT_RESET } from "./auth";

const name = "securityGroupRules";

const initialState = {
  securityGroupRules: { list: [], totalRecords: 0 },
};

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    setSecurityGroupRules(state, { payload }) {
      state.securityGroupRules = payload;
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
  securityGroupRules:
    (securityGroupId, payload = {}) =>
    async (dispatch, getState) => {
      try {
        const rootState = getState();
        const providerId = authRedux.getters.selectedProviderId(rootState);
        const projectId = authRedux.getters.selectedProjectId(rootState);

        const response = await securityGroupApis.securityGroupRules(providerId, projectId, securityGroupId, payload);

        dispatch(slice.actions.setSecurityGroupRules({ list: response?.data, totalRecords: apiHeaderTotalCount(response?.headers) }));
      } catch (err) {
        console.error(err);
      }
    },
  deleteSecurityGroupRule:
    ({ providerId, projectId, securityGroupId, securityGroupRuleId }: any) =>
    async (dispatch, getState) => {
      try {
        const rootState = getState();
        if (!providerId) {
          providerId = authRedux.getters.selectedProviderId(rootState);
        }
        if (!projectId) {
          projectId = authRedux.getters.selectedProjectId(rootState);
        }

        await securityGroupApis.deleteSecurityGroupRule(providerId, projectId, securityGroupId, securityGroupRuleId);
      } catch (err) {
        console.error(err);
      }
    },
  createSecurityGroupRule: (securityGroupId, payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      await securityGroupApis.createSecurityGroupRule(providerId, projectId, securityGroupId, payload);

      toast.success("Security Group Rule created successfully");
    } catch (err) {
      console.error(err);
    }
  },
};

export const getters = {
  securityGroupRules(rootState) {
    const state = rootState[name];
    return state.securityGroupRules;
  },
};

export default {
  slice,
  actions,
  getters,
};
