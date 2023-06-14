import { useLocation } from "react-router-dom";

import PageContainer from "components/layouts/Frame/PageContainer";
import ResourceUtilizationDetailBar from "components/molecules/DetailBars/ResourceUtilizationDetailBar";
import ListResourceUtilizationDetail from "components/templates/reports/ListResourceUtilization/ListResourceUtilizationDetail";

const ListResourceUtilizationDetailPage = () => {
  const { state: routerState } = useLocation();
  const { utilizationDetails, organisation, data } = routerState;

  return (
    <PageContainer title="Resource Utilization Details" breadcrumbs={[{ label: "Resource Utilization", to: "/reports/resource-utilization" }, { label: "Details" }]}>
      <ResourceUtilizationDetailBar organisation={organisation} />
      <ListResourceUtilizationDetail data={utilizationDetails} />
    </PageContainer>
  );
};

export default ListResourceUtilizationDetailPage;
