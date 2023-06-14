import { Stack, Typography } from "@mui/material";
import { FC } from "react";

import DataField from "components/organisms/Form/DataField";

interface BasicDetailProps {
  formConfig: any;
}

const BasicDetail: FC<BasicDetailProps> = ({ formConfig }) => {
  return (
    <Stack gap={2}>
      <Typography variant="subtitle1">Project Details</Typography>

      <DataField name="name" formConfig={formConfig} />
      <DataField name="description" formConfig={formConfig} />
    </Stack>
  );
};

export default BasicDetail;
