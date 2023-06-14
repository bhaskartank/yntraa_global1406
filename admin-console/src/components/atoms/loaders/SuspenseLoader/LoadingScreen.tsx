import { Box, LinearProgress } from "@mui/material";
import React from "react";

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        minHeight: "100%",
        padding: 24,
      }}>
      <Box width={400}>
        <LinearProgress />
      </Box>
    </Box>
  );
};

export default LoadingScreen;
