import { Box, Chip, Tooltip } from "@mui/material";
import { FC, useMemo } from "react";
import { AiFillInfoCircle } from "react-icons/ai";
import { MdCancel, MdCheckCircle, MdPauseCircle } from "react-icons/md";

type Color = "primary" | "secondary" | "warning" | "info" | "success" | "default" | "error";

interface StatusChipProps {
  label: string | boolean;
  color?: Color;
  size?: "small" | "medium";
  customStyle?: any;
  hideIcon?: boolean;
  helperText?: string;
}

const StatusChip: FC<StatusChipProps> = ({ label = "", color, size = "small", customStyle = {}, hideIcon = false, helperText }) => {
  const chipProps = useMemo(() => {
    const prop: { color?: Color; label?: string; icon?: any } = { color: "default", label: label?.toString()?.toLowerCase(), icon: null };

    switch (prop.label) {
      case "active":
      case "true":
      case "approved":
      case "available":
      case "enabled":
      case "internal":
      case "inbound":
      case "created":
      case "attached":
      case "configured":
      case "success":
      case "running":
      case "allocated":
      case "verified":
      case "withdrawn":
        prop.color = "success";
        break;
      case "deleted":
      case "deleting":
      case "false":
      case "system":
      case "rejected":
      case "shutoff":
      case "down":
      case "external":
      case "outbound":
      case "error":
      case "fail":
        prop.color = "error";
        break;
      case "cancelled":
        prop.color = "error";
        break;
      case "paused":
      case "pending":
      case "verify_resize":
      case "inbound or outbound":
      case "in progress":
      case "not verified":
      case "onboarding_pending":
        prop.color = "warning";
        break;
      case "user":
      case "inprogress":
        prop.color = "info";
        break;
      default:
        prop.color = "default";
    }

    switch (prop.label) {
      case "active":
      case "approved":
      case "true":
      case "enabled":
      case "created":
      case "attached":
      case "available":
      case "configured":
      case "success":
      case "running":
      case "allocated":
      case "verified":
      case "withdrawn":
        prop.icon = <MdCheckCircle />;
        break;
      case "deleted":
      case "rejected":
      case "false":
      case "down":
      case "error":
      case "fail":
        prop.icon = <MdCancel />;
        break;
      case "cancelled":
        prop.icon = <MdCancel />;
        break;
      case "paused":
      case "pending":
      case "in progress":
      case "not verified":
      case "onboarding_pending":
        prop.icon = <MdPauseCircle />;
        break;
      default:
        prop.icon = null;
    }

    return prop;
  }, [label]);

  return (
    <Chip
      label={chipProps?.label}
      color={color || chipProps?.color}
      size={size}
      icon={hideIcon ? null : chipProps?.icon}
      {...(helperText
        ? {
            deleteIcon: (
              <Tooltip title={helperText}>
                <Box sx={{ height: "100%" }}>
                  <AiFillInfoCircle color="common.white" style={{ marginLeft: "4px" }} />
                </Box>
              </Tooltip>
            ),
            onDelete: () => null,
          }
        : {})}
      sx={{ height: "20px", textTransform: "capitalize", ...customStyle, ".MuiChip-icon": { fontSize: "16px", ml: "2px" }, ".MuiChip-label": { fontSize: "12px", pr: "8px" } }}
    />
  );
};

export default StatusChip;
