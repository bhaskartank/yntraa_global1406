import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch } from "store";
import networksRedux from "store/modules/networks";

import PageContainer from "components/layouts/Frame/PageContainer";
import ApproveRequestModal from "components/molecules/ApproveRejectModal/ApproveRequestModal";
import RejectRequestModal from "components/molecules/ApproveRejectModal/RejectRequestModal";
import ListPublicIpUpdateRequestDetail from "components/templates/networks/ListPublicIpUpdateRequestDetail";

const ListPublicIPUpdateRequestDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { publicIpUpdateRequestDetail } = state;

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

  const rejectPublicIpUpdateRequest = useCallback(
    async (payload, remarks) => {
      try {
        await dispatch(networksRedux.actions.rejectPublicIpUpdateRequest(payload?.id, "reject", { remarks }));
        navigate("/networks/public-ip-update-request");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch],
  );

  const approvePublicIpUpdateRequest = useCallback(
    async (payload) => {
      try {
        await dispatch(networksRedux.actions.approvePublicIpUpdateRequest(payload?.id, "approve"));
        navigate("/networks/public-ip-update-request");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch],
  );

  return (
    <PageContainer
      title="Public IP Update Requests Details"
      breadcrumbs={[{ label: "Networks", to: "/networks" }, { label: "Public IP Update Requests", to: "/networks/public-ip-update-request" }, { label: "Requests Details" }]}>
      {<ListPublicIpUpdateRequestDetail requestData={publicIpUpdateRequestDetail} requestDetailPage handleApproveReq={handleApproveReq} handleRejectReq={handleRejectReq} />}
      <RejectRequestModal
        isOpen={openRejectModal}
        onClose={closeRejectModal}
        onSubmit={(payload) => {
          rejectPublicIpUpdateRequest(publicIpUpdateRequestDetail, payload?.remarks);
        }}
      />
      <ApproveRequestModal isOpen={openApproveModal} onClose={closeApproveModal} onSubmit={() => approvePublicIpUpdateRequest(publicIpUpdateRequestDetail)} />
    </PageContainer>
  );
};

export default ListPublicIPUpdateRequestDetailsPage;
