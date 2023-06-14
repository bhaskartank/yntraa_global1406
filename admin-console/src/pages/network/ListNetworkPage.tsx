import { useCallback } from "react";

import { useDispatch } from "store";
import networksRedux from "store/modules/networks";

import PageContainer from "components/layouts/Frame/PageContainer";
import ResourseOwnerDetail from "components/modals/ResourceOwnerDetail";
import ListNetworks from "components/templates/networks/ListNetworks";

const ListNetworkPage = () => {
  const dispatch = useDispatch();

  const fetchNetworks = useCallback(
    (payload) => {
      dispatch(networksRedux.actions.networks(payload));
    },
    [dispatch],
  );

  const exportNetworks = useCallback(async () => {
    try {
      return await dispatch(networksRedux.actions.exportNetworks());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const fetchNetworkOwnerDetail = useCallback(
    (item) => {
      dispatch(networksRedux.actions.computeNetworkOwnerDetails({ providerId: item?.provider_id, networkId: item?.id }));
    },
    [dispatch],
  );

  return (
    <PageContainer title="Networks" breadcrumbs={[{ label: "Networks" }]}>
      <ListNetworks fetchNetworks={fetchNetworks} exportNetworks={exportNetworks} fetchNetworkOwnerDetail={fetchNetworkOwnerDetail} />
      <ResourseOwnerDetail modalTitle="Netork Owner Details" />
    </PageContainer>
  );
};

export default ListNetworkPage;
