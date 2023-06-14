import { useCallback } from "react";

import { useDispatch } from "store";
import logsRedux from "store/modules/logs";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListAdminAccessLogs from "components/templates/logs/ListAdminAccessLogs";

const ListAdminAccessLogPage = () => {
  const dispatch = useDispatch();

  const fetchAdminAccessLogs = useCallback(
    (payload) => {
      dispatch(logsRedux.actions.adminAccessLogs(payload));
    },
    [dispatch],
  );

  const exportAdminAccessLogs = useCallback(async () => {
    try {
      return await dispatch(logsRedux.actions.exportAdminAccessLogs());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <PageContainer title="Admin Access Logs" breadcrumbs={[{ label: "Audit Trails", to: "/audit-logs/user-trails" }, { label: "Admin Access Logs" }]}>
      <ListAdminAccessLogs fetchAdminAccessLogs={fetchAdminAccessLogs} exportAdminAccessLogs={exportAdminAccessLogs} />
    </PageContainer>
  );
};

export default ListAdminAccessLogPage;
