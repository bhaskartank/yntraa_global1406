import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import storageRedux from "store/modules/storage";

import PageContainer from "components/layouts/Frame/PageContainer";
import ResourseOwnerDetail from "components/modals/ResourceOwnerDetail";
import ListVolumeSnapshots from "components/templates/storage/ListVolumeSnapshots";

const ListVolumeSnapshotPage = () => {
  const dispatch = useDispatch();
  const { state: routerState } = useLocation();

  const defaultFilters = useMemo(() => {
    return routerState ? routerState.defaultFilters : null;
  }, [routerState]);

  const fetchVolumeSnapshots = useCallback(
    (payload) => {
      dispatch(storageRedux.actions.volumeSnapshots(payload));
    },
    [dispatch],
  );

  const exportVolumeSnapshots = useCallback(async () => {
    try {
      return await dispatch(storageRedux.actions.exportVolumeSnapshots());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const fetchVolumeSnapshotsOwnerDetail = useCallback(
    (item) => {
      dispatch(storageRedux.actions.computeVolumeSnapshotsOwnerDetails({ providerId: item?.provider_id, volumeSnapshotId: item?.id }));
    },
    [dispatch],
  );

  return (
    <PageContainer title="Volume Snapshots" breadcrumbs={[{ label: "Storage", to: "/storage/block-storage-list" }, { label: "Volume Snapshots" }]}>
      <ListVolumeSnapshots
        fetchVolumeSnapshots={fetchVolumeSnapshots}
        exportVolumeSnapshots={exportVolumeSnapshots}
        fetchVolumeSnapshotsOwnerDetail={fetchVolumeSnapshotsOwnerDetail}
        defaultFilters={defaultFilters}
      />
      <ResourseOwnerDetail modalTitle="Volume Snapshots Owner Details" />
    </PageContainer>
  );
};

export default ListVolumeSnapshotPage;
