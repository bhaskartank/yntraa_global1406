import useCurrentPath from "hooks/useCurrentPath";
import { useCallback, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import datalistRedux from "store/modules/datalist";
import providersRedux from "store/modules/providers";
import quotaPackagesRedux from "store/modules/quotaPackages";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListAttachedQuota from "components/templates/providers/ListAttachedQuota";
import ProviderAttachQuota from "components/templates/providers/ProviderAttachQuota";
import ProviderSummaryPanel from "components/templates/providers/resourceSummaryPanels/ProviderSummaryPanel";

export const enum MODAL_TYPE {
  MANAGE_PUBLIC_KEYS = "MANAGE_PUBLIC_KEYS",
}

const ListAttachedQuotaPage = () => {
  const datalistKey = useCurrentPath();
  const { state: routerState } = useLocation();
  const { provider } = routerState;
  const { providerId } = useParams();

  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const masterBaseQuota = quotaPackagesRedux.getters.masterBaseQuota(rootState);

  const fetchAttachedQuota = useCallback(
    (payload = {}) => {
      dispatch(providersRedux.actions.attachedQuota(providerId, payload));
    },
    [dispatch, providerId],
  );

  const exportAttachedQuota = useCallback(async () => {
    try {
      return await dispatch(providersRedux.actions.exportAttachedQuota(providerId));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, providerId]);

  const attachQuota = useCallback(
    async (quotaPackageId) => {
      try {
        await dispatch(providersRedux.actions.attachQuota(providerId, quotaPackageId));
        dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey, keepCurrentPage: true }));
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, providerId, datalistKey],
  );

  const detachQuota = useCallback(
    async (quotaPackageId) => {
      try {
        await dispatch(providersRedux.actions.detachQuota(providerId, quotaPackageId));
        dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey, keepCurrentPage: true }));
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, providerId, datalistKey],
  );

  useEffect(() => {
    dispatch(quotaPackagesRedux.actions.masterBaseQuota({ filters: JSON.stringify({ is_active: ["true"] }) }));
  }, [dispatch]);

  return (
    <PageContainer title="Attached Quota Package" breadcrumbs={[{ label: "Providers", to: "/providers" }, { label: "Attached Quota Package" }]}>
      <ProviderSummaryPanel provider={provider} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />
      <ProviderAttachQuota attachQuota={attachQuota} availableQuota={masterBaseQuota?.list?.data || []} />
      <ListAttachedQuota fetchAttachedQuota={fetchAttachedQuota} exportAttachedQuota={exportAttachedQuota} detachQuota={detachQuota} />
    </PageContainer>
  );
};

export default ListAttachedQuotaPage;
