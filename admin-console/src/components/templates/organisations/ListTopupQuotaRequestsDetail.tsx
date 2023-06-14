import { Chip, Stack, Typography } from "@mui/material";
import usersApi from "observability/api/users";
import * as React from "react";

import StatusChip from "components/atoms/StatusChip";
import DetailsPage from "components/organisms/DetailsPageComponent";

import { formatDate } from "utilities/comp";

type ListTopupQuotaRequestsDetailProps = {
  requestData: any;
  requestDetailPage?: boolean;
  handleApproveReq?: () => void;
  handleRejectReq?: () => void;
};

export default function ListTopupQuotaRequestsDetail({ requestData, handleApproveReq, handleRejectReq, requestDetailPage = false }: ListTopupQuotaRequestsDetailProps) {
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
        title: "Request Id",
        label: requestData?.request_id,
      },
      {
        title: "Organization name",
        label: requestData?.organisation?.name,
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
    [createdDate, requestData?.organisation?.name, requestData?.request_id, requestData?.status, updatedDate],
  );

  const accordData = React.useMemo(
    () => [
      {
        title: "Basic Details",
        child: (
          <Stack gap={2} pt={1}>
            <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
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
              {requestData?.request_origin ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Request Origin:</Typography>
                      <Typography variant="body2">{requestData?.request_origin}</Typography>
                    </Stack>
                  }
                />
              ) : null}
              {requestData?.request_remarks ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Request Remarks:</Typography>
                      <Typography variant="body2">{requestData?.request_remarks}</Typography>
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
          </Stack>
        ),
      },
      {
        title: "Organization Details",
        child: (
          <Stack gap={2} pt={1}>
            <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
              {requestData?.organisation?.org_reg_code ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Cloud Reg. A/C No:</Typography>
                      <Typography variant="body2">{requestData?.organisation?.org_reg_code}</Typography>
                    </Stack>
                  }
                />
              ) : null}
              {requestData?.organisation?.org_id ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Organization Code:</Typography>
                      <Typography variant="body2">{requestData?.organisation?.org_id}</Typography>
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
                {requestData?.organisation?.description}
              </Typography>
            </Stack>
          </Stack>
        ),
      },
      {
        title: "Topup Details",
        child: (
          <Stack gap={2} pt={1}>
            <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
              {requestData?.resource_topup?.topup_type ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Topup Type:</Typography>
                      <Typography variant="body2">{requestData?.resource_topup?.topup_type}</Typography>
                    </Stack>
                  }
                />
              ) : null}
              {requestData?.resource_topup?.topup_value ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Topup Value:</Typography>
                      <Typography variant="body2">{requestData?.resource_topup?.topup_value}</Typography>
                    </Stack>
                  }
                />
              ) : null}
            </Stack>
          </Stack>
        ),
      },
      {
        title: "Quotapackage Details",
        child: (
          <Stack gap={2} pt={1}>
            <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
              {requestData?.quotapackage?.name ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Quotapackage Name:</Typography>
                      <Typography variant="body2">{requestData?.quotapackage?.name}</Typography>
                    </Stack>
                  }
                />
              ) : null}
              {requestData?.quotapackage?.is_active ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Is Active:</Typography>
                      <Typography variant="body2">{requestData?.quotapackage?.is_active ? "Yes" : "No"}</Typography>
                    </Stack>
                  }
                />
              ) : null}
              {requestData?.quotapackage?.quotapackage_value ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Quotapackage Value:</Typography>
                      <Typography variant="body2">{requestData?.quotapackage?.quotapackage_value}</Typography>
                    </Stack>
                  }
                />
              ) : null}
              {requestData?.quotapackage?.version ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Version:</Typography>
                      <Typography variant="body2">{requestData?.quotapackage?.version}</Typography>
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
                {requestData?.quotapackage?.description}
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
              {requestData?.provider?.provider_id ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Code:</Typography>
                      <Typography variant="body2">{requestData?.provider?.provider_id}</Typography>
                    </Stack>
                  }
                />
              ) : null}

              {requestData?.provider?.provider_name ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Name:</Typography>
                      <Typography variant="body2">{requestData?.provider?.provider_name}</Typography>
                    </Stack>
                  }
                />
              ) : null}

              {requestData?.provider?.provider_location ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Location:</Typography>
                      <Typography variant="body2">{requestData?.provider?.provider_location}</Typography>
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
                {requestData?.provider?.provider_description}
              </Typography>
            </Stack>
          </Stack>
        ),
      },
    ],
    [
      requestData?.organisation?.description,
      requestData?.organisation?.org_id,
      requestData?.organisation?.org_reg_code,
      requestData?.provider?.provider_description,
      requestData?.provider?.provider_id,
      requestData?.provider?.provider_location,
      requestData?.provider?.provider_name,
      requestData?.provider_location,
      requestData?.quotapackage?.description,
      requestData?.quotapackage?.is_active,
      requestData?.quotapackage?.name,
      requestData?.quotapackage?.quotapackage_value,
      requestData?.quotapackage?.version,
      requestData?.quotapackage_name,
      requestData?.request_origin,
      requestData?.request_remarks,
      requestData?.resource_topup?.topup_type,
      requestData?.resource_topup?.topup_value,
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
