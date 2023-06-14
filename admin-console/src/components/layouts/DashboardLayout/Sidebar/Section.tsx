import { List } from "@mui/material";
import type { ListProps } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { BiRightArrowAlt } from "react-icons/bi";

import { DashboardSidebarItem } from "./Item";
import { ItemProps } from "./model";

const renderNavItems = ({
  depth = 0,
  items,
  path,
  openedChild,
  setOpenedChild,
}: {
  depth?: number;
  items: ItemProps[];
  path: string;
  openedChild: string;
  setOpenedChild: any;
}): React.ReactNode => <List disablePadding>{items?.reduce((acc, item) => reduceChildRoutes({ acc, item, depth, path, openedChild, setOpenedChild }), [])}</List>;

const reduceChildRoutes = ({
  acc,
  item,
  depth,
  path,
  openedChild,
  setOpenedChild,
}: {
  acc: React.ReactNode[];
  depth: number;
  item: ItemProps;
  path: string;
  openedChild: string;
  setOpenedChild: any;
}): Array<React.ReactNode> => {
  const key = `${item?.title}-${depth}`;
  const partialMatch = path.includes(item.path);
  const exactMatch = path === item.path;

  if (item?.items) {
    acc.push(
      <DashboardSidebarItem
        active={partialMatch}
        chip={item.chip}
        depth={depth}
        icon={item.icon}
        info={item.info}
        key={key}
        path={item.path}
        href={item.href}
        title={item?.title}
        openedChild={openedChild}
        setOpenedChild={setOpenedChild}>
        {renderNavItems({ depth: depth + 1, items: item.items, path, openedChild, setOpenedChild })}
      </DashboardSidebarItem>,
    );
  } else {
    acc.push(
      <DashboardSidebarItem
        active={exactMatch}
        chip={item.chip}
        depth={depth}
        icon={item?.icon || <BiRightArrowAlt />}
        info={item.info}
        key={key}
        path={item.path}
        href={item.href}
        title={item?.title}
        openedChild={openedChild}
        setOpenedChild={setOpenedChild}
      />,
    );
  }

  return acc;
};

interface DashboardSidebarSectionProps extends ListProps {
  items: ItemProps[];
  path: string;
  depth?: number;
}

export const DashboardSidebarSection: FC<DashboardSidebarSectionProps> = (props) => {
  const { items, path, depth = 0 } = props;
  const [openedChild, setOpenedChild] = useState<any>({});

  useEffect(() => {
    setOpenedChild({ 0: items[0]?.title });
  }, [items]);

  return <List disablePadding>{items?.reduce((acc, item) => reduceChildRoutes({ acc, item, depth, path, openedChild, setOpenedChild }), [])}</List>;
};
