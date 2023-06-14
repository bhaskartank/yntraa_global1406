import useCurrentPath from "hooks/useCurrentPath";
import { useCallback } from "react";

import { useDispatch } from "store";
import datalistRedux from "store/modules/datalist";
import virtualMachinesRedux from "store/modules/virtualMachines";

import PageContainer from "components/layouts/Frame/PageContainer";
import ResourseOwnerDetail from "components/modals/ResourceOwnerDetail";
import ListComputeSnapshots from "components/templates/compute/ListComputeSnapshots";

const ListComputeSnapshotPage = () => {
  const datalistKey = useCurrentPath();
  const dispatch = useDispatch();

  const fetchComputeSnapshots = useCallback(
    (payload) => {
      dispatch(virtualMachinesRedux.actions.computeSnapshots(payload));
    },
    [dispatch],
  );

  const exportComputeSnapshots = useCallback(async () => {
    try {
      return await dispatch(virtualMachinesRedux.actions.exportComputeSnapshots());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const fetchComputeSnapshotsOwnerDetail = useCallback(
    (item) => {
      dispatch(virtualMachinesRedux.actions.computeSnapshotsOwnerDetails({ providerId: item?.provider_id, computeId: item?.id }));
    },
    [dispatch],
  );

  const updateSnapshotStatus = useCallback(
    async (item) => {
      try {
        await dispatch(virtualMachinesRedux.actions.updateSnapshotStatus(item?.provider_id, item?.id));
        dispatch(datalistRedux.actions.addListToRefresh({ key: datalistKey }));
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, datalistKey],
  );

  return (
    <PageContainer title="Compute Snapshots" breadcrumbs={[{ label: "Compute", to: "/compute/types" }, { label: "Compute Snapshots" }]}>
      <ListComputeSnapshots
        fetchComputeSnapshots={fetchComputeSnapshots}
        exportComputeSnapshots={exportComputeSnapshots}
        updateSnapshotStatus={updateSnapshotStatus}
        fetchComputeSnapshotsOwnerDetail={fetchComputeSnapshotsOwnerDetail}
      />
      <ResourseOwnerDetail modalTitle="Compute Snapshots Owner Details" />
    </PageContainer>
  );
};

export default ListComputeSnapshotPage;
