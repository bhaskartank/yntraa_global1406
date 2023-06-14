import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import objectStorageRedux from "store/modules/objectStorage";

import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListOrganisationProps {
  fetchOrganisations: any;
  exportOrganisations: any;
  defaultFilters: any;
}

const ListOnboardedOrganisations: FC<ListOrganisationProps> = ({ fetchOrganisations, exportOrganisations, defaultFilters }) => {
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const onboarderOrganisations = objectStorageRedux.getters.objectStorageOnboardedOrganisation(rootState);
  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Cloud Reg. A/C No.", sortKey: "cloud_reg_acno", filterKey: "cloud_reg_acno", filters: onboarderOrganisations?.list?.filter_values?.cloud_reg_acno },
      { label: "Organisation Code", align: "center", sortKey: "cuc", filterKey: "cuc", filters: onboarderOrganisations?.list?.filter_values?.cuc },
      { label: "Organisation Name", align: "center", sortKey: "name" },
      { label: "Description", align: "center", sortKey: "description" },
      { label: "Onboarded On", sortKey: "created", align: "center", defaultSort: "desc" },
    ],
    [onboarderOrganisations?.list],
  );

  const exportColumns: string[] = useMemo(() => ["Cloud Reg. A/C No.", "Organisation Code", "Organisation Name", "Description", "Onboarded On"], []);

  const searchFields = useMemo(
    () => [
      { key: "cloud_reg_acno", label: "Cloud Reg. A/C No." },
      { key: "cuc", label: "Organisation Code" },
      { key: "name", label: "Organisation Name" },
      { key: "description", label: "Description" },
    ],
    [],
  );

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.cloud_reg_acno },
      { content: item?.cuc, align: "center" },
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
      onClick: (item) => navigate(`${item?.id}/view-details`, { state: { OrganisationOnboardData: item } }),
    },
    {
      label: () => "Bucket Details",
      onClick: (item) => navigate("/storage/object-storage-list", { state: { defaultFilters: { organisation_id: [item?.id] } } }),
    },
    // {
    //   label: () => "User Details",
    //   onClick: (item) => navigate(`${item?.id}/users`),
    // },
    {
      label: () => "Quota Details",
      onClick: (item) => navigate(`${item?.id}/quota`, { state: { listOrganisationDetail: item } }),
    },
    {
      label: () => "Onboarding Requests",
      onClick: (item) => navigate("/storage/object-storage-onboarding", { state: { defaultFilters: { name: [item?.name] } } }),
    },
    {
      label: () => "Quota Update Requests",
      onClick: (item) => navigate("/storage/quota-update", { state: { defaultFilters: { organisation_id: [item?.id] } } }),
    },
    {
      label: () => "Quota Topup Requests",
      onClick: (item) => navigate("/storage/quota-topup", { state: { defaultFilters: { organisation_id: [item?.id] } } }),
    },
    {
      label: () => "Quota Topup Withdrawal Requests",
      onClick: (item) => navigate("/storage/quota-withdraw", { state: { defaultFilters: { organisation_id: [item?.id] } } }),
    },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.resource_id], resource_type: ["Osaas Provider Type"] } } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchOrganisations({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchOrganisations],
  );

  const dataList = useDataList({
    data: onboarderOrganisations?.list?.data || [],
    totalRecords: onboarderOrganisations?.totalRecords,
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

export default ListOnboardedOrganisations;
