import { useLocation } from "react-router-dom";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListLoadBalancersDetail from "components/templates/loadBalancers/ListLoadBalancersDetail";

const ListLoadBalancerDetailsPage = () => {
  const { state } = useLocation();
  const { listLbDetail } = state;
  //   /load-balancers/ssl-cert/:requestId/view-details
  return (
    <PageContainer title="Load Balancers View Details" breadcrumbs={[{ label: "Load Balancers", to: "/load-balancers" }, { label: "View Details" }]}>
      {<ListLoadBalancersDetail requestData={listLbDetail} />}
    </PageContainer>
  );
};

export default ListLoadBalancerDetailsPage;
