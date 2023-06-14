import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

export const name = "loader";

const initialState = {
  message: [],
};
export const getters = {
  isLoading(rootState) {
    const state = rootState[name];
    return !(state?.message?.length === 0);
  },
  loadingMsg(rootState) {
    const state = rootState[name];
    if (state?.message?.length !== 0) {
      return state?.message[0]["msg"] || "";
    }
    return "";
  },
};

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    ADD_MESSAGE(state, { payload: details }) {
      const msg = {};
      msg["type"] = details["type"];
      msg["msg"] = details["msg"];
      msg["ts"] = moment().unix();
      const copymessage = [...state.message];
      copymessage.push(msg);
      copymessage.sort((a, b) => a.ts - b.ts);
      state.message = copymessage;
    },

    REMOVE_MESSAGE(state, { payload: details }) {
      const type = details["type"];
      state.message = state.message.filter(function (el) {
        return el.type !== type;
      });
    },
    RESET(state) {
      state.message = [];
    },
  },
});

export const { reducer } = slice;

export const actions = {
  addMessage: (details) => async (dispatch) => {
    // addMessage (context, details) {
    dispatch(slice.actions.ADD_MESSAGE(details));
    return Promise.resolve();
  },

  removeMessage: (details) => async (dispatch) => {
    dispatch(slice.actions.REMOVE_MESSAGE(details));
    return Promise.resolve();
  },
};

export default {
  slice,
  actions,
  getters,
};
