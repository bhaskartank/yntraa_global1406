import { Stack, Typography } from "@mui/material";
import { FC } from "react";

import StatusChip from "components/atoms/StatusChip";

interface RouterDetailBarProps {
  routers: any;
  customStyle?: any;
}

const RouterDetailBar: FC<RouterDetailBarProps> = ({ routers, customStyle = {} }) => {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ color: "black", p: 1, borderBottom: "1px solid black", ...customStyle }}>
      <Stack direction="row" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography component="span" variant="body2">
            Router Name:
          </Typography>
          <StatusChip label={routers?.router_name} color="info" />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default RouterDetailBar;
