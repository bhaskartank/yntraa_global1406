import { Chip, Stack, Typography } from "@mui/material";
import * as React from "react";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import useDataList from "components/organisms/DataList/useDataList";
import DetailsPage from "components/organisms/DetailsPageComponent";

import { formatDate } from "utilities/comp";

type ListObjectStorageBucketsDetailProps = {
  requestData: any;
  requestDetailPage?: boolean;
};

export default function ListObjectStorageBucketsDetail({ requestData, requestDetailPage = false }: ListObjectStorageBucketsDetailProps) {
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
        title: "Bucket Size",
        label: requestData?.bucket_size,
      },
      {
        title: "Created on",
        label: createdDate,
      },
      {
        title: "Total Objects Count",
        label: requestData?.total_objects_count,
      },
      {
        title: "Status",
        label: <StatusChip label={requestData?.status} />,
      },
    ],
    [createdDate, requestData?.bucket_size, requestData?.name, requestData?.status, requestData?.total_objects_count],
  );

  const columns: any = React.useMemo(() => {
    return [{ label: "Name" }, { label: "Created On" }, { label: "Status" }];
  }, []);

  const rowCreator: any = React.useCallback((item: any) => [{ content: item?.name }, { content: formatDate(item?.created) }, { content: item?.status }], []);

  const dataList = useDataList({
    data: Array.isArray(requestData?.bucket_user) ? requestData?.bucket_user : [requestData?.bucket_user],
    columns,
    rowCreator,
    hideViewColumn: true,
    maxHeight: "250px",
  });

  const accordData = React.useMemo(
    () => [
      {
        title: "Bucket User Details",
        child: (
          <Stack pt={1}>
            <DataList dataList={dataList} hideActionBar={false} />
          </Stack>
        ),
      },
      {
        title: "Provider Details",
        child: requestData?.provider ? (
          <Stack gap={2} pt={1}>
            <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Provider Name:</Typography>
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
                    <Typography variant="subtitle2">Status:</Typography>
                    <Typography variant="body2">{requestData?.provider?.status}</Typography>
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
        ) : (
          <Typography variant="body2"> Nothing to show</Typography>
        ),
      },
      {
        title: "Bucket Objectstorage Provider Details",
        child: (
          <Stack gap={2} pt={1}>
            <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Name:</Typography>
                    <Typography variant="body2">{requestData?.bucket_objectstorage_provider?.objectstorage_provider_name}</Typography>
                  </Stack>
                }
              />
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Location:</Typography>
                    <Typography variant="body2">{requestData?.bucket_objectstorage_provider?.objectstorage_provider_location}</Typography>
                  </Stack>
                }
              />
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Access Endpoint Url:</Typography>
                    <Typography variant="body2">{requestData?.bucket_objectstorage_provider?.access_endpoint_url}</Typography>
                  </Stack>
                }
              />
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Status:</Typography>
                    <Typography variant="body2">{requestData?.bucket_objectstorage_provider?.status}</Typography>
                  </Stack>
                }
              />
            </Stack>
            <Stack direction="row" alignItems="center" gap={1} px={1}>
              <Typography variant="body2" fontWeight={500} color="common.black">
                Description:
              </Typography>
              <Typography color="common.black" variant="body2">
                {requestData?.bucket_objectstorage_provider?.objectstorage_provider_description}
              </Typography>
            </Stack>
          </Stack>
        ),
      },
      {
        title: "Bucket Onboarded Organisation Details",
        child: (
          <Stack gap={2} pt={1}>
            <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Name:</Typography>
                    <Typography variant="body2">{requestData?.bucket_onboardedorganisation?.name}</Typography>
                  </Stack>
                }
              />
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Project Code:</Typography>
                    <Typography variant="body2">{requestData?.bucket_onboardedorganisation?.project_code}</Typography>
                  </Stack>
                }
              />
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Cloud Reg AC/No:</Typography>
                    <Typography variant="body2">{requestData?.bucket_onboardedorganisation?.cloud_reg_acno}</Typography>
                  </Stack>
                }
              />
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Cuc:</Typography>
                    <Typography variant="body2">{requestData?.bucket_onboardedorganisation?.cuc}</Typography>
                  </Stack>
                }
              />
            </Stack>
            <Stack direction="row" alignItems="center" gap={1} px={1}>
              <Typography variant="body2" fontWeight={500} color="common.black">
                Description:
              </Typography>
              <Typography color="common.black" variant="body2">
                {requestData?.bucket_onboardedorganisation?.description}
              </Typography>
            </Stack>
          </Stack>
        ),
      },
    ],
    [
      dataList,
      requestData?.bucket_objectstorage_provider?.access_endpoint_url,
      requestData?.bucket_objectstorage_provider?.objectstorage_provider_description,
      requestData?.bucket_objectstorage_provider?.objectstorage_provider_location,
      requestData?.bucket_objectstorage_provider?.objectstorage_provider_name,
      requestData?.bucket_objectstorage_provider?.status,
      requestData?.bucket_onboardedorganisation?.cloud_reg_acno,
      requestData?.bucket_onboardedorganisation?.cuc,
      requestData?.bucket_onboardedorganisation?.description,
      requestData?.bucket_onboardedorganisation?.name,
      requestData?.bucket_onboardedorganisation?.project_code,
      requestData?.provider,
    ],
  );

  return (
    <>
      <DetailsPage accordionData={accordData} headerData={dataHead} />
    </>
  );
}
