import useCurrentPath from "hooks/useCurrentPath";
import isEmpty from "lodash/isEmpty";
import moment from "moment";
import React, { useCallback, useEffect, useMemo, useReducer } from "react";
import * as XLSX from "xlsx";

import { useDispatch, useSelector } from "store";
import datalistRedux from "store/modules/datalist";

import { DATA_LIST_VARIANT, useDataListProps } from "./model";

const initialState = {
  page: 0,
  // rowsPerPage: 20,
  order: "asc",
  orderBy: null,
  search: "",
  searchColumns: [],
  searchMapping: null,
  filters: {},
  viewColumns: [],
  filterableColumns: [],
  triggerReload: false,
  checkedRows: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "setPage":
      return { ...state, page: action.payload };
    // case "setRowsPerPage":
    //   return { ...state, rowsPerPage: action.payload };
    case "setOrder":
      return { ...state, order: action.payload };
    case "setOrderBy":
      return { ...state, orderBy: action.payload };
    case "setSearch":
      return { ...state, search: action.payload };
    case "setSearchColumns":
      return { ...state, searchColumns: action.payload };
    case "setSearchMapping":
      return { ...state, searchMapping: action.payload };
    case "setFilters":
      return { ...state, filters: action.payload };
    case "setViewColumns":
      return { ...state, viewColumns: action.payload };
    case "setFilterableColumns":
      return { ...state, filterableColumns: action.payload };
    case "setTriggerReload":
      return { ...state, triggerReload: action.payload };
    case "setCheckedRows":
      return { ...state, checkedRows: action.payload };
    default:
      return state;
  }
}

export const useDataList = (config: useDataListProps) => {
  const {
    dataListKey,
    variant = DATA_LIST_VARIANT.TABLE,
    data,
    totalRecords,
    columns,
    hideViewColumn = false,
    actions,
    exportColumns,
    exportFilename,
    exportFileAnnotation,
    searchFields,
    defaultFilters,
    createResourceButton = null,
    extraActions,
    deleteResourceButton = null,
    reload,
    rowCreator,
    exportCreator,
    listExporter,
    maxHeight = "auto",
    checkbox = false,
    rowCheckboxHidden = null,
  } = config;

  const key = dataListKey || useCurrentPath();

  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const datalistConfig = datalistRedux.getters.configByKey(rootState, key);
  const rowsPerPage = datalistRedux.getters.rowsPerPage(rootState);
  const listToRefresh = datalistRedux.getters.listToRefresh(rootState);

  const [reducerState, reducerDispatch] = useReducer(reducer, initialState);
  const { page, order, orderBy, search, searchColumns, searchMapping, filters, filterableColumns, viewColumns, triggerReload, checkedRows } = reducerState;

  const filterCount = useMemo(() => {
    const dataFilterColumnKeys = filterableColumns?.filter((column) => column?.dateFilter)?.map((column) => column?.filterKey);
    const countAppliedDateFilterColumns = Object.keys(filters)?.filter((key) => dataFilterColumnKeys?.includes(key));

    return {
      categories: Object.keys(filters)?.length,
      options:
        Object.keys(filters).reduce(
          (acc, key) => {
            acc.count += filters[key].length;
            return acc;
          },
          { count: 0 },
        )?.count - countAppliedDateFilterColumns?.length,
    };
  }, [filters, filterableColumns]);

  const isIndeterminate: boolean = useMemo(
    () => checkedRows?.length > 0 && checkedRows?.length < data?.filter((item) => !rowCheckboxHidden?.(item))?.length,
    [checkedRows, data, rowCheckboxHidden],
  );
  const isDeterminate: boolean = useMemo(
    () => data?.length > 0 && checkedRows?.length === data?.filter((item) => !rowCheckboxHidden?.(item))?.length,
    [checkedRows, rowCheckboxHidden, data],
  );

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
      reducerDispatch({ type: "setPage", payload: newPage - 1 });
      reducerDispatch({ type: "setTriggerReload", payload: true });
    },
    [reducerDispatch],
  );

  const handleRowsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      reducerDispatch({ type: "setPage", payload: 0 });
      // reducerDispatch({ type: "setRowsPerPage", payload: parseInt(event.target.value, 10) });
      dispatch(datalistRedux.actions.setRowsPerPage(parseInt(event.target.value, 10)));
      reducerDispatch({ type: "setTriggerReload", payload: true });
    },
    [reducerDispatch, dispatch],
  );

  const handleApplyFilters = useCallback(
    (filters) => {
      const filtersCopy = Object.assign({}, filters);

      // remove all categories who have no options selected
      for (const key in filtersCopy) {
        if (Array.isArray(filtersCopy[key]) && filtersCopy[key]?.length === 0) delete filtersCopy[key];
      }

      reducerDispatch({ type: "setPage", payload: 0 });
      reducerDispatch({ type: "setFilters", payload: filtersCopy });
      reducerDispatch({ type: "setTriggerReload", payload: true });
    },
    [reducerDispatch],
  );

  const handleClearFilter = useCallback(() => {
    reducerDispatch({ type: "setPage", payload: 0 });
    reducerDispatch({ type: "setFilters", payload: {} });
    reducerDispatch({ type: "setTriggerReload", payload: true });
  }, [reducerDispatch]);

  const handleApplyViewColumns = useCallback(
    (columns: string[]) => {
      reducerDispatch({ type: "setViewColumns", payload: columns });
      dispatch(datalistRedux.actions.addConfig({ key, viewColumns: columns }));
    },
    [dispatch, reducerDispatch, key],
  );

  const handleExportColumns = useCallback(
    async (exportColumnIndexes: number[], exportAll?: string) => {
      try {
        // Check to export all data or data only from current page
        const rawDataToExport = exportAll === "true" && !!listExporter ? await listExporter() : data;

        // Format data as per the export creator function
        const items = rawDataToExport?.map((item) => exportCreator(item)?.map((value) => value || ""));

        // Table header
        const tableHeader = exportColumns?.filter((_, index) => exportColumnIndexes?.includes(index));

        // Table body
        const tableBody = items?.map((row) => row?.filter((_, index) => exportColumnIndexes?.includes(index)));

        // Total columns in table
        const lastColumnIndex = tableHeader?.length - 1;

        // Map applied filters for displaying on exported file
        const filterKeys = filters ? Object.keys(filters) : [];
        const appliedFilters = filterKeys?.map((filterKey) => {
          const columDetails = columns?.find((column) => column?.filterKey === filterKey);
          return {
            columnName: columDetails?.label,
            filterValues: filters[filterKey]?.map((value) => columDetails?.filters?.find((filter) => filter?.value?.toString() === value?.toString())?.label || value)?.join(", "),
          };
        });

        // Create Workbook
        const workbook = XLSX.utils.book_new();

        // Add content to the worksheet
        const worksheet = XLSX.utils.aoa_to_sheet([
          [`Title: ${exportFilename}`],
          ...(!isEmpty(exportFileAnnotation)
            ? [[], [`Resource Details:`], ...Object.keys(exportFileAnnotation).map((annotationKey) => [`${annotationKey}: ${exportFileAnnotation[annotationKey]}`])]
            : []),
          ...(appliedFilters?.length ? [[], [`Filters:`], ...appliedFilters.map((appliedFilter) => [`${appliedFilter?.columnName}: ${appliedFilter?.filterValues}`])] : []),
          [],
          tableHeader,
          ...tableBody,
        ]);

        // Merge cells for "Title" and "Filters"
        const mergeFilterCells = appliedFilters?.length
          ? [{ s: { r: 2, c: 0 }, e: { r: 2, c: lastColumnIndex } }, ...appliedFilters.map((_, index) => ({ s: { r: 3 + index, c: 0 }, e: { r: 3 + index, c: lastColumnIndex } }))]
          : [];
        const mergeCells = [{ s: { r: 0, c: 0 }, e: { r: 0, c: lastColumnIndex } }, ...mergeFilterCells];
        worksheet["!merges"] = mergeCells;

        // Create and export the sheet
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, `${exportFilename}.xlsx`);
      } catch (err) {
        console.error(err);
      }
    },
    [listExporter, data, exportColumns, filters, exportFilename, exportFileAnnotation, exportCreator, columns],
  );

  const handleSearch = useCallback(
    (key, columns) => {
      reducerDispatch({ type: "setPage", payload: 0 });
      reducerDispatch({ type: "setSearch", payload: key });
      reducerDispatch({ type: "setSearchColumns", payload: columns });

      const mapping = columns.reduce((acc, curr) => {
        acc[curr] = key;
        return acc;
      }, {});

      reducerDispatch({ type: "setSearchMapping", payload: mapping });
      reducerDispatch({ type: "setTriggerReload", payload: true });
    },
    [reducerDispatch],
  );

  const handleClearSearch = useCallback(() => {
    reducerDispatch({ type: "setPage", payload: 0 });
    reducerDispatch({ type: "setSearch", payload: "" });
    reducerDispatch({ type: "setSearchColumns", payload: [] });
    reducerDispatch({ type: "setSearchMapping", payload: null });
    reducerDispatch({ type: "setTriggerReload", payload: true });
  }, [reducerDispatch]);

  const handleCheckAllRows = useCallback(
    (event: any) => {
      if (event?.target?.checked) {
        reducerDispatch({ type: "setCheckedRows", payload: data?.filter((item) => !rowCheckboxHidden?.(item))?.map((item) => item?.id?.toString()) });
      } else {
        reducerDispatch({ type: "setCheckedRows", payload: [] });
      }
    },
    [reducerDispatch, data, rowCheckboxHidden],
  );

  const handleClearAllCheckedRows = useCallback(() => {
    reducerDispatch({ type: "setCheckedRows", payload: [] });
  }, [reducerDispatch]);

  const handleCheckRow = useCallback(
    (event) => {
      if (event?.target?.checked) {
        reducerDispatch({ type: "setCheckedRows", payload: [...checkedRows, event?.target?.value] });
      } else {
        reducerDispatch({ type: "setCheckedRows", payload: checkedRows?.filter((item) => item !== event?.target?.value) });
      }
    },
    [reducerDispatch, checkedRows],
  );

  const handleFetchList = useCallback(() => {
    if (reload) {
      const filtersCopy = Object.assign({}, filters);
      const dateFilter = filtersCopy?.date || null;

      if (dateFilter?.length) {
        delete filtersCopy.date;
      }

      reload({
        order,
        orderBy,
        limit: rowsPerPage,
        offset: page * rowsPerPage,
        ...(searchMapping ? { search: JSON.stringify(searchMapping) } : {}),
        ...(filtersCopy
          ? {
              filters: JSON.stringify({
                ...filtersCopy,
                ...(dateFilter?.length
                  ? {
                      start_date: moment(dateFilter[0])?.format("YYYY-MM-DD HH:mm:ss"),
                      end_date: moment(dateFilter[1])?.format("YYYY-MM-DD HH:mm:ss"),
                    }
                  : {}),
              }),
            }
          : {}),
      });
    }
  }, [page, rowsPerPage, order, orderBy, searchMapping, filters, reload]);

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

    if (defaultFilters) {
      reducerDispatch({ type: "setFilters", payload: defaultFilters });
    }

    reducerDispatch({ type: "setTriggerReload", payload: true });
  }, [reducerDispatch, defaultFilters]);

  useEffect(() => {
    // set columns which have filters
    const filterableColumns = columns?.filter((column) => !!column?.filterKey);
    reducerDispatch({ type: "setFilterableColumns", payload: filterableColumns });
  }, [columns]);

  useEffect(() => {
    // set columns view indexes
    if (!datalistConfig) {
      reducerDispatch({
        type: "setViewColumns",
        payload: columns
          ?.map((item, index) => ({ ...item, indexKey: index }))
          ?.filter((item) => !item?.defaultHidden)
          ?.map((item) => item?.indexKey),
      });
    } else {
      reducerDispatch({ type: "setViewColumns", payload: datalistConfig?.viewColumns });
    }
  }, [columns, datalistConfig]);

  useEffect(() => {
    // set default search columns
    reducerDispatch({ type: "setSearchColumns", payload: searchFields?.filter((item) => item?.defaultSelected)?.map((item) => item?.key) });
  }, [searchFields, reducerDispatch]);

  useEffect(() => {
    if (listToRefresh?.key === key) {
      if (!listToRefresh?.keepCurrentPage) {
        reducerDispatch({ type: "setPage", payload: 0 });
        reducerDispatch({ type: "setCheckedRows", payload: [] });
      }

      reducerDispatch({ type: "setTriggerReload", payload: true });
      dispatch(datalistRedux.actions.removeListToRefresh());
    }
  }, [key, dispatch, reducerDispatch, listToRefresh]);

  return {
    actions,
    columns,
    data,
    exportColumns,
    filterCount,
    filterableColumns,
    filters,
    key,
    order,
    orderBy,
    page,
    rowsPerPage,
    search,
    searchColumns,
    searchFields,
    totalRecords,
    variant,
    viewColumns,
    triggerReload,
    createResourceButton,
    extraActions,
    deleteResourceButton,
    hideViewColumn,
    maxHeight,
    checkbox,
    isIndeterminate,
    isDeterminate,
    checkedRows,
    rowCheckboxHidden,

    exportCreator,
    handleApplyFilters,
    handleApplyViewColumns,
    handleChangePage,
    handleClearFilter,
    handleClearSearch,
    handleExportColumns,
    handleFetchList,
    handleRequestSort,
    handleRowsPerPageChange,
    handleSearch,
    rowCreator,
    handleCheckRow,
    handleCheckAllRows,
    handleClearAllCheckedRows,
  };
};

export default useDataList;
