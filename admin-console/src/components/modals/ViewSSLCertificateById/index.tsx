import { Stack, TextField } from "@mui/material";
import React from "react";

import { useDispatch, useSelector } from "store";
import modalRedux from "store/modules/modals";

import ModalBox from "components/molecules/ModalBox";

type viewSSLCertificateByIdProps = {
  modalTitle: string;
};

const ViewSSLCertificateById: React.FC<viewSSLCertificateByIdProps> = ({ modalTitle }) => {
  const dispatch = useDispatch();
  const rootState = useSelector((state: any) => state);
  const certificateDetail = modalRedux.getters.sslCertificateById(rootState);

  const isOpen = Boolean(certificateDetail);

  const onClose = () => {
    dispatch(modalRedux.actions.sslCertificateById(null));
  };

  return (
    <ModalBox
      closeBtnCentered={true}
      closeBtnVariant={"contained"}
      title={modalTitle}
      isOpen={isOpen}
      onCancel={onClose}
      customStyle={{ maxHeight: "85vh", overflowY: "auto", width: "55vw" }}>
      <Stack direction="column" rowGap={2}>
        <TextField
          fullWidth
          multiline={true}
          label="ca_certificate"
          variant="outlined"
          rows={5}
          value={certificateDetail?.ca_certificate ? certificateDetail?.ca_certificate : " "}
        />
        <TextField fullWidth multiline={true} label="ssl_cert_key" variant="outlined" rows={5} value={certificateDetail?.ssl_cert_key ? certificateDetail?.ssl_cert_key : " "} />
        <TextField
          fullWidth
          multiline={true}
          label="ssl_private_key"
          variant="outlined"
          rows={5}
          value={certificateDetail?.ssl_private_key ? certificateDetail?.ssl_private_key : " "}
        />
      </Stack>
    </ModalBox>
  );
};

export default ViewSSLCertificateById;
