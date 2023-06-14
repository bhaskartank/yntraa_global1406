import { Stack } from "@mui/material";
import { FC } from "react";

import ResourceDetails from "./ResourceDetails";
import SummaryHeader from "./SummaryHeader";

interface VirtualMachineDetailProps {
  virtualMachine: any;
  consoleLogs: any;
  fetchConsoleLogs: () => void;
  consoleURL: any;
  fetchConsoleURL: () => void;
  fetchResourceMetrics: (payload: any) => any;
  fetchUsageGraph: (payload: any) => any;
}

const VirtualMachineDetail: FC<VirtualMachineDetailProps> = ({
  virtualMachine,
  consoleLogs,
  fetchConsoleLogs,
  consoleURL,
  fetchConsoleURL,
  fetchResourceMetrics,
  fetchUsageGraph,
}) => {
  return (
    <Stack gap={4}>
      <SummaryHeader virtualMachine={virtualMachine} />
      <ResourceDetails
        virtualMachine={virtualMachine}
        consoleLogs={consoleLogs}
        fetchConsoleLogs={fetchConsoleLogs}
        consoleURL={consoleURL}
        fetchConsoleURL={fetchConsoleURL}
        fetchResourceMetrics={fetchResourceMetrics}
        fetchUsageGraph={fetchUsageGraph}
      />
    </Stack>
  );
};

export default VirtualMachineDetail;
