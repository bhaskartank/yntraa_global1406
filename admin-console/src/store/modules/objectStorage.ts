import { createSlice } from "@reduxjs/toolkit";
import ObjectStorageApi from "observability/api/objectStorage";
import { toast } from "react-toastify";

import loaderRedux from "store/modules/loader";

import { apiHeaderTotalCount } from "utilities";

import { GLOBAL_RESET } from "./auth";

const name = "objectStorage";
const initialState = {
  objectStorageOnboardingRequests: { list: null, totalRecords: 0 },
  objectStorageProviders: { list: null, totalRecords: 0 },
  objectStorageBuckets: { list: null, totalRecords: 0 },
  objectStorageQuotaTopups: { list: null, totalRecords: 0 },
  objectStorageResourceTopupRequests: { list: null, totalRecords: 0 },
  objectStorageOnboardedOrganisation: { list: null, totalRecords: 0 },
  objectStorageQuotaDetails: { list: null, totalRecords: 0 },
  objectStorageResourceTopupWithdrawlRequests: { list: null, totalRecords: 0 },
  objectStorageResourceTopups: { list: null, totalRecords: 0 },
  objectStorageQuotaPackage: { list: null, totalRecords: 0 },
  objectStorageActionLogs: { list: null, totalRecords: 0 },
  objectStorageProviderQuotaDetails: { list: null, totalRecords: 0 },
  masterQuotaPackageList: { list: null, totalRecords: 0 },
};

const slice = createSlice({
  name,
  initialState,
  reducers: {
    setObjectStorageOnboardingRequests(state, { payload }) {
      state.objectStorageOnboardingRequests = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setObjectStorageProviders(state, { payload }) {
      state.objectStorageProviders = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setObjectStorageBuckets(state, { payload }) {
      state.objectStorageBuckets = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setObjectStorageQuotaTopups(state, { payload }) {
      state.objectStorageQuotaTopups = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setObjectStorageResourceTopupRequests(state, { payload }) {
      state.objectStorageResourceTopupRequests = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setObjectStorageOnboardedOrganisation(state, { payload }) {
      state.objectStorageOnboardedOrganisation = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setObjectStorageQuotaDetails(state, { payload }) {
      state.objectStorageQuotaDetails = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setObjectStorageResourceTopupWithdrawlRequests(state, { payload }) {
      state.objectStorageResourceTopupWithdrawlRequests = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setObjectStorageResourceTopups(state, { payload }) {
      state.objectStorageResourceTopups = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setObjectStorageQuotaPackage(state, { payload }) {
      state.objectStorageQuotaPackage = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setObjectStorageActionLogs(state, { payload }) {
      state.objectStorageActionLogs = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setObjectStorageProviderQuotaDetails(state, { payload }) {
      state.objectStorageProviderQuotaDetails = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
    },
    setMasterQuotaPackageList(state, { payload }) {
      state.masterQuotaPackageList = { list: payload.data, totalRecords: apiHeaderTotalCount(payload.headers) };
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
  objectStorageOnboardingRequests: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-object-storage-onboarding-requests", msg: "Loading Object Storage Onboarding Requests!" }));

    return ObjectStorageApi.objectStorageOnboardingRequests(payload)
      .then((response) => {
        dispatch(slice.actions.setObjectStorageOnboardingRequests(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-object-storage-onboarding-requests" }));
      });
  },
  objectStorageProviders: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-object-storage-providers", msg: "Loading Object Storage Providers!" }));

    return ObjectStorageApi.objectStorageProviders(payload)
      .then((response) => {
        dispatch(slice.actions.setObjectStorageProviders(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-object-storage-providers" }));
      });
  },
  objectStorageBuckets: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-object-storage-buckets", msg: "Loading Object Storage Buckets!" }));

    return ObjectStorageApi.objectStorageBuckets(payload)
      .then((response) => {
        dispatch(slice.actions.setObjectStorageBuckets(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-object-storage-buckets" }));
      });
  },
  objectStorageQuotaTopups: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-object-storage-quota-topups", msg: "Loading Object Storage Quota Topups!" }));
    return ObjectStorageApi.objectStorageQuotaTopups(payload)
      .then((response) => {
        dispatch(slice.actions.setObjectStorageQuotaTopups(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-object-storage-quota-topups" }));
      });
  },
  objectStorageResourceTopups: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-object-storage-resource-topups", msg: "Loading Object Storage Resource Topups!" }));
    return ObjectStorageApi.objectStorageResourceTopups(payload)
      .then((response) => {
        dispatch(slice.actions.setObjectStorageResourceTopups(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-object-storage-resource-topups" }));
      });
  },
  objectStorageResourceTopupRequests: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "resource-topup-requests", msg: "Loading Resource Topup Requests!" }));
    return ObjectStorageApi.objectStorageResourceTopupRequests(payload)
      .then((response) => {
        dispatch(slice.actions.setObjectStorageResourceTopupRequests(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "resource-topup-requests" }));
      });
  },
  objectStorageResourceTopupWithdrawlRequests: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "topup-withdrawl-requests", msg: "Loading Topup Withdrawl Requests!" }));
    return ObjectStorageApi.objectStorageResourceTopupWithdrawlRequests(payload)
      .then((response) => {
        dispatch(slice.actions.setObjectStorageResourceTopupWithdrawlRequests(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "topup-withdrawl-requests" }));
      });
  },
  attachResourceTopup: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "attach-resource-topup", msg: "Attaching Resource Topups!" }));
    return ObjectStorageApi.attachResourceTopup(payload?.objstorage_provider_id, payload.resource_topup_id, payload)
      .then((response) => {
        toast.success("Resource Topup Attached Successfully!");
        return response?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "attach-resource-topup" }));
      });
  },
  approveRejectResourceTopup: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "approve/reject-resource-topup", msg: "Request In Progress!" }));
    return ObjectStorageApi.approveRejectResourceTopup(payload?.resource_topup_request_id, payload?.action, payload?.remarks)
      .then((response) => {
        toast.success(payload?.action === "reject" ? "Topup Request Rejected Successfully!" : "Topup Request Approved Successfully!");
        return response?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "approve/reject-resource-topup" }));
      });
  },
  approveRejectWithdrawlTopup: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "approve/reject-withdrawl-topup", msg: "Request In Progress!" }));
    return ObjectStorageApi.approveRejectWithdrawlTopup(payload?.resource_topup_request_id, payload?.action, payload?.remarks)
      .then((response) => {
        toast.success(payload?.action === "reject" ? "Topup Withdrawl Request Rejected Successfully!" : "Topup Withdrawl Request Approved Successfully!");
        return response?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "approve/reject-withdrawl-topup" }));
      });
  },
  detachResourceTopup: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "detach-resource-topup", msg: "Detaching Resource Topups!" }));
    return ObjectStorageApi.detachResourceTopup(payload?.objstorage_provider_id, payload.resource_topup_id)
      .then((response) => {
        toast.success("Resource Topup Detached Successfully!");
        return response?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "detach-resource-topup" }));
      });
  },

  objectStorageOnboardedOrganisation: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "onboarded-org-details", msg: "Loading Onboarded Organisation Details!" }));
    return ObjectStorageApi.objectStorageOnboardedOrganisation(payload)
      .then((response) => {
        dispatch(slice.actions.setObjectStorageOnboardedOrganisation(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "onboarded-org-details" }));
      });
  },

  objectStorageQuotaDetails: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "quota-details", msg: "Loading Quota Details!" }));
    return ObjectStorageApi.objectStorageQuotaDetails(payload?.org_id, payload)
      .then((response) => {
        dispatch(slice.actions.setObjectStorageQuotaDetails(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "quota-details" }));
      });
  },

  objectStorageActionLogsRequests: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-object-storage-action-logs", msg: "Loading Object Storage Action Logs Requests!" }));

    return ObjectStorageApi.objectStorageActionLogsRequests(payload)
      .then((response) => {
        dispatch(slice.actions.setObjectStorageActionLogs(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-object-storage-action-logs" }));
      });
  },
  exportObjectStorageActionLogsRequests: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-object-storage-action-logs", msg: "Exporting Object Storage Action Logs List!" }));

    return ObjectStorageApi.objectStorageActionLogsRequests()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-object-storage-action-logs" }));
      });
  },
  objectStorageQuotaPackageRequests: (payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-object-storage-quota-package-request", msg: "Loading Object Storage Quota Package Requests!" }));

    return ObjectStorageApi.objectStorageQuotaPackageRequests(payload)
      .then((response) => {
        dispatch(slice.actions.setObjectStorageQuotaPackage(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-object-storage-quota-package-request" }));
      });
  },
  exportObjectStorageQuotaPackageRequests: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-object-storage-quota-package-requests", msg: "Exporting Object Storage Quota Package Requests List!" }));

    return ObjectStorageApi.objectStorageQuotaPackageRequests()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-object-storage-quota-package-requests" }));
      });
  },
  exportObjectStorageOnboardingRequests: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-object-storage-onboarding-requests", msg: "Exporting Object Storage Quota Package Requests List!" }));

    return ObjectStorageApi.objectStorageOnboardingRequests()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-object-storage-onboarding-requests" }));
      });
  },
  exportObjectStorageProviders: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-object-storage-providers", msg: "Exporting Object Storage Providers List!" }));

    return ObjectStorageApi.objectStorageProviders()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-object-storage-providers" }));
      });
  },
  exportObjectStorageBuckets: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-object-storage-buckets", msg: "Exporting Object Storage Buckets List!" }));

    return ObjectStorageApi.objectStorageBuckets()
      .then((response) => {
        return response.data?.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-object-storage-buckets" }));
      });
  },
  rejectObjStorageOnboardRequest: (requestId: any, action, payload: any) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "reject-obj-storage-onboard-request", msg: "Rejecting Object Storage Onboard Request!" }));
    return ObjectStorageApi.rejectObjStorageOnboardRequest(requestId, action, payload)
      .then(() => {
        toast.success("Object Storage Onboard Request Rejected Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "reject-obj-storage-onboard-request" }));
      });
  },
  approveObjStorageOnboardRequest: (requestId: any, action, payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "approve-obj-storage-onboard-request", msg: "Approving Object Storage Onboarding Request!" }));
    return ObjectStorageApi.approveObjStorageOnboardRequest(requestId, action, payload)
      .then(() => {
        toast.success("Object Storage Onboard Request Approved Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "approve-obj-storage-onboard-request" }));
      });
  },
  rejectObjStorageQuotaPackageRequest: (requestId: any, action, payload: any) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "reject-obj-storage-quota-package-request", msg: "Rejecting Object Storage Quota Package Request!" }));
    return ObjectStorageApi.rejectObjStorageQuotaPackageRequest(requestId, action, payload)
      .then(() => {
        toast.success("Object Storage Quota Package Request Rejected Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "reject-obj-storage-quota-package-request" }));
      });
  },
  approveObjStorageQuotaPackageRequest: (requestId: any, action) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "approve-obj-storage-quota-package-request", msg: "Approving Object Storage Quota Package Request!" }));
    return ObjectStorageApi.approveObjStorageQuotaPackageRequest(requestId, action)
      .then(() => {
        toast.success("Object Storage Quota Package Request Approved Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "approve-obj-storage-quota-package-request" }));
      });
  },

  objectStorageProvidersQuotaDetails: (objectStorageProviderId, payload) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "quota-details", msg: "Loading Quota Details!" }));
    return ObjectStorageApi.objectStorageProvidersQuotaDetails(objectStorageProviderId, payload)
      .then((response) => {
        dispatch(slice.actions.setObjectStorageProviderQuotaDetails(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "quota-details" }));
      });
  },

  exportObjectStorageProvidersQuotaDetails: (objectStorageProviderId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "exporting-quota-details", msg: "Exporting Object Storage Quota Details!" }));

    return ObjectStorageApi.objectStorageProvidersQuotaDetails(objectStorageProviderId)
      .then((response) => {
        return response.data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "exporting-quota-details" }));
      });
  },

  attachProviderQuota: (providerId, quotaPackageId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "provider-attach-quota", msg: "Attaching Quota!" }));

    return ObjectStorageApi.attachProviderQuota(providerId, quotaPackageId)
      .then(() => {
        toast.success("Quota Attached Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "provider-attach-quota" }));
      });
  },

  detachProviderQuota: (objectStorageProviderId, quotaPackageId) => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "provider-detach-quota", msg: "Detaching Quota!" }));

    return ObjectStorageApi.detachProviderQuota(objectStorageProviderId, quotaPackageId)
      .then(() => {
        toast.success("Quota Detached Successfully!");
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "provider-detach-quota" }));
      });
  },

  masterQuotaPackageList: () => (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "list-master-quota-packages", msg: "Loading Master Quota Packages!" }));

    return ObjectStorageApi.masterQuotaPackageList()
      .then((response) => {
        dispatch(slice.actions.setMasterQuotaPackageList(response));
      })
      .catch((error) => console.error(error))
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "list-master-quota-packages" }));
      });
  },
};

const getters = {
  objectStorageOnboardingRequests(rootState) {
    const state = rootState[name];
    return state.objectStorageOnboardingRequests;
  },
  objectStorageQuotaPackage(rootState) {
    const state = rootState[name];
    return state.objectStorageQuotaPackage;
  },
  objectStorageProviders(rootState) {
    const state = rootState[name];
    return state.objectStorageProviders;
  },
  objectStorageBuckets(rootState) {
    const state = rootState[name];
    return state.objectStorageBuckets;
  },
  objectStorageActionLogs(rootState) {
    const state = rootState[name];
    return state.objectStorageActionLogs;
  },
  objectStorageQuotaTopups(rootState) {
    const state = rootState[name];
    return state.objectStorageQuotaTopups;
  },
  objectStorageResourceTopupRequests(rootState) {
    const state = rootState[name];
    return state.objectStorageResourceTopupRequests;
  },
  objectStorageOnboardedOrganisation(rootState) {
    const state = rootState[name];
    return state.objectStorageOnboardedOrganisation;
  },
  objectStorageQuotaDetails(rootState) {
    const state = rootState[name];
    return state.objectStorageQuotaDetails;
  },
  objectStorageResourceTopupWithdrawlRequests(rootState) {
    const state = rootState[name];
    return state.objectStorageResourceTopupWithdrawlRequests;
  },
  objectStorageResourceTopups(rootState) {
    const state = rootState[name];
    return state.objectStorageResourceTopups;
  },
  objectStorageProviderQuotaDetails(rootState) {
    const state = rootState[name];
    return state.objectStorageProviderQuotaDetails;
  },
  masterQuotaPackageList(rootState) {
    const state = rootState[name];
    return state.masterQuotaPackageList;
  },
};

export default {
  actions,
  getters,
  slice,
};
