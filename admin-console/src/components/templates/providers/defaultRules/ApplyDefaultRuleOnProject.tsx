import { Box, Button, Divider, Grid, Stack } from "@mui/material";
import { FC, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

import DataField from "components/organisms/Form/DataField";
import { FormSchema } from "components/organisms/Form/model";
import useForm from "components/organisms/Form/useForm";

interface ApplyDefaultRuleOnProjectProps {
  onSubmit: (payload: any) => void;
  organisations: any[];
  fetchProjects: any;
  projects: any;
}

const ApplyDefaultRuleOnProject: FC<ApplyDefaultRuleOnProjectProps> = ({ onSubmit, organisations, fetchProjects, projects }) => {
  const navigate = useNavigate();

  const schema: FormSchema = useMemo(
    () => ({
      organisation_id: {
        label: "Organisation",
        initialValue: "",
        validation: yup.string().required("Organisation is required"),
        type: "select",
        required: true,
      },
      project_id: {
        label: "Project",
        initialValue: "",
        validation: yup.string().required("Project is required"),
        type: "select",
        required: true,
      },
    }),
    [],
  );

  const { handleUpdateOptions, handleSubmit, formConfig, watchValue } = useForm({ schema, onSubmit });

  const selectedOrganisation = watchValue("organisation_id");

  useEffect(() => {
    if (organisations?.length) {
      const organisationMapping = organisations?.map((organisation) => ({ label: `${organisation?.name} (${organisation?.org_id})`, value: organisation?.id }));
      handleUpdateOptions("organisation_id", organisationMapping);
    }
  }, [organisations, handleUpdateOptions]);

  useEffect(() => {
    if (projects?.length) {
      const projectsMapping = projects?.map((project) => ({ label: `${project?.name} (${project?.project_id})`, value: String(project?.id) }));
      handleUpdateOptions("project_id", projectsMapping);
    }
  }, [projects, handleUpdateOptions]);

  useEffect(() => {
    if (selectedOrganisation) {
      fetchProjects({ filters: JSON.stringify({ organisation_id: [selectedOrganisation] }) });
    }
  }, [fetchProjects, selectedOrganisation]);

  return (
    <Stack justifyContent="space-between" component="form" onSubmit={handleSubmit} divider={<Divider flexItem />} sx={{ height: "100%" }}>
      <Box sx={{ overflowY: "auto", flex: 1, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <DataField name="organisation_id" formConfig={formConfig} />
          </Grid>
          <Grid item xs={6}>
            <DataField name="project_id" formConfig={formConfig} />
          </Grid>
        </Grid>
      </Box>

      <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} p={1}>
        <Button variant="outlined" fullWidth onClick={() => navigate(`/providers/default-rules`)}>
          Cancel
        </Button>

        <Button color="primary" variant="contained" fullWidth type="submit">
          Apply
        </Button>
      </Stack>
    </Stack>
  );
};

export default ApplyDefaultRuleOnProject;
