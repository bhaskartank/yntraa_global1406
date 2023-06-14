import qs from "qs";

import apiInstance from "utilities/api";

export default {
  async resourceUtilization(providerId, queryParams = {}) {
    return await apiInstance.get(`/resource-action-logs/${providerId}/provider-resource-utilization/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async weeklyReport(payload = {}) {
    return await apiInstance.post(`/resource-action-logs/provider-resource-report/`, qs.stringify(payload, { arrayFormat: "repeat" }));
  },
  async availableDates(payload = {}) {
    return await apiInstance.post(`/resource-action-logs/provider-resource-report-date/`, qs.stringify(payload, { arrayFormat: "repeat" }));
  },
  async generateResourceReport(payload = {}) {
    return await apiInstance.post(`/resource-action-logs/generate-provider-resource-report`, qs.stringify(payload, { arrayFormat: "repeat" }));
  },
};
