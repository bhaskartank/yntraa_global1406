import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch } from "store";
import objectStorageRedux from "store/modules/objectStorage";

import PageContainer from "components/layouts/Frame/PageContainer";
import ApproveRequestModal from "components/molecules/ApproveRejectModal/ApproveRequestModal";
import RejectRequestModal from "components/molecules/ApproveRejectModal/RejectRequestModal";
import ListObjectStorageOnboardingRequestDetail from "components/templates/storage/objectStorage/ListObjectStorageOnboardingRequestDetail";

const ListObjectStorageOnboardingRequestDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { ObjectStorageOnboardingRequestDetail } = state;

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

  const rejectObjStorageOnboardRequest = useCallback(
    async (payload, remarks) => {
      try {
        await dispatch(
          objectStorageRedux.actions.rejectObjStorageOnboardRequest(payload?.id, "reject", {
            remarks,
            provider_id: payload?.provider?.id,
            objectstorage_provider_id: payload?.organisation_request[0]?.onboardedorgn_mapping[0]?.objectstorage_provider_id,
          }),
        );
        navigate("/storage");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch],
  );

  const approveObjStorageOnboardRequest = useCallback(
    async (payload) => {
      try {
        await dispatch(
          objectStorageRedux.actions.approveObjStorageOnboardRequest(payload?.id, "approve", {
            provider_id: payload?.provider?.id,
            objectstorage_provider_id: payload?.organisation_request[0]?.onboardedorgn_mapping[0]?.objectstorage_provider_id,
          }),
        );
        navigate("/storage/object-storage-onboarding");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch],
  );

  return (
    <PageContainer
      title="Object Storage Onboarding Requests Details"
      breadcrumbs={[
        { label: "Storage", to: "/storage/block-storage-list" },
        { label: "Object Storage Onboarding Requests", to: "/storage/object-storage-onboarding" },
        { label: "Requests Details" },
      ]}>
      {
        <ListObjectStorageOnboardingRequestDetail
          requestData={ObjectStorageOnboardingRequestDetail}
          requestDetailPage
          handleApproveReq={handleApproveReq}
          handleRejectReq={handleRejectReq}
        />
      }
      <RejectRequestModal
        isOpen={openRejectModal}
        onClose={closeRejectModal}
        onSubmit={(payload) => {
          rejectObjStorageOnboardRequest(ObjectStorageOnboardingRequestDetail, payload?.remarks);
        }}
      />
      <ApproveRequestModal isOpen={openApproveModal} onClose={closeApproveModal} onSubmit={() => approveObjStorageOnboardRequest(ObjectStorageOnboardingRequestDetail)} />
    </PageContainer>
  );
};

export default ListObjectStorageOnboardingRequestDetailsPage;
