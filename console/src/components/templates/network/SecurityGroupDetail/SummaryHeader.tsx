import { Divider, Stack, Typography } from "@mui/material";
import { FC } from "react";

import KeyValuePair from "components/atoms/KeyValuePair";
import StatusChip from "components/atoms/StatusChip";

import { NetworkIcon } from "assets/icons";

interface SummaryHeaderProps {
  securityGroup: any;
}

const SummaryHeader: FC<SummaryHeaderProps> = ({ securityGroup }) => {
  return (
    <Stack direction="row" alignItems="center" gap={2}>
      <NetworkIcon width="44" height="44" />

      <Stack gap="4px">
        <Typography variant="subtitle1">{securityGroup?.security_group_name}</Typography>

        <Stack direction="row" alignItems="center" spacing={1} divider={<Divider flexItem orientation="vertical" />}>
          <StatusChip label={securityGroup?.status} />
          <KeyValuePair label="Managed By" value={<StatusChip label={securityGroup?.managed_by} />} />
          <KeyValuePair label="External" value={<StatusChip label={securityGroup?.external ? "Yes" : "No"} />} />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default SummaryHeader;
