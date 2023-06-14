import { createSlice } from "@reduxjs/toolkit";

import QuotaPackageApi from "api/quota-packages";

import authRedux, { THE_GREAT_RESET } from "./auth";
import loaderRedux from "./loader";

const name = "quotaPackage";
const initialState = {
  totalRecords: 0,
  totalTopupRequestRecords: 0,
  topupWithdrawnList: [],
  totalTopupWithdrawnRecords: 0,
};

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    SET_TOTAL_COUNT(state, { payload }) {
      state.totalRecords = payload && !!payload["x-total-count"] ? parseInt(payload["x-total-count"], 10) : 0;
    },
    SET_TOTAL_TOPUP_REQUEST_COUNT(state, { payload }) {
      state.totalTopupRequestRecords = payload && !!payload["x-total-count"] ? parseInt(payload["x-total-count"], 10) : 0;
    },
    SET_TOTAL_TOPUP_WITHDRAWN_LIST(state, { payload }) {
      state.topupWithdrawnList = payload;
    },
    SET_TOTAL_TOPUP_WITHDRAWN_COUNT(state, { payload }) {
      state.totalTopupWithdrawnRecords = payload && !!payload["x-total-count"] ? parseInt(payload["x-total-count"], 10) : 0;
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
  listQuotaPackages: (payload) => async (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "quota-package-list", msg: "Fetching Quota Package List." }));
    return QuotaPackageApi.listQuotaPackages(payload.providerId)
      .then((response) => {
        return response;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "quota-package-list" }));
      });
  },
  listQuotaPackagesByOrganisation: (payload) => async (dispatch, getState) => {
    dispatch(
      loaderRedux.actions.addMessage({
        type: "quota-package-list-by-organisation",
        msg: "Fetching Quota Package List.",
      }),
    );
    const rootState = getState();
    const organisationId = authRedux.getters.selectedOrganisationId(rootState);
    return QuotaPackageApi.listQuotaPackagesByOrganisation(organisationId, payload)
      .then((response) => {
        dispatch(slice.actions.SET_TOTAL_COUNT(response.headers));
        return response.data;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "quota-package-list-by-organisation" }));
      });
  },
  getQuotaPackageDetail: (payload) => async (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "quota-package-detail", msg: "Fetching Quota Package Details." }));
    return QuotaPackageApi.getQuotaPackageDetail(payload.quotaPackageId)
      .then((response) => {
        return response;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "quota-package-detail" }));
      });
  },
  upgradeQuotaPackage: (payload) => async (dispatch, getState) => {
    dispatch(loaderRedux.actions.addMessage({ type: "upgrade-quota-package", msg: "Upgrading Quota Package." }));
    const rootState = getState();
    const organisationId = authRedux.getters.selectedOrganisationId(rootState);
    return QuotaPackageApi.upgradeQuotaPackage(organisationId, payload.provider_id, payload.quotaPackageId)
      .then((response) => {
        return response;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "upgrade-quota-package" }));
      });
  },
  requestNewQuotaPackage: (payload) => async (dispatch, getState) => {
    dispatch(loaderRedux.actions.addMessage({ type: "request-new-quota-package", msg: "Requesting New Quota Package." }));
    const rootState = getState();
    const organisationId = authRedux.getters.selectedOrganisationId(rootState);
    return QuotaPackageApi.requestNewQuotaPackage(organisationId, payload.provider_id, payload.quotaPackageId)
      .then((response) => {
        return response;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "request-new-quota-package" }));
      });
  },
  getSelectedQuota: () => async (dispatch, getState) => {
    dispatch(loaderRedux.actions.addMessage({ type: "get-quota-package", msg: "Fetching Selected Quota Package." }));
    const rootState = getState();
    const providerId = authRedux.getters.selectedProviderId(rootState);
    const organisationId = authRedux.getters.selectedOrganisationId(rootState);
    return QuotaPackageApi.getSelectedQuota(organisationId, providerId)
      .then((response) => {
        return response;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "get-quota-package" }));
      });
  },
  getRequestedQuotaPackageId: (payload) => async (dispatch, getState) => {
    dispatch(
      loaderRedux.actions.addMessage({
        type: "get-requested-quota-package-id",
        msg: "Fetching Requested Quota Package Id.",
      }),
    );
    const rootState = getState();
    payload.organisation_id = authRedux.getters.selectedOrganisationId(rootState);
    return QuotaPackageApi.getRequestedQuotaPackageId(payload).then((response) => {
      return response;
    });
    // .finally(() => {
    //   dispatch(loaderRedux.actions.removeMessage({ type: "get-requested-quota-package-id" }));
    // });
  },
  listResourceTopupLabels: (payload) => async (dispatch) => {
    dispatch(
      loaderRedux.actions.addMessage({
        type: "list-resource-topup-labels",
        msg: "Fetching List of Resource Topup Labels.",
      }),
    );
    return QuotaPackageApi.listResourceTopupLabels(payload.provider_id)
      .then((response) => {
        return response;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-resource-topup-labels" }));
      });
  },
  listResourceTopupValues: (payload) => async (dispatch) => {
    dispatch(
      loaderRedux.actions.addMessage({
        type: "list-resource-topup-values",
        msg: "Fetching List of Resource Topup Values.",
      }),
    );
    return QuotaPackageApi.listResourceTopupValues(payload.provider_id, payload)
      .then((response) => {
        return response;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-resource-topup-values" }));
      });
  },
  listResourceTopupDetails: (payload) => async (dispatch, getState) => {
    dispatch(
      loaderRedux.actions.addMessage({
        type: "list-resource-topup-details",
        msg: "Fetching List of Resource Topup Details.",
      }),
    );
    const rootState = getState();
    const organisationId = authRedux.getters.selectedOrganisationId(rootState);
    return QuotaPackageApi.listResourceTopupDetails(organisationId, payload.provider_id, payload)
      .then((response) => {
        // NOTE: SET_TOTAL_TOPUP_COUNT didn't exist so replaced with SET_TOTAL_TOPUP_REQUEST_COUNT check vue code for details
        // dispatch(slice.actions.SET_TOTAL_TOPUP_COUNT(response.headers))
        dispatch(slice.actions.SET_TOTAL_TOPUP_REQUEST_COUNT(response.headers));
        return response.data;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-resource-topup-details" }));
      });
  },
  listResourceTopupRequest: (payload) => async (dispatch, getState) => {
    dispatch(
      loaderRedux.actions.addMessage({
        type: "list-resource-topup-request",
        msg: "Fetching List of Resource Topup Request.",
      }),
    );
    const rootState = getState();
    const organisation_id = authRedux.getters.selectedOrganisationId(rootState);
    return QuotaPackageApi.listResourceTopupRequest({ ...payload, organisation_id })
      .then((response) => {
        dispatch(slice.actions.SET_TOTAL_TOPUP_REQUEST_COUNT(response.headers));
        return response.data;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-resource-topup-request" }));
      });
  },
  requestResourceTopup: (payload) => async (dispatch, getState) => {
    dispatch(loaderRedux.actions.addMessage({ type: "request-resource-topup", msg: "Requesting Resource Topup." }));
    const rootState = getState();
    const organisationId = authRedux.getters.selectedOrganisationId(rootState);
    return QuotaPackageApi.requestResourceTopup(organisationId, payload.provider_id, payload.resourceTopupId)
      .then((response) => {
        return response;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "request-resource-topup" }));
      });
  },
  cancelResourceTopupRequest: (payload) => async (dispatch) => {
    dispatch(
      loaderRedux.actions.addMessage({
        type: "cancel-resource-topup-request",
        msg: "Cancelling Resource Topup Request.",
      }),
    );
    return QuotaPackageApi.cancelResourceTopupRequest(payload.resourceTopupRequestId)
      .then((response) => {
        return response;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "cancel-resource-topup-request" }));
      });
  },
  listResourceTopupWithdrawlRequest: (payload) => async (dispatch, getState) => {
    dispatch(
      loaderRedux.actions.addMessage({
        type: "list-resource-topup-withdrawl-request",
        msg: "Fetching List of Resource Topup Withdrawl Request.",
      }),
    );
    const rootState = getState();
    const organisation_id = authRedux.getters.selectedOrganisationId(rootState);
    return QuotaPackageApi.listResourceTopupWithdrawlRequest({ ...payload, organisation_id })
      .then((response) => {
        dispatch(slice.actions.SET_TOTAL_TOPUP_WITHDRAWN_LIST(response.data));
        dispatch(slice.actions.SET_TOTAL_TOPUP_WITHDRAWN_COUNT(response.headers));
        return response.data;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-resource-topup-withdrawl-request" }));
      });
  },
  requestResourceTopupWithdrawlRequest: (payload) => async (dispatch, getState) => {
    dispatch(
      loaderRedux.actions.addMessage({
        type: "request-resource-topup-withdrawl-request",
        msg: "Requesting Resource Topup Withdrawl Request.",
      }),
    );
    const rootState = getState();
    const organisationId = authRedux.getters.selectedOrganisationId(rootState);
    return QuotaPackageApi.requestResourceTopupWithdrawlRequest(organisationId, payload.provider_id, payload)
      .then((response) => {
        return response;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "request-resource-topup-withdrawl-request" }));
      });
  },
};

export const getters = {
  totalRecords(rootState) {
    const state = rootState[name];
    return state.totalRecords;
  },
  totalTopupRecords(rootState) {
    const state = rootState[name];
    return state.totalTopupRecords;
  },
  totalTopupRequestRecords(rootState) {
    const state = rootState[name];
    return state.totalTopupRequestRecords;
  },
  totalTopupWithdrawnRecords(rootState) {
    const state = rootState[name];
    return state.totalTopupWithdrawnRecords;
  },
  topupWithdrawnList(rootState) {
    const state = rootState[name];
    return state.topupWithdrawnList;
  },
};

export default {
  slice,
  actions,
  getters,
};
