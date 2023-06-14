import { Box, Chip, Stack } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import loadBalancersRedux from "store/modules/loadBalancers";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListLoadBalancerProps {
  fetchLoadBalancers: any;
  exportLoadBalancers: any;
  fetchLoadBalancerOwnerDetail: any;
  fetchAppliedLBConfig: any;
  fetchLBLogs: any;
  fetchLBConfigTemplate: any;
  defaultFilters: any;
  markLbAsError: any;
  fetchVmDetailByLbBackend: any;
}

const ListLoadBalancers: FC<ListLoadBalancerProps> = ({
  fetchLoadBalancers,
  exportLoadBalancers,
  fetchLoadBalancerOwnerDetail,
  fetchAppliedLBConfig,
  fetchLBLogs,
  fetchLBConfigTemplate,
  defaultFilters,
  markLbAsError,
  fetchVmDetailByLbBackend,
}) => {
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const loadBalancers = loadBalancersRedux.getters.loadBalancers(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Name", sortKey: "name" },
      {
        label: "Provider",
        align: "center",
        filterKey: "provider_id",
        filters: loadBalancers?.list?.filter_values?.provider?.map((item) => ({ label: `${item?.provider_name} (${item?.provider_id})`, value: item?.id })),
      },
      { label: "Provider Location", align: "center", filterKey: "provider_location", filters: loadBalancers?.list?.filter_values?.provider_location },
      { label: "LB Device IP", align: "center", sortKey: "lb_device_ip", filterKey: "lb_device_ip", filters: loadBalancers?.list?.filter_values?.lb_device_ip },
      { label: "LB Backend", align: "center" },
      { label: "LB Type", align: "center", sortKey: "lb_type", filterKey: "lb_type", filters: loadBalancers?.list?.filter_values?.lb_type },
      { label: "LB Version", align: "center", sortKey: "version_type", filterKey: "version_type", filters: loadBalancers?.list?.filter_values?.version_type },
      {
        label: "Organisation",
        align: "center",
        filterKey: "organisation_id",
        filters: loadBalancers?.list?.filter_values?.organisation?.map((item) => ({ label: `${item?.name} (${item?.org_id})`, value: item?.id })),
      },
      {
        label: "Cloud Reg. A/C No.",
        align: "center",
        filterKey: "organisation_org_reg_code",
        filters: loadBalancers?.list?.filter_values?.organisation?.map((item) => ({ label: item?.org_reg_code, value: item?.org_reg_code })),
      },
      {
        label: "Project",
        align: "center",
        filterKey: "project_id",
        filters: loadBalancers?.list?.filter_values?.project?.map((item) => ({ label: `${item?.name} (${item?.project_id})`, value: item?.id })),
      },
      { label: "Status", align: "center", sortKey: "status", filterKey: "status", filters: loadBalancers?.list?.filter_values?.status },
      { label: "Created", align: "center", sortKey: "created", defaultSort: "desc" },
    ],
    [loadBalancers?.list?.filter_values],
  );

  const exportColumns: string[] = useMemo(
    () => [
      "Name",
      "Provider Name",
      "Provider ID",
      "Provider Location",
      "LB Device IP",
      "LB Backend",
      "LB Type",
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
      { key: "name", label: "LB Name" },
      { key: "lb_device_id", label: "LB Device ID" },
      { key: "lb_device_ip", label: "LB Device IP" },
      { key: "stack_id", label: "Stack ID" },
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
      { content: item?.name },
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
      { content: item?.lb_device_ip, align: "center" },
      {
        content: (
          <Stack direction="column" spacing={1}>
            {item?.load_balancer_server_farm?.map((backend) => {
              return backend?.lb_server_farm_compute_mapping_lb_farm.map((farm) => {
                return (
                  <Chip
                    key={farm.id}
                    label={`${farm?.compute_ip}:${farm?.port}`}
                    onClick={() => {
                      fetchVmDetailByLbBackend({ id: farm.compute_id, provider_id: item.provider_id });
                    }}
                  />
                  // <Typography
                  //   variant="body2"
                  //   key={farm?.id}
                  //   sx={{
                  //     cursor: "pointer",
                  //     ":hover": {
                  //       color: "primary.light",
                  //     },
                  //   }}
                  //   onClick={() => {
                  //     fetchVmDetailByLbBackend({ id: farm.compute_id, provider_id: item.provider_id });
                  //   }}>
                  //   {farm?.compute_ip}:{farm?.port}
                  // </Typography>
                );
              });
            })}
          </Stack>
        ),
        align: "center",
      },
      { content: item?.lb_type, align: "center" },
      { content: item?.version_type, align: "center" },
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
      item?.name,
      item?.provider?.provider_name,
      item?.provider?.provider_id,
      item?.provider?.provider_location,
      item?.lb_device_ip,
      item?.item?.load_balancer_server_farm?.map((backend) => backend?.backend_list)?.join(", "),
      item?.lb_type,
      item?.version_type,
      item?.project?.organisation?.name,
      item?.project?.organisation?.org_id,
      item?.project?.organisation?.org_reg_code,
      item?.project?.name,
      item?.project?.project_id,
      item?.action?.toUpperCase(),
      item?.status?.toUpperCase(),
      formatDate(item?.created, false, true),
    ];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "View Details",
      onClick: (item) => navigate(`${item?.id}/view-details`, { state: { listLbDetail: item } }),
    },
    {
      label: () => "Fetch Applied LB Config",
      onClick: (item) => fetchAppliedLBConfig(item),
    },
    {
      label: () => "View SSL Request",
      onClick: (item) => navigate("/load-balancers/ssl-request", { state: { defaultFilters: { load_balancer_id: [item?.id] } } }),
    },
    {
      label: () => "Mark LB as Error",
      onClick: (item) => markLbAsError(item),
      confirmation: () => ({
        title: "Mark Lb As Error",
        description: "Are you sure you want to mark this lb as Error?",
      }),
    },
    // {
    //   label: () => "Approve Request",
    //   onClick: (item) => approveRequest(item),
    //   confirmation: () => ({
    //     title: "Approve Request",
    //     description: "Are you sure you want to approve this request?",
    //   }),
    //   hidden: (item) => item?.status?.toLowerCase() !== "pending",
    // },
    {
      label: () => "Get LB Logs",
      onClick: (item) => fetchLBLogs(item),
    },
    {
      label: () => "Get LB Config Template",
      onClick: (item) => fetchLBConfigTemplate(item),
    },
    {
      label: () => "View Owner Details",
      onClick: (item) => fetchLoadBalancerOwnerDetail(item),
    },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.id], resource_type: ["LoadBalancer"] } } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchLoadBalancers({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchLoadBalancers],
  );

  const dataList = useDataList({
    data: loadBalancers?.list?.data || [],
    totalRecords: loadBalancers?.totalRecords,
    columns,
    actions,
    exportFilename: "Load Balancers List",
    exportColumns,
    searchFields,
    defaultFilters,
    rowCreator,
    exportCreator,
    listExporter: exportLoadBalancers,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListLoadBalancers;
