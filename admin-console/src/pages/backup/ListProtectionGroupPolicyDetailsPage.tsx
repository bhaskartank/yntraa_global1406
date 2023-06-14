import { useLocation } from "react-router-dom";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListProtectionGroupsDetail from "components/templates/backup/ListProtectionGroupsDetail";

const ListProtectionGroupPolicyDetailsPage = () => {
  const { state } = useLocation();
  const { BackupProtectionGroupRequestDetail } = state;

  return (
    <PageContainer
      title="Protection Groups Policy Details"
      breadcrumbs={[{ label: "Backups", to: "/backups" }, { label: "Protection Groups Policy", to: "/backups/protection-groups" }, { label: "View Details" }]}>
      {<ListProtectionGroupsDetail requestData={BackupProtectionGroupRequestDetail} />}
    </PageContainer>
  );
};

export default ListProtectionGroupPolicyDetailsPage;
