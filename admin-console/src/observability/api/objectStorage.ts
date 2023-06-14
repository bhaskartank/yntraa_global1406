import qs from "qs";

import apiInstance from "utilities/api";

export default {
  async objectStorageBuckets(queryParams = {}) {
    return await apiInstance.get(`osaasapi/v1/object-storages/admin/bucket-list/?${qs.stringify(queryParams, { skipNulls: true })}`, {
      baseURL: `${process.env.REACT_APP_API_URL}/`,
    });
  },
  async objectStorageQuotaTopups(payload) {
    return await apiInstance.get(`osaasapi/v1/object-storages/admin/osaas-provider/resource-topup/list/?${qs.stringify(payload, { skipNulls: true })}`, {
      baseURL: `${process.env.REACT_APP_API_URL}/`,
    });
  },
  async objectStorageResourceTopups(payload) {
    return await apiInstance.get(`osaasapi/v1/object-storages/admin/resource-topup/?${qs.stringify(payload, { skipNulls: true })}`, {
      baseURL: `${process.env.REACT_APP_API_URL}/`,
    });
  },
  async objectStorageResourceTopupRequests(payload) {
    return await apiInstance.get(`osaasapi/v1/object-storages/admin/resource-topup-requests-list/?${qs.stringify(payload, { skipNulls: true })}`, {
      baseURL: `${process.env.REACT_APP_API_URL}/`,
    });
  },
  async objectStorageResourceTopupWithdrawlRequests(payload) {
    return await apiInstance.get(`osaasapi/v1/object-storages/admin/resource-topup-withdrawal-requests-list/?${qs.stringify(payload, { skipNulls: true })}`, {
      baseURL: `${process.env.REACT_APP_API_URL}/`,
    });
  },

  async attachResourceTopup(objstorageProviderId, resourceTopupId, payload) {
    return await apiInstance.post(`osaasapi/v1/object-storages/admin/osaas-provider/${objstorageProviderId}/resource-topup/${resourceTopupId}/`, qs.stringify(payload), {
      baseURL: `${process.env.REACT_APP_API_URL}/`,
    });
  },

  async approveRejectResourceTopup(resourceTopupRequestId, action, remarks) {
    return await apiInstance.post(`osaasapi/v1/object-storages/admin/resource_topup_request/${resourceTopupRequestId}/${action}/`, qs.stringify(remarks ? { remarks } : {}), {
      baseURL: `${process.env.REACT_APP_API_URL}/`,
    });
  },
  async approveRejectWithdrawlTopup(resourceTopupWdRequestId, action, remarks) {
    return await apiInstance.post(
      `osaasapi/v1/object-storages/admin/resource_topup_withdrawal_request/${resourceTopupWdRequestId}/${action}/`,
      qs.stringify(remarks ? { remarks } : {}),
      {
        baseURL: `${process.env.REACT_APP_API_URL}/`,
      },
    );
  },
  async detachResourceTopup(objStorageProviderId, resourceTopupId) {
    return await apiInstance.delete(`osaasapi/v1/object-storages/admin/osaas-provider/${objStorageProviderId}/resource-topup/${resourceTopupId}/`, {
      baseURL: `${process.env.REACT_APP_API_URL}/`,
    });
  },
  async objectStorageOnboardingRequests(queryParams = {}) {
    return await apiInstance.get(`osaasapi/v1/object-storages/admin/organisation-onboarding-request/?${qs.stringify(queryParams, { skipNulls: true })}`, {
      baseURL: `${process.env.REACT_APP_API_URL}/`,
    });
  },
  async objectStorageQuotaPackageRequests(queryParams = {}) {
    return await apiInstance.get(`osaasapi/v1/quotapackage/admin/quotapackage_update_request/?${qs.stringify(queryParams, { skipNulls: true })}`, {
      baseURL: `${process.env.REACT_APP_API_URL}/`,
    });
  },
  async objectStorageActionLogsRequests(queryParams = {}) {
    return await apiInstance.get(`osaasapi/v1/audit-trails/admin/audit-trail-logs-list/?${qs.stringify(queryParams, { skipNulls: true })}`, {
      baseURL: `${process.env.REACT_APP_API_URL}/`,
    });
  },
  async objectStorageProviders(queryParams = {}) {
    return await apiInstance.get(`osaasapi/v1/object-storages/admin/object-storage-provider-list/?${qs.stringify(queryParams, { skipNulls: true })}`, {
      baseURL: `${process.env.REACT_APP_API_URL}/`,
    });
  },
  async rejectObjStorageOnboardRequest(requestId, action, payload) {
    return await apiInstance.get(`osaasapi/v1/object-storages/admin/onboarding/${requestId}/${action}/?${qs.stringify(payload, { skipNulls: true })}`, {
      baseURL: `${process.env.REACT_APP_API_URL}/`,
    });
  },
  async approveObjStorageOnboardRequest(requestId, action, payload) {
    return await apiInstance.get(`osaasapi/v1/object-storages/admin/onboarding/${requestId}/${action}/?${qs.stringify(payload, { skipNulls: true })}`, {
      baseURL: `${process.env.REACT_APP_API_URL}/`,
    });
  },
  async rejectObjStorageQuotaPackageRequest(requestId, action, payload) {
    return await apiInstance.post(`osaasapi/v1/quotapackage/admin/quotapackageupdate/${requestId}/${action}`, qs.stringify(payload, { skipNulls: true }), {
      baseURL: `${process.env.REACT_APP_API_URL}/`,
    });
  },
  async approveObjStorageQuotaPackageRequest(requestId, action, payload = null) {
    return await apiInstance.post(`osaasapi/v1/quotapackage/admin/quotapackageupdate/${requestId}/${action}`, qs.stringify(payload, { skipNulls: true }), {
      baseURL: `${process.env.REACT_APP_API_URL}/`,
    });
  },
  async objectStorageOnboardedOrganisation(payload) {
    return await apiInstance.get(`osaasapi/v1/object-storages/admin/osaas-organisation/onbaorded-organisation-list/?${qs.stringify(payload, { skipNulls: true })}`, {
      baseURL: `${process.env.REACT_APP_API_URL}/`,
    });
  },
  async objectStorageQuotaDetails(orgId, payload) {
    return await apiInstance.get(`osaasapi/v1/quotapackage/admin/${orgId}/orgnquotapackage/?${qs.stringify(payload, { skipNulls: true })}`, {
      baseURL: `${process.env.REACT_APP_API_URL}/`,
    });
  },
  async objectStorageProvidersQuotaDetails(objectStorageProviderId, payload = {}) {
    return await apiInstance.get(`osaasapi/v1/quotapackage/admin/${objectStorageProviderId}/quotapackage/?${qs.stringify(payload, { skipNulls: true })}`, {
      baseURL: `${process.env.REACT_APP_API_URL}/`,
    });
  },
  async attachProviderQuota(objectStorageProviderId, quotaPackageId) {
    return await apiInstance.post(
      process.env.REACT_APP_API_URL + `/osaasapi/v1/quotapackage/admin/quotapackage/${quotaPackageId}/object-storage-provider/${objectStorageProviderId}/`,
    );
  },
  async detachProviderQuota(objectStorageProviderId, quotaPackageId) {
    return await apiInstance.delete(`osaasapi/v1/quotapackage/admin/quotapackage/${quotaPackageId}/object-storage-provider/${objectStorageProviderId}/`, {
      baseURL: `${process.env.REACT_APP_API_URL}/`,
    });
  },
  async masterQuotaPackageList() {
    return await apiInstance.get(`osaasapi/v1/quotapackage/admin/quota-packages`, {
      baseURL: `${process.env.REACT_APP_API_URL}/`,
    });
  },
};
