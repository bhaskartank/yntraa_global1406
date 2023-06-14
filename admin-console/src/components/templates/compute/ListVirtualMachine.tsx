import { Box, Divider, Stack, Typography } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import ResourceName from "components/atoms/ResourceName";
import StatusChip from "components/atoms/StatusChip";
import UnitFilter from "components/atoms/UnitFilter";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { getOsImgUrl } from "utilities";
import { formatDate } from "utilities/comp";

import ComputeDetailBar from "../../molecules/DetailBars/ComputeDetailBar";

interface ListVirtualMachineProps {
  compute: any;
  fetchVMList: any;
  vmListExport: any;
  fetchCurrentStatus: any;
  markVMAsError: any;
  fetchConsoleURL: any;
  fetchConsoleLogs: any;
  defaultFilters: any;
  fetchOwnerDetail: any;
}

const ListVirtualMachine: FC<ListVirtualMachineProps> = (props) => {
  const { compute, fetchVMList, vmListExport, fetchCurrentStatus, markVMAsError, fetchConsoleURL, fetchConsoleLogs, fetchOwnerDetail, defaultFilters } = props;

  const navigate = useNavigate();

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Name", sortKey: "instance_name" },
      {
        label: "Cloud Reg. A/C No.",
        filterKey: "organisation_org_reg_code",
        filters: compute?.list?.filter_values?.organisation?.map((item) => ({ label: item?.org_reg_code, value: item?.org_reg_code })),
        align: "center",
      },
      {
        label: "Organisation",
        filterKey: "organisation_id",
        filters: compute?.list?.filter_values?.organisation?.map((item) => ({ label: `${item?.name} (${item?.org_id})`, value: item?.id })),
        align: "center",
        defaultHidden: true,
      },
      {
        label: "Project",
        filterKey: "project_id",
        filters: compute?.list?.filter_values?.project?.map((item) => ({ label: `${item?.name} (${item?.project_id})`, value: item?.id })),
        align: "center",
      },
      {
        label: "Provider",
        filterKey: "provider_id",
        filters: compute?.list?.filter_values?.provider?.map((item) => ({ label: `${item?.provider_name} (${item?.provider_id})`, value: item?.id })),
        align: "center",
      },
      {
        label: "Image",
        filterKey: "image_id",
        filters: compute?.list?.filter_values?.image?.map((item) => ({ label: item?.name, value: item?.id })),
        align: "center",
        defaultHidden: true,
      },
      {
        label: "Flavor",
        filterKey: "flavor_id",
        filters: compute?.list?.filter_values?.flavor?.map((item) => ({ label: item?.name, value: item?.id })),
        align: "center",
        defaultHidden: true,
      },
      {
        label: "Availability Zone",
        sortKey: "availability_zone",
        filterKey: "availability_zone",
        filters: compute?.list?.filter_values?.availability_zone,
        align: "center",
        defaultHidden: true,
      },
      { label: "Instance Type", sortKey: "instance_type", filterKey: "instance_type", filters: compute?.list?.filter_values?.instance_type, align: "center", defaultHidden: true },
      { label: "Private IP", sortKey: "private_ip", align: "center", defaultHidden: true },
      { label: "Power State", sortKey: "action", filterKey: "action", filters: compute?.list?.filter_values?.action, align: "center" },
      { label: "Status", sortKey: "status", filterKey: "status", filters: compute?.list?.filter_values?.status, align: "center" },
      { label: "Created", sortKey: "created", defaultSort: "desc" },
    ],
    [compute?.list],
  );

  const exportColumns: string[] = useMemo(
    () => [
      "Instance Name",
      "Cloud Reg. A/C No.",
      "Organisation Name",
      "Organisation Code",
      "Project Name",
      "Project Code",
      "Provider Name",
      "Provider Code",
      "Image",
      "Flavor",
      "Availability Zone",
      "Instance Type",
      "Private IP",
      "Power State",
      "Status",
      "Created",
    ],
    [],
  );

  const searchFields = useMemo(
    () => [
      { key: "instance_name", label: "Instance Name", defaultSelected: true },
      { key: "private_ip", label: "Private IP" },
      { key: "project_name", label: "Project Name" },
      { key: "project_project_id", label: "Project ID" },
      { key: "organisation_name", label: "Organisation Name" },
      { key: "organisation_org_id", label: "Organisation ID" },
      { key: "organisation_org_reg_code", label: "Cloud Reg. A/C No." },
      { key: "provider_location", label: "Provider Location" },
    ],
    [],
  );

  const actions: ActionProps[] = [
    {
      label: () => "View Details",
      onClick: (item) => navigate(`/compute/${item?.id}/overview`, { state: { compute: item } }),
    },
    {
      label: () => "Manage Snapshots",
      onClick: (item) => navigate(`/compute/${item?.id}/snapshots`, { state: { compute: item } }),
    },
    {
      label: () => "Manage Volumes",
      onClick: (item) => navigate(`/compute/${item?.id}/volumes`, { state: { compute: item } }),
    },
    {
      label: () => "Manage Networks",
      onClick: (item) => navigate(`/compute/${item?.id}/networks`, { state: { compute: item } }),
    },
    {
      label: () => "Manage Security Group",
      onClick: (item) => navigate(`/compute/${item?.id}/security-groups`, { state: { compute: item } }),
    },
    {
      label: () => "Get Current VM Status",
      onClick: (item) => fetchCurrentStatus(item),
      confirmation: (item) => ({
        title: "Get Current VM Status",
        resourceDetails: <ComputeDetailBar compute={item} />,
        description: "Are you sure you want to fetch current status of this virtual machine?",
      }),
      hidden: (item) => item?.status.toLowerCase() === "deleted",
    },
    {
      label: () => "Mark VM as Error",
      onClick: (item) => markVMAsError(item),
      confirmation: (item) => ({
        title: "Mark VM as Error",
        resourceDetails: <ComputeDetailBar compute={item} />,
        description: "Are you sure you want to mark this resource as Error?",
      }),
      hidden: (item) => item?.instance_type.toLowerCase() !== "vm" || item?.status.toLowerCase() === "deleted",
    },
    {
      label: () => "Show VM Console",
      onClick: (item) => fetchConsoleURL(item),
      hidden: (item) => item?.status.toLowerCase() === "deleted",
    },
    {
      label: () => "Console Logs",
      onClick: (item) => fetchConsoleLogs(item),
      hidden: (item) => item?.status.toLowerCase() === "deleted",
    },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.id], resource_type: ["Compute"] } } }),
    },
    {
      label: () => "Event Logs",
      onClick: (item) => navigate(`/compute/${item?.id}/event-logs`, { state: { compute: item } }),
    },
    {
      label: () => "Owner Details",
      onClick: (item) => fetchOwnerDetail(item),
    },
  ];

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      {
        content: (
          <Stack direction="row" alignItems="center">
            <Box
              sx={{
                mr: 1,
                width: "2.4rem",
                minWidth: "2.4rem",
                height: "2.4rem",
                minHeight: "2.4rem",
                border: "1px solid #f0f0f0",
                background: `#ffffff url("${getOsImgUrl(item?.image?.os)}") no-repeat center center`,
                backgroundSize: "90%",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            />
            <Stack>
              <ResourceName label={item?.instance_name} onClick={() => navigate(`/compute/${item?.id}/overview`, { state: { compute: item } })} noWrap />

              <Stack direction="row" spacing="4px" alignItems="center" divider={<Divider orientation="vertical" flexItem />}>
                <Typography component="span" variant="caption">
                  {item?.flavor?.vcpus} vCPU
                </Typography>
                <Typography component="span" variant="caption">
                  <UnitFilter size={item?.flavor?.ram} unit="GiB" flavorType="ram" />
                </Typography>
                <Typography component="span" variant="caption">
                  <UnitFilter size={item?.flavor?.disk} unit="GiB" flavorType="disk" /> <span>BLOCK</span>
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        ),
      },
      {
        content: (
          <Box component="span" sx={{ whiteSpace: "nowrap" }}>
            {item?.project?.organisation?.org_reg_code}
          </Box>
        ),
        align: "center",
      },
      {
        content: (
          <Stack>
            <Box component="span" sx={{ whiteSpace: "nowrap" }}>
              {item?.project?.organisation?.name}
            </Box>
            <Box component="span" sx={{ whiteSpace: "nowrap" }}>
              ({item?.project?.organisation?.org_id})
            </Box>
          </Stack>
        ),
        align: "center",
      },
      {
        content: (
          <Stack>
            <Box component="span" sx={{ whiteSpace: "nowrap" }}>
              {item?.project?.name}
            </Box>
            <Box component="span" sx={{ whiteSpace: "nowrap" }}>
              ({item?.project?.project_id})
            </Box>
          </Stack>
        ),
        align: "center",
      },
      {
        content: (
          <Stack>
            <Box component="span" sx={{ whiteSpace: "nowrap" }}>
              {item?.provider?.provider_name}
            </Box>
            <Box component="span" sx={{ whiteSpace: "nowrap" }}>
              ({item?.provider?.provider_id})
            </Box>
          </Stack>
        ),
        align: "center",
      },
      {
        content: (
          <Box component="span" sx={{ whiteSpace: "nowrap" }}>
            {item?.image?.name}
          </Box>
        ),
        align: "center",
      },
      {
        content: (
          <Box component="span" sx={{ whiteSpace: "nowrap" }}>
            {item?.flavor?.name}
          </Box>
        ),
        align: "center",
      },
      { content: item?.availability_zone, align: "center" },
      { content: item?.instance_type, align: "center" },
      { content: item?.private_ip, align: "center" },
      { content: item?.status?.toLowerCase() === "deleted" ? null : item?.action ? <StatusChip label={item?.action} /> : null, align: "center" },
      { content: item?.status ? <StatusChip label={item?.status} /> : null, align: "center" },
      { content: formatDate(item?.created), align: "center" },
    ],
    [navigate],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.instance_name,
      item?.project?.organisation?.org_reg_code,
      item?.project?.organisation?.name,
      item?.project?.organisation?.org_id,
      item?.project?.name,
      item?.project?.project_id,
      item?.provider?.provider_name,
      item?.provider?.provider_id,
      item?.image?.name,
      item?.flavor?.name,
      item?.availability_zone,
      item?.instance_type,
      item?.private_ip,
      item?.action?.toUpperCase(),
      item?.status?.toUpperCase(),
      formatDate(item?.created, false, true),
    ];
  }, []);

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchVMList({ limit, offset, sort_by: orderBy, sort_asc: order === "asc", search, filters }),
    [fetchVMList],
  );

  const dataList = useDataList({
    data: compute?.list?.data || [],
    totalRecords: compute?.totalRecords,
    columns,
    exportColumns,
    searchFields,
    exportFilename: "VM Resources",
    actions,
    defaultFilters,
    rowCreator,
    exportCreator,
    listExporter: vmListExport,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListVirtualMachine;
