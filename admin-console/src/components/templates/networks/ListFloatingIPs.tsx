import { Box, Stack } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import networksRedux from "store/modules/networks";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListFloatingIPProps {
  fetchFloatingIPs: any;
  exportFloatingIPs: any;
  fetchFloatingIpOwnerDetail: any;
  releaseFloatingIP: any;
}

const ListFloatingIPs: FC<ListFloatingIPProps> = ({ fetchFloatingIPs, exportFloatingIPs, fetchFloatingIpOwnerDetail, releaseFloatingIP }) => {
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const floatingIPs = networksRedux.getters.floatingIPs(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Floating IP", sortKey: "floating_ip" },
      {
        label: "Attached With",
        align: "center",
        sortKey: "attached_with_resource",
        filterKey: "attached_with_resource",
        filters: floatingIPs?.list?.filter_values?.attached_with_resource,
      },
      {
        label: "Cloud Reg. A/C No.",
        align: "center",
        filterKey: "organisation_org_reg_code",
        filters: floatingIPs?.list?.filter_values?.organisation?.map((item) => ({ label: item?.org_reg_code, value: item?.org_reg_code })),
      },
      {
        label: "Organisation",
        align: "center",
        filterKey: "organisation_id",
        filters: floatingIPs?.list?.filter_values?.organisation?.map((item) => ({ label: `${item?.name} (${item?.org_id})`, value: item?.id })),
        defaultHidden: true,
      },
      {
        label: "Project",
        align: "center",
        filterKey: "project_id",
        filters: floatingIPs?.list?.filter_values?.project?.map((item) => ({ label: `${item?.name} (${item?.project_id})`, value: item?.id })),
      },
      {
        label: "Provider",
        align: "center",
        filterKey: "provider_id",
        filters: floatingIPs?.list?.filter_values?.provider?.map((item) => ({ label: `${item?.provider_name} (${item?.provider_id})`, value: item?.id })),
      },
      { label: "Provider Location", align: "center", filterKey: "provider_location", filters: floatingIPs?.list?.filter_values?.provider_location, defaultHidden: true },
      {
        label: "Available",
        align: "center",
        sortKey: "is_available",
        filterKey: "is_available",
        filters: floatingIPs?.list?.filter_values?.is_available?.map((item) => ({ label: String(item?.label), value: item?.value })),
      },
      { label: "Created", align: "center", sortKey: "created", defaultSort: "desc" },
    ],
    [floatingIPs?.list?.filter_values],
  );

  const exportColumns: string[] = useMemo(
    () => [
      "Floating IP",
      "Attached With",
      "Cloud Reg. A/C No.",
      "Organisation Name",
      "Organisation ID",
      "Project Name",
      "Project ID",
      "Provider Name",
      "Provider ID",
      "Provider Location",
      "Is Available?",
      "Created",
    ],
    [],
  );

  const searchFields = useMemo(
    () => [
      { key: "floating_ip", label: "Floating IP" },
      { key: "attached_with_resource", label: "Attached With Resource" },
      { key: "organisation_org_reg_code", label: "Cloud Reg. A/C No." },
      { key: "organisation_org_id", label: "Organisation Code" },
      { key: "organisation_name", label: "Organisation Name" },
      { key: "provider_code", label: "Provider Code" },
      { key: "provider_location", label: "Provider Location" },
      { key: "project_project_id", label: "Project Code" },
      { key: "project_name", label: "Project Name" },
    ],
    [],
  );

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.floating_ip },
      { content: item?.attached_with_resource, align: "center" },
      // { content: item?.attached_with_resource !== null ? <StatusChip label={item?.attached_with_resource} /> : null, align: "center" },
      { content: item?.project?.organisation?.org_reg_code, align: "center" },
      {
        content: (
          <Stack>
            <Box component="span">{item?.project?.organisation?.name}</Box>
            <Box component="span">({item?.project?.organisation?.org_id})</Box>
          </Stack>
        ),
        align: "center",
      },
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
        content: (
          <Stack alignItems="center">
            <Box whiteSpace="nowrap">{item?.provider?.provider_name}</Box>
            <Box>({item?.provider?.provider_id})</Box>
          </Stack>
        ),
        align: "center",
      },
      { content: item?.provider?.provider_location, align: "center" },
      { content: item?.is_available !== null ? <StatusChip label={item?.is_available} /> : null, align: "center" },
      { content: formatDate(item?.created), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.floating_ip,
      item?.attached_with_resource,
      item?.project?.organisation?.org_reg_code,
      item?.project?.organisation?.name,
      item?.project?.organisation?.org_id,
      item?.project?.name,
      item?.project?.project_id,
      item?.provider?.provider_name,
      item?.provider?.provider_id,
      item?.provider?.provider_location,
      item?.is_available,
      formatDate(item?.created, false, true),
    ];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "Release Floating IP",
      confirmation: () => ({
        title: "Release Floating IP",
        description: "Are you sure you want to Release Floating IP?",
      }),
      onClick: (item) => releaseFloatingIP(item),
      // if (item.is_available == false) {
      //   disabled: () => true,
      // }
    },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.id], resource_type: ["Floating IP"] } } }),
    },
    {
      label: () => "Floating Ip Owner Details",
      onClick: (item) => fetchFloatingIpOwnerDetail(item),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchFloatingIPs({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchFloatingIPs],
  );

  const dataList = useDataList({
    data: floatingIPs?.list?.data || [],
    totalRecords: floatingIPs?.totalRecords,
    columns,
    actions,
    exportFilename: "FloatingIPs List",
    exportColumns,
    searchFields,
    createResourceButton: { text: "Reserve Floating IP", onClick: () => navigate("reserve") },
    rowCreator,
    exportCreator,
    listExporter: exportFloatingIPs,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListFloatingIPs;
