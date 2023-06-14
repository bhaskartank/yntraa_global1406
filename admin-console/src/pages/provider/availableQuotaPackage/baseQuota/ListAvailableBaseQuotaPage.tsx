import { useCallback } from "react";

import { useDispatch } from "store";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListAvailableBaseQuota from "components/templates/providers/availableQuotaPackage/ListAvailableBaseQuota";

const ListAvailableBaseQuotaPage = () => {
  const dispatch = useDispatch();

  const fetchAvailableBaseQuota = useCallback(
    (payload) => {
      dispatch(providersRedux.actions.availableBaseQuota(payload));
    },
    [dispatch],
  );

  const exportAvailableBaseQuota = useCallback(async () => {
    try {
      return await dispatch(providersRedux.actions.exportAvailableBaseQuota());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <PageContainer title="Available Base Quota" breadcrumbs={[{ label: "Providers", to: "/providers" }, { label: "Available Base Quota" }]}>
      <ListAvailableBaseQuota fetchAvailableBaseQuota={fetchAvailableBaseQuota} exportAvailableBaseQuota={exportAvailableBaseQuota} />
    </PageContainer>
  );
};

export default ListAvailableBaseQuotaPage;
