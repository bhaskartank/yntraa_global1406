import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import virtualMachinesRedux from "store/modules/virtualMachines";

import PageContainer from "components/layouts/Frame/PageContainer";
import ComputeDetailBar from "components/molecules/DetailBars/ComputeDetailBar";
import ListEventLogs from "components/molecules/ListEventLogs";

const ListComputeEventLogsPage = () => {
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const eventLogs = virtualMachinesRedux.getters.eventLogs(rootState);
  const { state: routerState } = useLocation();
  const { compute }: { compute: any } = routerState;

  const exportFileAnnotation = useMemo(() => ({ "Instance Name": compute?.instance_name, State: compute?.status }), [compute]);

  const fetchEventLogs = useCallback(
    (payload) => {
      dispatch(virtualMachinesRedux.actions.eventLogs({ computeId: compute?.id, providerId: compute?.provider_id }, payload));
    },
    [dispatch, compute],
  );

  const exportEventLogs = useCallback(
    (payload) => {
      dispatch(virtualMachinesRedux.actions.exportEventLogs({ computeId: compute?.id }, payload));
    },
    [dispatch, compute],
  );

  return (
    <PageContainer title="Compute Event Logs" breadcrumbs={[{ label: "Compute", to: "/compute/types" }, { label: "Compute Event Logs" }]}>
      <ComputeDetailBar compute={compute} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />
      <ListEventLogs fetchEventLogs={fetchEventLogs} exportEventLogs={exportEventLogs} eventLogs={eventLogs?.list} exportFileAnnotation={exportFileAnnotation} />
    </PageContainer>
  );
};

export default ListComputeEventLogsPage;
