import { useCallback } from "react";

import { useDispatch } from "store";
import logsRedux from "store/modules/logs";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListUserActionLogs from "components/templates/logs/ListUserActionLogs";

const ListUserActionLogPage = () => {
  const dispatch = useDispatch();

  const fetchUserActionLogs = useCallback(
    (payload) => {
      dispatch(logsRedux.actions.userActionLogs(payload));
    },
    [dispatch],
  );

  const exportUserActionLogs = useCallback(async () => {
    try {
      return await dispatch(logsRedux.actions.exportUserActionLogs());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <PageContainer title="User Action Logs" breadcrumbs={[{ label: "Audit Trails", to: "/audit-logs/user-trails" }, { label: "User Action Logs" }]}>
      <ListUserActionLogs fetchUserActionLogs={fetchUserActionLogs} exportUserActionLogs={exportUserActionLogs} />
    </PageContainer>
  );
};

export default ListUserActionLogPage;
