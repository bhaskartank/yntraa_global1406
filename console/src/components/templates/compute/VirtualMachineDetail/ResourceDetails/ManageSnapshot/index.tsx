import { Grid } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "store";
import snapshotsRedux from "store/modules/snapshots";

import { ComputeSnapshots } from "./ComputeSnapshots";
import { VolumeSnapshots } from "./VolumeSnapshots";

interface ManageSnapshotProps {
  virtualMachine: any;
}

export default function ManageSnapshot({ virtualMachine }: ManageSnapshotProps) {
  const dispatch = useDispatch();
  const rootState = useSelector((state: any) => state);
  const snapshots = snapshotsRedux.getters.computeSnapshots(rootState);

  const [isDeleteActive, setIsDeleteActive] = useState<boolean>(false);
  const [selectedComputeSnapshot, setSelectedComputeSnapshot] = useState<any>(null);
  const [selectedVolumeSnapshots, setSelectedVolumeSnapshots] = useState<any[]>([]);

  const virtualMachineId = useMemo(() => virtualMachine?.id, [virtualMachine?.id]);

  const fetchSnapshots = useCallback(async () => {
    try {
      return await dispatch(snapshotsRedux.actions.computeSnapshots({ computeId: virtualMachineId }));
    } catch (e) {
      console.error(e);
    }
  }, [dispatch, virtualMachineId]);

  const handleDeleteSnapshot = useCallback(
    async (payload) => {
      try {
        await dispatch(snapshotsRedux.actions.deleteComputeSnapshot({ snapshotId: payload?.snapshotId, volume_snapshot_list: payload?.volumeSnapshotList }, fetchSnapshots));
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch, fetchSnapshots],
  );

  const handleSelectComputeSnapshot = useCallback(
    async (computeSnapshot) => {
      setSelectedComputeSnapshot(computeSnapshot);
    },
    [setSelectedComputeSnapshot],
  );

  const handleSelectVolumeSnapshots = useCallback(
    async (volumeSnapshot) => {
      if (selectedVolumeSnapshots.find((item) => item?.id === volumeSnapshot?.id)) {
        setSelectedVolumeSnapshots((current) => current.filter((item) => item?.id !== volumeSnapshot?.id));
      } else {
        setSelectedVolumeSnapshots((current) => [...current, volumeSnapshot]);
      }
    },
    [setSelectedVolumeSnapshots, selectedVolumeSnapshots],
  );

  const handleConfirmDelete = useCallback(async () => {
    try {
      const payload = {
        snapshotId: selectedComputeSnapshot?.id,
        volume_snapshot_list: selectedVolumeSnapshots?.map((snapshot) => snapshot?.id),
      };
      await handleDeleteSnapshot(payload);
      setSelectedComputeSnapshot(null);
      setSelectedVolumeSnapshots([]);
      setIsDeleteActive(false);
      fetchSnapshots();
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchSnapshots();
  }, [fetchSnapshots]);

  useEffect(() => {
    if (!isDeleteActive) {
      setSelectedVolumeSnapshots([]);
    }
  }, [isDeleteActive, setSelectedVolumeSnapshots]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <ComputeSnapshots
          data={snapshots?.list}
          handleSelectComputeSnapshot={handleSelectComputeSnapshot}
          setIsDeleteActive={setIsDeleteActive}
          selectedComputeSnapshot={selectedComputeSnapshot}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <VolumeSnapshots
          data={selectedComputeSnapshot?.volume_snapshot_compute_snapshot || []}
          isDeleteActive={isDeleteActive}
          selectedVolumeSnapshots={selectedVolumeSnapshots}
          handleSelectVolumeSnapshot={handleSelectVolumeSnapshots}
        />
      </Grid>
    </Grid>
  );
}
