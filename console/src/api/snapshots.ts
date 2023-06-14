import qs from "qs";

import apiInstance from "utils/api";

export default {
  async computeSnapshots(providerId, projectId, computeId, payload = {}) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/${projectId}/compute/${computeId}/snapshot/`, {
      params: payload,
    });
  },
  async snapshots(providerId, projectId, payload) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/${projectId}/snapshot/`, { params: payload });
  },
  async volumeSnapshots(providerId, projectId, payload) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/${projectId}/volume-snapshot/`, { params: payload });
  },
  async createSnapshot(providerId, projectId, computeId, payload) {
    return await apiInstance.post(`/api/v1/provider/${providerId}/${projectId}/compute/${computeId}/snapshot/`, qs.stringify(payload));
  },
  async deleteComputeSnapshot(providerId, projectId, snapshotId, payload) {
    return await apiInstance.post(`/api/v1/provider/${providerId}/${projectId}/compute/snapshot/${snapshotId}/`, qs.stringify(payload));
  },
  async deleteVolumeSnapshot(providerId, projectId, snapshotId, payload) {
    return await apiInstance.delete(`/api/v1/provider/${providerId}/${projectId}/volume/snapshot/${snapshotId}/`, {
      data: qs.stringify(payload),
    });
  },
  async convertToImage(providerId, projectId, snapshotId) {
    return await apiInstance.post(`/api/v1/provider/${providerId}/${projectId}/snapshot/${snapshotId}/convert-to-image/`);
  },
  async revertFromImage(providerId, projectId, snapshotId) {
    return await apiInstance.get(`/api/v1/provider/${providerId}/${projectId}/snapshot/${snapshotId}/revert-from-image/`);
  },
  async updateSnapshotStatus(providerId, snapshotId) {
    return await apiInstance.get(`/api/v1/provider/provider/${providerId}/snapshot/${snapshotId}/update_action`);
  },
};
