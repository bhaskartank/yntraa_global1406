import { Box, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";
import { BsDashLg } from "react-icons/bs";

export interface KeyValuePairProps {
  label: ReactNode;
  value: ReactNode;
  customStyle?: any;
}

const KeyValuePair = (props: KeyValuePairProps) => {
  const { label, value, customStyle = {} } = props;

  return (
    <Stack sx={{ flexDirection: "row", ...customStyle }} alignItems="flex-start" columnGap={1} flexWrap="wrap">
      <Typography sx={{ minWidth: "20px", fontWeight: "500" }}>{label}:</Typography>
      <Box flex={1} sx={{ color: "grey.900", fontSize: "14px" }}>
        {value || <BsDashLg style={{ verticalAlign: "middle" }} />}
      </Box>
    </Stack>
  );
};

export default KeyValuePair;
