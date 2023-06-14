import { Chip, Stack, Typography } from "@mui/material";
import usersApi from "observability/api/users";
import * as React from "react";

import StatusChip from "components/atoms/StatusChip";
import DetailsPage from "components/organisms/DetailsPageComponent";

import { formatDate } from "utilities/comp";

type ListPublicIpWithdrawDetailProps = {
  requestData: any;
  requestDetailPage?: boolean;
  handleApproveReq?: () => void;
  handleRejectReq?: () => void;
};

export default function ListPublicIpWithdrawDetail({ requestData, handleApproveReq, handleRejectReq, requestDetailPage = false }: ListPublicIpWithdrawDetailProps) {
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
        title: "Application Name",
        label: requestData?.application_name,
      },
      {
        title: "Application URL",
        label: requestData?.application_url,
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
    [createdDate, requestData?.organisation?.name, requestData?.organisation?.org_reg_code, requestData?.status, updatedDate],
  );

  const accordData = React.useMemo(
    () => [
      {
        title: "Basic Details",
        child: (
          <Stack gap={2} pt={1}>
            <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
              {requestData?.request_id ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Request Id:</Typography>
                      <Typography variant="body2">{requestData?.request_id}</Typography>
                    </Stack>
                  }
                />
              ) : null}
              {requestData?.allocated_public_ip ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Allocated Public Ip:</Typography>
                      <Typography variant="body2">{requestData?.allocated_public_ip}</Typography>
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
              {requestData?.routable_ip ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Routable Ip:</Typography>
                      <Typography variant="body2">{requestData?.routable_ip}</Typography>
                    </Stack>
                  }
                />
              ) : null}
              {requestData?.routable_ip_attached_with ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Routable Ip Attached With:</Typography>
                      <Typography variant="body2">{requestData?.routable_ip_attached_with}</Typography>
                    </Stack>
                  }
                />
              ) : null}
              {requestData?.withdrawal_date ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Withdrawal Date:</Typography>
                      <Typography variant="body2">{formatDate(requestData?.withdrawal_date, false, true)}</Typography>
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
            {requestData?.remarks ? (
              <Stack direction="row" alignItems="center" gap={1} px={1}>
                <Typography variant="body2" fontWeight={500} color="common.black">
                  Remarks:
                </Typography>
                <Typography color="common.black" variant="body2">
                  {requestData?.remarks}
                </Typography>
              </Stack>
            ) : null}
          </Stack>
        ),
      },
      {
        title: "Organization Details",
        child: (
          <Stack gap={2} pt={1}>
            <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
              {requestData?.project?.organisation?.org_id ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Organization Code:</Typography>
                      <Typography variant="body2">{requestData?.project?.organisation?.org_id}</Typography>
                    </Stack>
                  }
                />
              ) : null}
              {requestData?.project?.organisation?.name ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Organization Name:</Typography>
                      <Typography variant="body2">{requestData?.project?.organisation?.name}</Typography>
                    </Stack>
                  }
                />
              ) : null}
              {requestData?.project?.organisation?.org_reg_code ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Cloud Reg. A/C No.:</Typography>
                      <Typography variant="body2">{requestData?.project?.organisation?.org_reg_code}</Typography>
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
                {requestData?.project?.organisation?.description}
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
