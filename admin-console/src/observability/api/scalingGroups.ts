import qs from "qs";

import apiInstance from "utilities/api";

export default {
  async scalingGroups(queryParams = {}) {
    return await apiInstance.get(`/scaling-groups/scaling-groups-list/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async computeScalingOwnerDetails({ providerId, scalingGroupId }) {
    return await apiInstance.get(`/scaling-groups/${providerId}/scaling-groups/${scalingGroupId}/owner-details/`);
  },
};
