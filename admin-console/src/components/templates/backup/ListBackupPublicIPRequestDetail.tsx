import { Button, Chip, Stack, Typography } from "@mui/material";
import usersApi from "observability/api/users";
import * as React from "react";

import StatusChip from "components/atoms/StatusChip";
import DetailsPage from "components/organisms/DetailsPageComponent";

import { formatDate } from "utilities/comp";

type ListBackupPublicIPRequestDetailProps = {
  requestData: any;
  requestDetailPage?: boolean;
  handleApproveReq?: () => void;
  handleRejectReq?: () => void;
};

export default function ListBackupPublicIPRequestDetail({ requestData, handleApproveReq, handleRejectReq, requestDetailPage = false }: ListBackupPublicIPRequestDetailProps) {
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

  const getStatusLabel = React.useCallback((item) => {
    return item?.is_backup_verified === true
      ? "verified"
      : item.backup_reject_remarks && item.backup_reject_remarks !== ""
      ? "rejected"
      : item.is_backup_verified === false
      ? "Not Verified"
      : "-";
  }, []);

  const dataHead = React.useMemo(
    () => [
      {
        title: "Application Name",
        label: requestData?.application_name,
      },
      {
        title: "Aadhar Compliance",
        label: requestData?.aadhar_compliance,
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
        label: <StatusChip label={getStatusLabel(requestData)} />,
      },
    ],
    [createdDate, getStatusLabel, requestData, updatedDate],
  );

  const accordData = React.useMemo(
    () => [
      {
        title: "Basic Details",
        child: (
          <Stack gap={2} pt={1}>
            <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
              {requestData?.application_url ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Application Url:</Typography>
                      <Typography variant="body2">{requestData?.application_url}</Typography>
                    </Stack>
                  }
                />
              ) : null}
              {requestData?.backup_source ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Backup Source :</Typography>
                      <Typography variant="body2">{requestData?.backup_source}</Typography>
                    </Stack>
                  }
                />
              ) : null}
              {requestData?.backup_status ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Backup Status :</Typography>
                      <Typography variant="body2">{requestData?.backup_status}</Typography>
                    </Stack>
                  }
                />
              ) : null}
              {requestData?.is_backup_exists ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Is Backup Exists :</Typography>
                      <Typography variant="body2">{requestData?.is_backup_exists}</Typography>
                    </Stack>
                  }
                />
              ) : null}
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
              {userById ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Requested By:</Typography>
                      <Typography variant="body2">{`${userById?.first_name} ${userById?.last_name}`}</Typography>
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
        title: "Project Details",
        child: (
          <Stack gap={2} pt={1}>
            <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
              {requestData?.project?.name ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Name:</Typography>
                      <Typography variant="body2">{requestData?.project?.name}</Typography>
                    </Stack>
                  }
                />
              ) : null}
              {requestData?.project?.project_id ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Code:</Typography>
                      <Typography variant="body2">{requestData?.project?.project_id}</Typography>
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
                {requestData?.project?.description}
              </Typography>
            </Stack>
          </Stack>
        ),
      },
      {
        title: "Provider Details",
        child: (
          <Stack gap={2} pt={1}>
            <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
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
      requestData?.application_url,
      requestData?.backup_source,
      requestData?.backup_status,
      requestData?.is_backup_exists,
      requestData?.project?.description,
      requestData?.project?.name,
      requestData?.project?.project_id,
      requestData?.provider?.provider_description,
      requestData?.provider?.provider_id,
      requestData?.provider?.provider_location,
      requestData?.provider?.provider_name,
      requestData?.provider_location,
      requestData?.request_id,
      requestData?.request_origin,
      requestData?.request_remarks,
      userById,
    ],
  );

  const multiStatusCheck = () => {
    return (
      <>
        {requestData?.is_backup_exists === "yes" && requestData?.is_backup_verified === false && requestData?.status === "rejected" ? (
          <Stack direction="row" justifyContent="left" spacing={3}>
            <Typography variant="body1" color="error">
              * Corresponding public ip request has already been rejected!
            </Typography>
          </Stack>
        ) : requestData?.is_backup_exists === "yes" && requestData?.is_backup_verified === false && requestData?.status === "cancelled" ? (
          <Stack direction="row" justifyContent="left" spacing={3}>
            <Typography variant="body1" color="error">
              * Corresponding public ip request has already been cancelled by user!
            </Typography>
          </Stack>
        ) : (
          requestDetailPage &&
          getStatusLabel(requestData) === "Not Verified" && (
            <Stack gap={2} direction="row" justifyContent="flex-end">
              <Button variant="contained" onClick={handleRejectReq}>
                Reject
              </Button>
              <Button variant="contained" onClick={handleApproveReq}>
                Approve
              </Button>
            </Stack>
          )
        )}
      </>
    );
  };

  return (
    <>
      <DetailsPage
        accordionData={accordData}
        headerData={dataHead}
        detailPageData={requestData}
        isRequesting={requestDetailPage}
        multiStatusCheck={multiStatusCheck}
        handleApproveReq={handleApproveReq}
        handleRejectReq={handleRejectReq}
      />
    </>
  );
}
