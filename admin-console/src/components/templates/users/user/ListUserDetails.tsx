import { Chip, Stack, Typography } from "@mui/material";
import * as React from "react";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import useDataList from "components/organisms/DataList/useDataList";
import DetailsPage from "components/organisms/DetailsPageComponent";

import { formatDate } from "utilities/comp";

type ListUserDetailsProps = {
  fetchUserDetailsFromSSO?: (userId: number) => void;
  handleSyncUser?: (userId: number) => void;
  ssoUserDetails?: any;
  requestData: any;
  requestDetailPage?: boolean;
};

export default function ListUserDetails({ requestData, requestDetailPage = false, fetchUserDetailsFromSSO, handleSyncUser, ssoUserDetails }: ListUserDetailsProps) {
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
        title: "Name",
        label: `${requestData?.first_name} ${requestData?.last_name}`,
      },
      {
        title: "Email",
        label: requestData?.email,
      },
      {
        title: "Created on",
        label: createdDate,
      },
      {
        title: "Updated On",
        label: updatedDate,
      },
      {
        title: "Status",
        label: <StatusChip label={requestData?.status} />,
      },
    ],
    [createdDate, requestData?.email, requestData?.first_name, requestData?.last_name, requestData?.status, updatedDate],
  );

  const columns: any = React.useMemo(() => {
    return [{ label: "User's Name" }, { label: "User's Email" }, { label: "Mobile" }];
  }, []);

  const rowCreator: any = React.useCallback((item: any) => [{ content: `${item?.first_name} ${item?.last_name}` }, { content: item?.email }, { content: item?.mobile_no }], []);
  const ssoUserRowCreator: any = React.useCallback(
    (item: any) => [{ content: `${item?.firstName} ${item?.lastName}` }, { content: item?.email }, { content: item?.attributes?.mobile_number }],
    [],
  );

  const dataList = useDataList({
    data: Array.isArray(requestData) ? requestData : [requestData],
    columns,
    rowCreator,
    hideViewColumn: true,
    maxHeight: "250px",
  });

  const ssoUserDataList = useDataList({
    data: Array.isArray(ssoUserDetails) ? ssoUserDetails : [ssoUserDetails],
    columns,
    rowCreator: ssoUserRowCreator,
    hideViewColumn: true,
    maxHeight: "250px",
  });

  const accordData = React.useMemo(
    () =>
      [
        {
          title: "User Details",
          // child: (
          //   <Stack pt={1}>
          //     <DataList dataList={dataList} hideActionBar={false} />
          //   </Stack>
          // ),
          child: (
            <Stack gap={2} pt={1}>
              <Stack direction="row" flexWrap="wrap" alignItems="center" gap={2}>
                <Chip
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">User Type:</Typography>
                      <Typography variant="body2">{requestData?.user_type}</Typography>
                    </Stack>
                  }
                />

                <Stack direction="row" gap={0.5}>
                  <Typography variant="subtitle2">Is 2fa:</Typography>
                  <StatusChip label={requestData?.is_2fa} />
                </Stack>

                <Stack direction="row" gap={0.5}>
                  <Typography variant="subtitle2">Is Active:</Typography>
                  <StatusChip label={requestData?.is_active} />
                </Stack>

                <Stack direction="row" gap={0.5}>
                  <Typography variant="subtitle2">Is Csrf Token:</Typography>
                  <StatusChip label={requestData?.is_csrf_token} />
                </Stack>

                <Stack direction="row" gap={0.5}>
                  <Typography variant="subtitle2">Is Internal:</Typography>
                  <StatusChip label={requestData?.is_internal} />
                </Stack>

                <Stack direction="row" gap={0.5}>
                  <Typography variant="subtitle2">Is Regular User:</Typography>
                  <StatusChip label={requestData?.is_regular_user} />
                </Stack>
              </Stack>
              <Stack direction="row" alignItems="center" gap={1} px={1} pt={1}>
                <DataList dataList={dataList} hideActionBar={false} />
              </Stack>
            </Stack>
          ),
        },
        ssoUserDetails?.id && {
          title: "Details From SSO",

          child: (
            <Stack gap={2} pt={1}>
              <Stack direction="row" flexWrap="wrap" alignItems="center" gap={2}>
                <Chip
                  label={
                    <Stack direction="row" gap={0.5}>
                      <Typography variant="subtitle2">User Type:</Typography>
                      <Typography variant="body2">{ssoUserDetails?.attributes?.user_type}</Typography>
                    </Stack>
                  }
                />

                <Stack direction="row" gap={0.5}>
                  <Typography variant="subtitle2">Is 2fa:</Typography>
                  <StatusChip label={ssoUserDetails?.attributes?.is_2fa} />
                </Stack>

                <Stack direction="row" gap={0.5}>
                  <Typography variant="subtitle2">Is Active:</Typography>
                  <StatusChip label={ssoUserDetails?.enabled} />
                </Stack>

                <Stack direction="row" gap={0.5}>
                  <Typography variant="subtitle2">Is Temporarily Disabled:</Typography>
                  <StatusChip label={ssoUserDetails?.attack_detection?.disabled || false} />
                </Stack>

                <Stack direction="row" gap={0.5}>
                  <Typography variant="subtitle2">Is Admin:</Typography>
                  <StatusChip label={ssoUserDetails?.attributes?.is_admin} />
                </Stack>

                <Stack direction="row" gap={0.5}>
                  <Typography variant="subtitle2">Is Internal:</Typography>
                  <StatusChip label={ssoUserDetails?.attributes?.is_internal} />
                </Stack>
              </Stack>
              <Stack direction="row" alignItems="center" gap={1} px={1} pt={1}>
                <DataList dataList={ssoUserDataList} hideActionBar={false} />
              </Stack>
            </Stack>
          ),
        },
      ].filter((item: any) => item),
    [
      dataList,
      requestData?.is_2fa,
      requestData?.is_active,
      requestData?.is_csrf_token,
      requestData?.is_internal,
      requestData?.is_regular_user,
      requestData?.user_type,
      ssoUserDetails?.id,
      ssoUserDetails?.attributes?.is_internal,
      ssoUserDetails?.attributes?.is_admin,
      ssoUserDetails?.attack_detection?.disabled,
      ssoUserDetails?.enabled,
      ssoUserDetails?.attributes?.is_2fa,
      ssoUserDetails?.attributes?.user_type,
    ],
  );

  return (
    <>
      <DetailsPage
        accordionData={accordData}
        headerData={dataHead}
        actionButtons={[
          { label: "Get Details From SSO", onClick: () => fetchUserDetailsFromSSO(requestData?.id) },
          { label: "Sync User With SSO", onClick: () => handleSyncUser(requestData?.id) },
        ]}
      />
    </>
  );
}
