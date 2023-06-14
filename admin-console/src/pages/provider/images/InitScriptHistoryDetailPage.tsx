import { useLocation } from "react-router-dom";

import PageContainer from "components/layouts/Frame/PageContainer";
import InitScriptHistoryDetail from "components/templates/providers/images/InitScriptHistoryDetail";

const InitScriptHistoryDetailPage = () => {
  const { state: routerState } = useLocation();
  const { imageId, initScript } = routerState;

  return (
    <PageContainer
      title="View Init Script"
      breadcrumbs={[
        { label: "Providers", to: "/providers" },
        { label: "Images", to: "/providers/images" },
        // TODO: while navigating back need to pass the router state
        // { label: "Init Script History", to: `/providers/images/${imageId}/init-script-history` },
        { label: "View Init Script" },
      ]}>
      <InitScriptHistoryDetail initScript={initScript} />
    </PageContainer>
  );
};

export default InitScriptHistoryDetailPage;
