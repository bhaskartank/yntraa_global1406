import { AppBar, Avatar, Box, ButtonBase, Stack, Toolbar, Typography } from "@mui/material";
import { FC, useRef, useState } from "react";

import { useSelector } from "store";
import authRedux from "store/modules/auth";
import drawerRedux from "store/modules/drawer";

import { DRAWER_WIDTH, DRAWER_WIDTH_COLLAPSED, HEADER_HEIGHT } from "utilities/constants";
import stringAvatar from "utilities/stringAvatar";

import { AccountPopover } from "./AccountPopover";

const AccountContainer = () => {
  const rootState = useSelector((state: any) => state);
  const userDetails = authRedux.getters.userDetails(rootState);

  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [openPopover, setOpenPopover] = useState<boolean>(false);

  const handleOpenPopover = (): void => {
    setOpenPopover(true);
  };

  const handleClosePopover = (): void => {
    setOpenPopover(false);
  };

  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="center" sx={{ color: "primary.main" }}>
        <Box component={ButtonBase} onClick={handleOpenPopover} ref={anchorRef} sx={{ alignItems: "center", display: "flex", ml: 0 }}>
          <Avatar {...stringAvatar(`${userDetails?.first_name} ${userDetails?.last_name}`)} sx={{ height: 28, width: 28, backgroundColor: "primary.main", fontSize: "12px" }} />
        </Box>
      </Stack>
      <AccountPopover anchorEl={anchorRef.current} onClose={handleClosePopover} open={openPopover} />
    </>
  );
};

const SessionDetails = () => {
  const rootState = useSelector((state: any) => state);
  const userDetails = authRedux.getters.userDetails(rootState);

  return (
    <Stack direction="row" alignItems="center" justifyContent="flex-end" color="black" flex={1} spacing={2}>
      <Stack direction="row" spacing="8px">
        <Stack direction="row" justifyContent="flex-end" alignItems="center" sx={{ color: "primary.main" }}>
          <Typography variant="body2" display="inline-block" noWrap>
            Welcome,{" "}
            <Typography variant="body2" display="inline" fontWeight="bold" noWrap textTransform="capitalize">
              {`${userDetails?.first_name || ""} ${userDetails?.last_name || ""}`}
            </Typography>
          </Typography>
        </Stack>
        <AccountContainer />
      </Stack>
    </Stack>
  );
};

export const DashboardNavbar: FC = () => {
  const rootState = useSelector((state: any) => state);
  const open = drawerRedux.getters.open(rootState);

  return (
    <>
      <AppBar sx={{ left: open ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED, width: "auto", boxShadow: "none", transition: "left 500ms", py: 0 }}>
        <Toolbar
          disableGutters
          sx={{
            height: { xs: HEADER_HEIGHT },
            minHeight: { xs: HEADER_HEIGHT },
            overflow: "hidden",
            left: 0,
            alignItems: "center",
            backgroundColor: "primary.light",
            borderRadius: "16px 0 0 0",
          }}>
          <Stack direction="row" flex={1} height="30px" minHeight="30px" px={1}>
            <SessionDetails />
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  );
};
