import { createSlice } from "@reduxjs/toolkit";
import ScalingGroupsApi from "observability/api/scalingGroups";

import loaderRedux from "store/modules/loader";
import modalRedux from "store/modules/modals";

import { apiHeaderTotalCount } from "utilities";
import { formatDate } from "utilities/comp";

import { GLOBAL_RESET } from "./auth";

const name = "scalingGroups";
const initialState = { scalingGroups: { list: null, totalRecords: 0 } };

const slice = createSlice({
  name,
  initialState,
  reducers: {
    setScalingGroups(state, { payload }) {
      state.scalingGroups = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
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
  scalingGroups: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-scaling-groups", msg: "Loading Scaling Groups!" }));

    return ScalingGroupsApi.scalingGroups(payload)
      .then((response) => {
        dispatch(slice.actions.setScalingGroups(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-scaling-groups" }));
      });
  },
  exportScalingGroups: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-scaling-groups", msg: "Exporting Scaling Group List!" }));

    return ScalingGroupsApi.scalingGroups()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-scaling-groups" }));
      });
  },
  computeScalingOwnerDetails: (pathParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "get-scaling-owner-details", msg: "Loading Scaling Owner Details!" }));
    return ScalingGroupsApi.computeScalingOwnerDetails(pathParams)
      .then((response) => {
        const modifiedRes = {
          ...response.data,
          resource_details: {
            Name: response?.data?.resource_details?.name,
            Status: response?.data?.resource_details?.status,
            Created: formatDate(response?.data?.resource_details?.created, false, true),
          },
        };
        dispatch(modalRedux.actions.resourceOwnerDetail(modifiedRes));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "get-scaling-owner-details" }));
      });
  },
};

const getters = {
  scalingGroups(rootState) {
    const state = rootState[name];
    return state.scalingGroups;
  },
};

export default {
  actions,
  getters,
  slice,
};
