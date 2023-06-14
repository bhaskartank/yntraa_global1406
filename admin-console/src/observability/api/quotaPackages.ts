import qs from "qs";

import apiInstance from "utilities/api";

export default {
  async quotaPackageRequests(queryParams = {}) {
    return await apiInstance.get(`/quotapackage/quotapackage-update-requests-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async topupWithdrawalRequests(queryParams = {}) {
    return await apiInstance.get(`/quotapackage/quota-topup-withdrawal-requests-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async topupQuotaRequests(queryParams = {}) {
    return await apiInstance.get(`/quotapackage/quota-topup-requests-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async masterBaseQuota(queryParams = {}) {
    return await apiInstance.get(`/quotapackage/master-quotapackages-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async masterTopupQuota(queryParams = {}) {
    return await apiInstance.get(`/quotapackage/master-quota-topups-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async approveQuotaPackageUpdateRequest(requestId) {
    return await apiInstance.get(`/organisation/quotapackage-update-request/${requestId}/approve/`);
  },
  async rejectQuotaPackageUpdateRequest(requestId, payload) {
    return await apiInstance.post(`/organisation/quotapackage-update-request/${requestId}/reject/`, qs.stringify(payload, { skipNulls: true }));
  },
  async approveResourceTopupRequest(organisationId, providerId, requestId) {
    return await apiInstance.get(`/organisation/${organisationId}/provider/${providerId}/resource-topup-request/${requestId}/approve/`);
  },
  async rejectResourceTopupRequest(organisationId, providerId, requestId, payload) {
    return await apiInstance.post(`/organisation/${organisationId}/provider/${providerId}/resource-topup-request/${requestId}/reject/`, qs.stringify(payload, { skipNulls: true }));
  },
  async approveResourceTopupWithdrawalRequest(organisationId, providerId, requestId) {
    return await apiInstance.get(`/organisation/${organisationId}/provider/${providerId}/resource-topup-withdrawal-request/${requestId}/approve/`);
  },
  async rejectResourceTopupWithdrawalRequest(organisationId, providerId, requestId, payload) {
    return await apiInstance.post(
      `/organisation/${organisationId}/provider/${providerId}/resource-topup-withdrawal-request/${requestId}/reject/`,
      qs.stringify(payload, { skipNulls: true }),
    );
  },
};
