import { createSlice } from "@reduxjs/toolkit";
import isEmpty from "lodash/isEmpty";
import { toast } from "react-toastify";

import computeApis from "api/computes";
import snapshotApis from "api/snapshots";

import { apiHeaderTotalCount } from "utils";

import authRedux, { THE_GREAT_RESET } from "./auth";
import loaderRedux from "./loader";
import snapshotsRedux from "./snapshots";
import socketsRedux from "./sockets";

const name = "virtualMachines";

const initialState = {
  virtualMachines: { list: [], totalRecords: 0 },
  virtualMachineById: null,
  consoleLogs: null,
  consoleURL: null,
  snapshots: [],
  computeIPs: [],
};

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    setVirtualMachines(state, { payload }) {
      state.virtualMachines = payload;
    },
    setVirtualMachineById(state, { payload }) {
      state.virtualMachineById = payload;
    },
    setConsoleLogs(state, { payload }) {
      state.consoleLogs = payload;
    },
    setConsoleURL(state, { payload }) {
      state.consoleURL = payload;
    },
    setSnapshots(state, { payload }) {
      state.snapshots = payload;
    },
    setComputeIPs(state, { payload }) {
      state.computeIPs = payload;
    },
    updateOne(state, { payload: compute }) {
      if (!isEmpty(compute)) {
        const currentVirtualMachines = state.virtualMachines?.list;

        if (currentVirtualMachines?.length) {
          const modifiedVMList = currentVirtualMachines?.map((vm) => {
            if (vm?.id === compute?.id) return compute;
            else return vm;
          });

          state.virtualMachines.list = modifiedVMList;
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
  virtualMachines: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      const modifiedPayload = { instance_type: "vm", status: "Active", ...payload };

      const response = await computeApis.virtualMachines(providerId, projectId, modifiedPayload);

      dispatch(slice.actions.setVirtualMachines({ list: response?.data, totalRecords: apiHeaderTotalCount(response?.headers) }));
    } catch (err) {
      console.error(err);
    }
  },
  computeById:
    (payload, showLoader = false) =>
    async (dispatch, getState) => {
      if (showLoader) dispatch(loaderRedux.actions.addMessage({ type: "virtual-machine-details", msg: `Fetching Virtual Machine Details!` }));

      const rootState = getState();
      const computeId = Number.parseInt(payload.compute_id);

      // dispatch(loaderRedux.actions.addMessage({ type: 'virtual-machine-details', msg: 'Fetching Virtual Machine Details!' }));
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      // return your ajax request as promise
      return computeApis
        .virtualMachineById(providerId, projectId, computeId)
        .then((vm) => {
          dispatch(slice.actions.updateOne(vm));
          return vm;
        })
        .finally(() => {
          if (showLoader) dispatch(loaderRedux.actions.removeMessage({ type: "virtual-machine-details" }));
        });
    },
  virtualMachineById: (virtualMachineId) => async (dispatch, getState) => {
    try {
      const rootState = getState();

      dispatch(loaderRedux.actions.addMessage({ type: "virtual-machine-details", msg: `Fetching Virtual Machines Details!` }));

      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      const response = await computeApis.virtualMachineById(providerId, projectId, virtualMachineId);

      dispatch(slice.actions.setVirtualMachineById(response?.data));
    } catch (err) {
      console.error(err);
    }

    dispatch(loaderRedux.actions.removeMessage({ type: "virtual-machine-details" }));
  },
  stopVirtualMachine: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);
      const computeId = payload?.compute_id;

      await computeApis.performAction(providerId, projectId, computeId, "stop");

      toast.success("Stopping Virtual Machine");

      dispatch(actions.virtualMachineById(computeId))
        .then((compute) => {
          dispatch(
            socketsRedux.actions.executeSocketStatus({
              taskId: compute?.task_id,
              callback: () => dispatch(actions.virtualMachineById(computeId)),
              successMsg: "Virtual Machine Stopped Successfully",
            }),
          );
        })
        .catch((err) => console.error(err));
    } catch (err) {
      console.error(err);
    }
  },
  startVirtualMachine: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);
      const computeId = payload?.compute_id;

      await computeApis.performAction(providerId, projectId, computeId, "start");

      toast.success("Starting Virtual Machine");

      dispatch(actions.virtualMachineById(computeId))
        .then((compute) => {
          dispatch(
            socketsRedux.actions.executeSocketStatus({
              taskId: compute?.task_id,
              callback: () => dispatch(actions.virtualMachineById(computeId)),
              successMsg: "Virtual Machine Started Successfully",
            }),
          );
        })
        .catch((err) => console.error(err));
    } catch (err) {
      console.error(err);
    }
  },
  pauseVirtualMachine: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      const computeId = payload?.compute_id;

      await computeApis.performAction(providerId, projectId, computeId, "pause");

      toast.success("Pausing Virtual Machine");

      dispatch(actions.virtualMachineById(computeId))
        .then((compute) => {
          dispatch(
            socketsRedux.actions.executeSocketStatus({
              taskId: compute?.task_id,
              callback: () => dispatch(actions.virtualMachineById(computeId)),
              successMsg: "Virtual Machine Paused Successfully",
            }),
          );
        })
        .catch((err) => console.error(err));
    } catch (err) {
      console.error(err);
    }
  },
  unpauseVirtualMachine: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      const computeId = payload?.compute_id;

      await computeApis.performAction(providerId, projectId, computeId, "unpause");

      toast.success("Unpausing Virtual Machine");

      dispatch(actions.virtualMachineById(computeId))
        .then((compute) => {
          dispatch(
            socketsRedux.actions.executeSocketStatus({
              taskId: compute?.task_id,
              callback: () => dispatch(actions.virtualMachineById(computeId)),
              successMsg: "Virtual Machine Unpaused Successfully",
            }),
          );
        })
        .catch((err) => console.error(err));
    } catch (err) {
      console.error(err);
    }
    // dispatch(loaderRedux.actions.addMessage({ type: "virtual-machine-unpause", msg: `Unpausing Virtual Machine!` }));
  },
  rebuildVirtualMachine: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      const computeId = payload?.compute_id;

      await computeApis.performAction(providerId, projectId, computeId, "rebuild");

      toast.success("Rebuilding Virtual Machine");

      dispatch(actions.virtualMachineById(computeId))
        .then((compute) => {
          dispatch(
            socketsRedux.actions.executeSocketStatus({
              taskId: compute?.task_id,
              callback: () => dispatch(actions.virtualMachineById(computeId)),
              successMsg: "Virtual Machine Rebuilt Successfully",
            }),
          );
        })
        .catch((err) => console.error(err));
    } catch (err) {
      console.error(err);
    }
  },
  restartVirtualMachine: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      const computeId = payload?.compute_id;

      await computeApis.performAction(providerId, projectId, computeId, "reboot");

      toast.success("Restarting Virtual Machine");

      dispatch(actions.virtualMachineById(computeId))
        .then((compute) => {
          dispatch(
            socketsRedux.actions.executeSocketStatus({
              taskId: compute?.task_id,
              callback: () => dispatch(actions.virtualMachineById(computeId)),
              successMsg: "Virtual Machine Restarted Successfully",
            }),
          );
        })
        .catch((err) => console.error(err));
    } catch (err) {
      console.error(err);
    }
  },
  hardRestartVirtualMachine: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      const computeId = payload?.compute_id;

      await computeApis.performAction(providerId, projectId, computeId, "hard_reboot");

      toast.success("Restarting (Hard) Virtual Machine");

      dispatch(actions.virtualMachineById(computeId))
        .then((compute) => {
          dispatch(
            socketsRedux.actions.executeSocketStatus({
              taskId: compute?.task_id,
              callback: () => dispatch(actions.virtualMachineById(computeId)),
              successMsg: "Virtual Machine Hard Restarted Successfully",
            }),
          );
        })
        .catch((err) => console.error(err));
    } catch (err) {
      console.error(err);
    }
  },
  confirmVirtualMachineResize: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      const computeId = payload?.compute_id;

      await computeApis.performAction(providerId, projectId, computeId, "confirm_server_resize");

      toast.success("Confirming Resize of Virtual Machine");

      dispatch(actions.virtualMachineById(computeId))
        .then((compute) => {
          dispatch(
            socketsRedux.actions.executeSocketStatus({
              taskId: compute?.task_id,
              callback: () => dispatch(actions.virtualMachineById(computeId)),
              successMsg: "Virtual Machine Resize Confirmed Successfully",
            }),
          );
        })
        .catch((err) => console.error(err));
    } catch (err) {
      console.error(err);
    }
  },
  revertVirtualMachineResize: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      const computeId = payload?.compute_id;

      await computeApis.performAction(providerId, projectId, computeId, "revert_server_resize");

      toast.success("Confirming Revert Resize of Virtual Machine");

      dispatch(actions.virtualMachineById(computeId))
        .then((compute) => {
          dispatch(
            socketsRedux.actions.executeSocketStatus({
              taskId: compute?.task_id,
              callback: () => dispatch(actions.virtualMachineById(computeId)),
              successMsg: "Virtual Machine Resize Reverted Successfully",
            }),
          );
        })
        .catch((err) => console.error(err));
    } catch (err) {
      console.error(err);
    }
  },
  resizeVirtualMachine: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      const computeId = payload?.computeId;
      const flavorId = payload?.flavorId;

      await computeApis.resizeComputes(providerId, projectId, computeId, flavorId);

      toast.success("Resizing Virtual Machine");

      dispatch(actions.virtualMachineById(computeId))
        .then((compute) => {
          dispatch(
            socketsRedux.actions.executeSocketStatus({
              taskId: compute?.task_id,
              callback: () => dispatch(actions.virtualMachineById(computeId)),
              successMsg: "Virtual Machine Resized Successfully",
            }),
          );
        })
        .catch((err) => console.error(err));
    } catch (err) {
      console.error(err);
    }
  },
  createVirtualMachine: (payload) => async (dispatch, getState) => {
    dispatch(loaderRedux.actions.addMessage({ type: "virtual-machine-create", msg: `Creating Virtual Machine!` }));

    try {
      const rootState = getState();
      const provider_id = authRedux.getters.selectedProviderId(rootState);
      const project_id = authRedux.getters.selectedProjectId(rootState);

      const modifiedPayload = { ...payload, provider_id, project_id };

      const response = await computeApis.createVirtualMachine(modifiedPayload);

      toast.success("Creating Virtual Machine");

      dispatch(
        socketsRedux.actions.executeSocketStatus({
          taskId: response?.data?.task_id,
          callback: () => dispatch(actions.virtualMachineById({ compute_id: response?.data?.id })),
          successMsg: "Virtual Machine Created Successfully",
        }),
      );
    } catch (err) {
      console.error(err);
    }

    dispatch(loaderRedux.actions.removeMessage({ type: "virtual-machine-create" }));
  },
  deleteVirtualMachine: (payload, handleRefreshList) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      const computeId = payload?.compute_id;

      await computeApis.deleteVirtualMachine(providerId, projectId, computeId);

      toast.success("Deleting Virtual Machine");

      dispatch(actions.virtualMachineById(computeId))
        .then((response) => {
          dispatch(
            socketsRedux.actions.executeSocketStatus({
              taskId: response?.data?.task_id,
              callback: handleRefreshList,
              successMsg: "Virtual Machine Deleted Successfully",
            }),
          );
        })
        .catch((err) => console.error(err));
    } catch (err) {
      console.error(err);
    }
  },
  consoleLogs: (virtualMachineId) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      const response = await computeApis.consoleLogs(providerId, projectId, virtualMachineId);

      dispatch(slice.actions.setConsoleLogs(response?.data));
    } catch (err) {
      console.error(err);
    }
  },
  consoleURL: (virtualMachineId) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      const response = await computeApis.consoleURL(providerId, projectId, virtualMachineId);

      dispatch(slice.actions.setConsoleURL(response?.data));
    } catch (err) {
      console.error(err);
    }
  },
  snapshots:
    ({ computeId }) =>
    async (dispatch, getState) => {
      try {
        const rootState = getState();
        const providerId = authRedux.getters.selectedProviderId(rootState);
        const projectId = authRedux.getters.selectedProjectId(rootState);

        const response = await snapshotApis.snapshots(providerId, projectId, computeId);

        dispatch(slice.actions.setSnapshots(response?.data));
      } catch (err) {
        console.error(err);
      }
    },
  createSnapshot:
    ({ computeId, snapshotName }) =>
    async (dispatch, getState) => {
      try {
        const rootState = getState();
        const providerId = authRedux.getters.selectedProviderId(rootState);
        const projectId = authRedux.getters.selectedProjectId(rootState);

        const payload = {
          provider_id: providerId,
          project_id: projectId,
          compute_id: computeId,
          snapshot_name: snapshotName,
        };

        const response = await snapshotApis.createSnapshot(providerId, projectId, computeId, payload);

        toast.success("Creating Snapshot");

        dispatch(
          socketsRedux.actions.executeSocketStatus({
            taskId: response?.data?.task_id,
            callback: () => dispatch(snapshotsRedux.actions.computeSnapshots({ computeId })),
            successMsg: "Snapshot Created Successfully",
          }),
        );
      } catch (err) {
        console.error(err);
      }
    },
  searchVirtualMachines: (payload) => async (dispatch, getState) => {
    dispatch(loaderRedux.actions.addMessage({ type: "virtual-machine-search", msg: `Searching Virtual Machines!` }));

    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      const response = await computeApis.searchVirtualMachines(providerId, projectId, payload);

      dispatch(slice.actions.setVirtualMachines({ list: response?.data, totalRecords: apiHeaderTotalCount(response?.headers) }));
    } catch (err) {
      console.error(err);
    }
  },
  attachSecurityGroup:
    ({ computeId, securityGroupId }) =>
    async (dispatch, getState) => {
      dispatch(loaderRedux.actions.addMessage({ type: "virtual-machine-attach-security-group", msg: `Attaching Security Group to Virtual Machine!` }));

      try {
        const rootState = getState();
        const providerId = authRedux.getters.selectedProviderId(rootState);
        const projectId = authRedux.getters.selectedProjectId(rootState);

        await computeApis.attachSecurityGroup(providerId, projectId, computeId, securityGroupId);
        toast.success("Attached Security Group to Virtual Machine");
      } catch (err) {
        console.error(err);
      }
      dispatch(loaderRedux.actions.removeMessage({ type: "virtual-machine-attach-security-group" }));
    },
  detachSecurityGroup:
    ({ computeId, securityGroupId }) =>
    async (dispatch, getState) => {
      dispatch(
        loaderRedux.actions.addMessage({
          type: "virtual-machine-detach-security-group",
          msg: `Detaching Security Group from Virtual Machine!`,
        }),
      );
      try {
        const rootState = getState();
        const providerId = authRedux.getters.selectedProviderId(rootState);
        const projectId = authRedux.getters.selectedProjectId(rootState);

        await computeApis.detachSecurityGroup(providerId, projectId, computeId, securityGroupId);

        toast.success("Detaching Security Group from Virtual Machine");

        dispatch(actions.virtualMachineById(computeId))
          .then((compute) => {
            dispatch(
              socketsRedux.actions.executeSocketStatus({
                taskId: compute?.task_id,
                callback: () => dispatch(actions.virtualMachineById(computeId)),
                successMsg: "Security Group Detached Successfully",
              }),
            );
          })
          .catch((err) => console.error(err));
      } catch (err) {
        console.error(err);
      }
      dispatch(loaderRedux.actions.removeMessage({ type: "virtual-machine-detach-security-group" }));
    },
  computeIPs: (computeId) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      const response = await computeApis.computeIPs(providerId, projectId, computeId);

      dispatch(slice.actions.setComputeIPs(response?.data));
    } catch (err) {
      console.error(err);
    }
  },
  currentStatus:
    ({ computeId, terminate_task }) =>
    async (dispatch, getState) => {
      try {
        const rootState = getState();
        const projectId = authRedux.getters.selectedProjectId(rootState);

        const response = await computeApis.currentStatus(projectId, computeId, terminate_task);

        toast.success("Virtual Machine Status Updated Successfully");

        dispatch(slice.actions.updateOne(response?.data));
      } catch (err) {
        console.error(err);
      }
    },
};

export const getters = {
  virtualMachines(rootState) {
    const state = rootState[name];
    return state.virtualMachines;
  },
  virtualMachineById(rootState) {
    const state = rootState[name];
    return state.virtualMachineById;
  },
  consoleLogs(rootState) {
    const state = rootState[name];
    return state.consoleLogs;
  },
  consoleURL(rootState) {
    const state = rootState[name];
    return state.consoleURL;
  },
};

export default {
  actions,
  slice,
  getters,
};
