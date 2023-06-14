import { Stack, Typography } from "@mui/material";
import React from "react";

import DataList from "components/organisms/DataList";
import useDataList from "components/organisms/DataList/useDataList";

interface SubnetsProps {
  data: any;
}
export const Subnets: React.FunctionComponent<SubnetsProps> = ({ data }) => {
  const columns: any = React.useMemo(() => {
    return [{ label: "Assigned IP" }, { label: "Name" }, { label: "Subnet IP" }];
  }, []);

  const rowCreator: any = React.useCallback((item: any) => [{ content: item?.private_ip }, { content: item?.status }, { content: item?.managed_by }], []);

  const dataList = useDataList({
    data,
    columns,
    rowCreator,
  });

  return (
    <Stack sx={{ height: "100%" }} gap={1}>
      <Typography variant="subtitle1">Subnets</Typography>
      <DataList dataList={dataList} />
    </Stack>
  );
};
