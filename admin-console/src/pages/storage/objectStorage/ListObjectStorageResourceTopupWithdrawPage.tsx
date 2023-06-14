import useCurrentPath from "hooks/useCurrentPath";
import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import datalistRedux from "store/modules/datalist";
import objectStorageRedux from "store/modules/objectStorage";
import quotaPackagesRedux from "store/modules/quotaPackages";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListObjectStorageQuotaTopupWithdrawlRequest from "components/templates/storage/objectStorage/ListObjectStorageQuotaTopupWithdrawlRequest";

const ListObjectStorageResourceTopupWithdrawPage = () => {
  const datalistKey = useCurrentPath();
  const dispatch = useDispatch();
  const { state: routerState } = useLocation();

  const defaultFilters = useMemo(() => {
    return routerState ? routerState.defaultFilters : null;
  }, [routerState]);

  const fetchTopupQuotaWithdrawlRequests = useCallback(
    (payload) => {
      dispatch(objectStorageRedux.actions.objectStorageResourceTopupWithdrawlRequests(payload));
    },
    [dispatch],
  );

  const exportTopupQuotaRequests = useCallback(async () => {
    try {
      return await dispatch(quotaPackagesRedux.actions.exportTopupQuotaRequests());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const approveResourceTopupRequest = useCallback(
    async (payload) => {
      try {
        await dispatch(quotaPackagesRedux.actions.approveResourceTopupRequest(payload?.organisation_id, payload?.provider_id, payload?.id));
        dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey }));
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, datalistKey],
  );

  const rejectResourceTopupRequest = useCallback(
    async (payload, remarks) => {
      try {
        await dispatch(quotaPackagesRedux.actions.rejectResourceTopupRequest(payload?.organisation_id, payload?.provider_id, payload?.id, { remarks }));
        dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey }));
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, datalistKey],
  );

  return (
    <PageContainer title="Quota Topup Withdrawl Request" breadcrumbs={[{ label: "Storage", to: "/storage/block-storage-list" }, { label: "Topup Withdrawl Requests" }]}>
      <ListObjectStorageQuotaTopupWithdrawlRequest
        fetchTopupQuotaRequests={fetchTopupQuotaWithdrawlRequests}
        exportTopupQuotaRequests={exportTopupQuotaRequests}
        defaultFilters={defaultFilters}
        approveRequest={approveResourceTopupRequest}
        rejectRequest={rejectResourceTopupRequest}
      />
    </PageContainer>
  );
};

export default ListObjectStorageResourceTopupWithdrawPage;
