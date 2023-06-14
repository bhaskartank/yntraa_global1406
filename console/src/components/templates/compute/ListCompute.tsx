import { Divider, Stack } from "@mui/material";
import { FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import DataChip from "components/atoms/DataChip";
import DateDisplay from "components/atoms/DateDisplay";
import { GridViewSection, GridViewWrapper } from "components/atoms/GridViewWrapper";
import KeyValuePair from "components/atoms/KeyValuePair";
import ResourceName from "components/atoms/ResourceName";
import StatusChip from "components/atoms/StatusChip";
import TagList from "components/atoms/TagList";
import UnitFilter from "components/atoms/UnitFilter";
import DataList from "components/organisms/DataList";
import { GridCreatorProps, RowActionProps } from "components/organisms/DataList/types";
import useDataList from "components/organisms/DataList/useDataList";

import { appRoutes, pageTitles } from "utils/constants";

import LinuxImage from "assets/images/operating-system/linux.png";

interface ListComputeProps {
  list: any[];
  totalRecords: number;
  fetchList: (payload: any) => void;
  handleShutoffVM: (payload: any) => void;
  handlePauseVM: (payload: any) => void;
  handleUnpauseVM: (payload: any) => void;
  handleStartVM: (payload: any) => void;
  handleRevertResizeVM: (payload: any) => void;
  handleRestartVM: (payload: any) => void;
  handleHardRestartVM: (payload: any) => void;
  handleResizeVM: (payload: any) => void;
  getStatusUpdate: (payload: any) => void;
  handleDeleteVM: (payload: any) => void;
}

const ListCompute: FC<ListComputeProps> = ({
  list,
  totalRecords,
  fetchList,
  handleShutoffVM,
  handlePauseVM,
  handleUnpauseVM,
  handleStartVM,
  handleRevertResizeVM,
  handleRestartVM,
  handleHardRestartVM,
  handleResizeVM,
  getStatusUpdate,
  handleDeleteVM,
}) => {
  const navigate = useNavigate();

  const getState = (action, taskId) => {
    let status: { label: string } = { label: action };

    if (taskId || action?.toLowerCase() === "processing") {
      status = { label: "processing" };
    } else if (!action) {
      status = { label: "Error" };
    } else {
      switch (action?.toLowerCase()) {
        case "active":
          status = { label: "Running" };
          break;

        case "reboot":
          status = { label: "Restarting" };
          break;

        case "paused":
          status = { label: "Paused" };
          break;

        case "shutoff":
          status = { label: "Stopped" };
          break;

        case "success":
          status = { label: "Running" };
          break;

        case "verify_resize":
          status = { label: "Verify Resize" };
          break;

        case "error":
          status = { label: "Error" };
          break;

        default:
          status = { label: action };
          break;
      }
    }

    return <StatusChip label={status.label} />;
  };

  const gridCreator: GridCreatorProps = useCallback(
    (item: any) => ({
      header: (
        <Stack direction="row" alignItems="center" spacing={1}>
          <img src={LinuxImage} width="40" />

          <Stack gap="4px">
            <ResourceName label={item?.instance_name} onClick={() => navigate(appRoutes.VIRTUAL_MACHINE_DETAIL(item?.id, "overview"))} />

            <Stack direction="row" alignItems="center" spacing={1} divider={<Divider flexItem orientation="vertical" />}>
              <DataChip label={item?.flavor?.vcpus} suffix="vCPU" />
              <UnitFilter size={item?.flavor?.ram} unit="GiB" variant="filled" flavorType="ram" suffix="RAM" />
              <UnitFilter size={item?.flavor?.disk} unit="GiB" variant="filled" flavorType="disk" suffix="BLOCK" />
            </Stack>
          </Stack>
        </Stack>
      ),
      content: (
        <GridViewWrapper>
          <GridViewSection>
            <KeyValuePair label="Status" value={<StatusChip label={item?.status} />} />
            <KeyValuePair label="State" value={getState(item?.action, item.task_id)} />
            <KeyValuePair label="Availability Zone" value={item?.availability_zone} />
            <KeyValuePair label="Networks" value={<TagList tags={item?.compute_network_mapping?.map((network) => network?.network?.network_name)} />} />
          </GridViewSection>
          <GridViewSection>
            <KeyValuePair
              label="Security Groups"
              value={<TagList tags={item?.compute_security_group_mapping?.map((securityGroup) => securityGroup?.security_group?.security_group_name)} />}
            />
            <KeyValuePair label="Flavor" value={item?.flavor?.name} />
            <KeyValuePair label="Volumes" value={<TagList tags={item?.volume_attach_compute?.map((volume) => volume?.volume?.volume_name)} />} />
            <KeyValuePair label="Floating IP" value={item?.floating_ip ? <StatusChip label={item?.floating_ip} /> : null} />
          </GridViewSection>
          <GridViewSection>
            <KeyValuePair label="Created At" value={<DateDisplay datetime={item?.created} />} />
            <KeyValuePair label="Last Update" value={<DateDisplay datetime={item?.updated} />} />
          </GridViewSection>
        </GridViewWrapper>
      ),
    }),
    [navigate],
  );

  const isResizeVerificationPending = (item: any) => item?.action?.toLowerCase() === "verify_resize";
  const isActive = (item: any) => item?.action?.toLowerCase() === "active";
  const isShutoff = (item: any) => item?.action?.toLowerCase() === "shutoff";
  const isPaused = (item: any) => item?.action?.toLowerCase() === "paused";
  const isError = (item: any) => item?.action === null || item?.action?.toLowerCase() === "error";

  const rowActions: RowActionProps[] = [
    {
      label: () => "Confirm",
      onClick: (item) => handleResizeVM(item),
      hidden: (item) => !isResizeVerificationPending(item),
      confirmation: (item) => ({
        title: `Resize VM (${item.instance_name})`,
        description: `Are you sure to resize virtual machine?`,
      }),
      disabled: (item) => !!(item?.task_id || item?.status?.toLowerCase() === "processing" || item?.status?.toLowerCase() === "deleting"),
    },
    {
      label: () => "Revert",
      onClick: (item) => handleRevertResizeVM(item),
      hidden: (item) => !isResizeVerificationPending(item),
      confirmation: (item) => ({
        title: `Revert Virtual Machine Resize (${item.instance_name})`,
        description: `Are you sure to revert resize virtual machine?`,
      }),
      disabled: (item) => !!(item?.task_id || item?.status?.toLowerCase() === "processing" || item?.status?.toLowerCase() === "deleting"),
    },
    {
      label: () => "Shutoff",
      onClick: (item) => handleShutoffVM(item),
      hidden: (item) => !isActive(item),
      confirmation: (item) => ({
        title: `Stop VM (${item.instance_name})`,
        description: `Are you sure to stop virtual machine?`,
      }),
      disabled: (item) => !!(item?.task_id || item?.status?.toLowerCase() === "processing" || item?.status?.toLowerCase() === "deleting"),
    },
    {
      label: () => "Start",
      onClick: (item) => handleStartVM(item),
      hidden: (item) => !isShutoff(item),
      confirmation: (item) => ({
        title: `Start VM (${item.instance_name})`,
        description: `Are you sure to start virtual machine?`,
      }),
      disabled: (item) => !!(item?.task_id || item?.status?.toLowerCase() === "processing" || item?.status?.toLowerCase() === "deleting"),
    },
    {
      label: () => "Pause",
      onClick: (item) => handlePauseVM(item),
      hidden: (item) => !isActive(item),
      confirmation: (item) => ({
        title: `Pause VM (${item.instance_name})`,
        description: `Are you sure to pause virtual machine?`,
      }),
      disabled: (item) => !!(item?.task_id || item?.status?.toLowerCase() === "processing" || item?.status?.toLowerCase() === "deleting"),
    },
    {
      label: () => "Unpause",
      onClick: (item) => handleUnpauseVM(item),
      hidden: (item) => !isPaused(item),
      confirmation: (item) => ({
        title: `Unpause VM (${item.instance_name})`,
        description: `Are you sure to unpause virtual machine?`,
      }),
      disabled: (item) => !!(item?.task_id || item?.status?.toLowerCase() === "processing" || item?.status?.toLowerCase() === "deleting"),
    },
    {
      label: () => "Reboot",
      onClick: (item) => handleRestartVM(item),
      hidden: (item) => !isActive(item),
      confirmation: (item) => ({
        title: `Reboot VM (${item.instance_name})`,
        description: `Are you sure to reboot virtual machine?`,
      }),
      disabled: (item) => !!(item?.task_id || item?.status?.toLowerCase() === "processing" || item?.status?.toLowerCase() === "deleting"),
    },
    {
      label: () => "Hard Reboot",
      onClick: (item) => handleHardRestartVM(item),
      hidden: (item) => !(isActive(item) || isShutoff(item) || isError(item)),
      confirmation: (item) => ({
        title: `Hard Reboot VM (${item.instance_name})`,
        description: `Are you sure to hard reboot virtual machine?`,
      }),
      disabled: (item) => !!(item?.task_id || item?.status?.toLowerCase() === "processing" || item?.status?.toLowerCase() === "deleting"),
    },
    {
      label: () => "Manage Networks",
      onClick: (item) => navigate(appRoutes.VIRTUAL_MACHINE_DETAIL(item?.id, "networks")),
      hidden: (item) => !isActive(item),
      disabled: (item) => !!(item?.task_id || item?.status?.toLowerCase() === "processing" || item?.status?.toLowerCase() === "deleting"),
    },
    {
      label: () => "Manage Snapshots",
      onClick: (item) => navigate(appRoutes.VIRTUAL_MACHINE_DETAIL(item?.id, "snapshots")),
      hidden: (item) => !isActive(item),
      disabled: (item) => !!(item?.task_id || item?.status?.toLowerCase() === "processing" || item?.status?.toLowerCase() === "deleting"),
    },
    {
      label: () => "Manage Security Group",
      onClick: (item) => navigate(appRoutes.VIRTUAL_MACHINE_DETAIL(item?.id, "security-groups")),
      hidden: (item) => !isActive(item),
      disabled: (item) => !!(item?.task_id || item?.status?.toLowerCase() === "processing" || item?.status?.toLowerCase() === "deleting"),
    },
    {
      label: () => "Update VM Status",
      onClick: (item) => getStatusUpdate(item),
      confirmation: (item) => ({
        title: `Get Status (${item.instance_name})`,
        confirmBtnText: "Fetch Status",
        cancelBtnText: "Cancel",
        warningCheckMessage: item?.task_id ? `Do you wish to clear the background task and initiate new process to get updated VM status?` : "",
        description: item?.task_id
          ? `A background task(${item?.task_id}) is in process for this VM. To get the updated status you need to kill this background process.`
          : `Are you sure you want to update status of virtual machine?`,
      }),
    },
    {
      label: () => "Delete",
      onClick: (item) => handleDeleteVM(item),
      color: () => "error.main",
      confirmation: (item) => ({
        title: `Delete (${item.instance_name})`,
        description: `Are you sure to delete virtual machine?`,
      }),
    },
  ];

  const reload = useCallback(
    ({ page, size }) => {
      fetchList({ offset: page * size, limit: size });
    },
    [fetchList],
  );

  const dataList = useDataList({
    data: list,
    totalRecords,
    rowActions,
    gridCreator,
    gridViewBreakpoints: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 },
    createResourceButton: {
      text: pageTitles.PAGE_TITLE_CREATE_VIRTUAL_MACHINE,
      onClick: () => navigate(appRoutes.CREATE_VIRTUAL_MACHINE),
    },
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListCompute;
