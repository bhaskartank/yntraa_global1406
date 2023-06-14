import { Box, Stack, Typography } from "@mui/material";
import { FC } from "react";

import DataField from "components/organisms/Form/DataField";

interface NetworkProps {
  formConfig: any;
}

const Network: FC<NetworkProps> = ({ formConfig }) => {
  return (
    <Stack gap={4}>
      <Box>
        <Typography variant="subtitle1">Choose Network</Typography>
        <Typography>
          A network refers to a virtual network that connects virtual machines within the same region, allowing them to communicate securely and efficiently with each other.
        </Typography>
      </Box>

      <DataField name="network_id" formConfig={formConfig} />
    </Stack>
  );
};

export default Network;
