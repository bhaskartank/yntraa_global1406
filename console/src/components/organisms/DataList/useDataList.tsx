import React, { useCallback, useEffect, useMemo, useReducer } from "react";

import { DATA_LIST_VARIANT, UseDataListHook } from "./types";

const initialState = {
  variant: null,
  page: 1,
  rowsPerPage: 10,
  order: "asc",
  orderBy: null,
  search: "",
  viewColumns: [],
  triggerReload: false,
  checkedRows: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "setVariant":
      return { ...state, variant: action.payload };
    case "setPage":
      return { ...state, page: action.payload };
    case "setRowsPerPage":
      return { ...state, rowsPerPage: action.payload };
    case "setOrder":
      return { ...state, order: action.payload };
    case "setOrderBy":
      return { ...state, orderBy: action.payload };
    case "setSearch":
      return { ...state, search: action.payload };
    case "setViewColumns":
      return { ...state, viewColumns: action.payload };
    case "setTriggerReload":
      return { ...state, triggerReload: action.payload };
    case "setCheckedRows":
      return { ...state, checkedRows: action.payload };
    default:
      return state;
  }
}

export const useDataList = (config: UseDataListHook) => {
  const {
    data,
    totalRecords,
    columns,
    rowActions,
    createResourceButton = null,
    extraActions,
    reload,
    rowCreator,
    gridCreator,
    gridViewBreakpoints,
    emptyDataText = "No Data",
    maxHeight = "auto",
    checkbox = false,
    multicheck = true,
    hideActionBar = false,
    searchBar,
  } = config;

  const [reducerState, reducerDispatch] = useReducer(reducer, initialState);
  const { variant, page, rowsPerPage, order, orderBy, search, viewColumns, triggerReload, checkedRows } = reducerState;

  const isIndeterminate: boolean = useMemo(() => checkedRows?.length > 0 && checkedRows?.length < data?.length, [checkedRows, data]);
  const isDeterminate: boolean = useMemo(() => data?.length > 0 && checkedRows?.length === data?.length, [checkedRows, data]);

  const handleRequestSort = useCallback(
    (event: React.MouseEvent<unknown>, property: any) => {
      const isAsc = orderBy === property && order === "asc";

      reducerDispatch({ type: "setOrder", payload: isAsc ? "desc" : "asc" });
      reducerDispatch({ type: "setOrderBy", payload: property });
      reducerDispatch({ type: "setTriggerReload", payload: true });
    },
    [order, orderBy, reducerDispatch],
  );

  const handleChangePage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      reducerDispatch({ type: "setPage", payload: newPage });
      reducerDispatch({ type: "setTriggerReload", payload: true });
    },
    [reducerDispatch],
  );

  const handleRowsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      reducerDispatch({ type: "setPage", payload: 1 });
      reducerDispatch({ type: "setRowsPerPage", payload: parseInt(event.target.value, 10) });
      reducerDispatch({ type: "setTriggerReload", payload: true });
    },
    [reducerDispatch],
  );

  const handleSearch = useCallback(
    (key) => {
      reducerDispatch({ type: "setPage", payload: 1 });
      reducerDispatch({ type: "setSearch", payload: key });

      reducerDispatch({ type: "setTriggerReload", payload: true });
    },
    [reducerDispatch],
  );

  const handleClearSearch = useCallback(() => {
    reducerDispatch({ type: "setPage", payload: 1 });
    reducerDispatch({ type: "setSearch", payload: "" });
    reducerDispatch({ type: "setTriggerReload", payload: true });
  }, [reducerDispatch]);

  const handleCheckAllRows = useCallback(
    (event: any) => {
      if (event?.target?.checked) {
        reducerDispatch({ type: "setCheckedRows", payload: data?.map((item) => item?.id?.toString()) });
      } else {
        reducerDispatch({ type: "setCheckedRows", payload: [] });
      }
    },
    [reducerDispatch, data],
  );

  const handleClearAllCheckedRows = useCallback(() => {
    reducerDispatch({ type: "setCheckedRows", payload: [] });
  }, [reducerDispatch]);

  const handleCheckRow = useCallback(
    (event) => {
      if (multicheck) {
        if (event?.target?.checked) {
          reducerDispatch({ type: "setCheckedRows", payload: [...checkedRows, event?.target?.value] });
        } else {
          reducerDispatch({
            type: "setCheckedRows",
            payload: checkedRows?.filter((item) => item !== event?.target?.value),
          });
        }
      } else {
        if (event?.target?.checked) {
          reducerDispatch({ type: "setCheckedRows", payload: [event?.target?.value] });
        } else {
          reducerDispatch({ type: "setCheckedRows", payload: [] });
        }
      }
    },
    [reducerDispatch, checkedRows, multicheck],
  );

  const handleChangeVariant = useCallback((variant) => {
    reducerDispatch({ type: "setVariant", payload: variant });
  }, []);

  const handleFetchList = useCallback(() => {
    reload?.({ page: page - 1, size: rowsPerPage, sortBy: orderBy, sortDesc: order !== "asc", search });
  }, [page, rowsPerPage, order, orderBy, search, reload]);

  useEffect(() => {
    reducerDispatch({
      type: "setViewColumns",
      payload: columns
        ?.map((item, index) => ({ ...item, indexKey: index }))
        ?.filter((item) => !item?.defaultHidden)
        ?.map((item) => item?.indexKey),
    });
  }, [columns]);

  useEffect(() => {
    if (triggerReload) {
      handleFetchList();
      reducerDispatch({ type: "setTriggerReload", payload: false });
    }
  }, [handleFetchList, triggerReload]);

  useEffect(() => {
    // get column with default sorting enabled
    const defaultSorting = columns?.find((column) => column?.defaultSort);

    if (defaultSorting) {
      reducerDispatch({ type: "setOrder", payload: defaultSorting?.defaultSort });
      reducerDispatch({ type: "setOrderBy", payload: defaultSorting?.sortKey });
    }

    reducerDispatch({ type: "setTriggerReload", payload: true });
  }, [reducerDispatch, columns]);

  useEffect(() => {
    if (rowCreator && gridCreator) {
      reducerDispatch({ type: "setVariant", payload: DATA_LIST_VARIANT.TABLE });
    } else if (rowCreator) {
      reducerDispatch({ type: "setVariant", payload: DATA_LIST_VARIANT.TABLE });
    } else if (gridCreator) {
      reducerDispatch({ type: "setVariant", payload: DATA_LIST_VARIANT.GRID });
    }
  }, [rowCreator, gridCreator]);

  return {
    rowActions,
    columns,
    data,
    order,
    orderBy,
    page,
    rowsPerPage,
    search,
    totalRecords,
    variant,
    viewColumns,
    triggerReload,
    createResourceButton,
    extraActions,
    hideActionBar,
    maxHeight,
    checkbox,
    multicheck,
    isIndeterminate,
    isDeterminate,
    checkedRows,
    searchBar,
    gridViewBreakpoints,
    emptyDataText,

    handleChangePage,
    handleClearSearch,
    handleFetchList,
    handleRequestSort,
    handleRowsPerPageChange,
    handleSearch,
    rowCreator,
    gridCreator,
    handleCheckRow,
    handleCheckAllRows,
    handleClearAllCheckedRows,
    handleChangeVariant,
  };
};

export default useDataList;
