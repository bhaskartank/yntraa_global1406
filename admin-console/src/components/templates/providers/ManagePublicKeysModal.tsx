import { FC, useEffect, useMemo } from "react";
import * as yup from "yup";

import ModalBox from "components/molecules/ModalBox";
import DataField from "components/organisms/Form/DataField";
import { FormSchema } from "components/organisms/Form/model";
import useForm from "components/organisms/Form/useForm";

interface ManagePublicKeysModalProps {
  isOpen: boolean;
  onClose: () => void;
  publicKeys: any;
  handleCreatePublicKey: (payload: any) => void;
}

const ManagePublicKeysModal: FC<ManagePublicKeysModalProps> = ({ isOpen, onClose, publicKeys, handleCreatePublicKey }) => {
  const schema: FormSchema = useMemo(
    () => ({
      public_key: {
        label: "Public Key",
        initialValue: "",
        validation: yup.string().required("Public Key is required"),
        type: "textarea",
        minRows: 5,
        autoFocus: true,
        required: true,
      },
    }),
    [],
  );

  const { handleUpdateValue, submitForm, formConfig } = useForm({ schema, onSubmit: handleCreatePublicKey });

  useEffect(() => {
    if (publicKeys?.list?.length) {
      handleUpdateValue("public_key", publicKeys?.list[0]?.public_key);
    }
  }, [publicKeys, handleUpdateValue]);

  return (
    <ModalBox title={`Manage Public Keys`} isOpen={isOpen} onCancel={onClose} confirmBtnText="Submit" onConfirm={submitForm} customStyle={{ width: "40%" }}>
      <DataField name="public_key" formConfig={formConfig} />
    </ModalBox>
  );
};

export default ManagePublicKeysModal;
