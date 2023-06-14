import { Divider, Stack, Typography } from "@mui/material";
import { FC } from "react";

import CopyClipboard from "components/atoms/CopyClipboard";
import DataChip from "components/atoms/DataChip";
import KeyValuePair from "components/atoms/KeyValuePair";
import StatusChip from "components/atoms/StatusChip";
import UnitFilter from "components/atoms/UnitFilter";

import LinuxImage from "assets/images/operating-system/linux.png";

interface SummaryHeaderProps {
  virtualMachine: any;
}

const SummaryHeader: FC<SummaryHeaderProps> = ({ virtualMachine }) => {
  return (
    <Stack direction="row" alignItems="center" divider={<Divider flexItem orientation="vertical" />} gap={3}>
      <Stack direction="row" alignItems="center" gap={1}>
        <img src={LinuxImage} width="50" />
        <Stack gap={1}>
          <Typography variant="subtitle1">{virtualMachine?.instance_name}</Typography>
          <Stack direction="row" alignItems="center" gap={1} divider={<Divider flexItem orientation="vertical" />}>
            <StatusChip label={virtualMachine?.action} />
            <DataChip label={virtualMachine?.flavor?.vcpus} suffix="vCPU" />
            <UnitFilter size={virtualMachine?.flavor?.ram} unit="GiB" variant="filled" flavorType="ram" suffix="RAM" />
            <UnitFilter size={virtualMachine?.flavor?.disk} unit="GiB" variant="filled" flavorType="disk" suffix="BLOCK" />
          </Stack>
        </Stack>
      </Stack>
      <Stack direction="row" alignItems="center" gap={1}>
        <Stack spacing={1} flex={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <KeyValuePair label="Private IP" value={virtualMachine?.private_ip} />

            <CopyClipboard copyText={virtualMachine?.private_ip} />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <KeyValuePair label="Floating IP" value={virtualMachine?.floating_ip} />

            <CopyClipboard copyText={virtualMachine?.floating_ip} />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default SummaryHeader;
