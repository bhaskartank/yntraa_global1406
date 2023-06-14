import { useLocation } from "react-router-dom";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListObjectStorageActionLogsDetails from "components/templates/storage/objectStorage/ListObjectStorageActionLogsDetails";

const ListObjectStorageActionLogsDetailsPage = () => {
  const { state } = useLocation();
  const { objStorageActionLogs } = state;

  return (
    <PageContainer
      title="Object Storage Action Logs"
      breadcrumbs={[{ label: "Storage", to: "/storage/block-storage-list" }, { label: "Object Storage Action Logs", to: "/storage/action-logs" }, { label: "View Details" }]}>
      {<ListObjectStorageActionLogsDetails requestData={objStorageActionLogs} />}
    </PageContainer>
  );
};

export default ListObjectStorageActionLogsDetailsPage;
