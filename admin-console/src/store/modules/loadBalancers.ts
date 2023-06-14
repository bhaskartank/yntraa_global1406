import { createSlice } from "@reduxjs/toolkit";
import loadBalancersApi from "observability/api/loadBalancers";
import { toast } from "react-toastify";

import loaderRedux from "store/modules/loader";
import modalRedux from "store/modules/modals";

import { apiHeaderTotalCount } from "utilities";
import { formatDate } from "utilities/comp";

import authRedux, { GLOBAL_RESET } from "./auth";

const name = "loadBalancers";
const initialState = {
  loadBalancers: { list: null, totalRecords: 0 },
  sslRequests: { list: null, totalRecords: 0 },
  sslCertificates: { list: null, totalRecords: 0 },
  lbAppliedConfig: { list: null, totalRecords: 0 },
  lbLogs: { list: null, totalRecords: 0 },
  lbConfigTemplate: { list: null, totalRecords: 0 },
};

const slice = createSlice({
  name,
  initialState,
  reducers: {
    setLoadBalancers(state, { payload }) {
      state.loadBalancers = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setSSLRequests(state, { payload }) {
      state.sslRequests = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setSSLCertificates(state, { payload }) {
      state.sslCertificates = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setLBAppliedConfig(state, { payload }) {
      state.lbAppliedConfig = payload;
    },
    setLBLogs(state, { payload }) {
      state.lbLogs = payload.data;
    },
    setLBConfigTemplate(state, { payload }) {
      state.lbConfigTemplate = payload.data;
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
  loadBalancers: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-load-balancers", msg: "Loading Load Balancers!" }));

    return loadBalancersApi
      .loadBalancers(payload)
      .then((response) => {
        dispatch(slice.actions.setLoadBalancers(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-load-balancers" }));
      });
  },
  exportLoadBalancers: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-load-balancers", msg: "Exporting Load Balancer List!" }));

    return loadBalancersApi
      .loadBalancers()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-load-balancers" }));
      });
  },
  sslRequests: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-ssl-requests", msg: "Loading SSL Requests!" }));

    return loadBalancersApi
      .sslRequests(payload)
      .then((response) => {
        dispatch(slice.actions.setSSLRequests(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-ssl-requests" }));
      });
  },
  exportSSLRequests: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-ssl-requests", msg: "Exporting SSL Request List!" }));

    return loadBalancersApi
      .sslRequests()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-ssl-requests" }));
      });
  },
  sslCertificates: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-ssl-certificates", msg: "Loading SSL Certificates!" }));

    return loadBalancersApi
      .sslCertificates(payload)
      .then((response) => {
        dispatch(slice.actions.setSSLCertificates(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-ssl-certificates" }));
      });
  },

  fetchLbSslCertificatesById:
    ({ certificateId }) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "fetch-lb-ssl-certificates", msg: "Loading LB SSL Certificates!" }));
      return loadBalancersApi
        .fetchLbSslCertificatesById(certificateId)
        .then((response) => {
          dispatch(modalRedux.actions.sslCertificateById(response.data));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "fetch-lb-ssl-certificates" }));
        });
    },

  exportSSLCertificates: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-ssl-certificates", msg: "Exporting SSL ertificates List!" }));

    return loadBalancersApi
      .sslCertificates()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-ssl-certificates" }));
      });
  },
  computeLoadBalancerOwnerDetails: (pathParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "get-load-balancer-owner-details", msg: "Loading Load Balancer Owner Details!" }));
    return loadBalancersApi
      .computeLoadBalancerOwnerDetails(pathParams)
      .then((response) => {
        const modifiedRes = {
          ...response.data,
          resource_details: {
            Name: response?.data?.resource_details?.name,
            Status: response?.data?.resource_details?.status,
            Created: formatDate(response?.data?.resource_details?.created, false, true),
          },
        };
        dispatch(modalRedux.actions.resourceOwnerDetail(modifiedRes));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "get-load-balancer-owner-details" }));
      });
  },
  computeSSLRequestOwnerDetail: (pathParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "get-ssl-request-owner-details", msg: "Loading Ssl Request Owner Details!" }));
    return loadBalancersApi
      .computeSSLRequestOwnerDetail(pathParams)
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
        dispatch(loaderRedux.actions.removeMessage({ type: "get-ssl-request-owner-details" }));
      });
  },
  sslRequestViewCertificateDetail: (pathParams) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "get-ssl-request-certificate-details", msg: "Loading Ssl Request Certificate Details!" }));
    return loadBalancersApi
      .sslRequestViewCertificateDetail(pathParams)
      .then((response) => {
        dispatch(modalRedux.actions.certificateDetail(response.data));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "get-ssl-request-certificate-details" }));
      });
  },
  rejectLoadBalancerSSLRequest: (requestId: any, projectId, payload) => (dispatch, getState) => {
    const rootState = getState();
    const providerId = authRedux.getters.selectedProvider(rootState);
    dispatch(loaderRedux.actions.addMessage({ type: "reject-SSL-configuration-request", msg: "Rejecting SSL configuration Request!" }));
    return loadBalancersApi
      .rejectLoadBalancerSSLRequest(providerId, projectId, requestId, payload)
      .then(() => {
        toast.success("SSL Request Rejected Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "reject-SSL-configuration-request" }));
      });
  },
  approveLoadBalancerSSLRequest: (requestId: any, projectId, payload) => (dispatch, getState) => {
    const rootState = getState();
    const providerId = authRedux.getters.selectedProvider(rootState);
    // const payload = { provider_id: JSON.stringify(providerId) };

    dispatch(loaderRedux.actions.addMessage({ type: "approve-SSL-configuration-request", msg: "Approving SSL configuration Request!" }));
    return loadBalancersApi
      .approveLoadBalancerSSLRequest(providerId, projectId, requestId, payload)
      .then(() => {
        toast.success("SSL Request Approved Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "approve-SSL-configuration-request" }));
      });
  },
  markLbAsErrorRequest: (loadBalancerId) => (dispatch, getState) => {
    const rootState = getState();
    const providerId = authRedux.getters.selectedProvider(rootState);

    dispatch(loaderRedux.actions.addMessage({ type: "mark-lb-as-error-request", msg: "Approving Mark Lb as Error Request!" }));
    return loadBalancersApi
      .markLbAsErrorRequest(loadBalancerId, providerId)
      .then(() => {
        toast.success("Mark Lb as Error Request Successfull!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "mark-lb-as-error-request" }));
      });
  },
  fetchAppliedLBConfig: (providerId, projectId, lbId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "fetch-applied-lb-config", msg: "Fetching Applied LB Config!" }));

    return loadBalancersApi
      .fetchAppliedLBConfig(providerId, projectId, lbId)
      .then((response) => {
        dispatch(slice.actions.setLBAppliedConfig(response.data));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "fetch-applied-lb-config" }));
      });
  },
  fetchLBLogs: (providerId, projectId, lbId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "fetch-lb-logs", msg: "Loading Load Balancer Logs!" }));

    return loadBalancersApi
      .fetchLBLogs(providerId, projectId, lbId)
      .then((response) => {
        dispatch(slice.actions.setLBLogs(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "fetch-lb-logs" }));
      });
  },
  fetchLBConfigTemplate: (providerId, projectId, lbId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "fetch-lb-logs", msg: "Loading Load Balancer Logs!" }));

    return loadBalancersApi
      .fetchLBConfigTemplate(providerId, projectId, lbId)
      .then((response) => {
        dispatch(slice.actions.setLBConfigTemplate(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "fetch-lb-logs" }));
      });
  },
};

const getters = {
  loadBalancers(rootState) {
    const state = rootState[name];
    return state.loadBalancers;
  },
  sslRequests(rootState) {
    const state = rootState[name];
    return state.sslRequests;
  },
  sslCertificates(rootState) {
    const state = rootState[name];
    return state.sslCertificates;
  },
  lbAppliedConfig(rootState) {
    const state = rootState[name];
    return state.lbAppliedConfig;
  },
  lbLogs(rootState) {
    const state = rootState[name];
    return state.lbLogs;
  },
  lbConfigTemplate(rootState) {
    const state = rootState[name];
    return state.lbConfigTemplate;
  },
};

export default {
  actions,
  getters,
  slice,
};
