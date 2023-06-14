import { createSlice } from "@reduxjs/toolkit";

import flavorApis from "api/flavors";

import { apiHeaderTotalCount } from "utils";

import authRedux, { THE_GREAT_RESET } from "./auth";

const name = "flavors";

const initialState = {
  flavors: { list: [], totalRecords: 0 },
};

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    setFlavors(state, { payload }) {
      state.flavors = payload;
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
  flavors: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const organisationId = authRedux.getters.selectedOrganisationId(rootState);

      const response = await flavorApis.flavors(providerId, {
        organisation_id: organisationId,
        is_public: payload?.isPublic,
        ...payload,
      });

      dispatch(slice.actions.setFlavors({ list: response?.data, totalRecords: apiHeaderTotalCount(response?.headers) }));
    } catch (err) {
      console.error(err);
    }
  },
};

export const getters = {
  flavors(rootState) {
    const state = rootState[name];
    return state.flavors;
  },
};

export default {
  slice,
  actions,
  getters,
};
