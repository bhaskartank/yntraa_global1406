import { Divider, Stack, Typography } from "@mui/material";
import { FilledUserIcon } from "icons";
import { FC } from "react";

import StatusChip from "components/atoms/StatusChip";

interface UserDetailBarProps {
  user: any;
  type?: "page" | "modal";
  customStyle?: any;
}

const UserDetailBar: FC<UserDetailBarProps> = ({ user, type = "page", customStyle = {} }) => {
  return (
    <Stack
      sx={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        color: "black",
        px: 1,
        whiteSpace: "pre-wrap",
        ...(type === "page" ? { backgroundColor: "primary.light", py: "4px", borderBottom: 0 } : { borderBottom: "1px solid black" }),
        ...customStyle,
      }}>
      <Stack direction="row" alignItems="center" spacing={1} flex={1} divider={<Divider flexItem orientation="vertical" />}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <FilledUserIcon />
          <Typography component="span">{`${user?.first_name} ${user?.middle_name} ${user?.last_name}`?.replaceAll("  ", " ")}</Typography>
        </Stack>
        <Typography component="span">{user?.username}</Typography>
      </Stack>

      <Stack direction="row" spacing="4px" alignItems="center">
        <Typography variant="body2">Active:</Typography>
        <StatusChip label={user?.is_active} />
      </Stack>
    </Stack>
  );
};

export default UserDetailBar;
