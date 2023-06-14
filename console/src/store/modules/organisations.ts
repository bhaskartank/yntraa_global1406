import { createSlice } from "@reduxjs/toolkit";
import find from "lodash/find";
import some from "lodash/some";

import { store } from "store";

import organisationApis from "api/organisations";

import authRedux, { THE_GREAT_RESET } from "./auth";

const name = "organisations";
const initialState = {
  organisations: [],
  organisationById: null,
  availabilityZones: [],
};

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    setOrganisationById(state, { payload }) {
      state.organisationById = payload;
    },
    setOrganisations(state, { payload }) {
      state.organisations = payload;
    },
    setAvailabilityZones(state, { payload }) {
      state.availabilityZones = payload;
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
  organisationById:
    ({ organisationId }) =>
    async (dispatch) => {
      try {
        const response = await organisationApis.organisationById(organisationId);

        dispatch(slice.actions.setOrganisationById(response?.data));

        return response?.data;
      } catch (err) {
        console.error(err);
      }
    },
  availabilityZones: () => async (dispatch, getState) => {
    try {
      const rootState = getState();

      const providerId = authRedux.getters.selectedProviderId(rootState);
      const organisationId = authRedux.getters.selectedOrganisationId(rootState);

      const response = await organisationApis.availabilityZones(organisationId, providerId);

      dispatch(slice.actions.setAvailabilityZones(response?.data));
    } catch (err) {
      console.error(err);
    }
  },
};

export const getters = {
  organisations(rootState) {
    const state = rootState[name];
    return state.organisations;
  },
  organisationById(rootState) {
    // const state = store.getState()[name];
    const state = rootState[name];
    return (organisationId) => {
      if (some(state?.organisations, { id: organisationId })) {
        return Promise.resolve(find(state?.organisations, { id: organisationId }));
      } else {
        // trigger update and cache the result
        // return store.cache.dispatch('organisations/ ', { 'organisationId': organisationId })
        return store.dispatch(actions.organisationById({ organisationId }));
      }
    };
  },
  availabilityZones(rootState) {
    const state = rootState[name];
    return state.availabilityZones;
  },
};

export default {
  slice,
  actions,
  getters,
};
