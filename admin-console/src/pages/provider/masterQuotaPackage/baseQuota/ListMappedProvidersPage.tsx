import { useCallback } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import ProviderQuotaDetailBar from "components/molecules/DetailBars/ProviderQuotaDetailBar";
import ListMappedProviders from "components/templates/providers/ListMappedProviders";

const ListMappedProvidersPage = () => {
  const { state: routerState } = useLocation();
  const { quotaPackage } = routerState;

  const dispatch = useDispatch();

  const fetchBaseQuotaMappedProviders = useCallback(
    (payload) => {
      dispatch(providersRedux.actions.quotaMappedProviders(quotaPackage?.id, payload));
    },
    [dispatch, quotaPackage],
  );

  const exportBaseQuotaMappedProviders = useCallback(async () => {
    try {
      return await dispatch(providersRedux.actions.exportQuotaMappedProviders(quotaPackage?.id, {}));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, quotaPackage]);

  return (
    <PageContainer
      title="Mapped Providers"
      breadcrumbs={[{ label: "Providers", to: "/providers" }, { label: "Master List of Quota Package", to: `/providers/master-base-quota` }, { label: "Mapped Providers" }]}>
      <ProviderQuotaDetailBar quotaPackage={quotaPackage} />
      <ListMappedProviders fetchMappedProviders={fetchBaseQuotaMappedProviders} exportMappedProviders={exportBaseQuotaMappedProviders} />
    </PageContainer>
  );
};

export default ListMappedProvidersPage;
