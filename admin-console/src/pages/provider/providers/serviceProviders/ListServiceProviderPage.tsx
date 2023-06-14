import { useCallback } from "react";
import { useParams } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import ProviderSummaryPanel from "components/templates/providers/resourceSummaryPanels/ProviderSummaryPanel";
import ListServiceProviders from "components/templates/providers/serviceProviders/ListServiceProviders";

export const enum MODAL_TYPE {
  MANAGE_PUBLIC_KEYS = "MANAGE_PUBLIC_KEYS",
}

const ListServiceProviderPage = () => {
  const { providerId } = useParams();

  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const providerById = providersRedux.getters.providerById(rootState, providerId);

  const fetchServiceProviders = useCallback(() => {
    dispatch(providersRedux.actions.serviceProviders(providerId));
  }, [dispatch, providerId]);

  const exportServiceProviders = useCallback(async () => {
    try {
      return await dispatch(providersRedux.actions.exportServiceProviders(providerId));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, providerId]);

  return (
    <PageContainer title="Service Providers" breadcrumbs={[{ label: "Providers", to: "/providers" }, { label: "Service Providers" }]}>
      <ProviderSummaryPanel provider={providerById} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />
      <ListServiceProviders fetchServiceProviders={fetchServiceProviders} exportServiceProviders={exportServiceProviders} />
    </PageContainer>
  );
};

export default ListServiceProviderPage;
