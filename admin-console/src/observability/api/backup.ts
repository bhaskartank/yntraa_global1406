import qs from "qs";

import apiInstance from "utilities/api";

export default {
  async backup(queryParams = {}) {
    return await apiInstance.get(`/backups/backup-client-registration-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async protectionGroups(queryParams = {}) {
    return await apiInstance.get(`/backups/protection-groups-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async backupPublicIp(queryParams = {}) {
    return await apiInstance.get(`/public-ip/publicip-requests-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async backupPublicIpUpdate(queryParams = {}) {
    return await apiInstance.get(`/public-ip/publicip-change-requests-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async computeBackupsOwnerDetails({ providerId, backupId }) {
    return await apiInstance.get(`/backups/${providerId}/backups/${backupId}/owner-details/`);
  },
  async computeProtectionGroupOwnerDetails({ providerId, protectionGroupId }) {
    return await apiInstance.get(`/backups/${providerId}/protection-groups/${protectionGroupId}/owner-details/`);
  },
  async rejectBackupPublicIpRequest(providerId, action, requestId, payload) {
    return await apiInstance.post(`/public-ip/provider/${providerId}/public-ip-request/${requestId}/backup-details/${action}/`, qs.stringify(payload));
  },
  async approveBackupPublicIpRequest(providerId, action, requestId) {
    return await apiInstance.post(`/public-ip/provider/${providerId}/public-ip-request/${requestId}/backup-details/${action}/`);
  },
  async rejectBackupPublicIpUpdateRequest(providerId, action, requestId, payload) {
    return await apiInstance.post(`/public-ip/provider/${providerId}/public-ip-update-request/${requestId}/backup-details/${action}/`, qs.stringify(payload));
  },
  async approveBackupPublicIpUpdateRequest(providerId, action, requestId) {
    return await apiInstance.post(`/public-ip/provider/${providerId}/public-ip-update-request/${requestId}/backup-details/${action}/`);
  },
};
