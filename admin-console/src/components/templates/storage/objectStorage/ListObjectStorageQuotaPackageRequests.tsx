import { FC, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import objectStorageRedux from "store/modules/objectStorage";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface ListObjectStorageQuotaPackageRequestsProps {
  fetchQuotaPackageRequests: any;
  exportQuotaPackageRequests: any;
  defaultFilters?: any;
}

const ListObjectStorageQuotaPackageRequests: FC<ListObjectStorageQuotaPackageRequestsProps> = ({ fetchQuotaPackageRequests, exportQuotaPackageRequests, defaultFilters }) => {
  const rootState = useSelector((state: any) => state);
  const navigate = useNavigate();
  const onboardingRequests = objectStorageRedux.getters.objectStorageQuotaPackage(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Request ID", sortKey: "request_id" },
      {
        label: "Quota Package Name",
        align: "center",
        filterKey: "quotapackage",
        filters: onboardingRequests?.list?.filter_values?.quotapackage?.map((item) => ({ label: item?.name, value: item?.id })),
      },
      { label: "Description", align: "center" },
      {
        label: "Object Storage Provider",
        align: "center",
        filterKey: "provider",
        filters: onboardingRequests?.list?.filter_values?.provider?.map((item) => ({ label: item?.objectstorage_provider_name, value: item?.id })),
      },
      { label: "Cloud Reg. A/C No.", align: "center" },
      { label: "Org Id.", align: "center" },
      { label: "Status", align: "center", sortKey: "status", filterKey: "status", filters: onboardingRequests?.list?.filter_values?.status },
      { label: "Requested On", align: "center", sortKey: "created", defaultSort: "desc" },
      { label: "Allocated On", align: "center", sortKey: "allocation_date" },
    ],
    [onboardingRequests?.list],
  );

  const exportColumns: string[] = useMemo(
    () => ["Request ID", "Quota Package Name", "Description", "Provider Name", "Provider Location", "Cloud Reg Acno.", "Org Id", "Status", "Requested On", "Allocated On"],
    [],
  );

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.request_id },
      { content: item?.quotapackage_update_quotapackage?.name, align: "center" },
      { content: item?.quotapackage_update_quotapackage?.description, align: "center" },
      { content: item?.quotapackage_update_provider?.objectstorage_provider_name + " " + item?.quotapackage_update_provider?.objectstorage_provider_location, align: "center" },
      { content: item?.quotapackage_update_organisation?.cloud_reg_acno, align: "center" },
      { content: item?.quotapackage_update_organisation?.cuc, align: "center" },
      { content: item?.status ? <StatusChip label={item?.status} helperText={item?.remarks} /> : null, align: "center" },
      { content: formatDate(item?.created), align: "center" },
      { content: formatDate(item?.allocation_date), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.request_id,
      item?.quotapackage_update_quotapackage?.name,
      item?.quotapackage_update_quotapackage?.description,
      item?.quotapackage_update_provider?.objectstorage_provider_name,
      item?.quotapackage_update_provider?.objectstorage_provider_location,
      item?.quotapackage_update_organisation?.cloud_reg_acno,
      item?.quotapackage_update_organisation?.cuc,
      item?.status,
      formatDate(item?.created, false, true),
      formatDate(item?.allocation_date, false, true),
    ];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "View Request",
      onClick: (item) => navigate(`${item?.id}/request-details`, { state: { ObjectStorageQuotaPackageRequestDetail: item } }),
    },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.id], resource_type: ["ObjectStorage"] } } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchQuotaPackageRequests({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchQuotaPackageRequests],
  );

  const dataList = useDataList({
    data: onboardingRequests?.list?.data || [],
    totalRecords: onboardingRequests?.totalRecords,
    columns,
    actions,
    exportFilename: "Object Storage Quota Package Update Request List",
    exportColumns,
    rowCreator,
    exportCreator,
    defaultFilters,
    listExporter: exportQuotaPackageRequests,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListObjectStorageQuotaPackageRequests;
