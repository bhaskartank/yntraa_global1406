import { Divider, Stack, Typography } from "@mui/material";
import { FC } from "react";

import StatusChip from "components/atoms/StatusChip";

interface QuotaDetailBarProps {
  quotaPackage: any;
  type?: "page" | "modal";
  customStyle?: any;
}

const QuotaDetailBar: FC<QuotaDetailBarProps> = ({ quotaPackage, type = "page", customStyle = {} }) => {
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
          Name:
        </Typography>
        <StatusChip label={quotaPackage?.name} color="info" />
      </Stack>
      <Stack direction="row" alignItems="center" spacing="4px">
        <Typography component="span" variant="body2">
          Version:
        </Typography>
        <StatusChip label={quotaPackage?.version} color="info" />
      </Stack>
      <Stack direction="row" alignItems="center" spacing="4px">
        <Typography component="span" variant="body2">
          Value:
        </Typography>
        <StatusChip label={quotaPackage?.quotapackage_value} color="info" />
      </Stack>
    </Stack>
  );
};

export default QuotaDetailBar;
