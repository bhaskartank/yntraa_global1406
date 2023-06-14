import { useCallback } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListOpenstackPorts from "components/templates/providers/openstackNetwork/ListOpenstackPorts";
import ProviderSummaryPanel from "components/templates/providers/resourceSummaryPanels/ProviderSummaryPanel";

const ListOpenstackPortPage = () => {
  const { state: routerState } = useLocation();
  const { provider }: { provider: any } = routerState;

  const dispatch = useDispatch();

  const fetchOpenstackPorts = useCallback(() => {
    dispatch(providersRedux.actions.openstackPorts({ provider_id: provider?.id }));
  }, [dispatch, provider]);

  const exportOpenstackPorts = useCallback(async () => {
    try {
      return await dispatch(providersRedux.actions.exportOpenstackPorts({ provider_id: provider?.id }));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, provider]);

  return (
    <PageContainer title="Openstack Ports" breadcrumbs={[{ label: "Providers", to: "/providers" }, { label: "Openstack Ports" }]}>
      <ProviderSummaryPanel provider={provider} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />
      <ListOpenstackPorts fetchOpenstackPorts={fetchOpenstackPorts} exportOpenstackPorts={exportOpenstackPorts} />
    </PageContainer>
  );
};

export default ListOpenstackPortPage;
