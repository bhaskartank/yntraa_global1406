import { Box, Stack } from "@mui/material";
import { FC, useCallback, useMemo } from "react";

import { useSelector } from "store";
import organisationsRedux from "store/modules/organisations";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListFlavorProps {
  fetchFlavors: any;
  exportFlavors: any;
  deleteFlavorOrgMapping: any;
}

const ListFlavors: FC<ListFlavorProps> = ({ fetchFlavors, exportFlavors, deleteFlavorOrgMapping }) => {
  const rootState = useSelector((state: any) => state);
  const flavors = organisationsRedux.getters.organisationFlavors(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Name", sortKey: "name" },
      {
        label: "Provider",
        align: "center",
        filterKey: "provider_id",
        filters: flavors?.list?.filter_values?.provider?.map((item) => ({ label: `${item?.provider_name} (${item?.provider_id})`, value: item?.id })),
      },
      { label: "Provider Location", align: "center", filterKey: "provider_location", filters: flavors?.list?.filter_values?.provider_location },
      { label: "RAM (GiB)", sortKey: "ram" },
      { label: "Disk (GiB)", sortKey: "disk" },
      { label: "VCPUs", sortKey: "vpcus" },
      { label: "Cost", sortKey: "cost" },
      { label: "Weight", sortKey: "weight" },
      { label: "Public", sortKey: "public", align: "center" },
      { label: "Active", sortKey: "is_active", align: "center" },
      { label: "Created", sortKey: "created", defaultSort: "desc" },
    ],
    [flavors],
  );

  const exportColumns: string[] = useMemo(
    () => ["Name", "Provider Name", "Provider ID", "Provider Location", "RAM (GiB)", "Disk (GiB)", "VCPUs", "Cost", "Weight", "Public", "Active", "Created"],
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
      { content: item?.ram },
      { content: item?.disk },
      { content: item?.vcpus },
      { content: item?.cost },
      { content: item?.weight },
      { content: item?.public !== null ? <StatusChip label={item?.public} /> : null, align: "center" },
      { content: item?.is_active !== null ? <StatusChip label={item?.is_active} /> : null, align: "center" },
      { content: formatDate(item?.created) },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.name,
      item?.provider?.provider_name,
      item?.provider?.provider_id,
      item?.provider?.provider_location,
      item?.ram,
      item?.disk,
      item?.vcpus,
      item?.cost,
      item?.weight,
      item?.public,
      item?.is_active,
      formatDate(item?.created, false, true),
    ];
  }, []);

  const searchFields = useMemo(() => [{ key: "name", label: "Name" }], []);

  const actions: ActionProps[] = [
    {
      label: () => "Delete Mapping",
      onClick: (item) => deleteFlavorOrgMapping(item),
      confirmation: () => ({
        title: "Delete Mapping",
        description: "Are you sure you want to Delete Organisation Flavor Mapping ?",
      }),
      color: "error.main",
      hidden: (item) => item?.public === true,
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
    exportFilename: "Flavors List",
    exportColumns,
    searchFields,
    rowCreator,
    exportCreator,
    actions,
    listExporter: exportFlavors,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListFlavors;
