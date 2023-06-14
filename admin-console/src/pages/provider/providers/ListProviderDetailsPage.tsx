import { useLocation } from "react-router-dom";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListProviderDetails from "components/templates/providers/provider/ListProviderDetails";

const ListProviderDetailsPage = () => {
  const { state } = useLocation();
  const { provider } = state;

  return (
    <PageContainer title="Provider Details" breadcrumbs={[{ label: "Providers List", to: "/providers" }, { label: "View Details" }]}>
      {<ListProviderDetails requestData={provider} />}
    </PageContainer>
  );
};

export default ListProviderDetailsPage;
