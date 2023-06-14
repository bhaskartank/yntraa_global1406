import qs from "qs";

import apiInstance from "utilities/api";

export default {
  async vmList(queryParams = {}) {
    return await apiInstance.get(`/compute/computes-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async vmById({ providerId, computeId }) {
    return await apiInstance.get(`/compute/${providerId}/computes/${computeId}/`);
  },
  async consoleUrl({ providerId, projectId, computeId }) {
    return await apiInstance.get(`/compute/${providerId}/project/${projectId}/compute/${computeId}/console-url`);
  },
  async consoleLogs({ providerId, projectId, computeId }) {
    return await apiInstance.get(`/compute/${providerId}/project/${projectId}/compute/${computeId}/console-logs/`);
  },
  async markErrorInVM({ providerId, computeId }) {
    return await apiInstance.get(`/compute/${providerId}/compute/${computeId}/mark-as-error/`);
  },
  async eventLogs({ providerId, computeId }, queryParams) {
    return await apiInstance.get(`/compute/${providerId}/compute/${computeId}/event-logs/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async currentStatus({ providerId, computeId }) {
    return await apiInstance.get(`/compute/${providerId}/compute/${computeId}/current-status/`);
  },
  async snapshots({ providerId, computeId }, queryParams) {
    return await apiInstance.get(`/compute/${providerId}/compute/${computeId}/snapshots/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async volumes({ providerId, computeId }) {
    return await apiInstance.get(`/compute/${providerId}/compute/${computeId}/attached-volumes/`);
  },
  async networks({ providerId, computeId }) {
    return await apiInstance.get(`/compute/${providerId}/compute/${computeId}/networks/`);
  },
  async securityGroups({ providerId, computeId }) {
    return await apiInstance.get(`/compute/${providerId}/compute/${computeId}/security-groups/`);
  },
  async securityGroupRules(queryParams = {}) {
    return await apiInstance.get(`/compute/security-group-rules/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async computeSnapshots(queryParams = {}) {
    return await apiInstance.get(`/compute/compute-snapshots-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async computeOwnerDetails({ providerId, computeId }) {
    return await apiInstance.get(`/compute/${providerId}/computes/${computeId}/owner-details/`);
  },
  async computeSnapshotsOwnerDetails({ providerId, computeId }) {
    return await apiInstance.get(`/compute/${providerId}/compute-snapshots/${computeId}/owner-details/`);
  },
  async updateSnapshotStatus(providerId, snapshotId) {
    return await apiInstance.get(`/compute/provider/${providerId}/compute-snapshots/${snapshotId}/snapshot-status/`);
  },
};
