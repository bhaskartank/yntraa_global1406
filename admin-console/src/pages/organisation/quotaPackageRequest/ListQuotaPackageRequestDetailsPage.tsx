import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch } from "store";
import quotaPackagesRedux from "store/modules/quotaPackages";

import PageContainer from "components/layouts/Frame/PageContainer";
import ApproveRequestModal from "components/molecules/ApproveRejectModal/ApproveRequestModal";
import RejectRequestModal from "components/molecules/ApproveRejectModal/RejectRequestModal";
import ListQuotaPackageRequestDetail from "components/templates/organisations/ListQuotaPackageRequestDetail";

const ListQuotaPackageRequestDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { quotaPackageRequestDetail } = state;

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

  const rejectQoutaPackageRequest = useCallback(
    async (payload, remarks) => {
      try {
        await dispatch(quotaPackagesRedux.actions.rejectQuotaPackageUpdateRequest(payload?.id, { remarks }));
        navigate("/organisations/quota-update");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch],
  );

  const approveQoutaPackageRequest = useCallback(
    async (payload) => {
      try {
        await dispatch(quotaPackagesRedux.actions.approveQuotaPackageUpdateRequest(payload?.id));
        navigate("/organisations/quota-update");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch],
  );

  return (
    <PageContainer
      title="Quota Package Update Requests Details"
      breadcrumbs={[{ label: "Organisation", to: "/organisations" }, { label: "Quota Package Update Requests", to: "/organisations/quota-update" }, { label: "Requests Details" }]}>
      {<ListQuotaPackageRequestDetail requestDetailPage handleApproveReq={handleApproveReq} handleRejectReq={handleRejectReq} requestData={quotaPackageRequestDetail} />}
      <RejectRequestModal
        isOpen={openRejectModal}
        onClose={closeRejectModal}
        onSubmit={(payload) => {
          rejectQoutaPackageRequest(quotaPackageRequestDetail, payload?.remarks);
        }}
      />
      <ApproveRequestModal isOpen={openApproveModal} onClose={closeApproveModal} onSubmit={() => approveQoutaPackageRequest(quotaPackageRequestDetail)} />
    </PageContainer>
  );
};

export default ListQuotaPackageRequestDetailsPage;
