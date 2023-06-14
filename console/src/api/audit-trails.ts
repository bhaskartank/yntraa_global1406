import apiInstance from "utils/api";

export default {
  async auditTrails(payload) {
    return await apiInstance.get(`/api/v1/audit-trails/`, { params: payload });
  },
  async accessLogs(userId, payload) {
    return await apiInstance.get(`/api/v1/audit-trails/${userId}/user-action-log/`, { params: payload });
  },
  async resourceTypes() {
    return await apiInstance.get(`/api/v1/audit-trails/resource-type/`);
  },
  async objectStorageAuditTrails(payload) {
    return await apiInstance.get(`/osaasapi/v1/object-storages/audit-trails-log`, { params: payload });
  },
};
