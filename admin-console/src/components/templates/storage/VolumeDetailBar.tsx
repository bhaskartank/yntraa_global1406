import { Box, Divider, Stack, Typography } from "@mui/material";
import { FC } from "react";

import ResourceName from "components/atoms/ResourceName";
import StatusChip from "components/atoms/StatusChip";
import DataChip from "components/atoms/DataChip"
import UnitFilter from "components/atoms/UnitFilter";

interface VolumeDetailBarProps {
  volume: any;
  customStyle?: any;
}

const VolumeDetailBar: FC<VolumeDetailBarProps> = ({ volume, customStyle = {} }) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={4}
      sx={{ color: "black", px: 1, borderBottom: "1px solid black", whiteSpace: "pre-wrap", ...customStyle }}>
      <Stack direction="row" alignItems="center" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box fontWeight="bold" component="span">Volume Name:</Box>
          <ResourceName label={volume?.volume_name} noWrap />
        </Stack>
        <DataChip label={volume?.volume_size + ' GiB'} />
        <StatusChip label={volume?.status} hideIcon />
      </Stack>

      { /* <Stack direction="row" spacing={1} alignItems="center" divider={<Divider orientation="vertical" flexItem />}>
        <Typography component="span" variant="caption" lineHeight="16px" noWrap>
          <Box fontWeight="bold" component="span">
            {compute?.flavor?.vcpus}
          </Box>{" "}
          <Box component="span">vCPU</Box>
        </Typography>
        <Typography component="span" variant="caption" lineHeight="16px" noWrap>
          <UnitFilter size={compute?.flavor?.ram} unit="GiB" flavorType="ram" valueBold />
        </Typography>
        <Typography component="span" variant="caption" lineHeight="16px" noWrap>
          <UnitFilter size={compute?.flavor?.disk} unit="GiB" flavorType="disk" valueBold /> <span>BLOCK</span>
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="body2" noWrap>
          Private IP:
        </Typography>
        <StatusChip label={compute?.private_ip} color="info" />
      </Stack> */ }
    </Stack>
  );
};

export default VolumeDetailBar;
