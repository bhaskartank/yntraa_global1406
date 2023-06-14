import { createSlice } from "@reduxjs/toolkit";
import quotaPackagesApi from "observability/api/quotaPackages";
import { toast } from "react-toastify";

import loaderRedux from "store/modules/loader";

import { apiHeaderTotalCount } from "utilities";

import { GLOBAL_RESET } from "./auth";

const name = "quotaPackages";
const initialState = {
  quotaPackageRequests: { list: null, totalRecords: 0 },
  topupWithdrawalRequests: { list: null, totalRecords: 0 },
  topupQuotaRequests: { list: [], totalRecords: 0 },
  masterBaseQuota: { list: [], totalRecords: 0 },
  masterTopupQuota: { list: [], totalRecords: 0 },
};

const slice = createSlice({
  name,
  initialState,
  reducers: {
    setQuotaPackageRequests(state, { payload }) {
      state.quotaPackageRequests = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setTopupWithdrawalRequests(state, { payload }) {
      state.topupWithdrawalRequests = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setTopupQuotaRequests(state, { payload }) {
      state.topupQuotaRequests = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setMasterBaseQuota(state, { payload }) {
      state.masterBaseQuota = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setMasterTopupQuota(state, { payload }) {
      state.masterTopupQuota = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
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
  quotaPackageRequests: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-update-quota-package-requests", msg: "Loading Update Quota Package Requests!" }));

    return quotaPackagesApi
      .quotaPackageRequests(payload)
      .then((response) => {
        dispatch(slice.actions.setQuotaPackageRequests(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-update-quota-package-requests" }));
      });
  },
  exportQuotaPackageRequests: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-update-quota-package-requests", msg: "Exporting Update Quota Package Request List!" }));

    return quotaPackagesApi
      .quotaPackageRequests()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-update-quota-package-requests" }));
      });
  },
  topupWithdrawalRequests: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-withdrawal-quota-package-requests", msg: "Loading Withdrawal Quota Package Requests!" }));

    return quotaPackagesApi
      .topupWithdrawalRequests(payload)
      .then((response) => {
        dispatch(slice.actions.setTopupWithdrawalRequests(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-withdrawal-quota-package-requests" }));
      });
  },
  exportTopupWithdrawalRequests: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-withdrawal-quota-package-requests", msg: "Exporting Withdrawal Quota Package Request List!" }));

    return quotaPackagesApi
      .topupWithdrawalRequests()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-withdrawal-quota-package-requests" }));
      });
  },
  topupQuotaRequests:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-provider-quota-topups", msg: "Loading Topup Quota Requests!" }));

      return quotaPackagesApi
        .topupQuotaRequests(queryParams)
        .then((response) => {
          dispatch(slice.actions.setTopupQuotaRequests(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-provider-quota-topups" }));
        });
    },
  exportTopupQuotaRequests: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-provider-quota-topups", msg: "Exporting Topup Quota Requests!" }));

    return quotaPackagesApi
      .topupQuotaRequests()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-provider-quota-topups" }));
      });
  },
  masterBaseQuota:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-master-base-quota", msg: "Loading Master Topup Quota Requests!" }));

      return quotaPackagesApi
        .masterBaseQuota(queryParams)
        .then((response) => {
          dispatch(slice.actions.setMasterBaseQuota(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-master-base-quota" }));
        });
    },
  exportMasterBaseQuota: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-master-base-quota", msg: "Exporting Master Topup Quota Requests!" }));

    return quotaPackagesApi
      .masterBaseQuota()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-master-base-quota" }));
      });
  },
  masterTopupQuota:
    (queryParams = {}) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "list-master-quota-topups", msg: "Loading Master Topup Quota Requests!" }));

      return quotaPackagesApi
        .masterTopupQuota(queryParams)
        .then((response) => {
          dispatch(slice.actions.setMasterTopupQuota(response));
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "list-master-quota-topups" }));
        });
    },
  exportMasterTopupQuota: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-master-quota-topups", msg: "Exporting Master Topup Quota Requests!" }));

    return quotaPackagesApi
      .masterTopupQuota()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-master-quota-topups" }));
      });
  },
  approveQuotaPackageUpdateRequest: (requestId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "approve-quota-package-update-request", msg: "Approving Quota Package Update Request!" }));

    return quotaPackagesApi
      .approveQuotaPackageUpdateRequest(requestId)
      .then(() => {
        toast.success("Quota Package Update Request Approved Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "approve-quota-package-update-request" }));
      });
  },
  rejectQuotaPackageUpdateRequest:
    (requestId, payload = null) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "reject-quota-package-update-request", msg: "Rejecting Quota Package Update Request!" }));

      return quotaPackagesApi
        .rejectQuotaPackageUpdateRequest(requestId, payload)
        .then(() => {
          toast.success("Quota Package Update Request Rejected Successfully!");
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "reject-quota-package-update-request" }));
        });
    },
  approveResourceTopupRequest: (organisationId, providerId, requestId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "approve-resource-topup-request", msg: "Approving Resource Topup Request!" }));

    return quotaPackagesApi
      .approveResourceTopupRequest(organisationId, providerId, requestId)
      .then(() => {
        toast.success("Resource Topup Request Approved Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "approve-resource-topup-request" }));
      });
  },
  rejectResourceTopupRequest:
    (organisationId, providerId, requestId, payload = null) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "reject-resource-topup-request", msg: "Rejecting Resource Topup Request!" }));

      return quotaPackagesApi
        .rejectResourceTopupRequest(organisationId, providerId, requestId, payload)
        .then(() => {
          toast.success("Resource Topup Request Rejected Successfully!");
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "reject-resource-topup-request" }));
        });
    },
  approveResourceTopupWithdrawalRequest: (organisationId, providerId, requestId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "approve-resource-topup-withdrawal-request", msg: "Approving Resource Topup Withdrawal Request!" }));

    return quotaPackagesApi
      .approveResourceTopupWithdrawalRequest(organisationId, providerId, requestId)
      .then(() => {
        toast.success("Resource Topup Withdrawal Request Approved Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "approve-resource-topup-withdrawal-request" }));
      });
  },
  rejectResourceTopupWithdrawalRequest:
    (organisationId, providerId, requestId, payload = null) =>
    (dispatch) => {
      dispatch(loaderRedux.actions.addMessage({ type: "reject-resource-topup-withdrawal-request", msg: "Rejecting Resource Topup Withdrawal Request!" }));

      return quotaPackagesApi
        .rejectResourceTopupWithdrawalRequest(organisationId, providerId, requestId, payload)
        .then(() => {
          toast.success("Resource Topup Withdrawal Request Rejected Successfully!");
        })
        .catch((error) => console.error(error))
        .finally(() => {
          dispatch(loaderRedux.actions.removeMessage({ type: "reject-resource-topup-withdrawal-request" }));
        });
    },
};

const getters = {
  quotaPackageRequests(rootState) {
    const state = rootState[name];
    return state.quotaPackageRequests;
  },
  topupWithdrawalRequests(rootState) {
    const state = rootState[name];
    return state.topupWithdrawalRequests;
  },
  topupQuotaRequests(rootState) {
    const state = rootState[name];
    return state.topupQuotaRequests;
  },
  masterBaseQuota(rootState) {
    const state = rootState[name];
    return state.masterBaseQuota;
  },
  masterTopupQuota(rootState) {
    const state = rootState[name];
    return state.masterTopupQuota;
  },
};

export default {
  actions,
  getters,
  slice,
};
