import { createSlice } from "@reduxjs/toolkit";
import backupApi from "observability/api/backup";
import { toast } from "react-toastify";

import loaderRedux from "store/modules/loader";
import modalRedux from "store/modules/modals";

import { apiHeaderTotalCount } from "utilities";
import { formatDate } from "utilities/comp";

import authRedux, { GLOBAL_RESET } from "./auth";

const name = "backups";
const initialState = {
  backups: { list: null, totalRecords: 0 },
  protectionGroups: { list: null, totalRecords: 0 },
  backupPublicIp: { list: null, totalRecords: 0 },
  backupPublicIpUpdate: { list: null, totalRecords: 0 },
};

const slice = createSlice({
  name,
  initialState,
  reducers: {
    setBackups(state, { payload }) {
      state.backups = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setProtectionGroups(state, { payload }) {
      state.protectionGroups = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setbackupPublicIp(state, { payload }) {
      state.backupPublicIp = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setbackupPublicIpUpdate(state, { payload }) {
      state.backupPublicIpUpdate = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
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
  backups: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-backup", msg: "Loading Backups!" }));

    return backupApi
      .backup(payload)
      .then((response) => {
        dispatch(slice.actions.setBackups(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-backup" }));
      });
  },
  exportBackups: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-backup", msg: "Exporting Backup List!" }));

    return backupApi
      .backup()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-backup" }));
      });
  },
  protectionGroups: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-protection-groups", msg: "Loading Protection Groups!" }));

    return backupApi
      .protectionGroups(payload)
      .then((response) => {
        dispatch(slice.actions.setProtectionGroups(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-protection-groups" }));
      });
  },
  exportprotectionGroups: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-protection-groups", msg: "Exporting Protection Groups List!" }));

    return backupApi
      .protectionGroups()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-protection-groups" }));
      });
  },
  backupPublicIp: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-backup-PublicIp-Update", msg: "Loading Public IP Request!" }));

    return backupApi
      .backupPublicIp(payload)
      .then((response) => {
        dispatch(slice.actions.setbackupPublicIp(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-backup-PublicIp-Update" }));
      });
  },
  exportbackupPublicIp: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-backup-PublicIp-Update", msg: "Exporting Public IP Request!" }));

    return backupApi
      .backupPublicIp()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-backup-PublicIp-Update" }));
      });
  },

  backupPublicIpUpdate: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-backup-PublicIp-Update", msg: "Loading Public IP Request!" }));

    return backupApi
      .backupPublicIpUpdate(payload)
      .then((response) => {
        dispatch(slice.actions.setbackupPublicIpUpdate(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-backup-PublicIp-Update" }));
      });
  },
  exportbackupPublicIpUpdate: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-backup-PublicIp-Update", msg: "Exporting Public IP Request!" }));

    return backupApi
      .backupPublicIpUpdate()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-backup-PublicIp-Update" }));
      });
  },
  computeProtectionGroupOwnerDetails: (pathParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "compute-protection-group-owner-detail", msg: "Loading Protection Group Owner Details!" }));
    return backupApi
      .computeProtectionGroupOwnerDetails(pathParams)
      .then((response) => {
        const modifiedRes = {
          ...response.data,
          resource_details: {
            Name: response?.data?.resource_details?.protection_group_name,
            Status: response?.data?.resource_details?.status,
            Created: formatDate(response?.data?.resource_details?.created, false, true),
          },
        };
        dispatch(modalRedux.actions.resourceOwnerDetail(modifiedRes));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "compute-protection-group-owner-detail" }));
      });
  },
  computeBackupsOwnerDetails: (pathParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "compute-backups-owner-detail", msg: "Loading Backups Owner Details!" }));
    return backupApi
      .computeBackupsOwnerDetails(pathParams)
      .then((response) => {
        const modifiedRes = {
          ...response.data,
          resource_details: {
            Status: response?.data?.resource_details?.status,
            Created: formatDate(response?.data?.resource_details?.created, false, true),
          },
        };
        dispatch(modalRedux.actions.resourceOwnerDetail(modifiedRes));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "compute-backups-owner-detail" }));
      });
  },
  rejectBackupPublicIpRequest: (requestId: any, action, payload) => (dispatch, getState) => {
    const rootState = getState();
    const providerId = authRedux.getters.selectedProvider(rootState);
    dispatch(loaderRedux.actions.addMessage({ type: "reject-backup-public-ip-request", msg: "Rejecting Backup Public Ip Request!" }));
    return backupApi
      .rejectBackupPublicIpRequest(providerId, action, requestId, payload)
      .then(() => {
        toast.success("Backup Public IP Request Rejected Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "reject-backup-public-ip-request" }));
      });
  },
  approveBackupPublicIpRequest: (requestId: any, action) => (dispatch, getState) => {
    const rootState = getState();
    const providerId = authRedux.getters.selectedProvider(rootState);

    dispatch(loaderRedux.actions.addMessage({ type: "approve-backup-public-ip-request", msg: "Approving Backup Public Ip Request!" }));
    return backupApi
      .approveBackupPublicIpRequest(providerId, action, requestId)
      .then(() => {
        toast.success("Backup Public IP Request Approved Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "approve-backup-public-ip-request" }));
      });
  },
  rejectBackupPublicIpUpdateRequest: (requestId: any, action, payload) => (dispatch, getState) => {
    const rootState = getState();
    const providerId = authRedux.getters.selectedProvider(rootState);
    dispatch(loaderRedux.actions.addMessage({ type: "reject-backup-public-ip-update-request", msg: "Rejecting Backup Public Ip Update Request!" }));
    return backupApi
      .rejectBackupPublicIpUpdateRequest(providerId, action, requestId, payload)
      .then(() => {
        toast.success("Backup Public IP Update Request Rejected Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "reject-backup-public-ip-update-request" }));
      });
  },
  approveBackupPublicIpUpdateRequest: (requestId: any, action) => (dispatch, getState) => {
    const rootState = getState();
    const providerId = authRedux.getters.selectedProvider(rootState);

    dispatch(loaderRedux.actions.addMessage({ type: "approve-backup-public-ip-update-request", msg: "Approving Backup Public Ip Update Request!" }));
    return backupApi
      .approveBackupPublicIpUpdateRequest(providerId, action, requestId)
      .then(() => {
        toast.success("Backup Public IP Update Request Approved Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "approve-backup-public-ip-update-request" }));
      });
  },
};

const getters = {
  backups(rootState) {
    const state = rootState[name];
    return state.backups;
  },
  protectionGroups(rootState) {
    const state = rootState[name];
    return state.protectionGroups;
  },
  backupPublicIp(rootState) {
    const state = rootState[name];
    return state.backupPublicIp;
  },
  backupPublicIpUpdate(rootState) {
    const state = rootState[name];
    return state.backupPublicIpUpdate;
  },
};

export default {
  actions,
  getters,
  slice,
};
