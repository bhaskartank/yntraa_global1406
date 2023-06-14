import { Stack, Typography } from "@mui/material";
import { FC } from "react";

import StatusChip from "../StatusChip";

interface DataChipProps {
  label: any;
  suffix?: any;
}

const DataChip: FC<DataChipProps> = ({ label, suffix }) => {
  return (
    <Stack direction="row" alignItems="center" justifyContent="center" gap={"4px"}>
      <StatusChip label={label || "0"} customStyle={{ backgroundColor: "primary.light", fontWeight: "bold" }} />
      <Typography>{suffix}</Typography>
    </Stack>
  );
};

export default DataChip;
