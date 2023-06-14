import { createSlice } from "@reduxjs/toolkit";

import PublicIPApi from "api/public-ips";

import { apiHeaderTotalCount } from "utils";

import authRedux, { THE_GREAT_RESET } from "./auth";
import loaderRedux from "./loader";

const name = "publicIPs";

const initialState = {
  totalAllocatedIPRecords: 0,
  updateRequestList: { list: [], totalRecords: 0 },
  listRequestedIps: { list: [], totalRecords: 0 },
};

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    setListRequestedIPs(state, { payload }) {
      state.listRequestedIps = payload;
    },
    setTotalCountPublicIPs(state, { payload }) {
      state.totalAllocatedIPRecords = payload && !!payload["x-total-count"] ? parseInt(payload["x-total-count"], 10) : 0;
    },
    setUpdateRequestsList(state, { payload }) {
      state.updateRequestList = payload;
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
  listIPsByProvider: () => async (dispatch, getState) => {
    const rootState = getState();
    const providerId = authRedux.getters.selectedProviderId(rootState);
    dispatch(
      loaderRedux.actions.addMessage({
        type: "allocated-public-ips-by-provider-and-project",
        msg: `Fetching Public IPs allocated to provider's project!`,
      }),
    );
    return PublicIPApi.listImportedIPsByProvider(providerId)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "allocated-public-ips-by-provider-and-project" }));
      });
  },

  listRoutableIPs: () => async (dispatch, getState) => {
    const rootState = getState();
    const providerId = authRedux.getters.selectedProviderId(rootState);
    const projectId = authRedux.getters.selectedProjectId(rootState);
    const organisationId = authRedux.getters.selectedOrganisationId(rootState);
    dispatch(
      loaderRedux.actions.addMessage({
        type: "routable-ips-by-organisation-provider-and-project",
        msg: `Fetching Routable Ips!`,
      }),
    );
    return PublicIPApi.listRoutableIP(organisationId, providerId, projectId)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "routable-ips-by-organisation-provider-and-project" }));
      });
  },

  listAllocatedIPsByProviderProject: (payload) => async (dispatch, getState) => {
    const rootState = getState();
    const providerId = authRedux.getters.selectedProviderId(rootState);
    const projectId = authRedux.getters.selectedProjectId(rootState);
    dispatch(
      loaderRedux.actions.addMessage({
        type: "allocated-public-ips-by-provider-and-project",
        msg: `Fetching Public IPs allocated to provider's project!`,
      }),
    );
    return PublicIPApi.listAllocatedIPsByProviderAndProject(providerId, projectId, payload)
      .then((result) => {
        dispatch(slice.actions.setTotalCountPublicIPs(result.headers));
        return result.data;
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "allocated-public-ips-by-provider-and-project" }));
      });
  },

  listAllocatedIPsByProvider: () => async (dispatch, getState) => {
    const rootState = getState();
    const providerId = authRedux.getters.selectedProviderId(rootState);
    dispatch(
      loaderRedux.actions.addMessage({
        type: "allocated-public-ips-by-provider",
        msg: "Fetching Public IPs allocated to provider!",
      }),
    );
    return PublicIPApi.listAllocatedIPsByProvider(providerId)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "allocated-public-ips-by-provider" }));
      });
  },
  listAllocatedIPsByProject: () => async (dispatch, getState) => {
    const rootState = getState();
    const projectId = authRedux.getters.selectedProjectId(rootState);
    dispatch(
      loaderRedux.actions.addMessage({
        type: "allocated-public-ips-by-project",
        msg: "Fetching Public IPs allocated to project!",
      }),
    );
    return PublicIPApi.listAllocatedIPsByProject(projectId)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "allocated-public-ips-by-project" }));
      });
  },

  listRequestedIps: (payload) => async (dispatch, getState) => {
    const rootState = getState();
    const providerId = authRedux.getters.selectedProviderId(rootState);
    const projectId = authRedux.getters.selectedProjectId(rootState);
    return PublicIPApi.listRequestedIPs(providerId, projectId, payload)
      .then((result) => {
        dispatch(slice.actions.setListRequestedIPs({ list: result.data, totalRecords: apiHeaderTotalCount(result?.headers) }));
        return result.data;
      })
      .catch((err) => {
        console.error(err);
      });
  },

  requestPublicIP: (payload) => async (dispatch, getState) => {
    const rootState = getState();
    const providerId = authRedux.getters.selectedProviderId(rootState);
    const projectId = authRedux.getters.selectedProjectId(rootState);
    dispatch(loaderRedux.actions.addMessage({ type: "public-ip-request", msg: "Requesting Public IP" }));
    return PublicIPApi.requestPublicIP(providerId, projectId, payload)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "public-ip-request" }));
      });
  },

  changeRequest: (payload, publicIpId) => async (dispatch, getState) => {
    const rootState = getState();
    const providerId = authRedux.getters.selectedProviderId(rootState);
    const projectId = authRedux.getters.selectedProjectId(rootState);
    dispatch(loaderRedux.actions.addMessage({ type: "update-public-ip-request", msg: "Requesting for updating Public IP" }));
    return PublicIPApi.changeRequest(providerId, projectId, payload, publicIpId)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "update-public-ip-request" }));
      });
  },

  getChangeRequests: (payload, publicIpId) => async (dispatch, getState) => {
    const rootState = getState();
    const providerId = authRedux.getters.selectedProviderId(rootState);
    const projectId = authRedux.getters.selectedProjectId(rootState);
    dispatch(loaderRedux.actions.addMessage({ type: "get-change-requests", msg: "Fetching Update Requests!" }));
    return PublicIPApi.getChangeRequests(providerId, projectId, publicIpId, payload)
      .then((response) => {
        dispatch(slice.actions.setUpdateRequestsList({ list: response?.data, totalRecords: apiHeaderTotalCount(response?.headers) }));
        return response.data;
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "get-change-requests" }));
      });
  },

  cancelChangeRequest: (payload) => async (dispatch, getState) => {
    const rootState = getState();
    const providerId = authRedux.getters.selectedProviderId(rootState);
    const projectId = authRedux.getters.selectedProjectId(rootState);
    dispatch(loaderRedux.actions.addMessage({ type: "cancel-change-request", msg: "Cancel Change Request!" }));
    return PublicIPApi.cancelChangeRequest(providerId, projectId, payload.requestId, payload.changeRequestId, payload)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "cancel-change-request" }));
      });
  },

  withdrawPublicIP: (payload) => async (dispatch, getState) => {
    const rootState = getState();
    const providerId = authRedux.getters.selectedProviderId(rootState);
    const projectId = authRedux.getters.selectedProjectId(rootState);
    dispatch(loaderRedux.actions.addMessage({ type: "public-ip-withdraw", msg: "Requesting to Withdraw Public IP" }));

    return PublicIPApi.withdrawPublicIP(providerId, projectId, payload)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "public-ip-withdraw" }));
      });
  },

  getWithdrawnPublicIPs: (payload) => async (dispatch, getState) => {
    const rootState = getState();
    const providerId = authRedux.getters.selectedProviderId(rootState);
    const projectId = authRedux.getters.selectedProjectId(rootState);
    dispatch(loaderRedux.actions.addMessage({ type: "public-ip-withdrawn-list", msg: "Fetching Withdrawn Public IPs" }));
    return PublicIPApi.getWithdrawnPublicIPs(providerId, projectId, payload)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "public-ip-withdrawn-list" }));
      });
  },

  getWithdrawalConsents: () => async (dispatch) => {
    const payload = {
      module: "user",
      service: "public_ip",
      action: "withdrawal",
    };

    dispatch(loaderRedux.actions.addMessage({ type: "get-withdrawal-consents", msg: "Fetching Withdrawal Consents!" }));
    return PublicIPApi.getWithdrawalConsents(payload)
      .then((response) => {
        return response;
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "get-withdrawal-consents" }));
      });
  },
};

export const getters = {
  totalAllocatedIPRecords(rootState) {
    const state = rootState[name];
    return state.totalAllocatedIPRecords;
  },
  updateRequestList(rootState) {
    const state = rootState[name];
    return state.updateRequestList;
  },
  listRequestedIps(rootState) {
    const state = rootState[name];
    return state.listRequestedIps;
  },
};

export default {
  slice,
  actions,
  getters,
};
