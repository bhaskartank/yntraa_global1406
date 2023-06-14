import { useCallback } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import HypervisorDetailBar from "components/molecules/DetailBars/HypervisorDetailBar";
import ListHypervisors from "components/templates/providers/ListHypervisors";
import ProviderSummaryPanel from "components/templates/providers/resourceSummaryPanels/ProviderSummaryPanel";

const ListHypervisorPage = () => {
  const { state: routerState } = useLocation();
  const { provider }: { provider: any } = routerState;

  const dispatch = useDispatch();

  const fetchHypervisors = useCallback(() => {
    dispatch(providersRedux.actions.hypervisors({ provider_id: provider?.id }));
  }, [dispatch, provider]);

  const exportHypervisors = useCallback(async () => {
    try {
      return await dispatch(providersRedux.actions.exportHypervisors({ provider_id: provider?.id }));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, provider]);

  return (
    <PageContainer title="Hypervisors" breadcrumbs={[{ label: "Providers", to: "/providers" }, { label: "Hypervisors" }]}>
      <ProviderSummaryPanel provider={provider} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />
      <HypervisorDetailBar provider={provider} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />
      <ListHypervisors fetchHypervisors={fetchHypervisors} exportHypervisors={exportHypervisors} />
    </PageContainer>
  );
};

export default ListHypervisorPage;
