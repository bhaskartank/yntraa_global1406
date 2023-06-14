import { Box, Stack } from "@mui/material";
import { FC, useCallback, useMemo } from "react";

import { useSelector } from "store";
import scalingGroupsRedux from "store/modules/scalingGroups";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListScalingGroupProps {
  fetchScalingGroups: any;
  exportScalingGroups: any;
  fetchScalingOwnerDetail: any;
}

const ListScalingGroups: FC<ListScalingGroupProps> = ({ fetchScalingGroups, exportScalingGroups, fetchScalingOwnerDetail }) => {
  const rootState = useSelector((state: any) => state);
  const scalingGroups = scalingGroupsRedux.getters.scalingGroups(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Name", sortKey: "name" },
      {
        label: "Provider",
        align: "center",
        filterKey: "provider_id",
        filters: scalingGroups?.list?.filter_values?.provider?.map((item) => ({ label: `${item?.provider_name} (${item?.provider_id})`, value: item?.id })),
      },
      { label: "Provider Location", align: "center", filterKey: "provider_location", filters: scalingGroups?.list?.filter_values?.provider_location },
      {
        label: "Image",
        align: "center",
        filterKey: "image_id",
        filters: scalingGroups?.list?.filter_values?.image?.map((item) => ({ label: item?.name, value: item?.id })),
      },
      { label: "Cluster Size", align: "center", sortKey: "cluster_size", filterKey: "cluster_size", filters: scalingGroups?.list?.filter_values?.cluster_size },
      { label: "LB VM IP", align: "center", sortKey: "lb_vm_ip" },
      {
        label: "Organisation",
        align: "center",
        filterKey: "organisation_id",
        filters: scalingGroups?.list?.filter_values?.organisation?.map((item) => ({ label: `${item?.name} (${item?.org_id})`, value: item?.id })),
      },
      {
        label: "Cloud Reg. A/C No.",
        align: "center",
        filterKey: "organisation_org_reg_code",
        filters: scalingGroups?.list?.filter_values?.organisation?.map((item) => ({ label: item?.org_reg_code, value: item?.org_reg_code })),
      },
      {
        label: "Project",
        align: "center",
        filterKey: "project_id",
        filters: scalingGroups?.list?.filter_values?.project?.map((item) => ({ label: `${item?.name} (${item?.project_id})`, value: item?.id })),
      },
      { label: "Status", align: "center", sortKey: "status", filterKey: "status", filters: scalingGroups?.list?.filter_values?.status },
      { label: "Created", align: "center", sortKey: "created", defaultSort: "desc" },
    ],
    [scalingGroups?.list?.filter_values],
  );

  const exportColumns: string[] = useMemo(
    () => [
      "Name",
      "Provider Name",
      "Provider ID",
      "Provider Location",
      "Image",
      "Cluster Size",
      "LB VM IP",
      "Organisation",
      "Organisation ID",
      "Cloud Reg. A/C No.",
      "Project Name",
      "Project ID",
      "Status",
      "Created",
    ],
    [],
  );

  const searchFields = useMemo(() => [{ key: "name", label: "Name" }], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.name },
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
      { content: item?.image?.name, align: "center" },
      { content: item?.cluster_size, align: "center" },
      { content: item?.lb_vm_ip, align: "center" },
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
      { content: item?.status ? <StatusChip label={item?.status} /> : null, align: "center" },
      { content: formatDate(item?.created, true, false, true), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.name,
      item?.provider?.provider_name,
      item?.provider?.provider_id,
      item?.provider?.provider_location,
      item?.image?.name,
      item?.cluster_size,
      item?.lb_vm_ip,
      item?.project?.organisation?.name,
      item?.project?.organisation?.org_id,
      item?.project?.organisation?.org_reg_code,
      item?.project?.name,
      item?.project?.project_id,
      item?.status?.toUpperCase(),
      formatDate(item?.created, false, true, true),
    ];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "Scaling group Owner Details",
      onClick: (item) => fetchScalingOwnerDetail(item),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchScalingGroups({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchScalingGroups],
  );

  const dataList = useDataList({
    data: scalingGroups?.list?.data || [],
    totalRecords: scalingGroups?.totalRecords,
    columns,
    actions,
    exportFilename: "Scaling Groups List",
    exportColumns,
    searchFields,
    rowCreator,
    exportCreator,
    listExporter: exportScalingGroups,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListScalingGroups;
