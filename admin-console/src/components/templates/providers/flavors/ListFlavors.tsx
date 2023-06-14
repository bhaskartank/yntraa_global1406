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

interface ListFlavorProps {
  fetchFlavors: any;
  exportFlavors: any;
  defaultFilters: any;
}

const ListFlavors: FC<ListFlavorProps> = ({ fetchFlavors, exportFlavors, defaultFilters }) => {
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const flavors = providersRedux.getters.flavors(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Name", sortKey: "name", filterKey: "name", filters: flavors?.list?.filter_values?.name },
      {
        label: "Provider",
        align: "center",
        filterKey: "provider_id",
        filters: flavors?.list?.filter_values?.provider?.map((item) => ({ label: `${item?.provider_name} (${item?.provider_id})`, value: item?.id })),
      },
      { label: "Provider Location", align: "center", filterKey: "provider_location", filters: flavors?.list?.filter_values?.provider_location },
      { label: "RAM", align: "center", sortKey: "ram", filterKey: "ram", filters: flavors?.list?.filter_values?.ram },
      { label: "Disk", align: "center", sortKey: "disk", filterKey: "disk", filters: flavors?.list?.filter_values?.disk },
      { label: "VCPUs", align: "center", sortKey: "vcpus", filterKey: "vcpus", filters: flavors?.list?.filter_values?.vcpus },
      { label: "Cost", align: "center", sortKey: "cost" },
      { label: "Weight", align: "center", sortKey: "weight" },
      {
        label: "Public",
        align: "center",
        sortKey: "public",
        filterKey: "public",
        filters: flavors?.list?.filter_values?.public?.map((item) => ({ label: String(item?.label), value: item?.value })),
      },
      {
        label: "Active",
        align: "center",
        sortKey: "is_active",
        filterKey: "is_active",
        filters: flavors?.list?.filter_values?.is_active?.map((item) => ({ label: String(item?.label), value: item?.value })),
      },
      { label: "Created", align: "center", sortKey: "created", defaultSort: "desc" },
    ],
    [flavors?.list?.filter_values],
  );

  const exportColumns: string[] = useMemo(
    () => ["Name", "Provider Name", "Provider ID", "Provider Location", "RAM", "Disk", "VCPUs", "Cost", "Weight", "Public", "Active", "Created"],
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
      { content: `${parseInt(item?.ram) / 1024} GiB`, align: "center" },
      { content: `${item?.disk} GiB`, align: "center" },
      { content: item?.vcpus, align: "center" },
      { content: item?.cost, align: "center" },
      { content: item?.weight, align: "center" },
      { content: item?.public !== null ? <StatusChip label={item?.public} /> : null, align: "center" },
      { content: item?.is_active !== null ? <StatusChip label={item?.is_active} /> : null, align: "center" },
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
      item?.min_ram,
      item?.min_disk,
      item?.vcpus,
      item?.cost,
      item?.weight,
      item?.public,
      item?.is_active,
      formatDate(item?.created, false, true),
    ];
  }, []);

  const searchFields = useMemo(
    () => [
      { key: "name", label: "Name" },
      { key: "ram", label: "RAM" },
      { key: "vcpus", label: "vCPUs" },
      { key: "disk", label: "Disk" },
      { key: "weight", label: "Weight" },
      { key: "cost", label: "Cost" },
      { key: "provider_location", label: "Provider Location" },
    ],
    [],
  );

  const actions: ActionProps[] = [
    {
      label: () => "Edit Flavor Details",
      onClick: (item) => navigate(`${item?.id}/update`, { state: { flavor: item } }),
    },
    {
      label: () => "Map Flavor to Organisation",
      onClick: (item) => navigate(`${item?.id}/map-organisation`, { state: { flavor: item } }),
    },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.id], resource_type: ["Flavor"] } } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchFlavors({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchFlavors],
  );

  const dataList = useDataList({
    data: flavors?.list?.data || [],
    totalRecords: flavors?.totalRecords,
    columns,
    actions,
    exportFilename: "Flavors List",
    exportColumns,
    searchFields,
    defaultFilters,
    createResourceButton: { text: "Create Flavor", onClick: () => navigate("create") },
    rowCreator,
    exportCreator,
    listExporter: exportFlavors,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListFlavors;
