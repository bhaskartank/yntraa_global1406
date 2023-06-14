import { Box, Stack } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import networksRedux from "store/modules/networks";

import ResourceName from "components/atoms/ResourceName";
import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListSecurityGroupProps {
  fetchSecurityGroups: any;
  exportSecurityGroups: any;
  fetchSecurityGroupOwnerDetail: any;
}

const ListSecurityGroups: FC<ListSecurityGroupProps> = ({ fetchSecurityGroups, exportSecurityGroups, fetchSecurityGroupOwnerDetail }) => {
  const rootState = useSelector((state: any) => state);
  const securityGroups = networksRedux.getters.securityGroups(rootState);
  const navigate = useNavigate();
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Name", sortKey: "security_group_name" },
      {
        label: "Type",
        align: "center",
        sortKey: "security_group_type",
        filterKey: "security_group_type",
        filters: securityGroups?.list?.filter_values?.security_group_type,
      },
      {
        label: "Cloud Reg. A/C No.",
        align: "center",
        filterKey: "organisation_org_reg_code",
        filters: securityGroups?.list?.filter_values?.organisation?.map((item) => ({ label: item?.org_reg_code, value: item?.org_reg_code })),
      },
      {
        label: "Organisation",
        align: "center",
        filterKey: "organisation_id",
        filters: securityGroups?.list?.filter_values?.organisation?.map((item) => ({ label: `${item?.name} (${item?.org_id})`, value: item?.id })),
        defaultHidden: true,
      },
      {
        label: "Project",
        align: "center",
        filterKey: "project_id",
        filters: securityGroups?.list?.filter_values?.project?.map((item) => ({ label: `${item?.name} (${item?.project_id})`, value: item?.id })),
      },
      {
        label: "Provider",
        align: "center",
        filterKey: "provider_id",
        filters: securityGroups?.list?.filter_values?.provider?.map((item) => ({ label: `${item?.provider_name} (${item?.provider_id})`, value: item?.id })),
      },
      { label: "Provider Location", align: "center", filterKey: "provider_location", filters: securityGroups?.list?.filter_values?.provider_location, defaultHidden: true },
      { label: "Managed By", align: "center", sortKey: "managed_by", filterKey: "managed_by", filters: securityGroups?.list?.filter_values?.managed_by },
      { label: "Status", align: "center", sortKey: "status", filterKey: "status", filters: securityGroups?.list?.filter_values?.status },
      { label: "Created On", align: "center", sortKey: "created", defaultSort: "desc" },
    ],
    [securityGroups?.list?.filter_values],
  );

  const exportColumns: string[] = useMemo(
    () => [
      "Name",
      "Type",
      "Cloud Reg. A/C No.",
      "Organisation",
      "Organisation ID",
      "Project Name",
      "Project ID",
      "Provider Name",
      "Provider ID",
      "Provider Location",
      "Managed By",
      "Status",
      "Created On",
    ],
    [],
  );

  const searchFields = useMemo(
    () => [
      { key: "security_group_name", label: "Security Group Name" },
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
      { content: <ResourceName label={item?.security_group_name} /> },
      { content: item?.security_group_type !== null ? item?.security_group_type.replace("_", " ").toUpperCase() : "-", align: "center" },
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
      { content: item?.managed_by !== null && item?.managed_by !== undefined ? <StatusChip label={item?.managed_by} /> : null, align: "center" },
      { content: item?.status ? <StatusChip label={item?.status} /> : null, align: "center" },
      { content: formatDate(item?.created), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.security_group_name,
      item?.security_group_type.replace("_", " ").toUpperCase(),
      item?.project?.organisation?.org_reg_code,
      item?.project?.organisation?.name,
      item?.project?.organisation?.org_id,
      item?.project?.name,
      item?.project?.project_id,
      item?.provider?.provider_name,
      item?.provider?.provider_id,
      item?.provider?.provider_location,
      item?.managed_by,
      item?.status?.toUpperCase(),
      formatDate(item?.created, false, true),
    ];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "Manage Security Rules",
      onClick: (item) => navigate(`/networks/security-groups/${item?.id}/rules`, { state: { securityGroup: item, providerId: item?.provider_id, projectId: item?.project_id } }),
    },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.id], resource_type: ["SecurityGroup"] } } }),
    },
    {
      label: () => "Security Group Owner Details",
      onClick: (item) => fetchSecurityGroupOwnerDetail(item),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchSecurityGroups({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchSecurityGroups],
  );

  const dataList = useDataList({
    data: securityGroups?.list?.data || [],
    totalRecords: securityGroups?.totalRecords,
    columns,
    actions,
    exportFilename: "SecurityGroups List",
    exportColumns,
    searchFields,
    rowCreator,
    exportCreator,
    listExporter: exportSecurityGroups,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListSecurityGroups;
