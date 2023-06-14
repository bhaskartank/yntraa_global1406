import { useCallback } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListOpenstackSubnets from "components/templates/providers/openstackNetwork/ListOpenstackSubnets";
import ProviderSummaryPanel from "components/templates/providers/resourceSummaryPanels/ProviderSummaryPanel";

const ListOpenstackSubnetPage = () => {
  const { state: routerState } = useLocation();
  const { provider }: { provider: any } = routerState;

  const dispatch = useDispatch();

  const fetchOpenstackSubnets = useCallback(() => {
    dispatch(providersRedux.actions.openstackSubnets({ provider_id: provider?.id }));
  }, [dispatch, provider]);

  const exportOpenstackSubnets = useCallback(async () => {
    try {
      return await dispatch(providersRedux.actions.exportOpenstackSubnets({ provider_id: provider?.id }));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, provider]);

  return (
    <PageContainer title="Openstack Subnets" breadcrumbs={[{ label: "Providers", to: "/providers" }, { label: "Openstack Subnets" }]}>
      <ProviderSummaryPanel provider={provider} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />
      <ListOpenstackSubnets fetchOpenstackSubnets={fetchOpenstackSubnets} exportOpenstackSubnets={exportOpenstackSubnets} />
    </PageContainer>
  );
};

export default ListOpenstackSubnetPage;
