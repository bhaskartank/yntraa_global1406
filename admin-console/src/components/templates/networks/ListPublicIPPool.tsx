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

interface ListPublicIPPoolProps {
  fetchPublicIPs: any;
  exportPublicIPs: any;
  deletePublicIP: any;
}

const ListPublicIPPool: FC<ListPublicIPPoolProps> = ({ fetchPublicIPs, exportPublicIPs, deletePublicIP }) => {
  const rootState = useSelector((state: any) => state);
  const publicIPs = networksRedux.getters.publicIPs(rootState);
  const navigate = useNavigate();

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Public IP", sortKey: "public_ip" },
      {
        label: "Provider",
        align: "center",
        filterKey: "provider_id",
        filters: publicIPs?.list?.filter_values?.provider?.map((item) => ({ label: `${item?.provider_name} (${item?.provider_id})`, value: item?.id })),
      },
      { label: "Provider Location", align: "center", filterKey: "provider_location", filters: publicIPs?.list?.filter_values?.provider_location },
      {
        label: "Allocated",
        align: "center",
        sortKey: "is_allocated",
        filterKey: "is_allocated",
        filters: publicIPs?.list?.filter_values?.is_allocated?.map((item) => ({ label: String(item?.label), value: item?.value })),
      },
      {
        label: "Available",
        align: "center",
        sortKey: "is_available",
        filterKey: "is_available",
        filters: publicIPs?.list?.filter_values?.is_available?.map((item) => ({ label: String(item?.label), value: item?.value })),
      },
      {
        label: "Traffic Direction",
        align: "center",
        sortKey: "traffic_direction",
        filterKey: "traffic_direction",
        filters: publicIPs?.list?.filter_values?.traffic_direction,
      },
      { label: "Created", align: "center", sortKey: "created", defaultSort: "desc" },
    ],
    [publicIPs?.list?.filter_values],
  );

  const exportColumns: string[] = useMemo(() => ["Floating IP", "Provider Name", "Provider ID", "Provider Location", "Allocated", "Available", "Created"], []);

  const searchFields = useMemo(
    () => [
      { key: "public_ip", label: "Public IP" },
      { key: "traffic_direction", label: "Traffic Direction" },
      { key: "provider_location", label: "Provider Location" },
      { key: "provider_code", label: "Provider Code" },
    ],
    [],
  );

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.public_ip },
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
      { content: item?.is_allocated !== null ? <StatusChip label={item?.is_allocated} /> : null, align: "center" },
      { content: item?.is_available !== null ? <StatusChip label={item?.is_available} /> : null, align: "center" },
      { content: item?.traffic_direction !== null ? <StatusChip label={item?.traffic_direction} /> : null, align: "center" },
      { content: formatDate(item?.created), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.public_ip,
      item?.provider?.provider_name,
      item?.provider?.provider_id,
      item?.provider?.provider_location,
      item?.is_allocated,
      item?.is_available,
      item?.traffic_direction,
      formatDate(item?.created, false, true),
    ];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "Update Public IP",
      onClick: (item) => navigate(`${item?.id}/update`, { state: { publicIPs: item } }),
    },
    {
      label: () => "Delete Public IP",
      confirmation: () => ({
        title: "Delete Public IP",
        description: "Are you sure you want to delete Public IP?",
      }),
      onClick: (item) => deletePublicIP(item),
    },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.id], resource_type: ["PublicIP"] } } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchPublicIPs({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchPublicIPs],
  );

  const dataList = useDataList({
    data: publicIPs?.list?.data || [],
    totalRecords: publicIPs?.totalRecords,
    columns,
    actions,
    exportFilename: "Public IPs List",
    exportColumns,
    searchFields,
    createResourceButton: { text: "Import Pool", onClick: () => navigate("import") },
    deleteResourceButton: () => ({ text: "Delete Pool", onClick: () => navigate("delete-pool") }),
    rowCreator,
    exportCreator,
    listExporter: exportPublicIPs,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListPublicIPPool;
