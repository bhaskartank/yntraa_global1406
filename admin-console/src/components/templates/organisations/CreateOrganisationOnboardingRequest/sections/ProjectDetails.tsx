import { Grid } from "@mui/material";
import { FC } from "react";

import DataField from "components/organisms/Form/DataField";

interface ProjectDetailProps {
  formConfig: any;
}

const ProjectDetails: FC<ProjectDetailProps> = ({ formConfig }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <DataField name="project_name" formConfig={formConfig} />
      </Grid>
      <Grid item xs={3}>
        <DataField name="technologyUsed" formConfig={formConfig} />
      </Grid>
      <Grid item xs={3}>
        <DataField name="environment" formConfig={formConfig} />
      </Grid>
      <Grid item xs={3}>
        <DataField name="database" formConfig={formConfig} />
      </Grid>
      <Grid item xs={3}>
        <DataField name="deployment_environment" formConfig={formConfig} />
      </Grid>
      <Grid item xs={12}>
        <DataField name="project_description" formConfig={formConfig} />
      </Grid>
    </Grid>
  );
};

export default ProjectDetails;
