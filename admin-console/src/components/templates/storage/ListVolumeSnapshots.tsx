import { Box, Stack } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import storageRedux from "store/modules/storage";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListVolumeSnapshotProps {
  fetchVolumeSnapshots: any;
  exportVolumeSnapshots: any;
  fetchVolumeSnapshotsOwnerDetail: any;
  defaultFilters: any;
}

const ListVolumeSnapshots: FC<ListVolumeSnapshotProps> = ({ fetchVolumeSnapshots, exportVolumeSnapshots, fetchVolumeSnapshotsOwnerDetail, defaultFilters }) => {
  const rootState = useSelector((state: any) => state);
  const volumeSnapshots = storageRedux.getters.volumeSnapshots(rootState);
  const navigate = useNavigate();

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Snapshot Name", sortKey: "snapshot_name" },
      { label: "Volume Name", align: "center" },
      {
        label: "Provider",
        align: "center",
        filterKey: "provider_id",
        filters: volumeSnapshots?.list?.filter_values?.provider?.map((item) => ({ label: `${item?.provider_name} (${item?.provider_id})`, value: item?.id })),
      },
      { label: "Provider Location", align: "center", filterKey: "provider_location", filters: volumeSnapshots?.list?.filter_values?.provider_location },
      { label: "Size (GiB)", align: "center", sortKey: "size" },
      {
        label: "Organisation",
        align: "center",
        filterKey: "organisation_id",
        filters: volumeSnapshots?.list?.filter_values?.organisation?.map((item) => ({ label: `${item?.name} (${item?.org_id})`, value: item?.id })),
      },
      {
        label: "Cloud Reg. A/C No.",
        align: "center",
        filterKey: "organisation_org_reg_code",
        filters: volumeSnapshots?.list?.filter_values?.organisation?.map((item) => ({ label: item?.org_reg_code, value: item?.org_reg_code })),
      },
      {
        label: "Project",
        align: "center",
        filterKey: "project_id",
        filters: volumeSnapshots?.list?.filter_values?.project?.map((item) => ({ label: `${item?.name} (${item?.project_id})`, value: item?.id })),
      },
      { label: "Compute Snapshot", align: "center" },
      { label: "Status", align: "center", sortKey: "status", filterKey: "status", filters: volumeSnapshots?.list?.filter_values?.status },
      { label: "Created", align: "center", sortKey: "created", defaultSort: "desc" },
    ],
    [volumeSnapshots?.list?.filter_values],
  );

  const exportColumns: string[] = useMemo(
    () => [
      "Snapshot Name",
      "Volume Name",
      "Provider Name",
      "Provider ID",
      "Provider Location",
      "Size (GiB)",
      "Organisation",
      "Organisation ID",
      "Cloud Reg. A/C No.",
      "Project Name",
      "Project ID",
      "Compute Snapshot Name",
      "Compute Snapshot Status",
      "Status",
      "Created",
    ],
    [],
  );

  const searchFields = useMemo(
    () => [
      { key: "snapshot_name", label: "Snapshot Name" },
      { key: "project_name", label: "Project Name" },
      { key: "project_project_id", label: "Project Id" },
      { key: "organisation_name", label: "Organisation Name" },
      { key: "organisation_org_id", label: "Org Id" },
      { key: "organisation_org_reg_code", label: "Cloud Reg. A/C No" },
      { key: "provider_location", label: "Provider Location" },
      { key: "provider_code", label: "Provider Code" },
    ],
    [],
  );

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.snapshot_name },
      { content: item?.volume?.volume_name, align: "center" },
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
      { content: item?.size, align: "center" },
      {
        content: (
          <Stack>
            <Box component="span">{item?.project?.organisation?.name}</Box>
            <Box component="span">({item?.project?.organisation?.org_id})</Box>
          </Stack>
        ),
        align: "center",
      },
      { content: item?.project?.organisation?.org_reg_code, align: "center" },
      {
        content: (
          <Stack>
            <Box component="span">{item?.project?.name}</Box>
            <Box component="span">({item?.project?.project_id})</Box>
          </Stack>
        ),
        align: "center",
      },
      {
        content: item?.compute_snapshot ? (
          <Stack>
            <Box component="span">{item?.compute_snapshot?.snapshot_name}</Box>
            <Box component="span">
              <StatusChip label={item?.compute_snapshot?.status} />
            </Box>
          </Stack>
        ) : null,
        align: "center",
      },
      { content: item?.status ? <StatusChip label={item?.status} /> : null, align: "center" },
      { content: formatDate(item?.created), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.snapshot_name,
      item?.volume?.volume_name,
      item?.provider?.provider_name,
      item?.provider?.provider_id,
      item?.provider?.provider_location,
      item?.size,
      item?.project?.organisation?.name,
      item?.project?.organisation?.org_id,
      item?.project?.organisation?.org_reg_code,
      item?.project?.name,
      item?.project?.project_id,
      item?.compute_snapshot?.snapshot_name,
      item?.compute_snapshot?.status?.toUpperCase(),
      item?.status?.toUpperCase(),
      formatDate(item?.created, false, true),
    ];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "Volume Snapshots Owner Details",
      onClick: (item) => fetchVolumeSnapshotsOwnerDetail(item),
    },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.id], resource_type: ["VolumeSnapshot"] } } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchVolumeSnapshots({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchVolumeSnapshots],
  );

  const dataList = useDataList({
    data: volumeSnapshots?.list?.data || [],
    totalRecords: volumeSnapshots?.totalRecords,
    columns,
    actions,
    exportFilename: "Volume Snapshot List",
    exportColumns,
    searchFields,
    defaultFilters,
    rowCreator,
    exportCreator,
    listExporter: exportVolumeSnapshots,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListVolumeSnapshots;
