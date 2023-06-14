import { Box, Stack } from "@mui/material";
import { ActionDateIcon, ActionTimeIcon, FilledUserIcon } from "icons";
import { FC, useCallback, useMemo } from "react";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ColumnProps, DATA_LIST_VARIANT, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import EventLogIcon from "./EventLogIcon";

interface ListEventLogProps {
  fetchEventLogs: any;
  exportEventLogs: any;
  eventLogs: any[];
  exportFileAnnotation: { [key: string]: any };
}

const ListEventLogs: FC<ListEventLogProps> = ({ fetchEventLogs, exportEventLogs, eventLogs, exportFileAnnotation }) => {
  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Action Taken", sortKey: "action" },
      { label: "Action By", sortKey: "user_name" },
      { label: "Status", sortKey: "status" },
      { label: "Action On", sortKey: "created", defaultSort: "desc" },
      { label: "Action Time" },
      { label: "Organisation", sortKey: "organisation_name", defaultHidden: true },
      { label: "Project", sortKey: "project_name", defaultHidden: true },
      { label: "Provider", sortKey: "provider_name", defaultHidden: true },
    ],
    [],
  );

  const exportColumns: string[] = useMemo(() => ["Action Taken", "Action By", "Status", "Error Message", "Action Date", "Action Time", "Organisation", "Project", "Provider"], []);

  const searchFields = useMemo(
    () => [
      { key: "user_name", label: "User Name" },
      { key: "organisation_name", label: "Organisation Name" },
      { key: "project_name", label: "Project Name" },
      { key: "provider_name", label: "Provider Name" },
      { key: "error_message", label: "Error Message" },
    ],
    [],
  );

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      {
        content: (
          <Stack direction="row" alignItems="center" spacing={1}>
            <EventLogIcon eventType={item?.action} />
            <Box component="span">{item?.action}</Box>
          </Stack>
        ),
      },
      {
        content: (
          <Stack direction="row" alignItems="center" spacing={1}>
            <FilledUserIcon />
            <Box component="span">{item?.user_name}</Box>
          </Stack>
        ),
      },
      { content: item?.status ? <StatusChip label={item?.status} helperText={item?.error_message} /> : null },
      {
        content: (
          <Stack direction="row" alignItems="center" spacing={1}>
            <ActionDateIcon />
            <Box component="span">{item?.created?.split(" ")[0]}</Box>
          </Stack>
        ),
      },
      {
        content: (
          <Stack direction="row" alignItems="center" spacing={1}>
            <ActionTimeIcon />
            <Box component="span">{item?.created?.split(" ")[1]}</Box>
          </Stack>
        ),
      },
      { content: item?.organisation_name },
      { content: item?.project_name },
      { content: item?.provider_name },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.action,
      item?.user_name,
      item?.status,
      item?.error_message,
      item?.created?.split(" ")[0],
      item?.created?.split(" ")[1],
      item?.organisation_name,
      item?.project_name,
      item?.provider_name,
    ];
  }, []);

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchEventLogs({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchEventLogs],
  );

  const dataList = useDataList({
    variant: DATA_LIST_VARIANT.EVENT_LOG,
    data: eventLogs,
    columns,
    exportFilename: "Event Logs List",
    exportFileAnnotation,
    exportColumns,
    searchFields,
    rowCreator,
    exportCreator,
    listExporter: exportEventLogs,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListEventLogs;
