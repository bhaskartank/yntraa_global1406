import { createSlice } from "@reduxjs/toolkit";

import routerApis from "api/routers";

import { THE_GREAT_RESET } from "./auth";

const name = "routers";
const initialState = {
  routers: [],
  routerById: null,
};

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    setRouters(state, { payload }) {
      state.routers = payload;
    },
    setRouterById(state, { payload }) {
      state.routerById = payload;
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
  routers:
    ({ providerId, projectId }) =>
    async (dispatch) => {
      try {
        const response = await routerApis.routers(providerId, projectId);

        dispatch(slice.actions.setRouters(response?.data));
      } catch (err) {
        console.error(err);
      }
    },
  routerById:
    ({ providerId, projectId, routerId }) =>
    async (dispatch) => {
      try {
        const response = await routerApis.routerById(providerId, projectId, routerId);

        dispatch(slice.actions.setRouterById(response?.data));
      } catch (err) {
        console.error(err);
      }
    },
};

export const getters = {
  routers(rootState) {
    const state = rootState[name];
    return state.routers;
  },
  routerById(rootState) {
    const state = rootState[name];
    return state.routerById;
  },
};

export default {
  slice,
  actions,
  getters,
};
