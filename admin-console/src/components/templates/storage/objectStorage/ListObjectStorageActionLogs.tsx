import { Box, Stack } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import objectStorageRedux from "store/modules/objectStorage";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListObjectStorageActionLogsProps {
  fetchObjectStorageActionLogs: any;
  exportObjectStorageActionLogs: any;
  defaultFilters: any;
}

const ListObjectStorageActionLogs: FC<ListObjectStorageActionLogsProps> = ({ fetchObjectStorageActionLogs, exportObjectStorageActionLogs, defaultFilters }) => {
  const rootState = useSelector((state: any) => state);
  const objectStorageBuckets = objectStorageRedux.getters.objectStorageActionLogs(rootState);
  const navigate = useNavigate();

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Action", sortKey: "action", filterKey: "action", filters: objectStorageBuckets?.list?.filter_values?.action },
      { label: "Action Method", sortKey: "action_method" },
      { label: "Action URL", sortKey: "action_url", defaultHidden: true },
      { label: "Resource Name ", align: "center", sortKey: "resource_name", filterKey: "resource_name", filters: objectStorageBuckets?.list?.filter_values?.resource_name },
      { label: "Resource Type", align: "center", sortKey: "resource_type" },
      { label: "Object Storage Provider", align: "center" },
      { label: "Action", align: "center", sortKey: "action" },
      { label: "User Email", align: "center", sortKey: "username", filterKey: "username", filters: objectStorageBuckets?.list?.filter_values?.username },
      { label: "Status", align: "center", sortKey: "status", filterKey: "status", filters: objectStorageBuckets?.list?.filter_values?.status },
      { label: "Created On", align: "center", sortKey: "created" },
    ],
    [objectStorageBuckets?.list?.filter_values],
  );

  const exportColumns: string[] = useMemo(() => ["Objectstorage Provider Name", "User", "Status", "Created"], []);

  const searchFields = useMemo(
    () => [
      { key: "userame", label: "username" },
      { key: "objectstorage_provider_name", label: "Objectstorage Provider Name", defaultSelected: true },
      { key: "status", label: "Status" },
    ],
    [],
  );

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.action },
      { content: item?.action_method, align: "center" },
      { content: item?.action_url },
      {
        content: (
          <Stack alignItems="center">
            <Box whiteSpace="nowrap">{item?.resource_name ? item?.resource_name : "-"}</Box>
          </Stack>
        ),
        align: "center",
      },
      {
        content: (
          <Stack alignItems="center">
            <Box whiteSpace="nowrap">{item?.resource_type ? item?.resource_type : "-"}</Box>
          </Stack>
        ),
        align: "center",
      },
      {
        content: (
          <Stack alignItems="center">
            <Box whiteSpace="nowrap">{item?.objectstorage_provider_name}</Box>
          </Stack>
        ),
        align: "center",
      },
      {
        content: (
          <Stack alignItems="center">
            <Box whiteSpace="nowrap">{item?.action}</Box>
          </Stack>
        ),
        align: "center",
      },
      {
        content: (
          <Stack alignItems="center">
            <Box whiteSpace="nowrap">{item?.username}</Box>
          </Stack>
        ),
        align: "center",
      },
      { content: item?.status ? <StatusChip label={item?.status} helperText={item?.error_message} /> : null, align: "center" },
      { content: formatDate(item?.created), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [item?.objectstorage_provider_name, item?.username, item?.status, formatDate(item?.created, false, true)];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "View Details",
      onClick: (item) => navigate(`${item?.id}/view-details`, { state: { objStorageActionLogs: item } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchObjectStorageActionLogs({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchObjectStorageActionLogs],
  );

  const dataList = useDataList({
    data: objectStorageBuckets?.list?.data || [],
    totalRecords: objectStorageBuckets?.totalRecords,
    columns,
    actions,
    exportFilename: "Object Storage Action Logs",
    exportColumns,
    searchFields,
    defaultFilters,
    rowCreator,
    exportCreator,
    listExporter: exportObjectStorageActionLogs,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListObjectStorageActionLogs;
