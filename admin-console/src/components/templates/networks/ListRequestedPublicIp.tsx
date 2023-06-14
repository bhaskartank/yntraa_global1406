import { Box, Stack } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import networkRedux from "store/modules/networks";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListPublicIpProps {
  fetchRequestedPublicIp: any;
  exportRequestedPublicIp: any;
  fetchPublicIpRequestedOwnerDetail: any;
}

const ListPublicIpRequests: FC<ListPublicIpProps> = ({ fetchRequestedPublicIp, exportRequestedPublicIp, fetchPublicIpRequestedOwnerDetail }) => {
  const rootState = useSelector((state: any) => state);
  const publicIps = networkRedux.getters.requestedPublicIPs(rootState);
  const navigate = useNavigate();

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Request ID", align: "center" },
      { label: "Application Name", align: "center", defaultHidden: true },
      { label: "Application URL", align: "center" },
      { label: "Routable IP", align: "center", filterKey: "routable_ip", filters: publicIps?.list?.filter_values?.routable_ip },
      { label: "Public IP", align: "center", defaultHidden: true },
      {
        label: "Cloud Reg. A/C No",
        align: "center",
        filterKey: "organisation_org_reg_code",
        filters: publicIps?.list?.filter_values?.organisation?.map((item) => ({ label: item?.org_reg_code, value: item?.org_reg_code })),
      },
      {
        label: "Organisation",
        align: "center",
        filterKey: "organisation_id",
        filters: publicIps?.list?.filter_values?.organisation?.map((item) => ({ label: `${item?.name} (${item?.org_id})`, value: item?.id })),
        defaultHidden: true,
      },
      {
        label: "Project",
        align: "center",
        filterKey: "project_id",
        filters: publicIps?.list?.filter_values?.project?.map((item) => ({ label: `${item?.name} (${item?.project_id})`, value: item?.id })),
        defaultHidden: true,
      },
      {
        label: "Provider",
        align: "center",
        filterKey: "provider_id",
        filters: publicIps?.list?.filter_values?.provider?.map((item) => ({ label: `${item?.provider_name} (${item?.provider_id})`, value: item?.id })),
      },
      { label: "Provider Location", align: "center", filterKey: "provider_location", filters: publicIps?.list?.filter_values?.provider_location, defaultHidden: true },
      { label: "Status", align: "center", sortKey: "status", filterKey: "status", filters: publicIps?.list?.filter_values?.status },
      { label: "Remarks", align: "center", defaultHidden: true },
      { label: "Requested On", align: "center", sortKey: "created", defaultSort: "desc" },
    ],
    [publicIps?.list?.filter_values],
  );

  const exportColumns: string[] = useMemo(
    () => [
      "Request ID",
      "Application Name",
      "Application URL",
      "Routable IP",
      "Routable IP Attached With",
      "Public IP",
      "Provider Name",
      "Provider ID",
      "Provider Location",
      "Cloud Reg. A/C No",
      "Organisation Name",
      "Organisation ID",
      "Project Name",
      "Project ID",
      "Status",
      "Remarks",
      "Requested On",
    ],
    [],
  );

  const searchFields = useMemo(
    () => [
      { key: "request_id", label: "Request Id" },
      { key: "application_name", label: "Application Name" },
      { key: "application_url", label: "Application URL" },
      { key: "routable_ip", label: "Routable IP" },
      { key: "routable_ip_attached_with", label: "Routable IP Attached With" },
      { key: "allocated_public_ip", label: "Allocated Public IP" },
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
      { content: item?.request_id, align: "center" },
      { content: item?.application_name, align: "center" },
      { content: item?.application_url, align: "center" },
      {
        content: (
          <Stack alignItems="center">
            <Box whiteSpace="nowrap">{item?.routable_ip}</Box>
            <Box>({item?.routable_ip_attached_with})</Box>
          </Stack>
        ),
        align: "center",
      },
      { content: item?.public_ip !== null ? item?.public_ip?.public_ip : "-", align: "center" },
      { content: item?.project?.organisation?.org_reg_code, align: "center" },
      {
        content: (
          <Stack>
            <Box component="span">{item?.project?.organisation?.name}</Box>
            <Box component="span">({item?.project?.organisation?.org_id})</Box>
          </Stack>
        ),
        align: "center",
      },
      {
        content: (
          <Stack>
            <Box component="span">{item?.project?.name}</Box>
            <Box component="span">({item?.project?.project_id})</Box>
          </Stack>
        ),
        align: "center",
      },
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
      { content: item?.status ? <StatusChip label={item?.status} /> : null, align: "center" },
      { content: item?.remarks, align: "center" },
      { content: formatDate(item?.created), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.request_id,
      item?.application_name,
      item?.application_url,
      item?.routable_ip,
      item?.routable_ip_attached_with,
      item?.public_ip !== null ? item?.public_ip?.public_ip : "-",
      item?.project?.organisation?.org_reg_code,
      item?.project?.organisation?.name,
      item?.project?.organisation?.org_id,
      item?.project?.name,
      item?.project?.project_id,
      item?.provider?.provider_name,
      item?.provider?.provider_id,
      item?.provider?.provider_location,
      item?.status?.toUpperCase(),
      item?.remarks,
      formatDate(item?.created, false, true),
    ];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "View Request",
      onClick: (item) => navigate(`${item?.id}/request-details`, { state: { reqPublicIpDetail: item } }),
    },
    {
      label: () => "View Owner Details",
      onClick: (item) => fetchPublicIpRequestedOwnerDetail(item),
    },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.id], resource_type: ["PublicIPRequest"] } } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchRequestedPublicIp({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchRequestedPublicIp],
  );

  const dataList = useDataList({
    data: publicIps?.list?.data || [],
    totalRecords: publicIps?.totalRecords,
    columns,
    exportFilename: "Public IP Requests List",
    exportColumns,
    searchFields,
    actions,
    rowCreator,
    exportCreator,
    listExporter: exportRequestedPublicIp,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListPublicIpRequests;
