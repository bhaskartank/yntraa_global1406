import { FC, useCallback, useMemo } from "react";

import { useSelector } from "store";
import providersRedux from "store/modules/providers";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListMappedProviderProps {
  fetchMappedProviders: any;
  exportMappedProviders: any;
}

const ListMappedProviders: FC<ListMappedProviderProps> = ({ fetchMappedProviders, exportMappedProviders }) => {
  const rootState = useSelector((state: any) => state);
  const quotaMappedProviders = providersRedux.getters.quotaMappedProviders(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Provider ID", filterKey: "provider_id", filters: quotaMappedProviders?.list?.filter_values?.provider_id },
      { label: "Name", align: "center", filterKey: "provider_name", filters: quotaMappedProviders?.list?.filter_values?.provider_name },
      { label: "Location", align: "center", filterKey: "provider_location", filters: quotaMappedProviders?.list?.filter_values?.provider_location },
      { label: "Description", align: "center" },
      { label: "Status", align: "center", filterKey: "status", filters: quotaMappedProviders?.list?.filter_values?.status },
      { label: "Created", align: "center" },
    ],
    [quotaMappedProviders],
  );

  const exportColumns: string[] = useMemo(() => ["Provider ID", "Name", "Location", "Description", "Status", "Created"], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.provider_id },
      { content: item?.provider_name, align: "center" },
      { content: item?.provider_location, align: "center" },
      { content: item?.provider_description, align: "center" },
      { content: item?.status ? <StatusChip label={item?.status} /> : null, align: "center" },
      { content: formatDate(item?.created), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [item?.provider_id, item?.provider_name, item?.provider_location, item?.provider_description, item?.status?.toUpperCase(), formatDate(item?.created, false, true)];
  }, []);

  const searchFields = useMemo(
    () => [
      { key: "provider_name", label: "Provider Name" },
      { key: "provider_location", label: "Location" },
      { key: "provider_id", label: "Provider ID" },
      { key: "status", label: "Status" },
    ],
    [],
  );

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy }) => fetchMappedProviders({ limit, offset, sort_by: orderBy, sort_asc: order === "asc", search }),
    [fetchMappedProviders],
  );

  const dataList = useDataList({
    data: quotaMappedProviders?.list?.data || [],
    totalRecords: quotaMappedProviders?.totalRecords,
    columns,
    exportFilename: "Mapped Providers List",
    exportColumns,
    rowCreator,
    exportCreator,
    searchFields,
    listExporter: exportMappedProviders,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListMappedProviders;
