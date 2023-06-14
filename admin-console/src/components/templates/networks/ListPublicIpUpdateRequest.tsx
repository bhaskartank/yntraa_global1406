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
  fetchPublicIpUpdate: any;
  exportPublicIpUpdate: any;
  fetchPublicIpUpdateOwnerDetail: any;
}

const ListPublicIpUpdateRequests: FC<ListPublicIpProps> = ({ fetchPublicIpUpdate, exportPublicIpUpdate, fetchPublicIpUpdateOwnerDetail }) => {
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const publicIps = networkRedux.getters.publicIPUpdateRequest(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Application Name", align: "center" },
      { label: "Application URL", align: "center" },
      { label: "Request ID" },
      //   { label: "Public IP", align: "center" },
      { label: "Routable IP", align: "center", defaultHidden: true, filterKey: "routable_ip", filters: publicIps?.list?.filter_values?.routable_ip },
      {
        label: "Provider",
        align: "center",
        filterKey: "provider_id",
        filters: publicIps?.list?.filter_values?.provider?.map((item) => ({ label: `${item?.provider_name} (${item?.provider_id})`, value: item?.id })),
      },
      { label: "Provider Location", align: "center", filterKey: "provider_location", filters: publicIps?.list?.filter_values?.provider_location, defaultHidden: true },
      {
        label: "Organisation",
        align: "center",
        filterKey: "organisation_id",
        filters: publicIps?.list?.filter_values?.organisation?.map((item) => ({ label: `${item?.name} (${item?.org_id})`, value: item?.id })),
        defaultHidden: true,
      },
      {
        label: "Cloud Reg. A/C No",
        align: "center",
        filterKey: "organisation_org_reg_code",
        filters: publicIps?.list?.filter_values?.organisation?.map((item) => ({ label: item?.org_reg_code, value: item?.org_reg_code })),
      },
      {
        label: "Project",
        align: "center",
        filterKey: "project_id",
        filters: publicIps?.list?.filter_values?.project?.map((item) => ({ label: `${item?.name} (${item?.project_id})`, value: item?.id })),
        defaultHidden: true,
      },
      { label: "Remarks", align: "center", defaultHidden: true },
      { label: "Status", align: "center", sortKey: "status", filterKey: "status", filters: publicIps?.list?.filter_values?.status },
      { label: "Requested On", align: "center", sortKey: "created", defaultSort: "desc" },
    ],
    [publicIps?.list?.filter_values],
  );

  const exportColumns: string[] = useMemo(
    () => [
      "Application Name",
      "Application URL",
      "Request ID",
      "Public IP",
      "Routable IP",
      "Routable IP Attached With",
      "Provider Name",
      "Provider ID",
      "Provider Location",
      "Organisation",
      "Organisation ID",
      "Cloud Reg. A/C No",
      "Project Name",
      "Project ID",
      "Remarks",
      "Status",
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
      { content: item?.application_name, align: "center" },
      { content: item?.application_url, align: "center" },
      { content: item?.request_id },
      //   { content: item?.public_ip, align: "center" },
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
      { content: item?.remarks, align: "center" },
      { content: item?.status ? <StatusChip label={item?.status} /> : null, align: "center" },
      { content: formatDate(item?.created), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.application_name,
      item?.application_url,
      item?.request_id,
      item?.public_ip,
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
      item?.remarks,
      item?.status?.toUpperCase(),
      formatDate(item?.created, false, true),
    ];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "View Request",
      onClick: (item) => navigate(`${item?.id}/request-details`, { state: { publicIpUpdateRequestDetail: item } }),
    },
    {
      label: () => "View Owner Details",
      onClick: (item) => fetchPublicIpUpdateOwnerDetail(item),
    },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.id], resource_type: ["PublicIPChangeRequest"] } } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchPublicIpUpdate({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchPublicIpUpdate],
  );

  const dataList = useDataList({
    data: publicIps?.list?.data || [],
    totalRecords: publicIps?.totalRecords,
    columns,
    exportFilename: "Public IP Update Requests List",
    exportColumns,
    searchFields,
    actions,
    rowCreator,
    exportCreator,
    listExporter: exportPublicIpUpdate,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListPublicIpUpdateRequests;
