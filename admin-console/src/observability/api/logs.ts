import qs from "qs";

import apiInstance from "utilities/api";

export default {
  async userActionLogs(queryParams = {}) {
    return await apiInstance.get(`/audit-trails/audit-trail-logs/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async userActionLogById(audit_trail_log_id) {
    return await apiInstance.get(`/audit-trails/user-action-logs/${audit_trail_log_id}/?${qs.stringify({ audit_trail_log_id }, { skipNulls: true })}`);
  },
  async adminActionLogById(admin_audit_trail_log_id) {
    return await apiInstance.get(`/audit-trails/admin-action-logs/${admin_audit_trail_log_id}/?${qs.stringify({ admin_audit_trail_log_id }, { skipNulls: true })}`);
  },
  async userAccessLogs(queryParams = {}) {
    return await apiInstance.get(`/audit-trails/users-access-logs/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async adminActionLogs(queryParams = {}) {
    return await apiInstance.get(`/audit-trails/admin-audit-trail-logs/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
  async adminAccessLogs(queryParams = {}) {
    return await apiInstance.get(`/audit-trails/admin-users-access-logs/?${qs.stringify(queryParams, { skipNulls: true })}`);
  },
};
