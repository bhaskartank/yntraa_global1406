import { Grid, Stack, Typography } from "@mui/material";
import { FC, useMemo } from "react";
import * as yup from "yup";

import { FormContainer } from "components/atoms/FormWrapper";
import DataField from "components/organisms/Form/DataField";
import { FormSchema } from "components/organisms/Form/model";
import useForm from "components/organisms/Form/useForm";

interface CreateVolumeProps {
  onSubmit: (payload: any) => void;
  onCancel: () => void;
}

const CreateVolume: FC<CreateVolumeProps> = ({ onSubmit, onCancel }) => {
  const schema: FormSchema = useMemo(
    () => ({
      volume_name: {
        label: "Volume Name",
        placeholder: "Please enter volume name",
        initialValue: "",
        validation: yup
          .string()
          .min(4, "Volume name must have minimum 4 characters")
          .max(16, "Volume name can have maximum 16 characters")
          .matches(/^[a-zA-Z][a-zA-Z0-9]*$/, "Volume name can have only alphabets and numbers and it must start with an alphabet only")
          .required("Volume name is required"),
        type: "text",
        autoFocus: true,
        required: true,
      },
      volume_size: {
        label: "Volume Size (in GiB)",
        placeholder: "Please enter volume size",
        initialValue: 1,
        validation: yup
          .number()
          .min(1, "Volume Size should be more than or equal to 1 GiB")
          .max(2000, "Volume Size should be less than or equal to 2000 GiB")
          .required("Volume Size is required"),
        type: "number",
        required: true,
      },
      bootable: {
        label: "Bootable",
        placeholder: "Please select ",
        initialValue: "false",
        validation: yup.boolean(),
        type: "radio",
      },
    }),
    [],
  );

  const { formConfig, submitForm, formErrors } = useForm({ schema, onSubmit });

  const creationDisabled = useMemo(() => {
    return Boolean(formErrors?.volume_name) || Boolean(formErrors?.volume_size);
  }, [formErrors]);

  return (
    <FormContainer onCancel={onCancel} onSubmit={submitForm} submitDisabled={creationDisabled}>
      <Stack gap={4}>
        <Typography>
          Volumes are scalable block storage units that provide persistent storage for Virtual Machies, offering high performance, flexibility, and easy management.
        </Typography>

        <Stack gap={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <DataField name="volume_name" formConfig={formConfig} />
            </Grid>
            <Grid item xs={12} md={4}>
              <DataField name="volume_size" formConfig={formConfig} />
            </Grid>
          </Grid>
        </Stack>
      </Stack>
    </FormContainer>
  );
};

export default CreateVolume;
