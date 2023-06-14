import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch } from "store";
import quotaPackagesRedux from "store/modules/quotaPackages";

import PageContainer from "components/layouts/Frame/PageContainer";
import ApproveRequestModal from "components/molecules/ApproveRejectModal/ApproveRequestModal";
import RejectRequestModal from "components/molecules/ApproveRejectModal/RejectRequestModal";
import ListTopupWithdrawalRequestsDetail from "components/templates/organisations/ListTopupWithdrawalRequestsDetail";

const ListQuotaWithdrawRequestDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { quotaWithdrawRequestDetail } = state;

  const [openRejectModal, setRejectOpenModal] = useState(false);
  const [openApproveModal, setApproveOpenModal] = useState(false);

  const closeRejectModal = () => {
    setRejectOpenModal(false);
  };
  const closeApproveModal = () => {
    setApproveOpenModal(false);
  };

  const handleApproveReq = () => {
    setApproveOpenModal(true);
  };

  const handleRejectReq = () => {
    setRejectOpenModal(true);
  };

  const rejectQuotaWithdrawChangeRequest = useCallback(
    async (payload, remarks) => {
      try {
        await dispatch(quotaPackagesRedux.actions.rejectResourceTopupWithdrawalRequest(payload?.organisation_id, payload?.provider_id, payload?.id, { remarks }));
        navigate("/organisations/quota-withdraw");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch],
  );

  const approveQuotaWithdrawChangeRequest = useCallback(
    async (payload) => {
      try {
        await dispatch(quotaPackagesRedux.actions.approveResourceTopupWithdrawalRequest(payload?.organisation_id, payload?.provider_id, payload?.id));
        navigate("/organisations/quota-withdraw");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch],
  );

  return (
    <PageContainer
      title="Quota Topup Withdraw Requests Details"
      breadcrumbs={[
        { label: "Organisation", to: "/organisations" },
        { label: "Quota Topup Withdraw Requests", to: "/organisations/quota-withdraw" },
        { label: "Requests Details" },
      ]}>
      {<ListTopupWithdrawalRequestsDetail requestData={quotaWithdrawRequestDetail} requestDetailPage handleApproveReq={handleApproveReq} handleRejectReq={handleRejectReq} />}
      <RejectRequestModal
        isOpen={openRejectModal}
        onClose={closeRejectModal}
        onSubmit={(payload) => {
          rejectQuotaWithdrawChangeRequest(quotaWithdrawRequestDetail, payload?.remarks);
        }}
      />
      <ApproveRequestModal isOpen={openApproveModal} onClose={closeApproveModal} onSubmit={() => approveQuotaWithdrawChangeRequest(quotaWithdrawRequestDetail)} />
    </PageContainer>
  );
};

export default ListQuotaWithdrawRequestDetailsPage;
