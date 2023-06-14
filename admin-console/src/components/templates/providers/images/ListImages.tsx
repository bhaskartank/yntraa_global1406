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

interface ListImageProps {
  fetchImages: any;
  exportImages: any;
  defaultFilters: any;
}

const ListImages: FC<ListImageProps> = ({ fetchImages, exportImages, defaultFilters }) => {
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const images = providersRedux.getters.images(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Name", sortKey: "name", filterKey: "name", filters: images?.list?.filter_values?.name },
      { label: "Description", defaultHidden: true },
      {
        label: "Provider",
        align: "center",
        filterKey: "provider_id",
        filters: images?.list?.filter_values?.provider?.map((item) => ({ label: `${item?.provider_name} (${item?.provider_id})`, value: item?.id })),
      },
      { label: "Provider Location", align: "center", filterKey: "provider_location", filters: images?.list?.filter_values?.provider_location, defaultHidden: true },
      { label: "OS", align: "center", sortKey: "os", filterKey: "os", filters: images?.list?.filter_values?.os },
      {
        label: "OS Architecture",
        align: "center",
        sortKey: "os_architecture",
        filterKey: "os_architecture",
        filters: images?.list?.filter_values?.os_architecture,
        defaultHidden: true,
      },
      { label: "OS Version", align: "center", sortKey: "os_version", filterKey: "os_version", filters: images?.list?.filter_values?.os_version },
      { label: "RAM", align: "center", sortKey: "min_ram" },
      { label: "Disk", align: "center", sortKey: "min_disk" },
      { label: "Size", align: "center", sortKey: "size", defaultHidden: true },
      { label: "Cost", defaultHidden: true },
      {
        label: "Public",
        align: "center",
        sortKey: "public",
        filterKey: "public",
        filters: images?.list?.filter_values?.public?.map((item) => ({ label: String(item?.label), value: item?.value })),
      },
      {
        label: "Active",
        align: "center",
        sortKey: "is_active",
        filterKey: "is_active",
        filters: images?.list?.filter_values?.is_active?.map((item) => ({ label: String(item?.label), value: item?.value })),
      },
      { label: "Created", align: "center", sortKey: "created", defaultSort: "desc" },
    ],
    [images?.list?.filter_values],
  );

  const exportColumns: string[] = useMemo(
    () => [
      "Name",
      "Description",
      "Provider Name",
      "Provider ID",
      "Provider Location",
      "OS",
      "OS Architecture",
      "OS Version",
      "RAM",
      "Disk",
      "Size",
      "Cost",
      "Public",
      "Active",
      "Created",
    ],
    [],
  );

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.name },
      { content: item?.description },
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
      { content: item?.os, align: "center" },
      { content: item?.os_architecture, align: "center" },
      { content: item?.os_version, align: "center" },
      { content: `${parseInt(item?.min_ram) / 1024} GiB`, align: "center" },
      { content: `${item?.min_disk} GiB`, align: "center" },
      { content: item?.size, align: "center" },
      { content: item?.cost },
      { content: item?.public !== null ? <StatusChip label={item?.public} /> : null, align: "center" },
      { content: item?.is_active !== null ? <StatusChip label={item?.is_active} /> : null, align: "center" },
      { content: formatDate(item?.created), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.name,
      item?.description,
      item?.provider?.provider_name,
      item?.provider?.provider_id,
      item?.provider?.provider_location,
      item?.os,
      item?.os_architecture,
      item?.os_version,
      item?.min_ram,
      item?.min_disk,
      item?.size,
      item?.cost,
      item?.public,
      item?.is_active,
      formatDate(item?.created, false, true),
    ];
  }, []);

  const searchFields = useMemo(
    () => [
      { key: "name", label: "Name" },
      { key: "os", label: "OS" },
      { key: "os_architecture", label: "OS Architecture" },
      { key: "os_version", label: "OS Version" },
      { key: "min_ram", label: "Min Ram" },
      { key: "min_disk", label: "Min Disk" },
      { key: "provider_location", label: "Provider Location" },
    ],
    [],
  );

  const actions: ActionProps[] = [
    // {
    //   label: () => "View Image Details",
    //   onClick: () => null,
    // },
    {
      label: () => "Edit Image Details",
      onClick: (item) => navigate(`${item?.id}/update`, { state: { image: item } }),
    },
    {
      label: () => "Image Organisation Mapping",
      onClick: (item) => navigate(`${item?.id}/map-organisation`, { state: { image: item } }),
    },
    {
      label: () => "Image Resource Mapping",
      onClick: (item) => navigate(`${item?.id}/resource-mapping`, { state: { image: item } }),
    },
    {
      label: () => "Manage Init Script",
      onClick: (item) => navigate(`${item?.id}/init-script`, { state: { image: item } }),
    },
    {
      label: () => "Init Script History",
      onClick: (item) => navigate(`${item?.id}/init-script-history`, { state: { image: item } }),
    },
    {
      label: () => "View related VMs",
      onClick: (item) => navigate("/compute/types", { state: { defaultFilters: { image_id: [item?.id] } } }),
    },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.id], resource_type: ["Image"] } } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchImages({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchImages],
  );

  const dataList = useDataList({
    data: images?.list?.data || [],
    totalRecords: images?.totalRecords,
    columns,
    actions,
    exportFilename: "Images List",
    exportColumns,
    searchFields,
    defaultFilters,
    rowCreator,
    exportCreator,
    listExporter: exportImages,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListImages;
