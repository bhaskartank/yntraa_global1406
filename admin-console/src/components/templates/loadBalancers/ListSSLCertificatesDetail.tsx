import { Chip, Stack, Typography } from "@mui/material";
import * as React from "react";

import DataList from "components/organisms/DataList";
import useDataList from "components/organisms/DataList/useDataList";
import DetailsPage from "components/organisms/DetailsPageComponent";

import { formatDate } from "utilities/comp";

type ListSSLCertificatesDetailProps = {
  requestData: any;
  requestDetailPage?: boolean;
};

export default function ListSSLCertificatesDetail({ requestData, requestDetailPage = false }: ListSSLCertificatesDetailProps) {
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
        title: "Name",
        label: requestData?.name,
      },
      {
        title: "Domain",
        label: requestData?.domain,
      },
      {
        title: "Created on",
        label: createdDate,
      },
      {
        title: "Updated on",
        label: updatedDate,
      },
    ],
    [createdDate, requestData?.domain, requestData?.name, updatedDate],
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
        title: "Project Detail",
        child: (
          <Stack gap={2} pt={1}>
            <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
              <Chip
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
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Name:</Typography>
                    <Typography variant="body2">{requestData?.provider?.provider_name}</Typography>
                  </Stack>
                }
              />
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Provider Location:</Typography>
                    <Typography variant="body2">{requestData?.provider?.provider_location}</Typography>
                  </Stack>
                }
              />
              <Chip
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
      <DetailsPage accordionData={accordData} headerData={dataHead} />
    </>
  );
}
