import { Grid, Stack, Typography } from "@mui/material";
import { FC } from "react";

import DataField from "components/organisms/Form/DataField";

interface TechnicalDetailProps {
  formConfig: any;
}

const TechnicalDetail: FC<TechnicalDetailProps> = ({ formConfig }) => {
  return (
    <Stack gap={2}>
      <Typography variant="subtitle1">Technical Details</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <DataField name="projectStack" formConfig={formConfig} />
        </Grid>
        <Grid item xs={12} md={6}>
          <DataField name="projectEnvironment" formConfig={formConfig} />
        </Grid>
        <Grid item xs={12} md={6}>
          <DataField name="projectDatabase" formConfig={formConfig} />
        </Grid>
        <Grid item xs={12} md={6}>
          <DataField name="projectDeploymentEnvironment" formConfig={formConfig} />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default TechnicalDetail;
