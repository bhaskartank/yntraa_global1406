import { createSlice } from "@reduxjs/toolkit";
import isEmpty from "lodash/isEmpty";
import { toast } from "react-toastify";

import volumeApis from "api/volumes";

import { apiHeaderTotalCount } from "utils";

import authRedux, { THE_GREAT_RESET } from "./auth";
import socketsRedux from "./sockets";
import virtualMachinesRedux from "./virtual-machines";

const name = "volumes";

const initialState = {
  volumes: { list: [], totalRecords: 0 },
  volumeById: null,
  snapshots: { list: [], totalRecords: 0 },
  resourceAnnotations: [],
};

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    setVolumes(state, { payload }) {
      state.volumes = payload;
    },
    setVolumeById(state, { payload }) {
      state.volumeById = payload;
    },
    setSnapshots(state, { payload }) {
      state.snapshots = payload;
    },
    setResourceAnnotations(state, { payload }) {
      state.resourceAnnotations = payload;
    },
    updateOne(state, { payload: updatedVolume }) {
      if (!isEmpty(updatedVolume)) {
        const currentVolumeList = state?.volumes?.list;

        if (currentVolumeList?.length) {
          const modifiedVolumeList = currentVolumeList.map((currentVolume) => {
            if (currentVolume?.id === updatedVolume?.id) return updatedVolume;
            else return currentVolume;
          });

          state.volumes.list = modifiedVolumeList;
        }
      }
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
  volumes: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      const response = await volumeApis.volumes(providerId, projectId, payload);

      dispatch(slice.actions.setVolumes({ list: response?.data, totalRecords: apiHeaderTotalCount(response?.headers) }));
    } catch (err) {
      console.error(err);
    }
  },
  resourceAnnotations: () => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      const response = await volumeApis.resourceAnnotations(providerId, projectId);

      dispatch(slice.actions.setResourceAnnotations(response?.data));
    } catch (err) {
      console.error(err);
    }
  },
  volumeById: (volumeId) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      const response = await volumeApis.volumeById(providerId, projectId, volumeId);

      const computedVolume = {
        ...response?.data,
        compute: response?.data?.volume_attach_volume[0]?.compute_id
          ? await dispatch(virtualMachinesRedux.actions.computeById({ compute_id: response?.data?.volume_attach_volume[0]?.compute_id }))
          : null,
      };

      dispatch(slice.actions.updateOne(computedVolume));
      dispatch(slice.actions.setVolumeById(computedVolume));
    } catch (err) {
      console.error(err);
    }
  },
  createVolume: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      const response = await volumeApis.createVolume(providerId, projectId, payload);

      toast.success("Creating Disk");

      dispatch(
        socketsRedux.actions.executeSocketStatus({
          taskId: response?.data?.task_id,
          callback: () => dispatch(actions.volumeById(response?.data?.id)),
          successMsg: "Disk Created Successfully",
        }),
      );
    } catch (err) {
      console.error(err);
    }
  },
  deleteVolume:
    (payload, handleRefreshList = null) =>
    async (dispatch, getState) => {
      try {
        const rootState = getState();
        const providerId = authRedux.getters.selectedProviderId(rootState);
        const projectId = authRedux.getters.selectedProjectId(rootState);
        const volumeId = payload?.volume_id;

        await volumeApis.deleteVolume(providerId, projectId, volumeId, payload);

        toast.success("Deleting your Disk");

        dispatch(actions.volumeById(volumeId))
          .then((volume) => {
            dispatch(
              socketsRedux.actions.executeSocketStatus({
                taskId: volume?.task_id,
                callback: () => (handleRefreshList ? handleRefreshList() : dispatch(actions.volumeById(volumeId))),
                successMsg: "Deleted Disk Successfully",
              }),
            );
          })
          .catch((err) => console.error(err));
      } catch (err) {
        console.error(err);
      }
    },
  attachVolume: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);
      const volumeId = payload?.volume_id;

      await volumeApis.attachVolume(providerId, projectId, volumeId, payload);

      toast.success("Attaching your Disk");

      dispatch(actions.volumeById(volumeId))
        .then((response) => {
          dispatch(
            socketsRedux.actions.executeSocketStatus({
              taskId: response?.data?.task_id,
              callback: () => dispatch(actions.volumeById(volumeId)),
              successMsg: "Disk Attached Successfully",
            }),
          );
        })
        .catch((err) => console.error(err));
    } catch (err) {
      console.error(err);
    }
  },
  detachVolume:
    (payload, handleRefreshList = null) =>
    async (dispatch, getState) => {
      try {
        const rootState = getState();
        const providerId = authRedux.getters.selectedProviderId(rootState);
        const projectId = authRedux.getters.selectedProjectId(rootState);
        const volumeId = payload?.volume_id;

        await volumeApis.detachVolume(providerId, projectId, volumeId, payload);

        toast.success("Detaching your Disk");

        dispatch(actions.volumeById(volumeId))
          .then((response) => {
            dispatch(
              socketsRedux.actions.executeSocketStatus({
                taskId: response?.data?.task_id,
                callback: () => (handleRefreshList ? handleRefreshList() : dispatch(actions.volumeById(volumeId))),
                successMsg: "Disk Detached Successfully",
              }),
            );
          })
          .catch((err) => console.error(err));
      } catch (err) {
        console.error(err);
      }
    },
  createSnapshot: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);
      const volumeId = payload?.volume_id;

      await volumeApis.createSnapshot(providerId, projectId, volumeId, payload);

      toast.success("Creating Volume Snapshot");
    } catch (err) {
      console.error(err);
    }
  },
  snapshots: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);
      const volumeId = payload?.volume_id;

      const response = await volumeApis.snapshots(providerId, projectId, volumeId, payload);

      dispatch(slice.actions.setSnapshots(response?.data));
    } catch (err) {
      console.error(err);
    }
  },
};

export const getters = {
  volumes(rootState) {
    const state = rootState[name];
    return state.volumes;
  },
  volumeById(rootState) {
    const state = rootState[name];
    return state.volumeById;
  },
  snapshots(rootState) {
    const state = rootState[name];
    return state.snapshots;
  },
};

export default {
  slice,
  actions,
  getters,
};
