import { Box, Chip, Tooltip } from "@mui/material";
import { FC, useMemo } from "react";
import { AiFillInfoCircle } from "react-icons/ai";

type Color = "primary" | "secondary" | "warning" | "info" | "success" | "default" | "error";

interface StatusChipProps {
  label: string | boolean;
  color?: Color;
  size?: "small" | "medium";
  customStyle?: any;
  hideIcon?: boolean;
  helperText?: string;
  icon?: any;
  loading?: boolean;
}

const StatusChip: FC<StatusChipProps> = ({ label = "", color, size = "small", customStyle = {}, hideIcon = false, helperText, loading = false }) => {
  const chipProps = useMemo(() => {
    const prop: { color?: Color; label?: string; icon?: any } = {
      color: "default",
      label: label?.toString()?.toLowerCase(),
      icon: null,
    };

    switch (prop.label) {
      case "active":
      case "start":
      case "available":
      case "unpause":
      case "running":
      case "true":
      case "restarting":
      case "created":
      case "approved":
      case "success":
      case "configured":
      case "up":
        prop.color = "success";
        break;
      case "stopped":
      case "stop":
      case "false":
      case "error":
      case "deleted":
      case "rejected":
      case "creation error":
      case "init_error":
      case "unavailable":
      case "fail":
        prop.color = "error";
        break;
      case "paused":
      case "pause":
      case "reboot":
      case "rebooting":
      case "rebuilding":
      case "resizing":
      case "resuming":
      case "building":
      case "pending":
      case "verify resize":
        prop.color = "warning";
        break;
      case "inprogress":
      case "attached":
      case "in-use":
      case "initialising":
        prop.color = "info";
        break;
      case "cancelled":
      default:
        prop.color = "default";
    }

    // switch (prop.label) {
    //   case "active":
    //   case "available":
    //     prop.icon = <MdCheckCircle />;
    //     break;
    //   case "inactive":
    //     prop.icon = <MdCancel />;
    //     break;
    // }

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
                <Box sx={{ height: "100%", color: "common.white" }}>
                  <AiFillInfoCircle style={{ marginLeft: "4px" }} />
                </Box>
              </Tooltip>
            ),
            onDelete: () => null,
          }
        : {})}
      sx={{
        height: "20px",
        textTransform: "capitalize",
        ...customStyle,
        ".MuiChip-icon": { fontSize: "16px", ml: "2px" },
        ".MuiChip-label": { fontSize: "12px", pr: "8px" },
      }}
    />
  );
};

export default StatusChip;
