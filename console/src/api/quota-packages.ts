import qs from "qs";

import apiInstance from "utils/api";

export default {
  async listQuotaPackages(providerId) {
    return await apiInstance.get(`/api/v1/quotapackage/${providerId}/quotapackage/`);
  },
  async listQuotaPackagesByOrganisation(organisationId, payload) {
    return await apiInstance.get(`/api/v1/organisation/${organisationId}/quotapackage/`, { params: payload });
  },
  async getQuotaPackageDetail(quotaPackageId) {
    return await apiInstance.get(`/api/v1/quotapackage/${quotaPackageId}`);
  },
  async upgradeQuotaPackage(organisationId, providerId, quotaPackageId) {
    return await apiInstance.post(`/api/v1/organisation/${organisationId}/${providerId}/${quotaPackageId}/quotapackage_update_request/`);
  },
  async requestNewQuotaPackage(organisationId, providerId, quotaPackageId) {
    return await apiInstance.post(`/api/v1/organisation/${organisationId}/${providerId}/${quotaPackageId}/request_new_quotapackage/`);
  },
  async getSelectedQuota(organisationId, providerId) {
    return await apiInstance.get(`/api/v1/organisation/${organisationId}/${providerId}/quotapackage/`);
  },
  async getRequestedQuotaPackageId(payload) {
    return await apiInstance.get(`/api/v1/organisation/quotapackage_update_request/`, { params: payload });
  },
  async listResourceTopupLabels(providerId) {
    return await apiInstance.get(`/api/v1/quotapackage/${providerId}/resource_topup_label/`);
  },
  async listResourceTopupValues(providerId, payload) {
    return await apiInstance.get(`/api/v1/quotapackage/${providerId}/resource_topup_value/`, { params: payload });
  },
  async listResourceTopupDetails(organisationId, providerId, payload) {
    return await apiInstance.get(`/api/v1/quotapackage/${organisationId}/${providerId}/resource_topup_details/`, {
      params: payload,
    });
  },
  async listResourceTopupRequest(payload) {
    return await apiInstance.get(`/api/v1/organisation/resource_topup_request/`, { params: payload });
  },
  async requestResourceTopup(organisationId, providerId, resourceTopupId) {
    return await apiInstance.post(`/api/v1/organisation/${organisationId}/${providerId}/${resourceTopupId}/resource_topup_request/`);
  },
  async cancelResourceTopupRequest(resourceTopupRequestId) {
    return await apiInstance.get(`/api/v1/organisation/resource_topup_request/${resourceTopupRequestId}/cancel`);
  },
  async listResourceTopupWithdrawlRequest(payload) {
    return await apiInstance.get(`/api/v1/organisation/resource_topup_withdrawl_request/`, { params: payload });
  },
  async requestResourceTopupWithdrawlRequest(organisationId, providerId, payload) {
    return await apiInstance.post(`/api/v1/organisation/${organisationId}/${providerId}/resource_topup_withdrawl_request/`, qs.stringify(payload));
  },
};
