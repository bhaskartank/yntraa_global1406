import { Box, Divider, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import moment from "moment";
import { FC, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { useSelector } from "store";
import authRedux from "store/modules/auth";
import drawerRedux from "store/modules/drawer";

import ChangePassword from "components/templates/ChangePassword";

import { DRAWER_WIDTH, DRAWER_WIDTH_COLLAPSED, FOOTER_HEIGHT, FOOTER_TEXT, HEADER_HEIGHT } from "utilities/constants";

import { DashboardNavbar } from "./DashboardNavbar";
import { DashboardSidebar } from "./Sidebar";

const DashboardLayoutRoot = styled(Box)(() => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  height: `calc(100% - ${FOOTER_HEIGHT}px)`,
  paddingTop: HEADER_HEIGHT,
  color: "#ffffff",
}));

export const DashboardLayout: FC = () => {
  const rootState = useSelector((state: any) => state) || {};
  const isUpdatePasswordActive = authRedux.getters.isUpdatePasswordActive(rootState);
  const open = drawerRedux.getters.open(rootState);
  const [time, setTime] = useState<any>("");

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(() => moment().format("DD-MMM-YYYY, hh:mm:ss a"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <DashboardLayoutRoot sx={{ transition: "500ms", paddingLeft: open ? `${DRAWER_WIDTH}px` : `${DRAWER_WIDTH_COLLAPSED}px` }}>
        <Box
          sx={{
            display: "flex",
            flex: "1 1 auto",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            backgroundColor: "primary.darkest",
            minHeight: "fit-content",
          }}>
          <Outlet />
        </Box>
      </DashboardLayoutRoot>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        sx={{
          position: "fixed",
          bottom: 0,
          px: 3,
          left: open ? `${DRAWER_WIDTH}px` : `${DRAWER_WIDTH_COLLAPSED}px`,
          width: `calc(100% - ${open ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED}px)`,
          height: FOOTER_HEIGHT,
          minHeight: FOOTER_HEIGHT,
          overflow: "hidden",
          transition: "500ms",
          borderRadius: "0 0 0 16px",
          color: "common.white",
          backgroundColor: "primary.dark",
        }}
        zIndex={2}>
        <Typography component="span" variant="subtitle2" noWrap>
          {FOOTER_TEXT}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1} divider={<Divider orientation="vertical" flexItem />} sx={{ display: "inline-flex" }}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="caption" fontSize={12} display="inline-block" fontWeight="bold" noWrap>
              Date:
            </Typography>
            <Typography variant="caption" fontSize={12} noWrap>
              {time?.split(",")[0]}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="caption" fontSize={12} display="inline-block" fontWeight="bold" noWrap>
              Time:
            </Typography>
            <Typography variant="caption" fontSize={12} noWrap pr={1}>
              {time?.split(",")[1]}
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      <DashboardNavbar />
      <DashboardSidebar />

      {isUpdatePasswordActive ? <ChangePassword /> : null}
    </>
  );
};
