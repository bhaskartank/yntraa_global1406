import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import logsRedux from "store/modules/logs";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListAdminActionLogsProps {
  fetchAdminActionLogs: any;
  exportAdminActionLogs: any;
  defaultFilters: any;
}

const ListAdminActionLogs: FC<ListAdminActionLogsProps> = ({ fetchAdminActionLogs, exportAdminActionLogs, defaultFilters }) => {
  const rootState = useSelector((state: any) => state);
  const navigate = useNavigate();
  const adminActionLogs = logsRedux.getters.adminActionLogs(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Action", sortKey: "action" },
      { label: "Action Method", sortKey: "action_method", filterKey: "action_method", filters: adminActionLogs?.list?.filter_values?.action_method },
      { label: "Action URL", sortKey: "action_url", defaultHidden: true },
      { label: "Ref Task ID", sortKey: "ref_task_id", defaultHidden: true },
      { label: "Resource Name", sortKey: "resource_name" },
      { label: "Resource Type", sortKey: "resource_type", filterKey: "resource_type", filters: adminActionLogs?.list?.filter_values?.resource_type },
      { label: "Organisation", sortKey: "organisation_name", filterKey: "organisation_name", filters: adminActionLogs?.list?.filter_values?.organisation_name },
      { label: "Project", sortKey: "project_name", filterKey: "project_name", filters: adminActionLogs?.list?.filter_values?.project_name },
      { label: "Provider", sortKey: "provider_name", filterKey: "provider_name", filters: adminActionLogs?.list?.filter_values?.provider_name },
      { label: "Username", sortKey: "user_name", filterKey: "user_name", filters: adminActionLogs?.list?.filter_values?.user_name },
      { label: "Status", align: "center", sortKey: "status", filterKey: "status", filters: adminActionLogs?.list?.filter_values?.status },
      { label: "Error Message" },
      { label: "Log Date", sortKey: "created", defaultSort: "desc", filterKey: "date", dateFilter: true },
    ],
    [adminActionLogs?.list?.filter_values],
  );

  const exportColumns: string[] = useMemo(
    () => [
      "Action",
      "Action Method",
      "Action URL",
      "Ref Task ID",
      "Resource Name",
      "Resource Type",
      "Organisation",
      "Project",
      "Provider",
      "Username",
      "Status",
      "Error Message",
      "Log Date",
    ],
    [],
  );

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
      { content: item?.action_method, align: "center" },
      { content: item?.action_url },
      { content: item?.ref_task_id },
      { content: item?.resource_name },
      { content: item?.resource_type },
      { content: item?.organisation_name },
      { content: item?.project_name },
      { content: item?.provider_name },
      { content: item?.user_name },
      { content: item?.status ? <StatusChip label={item?.status} helperText={item?.error_message} /> : null, align: "center" },
      { content: item?.error_message },
      { content: formatDate(item?.created) },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.action,
      item?.action_method,
      item?.action_url,
      item?.ref_task_id,
      item?.resource_name,
      item?.resource_type,
      item?.organisation_name,
      item?.project_name,
      item?.provider_name,
      item?.user_name,
      item?.status?.toUpperCase(),
      item?.error_message,
      formatDate(item?.created, false, true),
    ];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "View Details",
      onClick: (item) => navigate(`${item?.id}/log-details`, { state: { actionLogs: item } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchAdminActionLogs({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchAdminActionLogs],
  );

  const dataList = useDataList({
    data: adminActionLogs?.list?.data || [],
    totalRecords: adminActionLogs?.totalRecords,
    columns,
    exportFilename: "Admin Action Logs List",
    exportColumns,
    searchFields,
    defaultFilters,
    rowCreator,
    exportCreator,
    actions,
    listExporter: exportAdminActionLogs,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListAdminActionLogs;
