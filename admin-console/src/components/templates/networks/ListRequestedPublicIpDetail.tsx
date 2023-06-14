import { Button, Stack, Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import usersApi from "observability/api/users";
import * as React from "react";
import { BsChatSquareQuote } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";

import StatusChip from "components/atoms/StatusChip";

import { formatDate } from "utilities/comp";

type ListRequestedPublicIpDetailProps = {
  requestData: any;
  requestDetailPage?: boolean;
  handleApproveReq?: () => void;
  handleRejectReq?: () => void;
};

export default function ListRequestedPublicIpDetail({ requestData, requestDetailPage = false, handleApproveReq, handleRejectReq }: ListRequestedPublicIpDetailProps) {
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
  }, [requestData]);

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

  return (
    <Stack spacing={4} pt={4}>
      <Stack px={6} justifyContent="space-between" direction="row" spacing={2}>
        <Stack direction="column">
          <Typography variant="body2" color="primary" whiteSpace="nowrap" fontWeight={300}>
            Application Name:
          </Typography>
          <Typography variant="body1" color="primary">
            {requestData?.application_name ? requestData?.application_name : "-"}
          </Typography>
        </Stack>
        <Stack direction="column">
          <Typography variant="body2" color="primary" whiteSpace="nowrap" fontWeight={300}>
            Application Url:
          </Typography>
          <Typography variant="body1" color="primary">
            {requestData?.application_url ? requestData?.application_url : "-"}
          </Typography>
        </Stack>

        {Object.hasOwn(requestData, "status") && (
          <Stack direction="column">
            <Typography variant="body2" color="primary" whiteSpace="nowrap" fontWeight={300}>
              Status:
            </Typography>
            <StatusChip label={requestData?.status} />
          </Stack>
        )}
      </Stack>
      <Stack px={4} direction="row" spacing={4} justifyContent="space-between">
        <Stack sx={{ width: "120%" }} spacing={3}>
          {requestData?.user && (
            <Paper variant="outlined" sx={{ width: "100%" }}>
              <Stack direction="row" p={2} spacing={2}>
                <Stack justifyContent="center">
                  <FaUserCircle size={20} />
                </Stack>
                <Stack sx={{ width: "100%" }} direction="row" spacing={2}>
                  <Stack width="50%">
                    <Typography variant="body2" whiteSpace="nowrap" fontWeight={300}>
                      User Name
                    </Typography>
                    <Typography variant="body2">{requestData?.user?.first_name}</Typography>
                  </Stack>
                  <Stack>
                    <Typography variant="body2" whiteSpace="nowrap" fontWeight={300}>
                      User Email
                    </Typography>
                    <Typography variant="body2">{requestData?.user?.email}</Typography>
                  </Stack>
                  <Stack>
                    <Typography variant="body2" whiteSpace="nowrap" fontWeight={300}>
                      User Mobile No
                    </Typography>
                    <Typography variant="body2">{requestData?.user?.mobile_no}</Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Paper>
          )}
          {requestData?.user &&
            Array.isArray(requestData?.user) &&
            requestData?.user.map((data) => (
              <Paper key={data.id} variant="outlined" sx={{ width: "100%" }}>
                <Stack direction="row" p={2} spacing={2}>
                  <Stack justifyContent="center">
                    <FaUserCircle size={20} />
                  </Stack>
                  <Stack sx={{ width: "100%" }} direction="row" spacing={2}>
                    <Stack width="50%">
                      <Typography variant="body2" whiteSpace="nowrap" fontWeight={300}>
                        User Name
                      </Typography>
                      <Typography variant="body2">{requestData?.user?.first_name}</Typography>
                    </Stack>
                    <Stack>
                      <Typography variant="body2" whiteSpace="nowrap" fontWeight={300}>
                        User Email
                      </Typography>
                      <Typography variant="body2">{requestData?.user?.email}</Typography>
                    </Stack>
                    <Stack>
                      <Typography variant="body2" whiteSpace="nowrap" fontWeight={300}>
                        User Mobile No
                      </Typography>
                      <Typography variant="body2">{requestData?.user?.mobile_no}</Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Paper>
            ))}
          <Paper variant="outlined" sx={{ width: "100%" }}>
            <Stack direction="row" p={2} spacing={2}>
              <Stack justifyContent="center">
                <MdDateRange size={20} />
              </Stack>
              <Stack sx={{ width: "100%" }} direction="row" spacing={2}>
                <Stack sx={{ width: "50%" }}>
                  <Typography variant="body2" whiteSpace="nowrap" fontWeight={300}>
                    Requested On
                  </Typography>
                  <Typography variant="body2">{createdDate}</Typography>
                </Stack>
                <Stack>
                  <Typography variant="body2" whiteSpace="nowrap" fontWeight={300}>
                    Updated On
                  </Typography>
                  <Typography variant="body2">{updatedDate}</Typography>
                </Stack>
              </Stack>
            </Stack>
          </Paper>
          {Object.hasOwn(requestData, "remarks") && (
            <Paper variant="outlined" sx={{ width: "100%" }}>
              <Stack direction="row" p={2} spacing={2}>
                <Stack justifyContent="center">
                  <BsChatSquareQuote size={20} />
                </Stack>
                <Stack sx={{ width: "100%" }} direction="row" spacing={2} justifyContent="space-between">
                  <Stack>
                    <Typography variant="body2" whiteSpace="nowrap" fontWeight={300}>
                      Remarks
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {requestData?.remarks ? requestData?.remarks : "-"}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Paper>
          )}
        </Stack>
        <Stack sx={{ width: "100%" }}>
          <Paper variant="outlined" sx={{ overflowY: "auto", maxHeight: "400px" }}>
            <Stack direction="column" divider={<Divider light={true} orientation="horizontal" flexItem />}>
              <Stack p={2} pl={4} spacing={2}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body2" fontWeight={300} whiteSpace="nowrap">
                    Request By:
                  </Typography>
                  <Typography variant="body2">{userById ? userById?.first_name + " " + userById?.last_name : "-"}</Typography>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body2" fontWeight={300} whiteSpace="nowrap">
                    Request Id:
                  </Typography>
                  <Typography variant="body2">{requestData?.request_id ? requestData?.request_id : "-"}</Typography>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body2" fontWeight={300} whiteSpace="nowrap">
                    Routable Ip:
                  </Typography>
                  <Typography variant="body2">{requestData?.routable_ip ? requestData?.routable_ip : "-"}</Typography>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body2" fontWeight={300} whiteSpace="nowrap">
                    Routable Ip Attached With:
                  </Typography>
                  <Typography variant="body2">{requestData?.routable_ip_attached_with ? requestData?.routable_ip_attached_with : "-"}</Typography>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body2" fontWeight={300} whiteSpace="nowrap">
                    Traffic Direction:
                  </Typography>
                  <Typography variant="body2">{requestData?.traffic_direction ? requestData?.traffic_direction : "-"}</Typography>
                </Stack>
              </Stack>
              <Stack p={2} pl={4} spacing={2}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body2" fontWeight={300} whiteSpace="nowrap">
                    Project Name:
                  </Typography>
                  <Typography variant="body2">{requestData?.project?.name ? requestData?.project?.name : "-"}</Typography>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body2" fontWeight={300} whiteSpace="nowrap">
                    Project Description:
                  </Typography>
                  <Typography variant="body2">{requestData?.project?.description ? requestData?.project?.description : "-"}</Typography>
                </Stack>
              </Stack>
              <Stack p={2} pl={4} spacing={2}>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body2" whiteSpace="nowrap" fontWeight={300}>
                    Provider Name:
                  </Typography>
                  <Typography variant="body2">{requestData?.provider?.provider_name ? requestData?.provider?.provider_name : "-"}</Typography>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body2" whiteSpace="nowrap" fontWeight={300}>
                    Provider Location:
                  </Typography>
                  <Typography variant="body2">{requestData?.provider?.provider_location ? requestData?.provider?.provider_location : "-"}</Typography>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body2" whiteSpace="nowrap" fontWeight={300}>
                    Provider Description:
                  </Typography>
                  <Typography variant="body2">{requestData?.provider?.provider_description ? requestData?.provider?.provider_description : "-"}</Typography>
                </Stack>
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Stack>
      {requestDetailPage && requestData?.status.toLowerCase() === "pending" && (
        <Stack direction="row" justifyContent="right" spacing={3} px={4}>
          <Button variant="outlined" onClick={handleRejectReq}>
            Reject
          </Button>
          <Button variant="contained" onClick={handleApproveReq}>
            Approve
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
