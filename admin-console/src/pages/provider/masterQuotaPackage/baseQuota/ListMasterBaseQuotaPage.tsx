import { useCallback } from "react";

import { useDispatch } from "store";
import quotaPackagesRedux from "store/modules/quotaPackages";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListMasterBaseQuota from "components/templates/providers/masterQuotaPackage/ListMasterBaseQuota";

const ListMasterBaseQuotaPage = () => {
  const dispatch = useDispatch();

  const fetchMasterBaseQuota = useCallback(
    (payload) => {
      dispatch(quotaPackagesRedux.actions.masterBaseQuota(payload));
    },
    [dispatch],
  );

  const exportMasterBaseQuota = useCallback(async () => {
    try {
      return await dispatch(quotaPackagesRedux.actions.exportMasterBaseQuota());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <PageContainer title="Master List of Quota Package" breadcrumbs={[{ label: "Master List of Quota Package" }]}>
      <ListMasterBaseQuota fetchMasterBaseQuota={fetchMasterBaseQuota} exportMasterBaseQuota={exportMasterBaseQuota} />
    </PageContainer>
  );
};

export default ListMasterBaseQuotaPage;
