import { Box, Button, Divider, Grid, Stack } from "@mui/material";
import { FC, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

import DataField from "components/organisms/Form/DataField";
import { FormSchema } from "components/organisms/Form/model";
import useForm from "components/organisms/Form/useForm";

interface FlavorFormProps {
  onSubmit: (payload: any) => void;
  defaultValues?: any;
  providers: any;
}

const FlavorForm: FC<FlavorFormProps> = ({ onSubmit, providers, defaultValues }) => {
  const navigate = useNavigate();

  const schema: FormSchema = useMemo(
    () => ({
      provider_id: {
        label: "Provider",
        initialValue: "",
        type: "select",
        ...(!defaultValues ? { validation: yup.string().required("Provider is required") } : {}),
        autoFocus: true,
        disabled: !!defaultValues,
        required: true,
      },
      name: {
        label: "Name",
        initialValue: "",
        type: "text",
        ...(!defaultValues ? { validation: yup.string().required("Name is required") } : {}),
        disabled: !!defaultValues,
        required: true,
      },
      ram: {
        label: "RAM",
        initialValue: "",
        type: "number",
        ...(!defaultValues ? { validation: yup.number().min(1, "RAM must be greater than zero").required("RAM is required") } : {}),
        disabled: !!defaultValues,
        required: true,
      },
      vcpus: {
        label: "VCPUs",
        initialValue: "",
        type: "number",
        ...(!defaultValues ? { validation: yup.number().min(1, "VCPUs must be greater than zero").required("VCPUs is required") } : {}),
        disabled: !!defaultValues,
        required: true,
      },
      disk: {
        label: "Disk",
        initialValue: "",
        type: "number",
        ...(!defaultValues ? { validation: yup.number().min(1, "Disk must be greater than zero").required("Disk is required") } : {}),
        disabled: !!defaultValues,
        required: true,
      },
      weight: {
        label: "Weight",
        initialValue: defaultValues?.weight,
        type: "number",
        validation: yup.number().min(0, "Weight must be greater than or equal zero").required("Weight is required"),
        required: true,
      },
      cost: {
        label: "Cost",
        initialValue: defaultValues?.cost,
        type: "number",
        validation: yup.number().min(0, "Cost must be greater than or equal to zero").required("Cost is required"),
        required: true,
      },
      is_active: {
        label: "Active",
        initialValue: defaultValues?.is_active?.toString(),
        ...(defaultValues ? { validation: yup.string().required("Active status is required") } : {}),
        type: "select",
        options: [
          { label: "True", value: "true" },
          { label: "False", value: "false" },
        ],
        required: true,
      },
      is_public: {
        label: "Public",
        initialValue: defaultValues?.public?.toString(),
        ...(defaultValues ? { validation: yup.string().required("Public status is required") } : {}),
        type: "select",
        options: [
          { label: "True", value: "true" },
          { label: "False", value: "false" },
        ],
        required: true,
      },
    }),
    [defaultValues],
  );

  const { handleUpdateOptions, handleSubmit, formConfig } = useForm({ schema, onSubmit });

  useEffect(() => {
    if (providers?.length) {
      const providersMapping = providers?.map((provider) => ({ label: `${provider?.provider_name} (${provider?.provider_id})`, value: String(provider?.id) })) || [];
      handleUpdateOptions("provider_id", providersMapping);
    }
  }, [providers, handleUpdateOptions]);

  return (
    <Stack justifyContent="space-between" component="form" onSubmit={handleSubmit} divider={<Divider flexItem />} sx={{ height: "100%" }}>
      <Box sx={{ overflowY: "auto", flex: 1, p: 2 }}>
        <Grid container spacing={2}>
          {!defaultValues ? (
            <>
              <Grid item xs={12}>
                <DataField name="provider_id" formConfig={formConfig} />
              </Grid>
              <Grid item xs={6}>
                <DataField name="name" formConfig={formConfig} />
              </Grid>
              <Grid item xs={6}>
                <DataField name="ram" formConfig={formConfig} />
              </Grid>
              <Grid item xs={6}>
                <DataField name="disk" formConfig={formConfig} />
              </Grid>
              <Grid item xs={6}>
                <DataField name="vcpus" formConfig={formConfig} />
              </Grid>
            </>
          ) : null}
          <Grid item xs={6}>
            <DataField name="weight" formConfig={formConfig} />
          </Grid>
          <Grid item xs={6}>
            <DataField name="cost" formConfig={formConfig} />
          </Grid>
          {defaultValues ? (
            <>
              <Grid item xs={6}>
                <DataField name="is_public" formConfig={formConfig} />
              </Grid>
              <Grid item xs={6}>
                <DataField name="is_active" formConfig={formConfig} />
              </Grid>
            </>
          ) : null}
        </Grid>
      </Box>

      <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} p={1}>
        <Button variant="outlined" fullWidth onClick={() => navigate(`/providers/flavors`)}>
          Cancel
        </Button>

        <Button color="primary" variant="contained" fullWidth type="submit">
          {defaultValues ? "Update" : "Create"}
        </Button>
      </Stack>
    </Stack>
  );
};

export default FlavorForm;
