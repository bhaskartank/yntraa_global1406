import { FC, useCallback, useMemo } from "react";

import { useSelector } from "store";
import objectStorageRedux from "store/modules/objectStorage";

import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListObjectStorageQuotaDetailsProps {
  fetchQuotas: any;
  exportQuotas: any;
  detachProviderQuota: any;
}

const ListObjectStorageQuotaDetails: FC<ListObjectStorageQuotaDetailsProps> = ({ fetchQuotas, exportQuotas, detachProviderQuota }) => {
  const rootState = useSelector((state: any) => state);
  const objectStorageQuotas = objectStorageRedux.getters.objectStorageProviderQuotaDetails(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Name" },
      { label: "Description", defaultHidden: true },
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
      { content: item?.quotapackageprovider_mapping?.name },
      { content: item?.quotapackageprovider_mapping?.description },
      { content: `${item?.quotapackageprovider_mapping?.object_storage} GiB` },
      { content: item?.quotapackageprovider_mapping?.buckets },
      { content: item?.quotapackageprovider_mapping?.objects },
      { content: item?.providerquota_mapping?.objectstorage_provider_name },
      { content: item?.providerquota_mapping?.objectstorage_provider_location },
      { content: formatDate(item?.updated) },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.quotapackageprovider_mapping?.name,
      item?.quotapackageprovider_mapping?.description,
      `${item?.quotapackageprovider_mapping?.object_storage} GiB`,
      item?.quotapackageprovider_mapping?.buckets,
      item?.quotapackageprovider_mapping?.objects,
      item?.providerquota_mapping?.objectstorage_provider_name,
      item?.providerquota_mapping?.objectstorage_provider_location,
      formatDate(item?.updated, false, true),
    ];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "Detach Quota",
      confirmation: () => ({
        title: "Detach Quota",
        description: "Are you sure you want to detach this quota?",
      }),
      onClick: (item) => detachProviderQuota(item),
      color: "error.main",
    },
  ];

  const reload = useCallback(({ limit, offset, search }) => fetchQuotas({ limit, offset, search }), [fetchQuotas]);

  const dataList = useDataList({
    data: objectStorageQuotas?.list || [],
    totalRecords: objectStorageQuotas?.totalRecords,
    columns,
    exportFilename: "Object Storage Providers Quota List",
    exportColumns,
    // searchFields,
    actions,
    rowCreator,
    exportCreator,
    listExporter: exportQuotas,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListObjectStorageQuotaDetails;
