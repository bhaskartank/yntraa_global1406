import { Box, Stack } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import networksRedux from "store/modules/networks";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListNetworkProps {
  fetchNetworks: any;
  exportNetworks: any;
  fetchNetworkOwnerDetail: any;
}

const ListNetworks: FC<ListNetworkProps> = ({ fetchNetworks, exportNetworks, fetchNetworkOwnerDetail }) => {
  const rootState = useSelector((state: any) => state);
  const networks = networksRedux.getters.networks(rootState);
  const navigate = useNavigate();

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Network", sortKey: "network_name" },
      { label: "Subnet", align: "center" },
      {
        label: "Cloud Reg. A/C No.",
        align: "center",
        filterKey: "organisation_org_reg_code",
        filters: networks?.list?.filter_values?.organisation?.map((item) => ({ label: item?.org_reg_code, value: item?.org_reg_code })),
      },
      {
        label: "Organisation",
        align: "center",
        filterKey: "organisation_id",
        filters: networks?.list?.filter_values?.organisation?.map((item) => ({ label: `${item?.name} (${item?.org_id})`, value: item?.id })),
        defaultHidden: true,
      },
      {
        label: "Project",
        align: "center",
        filterKey: "project_id",
        filters: networks?.list?.filter_values?.project?.map((item) => ({ label: `${item?.name} (${item?.project_id})`, value: item?.id })),
      },
      {
        label: "Provider",
        align: "center",
        filterKey: "provider_id",
        filters: networks?.list?.filter_values?.provider?.map((item) => ({ label: `${item?.provider_name} (${item?.provider_id})`, value: item?.id })),
      },
      { label: "Provider Location", align: "center", filterKey: "provider_location", filters: networks?.list?.filter_values?.provider_location, defaultHidden: true },
      {
        label: "Type",
        align: "center",
        filterKey: "external",
        filters: networks?.list?.filter_values?.external?.map((item) => ({ label: item?.label?.toString(), value: item?.value?.toString() })),
      },
      { label: "Managed By", align: "center", sortKey: "managed_by", filterKey: "managed_by", filters: networks?.list?.filter_values?.managed_by },
      { label: "Status", align: "center", sortKey: "status", filterKey: "status", filters: networks?.list?.filter_values?.status },
      { label: "Created", align: "center", sortKey: "created", defaultSort: "desc" },
    ],
    [networks?.list?.filter_values],
  );

  const exportColumns: string[] = useMemo(
    () => [
      "Network",
      "Subnet",
      "Cloud Reg. A/C No.",
      "Organisation Name",
      "Organisation ID",
      "Project Name",
      "Project ID",
      "Provider Name",
      "Provider ID",
      "Provider Location",
      "Type",
      "Managed By",
      "Status",
      "Created",
    ],
    [],
  );

  const searchFields = useMemo(
    () => [
      { key: "network_name", label: "Network Name" },
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
      { content: item?.network_name },
      {
        content: item?.subnet_network?.length ? (
          <Stack spacing={1}>
            {item?.subnet_network?.map((subnet) => (
              <Stack key={subnet?.id} alignItems="center">
                <Box component="span">{subnet?.subnet_name}</Box>
                <Box component="span">({subnet?.network_address})</Box>
              </Stack>
            ))}
          </Stack>
        ) : null,
        align: "center",
      },
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
      { content: item?.external !== null ? <StatusChip label={item?.external ? "External" : "Internal"} /> : null, align: "center" },
      { content: item?.managed_by !== null ? <StatusChip label={item?.managed_by} /> : null, align: "center" },
      { content: item?.status ? <StatusChip label={item?.status} /> : null, align: "center" },
      { content: formatDate(item?.created), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.network_name,
      item?.subnet_network?.length ? item?.subnet_network?.map((subnet) => `${subnet?.subnet_name} (${subnet?.network_address})`)?.join(", ") : null,
      item?.project?.organisation?.org_reg_code,
      item?.project?.organisation?.name,
      item?.project?.organisation?.org_id,
      item?.project?.name,
      item?.project?.project_id,
      item?.provider?.provider_name,
      item?.provider?.provider_id,
      item?.provider?.provider_location,
      item?.external ? "External" : "Internal",
      item?.managed_by?.toUpperCase(),
      item?.status?.toUpperCase(),
      formatDate(item?.created, false, true),
    ];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.id], resource_type: ["Network"] } } }),
    },
    {
      label: () => "Network Owner Details",
      onClick: (item) => fetchNetworkOwnerDetail(item),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchNetworks({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchNetworks],
  );

  const dataList = useDataList({
    data: networks?.list?.data || [],
    totalRecords: networks?.totalRecords,
    columns,
    actions,
    exportFilename: "Networks List",
    exportColumns,
    searchFields,
    rowCreator,
    exportCreator,
    listExporter: exportNetworks,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListNetworks;
