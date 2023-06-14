import { createSlice } from "@reduxjs/toolkit";

import backupApis from "api/backups";

import { apiHeaderTotalCount } from "utils";

import authRedux, { THE_GREAT_RESET } from "./auth";

const name = "backups";

const initialState = {
  backupServices: { list: [], totalRecords: 0 },
  backups: { list: [], totalRecords: 0 },
  attachedBackups: { list: [], totalRecords: 0 },
  backupIP: null,
};

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    setBackupServices(state, { payload }) {
      state.backupServices = payload;
    },
    setBackups(state, { payload }) {
      state.backups = payload;
    },
    setAttachedBackups(state, { payload }) {
      state.attachedBackups = payload;
    },
    setBackupIP(state, { payload }) {
      state.backupIP = payload;
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
  backupServices:
    ({ computeId }) =>
    async (dispatch, getState) => {
      try {
        const rootState = getState();
        const providerId = authRedux.getters.selectedProviderId(rootState);
        const projectId = authRedux.getters.selectedProjectId(rootState);

        const response = await backupApis.backupServices(providerId, projectId, computeId);

        dispatch(slice.actions.setBackupServices({ list: response?.data, totalRecords: apiHeaderTotalCount(response?.headers) }));
      } catch (err) {
        console.error(err);
      }
    },
  backupIP:
    ({ computeId }) =>
    async (dispatch, getState) => {
      try {
        const rootState = getState();
        const providerId = authRedux.getters.selectedProviderId(rootState);
        const projectId = authRedux.getters.selectedProjectId(rootState);

        const response = await backupApis.backupIP(providerId, projectId, computeId);

        dispatch(slice.actions.setBackupIP(response?.data));
      } catch (err) {
        console.error(err);
      }
    },
  backups: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      const backupServiceId = payload?.backupServiceId;
      delete payload[backupServiceId];

      const response = await backupApis.backups(providerId, projectId, backupServiceId, payload);

      dispatch(slice.actions.setBackups({ list: response?.data, totalRecords: apiHeaderTotalCount(response?.headers) }));
    } catch (err) {
      console.error(err);
    }
  },
  createBackupService:
    ({ computeId, backupFolderLocation }) =>
    async (dispatch, getState) => {
      try {
        const rootState = getState();
        const providerId = authRedux.getters.selectedProviderId(rootState);
        const projectId = authRedux.getters.selectedProjectId(rootState);
        const payload = {
          compute_id: computeId,
          backup_file_location: backupFolderLocation,
          provider_id: providerId,
          project_id: projectId,
        };

        await backupApis.createBackupService(providerId, projectId, payload);
      } catch (err) {
        console.error(err);
      }
    },
  attachedBackups: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      const response = await backupApis.attachedBackups(providerId, projectId, payload);

      dispatch(slice.actions.setAttachedBackups({ list: response?.data, totalRecords: apiHeaderTotalCount(response?.headers) }));
    } catch (err) {
      console.error(err);
    }
  },
};

export const getters = {
  backupServices(rootState) {
    const state = rootState[name];
    return state.backupServices;
  },
  backups(rootState) {
    const state = rootState[name];
    return state.backups;
  },
  attachedBackups(rootState) {
    const state = rootState[name];
    return state.attachedBackups;
  },
  backupIP(rootState) {
    const state = rootState[name];
    return state.backupIP;
  },
};

export default {
  slice,
  actions,
  getters,
};
