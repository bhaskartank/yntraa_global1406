import { createSlice } from "@reduxjs/toolkit";
import reportsApi from "observability/api/reports";
import { toast } from "react-toastify";

import loaderRedux from "store/modules/loader";

import { apiHeaderTotalCount } from "utilities";

import { GLOBAL_RESET } from "./auth";

const name = "reports";
const initialState = { resourceUtilization: { list: null, totalRecords: 0 }, weeklyReport: { list: null, totalRecords: 0 } };

const slice = createSlice({
  name,
  initialState,
  reducers: {
    setResourceUtilization(state, { payload }) {
      state.resourceUtilization = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setWeeklyReport(state, { payload }) {
      state.weeklyReport = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    reset(state) {
      state.resourceUtilization = initialState.resourceUtilization;
      state.weeklyReport = initialState.weeklyReport;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(GLOBAL_RESET, () => {
      return initialState;
    });
  },
});

export const { reducer } = slice;

export const actions = {
  reset: () => (dispatch) => {
    dispatch(slice.actions.reset());
    return Promise.resolve();
  },
  resourceUtilization:
    (providerId, queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-resource-utilization", msg: "Loading Resource Utilized!" }));

      return reportsApi
        .resourceUtilization(providerId, queryParams)
        .then((response) => {
          dispatch(slice.actions.setResourceUtilization(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-resource-utilization" }));
        });
    },
  exportResourceUtilization: (providerId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-resource-utilization", msg: "Exporting Resource Utilized List!" }));

    return reportsApi
      .resourceUtilization(providerId)
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-resource-utilization" }));
      });
  },
  weeklyReport: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-weekly-report", msg: "Loading Weekly Report!" }));

    return reportsApi
      .weeklyReport(payload)
      .then((response) => {
        dispatch(slice.actions.setWeeklyReport(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-weekly-report" }));
      });
  },
  exportWeeklyReport: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-weekly-report", msg: "Exporting Weekly Report List!" }));

    return reportsApi
      .weeklyReport(payload)
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-weekly-report" }));
      });
  },
  availableDates: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-available-dates", msg: "Loading Available Dates!" }));

    return reportsApi
      .availableDates(payload)
      .then((response) => {
        return response.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-available-dates" }));
      });
  },
  generateResourceReport: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "generate-resource-report", msg: "Generating Resource Report!" }));

    return reportsApi
      .generateResourceReport(payload)
      .then(() => {
        toast.success("Resource Report Generated Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "generate-resource-report" }));
      });
  },
};

const getters = {
  resourceUtilization(rootState) {
    const state = rootState[name];
    return state.resourceUtilization;
  },
  weeklyReport(rootState) {
    const state = rootState[name];
    return state.weeklyReport;
  },
};

export default {
  actions,
  getters,
  slice,
};
