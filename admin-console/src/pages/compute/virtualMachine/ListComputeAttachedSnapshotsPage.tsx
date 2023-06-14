import { useCallback } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import virtualMachinesRedux from "store/modules/virtualMachines";

import PageContainer from "components/layouts/Frame/PageContainer";
import ComputeDetailBar from "components/molecules/DetailBars/ComputeDetailBar";
import ListComputeAttachedSnapshots from "components/templates/compute/ListComputeAttachedSnapshots";

const ListComputeAttachedSnapshotsPage = () => {
  const dispatch = useDispatch();
  const { state: routerState } = useLocation();
  const { compute }: { compute: any } = routerState;

  const fetchSnapshots = useCallback(
    (payload) => {
      dispatch(virtualMachinesRedux.actions.snapshots({ computeId: compute?.id, providerId: compute?.provider_id }, payload));
    },
    [dispatch, compute],
  );

  const exportSnapshots = useCallback(async () => {
    try {
      return await dispatch(virtualMachinesRedux.actions.exportSnapshots({ computeId: compute?.id, providerId: compute?.provider_id }));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, compute]);

  return (
    <PageContainer title="Attached Snapshots" breadcrumbs={[{ label: "Compute", to: "/compute/types" }, { label: "Attached Snapshots" }]}>
      <ComputeDetailBar compute={compute} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />
      <ListComputeAttachedSnapshots fetchSnapshots={fetchSnapshots} exportSnapshots={exportSnapshots} />
    </PageContainer>
  );
};

export default ListComputeAttachedSnapshotsPage;
