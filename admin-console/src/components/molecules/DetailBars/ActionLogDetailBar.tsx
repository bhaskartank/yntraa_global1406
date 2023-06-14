import { Box, Divider, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { FaUserAlt } from "react-icons/fa";

import ResourceName from "components/atoms/ResourceName";
import StatusChip from "components/atoms/StatusChip";

interface ComputeDetailBarProps {
  actionLogs: any;
  customStyle?: any;
}

const ActionLogDetailBar: FC<ComputeDetailBarProps> = ({ actionLogs, customStyle = {} }) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={4}
      sx={{ color: "black", px: 1, borderBottom: "1px solid black", whiteSpace: "pre-wrap", ...customStyle }}>
      <Stack direction="row" alignItems="center">
        <Box
          sx={{
            mr: 1,
            width: "2rem",
            minWidth: "2rem",
            height: "2rem",
            minHeight: "2rem",
            border: "1px solid #f0f0f0",
            backgroundSize: "90%",
            borderRadius: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <FaUserAlt size={18} color="#7382E5" />
        </Box>
        <Stack direction="row" alignItems="center" spacing={1}>
          <ResourceName label={actionLogs?.user_name} noWrap />
          <StatusChip label={actionLogs?.status} hideIcon />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ActionLogDetailBar;
