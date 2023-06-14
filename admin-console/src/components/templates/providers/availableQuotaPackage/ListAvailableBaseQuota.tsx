import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import providersRedux from "store/modules/providers";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListFlavorProps {
  fetchAvailableBaseQuota: any;
  exportAvailableBaseQuota: any;
}

const ListAvailableBaseQuota: FC<ListFlavorProps> = ({ fetchAvailableBaseQuota, exportAvailableBaseQuota }) => {
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const availableBaseQuota = providersRedux.getters.availableBaseQuota(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      {
        label: "Name",
        filterKey: "quotapackage_id",
        filters: availableBaseQuota?.list?.filter_values?.quotapackage?.map((item) => ({ label: item?.name, value: item?.id })),
      },
      {
        label: "Version",
        align: "center",
      },
      { label: "Description", align: "center" },
      { label: "Quota Package Value", align: "center" },
      {
        label: "Public",
        align: "center",
        filterKey: "is_public",
        filters: availableBaseQuota?.list?.filter_values?.is_public?.map((item) => ({ label: String(item?.label), value: item?.value })),
      },
      {
        label: "Provider Name",
        align: "center",
        filterKey: "provider_id",
        filters: availableBaseQuota?.list?.filter_values?.provider?.map((item) => ({ label: String(item?.provider_id), value: item?.id })),
      },
      {
        label: "Provider Location",
        align: "center",
        filterKey: "provider_location",
        filters: availableBaseQuota?.list?.filter_values?.provider_location,
      },
      { label: "Active", align: "center" },
      { label: "Created", align: "center", sortKey: "created", defaultSort: "desc" },
    ],
    [availableBaseQuota?.list?.filter_values],
  );

  const exportColumns: string[] = useMemo(() => ["Name", "Version", "Description", "Quota Package Value", "Status", "Created"], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.quotapackage?.name },
      { content: item?.quotapackage?.version, align: "center" },
      { content: item?.quotapackage?.description, align: "center" },
      { content: item?.quotapackage?.quotapackage_value, align: "center" },
      { content: item?.is_public !== null ? <StatusChip label={item?.is_public} /> : null, align: "center" },
      { content: item?.provider?.provider_id, align: "center" },
      { content: item?.provider?.provider_location, align: "center" },
      { content: item?.quotapackage?.is_active !== null ? <StatusChip label={item?.quotapackage?.is_active} /> : null, align: "center" },
      { content: formatDate(item?.created, true, false, true), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.quotapackage?.name,
      item?.quotapackage?.version,
      item?.quotapackage?.description,
      item?.quotapackage?.quotapackage_value,
      item?.quotapackage?.is_public,
      item?.quotapackage?.is_active,
      formatDate(item?.created, false, true, true),
    ];
  }, []);

  const searchFields = useMemo(
    () => [
      { key: "name", label: "Name" },
      { key: "description", label: "Description" },
      { key: "provider_location", label: "Provider Location" },
    ],
    [],
  );

  const actions: ActionProps[] = [
    {
      label: () => "Show Mapped Organisations",
      onClick: (item) => navigate(`${item?.id}/mapped-organisations`, { state: { quotaPackage: item } }),
    },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.quotapackage?.id], resource_type: ["QuotaPackage"] } } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchAvailableBaseQuota({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchAvailableBaseQuota],
  );

  const dataList = useDataList({
    data: availableBaseQuota?.list?.data || [],
    totalRecords: availableBaseQuota?.totalRecords,
    columns,
    actions,
    exportFilename: "Available Base Quota List",
    exportColumns,
    searchFields,
    rowCreator,
    exportCreator,
    listExporter: exportAvailableBaseQuota,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListAvailableBaseQuota;
