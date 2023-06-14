import { Chip, Stack, Typography } from "@mui/material";
import * as React from "react";

import DataList from "components/organisms/DataList";
import useDataList from "components/organisms/DataList/useDataList";
import DetailsPage from "components/organisms/DetailsPageComponent";

import { formatDate } from "utilities/comp";

type ListOnboardedOrganisationsDetailsProps = {
  requestData: any;
  requestDetailPage?: boolean;
};

export default function ListOnboardedOrganisationsDetails({ requestData, requestDetailPage = false }: ListOnboardedOrganisationsDetailsProps) {
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
        title: "Cloud Reg A/C no.",
        label: requestData?.cloud_reg_acno,
      },
      {
        title: "Created By",
        label: requestData?.created_by,
      },
      {
        title: "Created on",
        label: createdDate,
      },
      {
        title: "Cuc",
        label: requestData?.cuc,
      },
    ],
    [createdDate, requestData?.cloud_reg_acno, requestData?.created_by, requestData?.cuc, requestData?.name],
  );

  const columns: any = React.useMemo(() => {
    return [{ label: "Name" }, { label: "Buckets" }, { label: "Objects" }, { label: "Object Storage" }, { label: "Created" }, { label: "Updated" }];
  }, []);

  const rowCreator: any = React.useCallback(
    (item: any) => [
      { content: item?.quotapackage_mapping?.name },
      { content: item?.quotapackage_mapping?.buckets },
      { content: item?.quotapackage_mapping?.objects },
      { content: item?.quotapackage_mapping?.object_storage },
      { content: formatDate(item?.quotapackage_mapping?.created) },
      { content: formatDate(item?.quotapackage_mapping?.updated) },
    ],
    [],
  );

  const dataList = useDataList({
    data: requestData?.onboardedorgn_mapping,
    columns,
    rowCreator,
    hideViewColumn: true,
    maxHeight: "250px",
  });

  const accordData = React.useMemo(
    () => [
      {
        title: "Organization Request Details",
        child: (
          <Stack gap={2} pt={1}>
            <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Organization Name:</Typography>
                    <Typography variant="body2">{requestData?.organisation_request?.name}</Typography>
                  </Stack>
                }
              />
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Cuc: </Typography>
                    <Typography variant="body2"> {requestData?.organisation_request?.cuc}</Typography>
                  </Stack>
                }
              />
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Status: </Typography>
                    <Typography variant="body2"> {requestData?.organisation_request?.status}</Typography>
                  </Stack>
                }
              />
              <Chip
                label={
                  <Stack direction="row" gap={0.5}>
                    <Typography variant="subtitle2">Remarks: </Typography>
                    <Typography variant="body2"> {requestData?.organisation_request?.remarks ? requestData?.organisation_request?.remarks : "-"}</Typography>
                  </Stack>
                }
              />
            </Stack>
            <Stack direction="row" alignItems="center" gap={1} px={1}>
              <Typography variant="body2" fontWeight={500} color="common.black">
                Description:
              </Typography>
              <Typography color="common.black" variant="body2">
                {requestData?.organisation_request?.description}
              </Typography>
            </Stack>
          </Stack>
        ),
      },
      {
        title: "Provider Details",
        child: requestData?.provider ? (
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
                    <Typography variant="subtitle2">Status:</Typography>
                    <Typography variant="body2">{requestData?.provider?.status}</Typography>
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
        ) : (
          <Typography variant="body2"> Nothing to show</Typography>
        ),
      },
      {
        title: "Onboarding Quota Package Mapping Details",
        child: (
          <Stack pt={1}>
            <DataList dataList={dataList} hideActionBar={false} />
          </Stack>
        ),
      },
    ],
    [
      dataList,
      requestData?.organisation_request?.cuc,
      requestData?.organisation_request?.description,
      requestData?.organisation_request?.name,
      requestData?.organisation_request?.remarks,
      requestData?.organisation_request?.status,
      requestData?.provider,
    ],
  );

  return (
    <>
      <DetailsPage accordionData={accordData} headerData={dataHead} />
    </>
  );
}
