import { FC, useCallback, useMemo } from "react";

import { useSelector } from "store";
import objectStorageRedux from "store/modules/objectStorage";

import DataList from "components/organisms/DataList";
import { ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListObjectStorageQuotaDetailsProps {
  fetchQuotas: any;
  exportQuotas: any;
}

const ListObjectStorageQuotaDetails: FC<ListObjectStorageQuotaDetailsProps> = ({ fetchQuotas, exportQuotas }) => {
  const rootState = useSelector((state: any) => state);
  const objectStorageQuotas = objectStorageRedux.getters.objectStorageQuotaDetails(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Name" },
      { label: "Description" },
      { label: "Object Storage" },
      { label: "Buckets" },
      { label: "Objects" },
      { label: "Provider Name" },
      { label: "Provider Location" },
      { label: "Allocated On" },
    ],
    [],
  );

  const exportColumns: string[] = useMemo(() => ["Name", "Description", "Object Storage", "Buckets", "Objects", "Provider Name", "Provider Location", "Allocated On"], []);

  //   const searchFields = useMemo(() => [{ key: "name", label: "Name" }], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.quotapackage_mapping?.name },
      { content: item?.quotapackage_mapping?.description },
      { content: `${item?.quotapackage_mapping?.object_storage} GiB` },
      { content: item?.quotapackage_mapping?.buckets },
      { content: item?.quotapackage_mapping?.objects },
      { content: item?.objectstorageprovider_mapping?.objectstorage_provider_name },
      { content: item?.objectstorageprovider_mapping?.objectstorage_provider_location },
      { content: formatDate(item?.updated) },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.quotapackage_mapping?.name,
      item?.quotapackage_mapping?.description,
      `${item?.quotapackage_mapping?.object_storage} GiB`,
      item?.quotapackage_mapping?.buckets,
      item?.quotapackage_mapping?.objects,
      item?.objectstorageprovider_mapping?.objectstorage_provider_name,
      item?.objectstorageprovider_mapping?.objectstorage_provider_location,
      formatDate(item?.updated, false, true),
    ];
  }, []);

  //   const actions: ActionProps[] = [
  //     {
  //       label: () => "Quota Topup Details",
  //       onClick: (item) => navigate(`${item?.id}/topup`, { state: { quota: item } }),
  //     },
  //     {
  //       label: () => "Resource Details",
  //       onClick: (item) => navigate(`${item?.id}/resources`, { state: { quota: item } }),
  //     },
  //   ];

  const reload = useCallback(({ limit, offset, search }) => fetchQuotas({ limit, offset, search }), [fetchQuotas]);

  const dataList = useDataList({
    data: objectStorageQuotas?.list || [],
    totalRecords: objectStorageQuotas?.totalRecords,
    columns,
    exportFilename: "Object Storage Quota List",
    exportColumns,
    // searchFields,
    // actions,
    rowCreator,
    exportCreator,
    listExporter: exportQuotas,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListObjectStorageQuotaDetails;
