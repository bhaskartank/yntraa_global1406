import { Box, Stack } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";

import objectStorageRedux from "store/modules/objectStorage";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListObjectStorageQuotaTopupsProps {
  fetchObjectStorageQuotaTopups: any;
  exportObjectStorageBuckets: any;
  handleDetachResourceTopup: any;
  defaultFilters: any;
}

const ListObjectStorageQuotaTopups: FC<ListObjectStorageQuotaTopupsProps> = ({
  fetchObjectStorageQuotaTopups,
  exportObjectStorageBuckets,
  handleDetachResourceTopup,
  defaultFilters,
}) => {
  const rootState = useSelector((state: any) => state);
  const objectStorageQuotaTopups = objectStorageRedux.getters.objectStorageQuotaTopups(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Resource Name" },
      {
        label: "Topup value",
        filterKey: "resource_topups_id",
        filters: objectStorageQuotaTopups?.list?.filter_values?.resource_topups?.map((item) => ({
          label: item?.topup_value,
          value: item?.id,
        })),
      },
      {
        label: "Object Storage Provider",
        align: "center",
        filterKey: "objectstorage_providers_id",
        filters: objectStorageQuotaTopups?.list?.filter_values?.objstorage_providers?.map((item) => ({
          label: `${item?.objectstorage_provider_name} (${item?.objectstorage_provider_location})`,
          value: item?.id,
        })),
      },
      {
        label: "Public",
        align: "center",
      },
      {
        label: "Is Enabled",
        align: "center",
      },
      { label: "Created On", align: "center", sortKey: "created", defaultSort: "desc" },
    ],
    [objectStorageQuotaTopups?.list?.filter_values],
  );

  const exportColumns: string[] = useMemo(() => ["Resource Name", "Topup value", "Object Storage Provider", "Provider Location", "Public", "Is Enabled", "Created On"], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.resource_topup?.resource_name?.split("_").join(" ") },
      { content: item?.resource_topup?.topup_value },
      {
        content: (
          <Stack alignItems="center">
            <Box whiteSpace="nowrap">{item?.objectstorage_provider?.objectstorage_provider_name}</Box>
            <Box>({item?.objectstorage_provider?.objectstorage_provider_location})</Box>
          </Stack>
        ),
        align: "center",
      },
      { content: item?.resource_topup?.public ? <StatusChip label={item?.resource_topup?.public} /> : null, align: "center" },
      { content: item?.resource_topup?.is_active ? <StatusChip label={item?.resource_topup?.is_active} /> : null, align: "center" },
      { content: formatDate(item?.created), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.resource_topup?.resource_name?.split("_").join(" "),
      item?.resource_topup?.topup_value,
      item?.objectstorage_provider?.objectstorage_provider_name,
      item?.objectstorage_provider?.objectstorage_provider_location,
      item?.resource_topup?.public,
      item?.resource_topup?.is_active,
      formatDate(item?.created, false, true),
    ];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "Detach Resource Topup",
      onClick: (item) => handleDetachResourceTopup({ objectstorage_provider_id: item?.objectstorage_provider_id, resource_topup_id: item?.resource_topup_id }),
      confirmation: (item) => ({
        title: "Detach Resource Topup",
        description: "Are you sure you want to detach the resource topup?",
      }),
      color: "error.main",
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchObjectStorageQuotaTopups({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchObjectStorageQuotaTopups],
  );

  const dataList = useDataList({
    data: objectStorageQuotaTopups?.list?.data || [],
    totalRecords: objectStorageQuotaTopups?.totalRecords,
    columns,
    actions,
    exportFilename: "objectStorageQuotaTopups",
    exportColumns,
    defaultFilters,
    rowCreator,
    exportCreator,
    listExporter: exportObjectStorageBuckets,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListObjectStorageQuotaTopups;
