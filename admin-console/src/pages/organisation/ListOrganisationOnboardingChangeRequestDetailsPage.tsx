import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch } from "store";
import organisationsRedux from "store/modules/organisations";

import PageContainer from "components/layouts/Frame/PageContainer";
import ApproveRequestModal from "components/molecules/ApproveRejectModal/ApproveRequestModal";
import RejectRequestModal from "components/molecules/ApproveRejectModal/RejectRequestModal";
import ListOrganisationOnboardingChangeRequestDetail from "components/templates/organisations/ListOrganisationOnboardingChangeRequestDetail";

const ListOrganisationOnboardingChangeRequestDetailsPage = () => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { onboardingChangeRequestDetail } = state;

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

  const rejectOrganisationOnboardingChangeRequest = useCallback(
    async (payload, remarks) => {
      try {
        await dispatch(organisationsRedux.actions.rejectOrganisationOnboardingChangeRequest(payload?.id, { remarks }));
        navigate("/organisations/change-request");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch],
  );

  const approveOrganisationOnboardingChangeRequest = useCallback(
    async (payload) => {
      try {
        await dispatch(organisationsRedux.actions.approveOrganisationOnboardingChangeRequest(payload?.id));
        navigate("/organisations/change-request");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch],
  );

  return (
    <PageContainer
      title="Organisation Onboarding Change Requests Details"
      breadcrumbs={[{ label: "Organisation", to: "/organisations" }, { label: "Onboarding Change Requests", to: "/organisations/change-request" }, { label: "Requests Details" }]}>
      {
        <ListOrganisationOnboardingChangeRequestDetail
          requestDetailPage
          handleApproveReq={handleApproveReq}
          handleRejectReq={handleRejectReq}
          requestData={onboardingChangeRequestDetail}
        />
      }
      <RejectRequestModal
        isOpen={openRejectModal}
        onClose={closeRejectModal}
        onSubmit={(payload) => {
          rejectOrganisationOnboardingChangeRequest(onboardingChangeRequestDetail, payload?.remarks);
        }}
      />
      <ApproveRequestModal isOpen={openApproveModal} onClose={closeApproveModal} onSubmit={() => approveOrganisationOnboardingChangeRequest(onboardingChangeRequestDetail)} />
    </PageContainer>
  );
};

export default ListOrganisationOnboardingChangeRequestDetailsPage;
