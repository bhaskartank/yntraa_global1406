import { Stack, Typography } from "@mui/material";
import { FC, useMemo } from "react";
import * as yup from "yup";

import { FormContainer } from "components/atoms/FormWrapper";
import DataField from "components/organisms/Form/DataField";
import { FormSchema } from "components/organisms/Form/model";
import useForm from "components/organisms/Form/useForm";

interface CreateSecurityGroupProps {
  onSubmit: (payload: any) => void;
  onCancel: () => void;
}

const CreateSecurityGroup: FC<CreateSecurityGroupProps> = ({ onSubmit, onCancel }) => {
  const schema: FormSchema = useMemo(
    () => ({
      security_group_name: {
        label: "Security Group Name",
        description: "Choose a friendly name for your security group which is easy to remember.",
        placeholder: "Please enter security group name",
        initialValue: "",
        validation: yup
          .string()
          .min(4, "Security group name must have minimum 4 characters")
          .max(16, "Security group name can have maximum 16 characters")
          .matches(/^[a-zA-Z][a-zA-Z0-9]*$/, "Security group name can have only alphabets and numbers and it must start with an alphabet only")
          .required("Security group name is required"),
        type: "text",
        autoFocus: true,
        required: true,
      },
    }),
    [],
  );

  const { formConfig, submitForm, formErrors } = useForm({ schema, onSubmit });

  const creationDisabled = useMemo(() => {
    return Boolean(formErrors?.security_group_name);
  }, [formErrors]);

  return (
    <FormContainer onCancel={onCancel} onSubmit={submitForm} submitDisabled={creationDisabled}>
      <Stack gap={4}>
        <Typography>Security groups are virtual firewalls that control inbound and outbound traffic to cloud resources, providing network-level security for instances.</Typography>

        <DataField name="security_group_name" formConfig={formConfig} />
      </Stack>
    </FormContainer>
  );
};

export default CreateSecurityGroup;
