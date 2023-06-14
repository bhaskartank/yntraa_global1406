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

interface ListObjectStorageOnboardingRequestsProps {
  fetchOnboardingRequests: any;
  exportOnboardingRequests: any;
  defaultFilters?: any;
}

const ListObjectStorageOnboardingRequests: FC<ListObjectStorageOnboardingRequestsProps> = ({ fetchOnboardingRequests, exportOnboardingRequests, defaultFilters }) => {
  const rootState = useSelector((state: any) => state);
  const onboardingRequests = objectStorageRedux.getters.objectStorageOnboardingRequests(rootState);
  const navigate = useNavigate();

  const columns: ColumnProps[] = useMemo(
    () => [
      {
        label: "Cloud Reg. A/C No.",
        align: "center",
        filterKey: "cloud_reg_acno",
        filters: onboardingRequests?.list?.filter_values?.cloud_reg_acno,
      },
      {
        label: "Organisation",
        align: "center",
        filterKey: "name",
        filters: onboardingRequests?.list?.filter_values?.name,
      },
      {
        label: "Provider",
        align: "center",
        filterKey: "provider_code",
        filters: onboardingRequests?.list?.filter_values?.provider_code,
      },
      {
        label: "Provider Location",
        align: "center",
        defaultHidden: true,
      },
      {
        label: "Requested Quota",
        align: "center",
        sortKey: "quotapackage_name",
        filterKey: "quotapackage_name",
        filters: onboardingRequests?.list?.filter_values?.quotapackage_name,
      },
      { label: "Status", align: "center", sortKey: "status" },
      { label: "Requested On", align: "center", sortKey: "created", defaultSort: "desc" },
    ],
    [onboardingRequests?.list?.filter_values],
  );

  const exportColumns: string[] = useMemo(
    () => [
      "Requested Total Size",
      "Requested Buckets",
      "Requested Objects Per Bucket",
      "Provider Name",
      "Provider ID",
      "Provider Location",
      "Organisation",
      "Organisation ID",
      "Cloud Reg. A/C No.",
      "Status",
      "Requested On",
    ],
    [],
  );

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.cloud_reg_acno, align: "center" },
      {
        content: (
          <Stack>
            <Box component="span">{item?.name}</Box>
            <Box component="span">({item?.cuc})</Box>
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
      { content: item?.quotapackage?.name, align: "center" },
      { content: item?.status ? <StatusChip label={item?.status} /> : null, align: "center" },
      { content: formatDate(item?.created), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.requested_quota + " GiB",
      item?.requested_bucket_count + " Buckets",
      item?.requested_objects_per_bucket + " Objects",
      item?.provider?.provider_name,
      item?.provider?.provider_id,
      item?.provider?.provider_location,
      item?.project?.organisation?.name,
      item?.project?.organisation?.org_id,
      item?.project?.organisation?.org_reg_code,
      item?.project?.name,
      item?.project?.project_id,
      item?.status?.toUpperCase(),
      formatDate(item?.created, false, true),
    ];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "View Request",
      onClick: (item) => navigate(`${item?.id}/request-details`, { state: { ObjectStorageOnboardingRequestDetail: item } }),
    },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.id], resource_type: ["ObjectStorage"] } } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchOnboardingRequests({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchOnboardingRequests],
  );

  const dataList = useDataList({
    data: onboardingRequests?.list?.data || [],
    totalRecords: onboardingRequests?.totalRecords,
    columns,
    actions,
    exportFilename: "Object Storage Onboarding Requests List",
    exportColumns,
    defaultFilters,
    rowCreator,
    exportCreator,
    listExporter: exportOnboardingRequests,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListObjectStorageOnboardingRequests;
