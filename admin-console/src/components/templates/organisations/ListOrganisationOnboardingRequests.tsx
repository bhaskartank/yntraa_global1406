import useIsInternalType from "hooks/useIsInternalType";
import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import organisationsRedux from "store/modules/organisations";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListOrganisationOnboardingRequestsProps {
  fetchOnboardingRequests: any;
  exportOnboardingRequests: any;
  defaultFilters: any;
}

const ListOrganisationOnboardingRequests: FC<ListOrganisationOnboardingRequestsProps> = ({ fetchOnboardingRequests, exportOnboardingRequests, defaultFilters }) => {
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const organisationRequests = organisationsRedux.getters.organisationRequests(rootState);
  const isInternalType = useIsInternalType();

  const columns: ColumnProps[] = useMemo(
    () => [
      {
        label: "Cloud Reg. A/C No.",
        align: "center",
        sortKey: "org_reg_code",
        filterKey: "org_reg_code",
        filters: organisationRequests?.list?.filter_values?.org_reg_code,
      },
      { label: "Organisation Name", align: "center", sortKey: "name" },
      { label: "Organisation Description", align: "center", defaultHidden: true },
      { label: "Project Name", align: "center", sortKey: "project_name" },
      { label: "Project Description", align: "center", defaultHidden: true },
      {
        label: "Provider Location",
        align: "center",
        sortKey: "provider_location",
        filterKey: "provider_location",
        filters: organisationRequests?.list?.filter_values?.provider_location,
      },
      {
        label: "Quota Package",
        align: "center",
        sortKey: "quotapackage_name",
        filterKey: "quotapackage_name",
        filters: organisationRequests?.list?.filter_values?.quotapackage_name,
      },
      { label: "Status", align: "center", sortKey: "status", filterKey: "status", filters: organisationRequests?.list?.filter_values?.status },
      { label: "Request Date", align: "center", sortKey: "created", defaultSort: "desc" },
    ],
    [organisationRequests?.list],
  );

  const exportColumns: string[] = useMemo(
    () => [
      "Cloud Reg. A/C No.",
      "Organisation Name",
      "Organisation Description",
      "Project Name",
      "Project Description",
      "Provider Location",
      "Quota Package",
      "Status",
      "Request Date",
    ],
    [],
  );

  const searchFields = useMemo(
    () => [
      { key: "org_reg_code", label: "Cloud Reg. A/C No." },
      { key: "name", label: "Organisation Name" },
      { key: "project_name", label: "Project Name" },
      { key: "provider_location", label: "Provider Location" },
      { key: "quotapackage_name", label: "Quota Package" },
    ],
    [],
  );

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.org_reg_code },
      { content: item?.name, align: "center" },
      { content: item?.description, align: "center" },
      { content: item?.project_name, align: "center" },
      { content: item?.project_description, align: "center" },
      { content: item?.provider_location, align: "center" },
      { content: item?.quotapackage_name?.toUpperCase(), align: "center" },
      { content: item?.status ? <StatusChip label={item?.status} /> : null, align: "center" },
      { content: formatDate(item?.created), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.org_reg_code,
      item?.name,
      item?.description,
      item?.project_name,
      item?.project_description,
      item?.provider_location,
      item?.quotapackage_name?.toUpperCase(),
      item?.status?.toUpperCase(),
      formatDate(item?.created, false, true),
    ];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "View Request",
      onClick: (item) => navigate(`${item?.id}/request-details`, { state: { onboardingRequestDetail: item } }),
    },
    {
      label: () => "User Details",
      onClick: (item) => navigate(`${item?.id}/users`, { state: { onboardingRequestDetail: item } }),
    },
    {
      label: () => "View Organisation",
      onClick: (item) => navigate("/organisations", { state: { defaultFilters: { org_reg_code: [item?.org_reg_code] } } }),
      hidden: (item) => item?.status !== "approved",
    },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.id], resource_type: ["Onboard Request"] } } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchOnboardingRequests({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchOnboardingRequests],
  );

  const dataList = useDataList({
    data: organisationRequests?.list?.data || [],
    totalRecords: organisationRequests?.totalRecords,
    columns,
    exportFilename: "Organisations Onboarding Requests",
    exportColumns,
    searchFields,
    actions,
    defaultFilters,
    rowCreator,
    exportCreator,
    listExporter: exportOnboardingRequests,
    reload,
    ...(isInternalType ? { createResourceButton: { text: "Create Request", onClick: () => navigate("create") } } : {}),
  });

  return <DataList dataList={dataList} />;
};

export default ListOrganisationOnboardingRequests;
