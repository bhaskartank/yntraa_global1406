import { createSlice } from "@reduxjs/toolkit";

import { THE_GREAT_RESET } from "./auth";

interface Confirmation {
  title: string;
  description: string;
  onConfirm: () => void;
  confirmBtnText?: string;
  cancelBtnText?: string;
}

const name = "modal";
const initialState = {
  isOpen: false,
  title: "",
  description: "",
  onConfirm: () => null,
  confirmBtnText: "Yes",
  cancelBtnText: "Cancel",
};

const slice = createSlice({
  name,
  initialState,
  reducers: {
    setOpen(state, { payload }) {
      state.isOpen = true;
      state.title = payload?.title;
      state.description = payload?.description;
      state.onConfirm = payload?.onConfirm;
      state.confirmBtnText = payload?.confirmBtnText || state.confirmBtnText;
      state.cancelBtnText = payload?.cancelBtnText || state.cancelBtnText;
    },
    setClose(state) {
      state.isOpen = false;
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
  open: (payload: Confirmation) => (dispatch) => {
    dispatch(slice.actions.setOpen(payload));
  },
  close: () => (dispatch) => {
    dispatch(slice.actions.setClose());
  },
};

const getters = {
  modalDetails(rootState) {
    return rootState[name];
  },
};

export default {
  actions,
  getters,
  slice,
};
