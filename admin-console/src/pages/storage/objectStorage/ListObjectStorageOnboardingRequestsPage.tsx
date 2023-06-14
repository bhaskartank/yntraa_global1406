import { useCallback, useMemo } from "react";

import { useDispatch } from "store";
import objectStorageRedux from "store/modules/objectStorage";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListObjectStorageOnboardingRequests from "components/templates/storage/objectStorage/ListObjectStorageOnboardingRequests";
import { useLocation } from "react-router-dom";

const ListObjectStorageOnboardingRequestsPage = () => {
  const dispatch = useDispatch();
  const { state: routerState } = useLocation();

  const defaultFilters = useMemo(() => {
    return routerState ? routerState.defaultFilters : null;
  }, [routerState]);

  const fetchOnboardingRequests = useCallback(
    (payload) => {
      dispatch(objectStorageRedux.actions.objectStorageOnboardingRequests(payload));
    },
    [dispatch],
  );

  const exportOnboardingRequests = useCallback(async () => {
    try {
      return await dispatch(objectStorageRedux.actions.exportObjectStorageOnboardingRequests());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <PageContainer title="Object Storage Onboarding Requests" breadcrumbs={[{ label: "Storage", to: "/storage/block-storage-list" }, { label: "Object Storage Onboarding Requests" }]}>
      <ListObjectStorageOnboardingRequests fetchOnboardingRequests={fetchOnboardingRequests} exportOnboardingRequests={exportOnboardingRequests} defaultFilters={defaultFilters} />
    </PageContainer>
  );
};

export default ListObjectStorageOnboardingRequestsPage;

