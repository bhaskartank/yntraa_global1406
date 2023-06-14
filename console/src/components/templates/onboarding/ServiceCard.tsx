import { Box, Card, Stack, Typography } from "@mui/material";
// import { CardArrowRight } from "assets/icons";
import React, { FC, ReactNode } from "react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: ReactNode;
}

const ServiceCard: FC<ServiceCardProps> = ({ title, description, icon }) => {
  return (
    <Card sx={{ height: "100%", p: 2 }}>
      <Stack direction="row" justifyContent="center" gap={2} sx={{ backgroundColor: "background.paper" }}>
        <Box sx={{ svg: { width: 60, height: 60 } }}>{icon}</Box>
        <Stack gap={1}>
          <Typography variant="subtitle1">{title}</Typography>
          <Typography>{description}</Typography>
        </Stack>
      </Stack>
    </Card>
  );
};

export default ServiceCard;
