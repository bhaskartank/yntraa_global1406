import { Box, Divider, Stack, Typography } from "@mui/material";
import { FC } from "react";

import ResourceName from "components/atoms/ResourceName";
import StatusChip from "components/atoms/StatusChip";
import UnitFilter from "components/atoms/UnitFilter";

import { getOsImgUrl } from "utilities";

interface ComputeDetailBarProps {
  compute: any;
  customStyle?: any;
}

const ComputeDetailBar: FC<ComputeDetailBarProps> = ({ compute, customStyle = {} }) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={4}
      sx={{ color: "black", px: 1, borderBottom: "1px solid black", whiteSpace: "pre-wrap", ...customStyle }}>
      <Stack direction="row" alignItems="center">
        <Box
          sx={{
            mr: 1,
            width: "2rem",
            minWidth: "2rem",
            height: "2rem",
            minHeight: "2rem",
            border: "1px solid #f0f0f0",
            background: `#ffffff url("${getOsImgUrl(compute?.image?.os)}") no-repeat center center`,
            backgroundSize: "90%",
            borderRadius: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
        <Stack direction="row" alignItems="center" spacing={1}>
          <ResourceName label={compute?.instance_name} noWrap />
          <StatusChip label={compute?.status} hideIcon />
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center" divider={<Divider orientation="vertical" flexItem />}>
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
      </Stack>
    </Stack>
  );
};

export default ComputeDetailBar;
