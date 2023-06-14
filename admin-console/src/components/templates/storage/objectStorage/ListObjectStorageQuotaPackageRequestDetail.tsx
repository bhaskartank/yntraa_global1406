import { Chip, Stack, Typography } from "@mui/material";
import usersApi from "observability/api/users";
import * as React from "react";

import StatusChip from "components/atoms/StatusChip";
import DetailsPage from "components/organisms/DetailsPageComponent";

import { formatDate } from "utilities/comp";

type ListObjectStorageQuotaPackageRequestDetailProps = {
  requestData: any;
  requestDetailPage?: boolean;
  handleApproveReq?: () => void;
  handleRejectReq?: () => void;
};

export default function ListObjectStorageQuotaPackageRequestDetail({
  requestData,
  handleApproveReq,
  handleRejectReq,
  requestDetailPage = false,
}: ListObjectStorageQuotaPackageRequestDetailProps) {
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
        title: "Cloud Reg. A/C No.",
        label: requestData?.quotapackage_update_organisation?.cloud_reg_acno,
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
    [createdDate, requestData?.quotapackage_update_organisation?.cloud_reg_acno, requestData?.status, updatedDate],
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
        title: "Quota Package Details",
        child: (
          <Stack gap={2} pt={1}>
            <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
              {requestData?.quotapackage_update_quotapackage?.name ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Name:</Typography>
                      <Typography variant="body2">{requestData?.quotapackage_update_quotapackage?.name}</Typography>
                    </Stack>
                  }
                />
              ) : null}
              {requestData?.quotapackage_update_quotapackage?.object_storage ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Size:</Typography>
                      <Typography variant="body2">{requestData?.quotapackage_update_quotapackage?.object_storage} GiB</Typography>
                    </Stack>
                  }
                />
              ) : null}
              {requestData?.quotapackage_update_quotapackage?.objects ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Objects:</Typography>
                      <Typography variant="body2">{requestData?.quotapackage_update_quotapackage?.objects}</Typography>
                    </Stack>
                  }
                />
              ) : null}
              {requestData?.quotapackage_update_quotapackage?.buckets ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Buckets:</Typography>
                      <Typography variant="body2">{requestData?.quotapackage_update_quotapackage?.buckets}</Typography>
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
                {requestData?.quotapackage_update_quotapackage?.description}
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

              {requestData?.quotapackage_update_provider?.objectstorage_provider_name ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Name:</Typography>
                      <Typography variant="body2">{requestData?.quotapackage_update_provider?.objectstorage_provider_name}</Typography>
                    </Stack>
                  }
                />
              ) : null}

              {requestData?.quotapackage_update_provider?.objectstorage_provider_location ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Location:</Typography>
                      <Typography variant="body2">{requestData?.quotapackage_update_provider?.objectstorage_provider_location}</Typography>
                    </Stack>
                  }
                />
              ) : null}
              {requestData?.quotapackage_update_provider?.access_endpoint_ip ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Access Endpoint Ip:</Typography>
                      <Typography variant="body2">{requestData?.quotapackage_update_provider?.access_endpoint_ip}</Typography>
                    </Stack>
                  }
                />
              ) : null}
              {requestData?.quotapackage_update_provider?.access_endpoint_port ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Access Endpoint Port:</Typography>
                      <Typography variant="body2">{requestData?.quotapackage_update_provider?.access_endpoint_port}</Typography>
                    </Stack>
                  }
                />
              ) : null}
              {requestData?.quotapackage_update_provider?.access_endpoint_url ? (
                <Chip
                  variant="outlined"
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">Access Endpoint URL:</Typography>
                      <Typography variant="body2">{requestData?.quotapackage_update_provider?.access_endpoint_url}</Typography>
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
                {requestData?.quotapackage_update_provider?.objectstorage_provider_description}
              </Typography>
            </Stack>
          </Stack>
        ),
      },
    ],
    [
      requestData?.provider?.provider_id,
      requestData?.provider_location,
      requestData?.quotapackage_update_provider?.access_endpoint_ip,
      requestData?.quotapackage_update_provider?.access_endpoint_port,
      requestData?.quotapackage_update_provider?.access_endpoint_url,
      requestData?.quotapackage_update_provider?.objectstorage_provider_description,
      requestData?.quotapackage_update_provider?.objectstorage_provider_location,
      requestData?.quotapackage_update_provider?.objectstorage_provider_name,
      requestData?.quotapackage_update_provider?.provider_id,
      requestData?.quotapackage_update_quotapackage?.buckets,
      requestData?.quotapackage_update_quotapackage?.description,
      requestData?.quotapackage_update_quotapackage?.name,
      requestData?.quotapackage_update_quotapackage?.object_storage,
      requestData?.quotapackage_update_quotapackage?.objects,
      requestData?.request_id,
      requestData?.request_origin,
      requestData?.request_remarks,
      requestData?.requested_by,
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
