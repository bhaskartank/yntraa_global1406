import { Divider, Stack, Theme, useMediaQuery } from "@mui/material";
import { FC, ReactNode } from "react";

interface GridViewProps {
  children: ReactNode;
}

export const GridViewWrapper: FC<GridViewProps> = ({ children }) => {
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"), { noSsr: true });

  return (
    <Stack flex={1} divider={<Divider />} sx={{ borderRadius: "0px 0px 8px 8px", height: { xs: "auto", lg: "100%" } }}>
      <Stack flex={1} direction={{ xs: "column", lg: "row" }} divider={<Divider flexItem orientation={lgUp ? "vertical" : "horizontal"} />} gap={1}>
        {children}
      </Stack>
    </Stack>
  );
};

export const GridViewSection: FC<GridViewProps> = ({ children }) => {
  return (
    <Stack flex={1} gap={2} sx={{ p: "12px 16px", overflow: "hidden" }}>
      {children}
    </Stack>
  );
};
