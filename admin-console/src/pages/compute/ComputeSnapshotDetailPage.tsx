import { useLocation } from "react-router-dom";

import PageContainer from "components/layouts/Frame/PageContainer";
import ComputeSnapshotsDetails from "components/templates/compute/ComputeSnapshotsDetails";

const ComputeSnapshotDetailPage = () => {
  const { state } = useLocation();
  const { ComputeSnapshotsData } = state;

  return (
    <PageContainer
      title="Compute Snapshot Details"
      breadcrumbs={[{ label: "Compute", to: "/compute/types" }, { label: "Compute Snapshots", to: "/compute/snapshots" }, { label: "View Details" }]}>
      {<ComputeSnapshotsDetails requestData={ComputeSnapshotsData} />}
    </PageContainer>
  );
};

export default ComputeSnapshotDetailPage;
