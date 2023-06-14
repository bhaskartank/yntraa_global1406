import { Divider, Stack, Typography } from "@mui/material";
import { FC } from "react";

import KeyValuePair from "components/atoms/KeyValuePair";
import StatusChip from "components/atoms/StatusChip";

import { NetworkIcon } from "assets/icons";

interface SummaryHeaderProps {
  network: any;
}

const SummaryHeader: FC<SummaryHeaderProps> = ({ network }) => {
  return (
    <Stack direction="row" alignItems="center" gap={2}>
      <NetworkIcon width="44" height="44" />

      <Stack gap="4px">
        <Typography variant="subtitle1">{network?.network_name}</Typography>

        <Stack direction="row" alignItems="center" spacing={1} divider={<Divider flexItem orientation="vertical" />}>
          <KeyValuePair label="Managed By" value={<StatusChip label={network?.managed_by} />} />
          <KeyValuePair label="External" value={<StatusChip label={network?.external ? "Yes" : "No"} />} />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default SummaryHeader;
