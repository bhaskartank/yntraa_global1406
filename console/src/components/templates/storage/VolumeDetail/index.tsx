import { Stack } from "@mui/material";
import { FC } from "react";

import ResourceDetails from "./ResourceDetails";
import SummaryHeader from "./SummaryHeader";

interface VolumeDetailProps {
  volume: any;
}

const VolumeDetail: FC<VolumeDetailProps> = ({ volume }) => {
  return (
    <Stack gap={4}>
      <SummaryHeader volume={volume} />
      <ResourceDetails volume={volume} />
    </Stack>
  );
};

export default VolumeDetail;
