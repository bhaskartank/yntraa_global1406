import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch } from "store";
import networksRedux from "store/modules/networks";

import PageContainer from "components/layouts/Frame/PageContainer";
import ApproveRequestModal from "components/molecules/ApproveRejectModal/ApproveRequestModal";
import RejectRequestModal from "components/molecules/ApproveRejectModal/RejectRequestModal";
import ListRequestedPublicIpDetail from "components/templates/networks/ListRequestedPublicIpDetail";

const ListRequestedPublicIPDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { reqPublicIpDetail } = state;

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

  const rejectRequestedPublicIps = useCallback(
    async (payload, remarks) => {
      try {
        await dispatch(networksRedux.actions.rejectRequestedPublicIps(payload?.id, payload?.provider_id, payload?.project_id, { remarks }));
        navigate("/networks/public-ip-request");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch],
  );

  const approveRequestedPublicIps = useCallback(
    async (payload) => {
      try {
        await dispatch(networksRedux.actions.approveRequestedPublicIps(payload?.id, payload?.provider_id, payload?.project_id));
        navigate("/networks/public-ip-request");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch],
  );

  return (
    <PageContainer
      title="Public IP Requests Details"
      breadcrumbs={[{ label: "Networks", to: "/networks" }, { label: "Public IP Requests", to: "/networks/public-ip-request" }, { label: "Requests Details" }]}>
      {<ListRequestedPublicIpDetail requestDetailPage handleApproveReq={handleApproveReq} handleRejectReq={handleRejectReq} requestData={reqPublicIpDetail} />}
      <RejectRequestModal
        isOpen={openRejectModal}
        onClose={closeRejectModal}
        onSubmit={(payload) => {
          rejectRequestedPublicIps(reqPublicIpDetail, payload?.remarks);
        }}
      />
      <ApproveRequestModal isOpen={openApproveModal} onClose={closeApproveModal} onSubmit={() => approveRequestedPublicIps(reqPublicIpDetail)} />
    </PageContainer>
  );
};

export default ListRequestedPublicIPDetailsPage;
