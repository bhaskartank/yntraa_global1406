import { Box, Stack } from "@mui/material";
import { FC, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "store";
import quotaPackagesRedux from "store/modules/quotaPackages";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ActionProps, ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

import RejectRequestModal from "./RejectRequestModal";

const enum MODAL_TYPE {
  REJECT_REQUEST = "REJECT_REQUEST",
}

interface ListTopupQuotaRequestProps {
  fetchTopupQuotaRequests: any;
  exportTopupQuotaRequests: any;
  defaultFilters: any;
  approveRequest: any;
  rejectRequest: any;
}

const ListTopupQuotaRequests: FC<ListTopupQuotaRequestProps> = ({ fetchTopupQuotaRequests, exportTopupQuotaRequests, defaultFilters, approveRequest, rejectRequest }) => {
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const topupQuotaRequests = quotaPackagesRedux.getters.topupQuotaRequests(rootState);

  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [activeModal, setActiveModal] = useState<MODAL_TYPE | null>(null);

  const handleOpenModal = (key: MODAL_TYPE) => setActiveModal(key);
  const handleCloseModal = () => setActiveModal(null);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Request ID", sortKey: "request_id" },
      {
        label: "Cloud Reg. A/C No.",
        align: "center",
        filterKey: "organisation_org_reg_code",
        filters: topupQuotaRequests?.list?.filter_values?.organisation?.map((item) => ({ label: item?.org_reg_code, value: item?.org_reg_code })),
      },
      {
        label: "Organisation",
        align: "center",
        filterKey: "organisation_id",
        filters: topupQuotaRequests?.list?.filter_values?.organisation?.map((item) => ({ label: `${item?.name} (${item?.org_id})`, value: item?.id })),
      },
      {
        label: "Provider",
        align: "center",
        filterKey: "provider_id",
        filters: topupQuotaRequests?.list?.filter_values?.provider?.map((item) => ({ label: `${item?.provider_name} (${item?.provider_id})`, value: item?.id })),
      },
      { label: "Provider Location", align: "center", filterKey: "provider_location", filters: topupQuotaRequests?.list?.filter_values?.provider_location, defaultHidden: true },
      {
        label: "Quota Package",
        align: "center",
      },
      { label: "Topup Type", align: "center", filterKey: "resource_topup_topup_type", filters: topupQuotaRequests?.list?.filter_values?.resource_topup_topup_type },
      { label: "Topup Value", align: "center" },
      { label: "Request Origin", align: "center", filterKey: "request_origin", filters: topupQuotaRequests?.list?.filter_values?.request_origin, defaultHidden: true },
      { label: "Status", align: "center", sortKey: "status", filterKey: "status", filters: topupQuotaRequests?.list?.filter_values?.status },
      { label: "Requested On", align: "center", sortKey: "created", defaultSort: "desc" },
      { label: "Allocated On", align: "center", sortKey: "allocation_date", defaultHidden: true },
    ],
    [topupQuotaRequests?.list],
  );

  const exportColumns: string[] = useMemo(
    () => [
      "Request ID",
      "Cloud Reg. A/C No.",
      "Organisation Name",
      "Organisation Code",
      "Provider Name",
      "Provider Code",
      "Provider Location",
      "Quota Package Name",
      "Quota Package Version",
      "Topup Type",
      "Topup Value",
      "Request Origin",
      "Status",
      "Remarks",
      "Requested On",
      "Allocated On",
    ],
    [],
  );

  const searchFields = useMemo(
    () => [
      { key: "resource_topupup_topup_type", label: "Topup Type" },
      { key: "resource_topup_topup_item", label: "Topup Item" },
      { key: "organisation_name", label: "Org Name" },
      { key: "organisation_org_reg_code", label: "Cloud Reg. A/C No" },
      { key: "organisation_org_id", label: "Org ID" },
      { key: "provider_location", label: "Provider Location" },
      { key: "provider_code", label: "Provider Code" },
    ],
    [],
  );

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.request_id },
      { content: item?.organisation?.org_reg_code, align: "center" },
      {
        content: (
          <Stack>
            <Box component="span">{item?.organisation?.name}</Box>
            <Box component="span">({item?.organisation?.org_id})</Box>
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
      {
        content: (
          <Stack alignItems="center">
            <Box whiteSpace="nowrap">
              {item?.quotapackage?.name} ({item?.quotapackage?.version})
            </Box>
          </Stack>
        ),
        align: "center",
      },
      { content: item?.resource_topup?.topup_type, align: "center" },
      { content: item?.resource_topup?.topup_value, align: "center" },
      { content: item?.request_origin, align: "center" },
      { content: item?.status ? <StatusChip label={item?.status} helperText={item?.remarks} /> : null, align: "center" },
      { content: formatDate(item?.created), align: "center" },
      { content: formatDate(item?.allocation_date), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.request_id,
      item?.organisation?.org_reg_code,
      item?.organisation?.name,
      item?.organisation?.org_id,
      item?.provider?.provider_name,
      item?.provider?.provider_id,
      item?.provider?.provider_location,
      item?.quotapackage?.name,
      item?.quotapackage?.version,
      item?.resource_topup?.topup_type,
      item?.resource_topup?.topup_value,
      item?.request_origin,
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
    {
      label: () => "Organisation Resource Utilization",
      onClick: (item) => navigate(`quota/${item?.id}/resources`, { state: { quotaPackageRequestDetail: item } }),
      hidden: (item) => item?.organisation?.organisation_quotapackage_organisation?.length < 1,
    },
    {
      label: () => "Audit Logs",
      onClick: (item) => navigate("/audit-logs/admin-trails", { state: { defaultFilters: { resource_id: [item?.id], resource_type: ["Resource Topup Request"] } } }),
    },
  ];

  const reload = useCallback(
    ({ limit, offset, search, order, orderBy, filters }) => fetchTopupQuotaRequests({ limit, offset, search, sort_by: orderBy, sort_asc: order === "asc", filters }),
    [fetchTopupQuotaRequests],
  );

  const dataList = useDataList({
    data: topupQuotaRequests?.list?.data || [],
    totalRecords: topupQuotaRequests?.totalRecords,
    columns,
    actions,
    exportFilename: "Topup Quota Requests List",
    exportColumns,
    defaultFilters,
    rowCreator,
    exportCreator,
    searchFields,
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

export default ListTopupQuotaRequests;
