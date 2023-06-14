import { Chip, Stack, Typography } from "@mui/material";
import * as React from "react";

import StatusChip from "components/atoms/StatusChip";
import DetailsPage from "components/organisms/DetailsPageComponent";

import { formatDate } from "utilities/comp";

type ListBackupDetailProps = {
  requestData: any;
  requestDetailPage?: boolean;
};

export default function ListBackupDetail({ requestData, requestDetailPage = false }: ListBackupDetailProps) {
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
        title: "Backup Network Ip",
        label: requestData?.backup_network_ip,
      },
      {
        title: "Backup Path",
        label: requestData?.backup_path ? requestData?.backup_path : "-",
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
    [createdDate, requestData?.backup_network_ip, requestData?.backup_path, requestData?.status, updatedDate],
  );

  const accordData = React.useMemo(
    () => [
      {
        title: "Compute Detail",
        child: (
          <Stack gap={2} pt={1}>
            <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Instance Name:</Typography>
                    <Typography variant="body2">{requestData?.compute?.instance_name}</Typography>
                  </Stack>
                }
              />
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Private Ip:</Typography>
                    <Typography variant="body2">{requestData?.compute?.private_ip}</Typography>
                  </Stack>
                }
              />
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Availability Zone:</Typography>
                    <Typography variant="body2">{requestData?.compute?.availability_zone}</Typography>
                  </Stack>
                }
              />
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Status:</Typography>
                    <Typography variant="body2">{requestData?.compute?.status}</Typography>
                  </Stack>
                }
              />
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
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Name:</Typography>
                    <Typography variant="body2">{requestData?.project?.name}</Typography>
                  </Stack>
                }
              />
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
        title: "Provider Detail",
        child: (
          <Stack gap={2} pt={1}>
            <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Name:</Typography>
                    <Typography variant="body2">{requestData?.provider?.provider_name}</Typography>
                  </Stack>
                }
              />
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Provider Location:</Typography>
                    <Typography variant="body2">{requestData?.provider?.provider_location}</Typography>
                  </Stack>
                }
              />
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Provider Type Name:</Typography>
                    <Typography variant="body2">{requestData?.provider?.provider_type?.name}</Typography>
                  </Stack>
                }
              />
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
      requestData?.compute?.availability_zone,
      requestData?.compute?.instance_name,
      requestData?.compute?.private_ip,
      requestData?.compute?.status,
      requestData?.project?.description,
      requestData?.project?.name,
    ],
  );

  return (
    <>
      <DetailsPage accordionData={accordData} headerData={dataHead} />
    </>
  );
}
