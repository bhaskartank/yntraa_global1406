import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import objectStorageRedux from "store/modules/objectStorage";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListObjectStorageBuckets from "components/templates/storage/objectStorage/ListObjectStorageBuckets";

const ListObjectStorageBucketsPage = () => {
  const dispatch = useDispatch();
  const { state: routerState } = useLocation();

  const defaultFilters = useMemo(() => {
    return routerState ? routerState.defaultFilters : null;
  }, [routerState]);

  const fetchObjectStorageBuckets = useCallback(
    (payload) => {
      dispatch(objectStorageRedux.actions.objectStorageBuckets(payload));
    },
    [dispatch],
  );

  const exportObjectStorageBuckets = useCallback(async () => {
    try {
      return await dispatch(objectStorageRedux.actions.exportObjectStorageBuckets());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);


  return (
    <PageContainer title="Object Storage Buckets" breadcrumbs={[{ label: "Storage", to: "/storage/block-storage-list" }, { label: "Object Storage Buckets" }]}>
      <ListObjectStorageBuckets fetchObjectStorageBuckets={fetchObjectStorageBuckets} exportObjectStorageBuckets={exportObjectStorageBuckets} defaultFilters={defaultFilters} />
    </PageContainer>
  );
};

export default ListObjectStorageBucketsPage;

