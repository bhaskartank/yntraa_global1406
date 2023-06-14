import React, { ReactNode } from "react";

export type AlignType = "center" | "inherit" | "justify" | "left" | "right";
export type Order = "asc" | "desc";
export type ButtonVariant = "text" | "outlined" | "contained";
export type ButtonColor = "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning" | string;

export const enum DATA_LIST_VARIANT {
  TABLE = "TABLE",
  GRID = "GRID",
}

export interface ColumnProps {
  label: string;
  align?: AlignType;
  sortKey?: string;
  defaultSort?: Order;
  defaultHidden?: boolean;
}

export interface ExportColumnProps {
  label: string;
  hidden?: boolean;
}

export interface RowActionProps {
  icon?: (item: any) => React.ReactNode;
  label: (item: any) => string;
  hidden?: (item: any) => boolean;
  disabled?: (item: any) => boolean;
  onClick: (item: any) => void;
  color?: (item: any) => string;
  confirmation?: (item?: any) => {
    title: string;
    description?: string;
    content?: React.ReactNode;
    confirmBtnText?: string;
    cancelBtnText?: string;
  };
}

export interface TableActionProps {
  icon?: (item: any) => React.ReactNode;
  label: (item: any) => string;
  hidden?: (item: any) => boolean;
  disabled?: (item: any) => boolean;
  onClick: (item: any) => void;
  color?: (item: any) => ButtonColor;
  variant?: (item: any) => ButtonVariant;
  confirmation?: (item?: any) => {
    title: string;
    resourceDetails?: React.ReactElement;
    description?: string;
    content?: React.ReactNode;
    confirmBtnText?: string;
    cancelBtnText?: string;
  };
}

export interface CreateResourceButtonProps {
  text: string;
  onClick: () => void;
}

export interface RowCreatorItem {
  content: React.ReactNode;
  align?: AlignType;
}

export interface RowCreatorProps {
  (item: any): RowCreatorItem[];
}

export interface GridCreatorItem {
  title?: ReactNode;
  content: React.ReactNode;
}

export interface GridCreatorProps {
  (item: any): GridCreatorItem;
}

export interface SearchBarProps {
  placeholder?: string;
  // onChange: (query: any) => unknown;
  // onClear: () => unknown;
}

export interface utilParameters {
  presets?: {
    initialConfig: { viewColumns: { key: string; indexes: string[] } };
    common: { rowsPerPage: number; viewVariant: string | null };
  };
  storeViewColumns: (selection: string[]) => void;
  storeRowsPerPage: (rowsPerPage: number) => void;
  storeViewVariant: (variant: string) => void;
}

export interface UseDataListHook {
  checkbox?: boolean;
  columns?: ColumnProps[];
  createResourceButton?: CreateResourceButtonProps;
  data: any[];
  emptyDataText?: string;
  extraActions?: ReactNode;
  gridCreator?: GridCreatorProps;
  gridViewBreakpoints?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  hideActionBar?: boolean;
  maxHeight?: number | string;
  multicheck?: boolean;
  reload?: (args?: any) => void;
  rowActions?: RowActionProps[];
  rowCreator?: RowCreatorProps;
  searchBar?: SearchBarProps;
  totalRecords?: number;
}

export interface DataListStateProps {
  page?: number;
  rowsPerPage?: number;
  order?: Order;
  orderBy?: string;
  extraParams?: any;
  checkedRows?: any[];
}

export interface ReloadListWithParamsProps {
  params?: DataListStateProps;
  keepCurrentState?: boolean;
}

export interface CreateButtonProps {
  text?: string;
  icon?: React.ReactNode;
  onClick?: (args?: any) => unknown;
  hidden?: boolean;
  disabled?: boolean;
  tooltip?: string;
  size?: "small" | "medium" | "large";
}

export interface DataListHeaderProps {
  columns?: ColumnProps[];
  rowActions: RowActionProps[];
  order?: Order;
  orderBy?: string;
  onRequestSort?: (event: React.MouseEvent<unknown>, property: string) => void;
}

export interface DataListProps {
  dataList: any;
}
