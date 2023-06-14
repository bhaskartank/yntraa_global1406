import { useCallback } from "react";

import { useDispatch } from "store";
import logsRedux from "store/modules/logs";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListUserAccessLogs from "components/templates/logs/ListUserAccessLogs";

const ListUserAccessLogPage = () => {
  const dispatch = useDispatch();

  const fetchUserAccessLogs = useCallback(
    (payload) => {
      dispatch(logsRedux.actions.userAccessLogs(payload));
    },
    [dispatch],
  );

  const exportUserAccessLogs = useCallback(async () => {
    try {
      return await dispatch(logsRedux.actions.exportUserAccessLogs());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <PageContainer title="User Access Logs" breadcrumbs={[{ label: "Audit Trails", to: "/audit-logs/user-trails" }, { label: "User Access Logs" }]}>
      <ListUserAccessLogs fetchUserAccessLogs={fetchUserAccessLogs} exportUserAccessLogs={exportUserAccessLogs} />
    </PageContainer>
  );
};

export default ListUserAccessLogPage;
