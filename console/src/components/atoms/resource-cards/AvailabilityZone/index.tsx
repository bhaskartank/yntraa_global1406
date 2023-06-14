import { Box, Grid, Stack, Typography } from "@mui/material";
import { FC } from "react";

import StatusChip from "components/atoms/StatusChip";

import ResourceCardWrapper from "../ResourceCardWrapper";

interface AvailabilityZoneCardProps {
  name?: string;
  resourceName?: string;
  status?: string;
  isActive?: boolean;
}

const AvailabilityZoneCard: FC<AvailabilityZoneCardProps> = ({ name, resourceName, status, isActive }) => {
  return (
    <ResourceCardWrapper isActive={isActive}>
      <Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="body2"> Name</Typography>
            <Typography fontWeight="bold">{name}</Typography>
          </Box>
        </Stack>

        <Grid container spacing={2} mt={1}>
          <Grid item xs={6}>
            <Typography variant="body2">Resource Type</Typography>
            <Typography fontWeight="bold">{resourceName}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">Status</Typography>
            <StatusChip size="small" label={status?.toLowerCase() === "available" ? "Available" : "Unavailable"} />
          </Grid>
        </Grid>
      </Stack>
    </ResourceCardWrapper>
  );
};

interface AvailabilityZoneCardListProps {
  selected: any;
  handleSelect: (availabilityZone: any) => void;
  list?: any;
}

export const AvailabilityZoneCardList: FC<AvailabilityZoneCardListProps> = (props) => {
  const { selected, handleSelect, list } = props;

  return (
    <Grid container spacing={2}>
      {list?.map((availabilityZone) => (
        <Grid item key={availabilityZone?.id} xs={12} md={6} lg={3} onClick={() => handleSelect(availabilityZone)}>
          <AvailabilityZoneCard
            key={availabilityZone?.id}
            name={availabilityZone?.resource_availability_zones?.zone_name}
            resourceName={availabilityZone?.resource_availability_zones?.resource_name}
            status={availabilityZone?.resource_availability_zones?.status}
            isActive={selected?.id === availabilityZone?.id}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default AvailabilityZoneCard;
