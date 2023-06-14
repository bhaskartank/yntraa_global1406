import { Box, Container, Stack } from "@mui/material";
import React, { FC } from "react";

interface CardBoxProps {
  children: React.ReactNode;
  fullHeight?: boolean;
  sx?: any;
}
export const CardBox: FC<CardBoxProps> = ({ children, fullHeight = false, sx }) => {
  return (
    <Box
      sx={{
        px: 3,
        py: 5,
        boxShadow: "0px 0px 16px rgba(0, 0, 0, 0.12)",
        borderRadius: "8px",
        border: "1px solid #E3E4E6",
        backgroundColor: "background.paper",
        height: fullHeight ? "100%" : "inherit",
        ...sx,
      }}>
      {children}
    </Box>
  );
};

interface PaperContainerProps {
  children: React.ReactNode;
  fullHeight?: boolean;
  sx?: any;
  disableGutters?: boolean;
  containerStyle?: any;
}
export const PaperContainer: FC<PaperContainerProps> = ({ children, sx, disableGutters, containerStyle = {} }) => {
  return (
    <Container
      maxWidth="xl"
      disableGutters={disableGutters || false}
      sx={{
        height: "calc(100% - 24px)",
        // minHeight: { xl: "97%", lg: "97%", md: "94%", sm: "95%", xs: "93%" },
        flex: 1,
        px: { xs: 1, lg: 1 },
        ...containerStyle,
      }}>
      <Stack
        sx={{
          p: 0,
          my: "12px",
          boxShadow: "0px 2px 30px rgba(0, 0, 0, 0.06)",
          borderRadius: "8px",
          backgroundColor: "background.paper",
          position: "relative",
          height: "100%",
          overflow: "hidden",
          // overflow: "auto",
          ...sx,
        }}>
        {children}
      </Stack>
    </Container>
  );
};

interface SimpleContainerProps {
  children: React.ReactNode;
  fullHeight?: boolean;
  sx?: any;
}
export const SimpleContainer: FC<SimpleContainerProps> = ({ children, sx }) => {
  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          px: 0,
          py: 5,
          ...sx,
        }}>
        {children}
      </Box>
    </Container>
  );
};

export default PaperContainer;
