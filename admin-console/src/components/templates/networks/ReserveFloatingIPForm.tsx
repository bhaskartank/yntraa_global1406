import { Box, Button, Divider, Grid, Stack } from "@mui/material";
import { FC, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

import DataField from "components/organisms/Form/DataField";
import { FormSchema } from "components/organisms/Form/model";
import useForm from "components/organisms/Form/useForm";

interface ReserveFloatingIPFormProps {
  onSubmit: (payload: any) => void;
  defaultValues?: any;
  providers: any;
  fetchProviderProjects: any;
  projects: any;
  fetchProviderProjectNetworks: any;
  networks: any;
}

const ReserveFloatingIPForm: FC<ReserveFloatingIPFormProps> = ({ onSubmit, providers, defaultValues, fetchProviderProjects, projects, fetchProviderProjectNetworks, networks }) => {
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
      project_id: {
        label: "Project",
        initialValue: "",
        type: "select",
        ...(!defaultValues ? { validation: yup.string().required("Project is required") } : {}),
        autoFocus: true,
        disabled: !!defaultValues,
        required: true,
      },
      network_id: {
        label: "Network",
        initialValue: "",
        type: "select",
        ...(!defaultValues ? { validation: yup.string().required("Network is required") } : {}),
        autoFocus: true,
        disabled: !!defaultValues,
        required: true,
      },
      floating_ip: {
        label: "Floating IP",
        initialValue: "",
        type: "text",
        disabled: !!defaultValues,
      },
      description: {
        label: "Description",
        initialValue: "",
        validation: yup.string(),
        type: "textarea",
        disabled: !!defaultValues,
        minRows: 5,
      },
    }),
    [defaultValues],
  );

  const { handleUpdateOptions, handleSubmit, formConfig, watchValue } = useForm({ schema, onSubmit });
  const providerIdValue = watchValue("provider_id");
  const projectIdValue = watchValue("project_id");

  useEffect(() => {
    if (providers?.length) {
      const providersMapping = providers?.map((provider) => ({ label: `${provider?.provider_name} (${provider?.provider_id})`, value: String(provider?.id) })) || [];
      handleUpdateOptions("provider_id", providersMapping);
    }
  }, [providers, handleUpdateOptions]);

  useEffect(() => {
    if (providerIdValue !== "") {
      fetchProviderProjects(providerIdValue);
    }
  }, [fetchProviderProjects, providerIdValue]);

  useEffect(() => {
    if (projects?.length) {
      const projectsMapping = projects?.map((project) => ({ label: `${project?.name} (${project?.project_id})`, value: String(project?.id) })) || [];
      handleUpdateOptions("project_id", projectsMapping);
    }
  }, [projects, handleUpdateOptions]);

  useEffect(() => {
    if (projectIdValue !== "") {
      fetchProviderProjectNetworks({ project_id: projectIdValue, provider_id: providerIdValue });
    }
  }, [fetchProviderProjectNetworks, projectIdValue, providerIdValue]);

  useEffect(() => {
    if (networks?.length) {
      const networksMapping = networks?.map((network) => ({ label: `${network?.network_name}`, value: String(network?.id) })) || [];
      handleUpdateOptions("network_id", networksMapping);
    }
  }, [networks, handleUpdateOptions]);

  return (
    <Stack justifyContent="space-between" component="form" onSubmit={handleSubmit} divider={<Divider flexItem />} sx={{ height: "100%" }}>
      <Box sx={{ overflowY: "auto", flex: 1, p: 2 }}>
        <Grid container spacing={2}>
          {!defaultValues ? (
            <>
              <Grid item xs={6}>
                <DataField name="provider_id" formConfig={formConfig} />
              </Grid>
              <Grid item xs={6}>
                <DataField name="project_id" formConfig={formConfig} />
              </Grid>
              <Grid item xs={6}>
                <DataField name="network_id" formConfig={formConfig} />
              </Grid>
              <Grid item xs={6}>
                <DataField name="floating_ip" formConfig={formConfig} />
              </Grid>
              <Grid item xs={12}>
                <DataField name="description" formConfig={formConfig} />
              </Grid>
            </>
          ) : null}
        </Grid>
      </Box>

      <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} p={2}>
        <Button variant="outlined" fullWidth onClick={() => navigate(`/networks/floating-ip`)}>
          Cancel
        </Button>

        <Button color="primary" variant="contained" fullWidth type="submit">
          Reserve
        </Button>
      </Stack>
    </Stack>
  );
};

export default ReserveFloatingIPForm;
