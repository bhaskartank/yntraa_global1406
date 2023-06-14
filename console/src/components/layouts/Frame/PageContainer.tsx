import { Container, Stack, Typography } from "@mui/material";
import React, { FC } from "react";
import { Helmet } from "react-helmet";

import { APP_TITLE } from "utils/constants";

interface PageContainerProps {
  children?: React.ReactNode;
  title: string;
  hideTitle?: boolean;
}

const PageContainer: FC<PageContainerProps> = ({ children, title, hideTitle = false }) => {
  return (
    <>
      <Helmet>
        <title>
          {title} | {APP_TITLE}
        </title>
      </Helmet>

      <Container maxWidth={false} sx={{ height: "100%", flex: 1, overflowY: "auto", pt: 4, pb: 2 }}>
        {!hideTitle ? (
          <Typography fontSize="24px" noWrap textOverflow="ellipsis" mb={2}>
            {title}
          </Typography>
        ) : null}
        <Stack sx={{ p: 0, borderRadius: "8px", overflow: "hidden" }}>{children}</Stack>
      </Container>
    </>
  );
};

export default PageContainer;
