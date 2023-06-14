import { Stack } from "@mui/material";
import { FC, useEffect, useMemo } from "react";
import * as yup from "yup";

import ModalBox from "components/molecules/ModalBox";
import DataField from "components/organisms/Form/DataField";
import { FormSchema } from "components/organisms/Form/model";
import useForm from "components/organisms/Form/useForm";

interface ApproveNasRequestModalProps {
  isOpen: boolean;
  onClose: () => void;

  onSubmit: (payload: any) => void;
}

const ApproveNasRequestModal: FC<ApproveNasRequestModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const schema: FormSchema = useMemo(
    () => ({
      nas_mount_point: {
        label: "NasMountPoint",
        initialValue: "",
        validation: yup
          .string()
          .min(5, "NasMountPoint must be minimum 5 characters long")
          .max(50, "NasMountPoint must be maximum 50 characters long")
          .required("NasMountPoint is required"),
        type: "text",
        autoFocus: true,
      },
      nas_ip: {
        label: "NasIp",
        initialValue: "",
        validation: yup
          .string()
          .min(5, "NasMountPoint must be minimum 5 characters long")
          .max(50, "NasMountPoint must be maximum 50 characters long")
          .required("NasMountPoint is required"),
        type: "text",
        autoFocus: true,
      },
    }),
    [],
  );

  const onSubmitForm = (values) => {
    onSubmit(values);
    onClose();
  };

  const { submitForm, handleSubmit, formConfig, resetForm } = useForm({ schema, onSubmit: onSubmitForm });

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  return (
    <ModalBox title={"Approve Request Modal"} isOpen={isOpen} onCancel={onClose} onConfirm={submitForm} confirmBtnText="Approve" customStyle={{ width: { xs: "80%", md: "40%" } }}>
      <Stack component="form" onSubmit={handleSubmit} spacing={2} justifyContent="center">
        <DataField name="nas_mount_point" formConfig={formConfig} />
        <DataField name="nas_ip" formConfig={formConfig} />
      </Stack>
    </ModalBox>
  );
};

export default ApproveNasRequestModal;
