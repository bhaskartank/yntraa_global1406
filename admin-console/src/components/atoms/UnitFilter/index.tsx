import { Box, Stack, Tooltip } from "@mui/material";
import { FC } from "react";

import DataChip from "components/atoms/DataChip";

type flavorType = "ram" | "disk";
interface UnitFilterProps {
  size: string;
  unit: string;
  variant?: string;
  flavorType?: flavorType;
  valueBold?: boolean;
  textBold?: boolean;
}

const formattedData = (size, unit, variant, flavorType, valueBold, textBold) => {
  let value: any = 0;
  let equivalentValue: any = 0;
  if (flavorType === "disk") {
    if (size && unit === "GiB") {
      value = parseInt(size);
      equivalentValue = Math.round(size * 1.073741824 * 100) / 100;
    } else if (size && unit === "GB") {
      value = parseInt(size) / 1024;
    }
  }
  if (flavorType === "ram") {
    if (size && unit === "GB") {
      value = parseInt(size);
      equivalentValue = Math.round(size * 1.073741824 * 100) / 100;
    } else if (size && unit === "GiB") {
      value = parseInt(size) / 1024;
      equivalentValue = Math.round(value * 1.073741824 * 100) / 100;
    }
  }

  return (
    <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5}>
      <Box fontWeight={valueBold ? "bold" : "normal"} component="span">
        {variant === "filled" ? <DataChip label={value} /> : value}
      </Box>
      <Tooltip title={unit === "GiB" ? `${value} GiB = ~${equivalentValue}GB` : ""} placement="top">
        <Box fontWeight={textBold ? "bold" : "normal"}>{unit}</Box>
      </Tooltip>
    </Stack>
  );
};

export const UnitFilter: FC<UnitFilterProps> = ({ unit, size, variant = null, flavorType, valueBold, textBold }) => {
  const data = formattedData(size, unit, variant, flavorType, valueBold, textBold);

  return (
    <Stack direction="row" alignItems="center" sx={{ display: "inline-block" }}>
      {data}
    </Stack>
  );
};

export const GiBAbbreviation = () => {
  return (
    <Box component="abbr" title="1 GiB = ~1.074 GB">
      GiB
    </Box>
  );
};

export default UnitFilter;
