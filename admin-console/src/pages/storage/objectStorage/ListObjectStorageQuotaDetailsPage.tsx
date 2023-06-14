import { useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";

import { useDispatch } from "store";
import objectStorageRedux from "store/modules/objectStorage";
import organisationsRedux from "store/modules/organisations";

import PageContainer from "components/layouts/Frame/PageContainer";
import ObjectStorageQuotaDetailBar from "components/molecules/DetailBars/ObjectStorageQuotaDetailBar";
import ListObjectStorageQuotaDetails from "components/templates/storage/objectStorage/ListObjectStorageQuotaDetails";

const ListObjectStorageQuotaDetailsPage = () => {
  const { organisationId } = useParams();

  const dispatch = useDispatch();
  // const rootState = useSelector((state) => state);
  const { state } = useLocation();
  const { listOrganisationDetail } = state;

  const fetchQuotas = useCallback(
    (payload) => {
      dispatch(objectStorageRedux.actions.objectStorageQuotaDetails({ org_id: organisationId, ...payload }));
    },
    [dispatch, organisationId],
  );

  const exportQuotas = useCallback(async () => {
    try {
      return await dispatch(organisationsRedux.actions.exportOrganisationQuotas(organisationId));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, organisationId]);

  return (
    <PageContainer
      title="Quota Details"
      breadcrumbs={[
        { label: "Storage", to: "/storage/block-storage-list" },
        { label: "Onboarded Organisations", to: "/storage/object-storage-onboarded-organisations " },
        { label: "Object Storage Quota" },
      ]}>
      <ObjectStorageQuotaDetailBar organisation={listOrganisationDetail} />
      <ListObjectStorageQuotaDetails fetchQuotas={fetchQuotas} exportQuotas={exportQuotas} />
    </PageContainer>
  );
};

export default ListObjectStorageQuotaDetailsPage;
