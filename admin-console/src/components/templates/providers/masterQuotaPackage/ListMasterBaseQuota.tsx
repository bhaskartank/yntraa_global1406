import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import quotaPackagesRedux from "store/modules/quotaPackages";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListFlavorProps {
  fetchMasterBaseQuota: any;
  exportMasterBaseQuota: any;
}

const ListMasterBaseQuota: FC<ListFlavorProps> = ({ fetchMasterBaseQuota, exportMasterBaseQuota }) => {
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const masterBaseQuota = quotaPackagesRedux.getters.masterBaseQuota(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Name", sortKey: "name", filterKey: "name", filters: masterBaseQuota?.list?.filter_values?.name },
      {
        label: "Version",
        align: "center",
        sortKey: "version",
        filterKey: "version",
        filters: masterBaseQuota?.list?.filter_values?.version,
      },
      { label: "Description", align: "center", sortKey: "description" },
      {
        label: "Quota Package Value",
        align: "center",
        sortKey: "quotapackage_value",
        filterKey: "quotapackage_value",
        filters: masterBaseQuota?.list?.filter_values?.quotapackage_value,
      },
      {
        label: "Active",
        align: "center",
        sortKey: "is_active",
        filterKey: "is_active",
        filters: masterBaseQuota?.list?.filter_values?.is_active?.map((item) => ({ label: String(item?.label), value: item?.value })),
      },
      { label: "Created", align: "center", sortKey: "created", defaultSort: "desc" },
    ],
    [masterBaseQuota?.list?.filter_values],
  );

  const exportColumns: string[] = useMemo(() => ["Name", "Version", "Description", "Quota Package Value", "Active", "Created"], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.name },
      { content: item?.version, align: "center" },
      { content: item?.description, align: "center" },
      { content: item?.quotapackage_value, align: "center" },
      { content: item?.is_active !== null ? <StatusChip label={item?.is_active} /> : null, align: "center" },
      { content: formatDate(item?.created, true, false), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [item?.name, item?.version, item?.description, item?.quotapackage_value, item?.is_active, formatDate(item?.created, false, true)];
  }, []);

  const searchFields = useMemo(
    () => [
      { key: "name", label: "Name" },
      { key: "description", label: "Description" },
      { key: "quotapackage_value", label: "Quotapackage Value" },
    ],
    [],
  );

  const actions: ActionProps[] = [
    {
      label: () => "List Mapped Organisations",
      onClick: (item) => navigate(`${item?.id}/mapped-organisations`, { state: { quotaPackage: item } }),
    },
    {
      label: () => "List Mapped Providers",
      onClick: (item) => navigate(`${item?.id}/mapped-providers`, { state: { quotaPackage: item } }),
    },
    // {
    //   label: () => "Edit Quota Package",
    //   onClick: () => null,
    // },
    // {
    //   label: () => "Delete Quota Package",
    //   onClick: () => null,
    //   color: "error.main",
    // },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.id], resource_type: ["QuotaPackage"] } } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchMasterBaseQuota({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchMasterBaseQuota],
  );

  const dataList = useDataList({
    data: masterBaseQuota?.list?.data || [],
    totalRecords: masterBaseQuota?.totalRecords,
    columns,
    actions,
    exportFilename: "Master Base Quota List",
    exportColumns,
    searchFields,
    rowCreator,
    exportCreator,
    listExporter: exportMasterBaseQuota,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListMasterBaseQuota;
