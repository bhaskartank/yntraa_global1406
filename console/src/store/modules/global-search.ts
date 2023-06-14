import { createSlice } from "@reduxjs/toolkit";

import { THE_GREAT_RESET } from "./auth";

export const name = "globalSearch";

const initialState = { open: false };

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
};

export const getters = {
  open(rootState) {
    const state = rootState[name];
    return state.open;
  },
};

export default {
  slice,
  actions,
  getters,
};
