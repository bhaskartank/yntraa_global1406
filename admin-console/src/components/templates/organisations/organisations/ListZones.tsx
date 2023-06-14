import { Box, Stack } from "@mui/material";
import { FC, useCallback, useMemo } from "react";

import { useSelector } from "store";
import organisationsRedux from "store/modules/organisations";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListZoneProps {
  fetchZones: any;
  exportZones: any;
}

const ListZones: FC<ListZoneProps> = ({ fetchZones, exportZones }) => {
  const rootState = useSelector((state: any) => state);
  const organisationZones = organisationsRedux.getters.organisationZones(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Zone Name" },
      {
        label: "Provider",
        align: "center",
        filterKey: "provider_id",
        filters: organisationZones?.list?.filter_values?.provider?.map((item) => ({ label: `${item?.provider_name} (${item?.provider_id})`, value: item?.id })),
      },
      { label: "Provider Location", align: "center", filterKey: "provider_location", filters: organisationZones?.list?.filter_values?.provider_location },
      { label: "Resource Type" },
      { label: "Public", align: "center" },
      { label: "Default", align: "center" },
      { label: "Status", align: "center" },
      { label: "Created" },
    ],
    [organisationZones],
  );

  const exportColumns: string[] = useMemo(() => ["Zone Name", "Provider Name", "Provider ID", "Provider Location", "Resource Type", "Public", "Default", "Status", "Created"], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.resource_availability_zones.zone_name },
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
      { content: item?.resource_availability_zones?.resource_name },
      { content: item?.resource_availability_zones?.is_default !== null ? <StatusChip label={item?.resource_availability_zones?.is_default} /> : null, align: "center" },
      { content: item?.resource_availability_zones?.is_public !== null ? <StatusChip label={item?.resource_availability_zones?.is_public} /> : null, align: "center" },
      { content: item?.resource_availability_zones?.status !== null ? <StatusChip label={item?.resource_availability_zones?.status} /> : null, align: "center" },
      { content: formatDate(item?.resource_availability_zones?.created) },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.resource_availability_zones?.zone_name,
      item?.provider?.provider_name,
      item?.provider?.provider_id,
      item?.provider?.provider_location,
      item?.resource_availability_zones?.resource_name,
      item?.resource_availability_zones?.is_default,
      item?.resource_availability_zones?.is_public,
      item?.resource_availability_zones?.status,
      formatDate(item?.resource_availability_zones?.created, false, true),
    ];
  }, []);

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchZones({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchZones],
  );

  const dataList = useDataList({
    data: organisationZones?.list?.data || [],
    totalRecords: organisationZones?.totalRecords,
    columns,
    exportFilename: "Zones List",
    exportColumns,
    rowCreator,
    exportCreator,
    listExporter: exportZones,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListZones;
