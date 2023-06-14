import { Chip } from "@mui/material";
import { FC } from "react";

type Color = "primary" | "secondary" | "warning" | "info" | "success" | "default" | "error";

interface DataChipProps {
  label: any;
  color?: Color;
  sx?: any;
}

const DataChip: FC<DataChipProps> = ({ label, color = "primary", sx = {} }) => {
  return (
    <Chip
      label={label}
      color={color}
      sx={{
        borderRadius: "20px",
        height: "20px",
        minWidth: "20px",
        mt: "-2px",
        ".MuiChip-label": { p: "6px" },
        ...sx,
      }}
    />
  );
};

export default DataChip;
