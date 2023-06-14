import { useLocation } from "react-router-dom";

import PageContainer from "components/layouts/Frame/PageContainer";
import ComputeDetailBar from "components/molecules/DetailBars/ComputeDetailBar";
import ComputeConsoleLogs from "components/templates/compute/ComputeConsoleLogs";

const ListVirtualMachinePage = () => {
  const { state: routerState } = useLocation();
  const { consoleLog, compute }: { consoleLog: string; compute: any } = routerState;

  return (
    <PageContainer title="Console Logs" breadcrumbs={[{ label: "Compute", to: "/compute/types" }, { label: "Console Logs" }]}>
      <ComputeDetailBar compute={compute} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />

      <ComputeConsoleLogs consoleLog={consoleLog} compute={compute} />
    </PageContainer>
  );
};

export default ListVirtualMachinePage;
