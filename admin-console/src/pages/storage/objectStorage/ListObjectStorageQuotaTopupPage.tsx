import useCurrentPath from "hooks/useCurrentPath";
import { useCallback, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import datalistRedux from "store/modules/datalist";
import objectStorageRedux from "store/modules/objectStorage";

import PageContainer from "components/layouts/Frame/PageContainer";
import AttachObjectStorageTopup from "components/templates/storage/objectStorage/AttachObjectStorageQuotaTopup";
import ListObjectStorageQuotaTopups from "components/templates/storage/objectStorage/ListObjectStorageQuotaTopups";

const ListObjectStorageQuotaTopupPage = () => {
  const dispatch = useDispatch();
  const datalistKey = useCurrentPath();
  const { state: routerState } = useLocation();
  const { objectStorageProviderDetails } = routerState;

  const defaultFilters = useMemo(() => {
    return routerState ? routerState.defaultFilters : null;
  }, [routerState]);

  const fetchObjectStorageQuotaTopups = useCallback(
    (payload) => {
      dispatch(objectStorageRedux.actions.objectStorageQuotaTopups(payload));
    },
    [dispatch],
  );

  const fetchObjectStorageResourceTopups = useCallback(
    (payload) => {
      dispatch(objectStorageRedux.actions.objectStorageResourceTopups(payload));
    },
    [dispatch],
  );

  const handleAttachResourceTopup = useCallback(
    async (payload) => {
      await dispatch(objectStorageRedux.actions.attachResourceTopup({ objstorage_provider_id: objectStorageProviderDetails?.id, resource_topup_id: payload.resource_topup_id }));
      dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey }));
    },
    [dispatch],
  );

  const handleDetachResourceTopup = useCallback(
    async (payload) => {
      await dispatch(objectStorageRedux.actions.detachResourceTopup({ objstorage_provider_id: payload?.objectstorage_provider_id, resource_topup_id: payload?.resource_topup_id }));
      dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey }));
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

  useEffect(() => {
    fetchObjectStorageResourceTopups({});
  }, [dispatch]);

  return (
    <PageContainer
      title="Object Storage Quota Topup"
      breadcrumbs={[
        { label: "Storage", to: "/storage/block-storage-list" },
        { label: "Object Storage Providers", to: "/storage/object-storage-provider" },
        { label: "Object Storage Quota Topups" },
      ]}>
      <AttachObjectStorageTopup handleAttachResourceTopup={handleAttachResourceTopup} />
      <ListObjectStorageQuotaTopups
        fetchObjectStorageQuotaTopups={fetchObjectStorageQuotaTopups}
        handleDetachResourceTopup={handleDetachResourceTopup}
        exportObjectStorageBuckets={exportObjectStorageBuckets}
        defaultFilters={defaultFilters}
      />
    </PageContainer>
  );
};

export default ListObjectStorageQuotaTopupPage;
