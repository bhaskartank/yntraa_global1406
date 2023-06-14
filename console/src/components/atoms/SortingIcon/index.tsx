import { IconButton, Stack, useTheme } from "@mui/material";
import { FC } from "react";

import { ArrowSortedDown, ArrowSortedUp } from "assets/icons";

export interface SortingIconProps {
  isAsc?: boolean | null;
}

const SortingIcon: FC<SortingIconProps> = ({ isAsc = null }) => {
  const theme = useTheme();

  return (
    <IconButton sx={{ m: 0, px: 0, py: 0 }}>
      <Stack justifyContent="center" alignItems="center" sx={{ cursor: "pointer", display: "inline-flex", color: "red" }}>
        <ArrowSortedUp width="10" color={isAsc === null || !isAsc ? theme.palette.grey[700] : theme.palette.grey[900]} />
        <ArrowSortedDown width="10" color={isAsc === null || isAsc ? theme.palette.grey[700] : theme.palette.grey[900]} />
      </Stack>
    </IconButton>
  );
};

export default SortingIcon;
