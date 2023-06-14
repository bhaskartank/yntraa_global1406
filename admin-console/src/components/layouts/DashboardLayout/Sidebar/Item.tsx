import { Box, Button, Collapse, Grow, ListItem, Popper } from "@mui/material";
import type { ListItemProps } from "@mui/material";
import { FC, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { BiRightArrowAlt } from "react-icons/bi";
import { MdExpandMore as ChevronDownIcon, MdOutlineChevronRight as ChevronRightIcon } from "react-icons/md";
import { Link } from "react-router-dom";

import { useSelector } from "store";
import drawerRedux from "store/modules/drawer";

interface DashboardSidebarItemProps extends ListItemProps {
  active?: boolean;
  children?: ReactNode;
  chip?: ReactNode;
  depth: number;
  icon?: ReactNode;
  info?: ReactNode;
  path?: string;
  title: string;
  href?: string;
  openedChild?: string | null;
  setOpenedChild?: (arg: any) => void;
}

export const DashboardSidebarItem: FC<DashboardSidebarItemProps> = (props) => {
  const { active, children, chip, depth, icon, info, path, title, href, openedChild, setOpenedChild, ...other } = props;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const popperOpen = Boolean(anchorEl);

  const rootState = useSelector((state) => state);
  const isDrawerOpen = drawerRedux.getters.open(rootState);

  const handleOpenPopMenu = useCallback(
    (event: any) => {
      setAnchorEl(event.currentTarget);
    },
    [setAnchorEl],
  );

  const handleClosePopMenu = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const isMenuOpen = useMemo(() => {
    return openedChild && openedChild[depth] === title;
  }, [openedChild, depth, title]);

  const handleToggle = (): void => {
    if (href) window.open(href, "_blank");
    setOpenedChild((current) => ({ ...current, [depth]: current[depth] === title ? {} : title }));
  };

  const handleItemClick = () => {
    if (href) window.open(href, "_blank");
  };

  useEffect(() => {
    if (isDrawerOpen) {
      handleClosePopMenu();
    } else {
      setOpenedChild({});
    }
  }, [isDrawerOpen, setOpenedChild, handleClosePopMenu]);

  // Branch
  if (children) {
    return (
      <ListItem
        disableGutters
        {...(!isDrawerOpen && {
          onMouseEnter: handleOpenPopMenu,
          onMouseLeave: handleClosePopMenu,
        })}
        sx={{
          display: "block",
          py: 0,
          px: !isDrawerOpen && depth === 0 ? 1 : 0,
          mx: !isDrawerOpen && depth === 0 ? 0 : 1,
          mb: "4px",
          textAlign: "center",
          width: "auto",
          borderRadius: !isDrawerOpen && depth === 0 ? 0 : 4,
          backgroundColor: (depth % 2 === 0) === isMenuOpen ? "primary.dark" : "primary.main",
          transition: "400ms",
          ".MuiButton-startIcon": {
            p: 1,
            ...(!isDrawerOpen && depth === 0 ? { borderRadius: "50%", ...(popperOpen ? { backgroundColor: "primary.dark" } : {}) } : {}),
          },
          "&:hover .MuiButton-startIcon": {
            ...(!isDrawerOpen && depth === 0 ? { backgroundColor: "primary.dark" } : {}),
          },
        }}
        {...other}>
        <Button
          endIcon={!isDrawerOpen && depth === 0 ? null : !isMenuOpen ? <ChevronRightIcon /> : <ChevronDownIcon />}
          disableRipple
          onClick={!isDrawerOpen && depth === 0 ? () => null : handleToggle}
          startIcon={icon}
          sx={{
            color: "common.white",
            justifyContent: "flex-start",
            fontWeight: isMenuOpen ? 500 : 400,
            pl: 2,
            pr: 0,
            py: 0,
            textAlign: "left",
            textTransform: "none",
            borderRadius: 4,
            width: "100%",
            "&:hover": { backgroundColor: !isDrawerOpen && depth === 0 ? "transparent" : !isMenuOpen ? (depth % 2 === 0 ? "primary.dark" : "primary.main") : "transparent" },
            "& .MuiButton-startIcon": { mr: 0 },
            "& .MuiButton-endIcon": { mr: 1 },
          }}>
          <Box
            sx={{
              flexGrow: 1,
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
              fontSize: "13px",
              ml: 1,
              py: isMenuOpen ? 1 : 0,
              opacity: !isDrawerOpen && depth === 0 ? 0 : 1,
              transition: "opacity 400ms",
            }}>
            {title}
          </Box>
        </Button>
        {!isDrawerOpen && depth === 0 ? (
          <Popper open={popperOpen} anchorEl={anchorEl} placement="right-start" sx={{ zIndex: 7 }} transition>
            {({ TransitionProps }) => (
              <Grow style={{ transformOrigin: "0 0 0" }} timeout={{ enter: 400, exit: 300 }} {...TransitionProps}>
                <Box
                  sx={{
                    pt: 1,
                    pb: 1,
                    borderRadius: "0 8px 8px 0",
                    backgroundColor: (depth % 2 === 0) === isMenuOpen ? "primary.main" : "primary.dark",
                    color: "common.white",
                  }}>
                  {children}
                </Box>
              </Grow>
            )}
          </Popper>
        ) : (
          <Collapse in={isMenuOpen} timeout={400}>
            {children}
          </Collapse>
        )}
      </ListItem>
    );
  }

  // Leaf
  return (
    <ListItem
      disableGutters
      {...(!isDrawerOpen && {
        onMouseEnter: handleOpenPopMenu,
        onMouseLeave: handleClosePopMenu,
      })}
      sx={{
        display: "flex",
        py: 0,
        px: 0,
        mx: 1,
        mb: "4px",
        width: "auto",
        backgroundColor: active ? (depth % 2 === 0 ? "primary.dark" : "primary.main") : "transparent",
        borderRadius: !isDrawerOpen && depth === 0 ? 0 : 4,
        transition: "1000ms",
        ".MuiButton-startIcon": {
          p: 1,
          ...(!isDrawerOpen && depth === 0 ? { borderRadius: "50%", ...(popperOpen ? { backgroundColor: "primary.dark" } : {}) } : {}),
        },
        "&:hover .MuiButton-startIcon": {
          ...(!isDrawerOpen && depth === 0 ? { backgroundColor: "primary.dark" } : {}),
        },
      }}>
      <Box
        component={Link}
        to={path}
        onClick={!isDrawerOpen && depth === 0 ? () => null : handleItemClick}
        sx={{ width: "100%", textDecoration: "none", "&:hover": { textDecoration: "none" }, textAlign: "center" }}>
        <Button
          startIcon={icon}
          endIcon={chip}
          disableRipple
          sx={{
            color: "common.white",
            fontWeight: 400,
            justifyContent: "flex-start",
            pl: 2,
            pr: 0,
            py: 0,
            textAlign: "left",
            textTransform: "none",
            width: "100%",
            borderRadius: 4,
            "&:hover": { backgroundColor: !isDrawerOpen && depth === 0 ? "transparent" : depth % 2 === 0 ? "primary.dark" : "primary.main" },
            "& .MuiButton-startIcon": { mr: 0 },
            "& .MuiButton-endIcon": { mr: 1 },
          }}>
          <Box
            sx={{
              flexGrow: 1,
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
              fontSize: "13px",
              ml: 1,
              mr: !isDrawerOpen ? 3 : 0,
              opacity: !isDrawerOpen && depth === 0 ? 0 : 1,
              transition: "opacity 400ms",
            }}>
            {title}
          </Box>
        </Button>
      </Box>
      {!isDrawerOpen && depth === 0 ? (
        <Popper open={popperOpen} anchorEl={anchorEl} placement="right-start" sx={{ zIndex: 7 }}>
          <Button
            startIcon={<BiRightArrowAlt />}
            disableRipple
            onClick={handleItemClick}
            sx={{
              ml: 1,
              borderRadius: "0 8px 8px 0",
              color: "common.white",
              fontWeight: 400,
              justifyContent: "flex-start",
              textAlign: "left",
              textTransform: "none",
              py: 1,
              backgroundColor: "primary.dark",
              "&:hover": { backgroundColor: "primary.main" },
            }}>
            <Box
              sx={{
                px: 1,
                color: "common.white",
                whiteSpace: "nowrap",
                overflow: "hidden",
                fontSize: "13px",
                transition: "opacity 400ms",
              }}>
              {title}
            </Box>
          </Button>
        </Popper>
      ) : null}
    </ListItem>
  );
};

DashboardSidebarItem.defaultProps = {
  active: false,
};
