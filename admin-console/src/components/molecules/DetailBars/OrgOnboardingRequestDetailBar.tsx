import { Divider, Stack, Typography } from "@mui/material";
import { FC } from "react";

import StatusChip from "components/atoms/StatusChip";

interface OrgOnboardingRequestDetailBarProps {
  data: any;
  type?: "page" | "modal";
  customStyle?: any;
}

const OrgOnboardingRequestDetailBar: FC<OrgOnboardingRequestDetailBarProps> = ({ data, type = "page", customStyle = {} }) => {
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
        <StatusChip label={data?.name} color="info" />
      </Stack>
      <Stack direction="row" alignItems="center" spacing="4px">
        <Typography component="span" variant="body2">
          Cloud Reg. A/C No:
        </Typography>
        <StatusChip label={data?.org_reg_code} color="info" />
      </Stack>
      <Stack direction="row" alignItems="center" spacing="4px">
        <Typography component="span" variant="body2">
          Status:
        </Typography>
        <StatusChip label={data?.status} />
      </Stack>
    </Stack>
  );
};

export default OrgOnboardingRequestDetailBar;
