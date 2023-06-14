import { useLocation } from "react-router-dom";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListBackupDetail from "components/templates/backup/ListBackupDetail";

const ListBackupDetailsPage = () => {
  const { state } = useLocation();
  const { listBackupDetail } = state;

  return (
    <PageContainer title="Backups View Details" breadcrumbs={[{ label: "Backups", to: "/backups" }, { label: "View Details" }]}>
      {<ListBackupDetail requestData={listBackupDetail} />}
    </PageContainer>
  );
};

export default ListBackupDetailsPage;
