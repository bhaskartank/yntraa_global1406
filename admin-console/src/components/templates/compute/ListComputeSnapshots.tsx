import { Box, Stack } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import virtualMachinesRedux from "store/modules/virtualMachines";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListComputeSnapshotProps {
  fetchComputeSnapshots: any;
  exportComputeSnapshots: any;
  updateSnapshotStatus: (item: any) => void;
  fetchComputeSnapshotsOwnerDetail: any;
}

const ListComputeSnapshots: FC<ListComputeSnapshotProps> = ({ fetchComputeSnapshots, exportComputeSnapshots, updateSnapshotStatus, fetchComputeSnapshotsOwnerDetail }) => {
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const computeSnapshots = virtualMachinesRedux.getters.computeSnapshots(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Snapshot Name", sortKey: "snapshot_name" },
      { label: "Compute Name", align: "center" },
      {
        label: "Cloud Reg. A/C No.",
        align: "center",
        filterKey: "organisation_org_reg_code",
        filters: computeSnapshots?.list?.filter_values?.organisation?.map((item) => ({ label: item?.org_reg_code, value: item?.org_reg_code })),
      },
      {
        label: "Organisation",
        align: "center",
        filterKey: "organisation_id",
        filters: computeSnapshots?.list?.filter_values?.organisation?.map((item) => ({ label: `${item?.name} (${item?.org_id})`, value: item?.id })),
      },
      {
        label: "Project",
        align: "center",
        filterKey: "project_id",
        filters: computeSnapshots?.list?.filter_values?.project?.map((item) => ({ label: `${item?.name} (${item?.project_id})`, value: item?.id })),
      },
      {
        label: "Provider",
        align: "center",
        filterKey: "provider_id",
        filters: computeSnapshots?.list?.filter_values?.provider?.map((item) => ({ label: `${item?.provider_name} (${item?.provider_id})`, value: item?.id })),
      },
      { label: "Provider Location", align: "center", filterKey: "provider_location", filters: computeSnapshots?.list?.filter_values?.provider_location, defaultHidden: true },
      {
        label: "Image?",
        align: "center",
        sortKey: "is_image",
        filterKey: "is_image",
        filters: computeSnapshots?.list?.filter_values?.is_image?.map((item) => ({ label: String(item?.label), value: item?.value })),
      },

      { label: "Action", align: "center", sortKey: "action", filterKey: "action", filters: computeSnapshots?.list?.filter_values?.action, defaultHidden: true },
      { label: "Status", align: "center", sortKey: "status", filterKey: "status", filters: computeSnapshots?.list?.filter_values?.status },
      { label: "Created", align: "center", sortKey: "created", defaultSort: "desc" },
    ],
    [computeSnapshots?.list?.filter_values],
  );

  const exportColumns: string[] = useMemo(
    () => [
      "Snapshot Name",
      "Provider Name",
      "Provider ID",
      "Provider Location",
      "Compute Name",
      "Active",
      "Image",
      "Organisation",
      "Organisation ID",
      "Cloud Reg. A/C No.",
      "Project Name",
      "Project ID",
      "Action",
      "Status",
      "Created",
    ],
    [],
  );

  const searchFields = useMemo(
    () => [
      { key: "snapshot_name", label: "Snapshot Name" },
      { key: "provider_snapshot_id", label: "Provider Snapshot ID" },
      { key: "instance_name", label: "Instance Name" },
      { key: "project_name", label: "Project Name" },
      { key: "project_project_id", label: "Project ID" },
      { key: "organisation_name", label: "Organisation Name" },
      { key: "organisation_org_id", label: "Organisation ID" },
      { key: "organisation_org_reg_code", label: "Cloud Reg. A/C No." },
      { key: "provider_location", label: "Provider Location" },
      { key: "provider_code", label: "Provider Code" },
    ],
    [],
  );

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.snapshot_name },
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
      { content: item?.compute?.instance_name, align: "center" },
      { content: item?.is_active !== null ? <StatusChip label={item?.is_active} /> : null, align: "center" },
      { content: item?.is_image !== null ? <StatusChip label={item?.is_image} /> : null, align: "center" },
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
      { content: item?.action !== null ? <StatusChip label={item?.action} /> : null, align: "center" },
      { content: item?.status ? <StatusChip label={item?.status} /> : null, align: "center" },
      { content: formatDate(item?.created, true, false), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.snapshot_name,
      item?.provider?.provider_name,
      item?.provider?.provider_id,
      item?.provider?.provider_location,
      item?.compute?.instance_name,
      item?.is_active,
      item?.is_image,
      item?.project?.organisation?.name,
      item?.project?.organisation?.org_id,
      item?.project?.organisation?.org_reg_code,
      item?.project?.name,
      item?.project?.project_id,
      item?.action?.toUpperCase(),
      item?.status?.toUpperCase(),
      formatDate(item?.created, false, true),
    ];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "View Details",
      onClick: (item) => navigate(`${item?.id}/view-details`, { state: { ComputeSnapshotsData: item } }),
    },
    {
      label: () => "Update Snapshot Status",
      confirmation: () => ({
        title: "Update Snapshot Status",
        description: "Are you sure you want to update snapshot status?",
      }),
      onClick: (item) => updateSnapshotStatus(item),
      hidden: (item) => item?.status?.toLowerCase() === "deleted",
    },
    {
      label: () => "Snapshots Owner Details",
      onClick: (item) => fetchComputeSnapshotsOwnerDetail(item),
    },
    {
      label: () => "View related VMs",
      onClick: (item) => navigate("/compute/types", { state: { defaultFilters: { image_name: [item?.snapshot_name] } } }),
    },
    {
      label: () => "View Volume Snapshots",
      onClick: (item) => navigate("/storage/snapshots", { state: { defaultFilters: { id: item?.volume_snapshot_compute_snapshot?.map((volumeSnapshot) => volumeSnapshot?.id) } } }),
    },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.id], resource_type: ["ComputeSnapshot"] } } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchComputeSnapshots({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchComputeSnapshots],
  );

  const dataList = useDataList({
    data: computeSnapshots?.list?.data || [],
    totalRecords: computeSnapshots?.totalRecords,
    columns,
    actions,
    exportFilename: "Compute Snapshots List",
    exportColumns,
    searchFields,
    rowCreator,
    exportCreator,
    listExporter: exportComputeSnapshots,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListComputeSnapshots;
