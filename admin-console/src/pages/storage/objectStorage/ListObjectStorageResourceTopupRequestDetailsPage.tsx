import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch } from "store";
import objectStorageRedux from "store/modules/objectStorage";

import PageContainer from "components/layouts/Frame/PageContainer";
import ApproveRequestModal from "components/molecules/ApproveRejectModal/ApproveRequestModal";
import RejectRequestModal from "components/molecules/ApproveRejectModal/RejectRequestModal";
import ObjectStorageQuotaTopupRequestDetails from "components/templates/storage/objectStorage/ObjectStorageQuotaTopupRequestDetails";

const ListObjectStorageResourceTopupRequestDetailsPage = () => {
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
        await dispatch(objectStorageRedux.actions.approveRejectResourceTopup({ resource_topup_request_id: payload?.id, action: "reject", remarks }));
        navigate("/storage/quota-topup");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch],
  );

  const approveQuotaTopupChangeRequest = useCallback(
    async (payload) => {
      try {
        await dispatch(objectStorageRedux.actions.approveRejectResourceTopup({ resource_topup_request_id: payload?.id, action: "approve" }));
        navigate("/storage/quota-topup");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch],
  );

  return (
    <PageContainer
      title="Topup Quota Request Details"
      breadcrumbs={[{ label: "Storage", to: "/storage/block-storage-list" }, { label: "Quota Topup Requests", to: "/storage/quota-topup" }, { label: "Requests Details" }]}>
      {<ObjectStorageQuotaTopupRequestDetails requestData={quotaTopupRequestDetail} requestDetailPage handleApproveReq={handleApproveReq} handleRejectReq={handleRejectReq} />}
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

export default ListObjectStorageResourceTopupRequestDetailsPage;
