import { FC } from "react";

import TabBox from "components/molecules/TabBox";

import { appRoutes } from "utils/constants";

import Console from "./Console";
import ConsoleLogs from "./ConsoleLogs";
import ManageNetworks from "./ManageNetworks";
import { ManageSecurityGroup } from "./ManageSecurityGroup";
import ManageSnapshot from "./ManageSnapshot";
import ManageStorage from "./ManageStorage";
import Overview from "./Overview";
import Resize from "./Resize";
import ResourceMetrics from "./ResourceMetrics";

interface ResourceDetailsProps {
  virtualMachine: any;
  consoleLogs: any;
  fetchConsoleLogs: () => void;
  consoleURL: any;
  fetchConsoleURL: () => void;
  fetchResourceMetrics: (payload: any) => any;
  fetchUsageGraph: (payload: any) => any;
}

const ResourceDetails: FC<ResourceDetailsProps> = ({ virtualMachine, consoleLogs, fetchConsoleLogs, consoleURL, fetchConsoleURL, fetchResourceMetrics, fetchUsageGraph }) => {
  return (
    <TabBox
      indexBased={false}
      tabs={[
        {
          tabKey: appRoutes.VIRTUAL_MACHINE_DETAIL(virtualMachine?.id, "overview"),
          title: "Overview",
          content: <Overview virtualMachine={virtualMachine} />,
        },
        {
          tabKey: appRoutes.VIRTUAL_MACHINE_DETAIL(virtualMachine?.id, "storage"),
          title: "Storage",
          content: <ManageStorage virtualMachine={virtualMachine} />,
        },
        {
          tabKey: appRoutes.VIRTUAL_MACHINE_DETAIL(virtualMachine?.id, "resize"),
          title: "Resize",
          content: <Resize virtualMachine={virtualMachine} />,
        },
        {
          tabKey: appRoutes.VIRTUAL_MACHINE_DETAIL(virtualMachine?.id, "snapshots"),
          title: "Snapshots",
          content: <ManageSnapshot virtualMachine={virtualMachine} />,
        },
        {
          tabKey: appRoutes.VIRTUAL_MACHINE_DETAIL(virtualMachine?.id, "networks"),
          title: "Networks",
          content: <ManageNetworks virtualMachine={virtualMachine} />,
        },
        {
          tabKey: appRoutes.VIRTUAL_MACHINE_DETAIL(virtualMachine?.id, "security-groups"),
          title: "Security Groups",
          content: <ManageSecurityGroup virtualMachine={virtualMachine} />,
        },
        {
          tabKey: appRoutes.VIRTUAL_MACHINE_DETAIL(virtualMachine?.id, "console"),
          title: "Console",
          content: <Console consoleURL={consoleURL} fetchConsoleURL={fetchConsoleURL} />,
        },
        {
          tabKey: appRoutes.VIRTUAL_MACHINE_DETAIL(virtualMachine?.id, "console-logs"),
          title: "Console Logs",
          content: <ConsoleLogs consoleLogs={consoleLogs} fetchConsoleLogs={fetchConsoleLogs} />,
        },
        {
          tabKey: appRoutes.VIRTUAL_MACHINE_DETAIL(virtualMachine?.id, "resource-metrics"),
          title: "Resource Metrics",
          content: <ResourceMetrics virtualMachine={virtualMachine} fetchResourceMetrics={fetchResourceMetrics} fetchUsageGraph={fetchUsageGraph} />,
        },
        {
          tabKey: appRoutes.VIRTUAL_MACHINE_DETAIL(virtualMachine?.id, "backup"),
          title: "Backup",
          content: null,
        },
      ]}
    />
  );
};

export default ResourceDetails;
