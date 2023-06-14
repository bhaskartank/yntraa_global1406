import { useLocation } from "react-router-dom";

import { useSelector } from "store";
import loadBalancersRedux from "store/modules/loadBalancers";

import PageContainer from "components/layouts/Frame/PageContainer";
import LoadBalancerDetailBar from "components/molecules/DetailBars/LoadBalancerDetailBar";
import LBAppliedConfig from "components/templates/loadBalancers/LBAppliedConfig";

const LBAppliedConfigPage = () => {
  const { state: routerState } = useLocation();
  const { lbDetail }: { lbDetail: any } = routerState;
  const rootState = useSelector((state: any) => state);
  const lbData = loadBalancersRedux.getters.lbAppliedConfig(rootState);

  return (
    <PageContainer title="Load Balancer Params" breadcrumbs={[{ label: "Load Balancers", to: "/load-balancers" }, { label: "LB Params" }]}>
      <LoadBalancerDetailBar lbDetails={lbDetail} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />
      <LBAppliedConfig lbData={lbData} />
    </PageContainer>
  );
};

export default LBAppliedConfigPage;
