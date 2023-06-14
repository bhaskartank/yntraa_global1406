import { useCallback } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import ProviderQuotaDetailBar from "components/molecules/DetailBars/ProviderQuotaDetailBar";
import ListMappedOrganisations from "components/templates/providers/ListMappedOrganisations";

const ListMappedOrganisationPage = () => {
  const { state: routerState } = useLocation();
  const { quotaPackage } = routerState;

  const dispatch = useDispatch();

  const fetchBaseQuotaMappedOrganisation = useCallback(
    (payload) => {
      dispatch(providersRedux.actions.quotaMappedOrganisation(quotaPackage?.id, payload));
    },
    [dispatch, quotaPackage],
  );

  const exportBaseQuotaMappedOrganisation = useCallback(async () => {
    try {
      return await dispatch(providersRedux.actions.exportQuotaMappedOrganisation(quotaPackage?.id, {}));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, quotaPackage]);

  return (
    <PageContainer
      title="Mapped Organisations"
      breadcrumbs={[{ label: "Providers", to: "/providers" }, { label: "Master List of Quota Package", to: `/providers/master-base-quota` }, { label: "Mapped Organisations" }]}>
      <ProviderQuotaDetailBar quotaPackage={quotaPackage} />
      <ListMappedOrganisations fetchMappedOrganisations={fetchBaseQuotaMappedOrganisation} exportMappedOrganisations={exportBaseQuotaMappedOrganisation} />
    </PageContainer>
  );
};

export default ListMappedOrganisationPage;
