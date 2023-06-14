import useCurrentPath from "hooks/useCurrentPath";
import { useCallback, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import datalistRedux from "store/modules/datalist";
import providersRedux from "store/modules/providers";
import quotaPackagesRedux from "store/modules/quotaPackages";

import PageContainer from "components/layouts/Frame/PageContainer";
import ProviderSummaryPanel from "components/templates/providers/resourceSummaryPanels/ProviderSummaryPanel";
import AttachResourceTopup from "components/templates/providers/resourceTopup/AttachResourceTopup";
import ListResourceTopup from "components/templates/providers/resourceTopup/ListResourceTopup";

export const enum MODAL_TYPE {
  MANAGE_PUBLIC_KEYS = "MANAGE_PUBLIC_KEYS",
}

const ListResourceTopupPage = () => {
  const datalistKey = useCurrentPath();
  const { providerId } = useParams();
  const { state: routerState } = useLocation();
  const { provider } = routerState;

  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const masterTopupQuota = quotaPackagesRedux.getters.masterTopupQuota(rootState);

  const fetchResourceTopup = useCallback(() => {
    dispatch(providersRedux.actions.resourceTopup(providerId, {}));
  }, [dispatch, providerId]);

  const exportResourceTopup = useCallback(async () => {
    try {
      return await dispatch(providersRedux.actions.exportResourceTopup(providerId));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, providerId]);

  const fetchMasterTopupQuota = useCallback(() => {
    dispatch(quotaPackagesRedux.actions.masterTopupQuota());
  }, [dispatch]);

  const attachResourceTopup = useCallback(
    async (topupIds) => {
      try {
        await dispatch(providersRedux.actions.attachResourceTopup(providerId, { resource_topup_ids: topupIds }));
        dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey }));
        fetchMasterTopupQuota();
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, providerId, datalistKey, fetchMasterTopupQuota],
  );

  const detachResourceTopup = useCallback(
    async (resourceTopupId) => {
      try {
        await dispatch(providersRedux.actions.detachResourceTopup(providerId, resourceTopupId));
        dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey }));
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, providerId, datalistKey],
  );

  useEffect(() => {
    fetchMasterTopupQuota();
  }, [fetchMasterTopupQuota]);

  return (
    <PageContainer title="Resource Topup" breadcrumbs={[{ label: "Providers", to: "/providers" }, { label: "Resource Topup" }]}>
      <ProviderSummaryPanel provider={provider} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />
      <AttachResourceTopup masterTopupQuota={masterTopupQuota} attachResourceTopup={attachResourceTopup} />
      <ListResourceTopup fetchResourceTopup={fetchResourceTopup} exportResourceTopup={exportResourceTopup} detachResourceTopup={detachResourceTopup} />
    </PageContainer>
  );
};

export default ListResourceTopupPage;
