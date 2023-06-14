import { createSlice } from "@reduxjs/toolkit";

import { GLOBAL_RESET } from "./auth";

export const name = "datalist";

const initialState = { configs: [], common: { rowsPerPage: 20 }, listToRefresh: { key: "", keepCurrentPage: true } };

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    addConfig(state, { payload }) {
      const currentConfigs = [...state.configs];
      let updatedConfigs = [];

      if (currentConfigs?.find((datalist) => datalist?.key === payload?.key)) {
        updatedConfigs = currentConfigs?.map((config) => (config?.key === payload?.key ? payload : config));
      } else {
        updatedConfigs = [...currentConfigs, payload];
      }

      state.configs = updatedConfigs;
    },
    setRowsPerPage(state, { payload }) {
      state.common.rowsPerPage = payload;
    },
    addListToRefresh(state, { payload }) {
      state.listToRefresh = payload;
    },
    removeListToRefresh(state) {
      state.listToRefresh = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(GLOBAL_RESET, () => {
      return initialState;
    });
  },
});

export const { reducer } = slice;

export const actions = {
  addConfig: (payload) => async (dispatch) => {
    dispatch(slice.actions.addConfig(payload));
    return Promise.resolve();
  },
  setRowsPerPage: (payload) => async (dispatch) => {
    dispatch(slice.actions.setRowsPerPage(payload));
    return Promise.resolve();
  },
  addListToRefresh:
    ({ key, keepCurrentPage = true }: { key: string; keepCurrentPage?: boolean }) =>
    async (dispatch) => {
      dispatch(slice.actions.addListToRefresh({ key, keepCurrentPage }));
      return Promise.resolve();
    },
  removeListToRefresh: () => async (dispatch) => {
    dispatch(slice.actions.removeListToRefresh());
    return Promise.resolve();
  },
};

export const getters = {
  configs(rootState) {
    const state = rootState[name];
    return state.configs;
  },
  configByKey(rootState, key = "") {
    const state = rootState[name];
    return state.configs?.find((config) => config?.key === key);
  },
  rowsPerPage(rootState) {
    const state = rootState[name];
    return state.common.rowsPerPage;
  },
  listToRefresh(rootState) {
    const state = rootState[name];
    return state.listToRefresh;
  },
};

export default {
  slice,
  actions,
  getters,
};
