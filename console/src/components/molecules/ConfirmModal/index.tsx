import { Typography } from "@mui/material";
import React, { useCallback } from "react";

import { useDispatch, useSelector } from "store";
import modalRedux from "store/modules/modal";

import ModalBox from "components/molecules/ModalBox";

export default function ConfirmModal() {
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const modalDetails = modalRedux.getters.modalDetails(rootState);

  const handleConfirm = useCallback(async () => {
    await modalDetails?.onConfirm();
    dispatch(modalRedux.actions.close());
  }, [dispatch, modalDetails]);

  const handleCancel = useCallback(() => {
    dispatch(modalRedux.actions.close());
  }, [dispatch]);

  return (
    <ModalBox
      title={modalDetails?.title}
      resourceDetails={modalDetails?.resourceDetails}
      isOpen={modalDetails?.isOpen}
      confirmBtnText={modalDetails?.confirmBtnText}
      cancelBtnText={modalDetails?.cancelBtnText}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      customStyle={{ maxHeight: "85vh", overflowY: "auto", maxWidth: "600px" }}>
      {modalDetails?.description ? <Typography>{modalDetails?.description}</Typography> : null}
    </ModalBox>
  );
}
