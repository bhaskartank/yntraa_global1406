import qs from "qs";

import apiInstance from "utilities/api";

export default {
  async providers() {
    return await apiInstance.get(`providers/providers-list/`);
  },
  async images(queryParams = {}) {
    return await apiInstance.get(`/providers/images-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async flavors(queryParams = {}) {
    return await apiInstance.get(`/providers/flavors-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async zones(queryParams = {}) {
    return await apiInstance.get(`/providers/resource-availability-zones-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async defaultRules(queryParams = {}) {
    return await apiInstance.get(`/providers/default-rules-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async resourceMetrics(queryParams = {}) {
    return await apiInstance.get(`/providers/resource_metrices-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async hypervisors(queryParams = {}) {
    return await apiInstance.get(`/providers/openstack-hypervisors-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async openstackNetworks(queryParams = {}) {
    return await apiInstance.get(`/providers/openstack-networks-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async openstackSubnets(queryParams = {}) {
    return await apiInstance.get(`/providers/openstack-subnet-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async openstackPorts(queryParams = {}) {
    return await apiInstance.get(`/providers/openstack-ports-listing/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async openstackFloatingIPs(queryParams = {}) {
    return await apiInstance.get(`/providers/openstack-floating-ips-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async availableBaseQuota(queryParams = {}) {
    return await apiInstance.get(`/providers/provider-quotapackages-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async availableTopupQuota(queryParams = {}) {
    return await apiInstance.get(`/providers/provider-quota-topups-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async providerTypes(queryParams = {}) {
    return await apiInstance.get(`/providers/providers/type/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async createProvider(payload) {
    return await apiInstance.post(`/providers/providers/create/`, qs.stringify(payload, { skipNulls: true }));
  },
  async testConnection(payload) {
    return await apiInstance.post(`/providers/test-provider-connection/`, qs.stringify(payload));
  },
  async createDefaultRule(providerId, payload) {
    return await apiInstance.post(`/network/provider/${providerId}/default-rules/`, qs.stringify(payload, { skipNulls: true, arrayFormat: "repeat" }));
  },
  async deleteDefaultRule(providerId, payload) {
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };
    return await apiInstance.delete(`/network/provider/${providerId}/default-rules/`, { data: qs.stringify(payload), headers });
  },
  async publicKeys(providerId, queryParams) {
    return await apiInstance.get(`/providers/provider/${providerId}/public-keys/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async createPublicKey(providerId, payload) {
    return await apiInstance.post(`/providers/provider/${providerId}/public-keys/`, qs.stringify(payload, { skipNulls: true }));
  },
  async resourceTopup(providerId, queryParams = {}) {
    return await apiInstance.get(`/providers/provider/${providerId}/provider-topup-mappings/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async attachedQuota(providerId, queryParams = {}) {
    return await apiInstance.get(`/providers/provider/${providerId}/attached-quota/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async attachQuota(providerId, quotaPackageId) {
    return await apiInstance.post(`/providers/provider/${providerId}/quotapackage/${quotaPackageId}/`);
  },
  async detachQuota(providerId, quotaPackageId) {
    return await apiInstance.delete(`/providers/provider/${providerId}/quotapackage/${quotaPackageId}/`);
  },
  async attachResourceTopup(providerId, payload) {
    return await apiInstance.post(`/providers/provider/${providerId}/attach-resource-topups/`, qs.stringify(payload, { skipNulls: true, arrayFormat: "repeat" }));
  },
  async detachResourceTopup(providerId, resourceTopupId) {
    return await apiInstance.delete(`/providers/provider/${providerId}/resource-topup/${resourceTopupId}/`);
  },
  async serviceProviders(providerId) {
    return await apiInstance.get(`/providers/provider/${providerId}/service-providers/`);
  },
  async createServiceProvider(providerId, payload) {
    return await apiInstance.post(`/providers/provider/${providerId}/service-providers/`, qs.stringify(payload));
  },
  async updateServiceProvider(providerId, serviceProviderId, payload) {
    return await apiInstance.post(`/providers/provider/${providerId}/service-providers/${serviceProviderId}/`, qs.stringify(payload));
  },
  async serviceTypes() {
    return await apiInstance.get(`/providers/service-types/`);
  },
  async providerResourceMapping(providerId, queryParams = {}) {
    return await apiInstance.get(`/providers/provider/${providerId}/resource-image-flavor-mapping/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async deleteProviderResourceMapping(providerId, resourceImageFlavorId) {
    return await apiInstance.delete(`/providers/provider/${providerId}/resource-image-flavor-mapping/${resourceImageFlavorId}`);
  },
  async resourceTypes() {
    return await apiInstance.get(`/providers/resource-image-flavor-mapping/resource-types/options/`);
  },
  async createProviderResourceMapping(providerId, payload) {
    return await apiInstance.post(`/providers/provider/${providerId}/resource-image-flavor-mapping/`, qs.stringify(payload));
  },
  async updateImage(providerId, imageId, payload) {
    return await apiInstance.put(`/compute/provider/${providerId}/images/${imageId}/meta-update/`, qs.stringify(payload));
  },
  async imageOrganisationMapping(providerId, imageId, organisationId) {
    return await apiInstance.post(`/organisation/organisation/${organisationId}/provider/${providerId}/images/${imageId}/mapping/`);
  },
  async imageResourceMapping(providerId, imageId) {
    return await apiInstance.get(`/compute/provider/${providerId}/images/${imageId}/resource-image-mapping/`);
  },
  async createImageResourceMapping(providerId, imageId, payload) {
    return await apiInstance.post(`/compute/provider/${providerId}/images/${imageId}/resource-image-mapping/`, qs.stringify(payload));
  },
  async createFlavor(providerId, payload) {
    return await apiInstance.post(`/compute/provider/${providerId}/compute/flavors/`, qs.stringify(payload));
  },
  async updateFlavor(providerId, flavorId, payload) {
    return await apiInstance.put(`/compute/provider/${providerId}/flavors/${flavorId}/`, qs.stringify(payload));
  },
  async flavorOrganisationMapping(providerId, flavorId, organisationId) {
    return await apiInstance.post(`/organisation/organisation/${organisationId}/provider/${providerId}/flavors/${flavorId}/mapping/`);
  },
  async updateZone(providerId, payload) {
    return await apiInstance.put(`/providers/provider/${providerId}/availabilty-zones/update/`, qs.stringify(payload));
  },
  async syncZones(providerId, queryParams) {
    return await apiInstance.get(`/providers/provider/${providerId}/availability-zone/sync/?${qs.stringify(queryParams)}`);
  },
  async zoneOrganisationMapping(providerId, zoneId, organisationId) {
    return await apiInstance.post(`/organisation/${organisationId}/provider/${providerId}/availability-zones/${zoneId}/mapping/`);
  },
  async createResourceMetric(payload) {
    return await apiInstance.post(`/providers/resource-metrices/`, qs.stringify(payload));
  },
  async updateResourceMetric(resourceMetricId, payload) {
    return await apiInstance.put(`/providers/resource-metrices/${resourceMetricId}/`, qs.stringify(payload));
  },
  async deleteResourceMetric(resourceMetricId) {
    return await apiInstance.delete(`/providers/resource-metrices/${resourceMetricId}/`);
  },
  async quotaMappedOrganisation(quotaId, queryParams) {
    return await apiInstance.get(`/organisation/quota-package/${quotaId}/mapped-organisations/?${qs.stringify(queryParams)}`);
  },
  async quotaMappedProviders(quotaId, queryParams) {
    return await apiInstance.get(`/providers/quotapackage/${quotaId}/attached-providers?${qs.stringify(queryParams)}`);
  },
  async initScript(providerId, imageId, queryParams = {}) {
    return await apiInstance.get(`/compute/provider/${providerId}/images/${imageId}/init-script?${qs.stringify(queryParams)}`);
  },
  async addInitScript(providerId, imageId, payload) {
    return await apiInstance.post(`/compute/provider/${providerId}/images/${imageId}/init-script`, qs.stringify(payload));
  },
  async updateInitScript(providerId, imageId, payload) {
    return await apiInstance.put(`/compute/provider/${providerId}/images/${imageId}/init-script`, qs.stringify(payload));
  },
  async deleteInitScript(providerId, imageId, queryParams = {}) {
    return await apiInstance.delete(`/compute/provider/${providerId}/images/${imageId}/init-script?${qs.stringify(queryParams)}`);
  },
  async initScriptVariables(queryParams = {}) {
    return await apiInstance.get(`/compute/cloud/init-script-variables/?${qs.stringify(queryParams)}`);
  },
  async initScriptHistory(providerId, imageId, queryParams = {}) {
    return await apiInstance.get(`/compute/provider/${providerId}/images/${imageId}/init-script-history/?${qs.stringify(queryParams)}`);
  },
  async defaultRuleProjects(providerId, defaultRuleId, queryParams = {}) {
    return await apiInstance.get(`/network/provider/${providerId}/default-rules/${defaultRuleId}/projects-list/?${qs.stringify(queryParams)}`);
  },
  async applyRuleOnProjects(providerId, defaultRuleId, payload) {
    return await apiInstance.post(`/network/provider/${providerId}/default-rules/${defaultRuleId}/apply-on-projects/`, qs.stringify(payload, { arrayFormat: "repeat" }));
  },
  async removeRuleFromProjects(providerId, defaultRuleId, payload) {
    return await apiInstance.post(`/network/provider/${providerId}/default-rules/${defaultRuleId}/remove-from-projects`, qs.stringify(payload, { arrayFormat: "repeat" }));
  },
  async syncImageWithHorizon(providerId) {
    return await apiInstance.get(`/providers/provider/${providerId}/openstack/sync-images/`);
  },
  async syncFlavorWithHorizon(providerId) {
    return await apiInstance.get(`/providers/provider/${providerId}/openstack/sync-flavors/`);
  },
};
