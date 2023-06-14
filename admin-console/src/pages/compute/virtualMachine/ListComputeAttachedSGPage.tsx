import { useCallback } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import virtualMachinesRedux from "store/modules/virtualMachines";

import PageContainer from "components/layouts/Frame/PageContainer";
import ComputeDetailBar from "components/molecules/DetailBars/ComputeDetailBar";
import ListComputeAttachedSG from "components/templates/compute/ListComputeAttachedSG";

const ListComputeAttachedSGPage = () => {
  const dispatch = useDispatch();
  const { state: routerState } = useLocation();
  const { compute }: { compute: any } = routerState;

  const fetchSecurityGroups = useCallback(() => {
    dispatch(virtualMachinesRedux.actions.securityGroups({ computeId: compute?.id, providerId: compute?.provider_id }));
  }, [dispatch, compute]);

  const exportSecurityGroups = useCallback(async () => {
    try {
      return await dispatch(virtualMachinesRedux.actions.exportSecurityGroups({ computeId: compute?.id, providerId: compute?.provider_id }));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, compute]);

  return (
    <PageContainer title="Attached Security Groups" breadcrumbs={[{ label: "Compute", to: "/compute/types" }, { label: "Attached Security Groups" }]}>
      <ComputeDetailBar compute={compute} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />
      <ListComputeAttachedSG fetchSecurityGroups={fetchSecurityGroups} exportSecurityGroups={exportSecurityGroups} />
    </PageContainer>
  );
};

export default ListComputeAttachedSGPage;
