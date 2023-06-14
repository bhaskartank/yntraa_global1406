import qs from "qs";

import apiInstance from "utils/api";

export default {
  async backupServices(providerId, projectId, computeId) {
    return await apiInstance.get(`/api/v1/backups/${providerId}/${projectId}/backup-services/${computeId}/`);
  },
  async backupIP(providerId, projectId, computeId) {
    return await apiInstance.get(`/api/v1/backups/${providerId}/${projectId}/backup-IP/${computeId}/`);
  },
  async createBackupService(providerId, projectId, payload) {
    return await apiInstance.post(`/api/v1/backups/${providerId}/${projectId}/backup-services/client-registration`, qs.stringify(payload));
  },
  async backups(providerId, projectId, backupServiceId, payload) {
    return await apiInstance.get(`/api/v1/backups/${providerId}/${projectId}/backup-services-details/${backupServiceId}`, { params: payload });
  },
  async attachedBackups(providerId, projectId, payload) {
    return await apiInstance.get(`/api/v1/backups/${providerId}/${projectId}/attached-backups/`, {
      params: payload,
    });
  },
};
