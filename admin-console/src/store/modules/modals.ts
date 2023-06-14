import { createSlice } from "@reduxjs/toolkit";

import { GLOBAL_RESET } from "./auth";

const name = "modals";
const initialState = {
  resourceOwnerDetail: null,
  certificateDetail: null,
  sslCertificateById: null,
  vmDetailByLbBackend: null,
};

const slice = createSlice({
  name,
  initialState,
  reducers: {
    setResourceOwnerDetail(state, { payload }) {
      state.resourceOwnerDetail = payload;
    },
    setCertificateDetail(state, { payload }) {
      state.certificateDetail = payload;
    },
    setSslCertificateById(state, { payload }) {
      state.sslCertificateById = payload;
    },
    setVmDetailByLbBackend(state, { payload }) {
      state.vmDetailByLbBackend = payload;
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
  resourceOwnerDetail: (payload) => (dispatch) => {
    dispatch(slice.actions.setResourceOwnerDetail(payload));
  },
  certificateDetail: (payload) => (dispatch) => {
    dispatch(slice.actions.setCertificateDetail(payload));
  },
  sslCertificateById: (payload) => (dispatch) => {
    dispatch(slice.actions.setSslCertificateById(payload));
  },
  vmDetailByLbBackend: (payload) => (dispatch) => {
    dispatch(slice.actions.setVmDetailByLbBackend(payload));
  },
};

const getters = {
  resourceOwnerDetail(rootState) {
    const state = rootState[name];
    return state.resourceOwnerDetail;
  },
  certificateDetail(rootState) {
    const state = rootState[name];
    return state.certificateDetail;
  },
  sslCertificateById(rootState) {
    const state = rootState[name];
    return state.sslCertificateById;
  },
  vmDetailByLbBackend(rootState) {
    const state = rootState[name];
    return state.vmDetailByLbBackend;
  },
};

export default {
  actions,
  getters,
  slice,
};
