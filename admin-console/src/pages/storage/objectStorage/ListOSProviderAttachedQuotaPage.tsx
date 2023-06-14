import useCurrentPath from "hooks/useCurrentPath";
import { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import datalistRedux from "store/modules/datalist";
import objectStorageRedux from "store/modules/objectStorage";

import PageContainer from "components/layouts/Frame/PageContainer";
import ObjectStorageQuotaDetailBar from "components/molecules/DetailBars/ObjectStorageProviderQuotaDetailBar";
import ListObjectStorageProviderAttachedQuota from "components/templates/storage/objectStorage/ListObjectStorageProviderAttachedQuota";
import ProviderAttachQuota from "components/templates/storage/objectStorage/ObjectStorageProviderAttachQuota";

const ListObjectStorageProviderAttachedQuotaPage = () => {
  const datalistKey = useCurrentPath();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { provider } = state;
  const objectStorageProviderId = provider.id;
  const rootState = useSelector((state) => state);
  const masterBaseQuota = objectStorageRedux.getters.masterQuotaPackageList(rootState);

  const fetchQuotas = useCallback(
    (payload) => {
      dispatch(objectStorageRedux.actions.objectStorageProvidersQuotaDetails(objectStorageProviderId, payload));
    },
    [dispatch, objectStorageProviderId],
  );

  const exportQuotas = useCallback(async () => {
    try {
      return await dispatch(objectStorageRedux.actions.exportObjectStorageProvidersQuotaDetails(objectStorageProviderId));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, objectStorageProviderId]);

  const attachProviderQuota = useCallback(
    async (quotaPackageId) => {
      try {
        await dispatch(objectStorageRedux.actions.attachProviderQuota(objectStorageProviderId, quotaPackageId));
        dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey, keepCurrentPage: true }));
      } catch (err) {
        console.error(err);
      }
    },
    [datalistKey, dispatch, objectStorageProviderId],
  );

  const detachProviderQuota = useCallback(
    async (payload) => {
      try {
        await dispatch(objectStorageRedux.actions.detachProviderQuota(objectStorageProviderId, payload.quotapackage_id));
        dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey, keepCurrentPage: true }));
      } catch (err) {
        console.error(err);
      }
    },
    [datalistKey, dispatch, objectStorageProviderId],
  );

  useEffect(() => {
    dispatch(objectStorageRedux.actions.masterQuotaPackageList());
  }, [dispatch]);

  return (
    <PageContainer
      title="Provider Quota Details"
      breadcrumbs={[
        { label: "Storage", to: "/storage/block-storage-list" },
        { label: "Object Storage Providers", to: "/storage/object-storage-provider" },
        { label: "Object Storage Provider Quota" },
      ]}>
      <ObjectStorageQuotaDetailBar provider={provider} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />
      <ProviderAttachQuota attachQuota={attachProviderQuota} availableQuota={masterBaseQuota?.list || []} />
      <ListObjectStorageProviderAttachedQuota fetchQuotas={fetchQuotas} exportQuotas={exportQuotas} detachProviderQuota={detachProviderQuota} />
    </PageContainer>
  );
};

export default ListObjectStorageProviderAttachedQuotaPage;
