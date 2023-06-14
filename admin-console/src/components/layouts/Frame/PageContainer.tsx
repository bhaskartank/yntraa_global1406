import { Box, Stack, Typography } from "@mui/material";
import React, { FC } from "react";
import { Helmet } from "react-helmet";

import PaperContainer from "components/layouts/Frame/PaperContainer";
import BreadcrumbWrapper from "components/molecules/BreadcrumbWrapper";

import { APP_TITLE } from "utilities/constants";

interface Breadcrumb {
  label: string;
  to?: string;
  state?: any;
}
interface PageContainerProps {
  children?: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
  title: string;
}

const PageContainer: FC<PageContainerProps> = ({ children, breadcrumbs, title }) => {
  return (
    <>
      <Helmet>
        <title>
          {title} | {APP_TITLE}
        </title>
      </Helmet>

      <Stack direction="row" alignItems="center">
        <Stack
          direction="row"
          alignItems="center"
          flex={1}
          sx={{
            backgroundColor: "grey.200",
            px: 3,
            height: "30px",
            mt: 1,
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              width: 0,
              height: 0,
              borderTop: "30px solid transparent",
              borderRight: "30px solid black",
              borderRightColor: "primary.main",
              transform: "rotate(270deg)",
            },
          }}>
          <Typography variant="h6" noWrap textOverflow="ellipsis" overflow="hidden" sx={{ fontWeight: "normal", color: "common.black", pt: 1, px: 2 }}>
            {title}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} pl={2} pr={5} mt={1} flex={1}>
          <BreadcrumbWrapper breadcrumbs={breadcrumbs} />
        </Stack>
      </Stack>

      <Box sx={{ backgroundColor: "grey.200", px: 1, height: "100%", overflow: "hidden" }}>
        <PaperContainer>{children}</PaperContainer>
      </Box>
    </>
  );
};

export default PageContainer;
