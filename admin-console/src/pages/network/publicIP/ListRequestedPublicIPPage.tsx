import { useCallback } from "react";

import { useDispatch } from "store";
import networksRedux from "store/modules/networks";

import PageContainer from "components/layouts/Frame/PageContainer";
import ResourseOwnerDetail from "components/modals/ResourceOwnerDetail";
import ListRequestedPublicIp from "components/templates/networks/ListRequestedPublicIp";

const ListRequestedPublicIPPage = () => {
  const dispatch = useDispatch();

  const fetchRequestedPublicIp = useCallback(
    (payload) => {
      dispatch(networksRedux.actions.requestedPublicIPs(payload));
    },
    [dispatch],
  );

  const exportRequestedPublicIp = useCallback(async () => {
    try {
      return await dispatch(networksRedux.actions.exportRequestedPublicIPs());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const fetchPublicIpRequestedOwnerDetail = useCallback(
    (item) => {
      dispatch(networksRedux.actions.computePublicIpRequestOwnerDetails({ providerId: item?.provider_id, publicIpRequestsId: item?.id }));
    },
    [dispatch],
  );

  return (
    <PageContainer title="Public IP Requests" breadcrumbs={[{ label: "Public IP Requests" }]}>
      <ListRequestedPublicIp
        fetchRequestedPublicIp={fetchRequestedPublicIp}
        exportRequestedPublicIp={exportRequestedPublicIp}
        fetchPublicIpRequestedOwnerDetail={fetchPublicIpRequestedOwnerDetail}
      />
      <ResourseOwnerDetail modalTitle="Public IP Requests Owner Details" />
    </PageContainer>
  );
};

export default ListRequestedPublicIPPage;
