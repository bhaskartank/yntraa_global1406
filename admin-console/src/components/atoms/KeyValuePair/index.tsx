import { Box, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";
import { BsDashLg } from "react-icons/bs";

export interface KeyValuePairProps {
  label: ReactNode;
  value: ReactNode;
}

const KeyValuePair = (props: KeyValuePairProps) => {
  const { label, value } = props;

  return (
    <Stack direction="row" alignItems="center" columnGap={1} flexWrap="wrap">
      <Typography sx={{ minWidth: "20px", fontWeight: "500" }}>{label}:</Typography>
      <Box flex={1} sx={{ color: "grey.900", fontSize: "14px" }}>
        {value || <BsDashLg style={{ verticalAlign: "middle" }} />}
      </Box>
    </Stack>
  );
};

export default KeyValuePair;
