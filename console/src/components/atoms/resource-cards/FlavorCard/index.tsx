import { Box, Divider, Grid, Stack, Tooltip, Typography } from "@mui/material";
import { FC } from "react";

import UnitFilter from "components/atoms/UnitFilter";

import ResourceCardWrapper from "../ResourceCardWrapper";

interface FlavorCardProps {
  name?: string;
  vcpus?: string;
  ram?: string;
  disk?: string;
  cost?: string;
  isActive?: boolean;
}

const FlavorCard: FC<FlavorCardProps> = ({ name, vcpus, ram, disk, cost, isActive }) => {
  return (
    <ResourceCardWrapper isActive={isActive}>
      <Stack divider={<Divider sx={{ borderColor: "divider" }} />} gap={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Tooltip title={name} placement="top">
            <Typography fontWeight={"bold"} noWrap sx={{ pr: 3 }}>
              {name}
            </Typography>
          </Tooltip>
        </Stack>

        <Grid container>
          <Grid item xs={4}>
            <Stack>
              <Typography fontWeight={"light"} variant="body2">
                vCPU
              </Typography>
              <Typography fontWeight={"bold"}>{vcpus}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Stack>
              <Typography fontWeight={"light"} variant="body2">
                RAM
              </Typography>
              <Typography component="span" fontWeight={"bold"}>
                <UnitFilter size={ram} unit="GiB" flavorType="ram" />
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Stack>
              <Typography fontWeight={"light"} variant="body2">
                STORAGE
              </Typography>
              <Typography fontWeight={"bold"}>
                <UnitFilter size={disk} unit="GiB" flavorType="disk" />
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        <Box>
          <Typography fontWeight={"light"}>
            <Typography component="span" fontWeight={"bold"}>
              {cost}
            </Typography>{" "}
            &#x20b9; / MONTH (EST)
          </Typography>
        </Box>
      </Stack>
    </ResourceCardWrapper>
  );
};

interface FlavorCardListProps {
  selected: any;
  handleSelect: (payload: any) => void;
  list?: any;
}

export const FlavorCardList: FC<FlavorCardListProps> = (props) => {
  const { selected, handleSelect, list } = props;

  return (
    <Grid container spacing={2}>
      {list?.map((flavor) => (
        <Grid item key={flavor?.id} xs={12} sm={6} md={4} lg={3} xl={2} onClick={() => handleSelect(flavor)}>
          <FlavorCard key={flavor?.id} name={flavor?.name} vcpus={flavor?.vcpus} ram={flavor?.ram} disk={flavor?.disk} cost={flavor?.cost} isActive={selected?.id === flavor?.id} />
        </Grid>
      ))}
    </Grid>
  );
};

export default FlavorCard;
