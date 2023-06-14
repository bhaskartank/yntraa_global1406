import { createSlice } from "@reduxjs/toolkit";

import { GLOBAL_RESET } from "./auth";

const name = "securityGroups";
const initialState = { securityGroups: [], totalSecurityGroupsRecords: 0 };

const slice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(GLOBAL_RESET, () => {
      return initialState;
    });
  },
});

export const { reducer } = slice;

export const actions = {};

const getters = {};

export default {
  actions,
  getters,
  slice,
};
