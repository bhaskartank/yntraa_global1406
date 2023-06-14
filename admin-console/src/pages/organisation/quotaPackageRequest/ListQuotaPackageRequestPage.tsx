import useCurrentPath from "hooks/useCurrentPath";
import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import datalistRedux from "store/modules/datalist";
import quotaPackagesRedux from "store/modules/quotaPackages";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListQuotaPackageRequests from "components/templates/organisations/ListQuotaPackageRequests";

const ListQuotaPackageRequestPage = () => {
  const datalistKey = useCurrentPath();
  const dispatch = useDispatch();
  const { state: routerState } = useLocation();

  const defaultFilters = useMemo(() => {
    return routerState ? routerState.defaultFilters : null;
  }, [routerState]);

  const fetchQuotaPackageRequests = useCallback(
    (payload) => {
      dispatch(quotaPackagesRedux.actions.quotaPackageRequests(payload));
    },
    [dispatch],
  );

  const exportQuotaPackageRequests = useCallback(async () => {
    try {
      return await dispatch(quotaPackagesRedux.actions.exportQuotaPackageRequests());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const approveQuotaPackageUpdateRequest = useCallback(
    async (payload) => {
      try {
        await dispatch(quotaPackagesRedux.actions.approveQuotaPackageUpdateRequest(payload?.id));
        dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey }));
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, datalistKey],
  );

  const rejectQuotaPackageUpdateRequest = useCallback(
    async (payload, remarks) => {
      try {
        await dispatch(quotaPackagesRedux.actions.rejectQuotaPackageUpdateRequest(payload?.id, { remarks }));
        dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey }));
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, datalistKey],
  );

  return (
    <PageContainer title="Quota Package Update Requests" breadcrumbs={[{ label: "Quota Package Update Requests" }]}>
      <ListQuotaPackageRequests
        fetchQuotaPackageRequests={fetchQuotaPackageRequests}
        exportQuotaPackageRequests={exportQuotaPackageRequests}
        defaultFilters={defaultFilters}
        approveRequest={approveQuotaPackageUpdateRequest}
        rejectRequest={rejectQuotaPackageUpdateRequest}
      />
    </PageContainer>
  );
};

export default ListQuotaPackageRequestPage;
