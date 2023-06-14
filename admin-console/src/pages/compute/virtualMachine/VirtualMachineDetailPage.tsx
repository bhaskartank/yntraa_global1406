import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import virtualMachinesRedux from "store/modules/virtualMachines";

import PageContainer from "components/layouts/Frame/PageContainer";
import ComputeDetailBar from "components/molecules/DetailBars/ComputeDetailBar";
import VirtualMachineDetails from "components/templates/compute/VirtualMachineDetails";

const VirtualMachineDetailPage = () => {
  const { state: routerState } = useLocation();
  const { compute }: { compute: any } = routerState;

  const dispatch = useDispatch();
  const rootState = useSelector((state: any) => state);
  const vmById = virtualMachinesRedux.getters.vmById(rootState);

  useEffect(() => {
    dispatch(virtualMachinesRedux.actions.vmById({ computeId: compute?.id, providerId: compute?.provider_id }));
  }, [compute, dispatch]);

  return (
    <PageContainer title="Compute Overview" breadcrumbs={[{ label: "Compute", to: "/compute/types" }, { label: "Overview" }]}>
      <ComputeDetailBar compute={compute} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />
      <VirtualMachineDetails compute={vmById} />
    </PageContainer>
  );
};

export default VirtualMachineDetailPage;
