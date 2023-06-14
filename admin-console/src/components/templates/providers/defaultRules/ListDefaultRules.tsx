import { Box, Stack } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import providersRedux from "store/modules/providers";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListDefaultRuleProps {
  fetchDefaultRules: any;
  exportDefaultRules: any;
  deleteDefaultRule: (payload: any) => void;
  defaultFilters: any;
}

const ListDefaultRules: FC<ListDefaultRuleProps> = ({ fetchDefaultRules, exportDefaultRules, deleteDefaultRule, defaultFilters }) => {
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const defaultRules = providersRedux.getters.defaultRules(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Direction", sortKey: "direction", filterKey: "direction", filters: defaultRules?.list?.filter_values?.direction },
      {
        label: "Provider",
        align: "center",
        filterKey: "provider_id",
        filters: defaultRules?.list?.filter_values?.provider?.map((item) => ({ label: `${item?.provider_name} (${item?.provider_id})`, value: item?.id })),
      },
      { label: "Provider Location", align: "center", filterKey: "provider_location", filters: defaultRules?.list?.filter_values?.provider_location },
      { label: "Managed By", align: "center", sortKey: "managed_by", filterKey: "managed_by", filters: defaultRules?.list?.filter_values?.managed_by },
      { label: "Ether Type", align: "center", sortKey: "ethertype", filterKey: "ethertype", filters: defaultRules?.list?.filter_values?.ethertype },
      { label: "Remote IP Prefix", align: "center", sortKey: "remote_ip_prefix" },
      { label: "Protocol", align: "center", sortKey: "protocol", filterKey: "protocol", filters: defaultRules?.list?.filter_values?.protocol },
      { label: "Resource Type", align: "center", sortKey: "resource_type", filterKey: "resource_type", filters: defaultRules?.list?.filter_values?.resource_type },
      { label: "Port Range Min", align: "center", sortKey: "port_range_min", filterKey: "port_range_min", filters: defaultRules?.list?.filter_values?.port_range_min },
      { label: "Port Range Max", align: "center", sortKey: "port_range_max", filterKey: "port_range_max", filters: defaultRules?.list?.filter_values?.port_range_max },
      {
        label: "Active",
        align: "center",
        sortKey: "is_active",
        filterKey: "is_active",
        filters: defaultRules?.list?.filter_values?.is_active?.map((item) => ({ label: item?.label?.toString(), value: item?.value })),
      },
      { label: "Status", align: "center", sortKey: "status", filterKey: "status", filters: defaultRules?.list?.filter_values?.status },
      { label: "Created", align: "center", sortKey: "created", defaultSort: "desc" },
    ],
    [defaultRules?.list?.filter_values],
  );

  const exportColumns: string[] = useMemo(
    () => [
      "Direction",
      "Provider Name",
      "Provider ID",
      "Provider Location",
      "Managed By",
      "Ether Type",
      "Remote IP Prefix",
      "Protocol",
      "Resource Type",
      "Port Range Min",
      "Port Range Max",
      "Active",
      "Status",
      "Created",
    ],
    [],
  );

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.direction },
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
      { content: item?.managed_by, align: "center" },
      { content: item?.ethertype, align: "center" },
      { content: item?.remote_ip_prefix, align: "center" },
      { content: item?.protocol?.toUpperCase(), align: "center" },
      { content: item?.resource_type, align: "center" },
      { content: item?.port_range_min, align: "center" },
      { content: item?.port_range_max, align: "center" },
      { content: item?.is_active !== null ? <StatusChip label={item?.is_active} /> : null, align: "center" },
      { content: item?.status ? <StatusChip label={item?.status} /> : null, align: "center" },
      { content: formatDate(item?.created), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.direction,
      item?.provider?.provider_name,
      item?.provider?.provider_id,
      item?.provider?.provider_location,
      item?.managed_by,
      item?.ethertype,
      item?.remote_ip_prefix,
      item?.protocol?.toUpperCase(),
      item?.resource_type,
      item?.port_range_min,
      item?.port_range_max,
      item?.is_active,
      item?.status,
      formatDate(item?.created, false, true),
    ];
  }, []);

  const searchFields = useMemo(
    () => [
      { key: "direction", label: "Direction" },
      { key: "description", label: "Description" },
      { key: "ethertype", label: "Ether Type" },
      { key: "remote_ip_prefix", label: "Remote IP Prefix" },
      { key: "protocol", label: "Protocol" },
      { key: "resource_type", label: "Resource Type" },
      { key: "port_range_min", label: "Port Range Min" },
      { key: "port_range_max", label: "Port Range Max" },
      { key: "provider_location", label: "Provider Location" },
    ],
    [],
  );

  const actions: ActionProps[] = [
    {
      label: () => "Apply Rule",
      onClick: (item) => navigate(`${item?.id}/apply-rule`, { state: { defaultRule: item } }),
      hidden: (item) => item?.status?.toLowerCase() === "deleted",
    },
    {
      label: () => "Map Projects",
      onClick: (item) => navigate(`${item?.id}/map-project`, { state: { defaultRule: item } }),
      hidden: (item) => item?.status?.toLowerCase() === "deleted",
    },
    {
      label: () => "Delete Rule",
      confirmation: (item) => ({
        title: "Delete Rule",
        resourceDetails: item?.instance_name,
        description: "Are you sure you want to delete the default Rule?",
      }),
      onClick: (item) => deleteDefaultRule(item),
      color: "error.main",
      hidden: (item) => item?.status?.toLowerCase() === "deleted",
    },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.id], resource_type: ["DefaultRule"] } } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchDefaultRules({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchDefaultRules],
  );

  const dataList = useDataList({
    data: defaultRules?.list?.data || [],
    totalRecords: defaultRules?.totalRecords,
    columns,
    actions,
    exportFilename: "Default Rules List",
    exportColumns,
    searchFields,
    createResourceButton: { text: "Create Rule", onClick: () => navigate("create") },
    defaultFilters,
    rowCreator,
    exportCreator,
    listExporter: exportDefaultRules,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListDefaultRules;
