import { FC, useCallback, useMemo } from "react";

import { useSelector } from "store";
import logsRedux from "store/modules/logs";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListUserAccessLogsProps {
  fetchUserAccessLogs: any;
  exportUserAccessLogs: any;
}

const ListUserAccessLogs: FC<ListUserAccessLogsProps> = ({ fetchUserAccessLogs, exportUserAccessLogs }) => {
  const rootState = useSelector((state: any) => state);
  const userAccessLogs = logsRedux.getters.userAccessLogs(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Action", sortKey: "action" },
      { label: "Action Method", sortKey: "action_method", filterKey: "action_method", filters: userAccessLogs?.list?.filter_values?.action_method },
      { label: "Action URL", sortKey: "action_url", defaultHidden: true },
      { label: "User", sortKey: "user_name", filterKey: "user_name", filters: userAccessLogs?.list?.filter_values?.user_name },
      { label: "Status", align: "center", sortKey: "status", filterKey: "status", filters: userAccessLogs?.list?.filter_values?.status },
      { label: "Log Date", sortKey: "created", defaultSort: "desc" },
    ],
    [userAccessLogs?.list?.filter_values],
  );

  const exportColumns: string[] = useMemo(() => ["Action", "Action Method", "Action URL", "User", "Status", "Log Date"], []);

  const searchFields = useMemo(
    () => [
      { key: "user_name", label: "User Name" },
      { key: "organisation_name", label: "Organisation Name" },
      { key: "project_name", label: "Project Name" },
      { key: "provider_name", label: "Provider Name" },
      { key: "action", label: "Action" },
      { key: "action_url", label: "Action URL" },
      { key: "ref_task_id", label: "Ref. Task ID" },
      { key: "session_uuid", label: "Session UUID" },
      { key: "resource_type", label: "Resource Type" },
      { key: "resource_name", label: "Resource Name" },
      { key: "error_message", label: "Error Message" },
    ],
    [],
  );

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.action },
      { content: item?.action_method },
      { content: item?.action_url },
      { content: item?.user_name },
      { content: item?.status ? <StatusChip label={item?.status} helperText={item?.error_message} /> : null, align: "center" },
      { content: formatDate(item?.created) },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [item?.action, item?.action_method, item?.action_url, item?.user_name, item?.status?.toUpperCase(), formatDate(item?.created, false, true)];
  }, []);

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchUserAccessLogs({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchUserAccessLogs],
  );

  const dataList = useDataList({
    data: userAccessLogs?.list?.data || [],
    totalRecords: userAccessLogs?.totalRecords,
    columns,
    exportFilename: "User Access Logs List",
    exportColumns,
    searchFields,
    rowCreator,
    exportCreator,
    listExporter: exportUserAccessLogs,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListUserAccessLogs;
