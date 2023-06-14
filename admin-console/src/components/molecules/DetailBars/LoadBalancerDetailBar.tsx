import { Stack, Typography } from "@mui/material";
import { FC } from "react";

import ResourceName from "components/atoms/ResourceName";
import StatusChip from "components/atoms/StatusChip";

interface SGRulesDetailBarProps {
  lbDetails: any;
  customStyle?: any;
}

const SGRulesDetailBar: FC<SGRulesDetailBarProps> = ({ lbDetails, customStyle = {} }) => {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ color: "black", p: 1, borderBottom: "1px solid black", ...customStyle }}>
      <Stack direction="row" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography>LB Name:{" "}</Typography>
          <ResourceName label={lbDetails?.name} />
          <StatusChip label={lbDetails?.status} hideIcon />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default SGRulesDetailBar;
