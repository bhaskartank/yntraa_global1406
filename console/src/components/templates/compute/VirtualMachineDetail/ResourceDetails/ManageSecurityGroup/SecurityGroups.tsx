import { Stack, Typography } from "@mui/material";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";

import DataList from "components/organisms/DataList";
import { ColumnProps, RowActionProps, RowCreatorProps } from "components/organisms/DataList/types";
import useDataList from "components/organisms/DataList/useDataList";

interface SecurityGroupsProps {
  data?: any[];
  appliedSecurityGroups: any[];
  unappliedSecurityGroups: any[];
  applySecurityGroup: (networkId) => any;
  removeSecurityGroup: (networkId) => any;
}
export const SecurityGroups: FC<SecurityGroupsProps> = ({ appliedSecurityGroups, unappliedSecurityGroups, applySecurityGroup, removeSecurityGroup }) => {
  const [initialItems, setInitialItems] = useState<any>([]);

  useEffect(() => {
    setInitialItems([...appliedSecurityGroups, ...unappliedSecurityGroups]);
  }, [appliedSecurityGroups, unappliedSecurityGroups]);

  const columns: ColumnProps[] = useMemo(() => {
    return [{ label: "Name" }];
  }, []);

  const rowCreator: RowCreatorProps = useCallback((item: any) => [{ content: item?.security_group_name }], []);

  const rowActions: RowActionProps[] = useMemo(
    () => [
      {
        label: (item) => (item?.isUnapplied ? "Attach Security Group" : item?.managed_by === "user" ? "Detach Security Group" : "Security Group attached by system"),
        onClick: (item) => (item?.isUnapplied ? applySecurityGroup(item?.id) : item?.managed_by === "user" ? removeSecurityGroup(item?.id) : null),
        disabled: (item) => (item?.isUnapplied ? false : !(item?.managed_by === "user")),
      },
    ],
    [applySecurityGroup, removeSecurityGroup],
  );

  const dataList = useDataList({
    data: initialItems,
    columns,
    rowCreator,
    rowActions,
  });

  return (
    <Stack sx={{ height: "100%" }} gap={1}>
      <Typography variant="subtitle1">Security Groups</Typography>
      <DataList dataList={dataList} />
    </Stack>
  );
};
