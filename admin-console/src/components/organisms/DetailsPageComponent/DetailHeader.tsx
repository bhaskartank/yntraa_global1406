import { Stack, Typography } from "@mui/material";
import * as React from "react";

export interface detailPageHeader {
  title: string;
  label: string | React.ReactNode;
}

interface DetailHeaderProp {
  headerData: Array<detailPageHeader>;
}
export const DetailHeader = ({ headerData }: DetailHeaderProp) => {
  return (
    <Stack direction="row" justifyContent="space-between" px={3} py={2} sx={{ backgroundColor: "primary.light" }}>
      {headerData?.map((item, ind) => (
        <Stack direction="column" key={ind}>
          <Typography color="common.black" variant="body2">
            {item?.title}
          </Typography>
          <Typography color="common.black" variant="subtitle1">
            {item?.label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};
