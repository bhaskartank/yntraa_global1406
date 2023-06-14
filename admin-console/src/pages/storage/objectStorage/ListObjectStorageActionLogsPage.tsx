import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import objectStorageRedux from "store/modules/objectStorage";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListObjectStorageActionLogs from "components/templates/storage/objectStorage/ListObjectStorageActionLogs";

const ListObjectStorageActionLogsPage = () => {
  const dispatch = useDispatch();
  const { state: routerState } = useLocation();

  const defaultFilters = useMemo(() => {
    return routerState ? routerState.defaultFilters : null;
  }, [routerState]);

  const fetchObjectStorageActionLogs = useCallback(
    (payload) => {
      dispatch(objectStorageRedux.actions.objectStorageActionLogsRequests(payload));
    },
    [dispatch],
  );

  const exportObjectStorageActionLogs = useCallback(async () => {
    try {
      return await dispatch(objectStorageRedux.actions.exportObjectStorageActionLogsRequests());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <PageContainer title="Object Storage Action Logs" breadcrumbs={[{ label: "Storage", to: "/storage/storage/block-storage-list" }, { label: "Object Storage Action Logs" }]}>
      <ListObjectStorageActionLogs
        fetchObjectStorageActionLogs={fetchObjectStorageActionLogs}
        exportObjectStorageActionLogs={exportObjectStorageActionLogs}
        defaultFilters={defaultFilters}
      />
    </PageContainer>
  );
};

export default ListObjectStorageActionLogsPage;
