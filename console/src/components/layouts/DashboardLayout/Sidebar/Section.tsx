import { List, ListSubheader } from "@mui/material";
import { FC, useMemo } from "react";

import { Item } from "./Item";
import { SectionProps } from "./model";

const Section: FC<SectionProps> = (props) => {
  const { heading, items, path, isDrawerOpen } = props;

  const parentPath = useMemo(() => `/${path?.split("/")[1]}`, [path]);

  return (
    <List
      disablePadding
      subheader={
        heading && isDrawerOpen ? (
          <ListSubheader disableGutters disableSticky sx={{ fontSize: "12px", lineHeight: 1, textTransform: "uppercase", p: "0 28px 8px", color: "grey.600" }}>
            {heading}
          </ListSubheader>
        ) : null
      }
      sx={{ overflowY: "hidden", pt: 2, pb: 3 }}>
      {items?.map((item) => (
        <Item
          key={item?.title}
          active={parentPath === "/" ? item?.path === parentPath : item?.path?.startsWith(parentPath)}
          icon={item?.icon}
          path={item?.path}
          title={item?.title}
        />
      ))}
    </List>
  );
};

export default Section;
