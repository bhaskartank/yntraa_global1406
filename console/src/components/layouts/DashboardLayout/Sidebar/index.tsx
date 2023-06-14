import { Box, Divider, Drawer, Stack, Theme, Typography, useMediaQuery } from "@mui/material";
import { FC, useCallback, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import drawerRedux from "store/modules/drawer";

import AppLogo from "components/atoms/AppLogo";

import { DRAWER_WIDTH, DRAWER_WIDTH_COLLAPSED, FOOTER_HEIGHT, FOOTER_TEXT, LOGO_CONTAINER_HEIGHT, SIDE_MENU_ITEM_HEIGHT, SIDE_MENU_OFFSET } from "utils/constants";

import Section from "./Section";
import { menus } from "./menu-list";

const Sidebar: FC = () => {
  const location = useLocation();
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"), { noSsr: true });

  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const isDrawerOpen = drawerRedux.getters.open(rootState);

  const handleOpen = useCallback(() => {
    dispatch(drawerRedux.actions.open());
  }, [dispatch]);

  const handleClose = useCallback(() => {
    dispatch(drawerRedux.actions.close());
  }, [dispatch]);

  useEffect(() => {
    if (lgUp) handleOpen();
    else handleClose();
  }, [lgUp, handleOpen, handleClose]);

  const childPosition = useMemo(() => {
    const parentPath = `/${location?.pathname?.split("/")[1]}`;

    let menuSkippedCount = 0;
    let sectionSkippedCount = 0;
    let headingCount = 0;

    for (const menu of menus) {
      if (menu?.heading) ++headingCount;

      if (menu?.items?.length) {
        const matchedIndex = menu?.items?.findIndex((subMenu) => (parentPath === "/" ? subMenu?.path === parentPath : subMenu?.path?.startsWith(parentPath)));

        if (matchedIndex >= 0) {
          menuSkippedCount += matchedIndex;
          break;
        }

        menuSkippedCount += menu?.items?.length;
      }

      ++sectionSkippedCount;
    }

    return sectionSkippedCount >= menus?.length
      ? SIDE_MENU_ITEM_HEIGHT * -2
      : SIDE_MENU_ITEM_HEIGHT * menuSkippedCount + menuSkippedCount * SIDE_MENU_OFFSET + sectionSkippedCount * 40 + headingCount * 20 + SIDE_MENU_OFFSET + 16;
  }, [location]);

  const content = (
    <>
      <Stack
        direction="row"
        px={"6px"}
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: LOGO_CONTAINER_HEIGHT, height: LOGO_CONTAINER_HEIGHT, overflow: "hidden", width: "100%" }}>
        {isDrawerOpen ? <AppLogo variant="full" /> : <AppLogo variant="short" />}
      </Stack>

      <Stack justifyContent="space-between" height="100%" overflow="hidden">
        <Box sx={{ overflowY: "auto", flex: 1, position: "relative" }}>
          <Stack flex={1} divider={<Divider flexItem sx={{ borderBottom: "0.5px solid", borderColor: "grey.600", mx: "4px" }} />}>
            {menus?.map((menu, index) => (
              <Section key={index} sectionIndex={index} heading={menu?.heading} items={menu?.items} path={location?.pathname} isDrawerOpen={isDrawerOpen} />
            ))}
          </Stack>
          <Box
            sx={{
              position: "absolute",
              right: 0,
              top: childPosition,
              backgroundColor: "background.paper",
              minWidth: DRAWER_WIDTH - 12,
              height: SIDE_MENU_ITEM_HEIGHT,
              zIndex: 2,
              borderRadius: "40px 0 0 40px",
              transition: "top 500ms",
              "::before": {
                content: "''",
                position: "absolute",
                top: "-24px",
                right: 0,
                width: "24px",
                height: "24px",
                background: "white",
                WebkitMaskImage: "radial-gradient(circle 24px at 0 0, transparent 0, transparent 24px, black 21px)",
                transition: "500ms",
              },
              "::after": {
                content: "''",
                position: "absolute",
                bottom: "-24px",
                right: 0,
                width: "24px",
                height: "24px",
                background: "white",
                WebkitMaskImage: "radial-gradient(circle 24px at 0 0, transparent 0, transparent 24px, black 21px)",
                transition: "500ms",
                transform: "rotate(270deg)",
              },
            }}
          />
        </Box>
        <Stack
          direction="row"
          alignItems="flex-end"
          flexWrap="wrap"
          color="text.white"
          sx={{
            p: 1,
            width: "100%",
            minHeight: `${FOOTER_HEIGHT}px`,
            overflow: "hidden",
            backgroundColor: "primary.main",
            color: "common.white",
          }}
          zIndex={2}>
          <Typography component="span" fontSize="12px">
            {FOOTER_TEXT}
          </Typography>
        </Stack>
      </Stack>
    </>
  );

  return (
    <Drawer
      variant="permanent"
      open={isDrawerOpen}
      PaperProps={{
        sx: {
          overflowX: isDrawerOpen ? "visible" : "hidden",
          borderRightColor: "divider",
          borderRightStyle: "solid",
          borderRightWidth: 0,
          color: "text.info",
          width: isDrawerOpen ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED,
          height: `100vh`,
          transition: "width 500ms",
        },
      }}>
      {content}
    </Drawer>
  );
};

export default Sidebar;
