import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import roleApis from "api/user-roles";

import { apiHeaderTotalCount } from "utils";

import authRedux, { THE_GREAT_RESET } from "./auth";

const name = "userRoles";

const initialState = {
  userRoles: { list: [], totalRecords: 0 },
};

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    setUserRoles(state, { payload }) {
      state.userRoles = payload;
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
  userRoles: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const organisationId = authRedux.getters.selectedOrganisationId(rootState);

      const response = await roleApis.userRoles(organisationId, payload);

      dispatch(slice.actions.setUserRoles({ list: response?.data, totalRecords: apiHeaderTotalCount(response?.headers) }));
    } catch (err) {
      console.error(err);
    }
  },
  createRole:
    ({ payload }) =>
    async () => {
      try {
        await roleApis.createRole(payload);

        toast.success("User Role Created Successfully");
      } catch (err) {
        console.error(err);
      }
    },
};

export const getters = {
  userRoles(rootState) {
    const state = rootState[name];
    return state.userRoles;
  },
};

export default {
  slice,
  actions,
  getters,
};
