import { useCallback } from "react";

import { useDispatch } from "store";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListAvailableTopupQuota from "components/templates/providers/availableQuotaPackage/ListAvailableTopupQuota";

const ListAvailableTopupQuotaPage = () => {
  const dispatch = useDispatch();

  const fetchAvailableTopupQuota = useCallback(
    (payload) => {
      dispatch(providersRedux.actions.availableTopupQuota(payload));
    },
    [dispatch],
  );

  const exportAvailableTopupQuota = useCallback(async () => {
    try {
      return await dispatch(providersRedux.actions.exportAvailableTopupQuota());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <PageContainer title="Quota Package Topup Details" breadcrumbs={[{ label: "Quota Package Topup Details" }]}>
      <ListAvailableTopupQuota fetchAvailableTopupQuota={fetchAvailableTopupQuota} exportAvailableTopupQuota={exportAvailableTopupQuota} />
    </PageContainer>
  );
};

export default ListAvailableTopupQuotaPage;
