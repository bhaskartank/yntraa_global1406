import { Grid } from "@mui/material";
import { FC } from "react";

import DataField from "components/organisms/Form/DataField";

interface OrganisationDetailProps {
  formConfig: any;
}

const OrganisationDetails: FC<OrganisationDetailProps> = ({ formConfig }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <DataField name="org_reg_code" formConfig={formConfig} />
      </Grid>
      <Grid item xs={6}>
        <DataField name="name" formConfig={formConfig} />
      </Grid>
      <Grid item xs={12}>
        <DataField name="description" formConfig={formConfig} />
      </Grid>
    </Grid>
  );
};

export default OrganisationDetails;
