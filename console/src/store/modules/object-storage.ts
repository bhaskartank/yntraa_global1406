import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import ObjectStorageApi from "../../api/object-storage";
import authRedux, { THE_GREAT_RESET } from "./auth";
import loaderRedux from "./loader";

const name = "objectStorage";
const initialState = {
  objectStorageProviderId: null,
  objectStorageOrgId: null,
  list: [],
  topupList: [],
  quotaRequestList: [],
  withdrawnTopupList: [],
  totalRecords: 0,
  totalTopupRecords: 0,
  totalQuotaRequestRecords: 0,
  totalWithdrawnTopupRecords: 0,
  // new
  onboardedOrgDetails: null,
  providers: [],
  totalProvidersCount: 0,
  objectStorageUsage: null,
  latestBucketUsage: null,
};

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    SET_OBJECT_STORAGE_PROVIDER_ID(state, { payload: objectStorageProviderId }) {
      state.objectStorageProviderId = objectStorageProviderId;
    },
    SET_OBJECT_STORAGE_ORG_ID(state, { payload: objectStorageOrgId }) {
      state.objectStorageOrgId = objectStorageOrgId;
    },
    SET_BUCKETS_LIST(state, { payload }) {
      state.list = payload;
    },
    SET_TOPUP_LIST(state, { payload }) {
      state.topupList = payload;
    },
    SET_QUOTA_REQUEST_LIST(state, { payload }) {
      state.quotaRequestList = payload;
    },
    SET_TOTAL_QUOTA_REQUEST_COUNT(state, { payload }) {
      state.totalQuotaRequestRecords = payload && !!payload["x-total-count"] ? parseInt(payload["x-total-count"], 10) : 0;
    },
    SET_WITHDRAWN_TOPUP_LIST(state, { payload }) {
      state.withdrawnTopupList = payload;
    },
    SET_TOTAL_COUNT(state, { payload }) {
      state.totalRecords = payload && !!payload["x-total-count"] ? parseInt(payload["x-total-count"], 10) : 0;
    },
    SET_TOTAL_TOPUP_COUNT(state, { payload }) {
      state.totalTopupRecords = payload && !!payload["x-total-count"] ? parseInt(payload["x-total-count"], 10) : 0;
    },
    SET_TOTAL_WITHDRAWN_TOPUP_COUNT(state, { payload }) {
      state.totalWithdrawnTopupRecords = payload && !!payload["x-total-count"] ? parseInt(payload["x-total-count"], 10) : 0;
    },
    // new
    SET_ORG_DETAIL(state, { payload }) {
      state.onboardedOrgDetails = payload;
    },
    SET_PROVIDERS_LIST(state, { payload }) {
      state.providers = payload;
    },
    SET_PROVIDERS_TOTAL_COUNT(state, { payload }) {
      state.totalProvidersCount = payload && !!payload["x-total-count"] ? parseInt(payload["x-total-count"], 10) : 0;
    },
    SET_OBJECT_STORAGE_USAGE(state, { payload }) {
      state.objectStorageUsage = payload;
    },
    SET_LATEST_BUCKET_USAGE(state, { payload }) {
      state.latestBucketUsage = payload;
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
  listBuckets: (payload) => async (dispatch) => {
    if (!payload?.objectStorageOrgId || !payload?.objectStorageProviderId) return;

    dispatch(loaderRedux.actions.addMessage({ type: "bucket-list", msg: "Fetching Bucket List" }));
    return ObjectStorageApi.listBuckets(payload?.objectStorageOrgId, payload?.objectStorageProviderId, payload)
      .then((response) => {
        dispatch(slice.actions.SET_BUCKETS_LIST(response.data));
        dispatch(slice.actions.SET_TOTAL_COUNT(response.headers));
        return response.data;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "bucket-list" }));
      });
  },

  listTopups: (payload) => async (dispatch) => {
    if (!payload?.objstorage_provider_id && !payload?.organisation_id) return;

    dispatch(loaderRedux.actions.addMessage({ type: "topup-list", msg: "Fetching Topup List" }));
    return ObjectStorageApi.listTopups(payload)
      .then((response) => {
        dispatch(slice.actions.SET_TOPUP_LIST(response.data.data));
        dispatch(slice.actions.SET_TOTAL_TOPUP_COUNT(response.headers));
        return response.data.data;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "topup-list" }));
      });
  },
  updateRequestQuotaStatusList: (payload) => async (dispatch) => {
    dispatch(
      loaderRedux.actions.addMessage({
        type: "requested-quota-status-list",
        msg: "Fetching current request status!",
      }),
    );
    return ObjectStorageApi.updateQuotaStatusList(payload?.objectStorageOrgId, payload?.objectStorageProviderId, payload)
      .then((response) => {
        dispatch(slice.actions.SET_QUOTA_REQUEST_LIST(response.data.data));
        dispatch(slice.actions.SET_TOTAL_QUOTA_REQUEST_COUNT(response.headers));
        return response.data.data;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "requested-quota-status-list" }));
      });
  },
  resourceUtilization: (payload) => async (dispatch) => {
    dispatch(
      loaderRedux.actions.addMessage({
        type: "object-storage-resource-utilization",
        msg: "Fetching Object Storage Resource Utilization!",
      }),
    );
    return ObjectStorageApi.resourceUtilization(payload?.objectStorageOrgId, payload)
      .then((response) => {
        return response.data;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "object-storage-resource-utilization" }));
      });
  },
  listWithdrawnTopups: (payload) => async (dispatch) => {
    if (!payload?.objstorage_provider_id && !payload?.organisation_id) return;

    dispatch(loaderRedux.actions.addMessage({ type: "withdrawn-topup-list", msg: "Fetching Withdrawn Topup List" }));
    return ObjectStorageApi.listWithdrawnTopups({
      ...payload,
    })
      .then((response) => {
        dispatch(slice.actions.SET_WITHDRAWN_TOPUP_LIST(response.data));
        dispatch(slice.actions.SET_TOTAL_WITHDRAWN_TOPUP_COUNT(response.headers));
        return response.data.data;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "withdrawn-topup-list" }));
      });
  },
  listTopupLabels: (payload) => async (dispatch) => {
    if (!payload?.objectStorageProviderId) return;

    dispatch(loaderRedux.actions.addMessage({ type: "topup-labels", msg: "Fetching Topup Labels" }));
    return ObjectStorageApi.listTopupsLabels({
      objstorage_provider_id: payload?.objectStorageProviderId,
    })
      .then((response) => {
        return response.data;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "topup-labels" }));
      });
  },
  requestTopup: (payload) => async (dispatch) => {
    if (!payload?.organisation_id && !payload?.objstorage_provider_id) return;

    dispatch(loaderRedux.actions.addMessage({ type: "request-topup", msg: "Requesting for Topup" }));
    return ObjectStorageApi.requestTopup({
      organisation_id: payload?.organisation_id,
      objstorage_provider_id: payload?.objstorage_provider_id,
      payload,
    })
      .then((response) => {
        toast.success("Topup Requested Successfully !");
        return response.data;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "request-topup" }));
      });
  },
  withdrawTopup: (payload) => async (dispatch) => {
    if (!payload?.organisation_id && !payload?.objstorage_provider_id) return;

    dispatch(loaderRedux.actions.addMessage({ type: "withdraw-topup", msg: "Requesting for withdraw Topup" }));
    return ObjectStorageApi.withdrawTopup({
      organisation_id: payload?.organisation_id,
      objstorage_provider_id: payload?.objstorage_provider_id,
      payload,
    })
      .then((response) => {
        toast.success("Withdrawal Request Has Been Submitted Successfully !");
        return response.data;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "withdraw-topup" }));
      });
  },

  getObjectStorageProviderList: () => async (dispatch, getState) => {
    const rootState = getState();
    const providerId = authRedux.getters.selectedProviderId(rootState);
    dispatch(
      loaderRedux.actions.addMessage({
        type: "object-storage-provider-list",
        msg: "Fetching Object Storage Provider List",
      }),
    );
    return ObjectStorageApi.getObjectStorageProviderList(providerId)
      .then((response) => {
        return response;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "object-storage-provider-list" }));
      });
  },

  setObjectStorageProvider: (payload) => async (dispatch) => {
    dispatch(slice.actions.SET_OBJECT_STORAGE_PROVIDER_ID(payload?.objectStorageProviderId));
    dispatch(slice.actions.SET_OBJECT_STORAGE_ORG_ID(payload?.objectStorageOrgId));
  },

  createBucket: (payload) => async (dispatch, getState) => {
    const rootState = getState();
    const state = rootState[name];
    const objectStorageOrgId = state.objectStorageOrgId;
    const objectStorageProviderId = state.objectStorageProviderId;

    dispatch(loaderRedux.actions.addMessage({ type: "create-bucket", msg: "Creating Bucket" }));
    return ObjectStorageApi.createBucket(objectStorageOrgId, objectStorageProviderId, payload)
      .then((response) => {
        toast.success("Bucket Created Successfully");
        return response;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "create-bucket" }));
      });
  },

  deleteBucket: (payload) => async (dispatch, getState) => {
    const rootState = getState();
    const state = rootState[name];
    const objectStorageProviderId = state.objectStorageProviderId;
    dispatch(loaderRedux.actions.addMessage({ type: "delete-bucket", msg: "Deleting Bucket" }));
    return ObjectStorageApi.deleteBucket(objectStorageProviderId, payload.bucketId)
      .then((response) => {
        toast.success("Bucket Deleted Successfully");
        return response;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "delete-bucket" }));
      });
  },
  cancelQuotaPackageRequest: (payload) => async (dispatch) => {
    dispatch(
      loaderRedux.actions.addMessage({
        type: "cancel-quota-package-request",
        msg: "Cancelling Quota Package Request.",
      }),
    );
    return ObjectStorageApi.cancelQuotaPackageRequest(payload?.quotaPackageRequestId, payload)
      .then((response) => {
        toast.success("Quota Package Request Cancelled Successfully!");
        return response;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "cancel-quota-package-request" }));
      });
  },
  cancelQuotaTopupRequest: (payload) => async (dispatch) => {
    dispatch(
      loaderRedux.actions.addMessage({
        type: "cancel-quota-topup-request",
        msg: "Cancelling Quota Topup Request.",
      }),
    );
    return ObjectStorageApi.cancelQuotaTopupRequest(payload?.resource_topup_request_id, payload)
      .then((response) => {
        toast.success("Quota Topup Request Cancelled Successfully!");
        return response;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "cancel-quota-topup-request" }));
      });
  },

  cancelQuotaTopupWithdrawlRequest: (payload) => async (dispatch) => {
    dispatch(
      loaderRedux.actions.addMessage({
        type: "cancel-quota-topup-withdrawn-request",
        msg: "Cancelling Quota Topup Withdrawn Request.",
      }),
    );
    return ObjectStorageApi.cancelQuotaTopupWithdrawlRequest(payload?.resource_topup_wd_request_id, payload)
      .then((response) => {
        toast.success("Quota Topup Withdrawn Request Cancelled Successfully!");
        return response;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "cancel-quota-topup-withdrawn-request" }));
      });
  },

  getAccessKey: (payload) => async (dispatch, getState) => {
    const rootState = getState();
    const state = rootState[name];
    const objectStorageOrgId = state.objectStorageOrgId;
    const objectStorageProviderId = state.objectStorageProviderId;
    dispatch(loaderRedux.actions.addMessage({ type: "fetch-access-key", msg: "Fetching Access Key" }));
    return ObjectStorageApi.getAccessKey(objectStorageOrgId, objectStorageProviderId, payload.bucketId, payload)
      .then((response) => {
        return response;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "fetch-access-key" }));
      });
  },

  updateBucket: (payload) => async (dispatch, getState) => {
    const rootState = getState();
    const state = rootState[name];
    const objectStorageOrgId = state.objectStorageOrgId;
    const objectStorageProviderId = state.objectStorageProviderId;
    dispatch(loaderRedux.actions.addMessage({ type: "updating-bucket", msg: "Updating Bucket" }));
    return ObjectStorageApi.updateBucket(objectStorageOrgId, objectStorageProviderId, payload.bucketId, payload)
      .then((response) => {
        toast.success("Bucket Usage Details Updated Successfully");
        return response;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "updating-bucket" }));
      });
  },

  latestBucketUsage: (payload) => async (dispatch, getState) => {
    const rootState = getState();
    const state = rootState[name];
    const objectStorageProviderId = state.objectStorageProviderId;
    dispatch(loaderRedux.actions.addMessage({ type: "latest-bucket-details", msg: "Fetching Latest Usage Details" }));
    return ObjectStorageApi.latestBucketUsage(objectStorageProviderId, payload.bucketId)
      .then((response) => {
        dispatch(slice.actions.SET_LATEST_BUCKET_USAGE(response.data));
        return response;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "latest-bucket-details" }));
      });
  },

  getSecretKey: (payload) => async (dispatch, getState) => {
    const rootState = getState();
    const state = rootState[name];
    const objectStorageProviderId = state.objectStorageProviderId;
    dispatch(loaderRedux.actions.addMessage({ type: "fetch-secret-key", msg: "Fetching Secret Key" }));
    return ObjectStorageApi.getSecretKey(objectStorageProviderId, payload.bucketId, payload)
      .then((response) => {
        return response;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "fetch-secret-key" }));
      });
  },

  // new
  fetchOnboaredOrganisationDetail: (payload) => async (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "fetch-on-boarded-org-detail", msg: "Fetching Organisation Details" }));
    return ObjectStorageApi.fetchOnboaredOrganisationDetail({ cloud_reg_acno: payload?.cloudRegAcNo })
      .then((response) => {
        dispatch(slice.actions.SET_ORG_DETAIL(response.data));
        return response.data;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "fetch-on-boarded-org-detail" }));
      });
  },

  fetchProvidersList: (payload) => async (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "fetch-providers", msg: "Fetching Providers" }));
    return ObjectStorageApi.fetchProvidersList(payload)
      .then((response) => {
        dispatch(slice.actions.SET_PROVIDERS_LIST(response.data));
        dispatch(slice.actions.SET_PROVIDERS_TOTAL_COUNT(response.headers));
        return response.data;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "fetch-providers" }));
      });
  },

  fetchObjectStorageUsage: (payload) => async (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "fetch-object-storage-usage", msg: "Fetching Object Storage Usage" }));
    return ObjectStorageApi.fetchObjectStorageUsage(payload?.organisationId, {
      objectstorage_provider_id: payload?.providerId,
    })
      .then((response) => {
        dispatch(slice.actions.SET_OBJECT_STORAGE_USAGE(response.data));
        return response.data;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "fetch-object-storage-usage" }));
      });
  },

  getLatestUsageForAll: () => async (dispatch, getState) => {
    dispatch(loaderRedux.actions.addMessage({ type: "fetch-usage-all-buckets", msg: "Fetching Latest Usage for all Buckets" }));

    const rootState = getState();
    const state = rootState[name];

    const objectStorageOrgId = state.objectStorageOrgId;
    const objectStorageProviderId = state.objectStorageProviderId;

    return ObjectStorageApi.getLatestUsageForAll(objectStorageOrgId, objectStorageProviderId)
      .then((response) => {
        toast.success("Latest Bucket Usage Details Fetched Successfully!");
        return response.data;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "fetch-usage-all-buckets" }));
      });
  },

  objectStorageOnboardingRequest: (payload) => async (dispatch) => {
    dispatch(
      loaderRedux.actions.addMessage({
        type: "onboard-object-storage-request",
        msg: "Please wait. Onboarding Object Storage!",
      }),
    );

    return ObjectStorageApi.objectStorageOnboardingRequest(payload)
      .then((response) => {
        toast.success("Onboarding Request Sent Successfully");
        return response.data;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "onboard-object-storage-request" }));
      });
  },

  listObjectStorageQuotaPackages: () => async (dispatch) => {
    dispatch(
      loaderRedux.actions.addMessage({
        type: "object-storage-quota-packages",
        msg: "Fetching object storage quota packages!",
      }),
    );
    return ObjectStorageApi.listObjectStorageQuotaPackages()
      .then((response) => {
        return response.data;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "object-storage-quota-packages" }));
      });
  },

  listObjectStorageProviderQuotaPackages: (payload) => async (dispatch) => {
    dispatch(
      loaderRedux.actions.addMessage({
        type: "object-storage-provider-quota-packages",
        msg: "Fetching object storage provider's quota packages!",
      }),
    );
    return ObjectStorageApi.listObjectStorageProviderQuotaPackages(payload?.objectstorage_provider_id, payload)
      .then((response) => {
        return response.data;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "object-storage-provider-quota-packages" }));
      });
  },

  updateObjectStorageQuotaPackage: (payload) => async (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "updating-quota-package", msg: "Updating Quota package" }));
    return ObjectStorageApi.updateQuotaPackage(payload?.organisation_id, payload?.objectstorage_provider_id, payload?.quotapackage_id, payload)
      .then((response) => {
        toast.success("Requested for Update Quota Package Successfully !");
        return response;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "updating-quota-package" }));
      });
  },
  requestObjectStorageQuotaPackage: (payload) => async (dispatch) => {
    dispatch(loaderRedux.actions.addMessage({ type: "requesting-quota-package", msg: "Requesting Quota package" }));
    return ObjectStorageApi.updateQuotaPackage(payload?.organisation_id, payload?.objectstorage_provider_id, payload?.quotapackage_id, payload)
      .then((response) => {
        toast.success("Requested for New Quota Package Successfully !");
        return response;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "requesting-quota-package" }));
      });
  },
  listAllProviders: () => async (dispatch) => {
    dispatch(
      loaderRedux.actions.addMessage({
        type: "object-storage-all-providers-list",
        msg: "Fetching object storage all providers list!",
      }),
    );
    return ObjectStorageApi.listAllProviders()
      .then((response) => {
        return response.data;
      })
      .finally(() => {
        dispatch(loaderRedux.actions.removeMessage({ type: "object-storage-all-providers-list" }));
      });
  },

  resetBucketStoredDetails: () => async (dispatch) => {
    dispatch(slice.actions.SET_LATEST_BUCKET_USAGE(null));
  },
};

export const getters = {
  objectStorageProviderId(rootState) {
    const state = rootState[name];
    return state.objectStorageProviderId;
  },

  objectStorageOrgId(rootState) {
    const state = rootState[name];
    return state.objectStorageOrgId;
  },

  list(rootState) {
    const state = rootState[name];
    return state.list;
  },
  topupList(rootState) {
    const state = rootState[name];
    return state.topupList;
  },
  quotaRequestList(rootState) {
    const state = rootState[name];
    return state.quotaRequestList;
  },
  withdrawnTopupList(rootState) {
    const state = rootState[name];
    return state.withdrawnTopupList;
  },
  totalRecords(rootState) {
    const state = rootState[name];
    return state.totalRecords;
  },
  totalTopupRecords(rootState) {
    const state = rootState[name];
    return state.totalTopupRecords;
  },
  totalQuotaRequestRecords(rootState) {
    const state = rootState[name];
    return state.totalQuotaRequestRecords;
  },
  totalWithdrawnTopupRecords(rootState) {
    const state = rootState[name];
    return state.totalWithdrawnTopupRecords;
  },
  onboardedOrgDetails(rootState) {
    const state = rootState[name];
    return state.onboardedOrgDetails;
  },
  latestBucketUsage(rootState) {
    const state = rootState[name];
    return state.latestBucketUsage;
  },
  providers(rootState) {
    const state = rootState[name];
    return state.providers;
  },
  totalProvidersCount(rootState) {
    const state = rootState[name];
    return state.totalProvidersCount;
  },
  objectStorageUsage(rootState) {
    const state = rootState[name];
    return state.objectStorageUsage;
  },
};
export default {
  slice,
  actions,
  getters,
};
