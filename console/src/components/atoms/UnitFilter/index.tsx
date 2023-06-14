import { Box, Stack, Tooltip, Typography } from "@mui/material";
import { FC } from "react";

import DataChip from "components/atoms/DataChip";

type flavorType = "ram" | "disk";
interface UnitFilterProps {
  size: string;
  unit: string;
  variant?: string;
  flavorType?: flavorType;
  fontVariant?: string;
  valueFontWeight?: string | number;
  fontWeight?: string | number;
  suffix?: string;
}

const formattedData = (size, unit, variant, flavorType, fontVariant, valueFontWeight, fontWeight, suffix = "") => {
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
    <Stack direction="row" justifyContent="center" alignItems="end" spacing={0.5}>
      <Typography variant={fontVariant || "body1"} component="span" fontWeight={valueFontWeight || "bold"}>
        {variant === "filled" ? <DataChip label={value} /> : value}
      </Typography>
      <Tooltip title={unit === "GiB" ? `${value} GiB = ~${equivalentValue}GB` : ""} placement="top">
        <Typography variant={fontVariant || "body1"} fontWeight={fontWeight || "normal"}>
          <abbr title="">{unit}</abbr>
        </Typography>
      </Tooltip>
      {suffix ? (
        <Typography variant={fontVariant || "body1"} fontWeight={fontWeight || "normal"}>
          {suffix}
        </Typography>
      ) : null}
    </Stack>
  );
};

export const UnitFilter: FC<UnitFilterProps> = ({ unit, size, variant = null, flavorType, fontVariant, valueFontWeight = "bold", fontWeight, suffix = "" }) => {
  const data = formattedData(size, unit, variant, flavorType, fontVariant, valueFontWeight, fontWeight, suffix);

  return (
    <Stack direction="row" alignItems="center" fontSize="14px" sx={{ display: "inline-block" }}>
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
