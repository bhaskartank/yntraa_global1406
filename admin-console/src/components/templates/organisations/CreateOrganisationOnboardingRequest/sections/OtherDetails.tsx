import { Grid } from "@mui/material";
import { FC } from "react";

import DataField from "components/organisms/Form/DataField";

interface OtherDetailProps {
  formConfig: any;
}

const OtherDetails: FC<OtherDetailProps> = ({ formConfig }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <DataField name="provider_id" formConfig={formConfig} />
      </Grid>
      <Grid item xs={6}>
        <DataField name="quotapackage_name" formConfig={formConfig} />
      </Grid>
    </Grid>
  );
};

export default OtherDetails;
