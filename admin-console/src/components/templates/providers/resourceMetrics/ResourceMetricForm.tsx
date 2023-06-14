import { Box, Button, Divider, Grid, Stack } from "@mui/material";
import { FC, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

import DataField from "components/organisms/Form/DataField";
import { FormSchema } from "components/organisms/Form/model";
import useForm from "components/organisms/Form/useForm";

interface ResourceMetricFormProps {
  onSubmit: (payload: any) => void;
  providers: any[];
  defaultValues?: any;
}

const ResourceMetricForm: FC<ResourceMetricFormProps> = ({ onSubmit, providers, defaultValues }) => {
  const navigate = useNavigate();

  const schema: FormSchema = useMemo(
    () => ({
      provider_id: {
        label: "Provider",
        initialValue: defaultValues?.provider_id,
        type: "select",
        ...(!defaultValues ? { validation: yup.string().required("Provider is required") } : {}),
        disabled: !!defaultValues,
        autoFocus: true,
        required: true,
      },
      metric_level: {
        label: "Metric Level",
        initialValue: defaultValues?.metric_level,
        type: "select",
        validation: yup.string().required("Metric Level is required"),
        options: [{ label: "Instance", value: "instance" }],
        required: true,
      },
      resource_type: {
        label: "Resource Type",
        initialValue: defaultValues?.resource_type,
        type: "select",
        validation: yup.string().required("Resource Type is required"),
        options: [
          { label: "CPU", value: "cpu" },
          { label: "Storage", value: "storage" },
          { label: "Network", value: "network" },
        ],
        required: true,
      },
      report_label: {
        label: "Report Label",
        initialValue: defaultValues?.report_label,
        type: "text",
        validation: yup.string().required("Report Label is required"),
        required: true,
      },
      metric_query_parameters: {
        label: "Metric Query Parameters",
        initialValue: defaultValues?.metric_query_parameters,
        type: "textarea",
        validation: yup.string().required("Metric Query Parameters is required"),
        minRows: 3,
        required: true,
      },
      embeded_link: {
        label: "Embedded Link",
        initialValue: defaultValues?.embeded_link,
        type: "textarea",
        minRows: 3,
      },
      x_label: {
        label: "X Axis Label",
        initialValue: defaultValues?.x_label,
        type: "text",
      },
      y_label: {
        label: "Y Axis Label",
        initialValue: defaultValues?.y_label,
        type: "text",
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
            <Grid item xs={12}>
              <DataField name="provider_id" formConfig={formConfig} />
            </Grid>
          ) : null}
          <Grid item xs={4}>
            <DataField name="metric_level" formConfig={formConfig} />
          </Grid>
          <Grid item xs={4}>
            <DataField name="resource_type" formConfig={formConfig} />
          </Grid>
          <Grid item xs={4}>
            <DataField name="report_label" formConfig={formConfig} />
          </Grid>
          <Grid item xs={6}>
            <DataField name="x_label" formConfig={formConfig} />
          </Grid>
          <Grid item xs={6}>
            <DataField name="y_label" formConfig={formConfig} />
          </Grid>
          <Grid item xs={6}>
            <DataField name="metric_query_parameters" formConfig={formConfig} />
          </Grid>
          <Grid item xs={6}>
            <DataField name="embeded_link" formConfig={formConfig} />
          </Grid>
        </Grid>
      </Box>

      <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} p={1}>
        <Button variant="outlined" fullWidth onClick={() => navigate(`/providers/resource-metrics`)}>
          Cancel
        </Button>

        <Button color="primary" variant="contained" fullWidth type="submit">
          {defaultValues ? "Update" : "Create"}
        </Button>
      </Stack>
    </Stack>
  );
};

export default ResourceMetricForm;
