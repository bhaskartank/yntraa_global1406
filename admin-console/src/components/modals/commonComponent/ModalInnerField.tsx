import { Box, Chip } from "@mui/material";
import React from "react";

type ModalInnerFieldProp = {
  label: string;
  value: string;
};

function ModalInnerField({ label, value }: ModalInnerFieldProp) {
  return (
    <Chip
      label={
        <Box>
          <span style={{ fontWeight: "bold" }}>{label}: </span>
          {value}
        </Box>
        // <Typography variant="subtitle2" sx={{ whiteSpace: "nowrap" }} pt={0.5} gutterBottom>
        //   <span style={{ fontWeight: 600 }}>{label}: </span>
        //   {value}
        // </Typography>
      }
      color="default"
      size="small"
      variant="outlined"
    />
  );
}

export default ModalInnerField;
