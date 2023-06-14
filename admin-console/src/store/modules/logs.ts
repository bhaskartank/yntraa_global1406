import { createSlice } from "@reduxjs/toolkit";
import logsApi from "observability/api/logs";

import loaderRedux from "store/modules/loader";

import { apiHeaderTotalCount } from "utilities";

import { GLOBAL_RESET } from "./auth";

const name = "logs";
const initialState = {
  userActionLogs: { list: null, totalRecords: 0 },
  userActionLogById: { list: null, totalRecords: 0 },
  adminActionLogById: { list: null, totalRecords: 0 },
  userAccessLogs: { list: null, totalRecords: 0 },
  adminActionLogs: { list: null, totalRecords: 0 },
  adminAccessLogs: { list: null, totalRecords: 0 },
};

const slice = createSlice({
  name,
  initialState,
  reducers: {
    setUserActionLogs(state, { payload }) {
      state.userActionLogs = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setUserActionLogById(state, { payload }) {
      state.userActionLogById = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setAdminActionLogById(state, { payload }) {
      state.adminActionLogById = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setUserAccessLogs(state, { payload }) {
      state.userAccessLogs = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setAdminActionLogs(state, { payload }) {
      state.adminActionLogs = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setAdminAccessLogs(state, { payload }) {
      state.adminAccessLogs = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
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
  userActionLogs: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-user-action-logs", msg: "Loading User Action Logs!" }));

    return logsApi
      .userActionLogs(payload)
      .then((response) => {
        dispatch(slice.actions.setUserActionLogs(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-user-action-logs" }));
      });
  },
  userActionLogById: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "user-action-log", msg: "Loading User Action Log Details!" }));

    return logsApi
      .userActionLogById(payload?.audit_trail_log_id)
      .then((response) => {
        dispatch(slice.actions.setUserActionLogById(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "user-action-log" }));
      });
  },
  adminActionLogById: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "admin-action-log", msg: "Loading Admin Action Log Details!" }));

    return logsApi
      .adminActionLogById(payload?.admin_audit_trail_log_id)
      .then((response) => {
        dispatch(slice.actions.setAdminActionLogById(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "admin-action-log" }));
      });
  },
  exportUserActionLogs: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-user-action-logs", msg: "Exporting User Action Log List!" }));

    return logsApi
      .userActionLogs()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-user-action-logs" }));
      });
  },
  userAccessLogs: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-user-access-logs", msg: "Loading User Access Logs!" }));

    return logsApi
      .userAccessLogs(payload)
      .then((response) => {
        dispatch(slice.actions.setUserAccessLogs(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-user-access-logs" }));
      });
  },
  exportUserAccessLogs: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-user-access-logs", msg: "Exporting User Access Log List!" }));

    return logsApi
      .userAccessLogs()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-user-access-logs" }));
      });
  },
  adminActionLogs: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-admin-action-logs", msg: "Loading Admin Action Logs!" }));

    return logsApi
      .adminActionLogs(payload)
      .then((response) => {
        dispatch(slice.actions.setAdminActionLogs(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-admin-action-logs" }));
      });
  },
  exportAdminActionLogs: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-admin-action-logs", msg: "Exporting Admin Action Log List!" }));

    return logsApi
      .adminActionLogs()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-admin-action-logs" }));
      });
  },
  adminAccessLogs: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-admin-access-logs", msg: "Loading Admin Access Logs!" }));

    return logsApi
      .adminAccessLogs(payload)
      .then((response) => {
        dispatch(slice.actions.setAdminAccessLogs(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-admin-access-logs" }));
      });
  },
  exportAdminAccessLogs: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-admin-access-logs", msg: "Exporting Admin Access Log List!" }));

    return logsApi
      .adminAccessLogs()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-admin-access-logs" }));
      });
  },
};

const getters = {
  userActionLogs(rootState) {
    const state = rootState[name];
    return state.userActionLogs;
  },
  userActionLogById(rootState) {
    const state = rootState[name];
    return state.userActionLogById;
  },
  adminActionLogById(rootState) {
    const state = rootState[name];
    return state.adminActionLogById;
  },
  userAccessLogs(rootState) {
    const state = rootState[name];
    return state.userAccessLogs;
  },
  adminActionLogs(rootState) {
    const state = rootState[name];
    return state.adminActionLogs;
  },
  adminAccessLogs(rootState) {
    const state = rootState[name];
    return state.adminAccessLogs;
  },
};

export default {
  actions,
  getters,
  slice,
};
