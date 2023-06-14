import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import organisationsRedux from "store/modules/organisations";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListOrganisationOnboardingChangeRequestsProps {
  fetchOnboardingChangeRequests: any;
  exportOnboardingChangeRequests: any;
  defaultFilters: any;
}

const ListOrganisationOnboardingChangeRequests: FC<ListOrganisationOnboardingChangeRequestsProps> = ({
  fetchOnboardingChangeRequests,
  exportOnboardingChangeRequests,
  defaultFilters,
}) => {
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const organisationChangeRequests = organisationsRedux.getters.organisationChangeRequests(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      {
        label: "Cloud Reg. A/C No.",
        align: "center",
        sortKey: "org_reg_code",
        filterKey: "org_reg_code",
        filters: organisationChangeRequests?.list?.filter_values?.org_reg_code,
      },
      {
        label: "Organisation Name",
        align: "center",
        sortKey: "name",
        filterKey: "name",
        filters: organisationChangeRequests?.list?.filter_values?.name,
      },
      { label: "Organisation Description", align: "center", defaultHidden: true },
      {
        label: "Project Name",
        align: "center",
        sortKey: "project_name",
        filterKey: "project_name",
        filters: organisationChangeRequests?.list?.filter_values?.project_name,
      },
      { label: "Project Description", align: "center", defaultHidden: true },
      {
        label: "Status",
        align: "center",
        sortKey: "status",
        filterKey: "status",
        filters: organisationChangeRequests?.list?.filter_values?.status,
      },
      { label: "Request Date", align: "center", sortKey: "created", defaultSort: "desc" },
    ],
    [organisationChangeRequests?.list],
  );

  const exportColumns: string[] = useMemo(
    () => ["Cloud Reg. A/C No.", "Organisation Name", "Organisation Description", "Project Name", "Project Description", "Status", "Request Date"],
    [],
  );

  const searchFields = useMemo(
    () => [
      { key: "org_reg_code", label: "Cloud Reg. A/C No." },
      { key: "name", label: "Organisation Name" },
      { key: "project_name", label: "Project Name" },
      { key: "status", label: "Status" },
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
      { content: item?.status ? <StatusChip label={item?.status} /> : null, align: "center" },
      { content: formatDate(item?.created), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [item?.org_reg_code, item?.name, item?.description, item?.project_name, item?.project_description, item?.status?.toUpperCase(), formatDate(item?.created, false, true)];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "View Request",
      onClick: (item) => navigate(`${item?.id}/request-details`, { state: { onboardingChangeRequestDetail: item } }),
    },
    {
      label: () => "User Details",
      onClick: (item) => navigate(`${item?.id}/users`, { state: { onboardingChangeRequestDetail: item } }),
    },
    {
      label: () => "View Organisation",
      onClick: (item) => navigate("/organisations", { state: { defaultFilters: { org_reg_code: [item?.org_reg_code] } } }),
      hidden: (item) => item?.status !== "approved",
    },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.id], resource_type: ["Onboard Update Request"] } } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchOnboardingChangeRequests({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchOnboardingChangeRequests],
  );

  const dataList = useDataList({
    data: organisationChangeRequests?.list?.data || [],
    totalRecords: organisationChangeRequests?.totalRecords,
    columns,
    actions,
    exportFilename: "Organisations Onboarding Change Requests",
    exportColumns,
    searchFields,
    defaultFilters,
    rowCreator,
    exportCreator,
    listExporter: exportOnboardingChangeRequests,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListOrganisationOnboardingChangeRequests;
