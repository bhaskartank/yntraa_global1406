import { Input } from "@mui/material";
import React from "react";

import ModalBox from "components/molecules/ModalBox";

type ApproveRejectModalProps = {
  modalTitle: string;
  openModal?: boolean;
  closeModal: () => void;
  approveRejectReqFunc?: () => void;
  aprroveRejectText?: string;
  remark?: string;
  getRemarkFromModal?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const ApproveRejectModal: React.FC<ApproveRejectModalProps> = ({ modalTitle, openModal, closeModal, aprroveRejectText, approveRejectReqFunc, remark, getRemarkFromModal }) => {
  return (
    <ModalBox
      closeBtnCentered={true}
      closeBtnVariant={"contained"}
      title={modalTitle}
      isOpen={openModal}
      confirmBtnText={aprroveRejectText}
      onConfirm={approveRejectReqFunc}
      onCancel={closeModal}
      customStyle={{ maxHeight: "85vh", overflowY: "auto", width: "55vw" }}>
      <Input placeholder="Remarks" fullWidth value={remark} onChange={(e) => getRemarkFromModal(e)} />
    </ModalBox>
  );
};

export default ApproveRejectModal;
