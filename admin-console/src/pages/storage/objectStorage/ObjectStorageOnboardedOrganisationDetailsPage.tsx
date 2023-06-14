import { useLocation } from "react-router-dom";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListOnboardedOrganisationsDetails from "components/templates/storage/objectStorage/ListOnboardedOrganisationsDetails";

const ObjectStorageOnboardedOrganisationDetailsPage = () => {
  const { state } = useLocation();
  const { OrganisationOnboardData } = state;

  return (
    <PageContainer
      title="Onboarded Organisations Details"
      breadcrumbs={[
        { label: "Block Storage", to: "/storage/block-storage-list" },
        { label: "Onboarded Organisations", to: "/storage/object-storage-onboarded-organisations" },
        { label: "View Details" },
      ]}>
      {<ListOnboardedOrganisationsDetails requestData={OrganisationOnboardData} />}
    </PageContainer>
  );
};

export default ObjectStorageOnboardedOrganisationDetailsPage;
