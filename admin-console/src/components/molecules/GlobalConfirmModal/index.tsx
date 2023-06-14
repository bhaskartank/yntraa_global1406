import { Typography } from "@mui/material";
import React, { useCallback } from "react";

import { useDispatch, useSelector } from "store";
import confirmModalRedux from "store/modules/confirmModal";

import ModalBox from "components/molecules/ModalBox";

export default function GlobalConfirmModal() {
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const modalDetails = confirmModalRedux.getters.modalDetails(rootState);

  const handleConfirm = useCallback(async () => {
    await modalDetails?.onConfirm();
    dispatch(confirmModalRedux.actions.close());
  }, [dispatch, modalDetails]);

  const handleCancel = useCallback(() => {
    dispatch(confirmModalRedux.actions.close());
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
      customStyle={{ maxHeight: "85vh", overflowY: "auto" }}>
      {modalDetails?.description ? <Typography>{modalDetails?.description}</Typography> : null}
    </ModalBox>
  );
}
