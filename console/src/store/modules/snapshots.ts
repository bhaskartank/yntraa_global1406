import { createSlice } from "@reduxjs/toolkit";
import isEmpty from "lodash/isEmpty";
import { toast } from "react-toastify";

import snapshotApis from "api/snapshots";

import { apiHeaderTotalCount } from "utils";

import authRedux, { THE_GREAT_RESET } from "./auth";
import socketsRedux from "./sockets";

const name = "snapshots";

const initialState = {
  snapshots: { list: [], totalRecords: 0 },
  computeSnapshots: { list: [], totalRecords: 0 },
  volumeSnapshots: { list: [], totalRecords: 0 },
};

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    setSnapshots(state, { payload }) {
      state.snapshots = payload;
    },
    setComputeSnapshots(state, { payload }) {
      state.computeSnapshots = payload;
    },
    setVolumeSnapshots(state, { payload }) {
      state.volumeSnapshots = payload;
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
  snapshots: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      const response = await snapshotApis.snapshots(providerId, projectId, payload);

      dispatch(slice.actions.setSnapshots({ list: response?.data, totalRecords: apiHeaderTotalCount(response?.headers) }));
    } catch (err) {
      console.error(err);
    }
  },
  computeSnapshots:
    ({ computeId, payload = {} }) =>
    async (dispatch, getState) => {
      try {
        const rootState = getState();
        const providerId = authRedux.getters.selectedProviderId(rootState);
        const projectId = authRedux.getters.selectedProjectId(rootState);

        const response = await snapshotApis.computeSnapshots(providerId, projectId, computeId, payload);

        dispatch(slice.actions.setComputeSnapshots({ list: response?.data, totalRecords: apiHeaderTotalCount(response?.headers) }));
      } catch (err) {
        console.error(err);
      }
    },
  volumeSnapshots: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      const response = await snapshotApis.volumeSnapshots(providerId, projectId, payload);

      dispatch(slice.actions.setVolumeSnapshots({ list: response?.data, totalRecords: apiHeaderTotalCount(response?.headers) }));
    } catch (err) {
      console.error(err);
    }
  },
  deleteComputeSnapshot:
    (payload, handleRefreshList = null) =>
    async (dispatch, getState) => {
      try {
        const rootState = getState();
        const providerId = authRedux.getters.selectedProviderId(rootState);
        const projectId = authRedux.getters.selectedProjectId(rootState);
        const snapshotId = payload?.snapshotId;

        const response = await snapshotApis.deleteComputeSnapshot(providerId, projectId, snapshotId, payload);

        toast.success("Deleting Compute Snapshot");

        if (payload?.computeId) {
          dispatch(
            socketsRedux.actions.executeSocketStatus({
              taskId: response?.data?.task_id,
              callback: () => (handleRefreshList ? handleRefreshList() : dispatch(actions.computeSnapshots({ computeId: payload?.computeId }))),
              successMsg: "Compute Snapshot Deleted Successfully",
            }),
          );
        } else {
          dispatch(
            socketsRedux.actions.executeSocketStatus({
              taskId: response?.data?.task_id,
              callback: () => (handleRefreshList ? handleRefreshList() : dispatch(actions.snapshots({ page: 0, offset: 0 }))),
              successMsg: "Compute Snapshot Deleted Successfully",
            }),
          );
        }
      } catch (err) {
        console.error(err);
      }
    },
  deleteVolumeSnapshot: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);
      const snapshotId = payload?.snapshotId;

      await snapshotApis.deleteVolumeSnapshot(providerId, projectId, snapshotId, payload);

      toast.success("Deleted Volume Snapshot");
    } catch (err) {
      console.error(err);
    }
  },
  convertToImage: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);
      const snapshotId = payload?.snapshotId;

      await snapshotApis.convertToImage(providerId, projectId, snapshotId);

      toast.success("Creating image from snapshot");
    } catch (err) {
      console.error(err);
    }
  },
  revertFromImage: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);
      const snapshotId = payload?.snapshotId;

      await snapshotApis.revertFromImage(providerId, projectId, snapshotId);

      toast.success("Reverting Image to Snapshot");
    } catch (err) {
      console.error(err);
    }
  },
  updateSnapshotStatus:
    ({ snapshotId }) =>
    async (dispatch, getState) => {
      try {
        const rootState = getState();
        const providerId = authRedux.getters.selectedProviderId(rootState);

        const response = await snapshotApis.updateSnapshotStatus(providerId, snapshotId);

        if (!isEmpty(response?.data)) {
          const snapshots = getters.computeSnapshots(rootState);

          if (snapshots?.length) {
            const modifiedList = snapshots.map((snapshot) => {
              if (snapshot?.id === response?.data?.id) return response?.data;
              else return snapshot;
            });

            dispatch(slice.actions.setComputeSnapshots(modifiedList));
          }
        }

        toast.success("Snapshot Status Updated Successfully");
      } catch (err) {
        console.error(err);
      }
    },
};

export const getters = {
  snapshots(rootState) {
    const state = rootState[name];
    return state.snapshots;
  },
  computeSnapshots(rootState) {
    const state = rootState[name];
    return state.computeSnapshots;
  },
  volumeSnapshots(rootState) {
    const state = rootState[name];
    return state.volumeSnapshots;
  },
};

export default {
  slice,
  actions,
  getters,
};
