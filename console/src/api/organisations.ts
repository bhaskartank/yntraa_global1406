import apiInstance from "utils/api";

export default {
  async organisations() {
    return await apiInstance.get(`/api/v1/organisation/`);
  },
  async createOrganisation(payload) {
    return await apiInstance.post(`/api/v1/organisation/`, payload);
  },
  async organisationById(id) {
    return await apiInstance.get(`/api/v1/organisation/${id}`);
  },
  async availabilityZones(organisationId, providerId) {
    return await apiInstance.get(`/api/v1/organisation/${organisationId}/${providerId}/zone/`);
  },
};
