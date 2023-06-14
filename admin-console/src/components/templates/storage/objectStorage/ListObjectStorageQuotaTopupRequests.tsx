import { Box, Stack } from "@mui/material";
import { FC, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import objectStorageRedux from "store/modules/objectStorage";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";
import RejectRequestModal from "components/templates/organisations/RejectRequestModal";

import { formatDate } from "utilities/comp";

const enum MODAL_TYPE {
  REJECT_REQUEST = "REJECT_REQUEST",
}

interface ListObjectStorageQuotaTopupRequestsProps {
  fetchTopupQuotaRequests: any;
  exportTopupQuotaRequests: any;
  defaultFilters: any;
  approveRequest: any;
  rejectRequest: any;
}

const ListObjectStorageQuotaTopupRequests: FC<ListObjectStorageQuotaTopupRequestsProps> = ({
  fetchTopupQuotaRequests,
  exportTopupQuotaRequests,
  defaultFilters,
  approveRequest,
  rejectRequest,
}) => {
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const objectStorageResourceTopupRequests = objectStorageRedux.getters.objectStorageResourceTopupRequests(rootState);

  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [activeModal, setActiveModal] = useState<MODAL_TYPE | null>(null);

  const handleOpenModal = (key: MODAL_TYPE) => setActiveModal(key);
  const handleCloseModal = () => setActiveModal(null);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Request ID", sortKey: "request_id" },
      {
        label: "Provider",
        align: "center",
        filterKey: "objstorage_providers_id",
        filters: objectStorageResourceTopupRequests?.list?.filter_values?.objstorage_providers?.map((item) => ({ label: item?.objectstorage_provider_name, value: item?.id })),
      },
      { label: "Provider Location", align: "center" },
      {
        label: "Topup Item",
        align: "center",
        filterKey: "resource_topups_id",
        filters: objectStorageResourceTopupRequests?.list?.filter_values?.resource_topups?.map((item) => ({ label: item?.resource_name?.split("_").join(" "), value: item?.id })),
      },
      { label: "Topup Value", align: "center" },
      {
        label: "Active",
        align: "center",
      },
      {
        label: "Public",
        align: "center",
      },
      {
        label: "Cloud Reg. A/C No.",
        align: "center",
      },
      { label: "Status", align: "center", sortKey: "status", filterKey: "status", filters: objectStorageResourceTopupRequests?.list?.filter_values?.status },
      { label: "Requested On", align: "center", sortKey: "created", defaultSort: "desc" },
      { label: "Allocated On", align: "center", sortKey: "allocation_date" },
    ],
    [objectStorageResourceTopupRequests?.list],
  );

  const exportColumns: string[] = useMemo(
    () => [
      "Request ID",
      "Provider Name",
      "Provider Location",
      "Topup Item",
      "Topup Value",
      "Active",
      "Public",
      "Cloud Reg. A/C No.",
      "Status",
      "Remarks",
      "Requested On",
      "Allocated On",
    ],
    [],
  );

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.request_id },
      {
        content: (
          <Stack alignItems="center">
            <Box whiteSpace="nowrap">{item?.objstorage_provider?.objectstorage_provider_name}</Box>
          </Stack>
        ),
        align: "center",
      },
      { content: item?.objstorage_provider?.objectstorage_provider_location, align: "center" },
      { content: item?.resource_topup?.resource_name.split("_").join(" "), align: "center" },
      { content: item?.resource_topup?.topup_value, align: "center" },
      { content: item?.resource_topup?.is_active !== null ? <StatusChip label={item?.resource_topup?.is_active} /> : null, align: "center" },
      { content: item?.resource_topup?.public !== null ? <StatusChip label={item?.resource_topup?.public} /> : null, align: "center" },
      { content: item?.onboarded_org?.cloud_reg_acno, align: "center" },
      { content: item?.status ? <StatusChip label={item?.status} helperText={item?.remarks} /> : null, align: "center" },
      { content: formatDate(item?.created), align: "center" },
      { content: formatDate(item?.allocation_date), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.request_id,
      item?.objstorage_provider?.objectstorage_provider_name,
      item?.objstorage_provider?.objectstorage_provider_location,
      item?.resource_topup?.resource_name?.split("_").join(" "),
      item?.resource_topup?.topup_value,
      item?.resource_topup?.is_active,
      item?.resource_topup?.public,
      item?.onboarded_org?.cloud_reg_acno,
      item?.status,
      item?.remarks,
      formatDate(item?.created, false, true),
      formatDate(item?.allocation_date, false, true),
    ];
  }, []);

  const actions: ActionProps[] = [
    {
      label: () => "View Request",
      onClick: (item) => navigate(`${item?.id}/request-details`, { state: { quotaTopupRequestDetail: item } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchTopupQuotaRequests({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchTopupQuotaRequests],
  );

  const dataList = useDataList({
    data: objectStorageResourceTopupRequests?.list?.data || [],
    totalRecords: objectStorageResourceTopupRequests?.totalRecords,
    columns,
    actions,
    exportFilename: "Topup Quota Requests List",
    exportColumns,
    defaultFilters,
    rowCreator,
    exportCreator,
    listExporter: exportTopupQuotaRequests,
    reload,
  });

  return (
    <>
      <DataList dataList={dataList} />
      <RejectRequestModal isOpen={activeModal === MODAL_TYPE.REJECT_REQUEST} onClose={handleCloseModal} onSubmit={(payload) => rejectRequest(selectedRequest, payload?.remarks)} />
    </>
  );
};

export default ListObjectStorageQuotaTopupRequests;
