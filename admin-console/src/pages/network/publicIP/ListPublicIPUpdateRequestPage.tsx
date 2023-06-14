import { useCallback } from "react";

import { useDispatch } from "store";
import networksRedux from "store/modules/networks";

import PageContainer from "components/layouts/Frame/PageContainer";
import ResourseOwnerDetail from "components/modals/ResourceOwnerDetail";
import ListPublicIpUpdateRequest from "components/templates/networks/ListPublicIpUpdateRequest";

const ListPublicIPUpdateRequestPage = () => {
  const dispatch = useDispatch();

  const fetchPublicIpUpdate = useCallback(
    (payload) => {
      dispatch(networksRedux.actions.publicIPUpdateRequest(payload));
    },
    [dispatch],
  );

  const exportPublicIpUpdate = useCallback(async () => {
    try {
      return await dispatch(networksRedux.actions.exportPublicIPUpdateRequest());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const fetchPublicIpUpdateOwnerDetail = useCallback(
    (item) => {
      dispatch(networksRedux.actions.computePublicIpUpdateOwnerDetails({ providerId: item?.public_ip_request?.provider_id, publicIpUpdateId: item?.id }));
    },
    [dispatch],
  );

  return (
    <PageContainer title="Public IP Update Requests" breadcrumbs={[{ label: "Public IP Update Requests" }]}>
      <ListPublicIpUpdateRequest
        fetchPublicIpUpdate={fetchPublicIpUpdate}
        exportPublicIpUpdate={exportPublicIpUpdate}
        fetchPublicIpUpdateOwnerDetail={fetchPublicIpUpdateOwnerDetail}
      />
      <ResourseOwnerDetail modalTitle="Public IP Update Owner Details" />
    </PageContainer>
  );
};

export default ListPublicIPUpdateRequestPage;
