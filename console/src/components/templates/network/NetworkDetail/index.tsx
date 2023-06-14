import { Stack } from "@mui/material";
import { FC } from "react";

import ResourceDetails from "./ResourceDetails";
import SummaryHeader from "./SummaryHeader";

interface NetworkDetailProps {
  network: any;
}

const NetworkDetail: FC<NetworkDetailProps> = ({ network }) => {
  return (
    <Stack gap={4}>
      <SummaryHeader network={network} />
      <ResourceDetails network={network} />
    </Stack>
  );
};

export default NetworkDetail;
