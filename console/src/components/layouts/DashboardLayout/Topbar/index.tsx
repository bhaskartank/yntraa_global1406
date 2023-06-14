import { AppBar, Divider, Stack, Toolbar, Typography } from "@mui/material";
import { FC } from "react";
import { BiSearch } from "react-icons/bi";

import { useDispatch, useSelector } from "store";
import drawerRedux from "store/modules/drawer";
import globalSearchRedux from "store/modules/global-search";

import { DRAWER_WIDTH, DRAWER_WIDTH_COLLAPSED, HEADER_HEIGHT } from "utils/constants";

import AccountPopover from "./AccountPopover";
import CreatePopover from "./CreatePopover";
import OrganisationPopover from "./OrganisationPopover";

const Topbar: FC = () => {
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const isDrawerOpen = drawerRedux.getters.open(rootState);

  return (
    <>
      <AppBar
        sx={{
          left: isDrawerOpen ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
          width: "auto",
          overflow: "visible",
          transition: "left 500ms",
          py: 0,
          boxShadow: "rgba(100, 100, 100, 0.1) 0px 3px 8px",
        }}>
        <Toolbar
          disableGutters
          sx={{
            height: HEADER_HEIGHT,
            minHeight: HEADER_HEIGHT,
            overflow: "hidden",
            left: 0,
            alignItems: "center",
            backgroundColor: "background.paper",
            borderRadius: "24px 0 0",
          }}>
          <Stack direction="row" flex={1} height="30px" minHeight="30px" px={1}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" color="black" flex={1} spacing={2} ml={2} mr={1}>
              <Stack direction="row" alignItems="center" spacing={2} onClick={() => dispatch(globalSearchRedux.actions.open())}>
                <BiSearch size="20px" />
                <Typography component="span">Search (Ctrl + /)</Typography>
              </Stack>

              <Stack direction="row" alignItems="center" gap={2} divider={<Divider flexItem orientation="vertical" />}>
                <Stack direction="row" alignItems="center" gap={2}>
                  <OrganisationPopover />

                  <CreatePopover />
                </Stack>

                <AccountPopover />
              </Stack>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Topbar;
