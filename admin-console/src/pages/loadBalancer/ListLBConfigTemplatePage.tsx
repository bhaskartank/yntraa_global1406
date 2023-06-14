import { useLocation } from "react-router-dom";

import { useSelector } from "store";
import loadBalancersRedux from "store/modules/loadBalancers";

import PageContainer from "components/layouts/Frame/PageContainer";
import LoadBalancerDetailBar from "components/molecules/DetailBars/LoadBalancerDetailBar";
import ListLBConfigTemplate from "components/templates/loadBalancers/ListLBConfigTemplate";

const ListLBConfigTemplatePage = () => {
  const { state: routerState } = useLocation();
  const { lbDetails }: { lbDetails: any } = routerState;
  const rootState = useSelector((state: any) => state);
  const lbConfigTemplate = loadBalancersRedux.getters.lbConfigTemplate(rootState);

  return (
    <PageContainer title="Load Balancer Template" breadcrumbs={[{ label: "Load Balancers", to: "/load-balancers" }, { label: "LB Template" }]}>
      <LoadBalancerDetailBar lbDetails={lbDetails} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />
      <ListLBConfigTemplate lbConfigTemplate={lbConfigTemplate} />
    </PageContainer>
  );
};

export default ListLBConfigTemplatePage;
