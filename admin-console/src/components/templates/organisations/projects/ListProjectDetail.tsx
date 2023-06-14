import { Chip, Stack, Typography } from "@mui/material";
import * as React from "react";

import DetailsPage from "components/organisms/DetailsPageComponent";

import { formatDate } from "utilities/comp";

type ListProjectDetailProps = {
  requestData: any;
  requestDetailPage?: boolean;
};

export default function ListProjectDetail({ requestData, requestDetailPage = false }: ListProjectDetailProps) {
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
        title: "Project name",
        label: requestData?.name,
      },
      {
        title: "Project Type",
        label: requestData?.project_type,
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
    [createdDate, requestData?.name, requestData?.project_type, updatedDate],
  );

  const accordData = React.useMemo(
    () => [
      {
        title: "Project Details",
        child: (
          <Stack direction="row" alignItems="center" gap={1} pt={1}>
            <Typography variant="body2" fontWeight={500} color="common.black">
              Description:
            </Typography>
            <Typography color="common.black" variant="body2">
              {requestData?.description}
            </Typography>
          </Stack>
        ),
      },
      {
        title: "Organization Details",
        child: (
          <Stack gap={2} pt={1}>
            <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Organization Name:</Typography>
                    <Typography variant="body2">{requestData?.organisation?.name}</Typography>
                  </Stack>
                }
              />
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Cloud Reg. A/C No.: </Typography>
                    <Typography variant="body2"> {requestData?.organisation?.org_reg_code}</Typography>
                  </Stack>
                }
              />
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Organization Code: </Typography>
                    <Typography variant="body2"> {requestData?.organisation?.org_id}</Typography>
                  </Stack>
                }
              />
            </Stack>
            <Stack direction="row" alignItems="center" gap={1} px={1}>
              <Typography variant="body2" fontWeight={500} color="common.black">
                Description:
              </Typography>
              <Typography color="common.black" variant="body2">
                {requestData?.description}
              </Typography>
            </Stack>
          </Stack>
        ),
      },
    ],
    [requestData?.description, requestData?.organisation?.name, requestData?.organisation?.org_id, requestData?.organisation?.org_reg_code],
  );

  return <DetailsPage accordionData={accordData} headerData={dataHead} />;
}
