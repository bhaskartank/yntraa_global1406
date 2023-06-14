import { Box, Stack } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import ResourceName from "components/atoms/ResourceName";
import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListRouterProps {
  routers: any;
  fetchRouters: any;
  exportRouters: any;
  fetchRouterOwnerDetail: any;
}

const ListRouters: FC<ListRouterProps> = ({ routers, fetchRouters, exportRouters, fetchRouterOwnerDetail }) => {
  // const rootState = useSelector((state: any) => state);
  // const routers = networksRedux.getters.routers(rootState);
  const navigate = useNavigate();

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Router Name", sortKey: "router_name" },
      { label: "SNAT IP", align: "center", sortKey: "snat_ip" },
      {
        label: "Cloud Reg. A/C No.",
        align: "center",
        filterKey: "organisation_org_reg_code",
        filters: routers?.list?.filter_values?.organisation?.map((item) => ({ label: item?.org_reg_code, value: item?.org_reg_code })),
      },
      {
        label: "Organisation",
        align: "center",
        filterKey: "organisation_id",
        filters: routers?.list?.filter_values?.organisation?.map((item) => ({ label: `${item?.name} (${item?.org_id})`, value: item?.id })),
      },
      {
        label: "Project",
        align: "center",
        filterKey: "project_id",
        filters: routers?.list?.filter_values?.project?.map((item) => ({ label: `${item?.name} (${item?.project_id})`, value: item?.id })),
      },
      {
        label: "Provider",
        align: "center",
        filterKey: "provider_id",
        filters: routers?.list?.filter_values?.provider?.map((item) => ({ label: `${item?.provider_name} (${item?.provider_id})`, value: item?.id })),
      },
      { label: "Provider Location", align: "center", filterKey: "provider_location", filters: routers?.list?.filter_values?.provider_location, defaultHidden: true },
      { label: "Managed By", sortKey: "managed_by", filterKey: "managed_by", filters: routers?.list?.filter_values?.managed_by },
      { label: "Created On", align: "center", sortKey: "created", defaultSort: "desc" },
    ],
    [routers?.list?.filter_values],
  );

  const exportColumns: string[] = useMemo(
    () => [
      "Router Name",
      "SNAT IP",
      "Cloud Reg. A/C No.",
      "Organisation Name",
      "Organisation ID",
      "Project Name",
      "Project ID",
      "Provider Name",
      "Provider ID",
      "Provider Location",
      "Managed By",
      "Created On",
    ],
    [],
  );

  const searchFields = useMemo(
    () => [
      { key: "router_name", label: "Router Name" },
      { key: "organisation_org_reg_code", label: "Cloud Reg. A/C No." },
      { key: "organisation_org_id", label: "Organisation Code" },
      { key: "organisation_name", label: "Organisation Name" },
      { key: "provider_code", label: "Provider Code" },
      { key: "provider_location", label: "Provider Location" },
      { key: "project_project_id", label: "Project Code" },
      { key: "project_name", label: "Project Name" },
    ],
    [],
  );

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: <ResourceName label={item?.router_name} /> },
      { content: item?.snat_ip, align: "center" },
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
      { content: item?.managed_by !== null ? <StatusChip label={item?.managed_by} /> : null, align: "center" },
      { content: formatDate(item?.created), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.router_name,
      item?.snat_ip,
      item?.project?.organisation?.org_reg_code,
      item?.project?.organisation?.name,
      item?.project?.organisation?.org_id,
      item?.project?.name,
      item?.project?.project_id,
      item?.provider?.provider_name,
      item?.provider?.provider_id,
      item?.provider?.provider_location,
      item?.managed_by,
      formatDate(item?.created, false, true),
    ];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "Network Details",
      onClick: (item) => navigate(`/networks/${item?.id}/network-details`, { state: { routers: item } }),
    },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.id], resource_type: ["Router"] } } }),
    },
    {
      label: () => "Router Owner Details",
      onClick: (item) => fetchRouterOwnerDetail(item),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchRouters({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchRouters],
  );

  const dataList = useDataList({
    data: routers?.list?.data || [],
    totalRecords: routers?.totalRecords,
    columns,
    actions,
    exportFilename: "Routers List",
    exportColumns,
    searchFields,
    rowCreator,
    exportCreator,
    listExporter: exportRouters,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListRouters;
