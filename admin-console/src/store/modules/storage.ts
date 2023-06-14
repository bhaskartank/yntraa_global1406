import { createSlice } from "@reduxjs/toolkit";
import StorageApi from "observability/api/storage";

import loaderRedux from "store/modules/loader";
import modalRedux from "store/modules/modals";

import { apiHeaderTotalCount } from "utilities";
import { formatDate } from "utilities/comp";

import { GLOBAL_RESET } from "./auth";

const name = "storage";
const initialState = { blockStorage: { list: null, totalRecords: 0 }, volumeSnapshots: { list: null, totalRecords: 0 }, computes: { list: [], totalRecords: 0 } };

const slice = createSlice({
  name,
  initialState,
  reducers: {
    setBlockStorage(state, { payload }) {
      state.blockStorage = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setVolumeSnapshots(state, { payload }) {
      state.volumeSnapshots = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setComputes(state, { payload }) {
      state.computes = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
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
  blockStorage:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-block-storage", msg: "Loading Block Storage!" }));

      return StorageApi.blockStorage(queryParams)
        .then((response) => {
          dispatch(slice.actions.setBlockStorage(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-block-storage" }));
        });
    },
  exportBlockStorage: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-block-storage", msg: "Exporting Block Storage List!" }));

    return StorageApi.blockStorage()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-block-storage" }));
      });
  },
  volumeSnapshots:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-volume-snapshots", msg: "Loading Volume Snapshots!" }));

      return StorageApi.volumeSnapshots(queryParams)
        .then((response) => {
          dispatch(slice.actions.setVolumeSnapshots(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-volume-snapshots" }));
        });
    },
  exportVolumeSnapshots: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-volume-snapshots", msg: "Exporting Volume Snapshot List!" }));

    return StorageApi.volumeSnapshots()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-volume-snapshots" }));
      });
  },
  computes: (pathParams, queryParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "get-computes", msg: "Loading Computes!" }));

    return StorageApi.computes(pathParams, queryParams)
      .then((response) => {
        dispatch(slice.actions.setComputes(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "get-computes" }));
      });
  },
  exportComputes: (pathParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-attached-computes", msg: "Exporting Attached Computes!" }));

    return StorageApi.computes(pathParams, {})
      .then((response) => {
        return response.data?.list;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-attached-computes" }));
      });
  },
  computeVolumeSnapshotsOwnerDetails: (pathParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "get-volume-snapshots-owner-details", msg: "Loading Volume Snapshots Owner Details!" }));
    return StorageApi.computeVolumeSnapshotsOwnerDetails(pathParams)
      .then((response) => {
        const modifiedRes = {
          ...response.data,
          resource_details: {
            Name: response?.data?.resource_details?.snapshot_name,
            Status: response?.data?.resource_details?.status,
            Created: formatDate(response?.data?.resource_details?.created, false, true),
          },
        };
        dispatch(modalRedux.actions.resourceOwnerDetail(modifiedRes));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "get-volume-snapshots-owner-details" }));
      });
  },

  fetchBlockStorageOwnerDetail: (pathParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "get-volume-owner-details", msg: "Loading Volume Owner Details!" }));
    return StorageApi.fetchBlockStorageOwnerDetail(pathParams)
      .then((response) => {
        const modifiedRes = {
          ...response.data,
          resource_details: {
            Name: response?.data?.resource_details?.volume_name,
            Status: response?.data?.resource_details?.status,
            Created: formatDate(response?.data?.resource_details?.created, false, true),
          },
        };
        dispatch(modalRedux.actions.resourceOwnerDetail(modifiedRes));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "get-volume-owner-details" }));
      });
  },
};

const getters = {
  blockStorage(rootState) {
    const state = rootState[name];
    return state.blockStorage;
  },
  volumeSnapshots(rootState) {
    const state = rootState[name];
    return state.volumeSnapshots;
  },
  computes(rootState) {
    const state = rootState[name];
    return state.computes;
  },
};

export default {
  actions,
  getters,
  slice,
};
