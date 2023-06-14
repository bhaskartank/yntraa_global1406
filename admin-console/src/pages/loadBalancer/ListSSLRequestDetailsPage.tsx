import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch } from "store";
import loadBalancersRedux from "store/modules/loadBalancers";

import PageContainer from "components/layouts/Frame/PageContainer";
import ApproveRequestModal from "components/molecules/ApproveRejectModal/ApproveRequestModal";
import RejectRequestModal from "components/molecules/ApproveRejectModal/RejectRequestModal";
import ListSSLRequestDetail from "components/templates/loadBalancers/ListSSLRequestDetail";

const ListSSLRequestDetailsPage = () => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { sslRequestDetail } = state;

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

  const rejectLbSSLRequest = useCallback(
    async (payload, remarks) => {
      try {
        await dispatch(loadBalancersRedux.actions.rejectLoadBalancerSSLRequest(payload?.id, payload?.project_id, { action: "reject", remarks }));
        navigate("/load-balancers/ssl-request");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch],
  );

  const approveLbSSLRequest = useCallback(
    async (payload) => {
      try {
        await dispatch(loadBalancersRedux.actions.approveLoadBalancerSSLRequest(payload?.id, payload?.project_id, { action: "approve" }));
        navigate("/load-balancers/ssl-request");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch],
  );

  return (
    <PageContainer
      title="SSL Configuration Requests Details"
      breadcrumbs={[{ label: "Load Balancers", to: "/load-balancers" }, { label: "SSL Configuration Requests", to: "/load-balancers/ssl-request" }, { label: "Requests Details" }]}>
      {<ListSSLRequestDetail requestDetailPage handleApproveReq={handleApproveReq} handleRejectReq={handleRejectReq} requestData={sslRequestDetail} />}
      <RejectRequestModal
        isOpen={openRejectModal}
        onClose={closeRejectModal}
        onSubmit={(payload) => {
          rejectLbSSLRequest(sslRequestDetail, payload?.remarks);
        }}
      />
      <ApproveRequestModal isOpen={openApproveModal} onClose={closeApproveModal} onSubmit={() => approveLbSSLRequest(sslRequestDetail)} />
    </PageContainer>
  );
};

export default ListSSLRequestDetailsPage;
