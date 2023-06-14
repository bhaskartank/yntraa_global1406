import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import organisationsRedux from "store/modules/organisations";

import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListOrganisationProps {
  fetchOrganisations: any;
  exportOrganisations: any;
  defaultFilters: any;
}

const ListOrganisations: FC<ListOrganisationProps> = ({ fetchOrganisations, exportOrganisations, defaultFilters }) => {
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const organisations = organisationsRedux.getters.organisations(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Cloud Reg. A/C No.", sortKey: "org_reg_code", filterKey: "org_reg_code", filters: organisations?.list?.filter_values?.org_reg_code },
      { label: "Organisation Code", align: "center", sortKey: "org_id", filterKey: "org_id", filters: organisations?.list?.filter_values?.org_id },
      { label: "Organisation Name", align: "center", sortKey: "name" },
      { label: "Description", align: "center", sortKey: "description" },
      { label: "Onboarded On", sortKey: "created", align: "center", defaultSort: "desc" },
    ],
    [organisations?.list],
  );

  const exportColumns: string[] = useMemo(() => ["Cloud Reg. A/C No.", "Organisation Code", "Organisation Name", "Description", "Onboarded On"], []);

  const searchFields = useMemo(
    () => [
      { key: "org_reg_code", label: "Cloud Reg. A/C No." },
      { key: "org_id", label: "Organisation Code" },
      { key: "name", label: "Organisation Name" },
      { key: "description", label: "Description" },
    ],
    [],
  );

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.org_reg_code },
      { content: item?.org_id, align: "center" },
      { content: item?.name, align: "center" },
      { content: item?.description, align: "center" },
      { content: formatDate(item?.created), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [item?.org_reg_code, item?.org_id, item?.name, item?.description, formatDate(item?.created, false, true)];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "View Details",
      onClick: (item) => navigate(`${item?.id}/view-details`, { state: { listOrganisationDetail: item } }),
    },
    {
      label: () => "Project Details",
      onClick: (item) => navigate("/organisations/projects", { state: { defaultFilters: { organisation_id: [item?.id] } } }),
    },
    {
      label: () => "Compute Details",
      onClick: (item) => navigate("/compute/types", { state: { defaultFilters: { organisation_id: [item?.id] } } }),
    },
    {
      label: () => "Load Balancer Details",
      onClick: (item) => navigate("/load-balancers", { state: { defaultFilters: { organisation_id: [item?.id] } } }),
    },
    {
      label: () => "User Details",
      onClick: (item) => navigate(`${item?.id}/users`),
    },
    {
      label: () => "Quota Details",
      onClick: (item) => navigate(`${item?.id}/quota`),
    },
    {
      label: () => "Image Details",
      onClick: (item) => navigate(`${item?.id}/images`),
    },
    {
      label: () => "Flavor Details",
      onClick: (item) => navigate(`${item?.id}/flavors`),
    },
    {
      label: () => "Availability Zone Details",
      onClick: (item) => navigate(`${item?.id}/zones`),
    },
    {
      label: () => "Onboarding Requests",
      onClick: (item) => navigate("/organisations/onboard-request", { state: { defaultFilters: { org_reg_code: [item?.org_reg_code] } } }),
    },
    {
      label: () => "Onboarding Change Requests",
      onClick: (item) => navigate("/organisations/change-request", { state: { defaultFilters: { org_reg_code: [item?.org_reg_code] } } }),
    },
    {
      label: () => "Quota Update Requests",
      onClick: (item) => navigate("/organisations/quota-update", { state: { defaultFilters: { organisation_id: [item?.id] } } }),
    },
    {
      label: () => "Quota Topup Requests",
      onClick: (item) => navigate("/organisations/quota-topup", { state: { defaultFilters: { organisation_id: [item?.id] } } }),
    },
    {
      label: () => "Quota Topup Withdrawal Requests",
      onClick: (item) => navigate("/organisations/quota-withdraw", { state: { defaultFilters: { organisation_id: [item?.id] } } }),
    },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.id], resource_type: ["Organisation"] } } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchOrganisations({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchOrganisations],
  );

  const dataList = useDataList({
    data: organisations?.list?.data || [],
    totalRecords: organisations?.totalRecords,
    columns,
    actions,
    exportFilename: "Organisations List",
    exportColumns,
    searchFields,
    rowCreator,
    exportCreator,
    defaultFilters,
    listExporter: exportOrganisations,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListOrganisations;
