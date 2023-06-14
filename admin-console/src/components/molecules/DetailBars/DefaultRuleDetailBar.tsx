import { Divider, Stack, Typography } from "@mui/material";
import { FC } from "react";

import StatusChip from "components/atoms/StatusChip";

interface DefaultRuleDetailBarProps {
  defaultRule: any;
  type?: "page" | "modal";
  customStyle?: any;
}

const DefaultRuleDetailBar: FC<DefaultRuleDetailBarProps> = ({ defaultRule, type = "page", customStyle = {} }) => {
  return (
    <Stack
      divider={<Divider flexItem orientation="vertical" />}
      sx={{
        flexDirection: "row",
        alignItems: "center",
        gap: 1,
        color: "black",
        px: 1,
        flexWrap: "wrap",
        whiteSpace: "pre-wrap",
        ...(type === "page" ? { backgroundColor: "primary.light", py: "4px", borderBottom: 0 } : { borderBottom: "1px solid black" }),
        ...customStyle,
      }}>
      <Stack direction="row" alignItems="center" spacing="4px">
        <Typography component="span" variant="body2">
          Direction:
        </Typography>
        <StatusChip label={defaultRule?.direction} color="info" customStyle={{ textTransform: "none" }} />
      </Stack>
      <Stack direction="row" alignItems="center" spacing="4px">
        <Typography component="span" variant="body2">
          Managed By:
        </Typography>
        <StatusChip label={defaultRule?.managed_by} color="info" customStyle={{ textTransform: "none" }} />
      </Stack>
      <Stack direction="row" alignItems="center" spacing="4px">
        <Typography component="span" variant="body2">
          Ether Type:
        </Typography>
        <StatusChip label={defaultRule?.ethertype} color="info" customStyle={{ textTransform: "none" }} />
      </Stack>
      <Stack direction="row" alignItems="center" spacing="4px">
        <Typography component="span" variant="body2">
          Remote IP Prefix:
        </Typography>
        <StatusChip label={defaultRule?.remote_ip_prefix} color="info" customStyle={{ textTransform: "none" }} />
      </Stack>
      <Stack direction="row" alignItems="center" spacing="4px">
        <Typography component="span" variant="body2">
          Protocol:
        </Typography>
        <StatusChip label={defaultRule?.protocol} color="info" customStyle={{ textTransform: "none" }} />
      </Stack>
      <Stack direction="row" alignItems="center" spacing="4px">
        <Typography component="span" variant="body2">
          Resource Type:
        </Typography>
        <StatusChip label={defaultRule?.resource_type} color="info" customStyle={{ textTransform: "none" }} />
      </Stack>
      <Stack direction="row" alignItems="center" spacing="4px">
        <Typography component="span" variant="body2">
          Status:
        </Typography>
        <StatusChip label={defaultRule?.status} />
      </Stack>
    </Stack>
  );
};

export default DefaultRuleDetailBar;
