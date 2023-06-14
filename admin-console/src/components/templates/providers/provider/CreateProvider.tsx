import { Box, Button, Divider, Grid, Stack } from "@mui/material";
import { FC, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

import DataField from "components/organisms/Form/DataField";
import { FormSchema } from "components/organisms/Form/model";
import useForm from "components/organisms/Form/useForm";

interface CreateProviderProps {
  handleCreate: (payload: any) => void;
  testConnection: (payload: any) => void;
  providerTypes: any[];
}

const CreateProvider: FC<CreateProviderProps> = ({ handleCreate, testConnection, providerTypes }) => {
  const navigate = useNavigate();

  const schema: FormSchema = useMemo(
    () => ({
      provider_name: {
        label: "Name",
        initialValue: "",
        type: "text",
        validation: yup.string().required("Name is required"),
        autoFocus: true,
        required: true,
      },
      provider_location: {
        label: "Location",
        initialValue: "",
        type: "text",
      },
      provider_description: {
        label: "Description",
        initialValue: "",
        type: "textarea",
        minRows: 3,
      },
      provider_type_id: {
        label: "Provider Type",
        initialValue: "",
        type: "select",
        validation: yup.string().required("Provider Type is required"),
        required: true,
      },
      auth_url: {
        label: "Auth URL",
        initialValue: "",
        type: "text",
        validation: yup.string().url("Auth URL must be a valid URL").required("Auth URL is required"),
        required: true,
      },
      docker_registry: {
        label: "Docker Registry",
        initialValue: "",
        type: "text",
      },
      username: {
        label: "Username",
        initialValue: "",
        type: "text",
        validation: yup.string().required("User Name is required"),
        required: true,
      },
      password: {
        label: "Password",
        initialValue: "",
        type: "password",
        validation: yup.string().required("Password is required"),
        required: true,
      },
      project_name: {
        label: "Project Name",
        initialValue: "",
        type: "text",
        validation: yup.string().required("Project Name is required"),
        required: true,
      },
      region_name: {
        label: "Region Name",
        initialValue: "",
        type: "text",
        validation: yup.string().required("Region Name is required"),
        required: true,
      },
      identity_api_version: {
        label: "Identity API Version",
        initialValue: "",
        type: "text",
        validation: yup
          .number()
          .min(0, "Identity API Version must be a positive number")
          .typeError("Identity API Version must be a positive number")
          .required("Identity API Version is required"),
        required: true,
      },
      user_domain_id: {
        label: "User Domain Name",
        initialValue: "",
        type: "text",
      },
      provider_token_id: {
        label: "Provider Code",
        initialValue: "",
        type: "text",
      },
    }),
    [],
  );

  const handleCreateProvider = useCallback(
    (values) => {
      const payload = {
        ...values,
        ...(values?.provider_token_id ? { provider_token_id: values?.provider_token_id } : { provider_token_id: null }),
      };

      handleCreate(payload);
    },
    [handleCreate],
  );

  const { values, handleUpdateOptions, handleSubmit, formConfig } = useForm({ schema, onSubmit: handleCreateProvider });

  const handleTestConnection = useCallback(() => {
    const payload = {
      ...(values?.auth_url ? { auth_url: values?.auth_url } : {}),
      ...(values?.project_name ? { project_name: values?.project_name } : {}),
      ...(values?.username ? { username: values?.username } : {}),
      ...(values?.password ? { password: values?.password } : {}),
      ...(values?.region_name ? { region_name: values?.region_name } : {}),
      ...(values?.identity_api_version ? { identity_api_version: values?.identity_api_version } : {}),
      ...(values?.user_domain_id ? { user_domain_id: values?.user_domain_id } : {}),
    };

    testConnection(payload);
  }, [testConnection, values]);

  useEffect(() => {
    if (providerTypes?.length) {
      const providerTypesMapping = providerTypes?.map((type) => ({ label: type?.name, value: type?.id })) || [];

      handleUpdateOptions("provider_type_id", providerTypesMapping);
    }
  }, [providerTypes, handleUpdateOptions]);

  return (
    <Stack justifyContent="space-between" component="form" onSubmit={handleSubmit} divider={<Divider flexItem />} sx={{ height: "100%" }}>
      <Box sx={{ overflowY: "auto", flex: 1, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <DataField name="provider_name" formConfig={formConfig} />
          </Grid>
          <Grid item xs={4}>
            <DataField name="provider_location" formConfig={formConfig} />
          </Grid>
          <Grid item xs={4}>
            <DataField name="provider_type_id" formConfig={formConfig} />
          </Grid>
          <Grid item xs={12}>
            <DataField name="provider_description" formConfig={formConfig} />
          </Grid>
          <Grid item xs={12}>
            <DataField name="auth_url" formConfig={formConfig} />
          </Grid>
          <Grid item xs={6}>
            <DataField name="username" formConfig={formConfig} />
          </Grid>
          <Grid item xs={6}>
            <DataField name="password" formConfig={formConfig} />
          </Grid>
          <Grid item xs={4}>
            <DataField name="docker_registry" formConfig={formConfig} />
          </Grid>
          <Grid item xs={4}>
            <DataField name="project_name" formConfig={formConfig} />
          </Grid>
          <Grid item xs={4}>
            <DataField name="region_name" formConfig={formConfig} />
          </Grid>
          <Grid item xs={4}>
            <DataField name="identity_api_version" formConfig={formConfig} />
          </Grid>
          <Grid item xs={4}>
            <DataField name="user_domain_id" formConfig={formConfig} />
          </Grid>
          <Grid item xs={4}>
            <DataField name="provider_token_id" formConfig={formConfig} />
          </Grid>
        </Grid>
      </Box>

      <Stack direction="row" justifyContent="center" alignItems="center" p={1} spacing={2}>
        <Button variant="outlined" fullWidth onClick={() => navigate("/providers")}>
          Cancel
        </Button>
        <Button color="info" variant="contained" fullWidth onClick={handleTestConnection}>
          Test Connection
        </Button>
        <Button color="primary" variant="contained" fullWidth type="submit">
          Submit
        </Button>
      </Stack>
    </Stack>
  );
};

export default CreateProvider;
