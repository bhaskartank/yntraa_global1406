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
import { GridCreatorProps } from "components/organisms/DataList/types";
import useDataList from "components/organisms/DataList/useDataList";

import { appRoutes } from "utils/constants";

import LinuxImage from "assets/images/operating-system/linux.png";

interface AttachedResourcesProps {
  volume: any;
}

const AttachedResources: FC<AttachedResourcesProps> = ({ volume }) => {
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

  const dataList = useDataList({
    data: volume?.compute?.data ? [volume?.compute?.data] : [],
    gridCreator,
    gridViewBreakpoints: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 },
  });

  return <DataList dataList={dataList} />;
};

export default AttachedResources;
