import { useLocation } from "react-router-dom";

import PageContainer from "components/layouts/Frame/PageContainer";
import NetworkDetail from "components/templates/network/NetworkDetail";

import { pageTitles } from "utils/constants";

const NetworkDetailPage = () => {
  // TODO: Use networkById once api have complete data for subnets
  // const { networkId } = useParams();
  // const dispatch = useDispatch();
  // const rootState = useSelector((state) => state);
  // const networkById = networkRedux.getters.networkById(rootState);

  // const fetchNetworkById = useCallback(() => {
  //   dispatch(networkRedux.actions.networkById(networkId));
  // }, [dispatch, networkId]);

  // useEffect(() => {
  //   fetchNetworkById();
  // }, [fetchNetworkById]);

  const { state: routerState } = useLocation();
  const { network }: { network: any } = routerState;

  return (
    <PageContainer title={pageTitles?.PAGE_TITLE_NETWORK_DETAIL} hideTitle>
      <NetworkDetail network={network} />
    </PageContainer>
  );
};

export default NetworkDetailPage;
