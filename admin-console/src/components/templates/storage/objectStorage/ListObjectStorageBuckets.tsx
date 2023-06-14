import { Box, Stack } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import objectStorageRedux from "store/modules/objectStorage";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListObjectStorageBucketsProps {
  fetchObjectStorageBuckets: any;
  exportObjectStorageBuckets: any;
  defaultFilters: any;
}

const ListObjectStorageBuckets: FC<ListObjectStorageBucketsProps> = ({ fetchObjectStorageBuckets, exportObjectStorageBuckets, defaultFilters }) => {
  const rootState = useSelector((state: any) => state);
  const objectStorageBuckets = objectStorageRedux.getters.objectStorageBuckets(rootState);
  const navigate = useNavigate();

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Bucket Name" },
      { label: "Used Size / Total Size" },
      { label: "Used Object Count / Total Object Count", defaultHidden: true },
      { label: "Usage As On", defaultHidden: true },
      {
        label: "Object Storage Provider",
        align: "center",
        filterKey: "objectstorage_providers_id",
        filters: objectStorageBuckets?.list?.filter_values?.objectstorage_providers?.map((item) => ({
          label: `${item?.objectstorage_provider_name} (${item?.objectstorage_provider_location})`,
          value: item?.id,
        })),
      },
      {
        label: "Provider",
        align: "center",
        // filterKey: "provider_id",
        // filters: objectStorageBuckets?.list?.filter_values?.provider?.map((item) => ({ label: `${item?.provider_name} (${item?.provider_id})`, value: item?.id })),
      },
      {
        label: "Provider Location",
        align: "center",
        // filterKey: "provider_location",
        // filters: objectStorageBuckets?.list?.filter_values?.provider_location,
        defaultHidden: true,
      },
      {
        label: "Organisation",
        align: "center",
        filterKey: "organisation",
        filters: objectStorageBuckets?.list?.filter_values?.organisations?.map((item) => ({ label: item?.cuc, value: item?.id })),
        defaultHidden: true,
      },
      {
        label: "Cloud Reg. A/C No.",
        align: "center",
        // filterKey: "organisation_org_reg_code",
        // filters: objectStorageBuckets?.list?.filter_values?.organisation?.map((item) => ({ label: item?.org_reg_code, value: item?.org_reg_code })),
      },
      { label: "Status", align: "center", sortKey: "status", filterKey: "status", filters: objectStorageBuckets?.list?.filter_values?.status },
      { label: "Created On", align: "center", sortKey: "created", defaultSort: "desc" },
    ],
    [objectStorageBuckets?.list?.filter_values],
  );

  const exportColumns: string[] = useMemo(
    () => [
      "Bucket Name",
      "Used Size / Total Size",
      "Used Object Count / Total Object Count",
      "Usage As On",
      "Provider Name",
      "Provider ID",
      "Provider Location",
      "Organisation",
      "Organisation ID",
      "Cloud Reg. A/C No",
      "Status",
      "Created On",
    ],
    [],
  );

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.name },
      { content: item?.bucket_size_usage + "/" + item?.bucket_size, align: "center" },
      { content: item?.used_objects_count + "/" + item?.total_objects_count, align: "center" },
      { content: formatDate(item?.bucket_size_usage_ason), align: "center" },
      {
        content: (
          <Stack alignItems="center">
            <Box whiteSpace="nowrap">{item?.bucket_objectstorage_provider?.objectstorage_provider_name}</Box>
            <Box>({item?.bucket_objectstorage_provider?.objectstorage_provider_location})</Box>
          </Stack>
        ),
        align: "center",
      },
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
      {
        content: (
          <Stack>
            <Box component="span">{item?.bucket_onboardedorganisation?.organisation_request?.name}</Box>
            <Box component="span">({item?.bucket_onboardedorganisation?.organisation_request?.cuc})</Box>
          </Stack>
        ),
        align: "center",
      },
      { content: item?.bucket_onboardedorganisation?.organisation_request?.cloud_reg_acno, align: "center" },
      { content: item?.status ? <StatusChip label={item?.status} /> : null, align: "center" },
      { content: formatDate(item?.created), align: "center" },
      { content: item?.remarks, align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.name,
      item?.bucket_size_usage + "/" + item?.bucket_size,
      item?.used_objects_count + "/" + item?.total_objects_count,
      formatDate(item?.bucket_size_usage_ason),
      item?.provider?.provider_name,
      item?.provider?.provider_id,
      item?.provider?.provider_location,
      item?.bucket_onboardedorganisation?.organisation_request?.name,
      item?.bucket_onboardedorganisation?.organisation_request?.cuc,
      item?.bucket_onboardedorganisation?.organisation_request?.cloud_reg_acno,
      item?.status?.toUpperCase(),
      formatDate(item?.created, false, true),
    ];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "View Details",
      onClick: (item) => navigate(`${item?.id}/view-details`, { state: { ListObjectStorageBucket: item } }),
    },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.id], resource_type: ["ObjectStorage"] } } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchObjectStorageBuckets({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchObjectStorageBuckets],
  );

  const dataList = useDataList({
    data: objectStorageBuckets?.list?.data || [],
    totalRecords: objectStorageBuckets?.totalRecords,
    columns,
    actions,
    exportFilename: "Object Storage Buckets List",
    exportColumns,
    defaultFilters,
    rowCreator,
    exportCreator,
    listExporter: exportObjectStorageBuckets,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListObjectStorageBuckets;
