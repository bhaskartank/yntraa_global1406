import { Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { FOOTER_TEXT } from "utils/constants";

const Footer = () => {
  return (
    <Stack
      direction="row"
      justifyContent="flex-end"
      alignItems="center"
      flexWrap="wrap"
      color="text.white"
      sx={{ px: 2, py: 1, width: "100%", overflow: "hidden", backgroundColor: "primary.main", color: "common.white" }}
      zIndex={2}>
      <Typography component="span" variant="subtitle2" fontSize="12px" noWrap>
        {FOOTER_TEXT}
      </Typography>
    </Stack>
  );
};

export default Footer;
