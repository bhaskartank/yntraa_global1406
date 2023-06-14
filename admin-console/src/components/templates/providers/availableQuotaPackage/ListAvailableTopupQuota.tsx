import { Box, Stack } from "@mui/material";
import { FC, useCallback, useMemo } from "react";

import { useSelector } from "store";
import providersRedux from "store/modules/providers";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListFlavorProps {
  fetchAvailableTopupQuota: any;
  exportAvailableTopupQuota: any;
}

const ListAvailableTopupQuota: FC<ListFlavorProps> = ({ fetchAvailableTopupQuota, exportAvailableTopupQuota }) => {
  const rootState = useSelector((state: any) => state);
  const availableTopupQuota = providersRedux.getters.availableTopupQuota(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Topup Type", filterKey: "topup_type", filters: availableTopupQuota?.list?.filter_values?.topup_type },
      { label: "Topup Value", align: "center" },
      {
        label: "Provider",
        align: "center",
        filterKey: "provider_id",
        filters: availableTopupQuota?.list?.filter_values?.provider?.map((item) => ({ label: `${item?.provider_name} (${item?.provider_id})`, value: item?.id })),
      },
      { label: "Provider Location", align: "center", filterKey: "provider_location", filters: availableTopupQuota?.list?.filter_values?.provider_location },
      {
        label: "Public",
        align: "center",
        filterKey: "public",
        filters: availableTopupQuota?.list?.filter_values?.public?.map((item) => ({ label: String(item?.label), value: item?.value })),
      },
      {
        label: "Active",
        align: "center",
        filterKey: "is_active",
        filters: availableTopupQuota?.list?.filter_values?.is_active?.map((item) => ({ label: String(item?.label), value: item?.value })),
      },
      { label: "Created", align: "center" },
    ],
    [availableTopupQuota?.list?.filter_values],
  );

  const exportColumns: string[] = useMemo(() => ["Topup Item", "Topup Value", "Provider Name", "Provider ID", "Provider Location", "Public", "Active", "Created"], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.resource_topup?.topup_type },
      { content: item?.resource_topup?.topup_value, align: "center" },
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
      { content: item?.resource_topup?.public !== null ? <StatusChip label={item?.resource_topup?.public} /> : null, align: "center" },
      { content: item?.resource_topup?.is_active !== null ? <StatusChip label={item?.resource_topup?.is_active} /> : null, align: "center" },
      { content: formatDate(item?.created), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.resource_topup?.topup_type,
      item?.resource_topup?.topup_value,
      item?.provider?.provider_name,
      item?.provider?.provider_id,
      item?.provider?.provider_location,
      item?.resource_topup?.public,
      item?.resource_topup?.is_active,
      formatDate(item?.created, false, true),
    ];
  }, []);

  const searchFields = useMemo(
    () => [
      { key: "topup_item", label: "Topup Item" },
      { key: "topup_type", label: "Topup Type" },
      { key: "provider_location", label: "Provider Location" },
    ],
    [],
  );

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchAvailableTopupQuota({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchAvailableTopupQuota],
  );

  const dataList = useDataList({
    data: availableTopupQuota?.list?.data || [],
    totalRecords: availableTopupQuota?.totalRecords,
    columns,
    exportFilename: "Available Topup Quota List",
    exportColumns,
    rowCreator,
    exportCreator,
    searchFields,
    listExporter: exportAvailableTopupQuota,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListAvailableTopupQuota;
