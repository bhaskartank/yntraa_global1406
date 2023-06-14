import { Chip, Stack, Typography } from "@mui/material";
import * as React from "react";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import useDataList from "components/organisms/DataList/useDataList";
import DetailsPage from "components/organisms/DetailsPageComponent";

import { formatDate } from "utilities/comp";

type ComputeSnapshotsDetailsProps = {
  requestData: any;
  requestDetailPage?: boolean;
};

export default function ComputeSnapshotsDetails({ requestData, requestDetailPage = false }: ComputeSnapshotsDetailsProps) {
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
        title: "Snapshot name",
        label: requestData?.snapshot_name,
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
    [createdDate, requestData?.snapshot_name, requestData?.status, updatedDate],
  );

  const columns: any = React.useMemo(() => {
    return [{ label: "User's Name" }, { label: "User's Email" }, { label: "Mobile" }];
  }, []);

  const rowCreator: any = React.useCallback((item: any) => [{ content: `${item?.first_name} ${item?.last_name}` }, { content: item?.email }, { content: item?.mobile_no }], []);

  const dataList = useDataList({
    data: Array.isArray(requestData?.user) ? requestData?.user : [requestData?.user],
    columns,
    rowCreator,
    hideViewColumn: true,
    maxHeight: "250px",
  });

  const volumeSnapshotColumns: any = React.useMemo(() => {
    return [{ label: "Snapshot Name" }, { label: "Size" }, { label: "Status" }];
  }, []);

  const volumeSnapshotRowCreator: any = React.useCallback((item: any) => [{ content: item?.snapshot_name }, { content: item?.size }, { content: item?.status }], []);

  const volumeSnapshotDatalist = useDataList({
    data: requestData?.volume_snapshot_compute_snapshot,
    columns: volumeSnapshotColumns,
    rowCreator: volumeSnapshotRowCreator,
    hideViewColumn: true,
    maxHeight: "250px",
  });

  const accordData = React.useMemo(
    () => [
      {
        title: "User Details",
        child: (
          <Stack pt={1}>
            <DataList dataList={dataList} hideActionBar={false} />
          </Stack>
        ),
      },
      {
        title: "Volume Snapshot Compute Snapshot Details",
        child: (
          <Stack pt={1}>
            <DataList dataList={volumeSnapshotDatalist} hideActionBar={false} />
          </Stack>
        ),
      },
      {
        title: "Compute Details",
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
                    <Typography variant="subtitle2">Instance Type: </Typography>
                    <Typography variant="body2"> {requestData?.compute?.instance_type}</Typography>
                  </Stack>
                }
              />
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Private Ip: </Typography>
                    <Typography variant="body2"> {requestData?.compute?.private_ip}</Typography>
                  </Stack>
                }
              />
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Status: </Typography>
                    <Typography variant="body2"> {requestData?.compute?.status}</Typography>
                  </Stack>
                }
              />
            </Stack>
          </Stack>
        ),
      },
      {
        title: "Project Details",
        child: (
          <Stack gap={2} pt={1}>
            <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Project Name:</Typography>
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
        title: "Provider Details",
        child: (
          <Stack gap={2} pt={1}>
            <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Provider Name:</Typography>
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
                    <Typography variant="subtitle2">Provider Snapshot Id:</Typography>
                    <Typography variant="body2">{requestData?.provider_snapshot_id}</Typography>
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
      dataList,
      requestData?.compute?.instance_name,
      requestData?.compute?.instance_type,
      requestData?.compute?.private_ip,
      requestData?.compute?.status,
      requestData?.project?.description,
      requestData?.project?.name,
      requestData?.provider?.provider_description,
      requestData?.provider?.provider_location,
      requestData?.provider?.provider_name,
      requestData?.provider_snapshot_id,
      volumeSnapshotDatalist,
    ],
  );

  return (
    <>
      <DetailsPage accordionData={accordData} headerData={dataHead} />
    </>
  );
}
