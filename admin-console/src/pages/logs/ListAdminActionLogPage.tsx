import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import logsRedux from "store/modules/logs";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListAdminActionLogs from "components/templates/logs/ListAdminActionLogs";

const ListAdminActionLogPage = () => {
  const dispatch = useDispatch();
  const { state: routerState } = useLocation();

  const defaultFilters = useMemo(() => {
    return routerState ? routerState.defaultFilters : null;
  }, [routerState]);

  const fetchAdminActionLogs = useCallback(
    (payload) => {
      dispatch(logsRedux.actions.adminActionLogs(payload));
    },
    [dispatch],
  );

  const exportAdminActionLogs = useCallback(async () => {
    try {
      return await dispatch(logsRedux.actions.exportAdminActionLogs());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <PageContainer title="Admin Action Logs" breadcrumbs={[{ label: "Audit Trails", to: "/audit-logs/user-trails" }, { label: "Admin Action Logs" }]}>
      <ListAdminActionLogs fetchAdminActionLogs={fetchAdminActionLogs} exportAdminActionLogs={exportAdminActionLogs} defaultFilters={defaultFilters} />
    </PageContainer>
  );
};

export default ListAdminActionLogPage;
