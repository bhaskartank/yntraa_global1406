import qs from "qs";

import apiInstance from "utilities/api";

export default {
  async blockStorage(queryParams = {}) {
    return await apiInstance.get(`/volumes/volumes-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async volumeSnapshots(queryParams = {}) {
    return await apiInstance.get(`/volumes/volume-snapshots-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async computeVolumeSnapshotsOwnerDetails({ providerId, volumeSnapshotId }) {
    return await apiInstance.get(`/volumes/${providerId}/volume-snapshots/${volumeSnapshotId}/owner-details/`);
  },
  async computes({ providerId, volumeId }, queryParams) {
    return await apiInstance.get(`/volumes/provider/${providerId}/volume/${volumeId}/attached-compute-detail/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async fetchBlockStorageOwnerDetail({ providerId, volumeId }) {
    return await apiInstance.get(`/volumes/${providerId}/volumes/${volumeId}/owner-details/`);
  },
};
