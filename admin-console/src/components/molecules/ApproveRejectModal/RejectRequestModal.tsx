import { Stack } from "@mui/material";
import { FC, useEffect, useMemo } from "react";
import * as yup from "yup";

import ModalBox from "components/molecules/ModalBox";
import DataField from "components/organisms/Form/DataField";
import { FormSchema } from "components/organisms/Form/model";
import useForm from "components/organisms/Form/useForm";

interface RejectRequestModalProps {
  isOpen: boolean;
  onClose: () => void;

  onSubmit: (payload: any) => void;
}

const RejectRequestModal: FC<RejectRequestModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const schema: FormSchema = useMemo(
    () => ({
      remarks: {
        label: "Remarks",
        initialValue: "",
        validation: yup.string().min(10, "Remarks must be minimum 10 characters long").max(50, "Remarks must be maximum 50 characters long").required("Remarks is required"),
        type: "text",
        autoFocus: true,
        required: true,
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
    <ModalBox title={"Reject Request Remarks"} isOpen={isOpen} onCancel={onClose} onConfirm={submitForm} confirmBtnText="Reject" customStyle={{ width: { xs: "80%", md: "40%" } }}>
      <Stack component="form" onSubmit={handleSubmit} spacing={2} justifyContent="center">
        <DataField name="remarks" formConfig={formConfig} />
      </Stack>
    </ModalBox>
  );
};

export default RejectRequestModal;
