import { useCallback } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListOpenstackFloatingIPs from "components/templates/providers/openstackNetwork/ListOpenstackFloatingIPs";
import ProviderSummaryPanel from "components/templates/providers/resourceSummaryPanels/ProviderSummaryPanel";

const ListOpenstackFloatingIPPage = () => {
  const { state: routerState } = useLocation();
  const { provider }: { provider: any } = routerState;

  const dispatch = useDispatch();

  const fetchOpenstackFloatingIPs = useCallback(() => {
    dispatch(providersRedux.actions.openstackFloatingIPs({ provider_id: provider?.id }));
  }, [dispatch, provider]);

  const exportOpenstackFloatingIPs = useCallback(async () => {
    try {
      return await dispatch(providersRedux.actions.exportOpenstackFloatingIPs({ provider_id: provider?.id }));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, provider]);

  return (
    <PageContainer title="Openstack Floating IPs" breadcrumbs={[{ label: "Providers", to: "/providers" }, { label: "Openstack Floating IPs" }]}>
      <ProviderSummaryPanel provider={provider} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />

      <ListOpenstackFloatingIPs fetchOpenstackFloatingIPs={fetchOpenstackFloatingIPs} exportOpenstackFloatingIPs={exportOpenstackFloatingIPs} />
    </PageContainer>
  );
};

export default ListOpenstackFloatingIPPage;
