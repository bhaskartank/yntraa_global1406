import { IconButton, Stack } from "@mui/material";
import { FC } from "react";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";

export interface SortingIconProps {
  isAsc?: boolean | null;
}

const SortingIcon: FC<SortingIconProps> = ({ isAsc = null }) => {
  return (
    <IconButton sx={{ m: 0, py: 0, px: 0, mt: "4px" }}>
      <Stack justifyContent="center" alignItems="center" spacing="0" sx={{ fontSize: "14px", svg: { margin: "-4px" } }}>
        <TiArrowSortedUp color={isAsc === null || !isAsc ? "#aaaaaa" : "#ffffff"} />
        <TiArrowSortedDown color={isAsc === null || isAsc ? "#aaaaaa" : "#ffffff"} />
      </Stack>
    </IconButton>
  );
};

export default SortingIcon;
