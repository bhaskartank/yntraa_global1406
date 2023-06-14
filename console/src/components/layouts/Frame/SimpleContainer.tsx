import { Container } from "@mui/material";
import React, { FC, ReactNode } from "react";

interface SimpleContainer {
  children?: ReactNode;
}

const SimpleContainer: FC<SimpleContainer> = ({ children }) => {
  return (
    <Container maxWidth={"md"} sx={{ height: "100%", flex: 1, overflowY: "auto" }}>
      {children}
    </Container>
  );
};

export default SimpleContainer;
