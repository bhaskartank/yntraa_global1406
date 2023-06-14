import { useLocation } from "react-router-dom";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListObjectStorageBucketsDetail from "components/templates/storage/objectStorage/ListObjectStorageBucketsDetail";

const ListObjectStorageBucketsDetailsPage = () => {
  const { state } = useLocation();
  const { ListObjectStorageBucket } = state;

  return (
    <PageContainer
      title="Object Storage Buckets Details"
      breadcrumbs={[{ label: "Storage", to: "/storage/block-storage-list" }, { label: "Object Storage Buckets", to: "/storage/object-storage-list" }, { label: "View Details" }]}>
      {<ListObjectStorageBucketsDetail requestData={ListObjectStorageBucket} />}
    </PageContainer>
  );
};

export default ListObjectStorageBucketsDetailsPage;
