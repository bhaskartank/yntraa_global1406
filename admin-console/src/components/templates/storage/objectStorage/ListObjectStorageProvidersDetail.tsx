import { Chip, Stack, Typography } from "@mui/material";
import * as React from "react";

import StatusChip from "components/atoms/StatusChip";
import DetailsPage from "components/organisms/DetailsPageComponent";

import { formatDate } from "utilities/comp";

type ListObjectStorageProvidersDetailProps = {
  requestData: any;
  requestDetailPage?: boolean;
};

export default function ListObjectStorageProvidersDetail({ requestData, requestDetailPage = false }: ListObjectStorageProvidersDetailProps) {
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
        title: "Objectstorage Provider Name",
        label: requestData?.objectstorage_provider_name,
      },
      {
        title: "Objectstorage Provider Location",
        label: requestData?.objectstorage_provider_location,
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
    [createdDate, requestData?.objectstorage_provider_location, requestData?.objectstorage_provider_name, requestData?.status, updatedDate],
  );

  const accordData = React.useMemo(
    () => [
      {
        title: "Objectstorage Provider Details",
        child: (
          <Stack gap={2} pt={1}>
            <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Access Endpoint Ip:</Typography>
                    <Typography variant="body2">{requestData?.access_endpoint_ip}</Typography>
                  </Stack>
                }
              />
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Access Endpoint Port:</Typography>
                    <Typography variant="body2"> {requestData?.access_endpoint_port}</Typography>
                  </Stack>
                }
              />
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Access Endpoint Url:</Typography>
                    <Typography variant="body2"> {requestData?.access_endpoint_url}</Typography>
                  </Stack>
                }
              />
            </Stack>
            <Stack direction="row" alignItems="center" gap={1} px={1}>
              <Typography variant="body2" fontWeight={500} color="common.black">
                Description:
              </Typography>
              <Typography color="common.black" variant="body2">
                {requestData?.objectstorage_provider_description}
              </Typography>
            </Stack>
          </Stack>
        ),
      },
      {
        title: "Objectstorage Provider Type Details",
        child: (
          <Stack gap={2} pt={1}>
            <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Name:</Typography>
                    <Typography variant="body2">{requestData?.objectstorage_provider_type?.name}</Typography>
                  </Stack>
                }
              />
            </Stack>
            <Stack direction="row" alignItems="center" gap={1} px={1}>
              <Typography variant="body2" fontWeight={500} color="common.black">
                Description:
              </Typography>
              <Typography color="common.black" variant="body2">
                {requestData?.objectstorage_provider_type?.description}
              </Typography>
            </Stack>
          </Stack>
        ),
      },
    ],
    [
      requestData?.access_endpoint_ip,
      requestData?.access_endpoint_port,
      requestData?.access_endpoint_url,
      requestData?.objectstorage_provider_description,
      requestData?.objectstorage_provider_type?.description,
      requestData?.objectstorage_provider_type?.name,
    ],
  );

  return (
    <>
      <DetailsPage accordionData={accordData} headerData={dataHead} />
    </>
  );
}
