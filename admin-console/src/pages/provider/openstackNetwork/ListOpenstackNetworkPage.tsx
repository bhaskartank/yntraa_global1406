import { useCallback } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListOpenstackNetworks from "components/templates/providers/openstackNetwork/ListOpenstackNetworks";
import ProviderSummaryPanel from "components/templates/providers/resourceSummaryPanels/ProviderSummaryPanel";

const ListOpenstackNetworkPage = () => {
  const { state: routerState } = useLocation();
  const { provider }: { provider: any } = routerState;

  const dispatch = useDispatch();

  const fetchOpenstackNetworks = useCallback(() => {
    dispatch(providersRedux.actions.openstackNetworks({ provider_id: provider?.id }));
  }, [dispatch, provider]);

  const exportOpenstackNetworks = useCallback(async () => {
    try {
      return await dispatch(providersRedux.actions.exportOpenstackNetworks({ provider_id: provider?.id }));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, provider]);

  return (
    <PageContainer title="Openstack Networks" breadcrumbs={[{ label: "Providers", to: "/providers" }, { label: "Openstack Networks" }]}>
      <ProviderSummaryPanel provider={provider} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />
      <ListOpenstackNetworks fetchOpenstackNetworks={fetchOpenstackNetworks} exportOpenstackNetworks={exportOpenstackNetworks} />
    </PageContainer>
  );
};

export default ListOpenstackNetworkPage;
