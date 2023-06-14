import { Box, Stack, Typography } from "@mui/material";
import { FC } from "react";

import { AvailabilityZoneCardList } from "components/atoms/resource-cards/AvailabilityZone";

interface AvailabilityZoneProps {
  availabilityZones: any[];
  selectedAvailabilityZone: any;
  handleSelectAvailabilityZone: any;
}

const AvailabilityZone: FC<AvailabilityZoneProps> = ({ availabilityZones, selectedAvailabilityZone, handleSelectAvailabilityZone }) => {
  return (
    <Stack gap={4}>
      <Box>
        <Typography variant="subtitle1">Choose Availability Zone</Typography>
        <Typography>An availability zone is a physically separate data center within a region that provides redundancy and fault tolerance for cloud infrastructure.</Typography>
      </Box>

      <AvailabilityZoneCardList list={availabilityZones} selected={selectedAvailabilityZone} handleSelect={handleSelectAvailabilityZone} />
    </Stack>
  );
};

export default AvailabilityZone;
