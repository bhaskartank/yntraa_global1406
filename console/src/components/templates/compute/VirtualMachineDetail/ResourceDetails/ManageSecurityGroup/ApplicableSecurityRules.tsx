import { Stack, Typography } from "@mui/material";
import React from "react";

import DataList from "components/organisms/DataList";
import useDataList from "components/organisms/DataList/useDataList";

interface ApplicableSecurityRulesProps {
  data: any;
}
export const ApplicableSecurityRules: React.FunctionComponent<ApplicableSecurityRulesProps> = ({ data }) => {
  const columns: any = React.useMemo(() => {
    return [{ label: "Type" }, { label: "Port Range" }, { label: "Remote IP" }, {label: "Security Group Name"}];
  }, []);

  const rowCreator: any = React.useCallback((item: any) => [{ content: `${item?.direction} ${item?.protocol.toUpperCase()}` }, 
  { content: `${item?.port_range_min} - ${item?.port_range_max}` }, { content: item?.remote_ip_prefix },
  { content: item?.security_group_name }], []);

  const dataList = useDataList({
    data,
    columns,
    rowCreator,
  });

  return (
    <Stack sx={{ height: "100%" }} gap={1}>
      <Typography variant="subtitle1">Applicable Security Rules</Typography>
      <DataList dataList={dataList} />
    </Stack>
  );
};
