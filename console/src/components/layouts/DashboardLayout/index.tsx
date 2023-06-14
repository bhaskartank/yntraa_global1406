import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { FC } from "react";
import { Outlet } from "react-router-dom";

import { useSelector } from "store";
import drawerRedux from "store/modules/drawer";

import { DRAWER_WIDTH, DRAWER_WIDTH_COLLAPSED, HEADER_HEIGHT } from "utils/constants";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayoutRoot = styled(Box)<{ isDrawerOpen?: boolean }>(({ theme, isDrawerOpen }) => ({
  display: "flex",
  position: "absolute",
  flex: "1 1 auto",
  maxWidth: "100%",
  height: `calc(100vh - ${HEADER_HEIGHT}px)`,
  top: HEADER_HEIGHT,
  transition: "500ms",
  left: isDrawerOpen ? `${DRAWER_WIDTH}px` : `${DRAWER_WIDTH_COLLAPSED}px`,
  flexDirection: "column",
  width: `calc(100% - ${isDrawerOpen ? `${DRAWER_WIDTH}px` : `${DRAWER_WIDTH_COLLAPSED}px`})`,
  minHeight: "fit-content",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "0 0 0 24px",
  overflow: "hidden",
}));

export const DashboardLayout: FC = () => {
  const rootState = useSelector((state) => state);
  const isDrawerOpen = drawerRedux.getters.open(rootState);

  return (
    <>
      <DashboardLayoutRoot isDrawerOpen={isDrawerOpen}>
        <Outlet />
      </DashboardLayoutRoot>

      <Topbar />
      <Sidebar />
    </>
  );
};
