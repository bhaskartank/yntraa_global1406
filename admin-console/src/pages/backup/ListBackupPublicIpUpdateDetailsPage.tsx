import { Typography } from "@mui/material";
import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch } from "store";
import BackupRedux from "store/modules/backups";

import PageContainer from "components/layouts/Frame/PageContainer";
import RejectRequestModal from "components/molecules/ApproveRejectModal/RejectRequestModal";
import ModalBox from "components/molecules/ModalBox";
import ListBackupPublicIPUpdateRequestDetail from "components/templates/backup/ListBackupPublicIPUpdateRequestDetail";

const ListBackupPublicIpUpdateDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { BackupPublicIpUpdateRequestDetail } = state;

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

  const rejectBackupPublicIpUpdateRequest = useCallback(
    async (payload, remarks) => {
      try {
        await dispatch(BackupRedux.actions.rejectBackupPublicIpUpdateRequest(payload?.id, "reject", { remarks }));
        navigate("/backups/public-ip-update-request");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch],
  );

  const approveBackupPublicIpUpdateRequest = useCallback(
    async (payload) => {
      try {
        await dispatch(BackupRedux.actions.approveBackupPublicIpUpdateRequest(payload?.id, "verify"));
        navigate("/backups/public-ip-update-request");
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch],
  );

  return (
    <PageContainer
      title="Backup Verification (Public IP Update Requests) Details"
      breadcrumbs={[{ label: "Backups", to: "/backups" }, { label: "Public IP Update Requests", to: "/backups/public-ip-update-request" }, { label: "Requests Details" }]}>
      {
        <ListBackupPublicIPUpdateRequestDetail
          requestDetailPage
          requestData={BackupPublicIpUpdateRequestDetail}
          handleApproveReq={handleApproveReq}
          handleRejectReq={handleRejectReq}
        />
      }
      <RejectRequestModal
        isOpen={openRejectModal}
        onClose={closeRejectModal}
        onSubmit={(payload) => {
          rejectBackupPublicIpUpdateRequest(BackupPublicIpUpdateRequestDetail, payload?.remarks);
        }}
      />
      <ModalBox
        title={"Verify Request Modal"}
        isOpen={openApproveModal}
        onCancel={closeApproveModal}
        onConfirm={() => approveBackupPublicIpUpdateRequest(BackupPublicIpUpdateRequestDetail)}
        confirmBtnText="Verify"
        customStyle={{ width: { xs: "80%", md: "40%" } }}>
        <Typography>Do you want to verify the request?</Typography>
      </ModalBox>
      {/* <ApproveRequestModal isOpen={openApproveModal} onClose={closeApproveModal} onSubmit={() => approveBackupPublicIpUpdateRequest(BackupPublicIpUpdateRequestDetail)} /> */}
    </PageContainer>
  );
};

export default ListBackupPublicIpUpdateDetailsPage;
