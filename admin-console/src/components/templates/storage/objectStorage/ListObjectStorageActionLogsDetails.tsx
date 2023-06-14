import { Chip, Stack, Typography } from "@mui/material";
import * as React from "react";

import StatusChip from "components/atoms/StatusChip";
import DetailsPage from "components/organisms/DetailsPageComponent";

import { formatDate } from "utilities/comp";

type ListObjectStorageActionLogsDetailsProps = {
  requestData: any;
  requestDetailPage?: boolean;
};

export default function ListObjectStorageActionLogsDetails({ requestData, requestDetailPage = false }: ListObjectStorageActionLogsDetailsProps) {
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
        title: "Action",
        label: requestData?.action,
      },
      {
        title: "Action Method",
        label: requestData?.action_method,
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
    [createdDate, requestData?.action, requestData?.action_method, requestData?.status, updatedDate],
  );

  const accordData = React.useMemo(
    () => [
      {
        title: "Action Logs Detail",
        child: (
          <Stack gap={2} pt={1}>
            <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Username:</Typography>
                    <Typography variant="body2">{requestData?.username}</Typography>
                  </Stack>
                }
              />
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Action Url:</Typography>
                    <Typography variant="body2">{requestData?.action_url}</Typography>
                  </Stack>
                }
              />
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Objectstorage Provider Name:</Typography>
                    <Typography variant="body2">{requestData?.objectstorage_provider_name}</Typography>
                  </Stack>
                }
              />
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Resource Type:</Typography>
                    <Typography variant="body2">{requestData?.resource_type}</Typography>
                  </Stack>
                }
              />
            </Stack>
          </Stack>
        ),
      },
    ],
    [requestData?.action_url, requestData?.objectstorage_provider_name, requestData?.resource_type, requestData?.username],
  );

  return (
    <>
      <DetailsPage accordionData={accordData} headerData={dataHead} />
    </>
  );
}
