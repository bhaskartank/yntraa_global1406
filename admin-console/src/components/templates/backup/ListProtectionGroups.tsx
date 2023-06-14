import { Box, Stack } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import backupRedux from "store/modules/backups";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListBackupProps {
  fetchProtectionGroups: any;
  exportProtectionGroups: any;
  fetchProtectionGroupOwnerDetail: any;
}

const ListBackup: FC<ListBackupProps> = ({ fetchProtectionGroups, exportProtectionGroups, fetchProtectionGroupOwnerDetail }) => {
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const backups = backupRedux.getters.protectionGroups(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Protection Group Name", sortKey: "protection_group_name" },
      //   { label: "Private IP", align: "center", filterKey: "private_ip", filters: backups?.list?.filter_values?.private_ip },
      //   { label: "Backup Network IP", align: "center", filterKey: "backup_network_ip", filters: backups?.list?.filter_values?.backup_network_ip },
      //   { label: "Backup Path", align: "center", sortKey: "backup_path", filterKey: "backup_path", filters: backups?.list?.filter_values?.backup_path },
      {
        label: "Provider",
        align: "center",
        filterKey: "provider_id",
        filters: backups?.list?.filter_values?.provider?.map((item) => ({ label: `${item?.provider_name} (${item?.provider_id})`, value: item?.id })),
      },
      { label: "Provider Location", align: "center", filterKey: "provider_location", filters: backups?.list?.filter_values?.provider_location, defaultHidden: true },
      {
        label: "Organisation",
        align: "center",
        filterKey: "organisation_id",
        filters: backups?.list?.filter_values?.organisation?.map((item) => ({ label: `${item?.name} (${item?.org_id})`, value: item?.id })),
        defaultHidden: true,
      },
      {
        label: "Cloud Reg. A/C No",
        align: "center",
        filterKey: "organisation_org_reg_code",
        filters: backups?.list?.filter_values?.organisation?.map((item) => ({ label: item?.org_reg_code, value: item?.org_reg_code })),
      },
      {
        label: "Project",
        align: "center",
        filterKey: "project_id",
        filters: backups?.list?.filter_values?.project?.map((item) => ({ label: `${item?.name} (${item?.project_id})`, value: item?.id })),
        defaultHidden: true,
      },
      { label: "Status", align: "center", sortKey: "status", filterKey: "status", filters: backups?.list?.filter_values?.status },
      { label: "Created", align: "center", sortKey: "created", defaultSort: "desc" },
    ],
    [backups?.list?.filter_values],
  );

  const exportColumns: string[] = useMemo(
    () => [
      "Protection Group Name",
      //   "Private IP",
      //   "Backup Network IP",
      //   "Backup Path",
      "Provider Name",
      "Provider ID",
      "Provider Location",
      "Organisation",
      "Organisation ID",
      "Cloud Reg. A/C No",
      "Project Name",
      "Project ID",
      "Status",
      "Created",
    ],
    [],
  );

  //   const searchFields = useMemo(() => [{ key: "protection_group_name", label: "Protection Group Name" }], []);
  const searchFields = useMemo(
    () => [
      { key: "protection_group_name", label: "Protection Group Name" },
      { key: "protection_group_id", label: "Protection Group ID" },
      { key: "project_name", label: "Project Name" },
      { key: "project_project_id", label: "Project ID" },
      { key: "organisation_name", label: "Organisation" },
      { key: "organisation_org_id", label: "Organisation ID" },
      { key: "organisation_org_reg_code", label: "Cloud Reg. A/C No" },
      { key: "provider_location", label: "Provider Location" },
      { key: "provider_code", label: "Provider ID" },
    ],
    [],
  );

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.protection_group_name },
      {
        content: (
          <Stack alignItems="center">
            <Box whiteSpace="nowrap">{item?.provider?.provider_name}</Box>
            <Box>({item?.provider?.provider_id})</Box>
          </Stack>
        ),
        align: "center",
      },
      { content: item?.provider?.provider_location, align: "center" },
      {
        content: (
          <Stack>
            <Box component="span">{item?.project?.organisation?.name}</Box>
            <Box component="span">({item?.project?.organisation?.org_id})</Box>
          </Stack>
        ),
        align: "center",
      },
      { content: item?.project?.organisation?.org_reg_code, align: "center" },
      {
        content: (
          <Stack>
            <Box component="span">{item?.project?.name}</Box>
            <Box component="span">({item?.project?.project_id})</Box>
          </Stack>
        ),
        align: "center",
      },
      { content: item?.status ? <StatusChip label={item?.status} /> : null, align: "center" },
      { content: formatDate(item?.created), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.protection_group_name,
      item?.provider?.provider_name,
      item?.provider?.provider_id,
      item?.provider?.provider_location,
      item?.project?.organisation?.name,
      item?.project?.organisation?.org_id,
      item?.project?.organisation?.org_reg_code,
      item?.project?.name,
      item?.project?.project_id,
      item?.status?.toUpperCase(),
      formatDate(item?.created, false, true),
    ];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "View Details",
      onClick: (item) => navigate(`${item?.id}/view-details`, { state: { BackupProtectionGroupRequestDetail: item } }),
    },
    {
      label: () => "View Owner Details",
      onClick: (item) => fetchProtectionGroupOwnerDetail(item),
    },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.id], resource_type: ["ProtectionGroup"] } } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchProtectionGroups({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchProtectionGroups],
  );

  const dataList = useDataList({
    data: backups?.list?.data || [],
    totalRecords: backups?.totalRecords,
    columns,
    exportFilename: "Protection Groups List",
    exportColumns,
    searchFields,
    actions,
    rowCreator,
    exportCreator,
    listExporter: exportProtectionGroups,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListBackup;
