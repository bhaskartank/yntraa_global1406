import { Divider, Stack, Typography } from "@mui/material";
import { FC } from "react";

import StatusChip from "components/atoms/StatusChip";

interface ObjectStorageQuotaDetailBarProps {
  organisation: any;
  type?: "page" | "modal";
  customStyle?: any;
}

const ObjectStorageQuotaDetailBar: FC<ObjectStorageQuotaDetailBarProps> = ({ organisation, type = "page", customStyle = {} }) => {
  return (
    <Stack
      divider={<Divider flexItem orientation="vertical" />}
      sx={{
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
        color: "black",
        px: 1,
        whiteSpace: "pre-wrap",
        ...(type === "page" ? { backgroundColor: "primary.light", py: "4px", borderBottom: 0 } : { borderBottom: "1px solid black" }),
        ...customStyle,
      }}>
      <Stack direction="row" alignItems="center" spacing="4px">
        <Typography component="span" variant="body2">
          Organisation Name:
        </Typography>
        <StatusChip label={organisation?.name} color="info" />
      </Stack>
      <Stack direction="row" alignItems="center" spacing="4px">
        <Typography component="span" variant="body2">
          Organisation ID:
        </Typography>
        <StatusChip label={organisation?.cuc} color="info" />
      </Stack>
      <Stack direction="row" alignItems="center" spacing="4px">
        <Typography component="span" variant="body2">
          Cloud Reg. A/C No:
        </Typography>
        <StatusChip label={organisation?.cloud_reg_acno} color="info" />
      </Stack>
    </Stack>
  );
};

export default ObjectStorageQuotaDetailBar;
