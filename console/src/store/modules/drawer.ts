import { createSlice } from "@reduxjs/toolkit";

import { THE_GREAT_RESET } from "./auth";

export const name = "drawer";

const initialState = { open: false, fixed: true };

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    setOpen(state) {
      state.open = true;
    },
    setClose(state) {
      state.open = false;
    },
    setFix(state) {
      state.fixed = true;
    },
    setUnfix(state) {
      state.fixed = false;
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
  open: () => async (dispatch) => {
    dispatch(slice.actions.setOpen());
    return Promise.resolve();
  },
  close: () => async (dispatch) => {
    dispatch(slice.actions.setClose());
    return Promise.resolve();
  },
  fix: () => async (dispatch) => {
    dispatch(slice.actions.setFix());
    return Promise.resolve();
  },
  unfix: () => async (dispatch) => {
    dispatch(slice.actions.setUnfix());
    return Promise.resolve();
  },
};

export const getters = {
  open(rootState) {
    const state = rootState[name];
    return state.open || state.fixed;
  },
  fixed(rootState) {
    const state = rootState[name];
    return state.fixed;
  },
};

export default {
  slice,
  actions,
  getters,
};
