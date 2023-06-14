import { createSlice } from "@reduxjs/toolkit";
import isEmpty from "lodash/isEmpty";
import { toast } from "react-toastify";

import loadBalancerApis from "api/load-balancers";

import { apiHeaderTotalCount } from "utils";

import authRedux, { THE_GREAT_RESET } from "./auth";
import loaderRedux from "./loader";
import socketsRedux from "./sockets";

const name = "loadBalancers";
const initialState = {
  loadBalancers: { list: [], totalRecords: 0 },
  loadBalancerById: null,
  certificates: { list: [], totalRecords: 0 },
  certificateById: null,
  loadBalancerLogs: null,
};

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    setLoadBalancers(state, { payload }) {
      state.loadBalancers = payload;
    },
    setLoadBalancerById(state, { payload }) {
      state.loadBalancerById = payload;
    },
    setCertificates(state, { payload }) {
      state.certificates = payload;
    },
    setCertificateById(state, { payload }) {
      state.certificateById = payload;
    },
    setLoadBalancerLogs(state, { payload }) {
      state.loadBalancerLogs = payload;
    },
    updateOne(state, { payload: updatedLoadBalancer }) {
      if (!isEmpty(updatedLoadBalancer)) {
        const currentLBList = state?.loadBalancers?.list;

        if (currentLBList?.length) {
          const modifiedLBList = currentLBList.map((currentLoadBalancer) => {
            if (currentLoadBalancer?.id === updatedLoadBalancer?.id) return updatedLoadBalancer;
            else return currentLoadBalancer;
          });

          state.loadBalancers.list = modifiedLBList;
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
  loadBalancers: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      const response = await loadBalancerApis.loadBalancers(providerId, projectId, payload);

      dispatch(slice.actions.setLoadBalancers({ list: response?.data, totalRecords: apiHeaderTotalCount(response?.headers) }));
    } catch (err) {
      console.error(err);
    }
  },
  loadBalancerById:
    ({ loadBalancerId }) =>
    async (dispatch, getState) => {
      try {
        const rootState = getState();
        const providerId = authRedux.getters.selectedProviderId(rootState);
        const projectId = authRedux.getters.selectedProjectId(rootState);

        const response = await loadBalancerApis.loadBalancerById(providerId, projectId, loadBalancerId);

        dispatch(slice.actions.setLoadBalancerById(response?.data));
      } catch (err) {
        console.error(err);
      }
    },
  createLoadBalancer:
    ({ payload }) =>
    async (dispatch, getState) => {
      try {
        const rootState = getState();
        const providerId = authRedux.getters.selectedProviderId(rootState);
        const projectId = authRedux.getters.selectedProjectId(rootState);

        const response = await loadBalancerApis.createLoadBalancer(providerId, projectId, payload);

        toast.success("Creating Load Balancer");

        dispatch(
          socketsRedux.actions.executeSocketStatus({
            taskId: response?.data?.task_id,
            callback: () => dispatch(actions.loadBalancerById({ loadBalancerId: response?.data?.id })),
            successMsg: "Load Balancer Created Successfully",
          }),
        );
      } catch (err) {
        console.error(err);
      }
    },
  updateLoadBalancer:
    ({ payload, serverFarmId }) =>
    async (dispatch, getState) => {
      try {
        const rootState = getState();
        const providerId = authRedux.getters.selectedProviderId(rootState);
        const projectId = authRedux.getters.selectedProjectId(rootState);
        const loadBalancerId = payload?.load_balancer_id;

        await loadBalancerApis.updateLoadBalancer(providerId, projectId, payload, loadBalancerId, serverFarmId);

        toast.success("Updating Load Balancer");
      } catch (err) {
        console.error(err);
      }
    },
  deleteLoadBalancer: (loadBalancerId, handleReloadList) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      await loadBalancerApis.deleteLoadBalancer(providerId, projectId, loadBalancerId);

      toast.success("Deleting Load Balancer");

      dispatch(actions.loadBalancerById({ loadBalancerId }))
        .then((loadBalancer) => {
          dispatch(
            socketsRedux.actions.executeSocketStatus({
              taskId: loadBalancer?.task_id,
              callback: handleReloadList,
              successMsg: "Load Balancer Deleted Successfully",
            }),
          );
        })
        .catch((err) => console.error(err));
    } catch (err) {
      console.error(err);
    }
  },
  configureSSLRequest:
    ({ loadBalancerId, sslPvtKey, caCert, sslCert }) =>
    async (dispatch, getState) => {
      try {
        const rootState = getState();
        const providerId = authRedux.getters.selectedProviderId(rootState);
        const projectId = authRedux.getters.selectedProjectId(rootState);
        const payload = {
          load_balancer_id: loadBalancerId,
          ssl_private_key: sslPvtKey,
          ssl_cert_key: sslCert,
          ca_certificate: caCert,
        };

        await loadBalancerApis.configureSSLRequest(providerId, projectId, payload);

        toast.success("SSL certificate configured successfully.");
      } catch (err) {
        console.error(err);
      }
    },
  createSSLRequest:
    ({ loadBalancerId, certId }) =>
    async (dispatch, getState) => {
      try {
        const rootState = getState();
        const providerId = authRedux.getters.selectedProviderId(rootState);
        const projectId = authRedux.getters.selectedProjectId(rootState);
        const payload = {
          load_balancer_id: loadBalancerId,
          cert_id: certId,
        };

        await loadBalancerApis.configureSSLRequest(providerId, projectId, payload);

        toast.success("SSL certificate configured successfully.");
      } catch (err) {
        console.error(err);
      }
    },
  cancelSSLRequest:
    ({ sslConfigureRequestId, action }) =>
    async (dispatch, getState) => {
      try {
        const rootState = getState();
        const providerId = authRedux.getters.selectedProviderId(rootState);
        const projectId = authRedux.getters.selectedProjectId(rootState);
        const payload = { action };

        await loadBalancerApis.performActionSSLRequest(providerId, projectId, sslConfigureRequestId, payload);

        toast.success("SSL Request Cancelled Successfully");
      } catch (err) {
        console.error(err);
      }
    },
  retrySSLRequest:
    ({ sslConfigureRequestId, action }) =>
    async (dispatch, getState) => {
      try {
        const rootState = getState();
        const providerId = authRedux.getters.selectedProviderId(rootState);
        const projectId = authRedux.getters.selectedProjectId(rootState);
        const payload = { action };

        await loadBalancerApis.performActionSSLRequest(providerId, projectId, sslConfigureRequestId, payload);

        toast.success("SSL Request Re-initiated Successfully");
      } catch (err) {
        console.error(err);
      }
    },
  associateFloatingIP: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      await loadBalancerApis.associateFloatingIP(providerId, projectId, payload.loadBalancerId, payload);

      toast.success("Floating IP Associated Successfully");
    } catch (err) {
      console.error(err);
    }
  },
  disassociateFloatingIP: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      await loadBalancerApis.disassociateFloatingIP(providerId, projectId, payload?.loadBalancerId);

      toast.success("Floating IP Disassociated Successfully");
    } catch (err) {
      console.error(err);
    }
  },
  createCertificate: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      await loadBalancerApis.createCertificate(providerId, projectId, payload);

      toast.success("Created Certificate Successfully");
    } catch (err) {
      console.error(err);
    }
  },
  certificates:
    (payload = {}) =>
    async (dispatch, getState) => {
      try {
        const rootState = getState();
        const providerId = authRedux.getters.selectedProviderId(rootState);
        const projectId = authRedux.getters.selectedProjectId(rootState);

        const response = await loadBalancerApis.certificates(providerId, projectId, payload);

        dispatch(slice.actions.setCertificates({ list: response?.data, totalRecords: apiHeaderTotalCount(response?.headers) }));
      } catch (err) {
        console.error(err);
      }
    },
  validateSSlCert: (payload) => async (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "validating-ssl-cert", msg: `Validating SSL Certificates` }));
    return loadBalancerApis
      .validateSSlCert(payload)
      .then((result) => {
        return result;
      })
      .catch((err) => console.error(err))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "validating-ssl-cert" }));
      });
  },
  certificateById: (payload) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      const modifiedPayload = { ...payload, providerId, projectId };

      const response = await loadBalancerApis.certificateById(modifiedPayload);

      dispatch(slice.actions.setCertificateById(response?.data));
    } catch (err) {
      console.error(err);
    }
  },
  deleteCertificate: (certificateId) => async (dispatch, getState) => {
    try {
      const rootState = getState();
      const providerId = authRedux.getters.selectedProviderId(rootState);
      const projectId = authRedux.getters.selectedProjectId(rootState);

      await loadBalancerApis.deleteCertificate({ providerId, projectId, certificateId });

      toast.success("Certificate Delete Successfully");
    } catch (err) {
      console.error(err);
    }
  },
  loadBalancerLogs:
    ({ loadBalancerId }) =>
    async (dispatch, getState) => {
      try {
        const rootState = getState();
        const providerId = authRedux.getters.selectedProviderId(rootState);
        const projectId = authRedux.getters.selectedProjectId(rootState);

        const response = await loadBalancerApis.loadBalancerLogs({ providerId, projectId, loadBalancerId });

        dispatch(slice.actions.setLoadBalancerLogs(response?.data));
      } catch (err) {
        console.error(err);
      }
    },
  exportLoadBalancerLogs:
    ({ loadBalancerId }) =>
    async (dispatch, getState) => {
      try {
        const rootState = getState();
        const providerId = authRedux.getters.selectedProviderId(rootState);
        const projectId = authRedux.getters.selectedProjectId(rootState);

        const response = await loadBalancerApis.loadBalancerLogs({ providerId, projectId, loadBalancerId });

        let data = "";
        if (typeof response?.data === "object" && response?.data?.status) data = response?.data?.status;
        if (typeof response?.data === "string") data = response.data;
        const blob = new Blob([data], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "LoadBalancer-Logs.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error(err);
      }
    },
  testBackendEndpoint:
    ({ loadBalancerId }) =>
    async (dispatch, getState) => {
      try {
        const rootState = getState();
        const providerId = authRedux.getters.selectedProviderId(rootState);
        const projectId = authRedux.getters.selectedProjectId(rootState);

        await loadBalancerApis.testBackendEndpoint({ providerId, projectId, loadBalancerId });
      } catch (err) {
        console.error(err);
      }
    },
  testBackendReachability:
    ({ loadBalancerId }) =>
    async (dispatch, getState) => {
      try {
        const rootState = getState();
        const providerId = authRedux.getters.selectedProviderId(rootState);
        const projectId = authRedux.getters.selectedProjectId(rootState);

        await loadBalancerApis.testBackendReachability({ providerId, projectId, loadBalancerId });
      } catch (err) {
        console.error(err);
      }
    },
};

export const getters = {
  loadBalancers(rootState) {
    const state = rootState[name];
    return state.loadBalancers;
  },
  loadBalancerById(rootState) {
    const state = rootState[name];
    return state.loadBalancerById;
  },
  certificates(rootState) {
    const state = rootState[name];
    return state.certificates;
  },
  certificateById(rootState) {
    const state = rootState[name];
    return state.certificateById;
  },
  loadBalancerLogs(rootState) {
    const state = rootState[name];
    return state.loadBalancerLogs;
  },
};

export default {
  slice,
  actions,
  getters,
};
