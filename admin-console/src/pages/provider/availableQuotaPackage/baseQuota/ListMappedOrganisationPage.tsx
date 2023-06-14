import { useCallback } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListMappedOrganisations from "components/templates/providers/ListMappedOrganisations";

const ListMappedOrganisationPage = () => {
  const { state: routerState } = useLocation();
  const { quotaPackage } = routerState;

  const dispatch = useDispatch();

  const fetchBaseQuotaMappedOrganisation = useCallback(
    (payload) => {
      dispatch(providersRedux.actions.quotaMappedOrganisation(quotaPackage?.quotapackage_id, { ...payload, provider_id: quotaPackage?.provider_id }));
    },
    [dispatch, quotaPackage],
  );

  const exportBaseQuotaMappedOrganisation = useCallback(async () => {
    try {
      return await dispatch(providersRedux.actions.exportQuotaMappedOrganisation(quotaPackage?.quotapackage_id, { provider_id: quotaPackage?.provider_id }));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, quotaPackage]);

  return (
    <PageContainer
      title="Mapped Organisations"
      breadcrumbs={[{ label: "Providers", to: "/providers" }, { label: "Available Base Quota", to: `/providers/available-base-quota` }, { label: "Mapped Organisations" }]}>
      <ListMappedOrganisations fetchMappedOrganisations={fetchBaseQuotaMappedOrganisation} exportMappedOrganisations={exportBaseQuotaMappedOrganisation} />
    </PageContainer>
  );
};

export default ListMappedOrganisationPage;
