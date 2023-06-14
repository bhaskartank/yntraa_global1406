import { useLocation } from "react-router-dom";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListObjectStorageProvidersDetail from "components/templates/storage/objectStorage/ListObjectStorageProvidersDetail";

const ListObjectStorageProvidersDetailsPage = () => {
  const { state } = useLocation();
  const { ListObjectStorageProviders } = state;

  return (
    <PageContainer
      title="Object Storage Provider Details"
      breadcrumbs={[
        { label: "Storage", to: "/storage/block-storage-list" },
        { label: "Object Storage Providers", to: "/storage/object-storage-provider" },
        { label: "View Details" },
      ]}>
      {<ListObjectStorageProvidersDetail requestData={ListObjectStorageProviders} />}
    </PageContainer>
  );
};

export default ListObjectStorageProvidersDetailsPage;
