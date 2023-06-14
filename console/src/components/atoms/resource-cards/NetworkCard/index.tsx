import { Grid, Stack, Typography } from "@mui/material";
import { FC } from "react";

import ResourceCardWrapper from "../ResourceCardWrapper";

interface NetworkCardProps {
  name?: string;
  subnets?: any[];
  isActive?: boolean;
}

const NetworkCard: FC<NetworkCardProps> = ({ name, subnets, isActive }) => {
  return (
    <ResourceCardWrapper isActive={isActive}>
      <Stack direction="row" justifyContent="space-between">
        <Stack>
          <Typography variant="body2">Name</Typography>
          <Typography fontWeight="bold">{name}</Typography>
        </Stack>

        <Stack>
          <Typography variant="body2">Subnets</Typography>
          <Typography fontWeight="bold">{subnets?.length}</Typography>
        </Stack>
      </Stack>
    </ResourceCardWrapper>
  );
};

interface NetworkCardListProps {
  selected: any;
  handleSelect: (network: any) => void;
  list?: any;
}

export const NetworkCardList: FC<NetworkCardListProps> = (props) => {
  const { selected, handleSelect, list } = props;

  return (
    <Grid container spacing={2}>
      {list?.map((network) => (
        <Grid item key={network?.id} xs={12} md={6} lg={4} xl={3} onClick={() => handleSelect(network)}>
          <NetworkCard key={network?.id} name={network?.network_name} subnets={network?.subnet_network} isActive={selected?.map((network) => network?.id)?.includes(network?.id)} />
        </Grid>
      ))}
    </Grid>
  );
};

export default NetworkCard;
