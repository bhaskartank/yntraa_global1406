import { Button, Divider, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

import ResourceName from "components/atoms/ResourceName";
import StatusChip from "components/atoms/StatusChip";

interface AvailabilityZoneDetailBarProps {
  zone: any;
  customStyle?: any;
}

const AvailabilityZoneDetailBar: FC<AvailabilityZoneDetailBarProps> = ({ zone, customStyle = {} }) => {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ color: "black", p: 1, borderBottom: "1px solid black", ...customStyle }}>
      <Stack direction="row" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={10}>
          <Stack component="span" direction="row" alignItems="center" spacing={1}>
            <Typography component="span" variant="body2">
              Availability Zone:
            </Typography>
            <ResourceName label={zone?.zone_name} />
            <StatusChip label={zone?.status} hideIcon />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default AvailabilityZoneDetailBar;