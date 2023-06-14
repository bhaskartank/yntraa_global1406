import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch } from "store";
import organisationsRedux from "store/modules/organisations";
import providersRedux from "store/modules/providers";

import PageContainer from "components/layouts/Frame/PageContainer";
import RejectRequestModal from "components/molecules/ApproveRejectModal/RejectRequestModal";
import ListOrganisationOnboardingRequestDetail from "components/templates/organisations/ListOrganisationOnboardingRequestDetail";

import ApproveRequestModal from "./ApproveRequestModal";

const ListOrganisationOnboardingRequestDetailsPage = () => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const navigate = useNavigate();
  const rootState = useSelector((state) => state);
  const { onboardingRequestDetail } = state;
  const providers = providersRedux.getters.providers(rootState);

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

  const rejectOrganisationOnboardingRequest = useCallback(
    async (payload, remarks) => {
      try {
        await dispatch(organisationsRedux.actions.rejectOrganisationOnboardingRequest(payload?.id, { remarks }));
        navigate("/organisations/onboard-request");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate],
  );

  const approveOrganisationOnboardingRequest = useCallback(
    async (payload, values) => {
      try {
        await dispatch(
          organisationsRedux.actions.approveOrganisationOnboardingRequest(payload?.id, values?.provider_id, {
            project_init: Boolean(values?.project_init?.length && values?.project_init[0] === "true"),
          }),
        );
        navigate("/organisations/onboard-request");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch, navigate],
  );

  useEffect(() => {
    if (!providers?.list?.data?.length) {
      dispatch(providersRedux.actions.providers());
    }
  }, [dispatch, providers]);

  return (
    <PageContainer
      title="Organisation Onboarding Requests Details"
      breadcrumbs={[
        { label: "Organisation", to: "/organisations" },
        { label: "Organisation Onboarding Requests", to: "/organisations/onboard-request" },
        { label: "Requests Details" },
      ]}>
      {<ListOrganisationOnboardingRequestDetail requestDetailPage handleApproveReq={handleApproveReq} handleRejectReq={handleRejectReq} requestData={onboardingRequestDetail} />}

      <RejectRequestModal
        isOpen={openRejectModal}
        onClose={closeRejectModal}
        onSubmit={(payload) => {
          rejectOrganisationOnboardingRequest(onboardingRequestDetail, payload?.remarks);
        }}
      />
      <ApproveRequestModal
        isOpen={openApproveModal}
        providers={providers?.list?.data}
        onClose={closeApproveModal}
        onSubmit={(values) => approveOrganisationOnboardingRequest(onboardingRequestDetail, values)}
      />
    </PageContainer>
  );
};

export default ListOrganisationOnboardingRequestDetailsPage;
