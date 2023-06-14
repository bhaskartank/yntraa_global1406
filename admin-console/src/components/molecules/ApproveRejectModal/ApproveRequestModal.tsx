import { Typography } from "@mui/material";
import { FC } from "react";

import ModalBox from "components/molecules/ModalBox";

interface ApproveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const ApproveRequestModal: FC<ApproveRequestModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const onSubmitForm = () => {
    onSubmit();
    onClose();
  };

  return (
    <ModalBox
      title={"Approve Request Modal"}
      isOpen={isOpen}
      onCancel={onClose}
      onConfirm={onSubmitForm}
      confirmBtnText="Approve"
      customStyle={{ width: { xs: "80%", md: "40%" } }}>
      <Typography>Do you want to Approve the request?</Typography>
    </ModalBox>
  );
};

export default ApproveRequestModal;
