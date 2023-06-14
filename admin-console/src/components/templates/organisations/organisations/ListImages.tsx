import { Box, Stack } from "@mui/material";
import { FC, useCallback, useMemo } from "react";

import { useSelector } from "store";
import organisationsRedux from "store/modules/organisations";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListImageProps {
  fetchImages: any;
  exportImages: any;
  deleteImageOrgMapping: any;
}

const ListImages: FC<ListImageProps> = ({ fetchImages, exportImages, deleteImageOrgMapping }) => {
  const rootState = useSelector((state: any) => state);
  const organisationImages = organisationsRedux.getters.organisationImages(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Name", sortKey: "name" },
      {
        label: "Provider",
        align: "center",
        filterKey: "provider_id",
        filters: organisationImages?.list?.filter_values?.provider?.map((item) => ({ label: `${item?.provider_name} (${item?.provider_id})`, value: item?.id })),
      },
      { label: "Provider Location", align: "center", filterKey: "provider_location", filters: organisationImages?.list?.filter_values?.provider_location },
      { label: "OS", sortKey: "os" },
      { label: "Ram (GiB)", sortKey: "min_ram" },
      { label: "Disk (GiB)", sortKey: "min_disk" },
      { label: "Size (GiB)", sortKey: "size" },
      { label: "Public", sortKey: "is_public", align: "center" },
      { label: "Active", sortKey: "is_active", align: "center" },
      { label: "Created", sortKey: "created", defaultSort: "desc" },
    ],
    [organisationImages],
  );

  const exportColumns: string[] = useMemo(
    () => ["Name", "Provider Name", "Provider ID", "Provider Location", "OS", "Ram (GiB)", "Disk (GiB)", "Size (GiB)", "Public", "Active", "Created"],
    [],
  );

  const searchFields = useMemo(() => [{ key: "name", label: "Name" }], []);

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
      { content: item?.os },
      { content: item?.min_ram },
      { content: item?.min_disk },
      { content: item?.size },
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
      item?.os,
      item?.min_ram,
      item?.min_disk,
      item?.size,
      item?.public,
      item?.is_active,
      formatDate(item?.created, false, true),
    ];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "Delete Mapping",
      onClick: (item) => deleteImageOrgMapping(item),
      confirmation: () => ({
        title: "Delete Mapping",
        description: "Are you sure you want to Delete Organisation Image Mapping ?",
      }),
      color: "error.main",
      hidden: (item) => item?.public === true,
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchImages({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchImages],
  );

  const dataList = useDataList({
    data: organisationImages?.list?.data || [],
    totalRecords: organisationImages?.totalRecords,
    columns,
    exportFilename: "Images List",
    exportColumns,
    searchFields,
    rowCreator,
    exportCreator,
    actions,
    listExporter: exportImages,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListImages;
