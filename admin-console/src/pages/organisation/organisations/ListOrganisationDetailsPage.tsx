import { useLocation } from "react-router-dom";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListOrganisationDetail from "components/templates/organisations/organisations/ListOrganisationDetail";

const ListOrganisationDetailsPage = () => {
  const { state } = useLocation();
  const { listOrganisationDetail } = state;

  return (
    <PageContainer title="Organisations List Details" breadcrumbs={[{ label: "Organisations List", to: "/organisations" }, { label: "View Details" }]}>
      {<ListOrganisationDetail requestData={listOrganisationDetail} />}
    </PageContainer>
  );
};

export default ListOrganisationDetailsPage;
