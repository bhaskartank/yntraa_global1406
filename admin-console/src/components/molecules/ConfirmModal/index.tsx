import { Box, Typography } from "@mui/material";
import React from "react";

import ModalBox from "components/molecules/ModalBox";

type ConfirmModalProps = {
  title: string;
  resourceDetails?: React.ReactElement;
  detailDescription?: React.ReactElement;
  description?: string;
  isOpen: boolean;
  content?: any;
  onConfirm: () => void;
  onClose: () => void;
  confirmBtnText?: string;
  cancelBtnText?: string;
};

export default function ConfirmModal({
  title,
  resourceDetails,
  description,
  detailDescription,
  isOpen,
  content,
  onConfirm,
  onClose,
  confirmBtnText,
  cancelBtnText,
}: ConfirmModalProps) {
  return (
    <ModalBox
      title={title}
      resourceDetails={resourceDetails}
      isOpen={isOpen}
      confirmBtnText={confirmBtnText || "Yes"}
      cancelBtnText={cancelBtnText || "No"}
      onConfirm={onConfirm}
      onCancel={onClose}
      customStyle={{ maxHeight: "85vh", overflowY: "auto" }}>
      {description ? <Typography>{description}</Typography> : detailDescription?<Box>{detailDescription}</Box>:null}
      {content ? <Box sx={{ mt: 2 }}>{content}</Box> : null}
    </ModalBox>
  );
}
