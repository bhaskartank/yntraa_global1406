import { createSlice } from "@reduxjs/toolkit";
import networksApi from "observability/api/networks";
import { toast } from "react-toastify";

import loaderRedux from "store/modules/loader";
import modalRedux from "store/modules/modals";

import { apiHeaderTotalCount } from "utilities";
import { formatDate } from "utilities/comp";

import authRedux, { GLOBAL_RESET } from "./auth";

const name = "networks";
const initialState = {
  networks: { list: null, totalRecords: 0 },
  routers: { list: null, totalRecords: 0 },
  securityGroups: { list: [], totalRecords: 0 },
  securityGroupRules: { list: [], totalRecords: 0 },
  floatingIPs: { list: [], totalRecords: 0 },
  publicIPs: { list: [], totalRecords: 0 },
  requestedPublicIPs: { list: [], totalRecords: 0 },
  withdrawPublicIPs: { list: [], totalRecords: 0 },
  publicIPUpdateRequest: { list: [], totalRecords: 0 },
  routerNetworkDetails: { list: [], totalRecords: 0 },
};

const slice = createSlice({
  name,
  initialState,
  reducers: {
    setNetworks(state, { payload }) {
      state.networks = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setRouters(state, { payload }) {
      state.routers = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setSecurityGroups(state, { payload }) {
      state.securityGroups = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setSecurityGroupRules(state, { payload }) {
      state.securityGroupRules = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setFloatingIPs(state, { payload }) {
      state.floatingIPs = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setPublicIPs(state, { payload }) {
      state.publicIPs = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setRequestedPublicIPs(state, { payload }) {
      state.requestedPublicIPs = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setWithdrawPublicIPs(state, { payload }) {
      state.withdrawPublicIPs = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setPublicIPUpdateRequest(state, { payload }) {
      state.publicIPUpdateRequest = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setRouterNetworkDetails(state, { payload }) {
      state.routerNetworkDetails = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
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
  networks:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-networks", msg: "Loading Networks!" }));

      return networksApi
        .networks(queryParams)
        .then((response) => {
          dispatch(slice.actions.setNetworks(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-networks" }));
        });
    },
  exportNetworks: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-networks", msg: "Exporting Networks List!" }));

    return networksApi
      .networks()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-networks" }));
      });
  },
  routers:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-routers", msg: "Loading Routers!" }));

      return networksApi
        .routers(queryParams)
        .then((response) => {
          dispatch(slice.actions.setRouters(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-routers" }));
        });
    },
  exportRouters: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-routers", msg: "Exporting Routers List!" }));

    return networksApi
      .routers()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-routers" }));
      });
  },
  securityGroups:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-security-groups", msg: "Loading Security Groups!" }));

      return networksApi
        .securityGroups(queryParams)
        .then((response) => {
          dispatch(slice.actions.setSecurityGroups(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-security-groups" }));
        });
    },
  exportSecurityGroups: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-security-groups", msg: "Exporting Security Groups List!" }));

    return networksApi
      .securityGroups()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-security-groups" }));
      });
  },
  securityGroupRules:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-security-groups-rules", msg: "Loading Security Group Rules!" }));

      return networksApi
        .securityGroupRules(queryParams)
        .then((response) => {
          dispatch(slice.actions.setSecurityGroupRules(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-security-groups-rules" }));
        });
    },
  exportSecurityGroupRules: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-security-groups-rules", msg: "Exporting Security Group Rules List!" }));

    return networksApi
      .securityGroupRules()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-security-groups-rules" }));
      });
  },
  floatingIPs:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-floating-ips", msg: "Loading Floating IPs!" }));

      return networksApi
        .floatingIPs(queryParams)
        .then((response) => {
          dispatch(slice.actions.setFloatingIPs(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-floating-ips" }));
        });
    },
  exportFloatingIPs: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-floating-ips", msg: "Exporting Floating IPs List!" }));

    return networksApi
      .floatingIPs()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-floating-ips" }));
      });
  },
  publicIPs:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-public-ips", msg: "Loading Public IPs!" }));

      return networksApi
        .publicIPs(queryParams)
        .then((response) => {
          dispatch(slice.actions.setPublicIPs(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-public-ips" }));
        });
    },
  exportPublicIPs: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-public-ips", msg: "Exporting Public IPs List!" }));

    return networksApi
      .publicIPs()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-public-ips" }));
      });
  },
  requestedPublicIPs:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-requested-public-ips", msg: "Loading Requested Public IPs!" }));

      return networksApi
        .requestedPublicIPs(queryParams)
        .then((response) => {
          dispatch(slice.actions.setRequestedPublicIPs(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-requested-public-ips" }));
        });
    },

  exportRequestedPublicIPs: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-requested-public-ips", msg: "Exporting Public IPs List!" }));

    return networksApi
      .requestedPublicIPs()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-requested-public-ips" }));
      });
  },

  withdrawPublicIPs:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-withdraw-public-ips", msg: "Loading Withdrawn Public IPs!" }));

      return networksApi
        .withdrawPublicIPs(queryParams)
        .then((response) => {
          dispatch(slice.actions.setWithdrawPublicIPs(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-withdraw-public-ips" }));
        });
    },

  exportWithdrawPublicIPs: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-withdrawn-public-ips", msg: "Exporting Public IPs List!" }));

    return networksApi
      .withdrawPublicIPs()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-withdrawn-public-ips" }));
      });
  },

  publicIPUpdateRequest:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-updated-public-ips", msg: "Loading Public IP Update Requests!" }));

      return networksApi
        .publicIPUpdateRequest(queryParams)
        .then((response) => {
          dispatch(slice.actions.setPublicIPUpdateRequest(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-updated-public-ips" }));
        });
    },

  exportPublicIPUpdateRequest: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-updated-public-ips", msg: "Exporting Public IP Update Requests!" }));

    return networksApi
      .publicIPUpdateRequest()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-updated-public-ips" }));
      });
  },
  computeFloatingIpOwnerDetails: (pathParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "get-floatingIp-owner-details", msg: "Loading floatingIp Owner Details!" }));
    return networksApi
      .computeFloatingIpOwnerDetails(pathParams)
      .then((response) => {
        const modifiedRes = {
          ...response.data,
          resource_details: {
            "Floating ip": response?.data?.resource_details?.floating_ip,
            Created: formatDate(response?.data?.resource_details?.created, false, true),
          },
        };
        dispatch(modalRedux.actions.resourceOwnerDetail(modifiedRes));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "get-floatingIp-owner-details" }));
      });
  },
  computeNetworkOwnerDetails: (pathParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "get-network-owner-details", msg: "Loading Network Owner Details!" }));
    return networksApi
      .computeNetworkOwnerDetails(pathParams)
      .then((response) => {
        const modifiedRes = {
          ...response.data,
          resource_details: {
            Name: response?.data?.resource_details?.network_name,
            Status: response?.data?.resource_details?.status,
            Created: formatDate(response?.data?.resource_details?.created, false, true),
          },
        };
        dispatch(modalRedux.actions.resourceOwnerDetail(modifiedRes));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "get-network-owner-details" }));
      });
  },
  computeRouterOwnerDetails: (pathParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "get-router-owner-details", msg: "Loading Network Owner Details!" }));
    return networksApi
      .computeRouterOwnerDetails(pathParams)
      .then((response) => {
        const modifiedRes = {
          ...response.data,
          resource_details: {
            Name: response?.data?.resource_details?.router_name,
            Created: formatDate(response?.data?.resource_details?.created, false, true),
          },
        };
        dispatch(modalRedux.actions.resourceOwnerDetail(modifiedRes));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "get-router-owner-details" }));
      });
  },
  computeSecurityGroupOwnerDetails: (pathParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "get-security-group-owner-details", msg: "Loading Network Owner Details!" }));
    return networksApi
      .computeSecurityGroupOwnerDetails(pathParams)
      .then((response) => {
        const modifiedRes = {
          ...response.data,
          resource_details: {
            Name: response?.data?.resource_details?.security_group_name,
            Status: response?.data?.resource_details?.status,
            Created: formatDate(response?.data?.resource_details?.created, false, true),
          },
        };
        dispatch(modalRedux.actions.resourceOwnerDetail(modifiedRes));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "get-security-group-owner-details" }));
      });
  },
  computePublicIpWithdrawalOwnerDetails: (pathParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "get-public-ip-withdrawal-owner-details", msg: "Loading Public Ip Withdrawal Owner Details!" }));
    return networksApi
      .computePublicIpWithdrawalOwnerDetails(pathParams)
      .then((response) => {
        const modifiedRes = {
          ...response.data,
          resource_details: {
            Name: response?.data?.resource_details?.application_name,
            Status: response?.data?.resource_details?.status,
            Created: formatDate(response?.data?.resource_details?.created, false, true),
          },
        };
        dispatch(modalRedux.actions.resourceOwnerDetail(modifiedRes));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "get-public-ip-withdrawal-owner-details" }));
      });
  },
  computePublicIpRequestOwnerDetails: (pathParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "get-public-ip-request-owner-details", msg: "Loading Public Ip Withdrawal Owner Details!" }));
    return networksApi
      .computePublicIpRequestOwnerDetails(pathParams)
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
        dispatch(loaderRedux.actions.removeMessage({ type: "get-public-ip-request-owner-details" }));
      });
  },
  computePublicIpUpdateOwnerDetails: (pathParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "get-public-ip-update-owner-details", msg: "Loading Public Ip Update Owner Details!" }));
    return networksApi
      .computePublicIpUpdateOwnerDetails(pathParams)
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
        dispatch(loaderRedux.actions.removeMessage({ type: "get-public-ip-update-owner-details" }));
      });
  },
  syncSGRules: (providerId, projectId, securityGroupId, payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "get-security-groups", msg: "Loading Security Groups!" }));

    return networksApi
      .syncSGRules(providerId, projectId, securityGroupId, payload)
      .then((response) => {
        dispatch(slice.actions.setSecurityGroups(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "get-security-groups" }));
      });
  },
  listRouterNetworkDetails: (pathParams, queryParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-routers", msg: "Loading Network Details!" }));

    return networksApi
      .listRouterNetworkDetails(pathParams, queryParams)
      .then((response) => {
        dispatch(slice.actions.setRouterNetworkDetails(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-routers" }));
      });
  },
  exportRouterNetworkDetails: (pathParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-routers", msg: "Exporting Routers List!" }));

    return networksApi
      .listRouterNetworkDetails(pathParams, {})
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-routers" }));
      });
  },
  reserveFloatingIP: (networkId, providerId, projectId, payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "reserve-floating-ip", msg: "Reserving Floating IP!" }));

    return networksApi
      .reserveFloatingIP(networkId, providerId, projectId, payload)
      .then(() => {
        toast.success("Floating IP Reserved Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "reserve-floating-ip" }));
      });
  },
  releaseFloatingIP: (pathParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "release-floating-ip", msg: "Releasing Floating IP!" }));

    return networksApi
      .releaseFloatingIP(pathParams)
      .then(() => {
        toast.success("Floating IP Released Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "release-floating-ip" }));
      });
  },
  deletePublicIP: (pathParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "delete-public-ip", msg: "Deleteing Public IP!" }));

    return networksApi
      .deletePublicIP(pathParams)
      .then(() => {
        toast.success("Public IP Deleted Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "delete-public-ip" }));
      });
  },
  updatePublicIP: (providerId, publicIpId, payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "update-public-ip", msg: "Updating Public IP!" }));

    return networksApi
      .updatePublicIP(providerId, publicIpId, payload)
      .then((response) => {
        dispatch(slice.actions.setPublicIPs(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "update-public-ip" }));
      });
  },
  importPublicIPPool: (providerId, payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "import-public-ip-pool", msg: "Importing Public IP Pool!" }));

    return networksApi
      .importPublicIPPool(providerId, payload)
      .then(() => {
        toast.success("Public IP Pool Imported Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "import-public-ip-pool" }));
      });
  },
  deletePublicIPPool: (providerId, payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "delete-public-ip-pool", msg: "Deleting Public IP Pool!" }));

    return networksApi
      .deletePublicIPPool(providerId, payload)
      .then(() => {
        toast.success("Public IP Pool Deleted Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "delete-public-ip-pool" }));
      });
  },
  CreateSecurityGroupRule: (providerId, projectId, securityGroupId, payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "create-default-rule", msg: "Creating Default Rule!" }));

    return networksApi
      .createSecurityGroupRule(providerId, projectId, securityGroupId, payload)
      .then(() => {
        toast.success("Security Group Rule Created Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "create-default-rule" }));
      });
  },
  deleteSGRules: (providerId, projectId, securityGroupId, payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "delete-sg-rule", msg: "Deleting Security Group Rules!" }));

    return networksApi
      .deleteSGRules(providerId, projectId, securityGroupId, payload)
      .then(() => {
        toast.success("Security Group Rules Deleted Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "delete-sg-rule" }));
      });
  },
  rejectRequestedPublicIps: (requestId: any, providerId, projectId, payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "reject-requested-public-ips-request", msg: "Rejecting Requested Public Ip Request!" }));
    return networksApi
      .rejectRequestedPublicIps(providerId, projectId, requestId, payload)
      .then(() => {
        toast.success("Requested Public Ip Request Rejected Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "reject-requested-public-ips-request" }));
      });
  },
  approveRequestedPublicIps: (requestId: any, providerId, projectId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "approve-requested-public-ips-request", msg: "Approving Requested Public Ip Request!" }));
    return networksApi
      .approveRequestedPublicIps(providerId, projectId, requestId)
      .then(() => {
        toast.success("Requested Public Ip Request Approved Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "approve-requested-public-ips-request" }));
      });
  },
  rejectPublicIpWithdraw: (requestId: any, providerId, projectId, payload) => (dispatch, getState) => {
    // const rootState = getState();
    // const providerId = authRedux.getters.selectedProvider(rootState);
    dispatch(loaderRedux.actions.addMessage({ type: "reject-public-ip-withdraw-request", msg: "Rejecting Public Ip Withdraw Request!" }));
    return networksApi
      .rejectPublicIpWithdraw(providerId, projectId, requestId, payload)
      .then(() => {
        toast.success("Public Ip Withdraw Request Rejected Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "reject-public-ip-withdraw-request" }));
      });
  },
  approvePublicIpWithdraw: (requestId: any, providerId, projectId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "approve-public-ip-withdraw-request", msg: "Approving Public Ip Withdraw Request!" }));
    return networksApi
      .approvePublicIpWithdraw(providerId, projectId, requestId)
      .then(() => {
        toast.success("Public Ip Withdraw Request Approved Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "approve-public-ip-withdraw-request" }));
      });
  },
  rejectPublicIpUpdateRequest: (requestId: any, action, payload) => (dispatch, getState) => {
    const rootState = getState();
    const providerId = authRedux.getters.selectedProvider(rootState);

    dispatch(loaderRedux.actions.addMessage({ type: "reject-public-ip-update-request", msg: "Rejecting Public Ip Update Request!" }));
    return networksApi
      .rejectPublicIpUpdateRequest(providerId, requestId, action, payload)
      .then(() => {
        toast.success("Public Ip Update Request Rejected Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "reject-public-ip-update-request" }));
      });
  },
  approvePublicIpUpdateRequest: (requestId: any, action) => (dispatch, getState) => {
    const rootState = getState();
    const providerId = authRedux.getters.selectedProvider(rootState);

    dispatch(loaderRedux.actions.addMessage({ type: "approve-public-ip-update-request", msg: "Approving Public Ip Update Request!" }));
    return networksApi
      .approvePublicIpUpdateRequest(providerId, requestId, action)
      .then(() => {
        toast.success("Public Ip Update Request Approved Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "approve-public-ip-update-request" }));
      });
  },
};

const getters = {
  networks(rootState) {
    const state = rootState[name];
    return state.networks;
  },
  routers(rootState) {
    const state = rootState[name];
    return state.routers;
  },
  securityGroups(rootState) {
    const state = rootState[name];
    return state.securityGroups;
  },
  securityGroupRules(rootState) {
    const state = rootState[name];
    return state.securityGroupRules;
  },
  floatingIPs(rootState) {
    const state = rootState[name];
    return state.floatingIPs;
  },
  publicIPs(rootState) {
    const state = rootState[name];
    return state.publicIPs;
  },
  requestedPublicIPs(rootState) {
    const state = rootState[name];
    return state.requestedPublicIPs;
  },
  withdrawPublicIPs(rootState) {
    const state = rootState[name];
    return state.withdrawPublicIPs;
  },
  publicIPUpdateRequest(rootState) {
    const state = rootState[name];
    return state.publicIPUpdateRequest;
  },
  routerNetworkDetails(rootState) {
    const state = rootState[name];
    return state.routerNetworkDetails;
  },
};

export default {
  actions,
  getters,
  slice,
};
