import { createSlice } from "@reduxjs/toolkit";

import auditApis from "api/audit-trails";

import { apiHeaderTotalCount } from "utils";

import authRedux from "./auth";

const name = "audit";

const initialState = {
  auditTrails: { list: [], totalRecords: 0 },
  accessLogs: { list: [], totalRecords: 0 },
  resourceTypes: [],
};

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    setAuditTrails(state, { payload }) {
      state.auditTrails = payload;
    },
    setAccessLogs(state, { payload }) {
      state.accessLogs = payload;
    },
    setResourceTypes(state, { payload }) {
      state.resourceTypes = payload;
    },
  },
});

export const { reducer } = slice;

export const actions = {
  auditTrails: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const selectedDomainDetails = authRedux.getters.selectedDomainDetails(rootState);

      const modifiedPayload = {
        ...payload,
        provider_id: selectedDomainDetails?.provider?.id,
        project_id: selectedDomainDetails?.project?.id,
        organisation_id: selectedDomainDetails?.organisation?.id,
      };

      const response = await auditApis.auditTrails(modifiedPayload);

      dispatch(slice.actions.setAuditTrails({ list: response?.data, totalRecords: apiHeaderTotalCount(response.headers) }));
    } catch (err) {
      console.error(err);
    }
  },
  accessLogs: (payload) => async (dispatch) => {
    try {
      const response = await auditApis.accessLogs(payload?.userId, payload);

      dispatch(slice.actions.setAccessLogs({ list: response?.data, totalRecords: apiHeaderTotalCount(response.headers) }));
    } catch (err) {
      console.error(err);
    }
  },
  resourceTypes: () => async (dispatch) => {
    try {
      const response = await auditApis.resourceTypes();
      dispatch(slice.actions.setResourceTypes(response?.data));
    } catch (err) {
      console.error(err);
    }
  },
  objectStorageAuditTrails: (payload) => async (dispatch) => {
    try {
      const response = await auditApis.objectStorageAuditTrails(payload);

      dispatch(slice.actions.setAuditTrails({ list: response?.data, totalRecords: apiHeaderTotalCount(response.headers) }));
    } catch (err) {
      console.error(err);
    }
  },
};

export const getters = {
  auditTrails(rootState) {
    const state = rootState[name];
    return state.auditTrails;
  },
  accessLogs(rootState) {
    const state = rootState[name];
    return state.accessLogs;
  },
  resourceTypes(rootState) {
    const state = rootState[name];
    return state.resourceTypes;
  },
};

export default {
  slice,
  actions,
  getters,
};
