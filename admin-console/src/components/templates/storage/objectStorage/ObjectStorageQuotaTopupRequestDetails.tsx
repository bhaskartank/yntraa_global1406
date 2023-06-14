import { Chip, Stack, Typography } from "@mui/material";
import * as React from "react";

import StatusChip from "components/atoms/StatusChip";
import DetailsPage from "components/organisms/DetailsPageComponent";

import { formatDate } from "utilities/comp";

type ObjectStorageQuotaTopupRequestDetailsProps = {
  requestData: any;
  requestDetailPage?: boolean;
  handleApproveReq?: () => void;
  handleRejectReq?: () => void;
};

export default function ObjectStorageQuotaTopupRequestDetails({
  requestData,
  handleApproveReq,
  handleRejectReq,
  requestDetailPage = false,
}: ObjectStorageQuotaTopupRequestDetailsProps) {
  const [userById, setUserById] = React.useState(null);

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
        title: "Cloud Reg. A/C No.",
        label: requestData?.onboarded_org?.cloud_reg_acno,
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
    [createdDate, requestData?.onboarded_org?.cloud_reg_acno, requestData?.request_id, requestData?.status, updatedDate],
  );

  const accordData = React.useMemo(
    () => [
      {
        title: "Basic Details",
        child: (
          <Stack gap={2} pt={1}>
            <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
              {/* {requestData?.request_id ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Request Id:</Typography>
                      <Typography variant="body2">{requestData?.request_id}</Typography>
                    </Stack>
                  }
                />
              ) : null} */}
              {requestData?.requested_by ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Requested By:</Typography>
                      <Typography variant="body2">{requestData?.requested_by}</Typography>
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
        title: "Quota Package Topup Details",
        child: (
          <Stack gap={2} pt={1}>
            <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
              {requestData?.resource_topup?.resource_name ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Resource Name:</Typography>
                      <Typography variant="body2">
                        {requestData?.resource_topup?.resource_name?.toLowerCase() === "object_storage" ? "Size" : requestData?.resource_topup?.resource_name}
                      </Typography>
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
                      <Typography variant="body2">
                        {requestData?.resource_topup?.resource_name?.toLowerCase() === "object_storage"
                          ? `${requestData?.resource_topup?.topup_value} GiB`
                          : requestData?.resource_topup?.topup_value}
                      </Typography>
                    </Stack>
                  }
                />
              ) : null}
            </Stack>
          </Stack>
        ),
      },
      {
        title: "Object storage Provider Details",
        child: (
          <Stack gap={2} pt={1}>
            <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
              {requestData?.objstorage_provider?.provider_id ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Code:</Typography>
                      <Typography variant="body2">{requestData?.objstorage_provider?.provider_id}</Typography>
                    </Stack>
                  }
                />
              ) : null}

              {requestData?.objstorage_provider?.objectstorage_provider_name ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Name:</Typography>
                      <Typography variant="body2">{requestData?.objstorage_provider?.objectstorage_provider_name}</Typography>
                    </Stack>
                  }
                />
              ) : null}

              {requestData?.objstorage_provider?.objectstorage_provider_location ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Location:</Typography>
                      <Typography variant="body2">{requestData?.objstorage_provider?.objectstorage_provider_location}</Typography>
                    </Stack>
                  }
                />
              ) : null}
              {requestData?.objstorage_provider?.access_endpoint_ip ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Access Endpoint Ip:</Typography>
                      <Typography variant="body2">{requestData?.objstorage_provider?.access_endpoint_ip}</Typography>
                    </Stack>
                  }
                />
              ) : null}
              {requestData?.objstorage_provider?.access_endpoint_port ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Access Endpoint Port:</Typography>
                      <Typography variant="body2">{requestData?.objstorage_provider?.access_endpoint_port}</Typography>
                    </Stack>
                  }
                />
              ) : null}
              {requestData?.objstorage_provider?.access_endpoint_url ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Access Endpoint URL:</Typography>
                      <Typography variant="body2">{requestData?.objstorage_provider?.access_endpoint_url}</Typography>
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
                {requestData?.objstorage_provider?.objectstorage_provider_description}
              </Typography>
            </Stack>
          </Stack>
        ),
      },
    ],
    [
      requestData?.objstorage_provider?.access_endpoint_ip,
      requestData?.objstorage_provider?.access_endpoint_port,
      requestData?.objstorage_provider?.access_endpoint_url,
      requestData?.objstorage_provider?.objectstorage_provider_description,
      requestData?.objstorage_provider?.objectstorage_provider_location,
      requestData?.objstorage_provider?.objectstorage_provider_name,
      requestData?.objstorage_provider?.provider_id,
      requestData?.provider_location,
      requestData?.request_id,
      requestData?.request_origin,
      requestData?.request_remarks,
      requestData?.requested_by,
      requestData?.resource_topup?.resource_name,
      requestData?.resource_topup?.topup_value,
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
