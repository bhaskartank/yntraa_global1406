import { Stack, Typography } from "@mui/material";
import * as React from "react";

import DetailsPage from "components/organisms/DetailsPageComponent";

import { formatDate } from "utilities/comp";

type ListOrganisationDetailProps = {
  requestData: any;
  requestDetailPage?: boolean;
};

export default function ListOrganisationDetail({ requestData, requestDetailPage = false }: ListOrganisationDetailProps) {
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
        title: "Organization name",
        label: requestData?.name,
      },
      {
        title: "Org. Code",
        label: requestData?.org_id,
      },
      {
        title: "Cloud Reg. A/C No.",
        label: requestData?.org_reg_code,
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
    [createdDate, requestData?.name, requestData?.org_id, requestData?.org_reg_code, updatedDate],
  );

  const accordData = React.useMemo(
    () => [
      {
        title: "Organization Details",
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
    ],
    [requestData?.description],
  );

  return (
    <>
      <DetailsPage accordionData={accordData} headerData={dataHead} />
    </>
  );
}
