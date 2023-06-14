import { useLocation } from "react-router-dom";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListProjectDetail from "components/templates/organisations/projects/ListProjectDetail";

const ListProjectDetailsPage = () => {
  const { state } = useLocation();
  const { listProjectDetailState } = state;

  return (
    <PageContainer
      title="Projects Details"
      breadcrumbs={[{ label: "Organisations List", to: "/organisations" }, { label: "Projects", to: "/organisations/projects" }, { label: "View Details" }]}>
      {<ListProjectDetail requestData={listProjectDetailState} />}
    </PageContainer>
  );
};

export default ListProjectDetailsPage;
