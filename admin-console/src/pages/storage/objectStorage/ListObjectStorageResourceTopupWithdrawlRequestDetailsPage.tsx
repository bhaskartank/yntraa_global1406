import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch } from "store";
import objectStorageRedux from "store/modules/objectStorage";

import PageContainer from "components/layouts/Frame/PageContainer";
import ApproveRequestModal from "components/molecules/ApproveRejectModal/ApproveRequestModal";
import RejectRequestModal from "components/molecules/ApproveRejectModal/RejectRequestModal";
import ObjectStorageQuotaTopupRequestDetails from "components/templates/storage/objectStorage/ObjectStorageQuotaTopupRequestDetails";

const ListObjectStorageResourceTopupWithdrawlRequestDetailsPage = () => {
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

  const rejectQuotaTopupWithdrawlRequest = useCallback(
    async (payload, remarks) => {
      try {
        await dispatch(objectStorageRedux.actions.approveRejectWithdrawlTopup({ resource_topup_request_id: payload?.id, action: "reject", remarks }));
        navigate("/storage/quota-withdraw");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch],
  );

  const approveQuotaTopupWithdrawlRequest = useCallback(
    async (payload) => {
      try {
        await dispatch(objectStorageRedux.actions.approveRejectWithdrawlTopup({ resource_topup_request_id: payload?.id, action: "approve" }));
        navigate("/storage/quota-withdraw");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch],
  );

  return (
    <PageContainer
      title="Topup Withdrawl Request Details"
      breadcrumbs={[{ label: "Storage", to: "/storage/block-storage-list" }, { label: "Topup Withdrawl Requests", to: "/storage/quota-withdraw" }, { label: "Requests Details" }]}>
      {<ObjectStorageQuotaTopupRequestDetails requestData={quotaTopupRequestDetail} requestDetailPage handleApproveReq={handleApproveReq} handleRejectReq={handleRejectReq} />}
      <RejectRequestModal
        isOpen={openRejectModal}
        onClose={closeRejectModal}
        onSubmit={(payload) => {
          rejectQuotaTopupWithdrawlRequest(quotaTopupRequestDetail, payload?.remarks);
        }}
      />
      <ApproveRequestModal isOpen={openApproveModal} onClose={closeApproveModal} onSubmit={() => approveQuotaTopupWithdrawlRequest(quotaTopupRequestDetail)} />
    </PageContainer>
  );
};

export default ListObjectStorageResourceTopupWithdrawlRequestDetailsPage;
