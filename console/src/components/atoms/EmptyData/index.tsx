import { Stack, Typography } from "@mui/material";
import { FC } from "react";

import { EmptyDataIcon } from "assets/icons";

interface EmptyDataProps {
  text?: string;
}

const EmptyData: FC<EmptyDataProps> = ({ text = "No Data Available" }) => {
  return (
    <Stack justifyContent="center" alignItems="center" sx={{ backgroundColor: "grey.200", height: "200px", width: "100%" }}>
      <Stack alignItems="center" spacing={1}>
        <EmptyDataIcon />
        <Typography color="grey.700">{text}</Typography>
      </Stack>
    </Stack>
  );
};

export default EmptyData;
