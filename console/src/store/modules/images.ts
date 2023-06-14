import { createSlice } from "@reduxjs/toolkit";

import imageApis from "api/images";

import authRedux, { THE_GREAT_RESET } from "./auth";

const name = "images";
const initialState = {
  images: [],
};

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    setImages(state, { payload }) {
      state.images = payload;
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
  images:
    (queryParams = {}) =>
    async (dispatch, getState) => {
      try {
        const rootState = getState();
        const providerId = authRedux.getters.selectedProviderId(rootState);
        const organisationId = authRedux.getters.selectedOrganisationId(rootState);

        const response = await imageApis.images(providerId, { organisation_id: organisationId, ...queryParams });

        dispatch(slice.actions.setImages(response?.data));
      } catch (err) {
        console.error(err);
      }
    },
};

export const getters = {
  images(rootState) {
    const state = rootState[name];
    return state.images;
  },
};

export default {
  slice,
  actions,
  getters,
};
