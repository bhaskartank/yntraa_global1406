import { createSlice } from "@reduxjs/toolkit";

import userApis from "api/users";

import { THE_GREAT_RESET } from "./auth";

const name = "users";

const initialState = {
  users: { list: [], totalRecords: 0 },
  userById: null,
};

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    setUsers(state, { payload }) {
      state.users = payload;
    },
    setUserById(state, { payload }) {
      state.userById = payload;
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
  users: (payload) => async (dispatch) => {
    try {
      const response = await userApis.users(payload);

      dispatch(slice.actions.setUsers({ list: response?.data, totalRecords: 0 }));
    } catch (err) {
      console.error(err);
    }
  },
  userById:
    ({ userId }) =>
    async (dispatch) => {
      try {
        const response = await userApis.userById(userId);

        dispatch(slice.actions.setUserById(response?.data));
      } catch (err) {
        console.error(err);
      }
    },
};

export const getters = {
  users(rootState) {
    const state = rootState[name];
    return state.users;
  },
  userById(rootState) {
    const state = rootState[name];
    return state.userById;
  },
};

export default {
  slice,
  actions,
  getters,
};
