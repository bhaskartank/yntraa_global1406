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

interface ListAvailabilityZoneProps {
  fetchAvailabilityZones: any;
  exportAvailabilityZones: any;
  defaultFilters: any;
}

const ListAvailabilityZones: FC<ListAvailabilityZoneProps> = ({ fetchAvailabilityZones, exportAvailabilityZones, defaultFilters }) => {
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const zones = providersRedux.getters.zones(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Zone Name", sortKey: "zone_name", filterKey: "zone_name", filters: zones?.list?.filter_values?.zone_name },
      {
        label: "Provider",
        align: "center",
        filterKey: "provider_id",
        filters: zones?.list?.filter_values?.provider?.map((item) => ({ label: `${item?.provider_name} (${item?.provider_id})`, value: item?.id })),
      },
      { label: "Provider Location", align: "center", filterKey: "provider_location", filters: zones?.list?.filter_values?.provider_location },
      { label: "Resource Type", align: "center", sortKey: "resource_name", filterKey: "resource_name", filters: zones?.list?.filter_values?.resource_name },
      {
        label: "Public",
        align: "center",
        sortKey: "is_public",
        filterKey: "is_public",
        filters: zones?.list?.filter_values?.is_public?.map((item) => ({ label: item?.label?.toString(), value: item?.value })),
      },
      {
        label: "Default",
        align: "center",
        sortKey: "is_default",
        filterKey: "is_default",
        filters: zones?.list?.filter_values?.is_default?.map((item) => ({ label: item?.label?.toString(), value: item?.value })),
      },
      { label: "Status", align: "center", sortKey: "status", filterKey: "status", filters: zones?.list?.filter_values?.status },
      { label: "Created", align: "center", sortKey: "created", defaultSort: "desc" },
    ],
    [zones?.list?.filter_values],
  );

  const exportColumns: string[] = useMemo(() => ["Zone Name", "Provider Name", "Provider ID", "Provider Location", "Resource Type", "Public", "Default", "Status", "Created"], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.zone_name },
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
      { content: item?.resource_name, align: "center" },
      { content: item?.is_public !== null ? <StatusChip label={item?.is_public} /> : null, align: "center" },
      { content: item?.is_default !== null ? <StatusChip label={item?.is_default} /> : null, align: "center" },
      { content: item?.status ? <StatusChip label={item?.status} /> : null, align: "center" },
      { content: formatDate(item?.created), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.zone_name,
      item?.provider?.provider_name,
      item?.provider?.provider_id,
      item?.provider?.provider_location,
      item?.resource_name,
      item?.is_public,
      item?.is_default,
      item?.status,
      formatDate(item?.created, false, true),
    ];
  }, []);

  const searchFields = useMemo(
    () => [
      { key: "zone_name", label: "Zone Name" },
      { key: "resource_name", label: "Resource Name" },
      { key: "status", label: "Status" },
      { key: "provider_location", label: "Provider Location" },
    ],
    [],
  );

  const actions: ActionProps[] = [
    {
      label: () => "Update Availability Zone",
      onClick: (item) => navigate(`${item?.id}/update`, { state: { zone: item } }),
    },
    {
      label: () => "Map Zone to Organisation",
      onClick: (item) => navigate(`${item?.id}/map-organisation`, { state: { zone: item } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchAvailabilityZones({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchAvailabilityZones],
  );

  const dataList = useDataList({
    data: zones?.list?.data || [],
    totalRecords: zones?.totalRecords,
    columns,
    actions,
    exportFilename: "Availability Zones List",
    exportColumns,
    searchFields,
    defaultFilters,
    rowCreator,
    exportCreator,
    listExporter: exportAvailabilityZones,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListAvailabilityZones;
