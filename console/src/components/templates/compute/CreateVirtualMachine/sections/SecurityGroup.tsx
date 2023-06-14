import { Box, Stack, Typography } from "@mui/material";
import { FC } from "react";

import DataField from "components/organisms/Form/DataField";

interface SecurityGroupProps {
  formConfig: any;
}

const SecurityGroup: FC<SecurityGroupProps> = ({ formConfig }) => {
  return (
    <Stack gap={4}>
      <Box>
        <Typography variant="subtitle1">Choose Security Groups</Typography>
        <Typography>
          Security Groups are virtual firewalls that control inbound and outbound traffic for virtual machines, enabling fine-grained control over network access and enhancing
          security measures.
        </Typography>
      </Box>

      <DataField name="sec_group_id" formConfig={formConfig} />
    </Stack>
  );
};

export default SecurityGroup;
