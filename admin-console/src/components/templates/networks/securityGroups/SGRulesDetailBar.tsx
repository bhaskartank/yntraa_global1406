import { Button, Divider, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

import ResourceName from "components/atoms/ResourceName";
import StatusChip from "components/atoms/StatusChip";

interface SGRulesDetailBarProps {
  securityGroups: any;
  customStyle?: any;
  handleDelete?: (payload: any) => void;
  checkedRows?: any;
}

const SGRulesDetailBar: FC<SGRulesDetailBarProps> = ({ securityGroups, customStyle = {} }) => {
  const navigate = useNavigate();

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ color: "black", p: 1, borderBottom: "1px solid black", ...customStyle }}>
      <Stack direction="row" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Stack component="span" direction="row" alignItems="center" spacing={1}>
            <Typography component="span" variant="body2">
              Security Group Name:
            </Typography>
            <ResourceName label={securityGroups?.security_group_name} />
          </Stack>
          <StatusChip label={securityGroups?.status} hideIcon />
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center" divider={<Divider orientation="vertical" flexItem />}>
        <Button size="small" variant="contained" color="primary" onClick={() => navigate("/networks/security-group-rule/sync", { state: securityGroups })}>
          Sync Rules
        </Button>
        <Button size="small" variant="contained" color="info" onClick={() => navigate("/networks/security-group-rule/create", { state: securityGroups })}>
          Create Rules
        </Button>
      </Stack>
    </Stack>
  );
};

export default SGRulesDetailBar;
