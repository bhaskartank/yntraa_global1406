import { createSlice } from "@reduxjs/toolkit";

import invoiceApis from "api/invoices";

import { apiHeaderTotalCount } from "utils";

import authRedux, { THE_GREAT_RESET } from "./auth";

const name = "invoices";
const initialState = {
  invoices: { list: [], totalRecords: 0 },
  invoiceById: null,
  isInvoiceEnabled: false,
};

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    setInvoices(state, { payload }) {
      state.invoices = payload;
    },
    setInvoiceById(state, { payload }) {
      state.invoiceById = payload;
    },
    setIsInvoiceEnabled(state, { payload }) {
      state.isInvoiceEnabled = payload;
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
  invoices: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const organisationId = authRedux.getters.selectedOrganisationId(rootState);

      const response = await invoiceApis.invoices(organisationId, payload);

      dispatch(slice.actions.setInvoices({ list: response?.data, totalRecords: apiHeaderTotalCount(response?.headers) }));
    } catch (err) {
      console.error(err);
    }
  },
  invoiceById:
    ({ invoiceId, projectId = null, providerId = null }) =>
    async (dispatch, getState) => {
      try {
        const rootState = getState();
        const organisationId = authRedux.getters.selectedOrganisationId(rootState);

        const response = await invoiceApis.invoiceById({ invoice_id: invoiceId, organisation_id: organisationId, projectId, providerId });

        dispatch(slice.actions.setInvoiceById(response?.data));
      } catch (err) {
        console.error(err);
      }
    },
  downloadInvoice:
    ({ invoiceId }) =>
    async (dispatch, getState) => {
      try {
        const rootState = getState();
        const organisationId = authRedux.getters.selectedOrganisationId(rootState);

        const response = await invoiceApis.downloadInvoice({ invoice_id: invoiceId, organisation_id: organisationId });

        window.open(URL.createObjectURL(response.data), "_blank");
      } catch (err) {
        console.error(err);
      }
    },
  isInvoiceEnabled: () => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const organisationId = authRedux.getters.selectedOrganisationId(rootState);

      const response = await invoiceApis.isInvoiceEnabled({ organisation_id: organisationId });

      dispatch(slice.actions.setIsInvoiceEnabled(response?.data?.isInvoiceEnabled));
    } catch (err) {
      console.error(err);
    }
  },
};

export const getters = {
  invoices(rootState) {
    const state = rootState[name];
    return state.invoices;
  },
  invoiceById(rootState) {
    const state = rootState[name];
    return state.invoiceById;
  },
  isInvoiceEnabled(rootState) {
    const state = rootState[name];
    return state.isInvoiceEnabled;
  },
};

export default {
  slice,
  actions,
  getters,
};
