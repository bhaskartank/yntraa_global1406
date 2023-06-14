import { Box, Divider, Stack, Tooltip, Typography } from "@mui/material";
import { FC } from "react";

import ResourceName from "components/atoms/ResourceName";
import StatusChip from "components/atoms/StatusChip";
import UnitFilter from "components/atoms/UnitFilter";

import { getOsImgUrl } from "utilities";

interface FlavorDetailBarProps {
  flavor: any;
  customStyle?: any;
}

const FlavorDetailBar: FC<FlavorDetailBarProps> = ({ flavor, customStyle = {} }) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={4}
      sx={{ color: "black", px: 1, borderBottom: "1px solid black", whiteSpace: "pre-wrap", ...customStyle }}>
      <Stack direction="row" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography>Flavor Name:</Typography>
          <ResourceName label={flavor?.name} noWrap />
          <StatusChip label={flavor?.is_active ? "active" : "inactive"} hideIcon />
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center" divider={<Divider orientation="vertical" flexItem />}>
        <Typography component="span" variant="caption" lineHeight="16px" noWrap>
          <Box fontWeight="bold" component="span">
            {flavor?.vcpus}
          </Box>{" "}
          <Box component="span">vCPU</Box>
        </Typography>
        <Typography component="span" variant="caption" lineHeight="16px" noWrap>
          <UnitFilter size={flavor?.min_ram} unit="GiB" flavorType="ram" valueBold />
        </Typography>
        <Typography component="span" variant="caption" lineHeight="16px" noWrap>
          <UnitFilter size={flavor?.min_disk} unit="GiB" flavorType="disk" valueBold /> <span>BLOCK</span>
        </Typography>
      </Stack>
    </Stack>
  );
};

export default FlavorDetailBar;
