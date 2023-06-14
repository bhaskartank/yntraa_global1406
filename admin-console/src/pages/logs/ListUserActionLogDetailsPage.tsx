import { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import logsRedux from "store/modules/logs";
import virtualMachinesRedux from "store/modules/virtualMachines";

import PageContainer from "components/layouts/Frame/PageContainer";
import ActionLogDetailBar from "components/molecules/DetailBars/ActionLogDetailBar";
import ActionLogDetails from "components/templates/logs/ActionLogDetails";

const ListUserActionLogDetailsPage = () => {
  const { state: routerState } = useLocation();
  const { actionLogs }: { actionLogs: any } = routerState;

  const dispatch = useDispatch();
  const rootState = useSelector((state: any) => state);
  const userActionLogs = logsRedux.getters.userActionLogById(rootState);

  useEffect(() => {
    dispatch(logsRedux.actions.userActionLogById({ audit_trail_log_id: actionLogs?.id }));
  }, [dispatch]);

  return (
    <PageContainer
      title="User Action Log Details"
      breadcrumbs={[{ label: "Audit Trails", to: "/audit-logs/user-trails" }, { label: "User Action Logs", to: "/audit-logs/user-trails" }, { label: "Log Details" }]}>
      <ActionLogDetailBar actionLogs={actionLogs} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />

      <ActionLogDetails actionLog={userActionLogs?.list} />
    </PageContainer>
  );
};

export default ListUserActionLogDetailsPage;
