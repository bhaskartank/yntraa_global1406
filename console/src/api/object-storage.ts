import qs from "qs";

import apiInstance from "utils/api";

export default {
  async listBuckets(objectStorageOrgId, objectstorageProviderId, payload) {
    return await apiInstance.get(`/osaasapi/v1/object-storages/${objectStorageOrgId}/${objectstorageProviderId}/obj-storage-bucket/`, { params: payload });
  },
  async listTopups(payload) {
    return await apiInstance.get(`/osaasapi/v1/object-storages/quota-packages/resource-topup-requests-list/`, {
      params: payload,
    });
  },
  async listWithdrawnTopups(payload) {
    return await apiInstance.get(`/osaasapi/v1/object-storages/quota-packages/resource-topup-withdrawal-requests-list/`, { params: payload });
  },
  async listTopupsLabels(payload) {
    return await apiInstance.get(`/osaasapi/v1/object-storages/quota-packages/osaas-provider/resource-topup/list/`, {
      params: payload,
    });
  },
  async requestTopup({ organisation_id, objstorage_provider_id, payload }) {
    return await apiInstance.post(
      `/osaasapi/v1/object-storages/quota-packages/osaas-organisation/${organisation_id}/osaas-provider/${objstorage_provider_id}/topup_request/`,
      qs.stringify(payload),
    );
  },
  async withdrawTopup({ organisation_id, objstorage_provider_id, payload }) {
    return await apiInstance.post(
      `/osaasapi/v1/object-storages/quota-packages/osaas-organisation/${organisation_id}/osaas-provider/${objstorage_provider_id}/topup_wd_request/`,
      qs.stringify(payload),
    );
  },
  async getObjectStorageProviderList(providerId) {
    const data = { globalprovider_id: providerId };
    return await apiInstance.get(`/osaasapi/v1/object-storages/object-storage-provider`, { params: data });
  },
  async createBucket(onboardedOrganisationId, objectstorageProviderId, payload) {
    return await apiInstance.post(`/osaasapi/v1/object-storages/${onboardedOrganisationId}/${objectstorageProviderId}/obj-storage-bucket/`, qs.stringify(payload));
  },
  async deleteBucket(objectstorageProviderId, bucketId) {
    return await apiInstance.delete(`/osaasapi/v1/object-storages/${objectstorageProviderId}/${bucketId}/bucket`);
  },
  async getAccessKey(objectStorageOrgId, objectstorageProviderId, bucketId, payload) {
    return await apiInstance.post(`/osaasapi/v1/object-storages/${objectstorageProviderId}/${bucketId}/get-access-key/`, qs.stringify(payload));
  },
  async getSecretKey(objectstorageProviderId, bucketId, payload) {
    return await apiInstance.post(`/osaasapi/v1/object-storages/${objectstorageProviderId}/${bucketId}/get-secret-key/`, qs.stringify(payload));
  },
  async updateBucket(objectStorageOrgId, objectstorageProviderId, bucketId, payload) {
    return await apiInstance.post(`/osaasapi/v1/object-storages/${objectstorageProviderId}/${bucketId}/bucket-details`, qs.stringify(payload));
  },
  async updateQuotaPackage(organisation_id, objectstorage_provider_id, quotapackage_id, payload) {
    return await apiInstance.post(
      `/osaasapi/v1/object-storages/quota-packages/${organisation_id}/${objectstorage_provider_id}/${quotapackage_id}/quotapackage_update_request/`,
      qs.stringify(payload),
    );
  },
  async latestBucketUsage(objectstorageProviderId, bucketId) {
    return await apiInstance.get(`/osaasapi/v1/object-storages/${objectstorageProviderId}/${bucketId}/bucket`);
  },
  async fetchOnboaredOrganisationDetail(payload) {
    return await apiInstance.get("/osaasapi/v1/osaas-organisations/onboarded-organisation", { params: payload });
  },
  async fetchProvidersList(payload) {
    return await apiInstance.get(`/osaasapi/v1/object-storages/${payload?.id}/object-storage-provider/`);
  },
  async fetchObjectStorageUsage(organisationId, payload) {
    return await apiInstance.get(`/osaasapi/v1/object-storages/organisation/${organisationId}/resource-utilization/`, {
      params: payload,
    });
  },
  async getLatestUsageForAll(organisationId, providerId) {
    return await apiInstance.get(`/osaasapi/v1/object-storages/${organisationId}/${providerId}/get-current-usage/`);
  },
  async objectStorageOnboardingRequest(payload) {
    return await apiInstance.post(`/osaasapi/v1/osaas-organisations/create-onboarding-requests/`, qs.stringify(payload));
  },
  async listObjectStorageQuotaPackages() {
    return await apiInstance.get(`/osaasapi/v1/object-storages/quota-packages/quota-packages`);
  },
  async listObjectStorageProviderQuotaPackages(objectstorage_provider_id, payload) {
    return await apiInstance.get(`/osaasapi/v1/object-storages/quota-packages/${objectstorage_provider_id}/quotapackage/`, { params: qs.stringify(payload) });
  },
  async listAllProviders() {
    return await apiInstance.get(`/osaasapi/v1/object-storages/user/object-storage-provider`);
  },
  async cancelQuotaPackageRequest(quotapackage_update_request_id, payload) {
    return await apiInstance.get(`/osaasapi/v1/object-storages/quota-packages/update_quotapackage_update_request/${quotapackage_update_request_id}/cancel/`, {
      params: qs.stringify(payload),
    });
  },
  async cancelQuotaTopupRequest(resource_topup_request_id, payload) {
    return await apiInstance.get(`/osaasapi/v1/object-storages/quota-packages/update_resource_topup_request/${resource_topup_request_id}/cancel/`, {
      params: qs.stringify(payload),
    });
  },
  async cancelQuotaTopupWithdrawlRequest(resource_topup_wd_request_id, payload) {
    return await apiInstance.get(`/osaasapi/v1/object-storages/quota-packages/update_resource_topup_withdrawal_request/${resource_topup_wd_request_id}/cancel/`, {
      params: qs.stringify(payload),
    });
  },
  async updateQuotaStatusList(organisation_id, quotapackage_provider_id, payload) {
    return await apiInstance.get(`/osaasapi/v1/object-storages/quota-packages/${organisation_id}/${quotapackage_provider_id}/quotapackage_update_request/`, { params: payload });
  },
  async resourceUtilization(organisation_id, payload) {
    return await apiInstance.get(`/osaasapi/v1/object-storages/organisation/${organisation_id}/resource-utilization/`, {
      params: payload,
    });
  },
};
