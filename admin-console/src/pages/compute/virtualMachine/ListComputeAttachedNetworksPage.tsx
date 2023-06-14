import { useCallback } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import virtualMachinesRedux from "store/modules/virtualMachines";

import PageContainer from "components/layouts/Frame/PageContainer";
import ComputeDetailBar from "components/molecules/DetailBars/ComputeDetailBar";
import ListComputeAttachedNetworks from "components/templates/compute/ListComputeAttachedNetworks";

const ListComputeAttachedNetworksPage = () => {
  const dispatch = useDispatch();
  const { state: routerState } = useLocation();
  const { compute }: { compute: any } = routerState;

  const fetchAttachedNetworks = useCallback(() => {
    dispatch(virtualMachinesRedux.actions.networks({ computeId: compute?.id, providerId: compute?.provider_id }));
  }, [dispatch, compute]);

  const exportAttachedNetworks = useCallback(async () => {
    try {
      return await dispatch(virtualMachinesRedux.actions.exportNetworks({ computeId: compute?.id, providerId: compute?.provider_id }));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, compute]);

  return (
    <PageContainer title="Attached Networks" breadcrumbs={[{ label: "Compute", to: "/compute/types" }, { label: "Attached Networks" }]}>
      <ComputeDetailBar compute={compute} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />
      <ListComputeAttachedNetworks fetchAttachedNetworks={fetchAttachedNetworks} exportAttachedNetworks={exportAttachedNetworks} />
    </PageContainer>
  );
};

export default ListComputeAttachedNetworksPage;
