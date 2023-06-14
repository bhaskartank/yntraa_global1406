
import { Button, Divider, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

import ResourceName from "components/atoms/ResourceName";
import StatusChip from "components/atoms/StatusChip";

interface UpdatePublicIPBarProps {
  publicIP: any;
  customStyle?: any;
}

const UpdatePublicIPBar: FC<UpdatePublicIPBarProps> = ({ publicIP, customStyle = {} }) => {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ color: "black", p: 1, borderBottom: "1px solid black", ...customStyle }}>
      <Stack direction="row" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={10}>
          <Stack component="span" direction="row" alignItems="center" spacing={1}>
            <Typography component="span" variant="body2">
              Public IP:
            </Typography>
            <StatusChip label={publicIP?.public_ip} hideIcon color="info" />
          </Stack>
          <Stack component="span" direction="row" alignItems="center" spacing={1}>
            <Typography component="span" variant="body2">
              Direction:
            </Typography>
            <StatusChip label={publicIP?.traffic_direction} hideIcon />
          </Stack>
          
        </Stack>
      </Stack>
    </Stack>
  );
};

export default UpdatePublicIPBar;