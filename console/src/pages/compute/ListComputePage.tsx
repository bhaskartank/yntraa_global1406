import { useCallback } from "react";

import { useDispatch, useSelector } from "store";
import snapshotRedux from "store/modules/snapshots";
import virtualMachineRedux from "store/modules/virtual-machines";

import PageContainer from "components/layouts/Frame/PageContainer";
import TabBox from "components/molecules/TabBox";
import ListCompute from "components/templates/compute/ListCompute";
import ListComputeSnapshot from "components/templates/compute/ListComputeSnapshot";

import { pageTitles } from "utils/constants";

const ListComputePage = () => {
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const virtualMachines = virtualMachineRedux.getters.virtualMachines(rootState);
  const computeSnapshots = snapshotRedux.getters.snapshots(rootState);

  const fetchVirtualMachines = useCallback(
    (payload) => {
      dispatch(virtualMachineRedux.actions.virtualMachines(payload));
    },
    [dispatch],
  );

  const fetchComputeSnapshots = useCallback(
    (payload) => {
      dispatch(snapshotRedux.actions.snapshots(payload));
    },
    [dispatch],
  );

  const handleShutoffVM = useCallback(
    (item) => {
        dispatch(virtualMachineRedux.actions.stopVirtualMachine({ compute_id: item?.id }));
    },
    [dispatch],
  );

  const handlePause = useCallback(
    (item) => {
        dispatch(virtualMachineRedux.actions.pauseVirtualMachine({ compute_id: item?.id }));
    },
    [dispatch],
  );

  const handleUnpause = useCallback(
    (item) => {
        dispatch(virtualMachineRedux.actions.unpauseVirtualMachine({ compute_id: item?.id }));
    },
    [dispatch],
  );

  const handleDelete = useCallback(
    (item) => {
      dispatch(virtualMachineRedux.actions.deleteVirtualMachine({ compute_id: item?.id }, () => null));
    },
    [dispatch],
  );

  const handleRevertResize = useCallback(
    (item) => {
      dispatch(virtualMachineRedux.actions.revertVirtualMachineResize({ compute_id: item?.id }));
    },
    [dispatch],
  );

  const handleStart = useCallback(
    (item) => {
      dispatch(virtualMachineRedux.actions.startVirtualMachine({ compute_id: item?.id }));
    },
    [dispatch],
  );

  const handleRestart = useCallback(
    (item) => {
      dispatch(virtualMachineRedux.actions.restartVirtualMachine({ compute_id: item?.id }));
    },
    [dispatch],
  );

  const handleHardRestart = useCallback(
    (item) => {
      try {
        dispatch(virtualMachineRedux.actions.hardRestartVirtualMachine({ compute_id: item?.id }));
      } catch (e) {
        console.error(e);
      }
    },
    [dispatch],
  );

  const handleConfirmResize = useCallback(
    (item) => {
      dispatch(virtualMachineRedux.actions.confirmVirtualMachineResize({ compute_id: item?.id }));
    },
    [dispatch],
  );

  const getStatusUpdate = useCallback(
    (item) => {
      dispatch(
        virtualMachineRedux.actions.currentStatus({
          computeId: item?.id,
          terminate_task: item.task_id ? true : "",
        }),
      );
    },
    [dispatch],
  );

  return (
    <PageContainer title={pageTitles?.PAGE_TITLE_COMPUTE}>
      <TabBox
        tabs={[
          {
            title: pageTitles?.PAGE_TITLE_VIRTUAL_MACHINE_LIST,
            content: (
              <ListCompute
                list={virtualMachines?.list}
                totalRecords={virtualMachines?.totalRecords}
                fetchList={fetchVirtualMachines}
                handlePauseVM={handlePause}
                handleUnpauseVM={handleUnpause}
                handleShutoffVM={handleShutoffVM}
                handleStartVM={handleStart}
                handleRevertResizeVM={handleRevertResize}
                handleRestartVM={handleRestart}
                handleHardRestartVM={handleHardRestart}
                handleResizeVM={handleConfirmResize}
                getStatusUpdate={getStatusUpdate}
                handleDeleteVM={handleDelete}
              />
            ),
          },
          {
            title: pageTitles?.PAGE_TITLE_COMPUTE_SNAPSHOT,
            content: <ListComputeSnapshot list={computeSnapshots?.list} totalRecords={computeSnapshots?.totalRecords} fetchList={fetchComputeSnapshots} />,
          },
        ]}
      />
    </PageContainer>
  );
};

export default ListComputePage;
