import { ReactNode } from "react";

export type AlignType = "center" | "inherit" | "justify" | "left" | "right";
export type Order = "asc" | "desc";

export interface ItemProps {
  path?: string;
  icon?: ReactNode;
  chip?: ReactNode;
  info?: ReactNode;
  items?: ItemProps[];
  title?: string;
  href?: string;
}
