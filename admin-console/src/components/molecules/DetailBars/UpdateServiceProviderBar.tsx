import { Button, Divider, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

import ResourceName from "components/atoms/ResourceName";
import StatusChip from "components/atoms/StatusChip";

interface UpdateServiceProviderBarProps {
  serviceProvider: any;
  customStyle?: any;
}

const UpdateServiceProviderBar: FC<UpdateServiceProviderBarProps> = ({ serviceProvider, customStyle = {} }) => {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ color: "black", p: 1, borderBottom: "1px solid black", ...customStyle }}>
      <Stack direction="row" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={10}>
          <Stack component="span" direction="row" alignItems="center" spacing={1}>
            <Typography component="span" variant="body2">
              Service Provider Name:
            </Typography>
            <ResourceName label={serviceProvider?.service_provider_name} />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default UpdateServiceProviderBar;
