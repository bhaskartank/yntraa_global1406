import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch } from "store";
import networksRedux from "store/modules/networks";

import PageContainer from "components/layouts/Frame/PageContainer";
import ApproveRequestModal from "components/molecules/ApproveRejectModal/ApproveRequestModal";
import RejectRequestModal from "components/molecules/ApproveRejectModal/RejectRequestModal";
import ListPublicIpWithdrawDetail from "components/templates/networks/ListPublicIpWithdrawDetail";

const ListPublicIPWithdrawalRequestDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { publicIpWithdrawRequestDetail } = state;

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

  const rejectPublicIpWithdraw = useCallback(
    async (payload, remarks) => {
      try {
        await dispatch(networksRedux.actions.rejectPublicIpWithdraw(payload?.id, payload?.provider_id, payload?.project_id, { remarks }));
        navigate("/networks/public-ip-withdraw-request");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch],
  );

  const approvePublicIpWithdraw = useCallback(
    async (payload) => {
      try {
        await dispatch(networksRedux.actions.approvePublicIpWithdraw(payload?.id, payload?.provider_id, payload?.project_id));
        navigate("/networks/public-ip-withdraw-request");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch],
  );

  return (
    <PageContainer
      title="Public IP Withdrawal Requests Details"
      breadcrumbs={[{ label: "Networks", to: "/networks" }, { label: "Public IP Withdrawal Requests", to: "/networks/public-ip-withdraw-request" }, { label: "Requests Details" }]}>
      {<ListPublicIpWithdrawDetail requestData={publicIpWithdrawRequestDetail} requestDetailPage handleApproveReq={handleApproveReq} handleRejectReq={handleRejectReq} />}
      <RejectRequestModal
        isOpen={openRejectModal}
        onClose={closeRejectModal}
        onSubmit={(payload) => {
          rejectPublicIpWithdraw(publicIpWithdrawRequestDetail, payload?.remarks);
        }}
      />
      <ApproveRequestModal isOpen={openApproveModal} onClose={closeApproveModal} onSubmit={() => approvePublicIpWithdraw(publicIpWithdrawRequestDetail)} />
    </PageContainer>
  );
};

export default ListPublicIPWithdrawalRequestDetailsPage;
