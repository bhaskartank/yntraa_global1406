import { Stack, Typography } from "@mui/material";
import React from "react";

type ModalCompProps = {
  title: string;
  children: React.ReactNode;
};

function ModalInnerComponent({ title = "default", children }: ModalCompProps) {
  return (
    <Stack spacing={0} mt={0} mb={2}>
      <Typography variant="h6">{title}</Typography>
      <Stack direction="row" spacing={0} pt={1} flexWrap={"wrap"} gap={2}>
        {children}
      </Stack>
    </Stack>
  );
}

export default ModalInnerComponent;
