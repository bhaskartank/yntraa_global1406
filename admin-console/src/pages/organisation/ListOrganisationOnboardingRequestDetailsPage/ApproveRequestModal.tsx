import { Stack } from "@mui/material";
import { FC, useEffect, useMemo } from "react";
import * as yup from "yup";

import ModalBox from "components/molecules/ModalBox";
import DataField from "components/organisms/Form/DataField";
import { FormSchema } from "components/organisms/Form/model";
import useForm from "components/organisms/Form/useForm";

interface ApproveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  providers?: any;
}

const ApproveRequestModal: FC<ApproveRequestModalProps> = ({ isOpen, onClose, onSubmit, providers }) => {
  const schema: FormSchema = useMemo(
    () => ({
      provider_id: {
        label: "You will be On-Boarding the Organisation on Provider",
        initialValue: "",
        validation: yup.string().required("Provider is required"),
        type: "select",
        options: [],
        autoFocus: true,
      },
      project_init: {
        label: null,
        initialValue: ["true"],
        validation: yup.array(),
        type: "checkbox",
        options: [{ label: "Initialize project on selected provider as well.", value: "true" }],
        autoFocus: true,
      },
    }),
    [],
  );

  const onSubmitForm = (values) => {
    onSubmit(values);
    onClose();
  };

  const { submitForm, formConfig, resetForm, handleUpdateOptions, handleUpdateValue } = useForm({ schema, onSubmit: onSubmitForm });

  useEffect(() => {
    if (providers?.length) {
      const providersMapping =
        providers?.map((provider) => ({
          label: `${provider?.provider_name} (${provider?.provider_id})`,
          value: String(provider?.id),
        })) || [];
      handleUpdateOptions("provider_id", providersMapping);
    }
  }, [providers, handleUpdateOptions, handleUpdateValue]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    } else if (providers?.length === 1) {
      handleUpdateValue("provider_id", providers[0]?.id?.toString());
    }
  }, [handleUpdateValue, isOpen, providers, resetForm]);

  return (
    <ModalBox title={"Approve Request Modal"} isOpen={isOpen} onCancel={onClose} onConfirm={submitForm} confirmBtnText="Approve" customStyle={{ width: { xs: "80%", md: "40%" } }}>
      <Stack gap={2}>
        <DataField name="provider_id" formConfig={formConfig} />
        <DataField name="project_init" formConfig={formConfig} />
      </Stack>
    </ModalBox>
  );
};

export default ApproveRequestModal;
