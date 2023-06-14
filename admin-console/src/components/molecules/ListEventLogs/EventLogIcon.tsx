import { Stack } from "@mui/material";
import {
  AttachFloatingIPIcon,
  AttachNetworkIcon,
  AttacheSecurityGroupIcon,
  CancelSSLConfigureRequestIcon,
  ConfirmComputeResizeIcon,
  CreateComputeIcon,
  CreateLoadBalancerIcon,
  DeleteComputeIcon,
  DeleteLoadBalancerIcon,
  DetachFloatingIPIcon,
  DetachNetworkIcon,
  DetachSecurityGroupIcon,
  PauseComputeIcon,
  RebootComputeIcon,
  ResizeComputeIcon,
  RevertComputeResizeIcon,
  SSLConfigureRequestIcon,
  ShutOffComputeIcon,
  StartComputeIcon,
  SyncComputeStateIcon,
  UnpauseComputeIcon,
  UpdateLoadBalancerMetaIcon,
  VPNPermissionRequestIcon,
} from "icons";
import { FC, useMemo } from "react";

interface EventLogIconProps {
  eventType: string;
}

const EventLogIcon: FC<EventLogIconProps> = ({ eventType = "" }) => {
  const iconProps = useMemo(() => {
    const prop: { color?: string; icon?: any } = { color: "gray", icon: null };

    switch (eventType?.toLowerCase()) {
      case "create loadbalancer":
        prop.color = "#59BF7B";
        prop.icon = <CreateLoadBalancerIcon />;
        break;
      case "delete loadbalancer":
        prop.color = "#E47379";
        prop.icon = <DeleteLoadBalancerIcon />;
        break;
      case "update loadbalancer meta":
        prop.color = "#61A5E9";
        prop.icon = <UpdateLoadBalancerMetaIcon />;
        break;
      case "attach floating ip":
        prop.color = "#61A5E9";
        prop.icon = <AttachFloatingIPIcon />;
        break;
      case "detach floating ip":
        prop.color = "#61A5E9";
        prop.icon = <DetachFloatingIPIcon />;
        break;
      case "ssl configure request":
        prop.color = "#61A5E9";
        prop.icon = <SSLConfigureRequestIcon />;
        break;
      case "cancel ssl configure request":
        prop.color = "#61A5E9";
        prop.icon = <CancelSSLConfigureRequestIcon />;
        break;
      case "vpn permission request":
        prop.color = "#61A5E9";
        prop.icon = <VPNPermissionRequestIcon />;
        break;
      case "create compute":
        prop.color = "#59BF7B";
        prop.icon = <CreateComputeIcon />;
        break;
      case "delete compute":
        prop.color = "#E47379";
        prop.icon = <DeleteComputeIcon />;
        break;
      case "resize compute":
        prop.color = "#FFAE74";
        prop.icon = <ResizeComputeIcon />;
        break;
      case "confirm compute resize":
        prop.color = "#FFAE74";
        prop.icon = <ConfirmComputeResizeIcon />;
        break;
      case "revert compute resize":
        prop.color = "#FFAE74";
        prop.icon = <RevertComputeResizeIcon />;
        break;
      case "unpause compute":
        prop.color = "#FFAE74";
        prop.icon = <UnpauseComputeIcon />;
        break;
      case "pause compute":
        prop.color = "#FFAE74";
        prop.icon = <PauseComputeIcon />;
        break;
      case "reboot compute":
        prop.color = "#FFAE74";
        prop.icon = <RebootComputeIcon />;
        break;
      case "shutoff compute":
        prop.color = "#FFAE74";
        prop.icon = <ShutOffComputeIcon />;
        break;
      case "start compute":
        prop.color = "#FFAE74";
        prop.icon = <StartComputeIcon />;
        break;
      case "sync compute state":
        prop.color = "#FFAE74";
        prop.icon = <SyncComputeStateIcon />;
        break;
      case "attach network":
        prop.color = "#61A5E9";
        prop.icon = <AttachNetworkIcon />;
        break;
      case "detach network":
        prop.color = "#61A5E9";
        prop.icon = <DetachNetworkIcon />;
        break;
      case "attach security group":
        prop.color = "#61A5E9";
        prop.icon = <AttacheSecurityGroupIcon />;
        break;
      case "detach security group":
        prop.color = "#61A5E9";
        prop.icon = <DetachSecurityGroupIcon />;
        break;
      default:
        prop.color = "gray";
    }

    return prop;
  }, [eventType]);

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={{ borderRadius: "50%", backgroundColor: iconProps?.color, p: "10px", height: "40px", width: "40px", position: "relative" }}>
      {iconProps?.icon}
      <span style={{ position: "absolute", top: "-8px", left: "50%", transform: "translateX(-50%)", height: "8px", width: "1px", background: "#BDBDBD", content: "''" }} />
      <span style={{ position: "absolute", bottom: "-8px", left: "50%", transform: "translateX(-50%)", height: "8px", width: "1px", background: "#BDBDBD", content: "''" }} />
    </Stack>
  );
};

export default EventLogIcon;
