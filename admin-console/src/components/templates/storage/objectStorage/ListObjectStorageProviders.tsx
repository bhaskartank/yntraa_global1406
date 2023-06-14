import { FC, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import objectStorageRedux from "store/modules/objectStorage";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListObjectStorageProvidersProps {
  fetchObjectStorageProviders: any;
  exportObjectStorageProviders: any;
}

const ListObjectStorageProviders: FC<ListObjectStorageProvidersProps> = ({ fetchObjectStorageProviders, exportObjectStorageProviders }) => {
  const rootState = useSelector((state: any) => state);
  const objectStorageProviders = objectStorageRedux.getters.objectStorageProviders(rootState);
  const navigate = useNavigate();

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Object Storage Provider", filterKey: "objectstorage_provider_name", filters: objectStorageProviders?.list?.filter_values?.objectstorage_provider_name },
      { label: "Provider Location", filterKey: "objectstorage_provider_location", filters: objectStorageProviders?.list?.filter_values?.objectstorage_provider_location },
      { label: "Provider Description", defaultHidden: true, align: "center" },
      { label: "Default Bucket Size", defaultHidden: true, align: "center" },
      { label: "Default Object Count", defaultHidden: true, align: "center" },
      { label: "Access Endpoint IP", align: "center", filterKey: "access_endpoint_ip", filters: objectStorageProviders?.list?.filter_values?.access_endpoint_ip },
      { label: "Access Endpoint URL", align: "center", filterKey: "access_endpoint_url", filters: objectStorageProviders?.list?.filter_values?.access_endpoint_url },
      { label: "Status", align: "center", sortKey: "status" },
      { label: "Created On", align: "center", sortKey: "created", defaultSort: "desc" },
    ],
    [objectStorageProviders?.list?.filter_values],
  );

  const exportColumns: string[] = useMemo(
    () => [
      "Object Storage Provider",
      "Provider Location",
      "Provider Description",
      "Default Bucket Size",
      "Default Object Count",
      "Access Endpoint IP",
      "Access Endpoint URL",
      "Status",
      "Created On",
    ],
    [],
  );

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.objectstorage_provider_name },
      { content: item?.objectstorage_provider_location },
      { content: item?.objectstorage_provider_description, align: "center" },
      { content: item?.default_bucket_size, align: "center" },
      { content: item?.default_objects_count, align: "center" },
      { content: item?.access_endpoint_ip, align: "center" },
      { content: item?.access_endpoint_url, align: "center" },
      { content: item?.status ? <StatusChip label={item?.status} /> : null, align: "center" },
      { content: formatDate(item?.created), align: "center" },
      { content: item?.remarks, align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.objectstorage_provider_name,
      item?.objectstorage_provider_location,
      item?.objectstorage_provider_description,
      item?.default_bucket_size,
      item?.default_objects_count,
      item?.access_endpoint_ip + ":" + item?.access_endpoint_port,
      item?.access_endpoint_url,
      item?.status?.toUpperCase(),
      formatDate(item?.created, false, true),
    ];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "View Details",
      onClick: (item) => navigate(`${item?.id}/view-details`, { state: { ListObjectStorageProviders: item } }),
    },
    {
      label: () => "View Bucket List",
      onClick: (item) => navigate(`/storage/object-storage-list`, { state: { defaultFilters: { object_storage_provider: [item?.id] } } }),
    },
    {
      label: () => "View Quota Topup List",
      onClick: (item) =>
        navigate(`/storage/object-storage-list/${item?.id}/object-storage-quota-topup`, {
          state: { objectStorageProviderDetails: item, defaultFilters: { object_storage_provider: [item?.id] } },
        }),
    },
    {
      label: () => "Manage Attached Quota Package",
      onClick: (item) => navigate(`/storage/object-storage-provider/${item?.id}/list-attached-quota`, { state: { provider: item } }),
    },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.id], resource_type: ["ObjectStorage"] } } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchObjectStorageProviders({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchObjectStorageProviders],
  );

  const dataList = useDataList({
    data: objectStorageProviders?.list?.data || [],
    totalRecords: objectStorageProviders?.totalRecords,
    columns,
    actions,
    exportFilename: "Object Storage Buckets List",
    exportColumns,
    rowCreator,
    exportCreator,
    listExporter: exportObjectStorageProviders,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListObjectStorageProviders;
