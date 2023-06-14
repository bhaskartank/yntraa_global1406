import qs from "qs";

import apiInstance from "utilities/api";

export default {
  async organisations(queryParams = {}) {
    return await apiInstance.get(`/organisation/organisations-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async organisationOnboardingRequests(queryParams = {}) {
    return await apiInstance.get(`/organisation/organisation-onboarding-requests-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async createOrganisationOnboardingRequest(payload) {
    return await apiInstance.post(`/organisation/admin/organisation-onboarding-request/`, qs.stringify(payload, { skipNulls: true, arrayFormat: "repeat" }));
  },
  async organisationOnboardingChangeRequests(queryParams = {}) {
    return await apiInstance.get(`/organisation/organisations-onboarding-change-requests-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async rejectOrganisationOnboardingRequest(requestId, payload) {
    return await apiInstance.post(`/organisation/organisation-onboarding-request/${requestId}/reject/`, qs.stringify(payload, { skipNulls: true }));
  },
  async approveOrganisationOnboardingRequest(requestId, providerId, queryParams = {}) {
    return await apiInstance.get(`/organisation/organisation-onboarding-request/${requestId}/provider/${providerId}/approve/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async rejectOrganisationOnboardingChangeRequest(requestId, payload) {
    return await apiInstance.post(`/organisation/organisation-onboarding-update-request/${requestId}/reject/`, qs.stringify(payload, { skipNulls: true }));
  },
  async approveOrganisationOnboardingChangeRequest(requestId) {
    return await apiInstance.get(`/organisation/organisation-onboarding-update-request/${requestId}/approve/`);
  },
  async onboardingRequestUserDetails(requestId) {
    return await apiInstance.get(`/organisation/organisation-onboarding-request/${requestId}/users-info/`);
  },
  async onboardingChangeRequestUserDetails(requestId) {
    return await apiInstance.get(`/organisation/organisation-onboarding-update-request/${requestId}/user-info/`);
  },
  //
  async organisationUsers(organisationId, queryParams = {}) {
    return await apiInstance.get(`/organisation/${organisationId}/list-users/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async organisationQuotas(organisationId, queryParams = {}) {
    return await apiInstance.get(`/organisation/${organisationId}/quota-package/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async organisationQuotaTopups(organisationId, providerId) {
    return await apiInstance.get(`/quotapackage/provider/${providerId}/organisation/${organisationId}/quotapackage-topup-details/`);
  },
  async organisationResources(organisationId, providerId, queryParams = {}) {
    return await apiInstance.get(`/resource-action-logs/provider/${providerId}/orgaisation/${organisationId}/resource-stats/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async organisationImages(organisationId, queryParams = {}) {
    return await apiInstance.get(`/organisation/${organisationId}/images-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async organisationFlavors(organisationId, queryParams = {}) {
    return await apiInstance.get(`/organisation/${organisationId}/flavors-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async organisationZones(organisationId, queryParams = {}) {
    return await apiInstance.get(`/organisation/${organisationId}/availability-zone-listing/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async mapZoneToOrganisation(organisationId, providerId, zoneId) {
    return await apiInstance.post(`/organisation/${organisationId}/provider/${providerId}/availability-zones/${zoneId}/mapping/`);
  },
  async deleteImageOrgMapping(organisationId, providerId, imageId) {
    return await apiInstance.delete(`/organisation/organisation/${organisationId}/provider/${providerId}/images/${imageId}/mapping/`);
  },
  async deleteFlavorOrgMapping(organisationId, providerId, flavorId) {
    return await apiInstance.delete(`/organisation/organisation/${organisationId}/provider/${providerId}/flavors/${flavorId}/mapping/`);
  },
};
