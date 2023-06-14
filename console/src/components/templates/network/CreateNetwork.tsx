import { Grid, Stack, Typography } from "@mui/material";
import { FC, useMemo } from "react";
import * as yup from "yup";

import { FormContainer } from "components/atoms/FormWrapper";
import DataField from "components/organisms/Form/DataField";
import { FormSchema } from "components/organisms/Form/model";
import useForm from "components/organisms/Form/useForm";

interface CreateNetworkProps {
  onSubmit: (payload: any) => void;
  onCancel: () => void;
}

const CreateNetwork: FC<CreateNetworkProps> = ({ onSubmit, onCancel }) => {
  const schema: FormSchema = useMemo(
    () => ({
      network_name: {
        label: "Network Name",
        placeholder: "Please enter network name",
        initialValue: "",
        validation: yup
          .string()
          .min(4, "Network name must have minimum 4 characters")
          .max(16, "Network name can have maximum 16 characters")
          .matches(/^[a-zA-Z][a-zA-Z0-9]*$/, "Network name can have only alphabets and numbers and it must start with an alphabet only")
          .required("Network name is required"),
        type: "text",
        autoFocus: true,
        required: true,
      },
      subnet_name: {
        label: "Subnet Name",
        placeholder: "Please enter subnet name",
        initialValue: "",
        validation: yup
          .string()
          .min(4, "Subnet name must have minimum 4 characters")
          .max(16, "Subnet name can have maximum 16 characters")
          .matches(/^[a-zA-Z][a-zA-Z0-9]*$/, "Subnet name can have only alphabets and numbers and it must start with an alphabet only")
          .required("Subnet name is required"),
        type: "text",
        required: true,
      },
      network_address: {
        label: "Network Address",
        placeholder: "Please enter network address in CIDR format (192.168.0.0/24)",
        initialValue: "",
        validation: yup
          .string()
          .matches(/^(?:\d{1,3}\.){3}\d{1,3}\/(?:[12]\d|3[0-2]|[0-9])$/, "Network Address should be in CIDR format (192.168.0.0/24)")
          .required("Network Address is required"),
        type: "text",
        required: true,
      },
      external: {
        label: "External",
        initialValue: "false",
        validation: yup.boolean(),
        type: "radio",
      },
      ip_version: {
        label: "IP Version",
        initialValue: "4",
        validation: yup.string(),
        type: "radio",
      },
    }),
    [],
  );

  const { formConfig, submitForm, formErrors } = useForm({ schema, onSubmit });

  const creationDisabled = useMemo(() => {
    return Boolean(formErrors?.network_name) || Boolean(formErrors?.subnet_name) || Boolean(formErrors?.network_address);
  }, [formErrors]);

  return (
    <FormContainer onCancel={onCancel} onSubmit={submitForm} submitDisabled={creationDisabled}>
      <Stack gap={4}>
        <Typography>
          Networks are the infrastructure components and services that enable connectivity and communication between resources, such as virtual machines and load balancers, within
          the cloud environment.
        </Typography>

        <Stack gap={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <DataField name="network_name" formConfig={formConfig} />
            </Grid>
            <Grid item xs={12} md={6}>
              <DataField name="subnet_name" formConfig={formConfig} />
            </Grid>
          </Grid>

          <DataField name="network_address" formConfig={formConfig} />
        </Stack>
      </Stack>
    </FormContainer>
  );
};

export default CreateNetwork;
