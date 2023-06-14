import { Button, Chip, Stack, Typography } from "@mui/material";
import usersApi from "observability/api/users";
import * as React from "react";

import StatusChip from "components/atoms/StatusChip";
import DetailsPage from "components/organisms/DetailsPageComponent";

import { formatDate } from "utilities/comp";

type ListBackupPublicIPUpdateRequestDetailProps = {
  requestData: any;
  requestDetailPage?: boolean;
  handleApproveReq?: () => void;
  handleRejectReq?: () => void;
};

export default function ListBackupPublicIPUpdateRequestDetail({
  requestData,
  handleApproveReq,
  handleRejectReq,
  requestDetailPage = false,
}: ListBackupPublicIPUpdateRequestDetailProps) {
  const [userById, setUserById] = React.useState(null);

  React.useEffect(() => {
    const getUserById = async () => {
      if (requestData?.requested_by_id) {
        const result = await usersApi.getPublicIpRequestUserById(requestData?.requested_by_id);
        setUserById(result.data);
      } else {
        setUserById(null);
      }
    };
    getUserById();
  }, [requestData?.requested_by_id]);

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
                      <Typography variant="subtitle2">Gateway:</Typography>
                      <Typography variant="body2">{requestData?.routable_ip_attached_with}</Typography>
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
      requestData?.application_url,
      requestData?.backup_source,
      requestData?.backup_status,
      requestData?.is_backup_exists,
      requestData?.remarks,
      requestData?.request_id,
      requestData?.request_origin,
      requestData?.routable_ip,
      requestData?.routable_ip_attached_with,
      userById,
    ],
  );

  const multiStatusCheck = () => {
    return (
      <>
        {requestData?.is_backup_exists === "yes" && requestData?.is_backup_verified === false && requestData?.status === "rejected" ? (
          <Stack direction="row" justifyContent="left" spacing={3}>
            <Typography variant="body1" color="error">
              * Corresponding public ip update request has already been rejected!
            </Typography>
          </Stack>
        ) : requestData?.is_backup_exists === "yes" && requestData?.is_backup_verified === false && requestData?.status === "cancelled" ? (
          <Stack direction="row" justifyContent="left" spacing={3}>
            <Typography variant="body1" color="error">
              * Corresponding public ip update request has already been cancelled by user!
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
