import useCurrentPath from "hooks/useCurrentPath";
import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import datalistRedux from "store/modules/datalist";
import quotaPackagesRedux from "store/modules/quotaPackages";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListTopupWithdrawalRequests from "components/templates/organisations/ListTopupWithdrawalRequests";

const ListTopupWithdrawalRequestPage = () => {
  const datalistKey = useCurrentPath();
  const dispatch = useDispatch();
  const { state: routerState } = useLocation();

  const defaultFilters = useMemo(() => {
    return routerState ? routerState.defaultFilters : null;
  }, [routerState]);

  const fetchTopupWithdrawalRequests = useCallback(
    (payload) => {
      dispatch(quotaPackagesRedux.actions.topupWithdrawalRequests(payload));
    },
    [dispatch],
  );

  const exportTopupWithdrawalRequests = useCallback(async () => {
    try {
      return await dispatch(quotaPackagesRedux.actions.exportTopupWithdrawalRequests());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const approveResourceTopupWithdrawalRequest = useCallback(
    async (payload) => {
      try {
        await dispatch(quotaPackagesRedux.actions.approveResourceTopupWithdrawalRequest(payload?.organisation_id, payload?.provider_id, payload?.id));
        dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey }));
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, datalistKey],
  );

  const rejectResourceTopupWithdrawalRequest = useCallback(
    async (payload, remarks) => {
      try {
        await dispatch(quotaPackagesRedux.actions.rejectResourceTopupWithdrawalRequest(payload?.organisation_id, payload?.provider_id, payload?.id, { remarks }));
        dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey }));
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, datalistKey],
  );

  return (
    <PageContainer title="Quota Topup Withdraw Requests" breadcrumbs={[{ label: "Quota Topup Withdraw Requests" }]}>
      <ListTopupWithdrawalRequests
        fetchTopupWithdrawalRequests={fetchTopupWithdrawalRequests}
        exportTopupWithdrawalRequests={exportTopupWithdrawalRequests}
        defaultFilters={defaultFilters}
        approveRequest={approveResourceTopupWithdrawalRequest}
        rejectRequest={rejectResourceTopupWithdrawalRequest}
      />
    </PageContainer>
  );
};

export default ListTopupWithdrawalRequestPage;
