import { useCallback } from "react";

import { useDispatch } from "store";
import networksRedux from "store/modules/networks";

import PageContainer from "components/layouts/Frame/PageContainer";
import ResourseOwnerDetail from "components/modals/ResourceOwnerDetail";
import ListPublicIpWithdraw from "components/templates/networks/ListPublicIpWithdraw";

const ListPublicIPWithdrawalRequestPage = () => {
  const dispatch = useDispatch();

  const fetchPublicIpWithdraw = useCallback(
    (payload) => {
      dispatch(networksRedux.actions.withdrawPublicIPs(payload));
    },
    [dispatch],
  );

  const exportPublicIpWithdraw = useCallback(async () => {
    try {
      return await dispatch(networksRedux.actions.exportWithdrawPublicIPs());
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const fetchWithdrawalOwnerDetail = useCallback(
    (item) => {
      dispatch(networksRedux.actions.computePublicIpWithdrawalOwnerDetails({ providerId: item?.provider_id, publicIpWithdrawalId: item?.id }));
    },
    [dispatch],
  );

  return (
    <PageContainer title="Public IP Withdrawal Requests" breadcrumbs={[{ label: "Public IP Withdrawal Requests" }]}>
      <ListPublicIpWithdraw fetchPublicIpWithdraw={fetchPublicIpWithdraw} exportPublicIpWithdraw={exportPublicIpWithdraw} fetchWithdrawalOwnerDetail={fetchWithdrawalOwnerDetail} />
      <ResourseOwnerDetail modalTitle="Public IP Withdrawal Owner Details" />
    </PageContainer>
  );
};

export default ListPublicIPWithdrawalRequestPage;
