import { Chip, Stack, Typography } from "@mui/material";
import usersApi from "observability/api/users";
import * as React from "react";

import StatusChip from "components/atoms/StatusChip";
import DetailsPage from "components/organisms/DetailsPageComponent";

import { formatDate } from "utilities/comp";

type ListOrganisationOnboardingRequestDetailProps = {
  requestData: any;
  requestDetailPage?: boolean;
  handleApproveReq?: () => void;
  handleRejectReq?: () => void;
};

export default function ListOrganisationOnboardingRequestDetail({
  requestData,
  handleApproveReq,
  handleRejectReq,
  requestDetailPage = false,
}: ListOrganisationOnboardingRequestDetailProps) {
  const [userById, setUserById] = React.useState(null);

  React.useEffect(() => {
    const getUserById = async () => {
      if (requestData?.requested_by) {
        const result = await usersApi.getPublicIpRequestUserById(requestData?.requested_by);
        setUserById(result.data);
      } else {
        setUserById(null);
      }
    };
    getUserById();
  }, [requestData?.requested_by]);

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
      {
        title: "Status",
        label: <StatusChip label={requestData?.status} />,
      },
    ],
    [createdDate, requestData?.name, requestData?.org_reg_code, requestData?.status, updatedDate],
  );

  const accordData = React.useMemo(
    () => [
      {
        title: "Organization Details",
        child: (
          <Stack gap={2} pt={1}>
            <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
              {requestData?.quotapackage_name ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Remarks:</Typography>
                      <Typography variant="body2">{requestData?.quotapackage_name}</Typography>
                    </Stack>
                  }
                />
              ) : null}
              {userById ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Requested By:</Typography>
                      <Typography variant="body2">{requestData?.quotapackage_name}</Typography>
                      <Typography variant="body2">{userById?.first_name + " " + userById?.last_name}</Typography>
                    </Stack>
                  }
                />
              ) : null}
              {requestData?.remarks ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Remarks:</Typography>
                      <Typography variant="body2">{requestData?.remarks}</Typography>
                    </Stack>
                  }
                />
              ) : null}
              {requestData?.provider_location ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Provider Location:</Typography>
                      <Typography variant="body2">{requestData?.provider_location}</Typography>
                    </Stack>
                  }
                />
              ) : null}
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
                    <Typography variant="body2">{requestData?.project_name}</Typography>
                  </Stack>
                }
              />
            </Stack>
            <Stack direction="row" alignItems="center" gap={1} px={1}>
              <Typography variant="body2" fontWeight={500} color="common.black">
                Description:
              </Typography>
              <Typography color="common.black" variant="body2">
                {requestData?.project_description}
              </Typography>
            </Stack>
          </Stack>
        ),
      },
    ],
    [
      requestData?.description,
      requestData?.project_description,
      requestData?.project_name,
      requestData?.provider_location,
      requestData?.quotapackage_name,
      requestData?.remarks,
      userById,
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
