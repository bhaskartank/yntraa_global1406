import { useLocation } from "react-router-dom";

import { useSelector } from "store";
import loadBalancersRedux from "store/modules/loadBalancers";

import PageContainer from "components/layouts/Frame/PageContainer";
import LoadBalancerDetailBar from "components/molecules/DetailBars/LoadBalancerDetailBar";
import ListLBLogs from "components/templates/loadBalancers/LBConsoleLogs";

const ListLBLogsPage = () => {
  const { state: routerState } = useLocation();
  const { lbDetails }: { lbDetails: any } = routerState;
  const rootState = useSelector((state: any) => state);
  const consoleLog = loadBalancersRedux.getters.lbLogs(rootState);

  return (
    <PageContainer title="LB Console Logs" breadcrumbs={[{ label: "Load Balancers", to: "/load-balancers" }, { label: "LB Console Logs" }]}>
      <LoadBalancerDetailBar lbDetails={lbDetails} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />
      <ListLBLogs consoleLog={consoleLog} />
    </PageContainer>
  );
};

export default ListLBLogsPage;
