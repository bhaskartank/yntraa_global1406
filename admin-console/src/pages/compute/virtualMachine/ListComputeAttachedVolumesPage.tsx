import { useCallback } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import virtualMachinesRedux from "store/modules/virtualMachines";

import PageContainer from "components/layouts/Frame/PageContainer";
import ComputeDetailBar from "components/molecules/DetailBars/ComputeDetailBar";
import ListComputeAttachedVolumes from "components/templates/compute/ListComputeAttachedVolumes";

const ListComputeAttachedVolumesPage = () => {
  const dispatch = useDispatch();
  const { state: routerState } = useLocation();
  const { compute }: { compute: any } = routerState;

  const fetchAttachedVolumes = useCallback(() => {
    dispatch(virtualMachinesRedux.actions.volumes({ computeId: compute?.id, providerId: compute?.provider_id }));
  }, [dispatch, compute]);

  const exportAttachedVolumes = useCallback(async () => {
    try {
      return await dispatch(virtualMachinesRedux.actions.exportVolumes({ computeId: compute?.id, providerId: compute?.provider_id }));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, compute]);

  return (
    <PageContainer title="Attached Volumes" breadcrumbs={[{ label: "Compute", to: "/compute/types" }, { label: "Attached Volumes" }]}>
      <ComputeDetailBar compute={compute} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />
      <ListComputeAttachedVolumes fetchAttachedVolumes={fetchAttachedVolumes} exportAttachedVolumes={exportAttachedVolumes} />
    </PageContainer>
  );
};

export default ListComputeAttachedVolumesPage;
