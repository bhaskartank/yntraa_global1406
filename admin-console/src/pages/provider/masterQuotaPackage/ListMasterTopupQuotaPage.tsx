import { useCallback } from "react";

import { useDispatch } from "store";
import quotaPackagesRedux from "store/modules/quotaPackages";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListMasterTopupQuota from "components/templates/providers/masterQuotaPackage/ListMasterTopupQuota";

const ListMasterTopupQuotaPage = () => {
  const dispatch = useDispatch();

  const fetchMasterTopupQuota = useCallback(
    (payload) => {
      dispatch(quotaPackagesRedux.actions.masterTopupQuota(payload));
    },
    [dispatch],
  );

  const exportMasterTopupQuota = useCallback(async () => {
    try {
      return await dispatch(quotaPackagesRedux.actions.exportMasterTopupQuota());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <PageContainer title="Master List of Quota Package Topup" breadcrumbs={[{ label: "Master List of Quota Package Topup" }]}>
      <ListMasterTopupQuota fetchMasterTopupQuota={fetchMasterTopupQuota} exportMasterTopupQuota={exportMasterTopupQuota} />
    </PageContainer>
  );
};

export default ListMasterTopupQuotaPage;
