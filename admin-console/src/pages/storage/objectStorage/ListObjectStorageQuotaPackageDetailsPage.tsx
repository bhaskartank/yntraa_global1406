import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch } from "store";
import objectStorageRedux from "store/modules/objectStorage";

import PageContainer from "components/layouts/Frame/PageContainer";
import ApproveRequestModal from "components/molecules/ApproveRejectModal/ApproveRequestModal";
import RejectRequestModal from "components/molecules/ApproveRejectModal/RejectRequestModal";
import ListObjectStorageQuotaPackageRequestDetail from "components/templates/storage/objectStorage/ListObjectStorageQuotaPackageRequestDetail";

const ListObjectStorageQuotaPackageDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { ObjectStorageQuotaPackageRequestDetail } = state;

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

  const rejectObjStorageQuotaPackageRequest = useCallback(
    async (payload, remarks) => {
      try {
        await dispatch(
          objectStorageRedux.actions.rejectObjStorageQuotaPackageRequest(payload?.id, "reject", {
            remarks,
          }),
        );
        navigate("/storage/quota-update");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch],
  );

  const approveObjStorageOnboardRequest = useCallback(
    async (payload) => {
      try {
        await dispatch(objectStorageRedux.actions.approveObjStorageQuotaPackageRequest(payload?.id, "approve"));
        navigate("/storage/quota-update");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch],
  );

  return (
    <PageContainer
      title="Quota Package Update Requests Details"
      breadcrumbs={[
        { label: "Storage", to: "/storage/block-storage-list" },
        { label: "Quota Package Update Requests", to: "/storage/quota-update" },
        { label: "Requests Details" },
      ]}>
      {
        <ListObjectStorageQuotaPackageRequestDetail
          requestData={ObjectStorageQuotaPackageRequestDetail}
          requestDetailPage
          handleApproveReq={handleApproveReq}
          handleRejectReq={handleRejectReq}
        />
      }
      <RejectRequestModal
        isOpen={openRejectModal}
        onClose={closeRejectModal}
        onSubmit={(payload) => {
          rejectObjStorageQuotaPackageRequest(ObjectStorageQuotaPackageRequestDetail, payload?.remarks);
        }}
      />
      <ApproveRequestModal isOpen={openApproveModal} onClose={closeApproveModal} onSubmit={() => approveObjStorageOnboardRequest(ObjectStorageQuotaPackageRequestDetail)} />
    </PageContainer>
  );
};

export default ListObjectStorageQuotaPackageDetailsPage;
