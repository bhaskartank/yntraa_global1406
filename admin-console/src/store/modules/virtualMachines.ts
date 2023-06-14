import { createSlice } from "@reduxjs/toolkit";
import isEmpty from "lodash/isEmpty";
import virtualMachinesApi from "observability/api/virtualMachines";
import { toast } from "react-toastify";

import modalRedux from "store/modules/modals";

import { apiHeaderTotalCount } from "utilities";
import { formatDate } from "utilities/comp";

import { GLOBAL_RESET } from "./auth";
import loaderRedux from "./loader";

const name = "virtualMachines";
const initialState = {
  vmById: null,
  consoleUrl: null,
  consoleLogs: null,
  compute: { list: null, totalRecords: 0 },
  snapshots: { list: [], totalRecords: 0 },
  volumes: { list: [], totalRecords: 0 },
  networks: { list: [], totalRecords: 0 },
  securityGroups: { list: [], totalRecords: 0, providerId: null, projectId: null },
  securityGroupsRules: { list: null, totalRecords: 0 },
  eventLogs: { list: null, totalRecords: 0 },
  computeSnapshots: { list: [], totalRecords: 0 },
};

const slice = createSlice({
  name,
  initialState,
  reducers: {
    setVMDetail(state, { payload }) {
      state.vmById = payload;
    },
    setVMListData(state, { payload }) {
      state.compute = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setSnapshots(state, { payload }) {
      state.snapshots = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setVolumes(state, { payload }) {
      state.volumes = { list: payload.data?.volume_attach_compute || [], totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setNetworks(state, { payload }) {
      state.networks = { list: payload.data?.compute_network_mapping || [], totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setSecurityGroups(state, { payload }) {
      state.securityGroups = {
        list: payload.data?.compute_security_group_mapping || [],
        totalRecords: apiHeaderTotalCount(payload.headers),
        providerId: payload.data?.provider_id,
        projectId: payload.data?.project_id,
      };
    },
    setSecurityGroupRules(state, { payload }) {
      state.securityGroupsRules = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setEventLogs(state, { payload }) {
      state.eventLogs = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setConsoleUrl(state, { payload }) {
      state.consoleUrl = payload;
    },
    setConsoleLogs(state, { payload }) {
      state.consoleLogs = payload;
    },
    setComputeSnapshots(state, { payload }) {
      state.computeSnapshots = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },

    updateOne(state, { payload: compute }) {
      if (!isEmpty(compute)) {
        const currentVirtualMachines = state?.compute?.list?.data;

        if (currentVirtualMachines?.length) {
          const modifiedVMList = currentVirtualMachines.map((vm) => {
            if (vm?.id === compute?.id) return compute;
            else return vm;
          });

          state.compute.list.data = modifiedVMList;
        }
      }
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
  vmList: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-filtered-vm", msg: "Loading Virtual Machines!" }));

    return virtualMachinesApi
      .vmList(payload)
      .then((response) => {
        dispatch(slice.actions.setVMListData(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-filtered-vm" }));
      });
  },
  vmListExport: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "export-vm-list", msg: "Exporting VM List!" }));

    return virtualMachinesApi
      .vmList({})
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "export-vm-list" }));
      });
  },
  vmById: (pathParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "get-vm-by-id", msg: "Loading VM Details!" }));

    return virtualMachinesApi
      .vmById(pathParams)
      .then((response) => {
        dispatch(slice.actions.setVMDetail(response.data));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "get-vm-by-id" }));
      });
  },
  consoleUrl: (pathParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "get-console-url", msg: "Loading Console URL!" }));

    return virtualMachinesApi
      .consoleUrl(pathParams)
      .then((response) => {
        dispatch(slice.actions.setConsoleUrl(response.data));
        return response.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "get-console-url" }));
      });
  },
  consoleLogs: (pathParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "get-console-logs", msg: "Loading Console Logs!" }));

    return virtualMachinesApi
      .consoleLogs(pathParams)
      .then((response) => {
        dispatch(slice.actions.setConsoleLogs(response.data));
        return response.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "get-console-logs" }));
      });
  },
  markErrorInVm: (pathParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "mark-error-in-vm", msg: "Marking Error in VM!" }));

    return virtualMachinesApi
      .markErrorInVM(pathParams)
      .then(() => {
        dispatch(actions.vmById(pathParams));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "mark-error-in-vm" }));
      });
  },
  eventLogs: (pathParams, queryParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "compute-event-logs", msg: "Loading Event Logs!" }));

    return virtualMachinesApi
      .eventLogs(pathParams, queryParams)
      .then((response) => {
        dispatch(slice.actions.setEventLogs(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "compute-event-logs" }));
      });
  },
  exportEventLogs: (pathParams, queryParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "export-compute-event-logs", msg: "Exporting Event Log List!" }));

    return virtualMachinesApi
      .eventLogs(pathParams, queryParams)
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "export-compute-event-logs" }));
      });
  },
  currentStatus: (pathParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "get-current-status", msg: "Loading VM Current Status!" }));

    return virtualMachinesApi
      .currentStatus(pathParams)
      .then((response) => {
        toast.success("Fetch Current Status Successfully!");

        dispatch(slice.actions.updateOne(response.data));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "get-current-status" }));
      });
  },
  snapshots: (pathParams, queryParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "get-snapshots", msg: "Loading Snapshots!" }));

    return virtualMachinesApi
      .snapshots(pathParams, queryParams)
      .then((response) => {
        dispatch(slice.actions.setSnapshots(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "get-snapshots" }));
      });
  },
  exportSnapshots: (pathParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-attached-snapshots", msg: "Exporting Attached Snapshots List!" }));

    return virtualMachinesApi
      .snapshots(pathParams, {})
      .then((response) => {
        return response.data?.list;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-attached-snapshots" }));
      });
  },
  volumes: (pathParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "get-volumes", msg: "Loading Volumes!" }));

    return virtualMachinesApi
      .volumes(pathParams)
      .then((response) => {
        dispatch(slice.actions.setVolumes(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "get-volumes" }));
      });
  },
  exportVolumes: (pathParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-attached-volumes", msg: "Exporting Attached Volumes List!" }));

    return virtualMachinesApi
      .volumes(pathParams)
      .then((response) => {
        return response.data?.volume_attach_compute;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-attached-volumes" }));
      });
  },
  networks: (pathParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "get-networks", msg: "Loading Networks!" }));

    return virtualMachinesApi
      .networks(pathParams)
      .then((response) => {
        dispatch(slice.actions.setNetworks(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "get-networks" }));
      });
  },
  exportNetworks: (pathParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-attached-networks", msg: "Exporting Attached Networks List!" }));

    return virtualMachinesApi
      .networks(pathParams)
      .then((response) => {
        return response.data?.compute_network_mapping;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-attached-networks" }));
      });
  },
  securityGroups: (pathParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "get-security-groups", msg: "Loading Security Groups!" }));

    return virtualMachinesApi
      .securityGroups(pathParams)
      .then((response) => {
        dispatch(slice.actions.setSecurityGroups(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "get-security-groups" }));
      });
  },
  exportSecurityGroups: (pathParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-attached-security-groups", msg: "Exporting Attached Security Groups List!" }));

    return virtualMachinesApi
      .securityGroups(pathParams)
      .then((response) => {
        return response.data?.compute_security_group_mapping;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-attached-security-groups" }));
      });
  },
  securityGroupRules:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-sg-rules", msg: "Loading Security Group Rules!" }));

      return virtualMachinesApi
        .securityGroupRules(queryParams)
        .then((response) => {
          dispatch(slice.actions.setSecurityGroupRules(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-sg-rules" }));
        });
    },
  exportSecurityGroupRules:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "exporting-security-group-rules", msg: "Exporting Security Group Rules List!" }));

      return virtualMachinesApi
        .securityGroupRules(queryParams)
        .then((response) => {
          return response.data?.data;
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "exporting-security-group-rules" }));
        });
    },
  computeSnapshots:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-compute-snapshots", msg: "Loading Compute Snapshots!" }));

      return virtualMachinesApi
        .computeSnapshots(queryParams)
        .then((response) => {
          dispatch(slice.actions.setComputeSnapshots(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-compute-snapshots" }));
        });
    },
  exportComputeSnapshots: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-compute-snapshots", msg: "Exporting Compute Snapshots List!" }));

    return virtualMachinesApi
      .computeSnapshots()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-compute-snapshots" }));
      });
  },
  computeOwnerDetails: (pathParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "get-owner-details", msg: "Loading Owner Details!" }));
    return virtualMachinesApi
      .computeOwnerDetails(pathParams)
      .then((response) => {
        const modifiedRes = {
          ...response.data,
          resource_details: { "Availability Zone": response?.data?.resource_details?.availability_zone, Flavor: response?.data?.resource_details?.flavor?.name },
        };
        dispatch(modalRedux.actions.resourceOwnerDetail(modifiedRes));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "get-owner-details" }));
      });
  },
  computeSnapshotsOwnerDetails: (pathParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "get-snapshot-owner-details", msg: "Loading Snapshot Owner Details!" }));
    return virtualMachinesApi
      .computeSnapshotsOwnerDetails(pathParams)
      .then((response) => {
        const modifiedRes = {
          ...response.data,
          resource_details: {
            Name: response?.data?.resource_details?.compute?.instance_name,
            Status: response?.data?.resource_details?.status,
            Created: formatDate(response?.data?.resource_details?.created, false, true),
          },
        };
        dispatch(modalRedux.actions.resourceOwnerDetail(modifiedRes));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "get-snapshot-owner-details" }));
      });
  },
  updateSnapshotStatus: (providerId, snapshotId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "update-snapshot-status", msg: "Updating Snapshot Status!" }));

    return virtualMachinesApi
      .updateSnapshotStatus(providerId, snapshotId)
      .then(() => {
        toast.success("Snapshot Status Updated Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "update-snapshot-status" }));
      });
  },
};

const getters = {
  vmById(rootState) {
    const state = rootState[name];
    return state.vmById;
  },
  compute(rootState) {
    const state = rootState[name];
    return state.compute;
  },
  snapshots(rootState) {
    const state = rootState[name];
    return state.snapshots;
  },
  volumes(rootState) {
    const state = rootState[name];
    return state.volumes;
  },
  networks(rootState) {
    const state = rootState[name];
    return state.networks;
  },
  securityGroups(rootState) {
    const state = rootState[name];
    return state.securityGroups;
  },
  securityGroupsRules(rootState) {
    const state = rootState[name];
    return state.securityGroupsRules;
  },
  eventLogs(rootState) {
    const state = rootState[name];
    return state.eventLogs;
  },
  consoleUrl(rootState) {
    const state = rootState[name];
    return state.consoleUrl;
  },
  consoleLogs(rootState) {
    const state = rootState[name];
    return state.consoleLogs;
  },
  computeSnapshots(rootState) {
    const state = rootState[name];
    return state.computeSnapshots;
  },
};

export default {
  actions,
  getters,
  slice,
};
