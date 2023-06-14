import { Box, Stack } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import loadBalancersRedux from "store/modules/loadBalancers";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListSSLRequestProps {
  fetchSSLRequests: any;
  exportSSLRequests: any;
  fetchSSLRequestOwnerDetail: any;
  fetchSslRequestViewCertificateDetail: any;
  defaultFilters: any;
  fetchSslViewLbDetail?: any;
}

const ListSSLRequests: FC<ListSSLRequestProps> = ({ fetchSSLRequests, exportSSLRequests, fetchSSLRequestOwnerDetail, fetchSslRequestViewCertificateDetail, defaultFilters }) => {
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const sslRequests = loadBalancersRedux.getters.sslRequests(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Request ID", sortKey: "request_id" },
      { label: "LB Name", filterKey: "load_balancer_id", filters: sslRequests?.list?.filter_values?.load_balancer?.map((item) => ({ label: item?.name, value: item?.id })) },
      {
        label: "Provider",
        align: "center",
        filterKey: "provider_id",
        filters: sslRequests?.list?.filter_values?.provider?.map((item) => ({ label: `${item?.provider_name} (${item?.provider_id})`, value: item?.id })),
      },
      { label: "Provider Location", align: "center", filterKey: "provider_location", filters: sslRequests?.list?.filter_values?.provider_location },
      { label: "Provisioning Type", align: "center", sortKey: "provisioning_type", filterKey: "provisioning_type", filters: sslRequests?.list?.filter_values?.provisioning_type },
      { label: "LB Version", align: "center", filterKey: "load_balancer_version_type", filters: sslRequests?.list?.filter_values?.load_balancer_version_type },
      {
        label: "Organisation",
        align: "center",
        filterKey: "organisation_id",
        filters: sslRequests?.list?.filter_values?.organisation?.map((item) => ({ label: `${item?.name} (${item?.org_id})`, value: item?.id })),
      },
      {
        label: "Cloud Reg. A/C No.",
        align: "center",
        filterKey: "organisation_org_reg_code",
        filters: sslRequests?.list?.filter_values?.organisation?.map((item) => ({ label: item?.org_reg_code, value: item?.org_reg_code })),
      },
      {
        label: "Project",
        align: "center",
        filterKey: "project_id",
        filters: sslRequests?.list?.filter_values?.project?.map((item) => ({ label: `${item?.name} (${item?.project_id})`, value: item?.id })),
      },
      { label: "Status", align: "center", sortKey: "status", filterKey: "status", filters: sslRequests?.list?.filter_values?.status },
      { label: "Created", align: "center", sortKey: "created", defaultSort: "desc" },
    ],
    [sslRequests?.list?.filter_values],
  );

  const exportColumns: string[] = useMemo(
    () => [
      "Request ID",
      "LB Name",
      "Provider Name",
      "Provider ID",
      "Provider Location",
      "Provisioning Type",
      "LB Version",
      "Organisation",
      "Organisation ID",
      "Cloud Reg. A/C No.",
      "Project Name",
      "Project ID",
      "Status",
      "Created",
    ],
    [],
  );

  const searchFields = useMemo(
    () => [
      { key: "request_id", label: "Request ID" },
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
      { content: item?.request_id },
      { content: item?.load_balancer?.name },
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
        content: item?.provisioning_type !== null ? <StatusChip label={item?.provisioning_type} color={item?.provisioning_type === "automatic" ? "success" : "info"} /> : null,
        align: "center",
      },
      { content: item?.load_balancer?.version_type, align: "center" },
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
      item?.request_id,
      item?.load_balancer?.name,
      item?.provider?.provider_name,
      item?.provider?.provider_id,
      item?.provider?.provider_location,
      item?.provisioning_type,
      item?.load_balancer?.version_type,
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
      label: () => "View Request",
      onClick: (item) => navigate(`${item?.id}/request-details`, { state: { sslRequestDetail: item } }),
    },
    {
      label: () => "View LB Details",
      onClick: (item) => navigate("/load-balancers", { state: { defaultFilters: { id: [item?.load_balancer?.id] } } }),
    },
    {
      label: () => "View Certificates",
      onClick: (item) => fetchSslRequestViewCertificateDetail(item),
    },
    {
      label: () => "View Owner Details",
      onClick: (item) => fetchSSLRequestOwnerDetail(item),
    },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.id], resource_type: ["SSLConfigureRequest"] } } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchSSLRequests({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchSSLRequests],
  );

  const dataList = useDataList({
    data: sslRequests?.list?.data || [],
    totalRecords: sslRequests?.totalRecords,
    columns,
    actions,
    exportFilename: "SSL Requests List",
    exportColumns,
    searchFields,
    rowCreator,
    exportCreator,
    listExporter: exportSSLRequests,
    reload,
    defaultFilters,
  });

  return <DataList dataList={dataList} />;
};

export default ListSSLRequests;
