import { Chip, Stack, Typography } from "@mui/material";
import * as React from "react";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import useDataList from "components/organisms/DataList/useDataList";
import DetailsPage from "components/organisms/DetailsPageComponent";

import { formatDate } from "utilities/comp";

type ListSSLRequestDetailProps = {
  requestData: any;
  requestDetailPage?: boolean;
  handleApproveReq?: () => void;
  handleRejectReq?: () => void;
};

export default function ListSSLRequestDetail({ requestData, handleApproveReq, handleRejectReq, requestDetailPage = false }: ListSSLRequestDetailProps) {
  let createdDate;
  if (formatDate(requestData?.created, false, true)) {
    createdDate = formatDate(requestData?.created, false, true);
  } else {
    createdDate = "-";
  }
  let updatedDate;
  if (formatDate(requestData?.updated, false, true)) {
    updatedDate = formatDate(requestData?.updated, false, true);
  } else {
    updatedDate = "-";
  }

  const dataHead = React.useMemo(
    () => [
      {
        title: "Request Id",
        label: requestData?.request_id,
      },
      {
        title: "Provisioning Type",
        label: requestData?.provisioning_type,
      },
      {
        title: "Created on",
        label: createdDate,
      },
      {
        title: "Updated on",
        label: updatedDate,
      },
      {
        title: "Status",
        label: <StatusChip label={requestData?.status} />,
      },
    ],
    [createdDate, requestData?.provisioning_type, requestData?.request_id, requestData?.status, updatedDate],
  );

  const columns: any = React.useMemo(() => {
    return [{ label: "User's Name" }, { label: "User's Email" }, { label: "Mobile" }];
  }, []);

  const rowCreator: any = React.useCallback((item: any) => [{ content: `${item?.first_name} ${item?.last_name}` }, { content: item?.email }, { content: item?.mobile_no }], []);

  const dataList = useDataList({
    data: Array.isArray(requestData?.user) ? requestData?.user : [requestData?.user],
    columns,
    rowCreator,
    hideViewColumn: true,
    maxHeight: "250px",
  });

  const lbColumns: any = React.useMemo(() => {
    return [{ label: "Name" }, { label: "Lb Device Ip" }, { label: "Version Type" }, { label: "Status" }];
  }, []);

  const lbRowCreator: any = React.useCallback(
    (item: any) => [{ content: item?.name }, { content: item?.lb_device_ip }, { content: item?.version_type }, { content: item?.status }],
    [],
  );

  const lbDataList = useDataList({
    data: Array.isArray(requestData?.load_balancer) ? requestData?.load_balancer : [requestData?.load_balancer],
    columns: lbColumns,
    rowCreator: lbRowCreator,
    hideViewColumn: true,
    maxHeight: "250px",
  });

  const accordData = React.useMemo(
    () => [
      {
        title: "User Details",
        child: (
          <Stack pt={1}>
            <DataList dataList={dataList} hideActionBar={false} />
          </Stack>
        ),
      },
      {
        title: "Load Balancer Details",
        child: (
          <Stack pt={1}>
            <DataList dataList={lbDataList} hideActionBar={false} />
          </Stack>
        ),
      },
      {
        title: "Project Detail",
        child: (
          <Stack gap={2} pt={1}>
            <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
              <Chip
                variant="outlined"
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Name:</Typography>
                    <Typography variant="body2">{requestData?.project?.name}</Typography>
                  </Stack>
                }
              />
            </Stack>
            <Stack direction="row" alignItems="center" gap={1} px={1}>
              <Typography variant="body2" fontWeight={500} color="common.black">
                Description:
              </Typography>
              <Typography color="common.black" variant="body2">
                {requestData?.project?.description}
              </Typography>
            </Stack>
          </Stack>
        ),
      },
      {
        title: "Provider Detail",
        child: (
          <Stack gap={2} pt={1}>
            <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
              <Chip
                variant="outlined"
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Name:</Typography>
                    <Typography variant="body2">{requestData?.provider?.provider_name}</Typography>
                  </Stack>
                }
              />
              <Chip
                variant="outlined"
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Provider Location:</Typography>
                    <Typography variant="body2">{requestData?.provider?.provider_location}</Typography>
                  </Stack>
                }
              />
              <Chip
                variant="outlined"
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Provider Type Name:</Typography>
                    <Typography variant="body2">{requestData?.provider?.provider_type?.name}</Typography>
                  </Stack>
                }
              />
            </Stack>
            <Stack direction="row" alignItems="center" gap={1} px={1}>
              <Typography variant="body2" fontWeight={500} color="common.black">
                Description:
              </Typography>
              <Typography color="common.black" variant="body2">
                {requestData?.provider?.provider_description}
              </Typography>
            </Stack>
          </Stack>
        ),
      },
    ],
    [
      dataList,
      lbDataList,
      requestData?.project?.description,
      requestData?.project?.name,
      requestData?.provider?.provider_description,
      requestData?.provider?.provider_location,
      requestData?.provider?.provider_name,
      requestData?.provider?.provider_type?.name,
    ],
  );

  return (
    <>
      <DetailsPage
        accordionData={accordData}
        headerData={dataHead}
        detailPageData={requestData}
        isRequesting={requestDetailPage}
        handleApproveReq={handleApproveReq}
        handleRejectReq={handleRejectReq}
      />
    </>
  );
}
