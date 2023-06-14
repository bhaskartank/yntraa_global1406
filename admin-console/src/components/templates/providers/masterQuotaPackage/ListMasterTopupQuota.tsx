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
  fetchMasterTopupQuota: any;
  exportMasterTopupQuota: any;
}

const ListMasterTopupQuota: FC<ListFlavorProps> = ({ fetchMasterTopupQuota, exportMasterTopupQuota }) => {
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const masterTopupQuota = quotaPackagesRedux.getters.masterTopupQuota(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Topup Type", filterKey: "topup_type", sortKey: "topup_type", filters: masterTopupQuota?.list?.filter_values?.topup_type },
      { label: "Topup Value", align: "center", sortKey: "topup_value" },
      {
        label: "Public",
        align: "center",
        sortKey: "public",
        filterKey: "public",
        filters: masterTopupQuota?.list?.filter_values?.public?.map((item) => ({ label: String(item?.label), value: item?.value })),
      },
      {
        label: "Active",
        align: "center",
        sortKey: "is_active",
        filterKey: "is_active",
        filters: masterTopupQuota?.list?.filter_values?.is_active?.map((item) => ({ label: String(item?.label), value: item?.value })),
      },
      { label: "Created", align: "center", sortKey: "created", defaultSort: "desc" },
    ],
    [masterTopupQuota?.list?.filter_values],
  );

  const exportColumns: string[] = useMemo(() => ["Topup Item", "Topup Value", "Public", "Active", "Created"], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.topup_type },
      { content: item?.topup_value, align: "center" },
      { content: item?.public !== null ? <StatusChip label={item?.public} /> : null, align: "center" },
      { content: item?.is_active !== null ? <StatusChip label={item?.is_active} /> : null, align: "center" },
      { content: formatDate(item?.created), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [item?.topup_type, item?.topup_value, item?.public, item?.is_active, formatDate(item?.created, false, true)];
  }, []);

  const searchFields = useMemo(
    () => [
      { key: "topup_item", label: "Topup Item" },
      { key: "topup_type", label: "Topup Type" },
      { key: "topup_value", label: "Topup Value" },
    ],
    [],
  );

  const actions: ActionProps[] = [
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.id], resource_type: ["QuotaPackage"] } } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchMasterTopupQuota({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchMasterTopupQuota],
  );

  const dataList = useDataList({
    data: masterTopupQuota?.list?.data || [],
    totalRecords: masterTopupQuota?.totalRecords,
    columns,
    actions,
    exportFilename: "Master Topup Quota List",
    exportColumns,
    rowCreator,
    exportCreator,
    searchFields,
    listExporter: exportMasterTopupQuota,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListMasterTopupQuota;
