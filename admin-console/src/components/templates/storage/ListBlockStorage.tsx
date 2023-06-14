import { Box, Stack } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import { BsCamera } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import storageRedux from "store/modules/storage";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListBlockStorageProps {
  fetchBlockStorage: any;
  exportBlockStorage: any;
  fetchBlockStorageOwnerDetail: any;
}

const ListBlockStorage: FC<ListBlockStorageProps> = ({ fetchBlockStorage, exportBlockStorage, fetchBlockStorageOwnerDetail }) => {
  const rootState = useSelector((state: any) => state);
  const blockStorage = storageRedux.getters.blockStorage(rootState);
  const navigate = useNavigate();

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Volume Name", sortKey: "volume_name" },
      {
        label: "Provider",
        align: "center",
        filterKey: "provider_id",
        filters: blockStorage?.list?.filter_values?.provider?.map((item) => ({ label: `${item?.provider_name} (${item?.provider_id})`, value: item?.id })),
      },
      { label: "Provider Location", align: "center", filterKey: "provider_location", filters: blockStorage?.list?.filter_values?.provider_location },
      { label: "Volume Size (GiB)", align: "center", sortKey: "volume_size", filterKey: "volume_size", filters: blockStorage?.list?.filter_values?.volume_size },
      {
        label: "Organisation",
        align: "center",
        filterKey: "organisation_id",
        filters: blockStorage?.list?.filter_values?.organisation?.map((item) => ({ label: `${item?.name} (${item?.org_id})`, value: item?.id })),
      },
      {
        label: "Cloud Reg. A/C No.",
        align: "center",
        filterKey: "organisation_org_reg_code",
        filters: blockStorage?.list?.filter_values?.organisation?.map((item) => ({ label: item?.org_reg_code, value: item?.org_reg_code })),
      },
      {
        label: "Project",
        align: "center",
        filterKey: "project_id",
        filters: blockStorage?.list?.filter_values?.project?.map((item) => ({ label: `${item?.name} (${item?.project_id})`, value: item?.id })),
      },
      {
        label: "Bootable",
        align: "center",
        sortKey: "bootable",
        filterKey: "bootable",
        filters: blockStorage?.list?.filter_values?.bootable?.map((item) => ({ label: String(item?.label), value: item?.value })),
      },
      { label: "Action", align: "center", sortKey: "action", filterKey: "action", filters: blockStorage?.list?.filter_values?.action },
      { label: "Status", align: "center", sortKey: "status", filterKey: "status", filters: blockStorage?.list?.filter_values?.status },
      { label: "Created", align: "center", sortKey: "created", defaultSort: "desc" },
    ],
    [blockStorage?.list?.filter_values],
  );

  const exportColumns: string[] = useMemo(
    () => [
      "Volume Name",
      "Provider Name",
      "Provider ID",
      "Provider Location",
      "Volume Size",
      "Organisation",
      "Organisation ID",
      "Cloud Reg. A/C No.",
      "Project Name",
      "Project ID",
      "Bootable",
      "Action",
      "Status",
      "Created",
    ],
    [],
  );

  const searchFields = useMemo(
    () => [
      { key: "volume_name", label: "Volume Name" },
      { key: "project_name", label: "Project Name" },
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
      { content: item?.volume_name },
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
      { content: item?.volume_size, align: "center" },
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
      { content: item?.bootable !== null ? <StatusChip label={item?.bootable} /> : null, align: "center" },
      { content: item?.action ? <StatusChip label={item?.action} /> : null, align: "center" },
      { content: item?.status ? <StatusChip label={item?.status} /> : null, align: "center" },
      { content: formatDate(item?.created), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.volume_name,
      item?.provider?.provider_name,
      item?.provider?.provider_id,
      item?.provider?.provider_location,
      item?.volume_size,
      item?.project?.organisation?.name,
      item?.project?.organisation?.org_id,
      item?.project?.organisation?.org_reg_code,
      item?.project?.name,
      item?.project?.project_id,
      item?.bootable,
      item?.action?.toUpperCase(),
      item?.status?.toUpperCase(),
      formatDate(item?.created, false, true),
    ];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "List Attached Computes",
      icon: <BsCamera />,
      onClick: (item) => navigate(`/storage/${item?.id}/compute`, { state: { volume: item } }),
    },
    {
      label: () => "Block Storage Owner Details",
      onClick: (item) => fetchBlockStorageOwnerDetail(item),
    },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.id], resource_type: ["Volume"] } } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchBlockStorage({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchBlockStorage],
  );

  const dataList = useDataList({
    data: blockStorage?.list?.data || [],
    totalRecords: blockStorage?.totalRecords,
    columns,
    actions,
    exportFilename: "Block Storage List",
    exportColumns,
    searchFields,
    rowCreator,
    exportCreator,
    listExporter: exportBlockStorage,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListBlockStorage;
