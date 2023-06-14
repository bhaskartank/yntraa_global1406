import { Typography } from "@mui/material";
import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch } from "store";
import BackupRedux from "store/modules/backups";

import PageContainer from "components/layouts/Frame/PageContainer";
import RejectRequestModal from "components/molecules/ApproveRejectModal/RejectRequestModal";
import ModalBox from "components/molecules/ModalBox";
import ListBackupPublicIPRequestDetail from "components/templates/backup/ListBackupPublicIPRequestDetail";

const ListBackupPublicIpDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { BackupPublicIpRequestDetail } = state;

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

  const rejectBackupPublicIpRequest = useCallback(
    async (payload, remarks) => {
      try {
        await dispatch(BackupRedux.actions.rejectBackupPublicIpRequest(payload?.id, "reject", { remarks }));
        navigate("/backups/public-ip-request");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch],
  );

  const approveBackupPublicIpRequest = useCallback(
    async (payload) => {
      try {
        await dispatch(BackupRedux.actions.approveBackupPublicIpRequest(payload?.id, "verify"));
        navigate("/backups/public-ip-request");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch],
  );

  return (
    <PageContainer
      title="Backup Verification (Public IP Requests) Details"
      breadcrumbs={[{ label: "Backups", to: "/backups" }, { label: "Public IP Requests", to: "/backups/public-ip-request" }, { label: "Requests Details" }]}>
      {<ListBackupPublicIPRequestDetail requestDetailPage requestData={BackupPublicIpRequestDetail} handleApproveReq={handleApproveReq} handleRejectReq={handleRejectReq} />}
      <RejectRequestModal
        isOpen={openRejectModal}
        onClose={closeRejectModal}
        onSubmit={(payload) => {
          rejectBackupPublicIpRequest(BackupPublicIpRequestDetail, payload?.remarks);
        }}
      />
      <ModalBox
        title={"Verify Request Modal"}
        isOpen={openApproveModal}
        onCancel={closeApproveModal}
        onConfirm={() => approveBackupPublicIpRequest(BackupPublicIpRequestDetail)}
        confirmBtnText="Verify"
        customStyle={{ width: { xs: "80%", md: "40%" } }}>
        <Typography>Do you want to verify the request?</Typography>
      </ModalBox>
      {/* <ApproveRequestModal isOpen={openApproveModal} onClose={closeApproveModal} onSubmit={() => approveBackupPublicIpRequest(BackupPublicIpRequestDetail)} /> */}
    </PageContainer>
  );
};

export default ListBackupPublicIpDetailsPage;
