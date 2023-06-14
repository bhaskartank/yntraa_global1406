import { Button, Divider, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

import ResourceName from "components/atoms/ResourceName";
import StatusChip from "components/atoms/StatusChip";

interface HypervisorDetailBarProps {
  provider: any;
  customStyle?: any;
}

const HypervisorDetailBar: FC<HypervisorDetailBarProps> = ({ provider, customStyle = {} }) => {
  return (
    <Stack
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    spacing={4}
    sx={{ color: "black", px: 1, py: "4px", borderBottom: "1px solid black", whiteSpace: "pre-wrap", ...customStyle }}>
    <Stack direction="row" alignItems="center">
      <Stack direction="row" alignItems="center" spacing={1}>
        <ResourceName label={`${provider?.provider_name} (${provider?.provider_id})`} noWrap />
        <StatusChip label={provider?.status} hideIcon />
      </Stack>
    </Stack>

    <Stack direction="row" alignItems="center" spacing={1} divider={<Divider flexItem orientation="vertical" />}>
      <Typography component="span" variant="body2">
        Location: <StatusChip label={provider?.provider_location} color="info" />
      </Typography>
    </Stack>
  </Stack>
  );
};

export default HypervisorDetailBar;
