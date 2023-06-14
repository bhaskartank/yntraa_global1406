import { useCallback } from "react";
import { useSelector } from "react-redux";

import { useDispatch } from "store";
import networksRedux from "store/modules/networks";

import PageContainer from "components/layouts/Frame/PageContainer";
import ResourseOwnerDetail from "components/modals/ResourceOwnerDetail";
import ListRouters from "components/templates/networks/ListRouters";

const ListRouterPage = () => {
  const dispatch = useDispatch();
  const rootState = useSelector((state: any) => state);
  const routers = networksRedux.getters.routers(rootState);
  // const { state: routerState } = useLocation();

  const fetchRouters = useCallback(
    (payload) => {
      dispatch(networksRedux.actions.routers(payload));
    },
    [dispatch],
  );

  const exportRouters = useCallback(async () => {
    try {
      return await dispatch(networksRedux.actions.exportRouters());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const fetchRouterOwnerDetail = useCallback(
    (item) => {
      dispatch(networksRedux.actions.computeRouterOwnerDetails({ providerId: item?.provider_id, routerId: item?.id }));
    },
    [dispatch],
  );

  return (
    <PageContainer title="Routers" breadcrumbs={[{ label: "Routers" }]}>
      <ListRouters routers={routers} fetchRouters={fetchRouters} exportRouters={exportRouters} fetchRouterOwnerDetail={fetchRouterOwnerDetail} />
      <ResourseOwnerDetail modalTitle="Router Owner Details" />
    </PageContainer>
  );
};

export default ListRouterPage;
