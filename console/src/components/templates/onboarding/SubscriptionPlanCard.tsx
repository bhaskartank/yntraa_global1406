import { Radio, Stack, Typography } from "@mui/material";
// import { CardArrowRight } from "assets/icons";
import React, { FC } from "react";

import ResourceCardWrapper from "components/atoms/resource-cards/ResourceCardWrapper";

interface SubscriptionPlanCardProps {
  title: string;
  description: string;
  cost: number;
  isActive?: boolean;
}

const SubscriptionPlanCard: FC<SubscriptionPlanCardProps> = ({ title, description, cost, isActive = false }) => {
  return (
    <ResourceCardWrapper isActive={isActive}>
      <Stack direction="row" alignItems="flex-start" gap={1}>
        <Radio checked={isActive} sx={{ p: "4px" }} />

        <Stack gap={1}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
            <Typography variant="subtitle1">{title}</Typography>
            <Typography fontWeight="bold">₹ {cost}/month</Typography>
          </Stack>

          <Typography>{description}</Typography>
        </Stack>
      </Stack>
    </ResourceCardWrapper>
  );
};

export default SubscriptionPlanCard;
