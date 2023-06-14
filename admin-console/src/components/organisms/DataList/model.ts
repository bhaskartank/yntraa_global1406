import React, { ReactNode } from "react";

export type AlignType = "center" | "inherit" | "justify" | "left" | "right";
export type Order = "asc" | "desc";

export const enum DATA_LIST_VARIANT {
  TABLE = "TABLE",
  EVENT_LOG = "EVENT_LOG",
}

export interface Filter {
  label: string;
  value: string;
}
export interface ColumnProps {
  sortKey?: string;
  label: string;
  align?: AlignType;
  hidden?: boolean;
  defaultSort?: Order;
  filterKey?: string;
  filters?: Filter[];
  defaultHidden?: boolean;
  dateFilter?: boolean;
}
export interface ExportColumnProps {
  label: string;
  hidden?: boolean;
}

export interface ActionProps {
  icon?: React.ReactNode;
  label: (item: any) => string;
  hidden?: (item: any) => boolean;
  disabled?: (item: any) => boolean;
  onClick: (item: any) => void;
  color?: string;
  confirmation?: (item?: any) => {
    title: string;
    resourceDetails?: React.ReactElement;
    description?: string;
    content?: React.ReactNode;
    confirmBtnText?: string;
    cancelBtnText?: string;
    detailDescription?: React.ReactElement;
  };
}

export interface CreateResourceButtonProps {
  text: string;
  onClick: () => void;
}

export interface DeleteResourceButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

export interface RowCreatorItem {
  content: React.ReactNode;
  align?: AlignType;
}

export interface RowCreatorProps {
  (item: any): RowCreatorItem[];
}

export interface useDataListProps {
  dataListKey?: string;
  hideViewColumn?: boolean;
  variant?: DATA_LIST_VARIANT;
  data: any[];
  totalRecords?: number;
  columns: ColumnProps[];
  exportColumns?: string[];
  actions?: ActionProps[];
  exportFilename?: string;
  exportFileAnnotation?: { [key: string]: any };
  searchFields?: any[];
  defaultFilters?: any;
  createResourceButton?: CreateResourceButtonProps;
  extraActions?: ReactNode;
  deleteResourceButton?: (checkedRows: any[]) => DeleteResourceButtonProps;
  reload?: (args?: any) => void;
  rowCreator: RowCreatorProps;
  exportCreator?: (item: any) => string[];
  listExporter?: any;
  maxHeight?: number | string;
  checkbox?: boolean;
  rowCheckboxHidden?: (item: any) => boolean;
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
  onClick?: (args?: any) => any;
  hidden?: boolean;
  disabled?: boolean;
  tooltip?: string;
  size?: "small" | "medium" | "large";
}

export interface SearchProps {
  placeholder?: string;
  onChange: (query: any) => any;
  onClear: () => any;
}

export interface ActionBarProps {
  title?: any;
  subtitle?: any;
  createButton?: CreateButtonProps;
  search?: SearchProps;
  rowCreator: { list?: (item: any) => React.ReactNode; grid?: (item: any) => React.ReactNode };
  onChangeView: (event: React.MouseEvent<HTMLElement>, nextView: string) => void;
  actionBarExtended?: React.ReactNode;
  extraActions?: React.ReactNode;
}

export interface DataListHeaderProps {
  columns?: ColumnProps[];
  actions: ActionProps[];
  order?: Order;
  orderBy?: string;
  onRequestSort?: (event: React.MouseEvent<unknown>, property: string) => void;
}

export interface DataListBodyProps {
  data: any[];
  actions: ActionProps[];
  rowCreator: (row: any) => React.ReactNode;
  onSelectRow: (row: any) => void;
  emptyDataText?: string;
  rowHighlighter?: (row: any) => string;
}

export interface TableRef {
  state?: DataListStateProps;
  reloadListWithParams?: (params?: ReloadListWithParamsProps) => void;
}

export interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

export interface DataListFooterProps {
  page: number;
  rowsPerPage: number;
  handleChangePage: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  totalRecords?: number;
  rowsPerPageOptions?: Array<number>;
}

export interface DataListProps {
  dataList: any;
  hideActionBar?: false;
}

export interface TableListingProps extends DataListProps {
  state?: DataListStateProps;
  handleRequestSort?: (event: React.MouseEvent<unknown>, property: any) => void;
}
