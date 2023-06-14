import { Stack, Typography } from "@mui/material";
import { useEffect, useMemo } from "react";
import * as yup from "yup";

import ModalBox from "components/molecules/ModalBox";
import DataField from "components/organisms/Form/DataField";
import { FormSchema } from "components/organisms/Form/model";
import useForm from "components/organisms/Form/useForm";

type ConfirmModalProps = {
  isOpen: boolean;
  eulaText: string;
  onConfirm: () => void;
  onClose: () => void;
};

export default function EulaModal({ isOpen, eulaText, onConfirm, onClose }: ConfirmModalProps) {
  const schema: FormSchema = useMemo(
    () => ({
      terms: {
        label: "",
        initialValue: [],
        validation: yup.array().min(1, "Please accept the terms & conditions").required("Please accept the terms & conditions"),
        type: "checkbox",
        options: [{ label: "I accept the terms in the License Agreement", value: "true" }],
      },
    }),
    [],
  );

  const { submitForm, resetForm, formConfig } = useForm({
    schema,
    onSubmit: onConfirm,
  });

  useEffect(() => {
    resetForm();
  }, [isOpen, resetForm]);

  return (
    <ModalBox
      title="End User License Agreement"
      isOpen={isOpen}
      confirmDisabled={false}
      confirmBtnText="Subscribe"
      cancelBtnText="Close"
      onConfirm={submitForm}
      onCancel={onClose}
      customStyle={{ maxHeight: "85vh", overflowY: "auto", width: "min(80%, 650px)" }}>
      <Stack gap={2} overflow="hidden">
        <Stack sx={{ border: "0.5px solid #8d8b8b", p: 2, overflowY: "auto", height: "340px" }}>
          <Typography component="pre" sx={{ whiteSpace: "pre-wrap", wordWrap: "break-word", textAlign: "justify" }}>
            {eulaText}
          </Typography>
        </Stack>
        <DataField name="terms" formConfig={formConfig} />
      </Stack>
    </ModalBox>
  );
}
