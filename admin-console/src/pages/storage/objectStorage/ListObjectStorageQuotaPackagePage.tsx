import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import objectStorageRedux from "store/modules/objectStorage";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListObjectStorageQuotaPackageRequests from "components/templates/storage/objectStorage/ListObjectStorageQuotaPackageRequests";

const ListObjectStorageQuotaPackagePage = () => {
  const dispatch = useDispatch();
  const { state: routerState } = useLocation();

  const defaultFilters = useMemo(() => {
    return routerState ? routerState.defaultFilters : null;
  }, [routerState]);

  const fetchQuotaPackageRequests = useCallback(
    (payload) => {
      dispatch(objectStorageRedux.actions.objectStorageQuotaPackageRequests(payload));
    },
    [dispatch],
  );

  const exportQuotaPackageRequests = useCallback(async () => {
    try {
      return await dispatch(objectStorageRedux.actions.exportObjectStorageQuotaPackageRequests());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <PageContainer title="Quota Package Update Requests" breadcrumbs={[{ label: "Storage", to: "/storage/block-storage-list" }, { label: "Quota Package Update Requests" }]}>
      <ListObjectStorageQuotaPackageRequests fetchQuotaPackageRequests={fetchQuotaPackageRequests} exportQuotaPackageRequests={exportQuotaPackageRequests} defaultFilters={defaultFilters}/>
    </PageContainer>
  );
};

export default ListObjectStorageQuotaPackagePage;
