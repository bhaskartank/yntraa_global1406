import { Button, ListItem } from "@mui/material";
import type { ListItemProps } from "@mui/material";
import { FC, ReactNode } from "react";
import { Link } from "react-router-dom";

import { useSelector } from "store";
import drawerRedux from "store/modules/drawer";

import { SIDE_MENU_ITEM_HEIGHT } from "utils/constants";

interface ItemProps extends ListItemProps {
  active?: boolean;
  icon?: ReactNode;
  path?: string;
  title: string;
}

export const Item: FC<ItemProps> = (props) => {
  const { active = false, icon, title, path } = props;

  const rootState = useSelector((state) => state);
  const isDrawerOpen = drawerRedux.getters.open(rootState);

  return (
    <ListItem disableGutters disablePadding>
      <Button
        component={Link}
        to={path}
        startIcon={icon}
        sx={{
          color: "common.white",
          fontSize: "14px",
          fontWeight: 400,
          textTransform: "none",
          width: "100%",
          height: SIDE_MENU_ITEM_HEIGHT,
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
          justifyContent: "flex-start",
          ml: isDrawerOpen ? "12px" : "8px",
          pl: "16px",
          zIndex: 3,
          mt: 1,
          ...(active ? { color: "common.black", transitionDelay: "300ms" } : {}),
          ".MuiButton-startIcon": { mr: isDrawerOpen ? "8px" : "0" },
          "&:hover": { backgroundColor: "transparent" },
        }}>
        {isDrawerOpen ? title : ""}
      </Button>
    </ListItem>
  );
};
