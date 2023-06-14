import { createSlice } from "@reduxjs/toolkit";
import userApi from "observability/api/users";
import { toast } from "react-toastify";

import loaderRedux from "store/modules/loader";

import { apiHeaderTotalCount } from "utilities";

import { GLOBAL_RESET } from "./auth";

const name = "users";
const initialState = {
  admin: { list: null, totalRecords: 0 },
  users: { list: null, totalRecords: 0 },
  SSOUsers: { list: null, totalRecords: 0 },
  adminPortalPermissions: { list: null, totalRecords: 0 },
  adminPortalPermissionScopes: [],
  servicePortalPermissions: { list: null, totalRecords: 0 },
  servicePortalPermissionScopes: [],
  roles: { list: null, totalRecords: 0 },
  userDetails: { list: null, totalRecords: 0 },
};

const slice = createSlice({
  name,
  initialState,
  reducers: {
    setAdmin(state, { payload }) {
      state.admin = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setUsers(state, { payload }) {
      state.users = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setSSOUsers(state, { payload }) {
      state.SSOUsers = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setAdminPortalPermissions(state, { payload }) {
      state.adminPortalPermissions = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setAdminPortalPermissionScopes(state, { payload }) {
      state.adminPortalPermissionScopes = payload.data;
    },
    setServicePortalPermissions(state, { payload }) {
      state.servicePortalPermissions = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setServicePortalPermissionScopes(state, { payload }) {
      state.servicePortalPermissionScopes = payload.data;
    },
    setRoles(state, { payload }) {
      state.roles = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setUserDetails(state, { payload }) {
      state.userDetails = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
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
  admin:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-admin", msg: "Loading Admin List!" }));

      return userApi
        .admin(queryParams)
        .then((response) => {
          dispatch(slice.actions.setAdmin(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-admin" }));
        });
    },
  exportAdmin: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-admin", msg: "Exporting Admin List!" }));

    return userApi
      .admin()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-admin" }));
      });
  },
  users:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-users", msg: "Loading Users!" }));

      return userApi
        .users(queryParams)
        .then((response) => {
          dispatch(slice.actions.setUsers(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-users" }));
        });
    },
  exportUsers: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-users", msg: "Exporting Users List!" }));

    return userApi
      .users()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-users" }));
      });
  },
  SSOUsers: (queryParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-SSO-users", msg: "Loading SSO Users List!" }));
    let search = null;
    search = queryParams?.search ? Object.entries(JSON.parse(String(queryParams?.search)))[0][1] : queryParams?.search;

    return userApi
      .SSOUsers({ ...queryParams, search })
      .then((response) => {
        dispatch(slice.actions.setSSOUsers(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-SSO-users" }));
      });
  },
  createUser: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "create-user", msg: "Creating User!" }));

    return userApi
      .createUser(payload)
      .then(() => {
        toast.success("User Created Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "create-user" }));
      });
  },
  resetPassword: (userId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "reset-user-password", msg: "Resetting User Password!" }));

    return userApi
      .resetPassword(userId)
      .then(() => {
        toast.success("User Password Reset Successful!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "reset-user-password" }));
      });
  },
  syncUserWithSSO: (userId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "sync-user", msg: "Synchronizing User with SSO!" }));

    return userApi
      .syncUserWithSSO(userId)
      .then(() => {
        toast.success("User Synchronized with SSO Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "sync-user" }));
      });
  },
  blockUser: (userId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "block-user", msg: "Blocking User!" }));

    return userApi
      .blockUser(userId)
      .then(() => {
        toast.success("User Blocked Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "block-user" }));
      });
  },
  unblockUser: (userId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "unblock-user", msg: "Unblocking User!" }));

    return userApi
      .unblockUser(userId)
      .then(() => {
        toast.success("User Unblocked Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "unblock-user" }));
      });
  },
  fetchUserDetails: (userId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "fetch-user-details", msg: "Fetching User Details !" }));

    return userApi
      .fetchUserDetails(userId)
      .then((response) => {
        dispatch(slice.actions.setUserDetails(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "fetch-user-details" }));
      });
  },
  fetchUserDetailsFromSSO: (userId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "fetch-SSO-user-details", msg: "Fetching User Details from SSO !" }));

    return userApi
      .fetchUserDetailsFromSSO(userId)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "fetch-SSO-user-details" }));
      });
  },

  adminPortalPermissions:
    (userId, queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-admin-portal-permissions", msg: "Loading Admin Portal Permissions!" }));

      return userApi
        .adminPortalPermissions(userId, queryParams)
        .then((response) => {
          dispatch(slice.actions.setAdminPortalPermissions(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-admin-portal-permissions" }));
        });
    },
  exportAdminPortalPermissions: (userId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-admin-portal-permissions", msg: "Exporting Admin Portal Permission List!" }));

    return userApi
      .adminPortalPermissions(userId)
      .then((response) => {
        return response.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-admin-portal-permissions" }));
      });
  },
  assignAdminPortalPermission: (userId, payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "assign-admin-portal-permission", msg: "Assigning Permission!" }));

    return userApi
      .assignAdminPortalPermission(userId, payload)
      .then(() => {
        toast.success("Permission Assigned Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "assign-admin-portal-permission" }));
      });
  },
  unassignAdminPortalPermission: (userId, adminRoleScopeId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "unassign-admin-portal-permission", msg: "Unassigning Permission!" }));

    return userApi
      .unassignAdminPortalPermission(userId, adminRoleScopeId)
      .then(() => {
        toast.success("Permission Unassigned Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "unassign-admin-portal-permission" }));
      });
  },
  adminPortalPermissionScopes: (queryParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-admin-portal-permission-scopes", msg: "Loading Admin Portal Permission Scopes!" }));

    return userApi
      .adminPortalPermissionScopes(queryParams)
      .then((response) => {
        dispatch(slice.actions.setAdminPortalPermissionScopes(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-admin-portal-permission-scopes" }));
      });
  },
  servicePortalPermissions:
    (userId, queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-service-portal-permissions", msg: "Loading Service Portal Permissions!" }));

      return userApi
        .servicePortalPermissions(userId, queryParams)
        .then((response) => {
          dispatch(slice.actions.setServicePortalPermissions(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-service-portal-permissions" }));
        });
    },
  exportServicePortalPermissions: (userId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-service-portal-permissions", msg: "Exporting Service Portal Permission List!" }));

    return userApi
      .servicePortalPermissions(userId)
      .then((response) => {
        return response.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-service-portal-permissions" }));
      });
  },
  assignServicePortalPermission: (organisationId, projectId, payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "assign-service-portal-permission", msg: "Assigning Permission!" }));

    return userApi
      .assignServicePortalPermission(organisationId, projectId, payload)
      .then(() => {
        toast.success("Permission Assigned Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "assign-service-portal-permission" }));
      });
  },
  servicePortalPermissionScopes: (queryParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-service-portal-permission-scopes", msg: "Loading Service Portal Permission Scopes!" }));

    return userApi
      .servicePortalPermissionScopes(queryParams)
      .then((response) => {
        dispatch(slice.actions.setServicePortalPermissionScopes(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-service-portal-permission-scopes" }));
      });
  },
  roles: (queryParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-roles", msg: "Loading Roles!" }));

    return userApi
      .servicePortalPermissionScopes(queryParams)
      .then((response) => {
        dispatch(slice.actions.setRoles(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-roles" }));
      });
  },
};

const getters = {
  users(rootState) {
    const state = rootState[name];
    return state.users;
  },
  admin(rootState) {
    const state = rootState[name];
    return state.admin;
  },
  SSOUsers(rootState) {
    const state = rootState[name];
    return state.SSOUsers;
  },
  adminPortalPermissions(rootState) {
    const state = rootState[name];
    return state.adminPortalPermissions;
  },
  adminPortalPermissionScopes(rootState) {
    const state = rootState[name];
    return state.adminPortalPermissionScopes;
  },
  servicePortalPermissions(rootState) {
    const state = rootState[name];
    return state.servicePortalPermissions;
  },
  servicePortalPermissionScopes(rootState) {
    const state = rootState[name];
    return state.servicePortalPermissionScopes;
  },
  roles(rootState) {
    const state = rootState[name];
    return state.roles;
  },
  userDetails(rootState) {
    const state = rootState[name];
    return state.userDetails;
  },
};

export default {
  actions,
  getters,
  slice,
};
