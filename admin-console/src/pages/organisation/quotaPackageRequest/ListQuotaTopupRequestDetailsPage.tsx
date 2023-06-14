import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch } from "store";
import quotaPackagesRedux from "store/modules/quotaPackages";

import PageContainer from "components/layouts/Frame/PageContainer";
import ApproveRequestModal from "components/molecules/ApproveRejectModal/ApproveRequestModal";
import RejectRequestModal from "components/molecules/ApproveRejectModal/RejectRequestModal";
import ListTopupQuotaRequestsDetail from "components/templates/organisations/ListTopupQuotaRequestsDetail";

const ListQuotaTopupRequestDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { quotaTopupRequestDetail } = state;

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

  const rejectQuotaTopupChangeRequest = useCallback(
    async (payload, remarks) => {
      try {
        await dispatch(quotaPackagesRedux.actions.rejectResourceTopupRequest(payload?.organisation_id, payload?.provider_id, payload?.id, { remarks }));
        navigate("/organisations/quota-topup");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch],
  );

  const approveQuotaTopupChangeRequest = useCallback(
    async (payload) => {
      try {
        await dispatch(quotaPackagesRedux.actions.approveResourceTopupRequest(payload?.organisation_id, payload?.provider_id, payload?.id));
        navigate("/organisations/quota-topup");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch],
  );

  return (
    <PageContainer
      title="Topup Quota Requests Details"
      breadcrumbs={[{ label: "Organisation", to: "/organisations" }, { label: "Topup Quota Requests", to: "/organisations/quota-topup" }, { label: "Requests Details" }]}>
      {<ListTopupQuotaRequestsDetail requestData={quotaTopupRequestDetail} requestDetailPage handleApproveReq={handleApproveReq} handleRejectReq={handleRejectReq} />}
      <RejectRequestModal
        isOpen={openRejectModal}
        onClose={closeRejectModal}
        onSubmit={(payload) => {
          rejectQuotaTopupChangeRequest(quotaTopupRequestDetail, payload?.remarks);
        }}
      />
      <ApproveRequestModal isOpen={openApproveModal} onClose={closeApproveModal} onSubmit={() => approveQuotaTopupChangeRequest(quotaTopupRequestDetail)} />
    </PageContainer>
  );
};

export default ListQuotaTopupRequestDetailsPage;
