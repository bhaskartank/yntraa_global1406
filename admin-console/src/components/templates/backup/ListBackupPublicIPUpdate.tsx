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
  fetchBackupPublicIpUpdate: any;
  exportBackupPublicIpUpdate: any;
}

const ListBackup: FC<ListBackupProps> = ({ fetchBackupPublicIpUpdate, exportBackupPublicIpUpdate }) => {
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const backups = backupRedux.getters.backupPublicIpUpdate(rootState);

  const getStatusLabel = useCallback((item) => {
    return item?.is_backup_verified === true
      ? "verified"
      : item.backup_reject_remarks && item.backup_reject_remarks !== ""
      ? "rejected"
      : item.is_backup_verified === false
      ? "Not Verified"
      : "-";
  }, []);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Backup Request ID", sortKey: "backup_request_id" },
      { label: "Public IP Request ID", align: "center", sortKey: "request_id" },
      { label: "Application", align: "center" },
      { label: "Public IP", align: "center", sortKey: "allocated_public_ip" },
      { label: "Routable IP", align: "center", sortKey: "routable_ip", filterKey: "routable_ip", filters: backups?.list?.filter_values?.routable_ip },
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
      {
        label: "Status",
        align: "center",
        sortKey: "status",
      },
      { label: "Backup Requested On", align: "center", sortKey: "created", defaultSort: "desc" },
    ],
    [backups?.list?.filter_values],
  );

  const exportColumns: string[] = useMemo(
    () => [
      "Backup Request ID",
      "Public IP Request ID",
      "Application",
      "Public IP",
      "Routable IP",
      "Routable IP Atached With",
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

  const searchFields = useMemo(
    () => [
      { key: "application_name", label: "Application Name" },
      { key: "application_url", label: "Application URL" },
      { key: "routable_ip", label: "Routable IP" },
      { key: "routable_ip_attached_with", label: "Routable IP Attached With" },
      { key: "allocated_public_ip", label: "Public IP" },
      { key: "request_id", label: "Public IP Request ID" },
      { key: "backup_request_id", label: "Backup Request ID" },
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
      { content: item?.backup_request_id },
      { content: item?.request_id },
      { content: item?.application_url },
      { content: item?.allocated_public_ip },
      {
        content: (
          <Stack alignItems="center">
            <Box whiteSpace="nowrap">{item?.routable_ip}</Box>
            <Box>({item?.routable_ip_attached_with})</Box>
          </Stack>
        ),
        align: "center",
      },
      {
        content: (
          <Stack alignItems="center">
            <Box whiteSpace="nowrap">{item?.public_ip_request?.provider?.provider_name}</Box>
            <Box>({item?.public_ip_request?.provider?.provider_id})</Box>
          </Stack>
        ),
        align: "center",
      },
      { content: item?.public_ip_request?.provider?.provider_location, align: "center" },
      {
        content: (
          <Stack>
            <Box component="span">{item?.public_ip_request?.project?.organisation?.name}</Box>
            <Box component="span">({item?.public_ip_request?.project?.organisation?.org_id})</Box>
          </Stack>
        ),
        align: "center",
      },
      { content: item?.public_ip_request?.project?.organisation?.org_reg_code, align: "center" },
      {
        content: (
          <Stack>
            <Box component="span">{item?.public_ip_request?.project?.name}</Box>
            <Box component="span">({item?.public_ip_request?.project?.project_id})</Box>
          </Stack>
        ),
        align: "center",
      },
      {
        content: <StatusChip label={getStatusLabel(item)} />,
        align: "center",
      },
      { content: formatDate(item?.created), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.backup_request_id,
      item?.request_id,
      item?.application_url,
      item?.allocated_public_ip,
      item?.routable_ip,
      item?.routable_ip_attached_with,
      item?.public_ip_request?.provider?.provider_name,
      item?.public_ip_request?.provider?.provider_id,
      item?.public_ip_request?.provider?.provider_location,
      item?.public_ip_request?.project?.organisation?.name,
      item?.public_ip_request?.project?.organisation?.org_id,
      item?.public_ip_request?.project?.organisation?.org_reg_code,
      item?.public_ip_request?.project?.name,
      item?.public_ip_request?.project?.project_id,
      item?.status?.toUpperCase(),
      formatDate(item?.created, false, true),
    ];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "View Request",
      onClick: (item) => navigate(`${item?.id}/request-details`, { state: { BackupPublicIpUpdateRequestDetail: item } }),
    },
    {
      label: () => "View Owner Details",
      onClick: () => null,
    },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.id], resource_type: ["PublicIP"] } } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => {
      const filtersList = { ...JSON.parse(filters), is_backup_exists: ["yes"] };
      fetchBackupPublicIpUpdate({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters: JSON.stringify(filtersList) });
    },
    [fetchBackupPublicIpUpdate],
  );

  const dataList = useDataList({
    data: backups?.list?.data || [],
    totalRecords: backups?.totalRecords,
    columns,
    exportFilename: "Backup Public IP Update Request",
    exportColumns,
    searchFields,
    actions,
    rowCreator,
    exportCreator,
    listExporter: exportBackupPublicIpUpdate,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListBackup;
