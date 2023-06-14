import { Box, Stack } from "@mui/material";
import { FC } from "react";

import { APP_LOGO } from "utilities/constants";

interface LogoContainerProps {
  variant?: string;
}

const LogoContainer: FC<LogoContainerProps> = ({ variant = "dark" }) => {
  return (
    <Stack direction="row" justifyContent="center" alignItems="center" sx={{ py: 0 }}>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
        {variant === "dark" ? (
          <Stack direction="row" justifyContent="center" alignItems="center" sx={{ py: 0, height: { xs: "80px" }, backgroundColor: "primary.darkest" }}>
            <img width="124px" src={APP_LOGO.DARK} />
          </Stack>
        ) : (
          <Stack direction="row" justifyContent="center" alignItems="center" sx={{ py: 0 }}>
            <img width="124px" src={APP_LOGO.LIGHT} />
          </Stack>
        )}
      </Box>
    </Stack>
  );
};

export default LogoContainer;
