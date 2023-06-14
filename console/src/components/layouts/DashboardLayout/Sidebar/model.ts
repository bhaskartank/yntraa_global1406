import { ListProps } from "@mui/material";
import { ReactNode } from "react";

export type AlignType = "center" | "inherit" | "justify" | "left" | "right";
export type Order = "asc" | "desc";

export interface ItemProps {
  path?: string;
  icon?: ReactNode;
  chip?: ReactNode;
  info?: ReactNode;
  items?: ItemProps[];
  hidden?: boolean;
  title?: string;
  href?: string;
}

export interface SectionProps extends ListProps {
  sectionIndex?: number;
  heading?: string;
  items: ItemProps[];
  path: string;
  depth?: number;
  isDrawerOpen: boolean;
}
