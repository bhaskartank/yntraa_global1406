import { useCallback } from "react";
import { useLocation } from "react-router-dom";

import { useDispatch } from "store";
import networksRedux from "store/modules/networks";

import PageContainer from "components/layouts/Frame/PageContainer";
import ListRouterNetworkDetails from "components/templates/networks/ListRouterNetworkDetails";
import RouterDetailBar from "components/templates/networks/RouterDetailBar";

const ListRouterNetworkDetailsPage = () => {
  const dispatch = useDispatch();
  const { state: routerState } = useLocation();
  const { routers }: { routers: any } = routerState;

  const fetchRouterNetworkDetails = useCallback(
    (payload) => {
      dispatch(networksRedux.actions.listRouterNetworkDetails({ routerId: routers.id, providerId: routers.provider_id, projectId: routers.project_id }, payload));
    },
    [dispatch, routers],
  );

  const exportRouterNetworkDetails = useCallback(async () => {
    try {
      return await dispatch(networksRedux.actions.exportRouterNetworkDetails({ routerId: routers?.id, providerId: routers?.provider_id, projectId: routers.project_id }));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, routers]);

  return (
    <PageContainer title="Routers Network Details" breadcrumbs={[{ label: "Routers", to: "/networks/router" }, { label: "Network Details" }]}>
      <RouterDetailBar routers={routers} />
      <ListRouterNetworkDetails fetchRouterNetworkDetails={fetchRouterNetworkDetails} exportRouterNetworkDetails={exportRouterNetworkDetails} />
    </PageContainer>
  );
};

export default ListRouterNetworkDetailsPage;
