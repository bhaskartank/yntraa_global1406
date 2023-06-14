import { Chip, Stack, Typography } from "@mui/material";
import * as React from "react";

import StatusChip from "components/atoms/StatusChip";
import DetailsPage from "components/organisms/DetailsPageComponent";

import { formatDate } from "utilities/comp";

type ListProviderDetailProps = {
  requestData: any;
};

export default function ListProviderDetail({ requestData }: ListProviderDetailProps) {
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
        title: "Provider Name",
        label: requestData?.provider_name,
      },
      {
        title: "Provider Code",
        label: requestData?.provider_id,
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
    [createdDate, requestData, updatedDate],
  );

  const accordData = React.useMemo(
    () => [
      {
        title: "Provider Details",
        child: (
          <Stack gap={2} pt={1}>
            <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Location:</Typography>
                    <Typography variant="body2">{requestData?.provider_location}</Typography>
                  </Stack>
                }
              />
            </Stack>
            <Stack direction="row" alignItems="center" gap={1} px={1}>
              <Typography variant="body2" fontWeight={500} color="common.black">
                Status:
              </Typography>
              <Typography color="common.black" variant="body2">
                <StatusChip label={requestData?.status} hideIcon />
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" gap={1} px={1}>
              <Typography variant="body2" fontWeight={500} color="common.black">
                Public:
              </Typography>
              <Typography color="common.black" variant="body2">
                <StatusChip label={requestData?.public} hideIcon />
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" gap={1} px={1}>
              <Typography variant="body2" fontWeight={500} color="common.black">
                Active:
              </Typography>
              <Typography color="common.black" variant="body2">
                <StatusChip label={requestData?.is_active} hideIcon />
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" gap={1} px={1}>
              <Typography variant="body2" fontWeight={500} color="common.black">
                Description:
              </Typography>
              <Typography color="common.black" variant="body2">
                {requestData?.provider_description}
              </Typography>
            </Stack>
          </Stack>
        ),
      },
    ],
    [requestData],
  );

  return (
    <>
      <DetailsPage accordionData={accordData} headerData={dataHead} />
    </>
  );
}
