import { Box, Button, Divider, Grid, Stack } from "@mui/material";
import { FC, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";

import DataField from "components/organisms/Form/DataField";
import { FormSchema } from "components/organisms/Form/model";
import useForm from "components/organisms/Form/useForm";

interface CreateServiceProviderProps {
  serviceTypes: any[];
  onSubmit: (payload: any) => void;
  defaultValues?: any;
}

const CreateServiceProvider: FC<CreateServiceProviderProps> = ({ serviceTypes, onSubmit, defaultValues }) => {
  const navigate = useNavigate();
  const { providerId } = useParams();

  const schema: FormSchema = useMemo(
    () => ({
      service_provider_name: {
        label: "Name",
        initialValue: defaultValues?.service_provider_name,
        type: "text",
        validation: yup.string().required("Name is required"),
        autoFocus: true,
        required: true,
      },
      service_provider_description: {
        label: "Description",
        initialValue: defaultValues?.service_provider_description,
        validation: yup.string().required("Description is required"),
        type: "textarea",
        minRows: 3,
        required: true,
      },
      service_type_id: {
        label: "Service Type",
        initialValue: defaultValues?.service_type?.id,
        validation: yup.string().required("Service Type is required"),
        type: "select",
        options: [],
        disabled: !!defaultValues,
        required: true,
      },
      configurable_by: {
        label: "Configurable By",
        initialValue: defaultValues?.configurable_by,
        validation: yup.string().required("Configurable by is required"),
        type: "select",
        options: [
          { value: "api", label: "API" },
          { value: "request", label: "Request" },
        ],
        required: true,
      },
      is_active: {
        label: "Active",
        initialValue: defaultValues?.is_active?.toString(),
        validation: yup.string().required("Active status is required"),
        type: "select",
        options: [
          { label: "True", value: "true" },
          { label: "False", value: "false" },
        ],
        required: true,
      },
      is_public: {
        label: "Public",
        initialValue: defaultValues?.is_public?.toString(),
        validation: yup.string().required("Public status is required"),
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
    if (serviceTypes?.length) {
      const serviceTypeMapping = serviceTypes?.map((service) => ({ label: `${service?.name} (${service?.description})`, value: String(service?.id) })) || [];
      handleUpdateOptions("service_type_id", serviceTypeMapping);
    }
  }, [serviceTypes, handleUpdateOptions]);

  return (
    <Stack justifyContent="space-between" component="form" onSubmit={handleSubmit} divider={<Divider flexItem />} sx={{ height: "100%" }}>
      <Box sx={{ overflowY: "auto", flex: 1, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <DataField name="service_provider_name" formConfig={formConfig} />
          </Grid>
          <Grid item xs={4}>
            <DataField name="service_type_id" formConfig={formConfig} />
          </Grid>
          <Grid item xs={4}>
            <DataField name="configurable_by" formConfig={formConfig} />
          </Grid>
          <Grid item xs={6}>
            <DataField name="is_active" formConfig={formConfig} />
          </Grid>
          <Grid item xs={6}>
            <DataField name="is_public" formConfig={formConfig} />
          </Grid>
          <Grid item xs={12}>
            <DataField name="service_provider_description" formConfig={formConfig} />
          </Grid>
        </Grid>
      </Box>

      <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} p={1}>
        <Button variant="outlined" fullWidth onClick={() => navigate(`/providers/${providerId}/service-providers`)}>
          Cancel
        </Button>

        <Button color="primary" variant="contained" fullWidth type="submit">
          {defaultValues ? "Update" : "Create"}
        </Button>
      </Stack>
    </Stack>
  );
};

export default CreateServiceProvider;
