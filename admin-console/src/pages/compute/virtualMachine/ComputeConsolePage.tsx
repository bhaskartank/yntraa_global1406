import { useLocation } from "react-router-dom";

import PageContainer from "components/layouts/Frame/PageContainer";
import ComputeDetailBar from "components/molecules/DetailBars/ComputeDetailBar";
import ComputeConsole from "components/templates/compute/ComputeConsole";

const ComputeConsolePage = () => {
  const { state: routerState } = useLocation();
  const { consoleURL, compute }: { consoleURL: string; compute: any } = routerState;

  return (
    <PageContainer title="Server Console" breadcrumbs={[{ label: "Compute", to: "/compute/types" }, { label: "Server Console" }]}>
      <ComputeDetailBar compute={compute} customStyle={{ backgroundColor: "primary.light", py: "4px", borderBottom: 0 }} />

      <ComputeConsole consoleURL={consoleURL} />
    </PageContainer>
  );
};

export default ComputeConsolePage;
