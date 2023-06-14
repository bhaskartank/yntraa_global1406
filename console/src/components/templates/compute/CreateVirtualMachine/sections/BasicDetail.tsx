import { Box, Grid, Stack, Typography } from "@mui/material";
import { FC } from "react";

import DataField from "components/organisms/Form/DataField";

interface BasicDetailProps {
  formConfig: any;
}

const BasicDetail: FC<BasicDetailProps> = ({ formConfig }) => {
  return (
    <Stack gap={2}>
      <Box>
        <Typography variant="subtitle1">Machine Details</Typography>
        <Typography>Choose a friendly name for your virtual machine. And provide a username and password for connecting to your virtual machine.</Typography>
      </Box>

      <DataField name="instance_name" formConfig={formConfig} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <DataField name="vm_username" formConfig={formConfig} />
        </Grid>
        <Grid item xs={12} md={6}>
          <DataField name="vm_password" formConfig={formConfig} />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default BasicDetail;
