import { Divider, Stack, Typography } from "@mui/material";
import { FC } from "react";

import StatusChip from "components/atoms/StatusChip";
import TagList from "components/atoms/TagList";
import UnitFilter from "components/atoms/UnitFilter";

import { VolumeIcon } from "assets/icons";

interface SummaryHeaderProps {
  volume: any;
}

const SummaryHeader: FC<SummaryHeaderProps> = ({ volume }) => {
  return (
    <Stack direction="row" alignItems="center" gap={2}>
      <VolumeIcon width="44" height="44" />

      <Stack gap="4px">
        <Typography variant="subtitle1">{volume?.volume_name}</Typography>

        <Stack direction="row" alignItems="center" spacing={1} divider={<Divider flexItem orientation="vertical" />}>
          <StatusChip label={volume?.action} />
          <UnitFilter size={volume?.volume_size} unit="GiB" flavorType="disk" variant="filled" />

          {volume?.resource_annotations?.length ? (
            <TagList
              tags={volume?.resource_annotations?.map((resource) => `${resource?.annotation_key} ${resource?.annotation_value ? `:` + " " + resource?.annotation_value : ""}`)}
            />
          ) : null}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default SummaryHeader;
