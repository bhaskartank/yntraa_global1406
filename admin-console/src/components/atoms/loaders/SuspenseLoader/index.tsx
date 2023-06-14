import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import React from "react";

interface LoaderProps {
  buttonStyle: any;
}

const Loader: React.FC<LoaderProps> = ({ buttonStyle }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        left: "50%",
        top: "50%",
      }}>
      <CircularProgress sx={buttonStyle} />
    </Box>
  );
};

export default Loader;
