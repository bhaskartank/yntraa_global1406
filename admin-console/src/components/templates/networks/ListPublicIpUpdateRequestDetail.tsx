import { Chip, Stack, Typography } from "@mui/material";
import usersApi from "observability/api/users";
import * as React from "react";

import StatusChip from "components/atoms/StatusChip";
import DetailsPage from "components/organisms/DetailsPageComponent";

import { formatDate } from "utilities/comp";

type ListPublicIpUpdateRequestDetailProps = {
  requestData: any;
  requestDetailPage?: boolean;
  handleApproveReq?: () => void;
  handleRejectReq?: () => void;
};

export default function ListPublicIpUpdateRequestDetail({ requestData, handleApproveReq, handleRejectReq, requestDetailPage = false }: ListPublicIpUpdateRequestDetailProps) {
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
    [createdDate, requestData?.application_name, requestData?.application_url, requestData?.status, updatedDate],
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
        title: "Backup Details",
        child: (
          <Stack gap={2} pt={1}>
            <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
              {requestData?.backup_request_date ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Backup Request Date:</Typography>
                      <Typography variant="body2">{requestData?.backup_request_date}</Typography>
                    </Stack>
                  }
                />
              ) : null}
              {requestData?.backup_request_id ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Backup Request Id:</Typography>
                      <Typography variant="body2">{requestData?.backup_request_id}</Typography>
                    </Stack>
                  }
                />
              ) : null}
              {requestData?.backup_source ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Backup Source:</Typography>
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
                      <Typography variant="subtitle2">Backup Status:</Typography>
                      <Typography variant="body2">{requestData?.backup_status}</Typography>
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
      requestData?.allocated_public_ip,
      requestData?.backup_request_date,
      requestData?.backup_request_id,
      requestData?.backup_source,
      requestData?.backup_status,
      requestData?.provider_location,
      requestData?.quotapackage_name,
      requestData?.remarks,
      requestData?.request_id,
      requestData?.request_origin,
      requestData?.request_remarks,
      requestData?.routable_ip,
      requestData?.routable_ip_attached_with,
      requestData?.withdrawal_date,
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
