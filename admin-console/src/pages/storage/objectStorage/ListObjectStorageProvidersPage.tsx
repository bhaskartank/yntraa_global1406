import { useCallback } from "react";

import { useDispatch } from "store";
import objectStorageRedux from "store/modules/objectStorage";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListObjectStorageProviders from "components/templates/storage/objectStorage/ListObjectStorageProviders";

const ListObjectStorageProvidersPage = () => {
  const dispatch = useDispatch();

  const fetchObjectStorageProviders = useCallback(
    (payload) => {
      dispatch(objectStorageRedux.actions.objectStorageProviders(payload));
    },
    [dispatch],
  );

  const exportObjectStorageProviders = useCallback(async () => {
    try {
      return await dispatch(objectStorageRedux.actions.exportObjectStorageProviders());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <PageContainer title="Object Storage Providers" breadcrumbs={[{ label: "Storage", to: "/storage/block-storage-list" }, { label: "Object Storage Providers" }]}>
      <ListObjectStorageProviders fetchObjectStorageProviders={fetchObjectStorageProviders} exportObjectStorageProviders={exportObjectStorageProviders} />
    </PageContainer>
  );
};

export default ListObjectStorageProvidersPage;
