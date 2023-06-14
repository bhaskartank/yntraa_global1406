import { Stack, Typography } from "@mui/material";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";

import DataList from "components/organisms/DataList";
import { ColumnProps, RowActionProps, RowCreatorProps } from "components/organisms/DataList/types";
import useDataList from "components/organisms/DataList/useDataList";

interface NetworkProps {
  data?: any[];
  appliedNetworks: any[];
  unappliedNetworks: any[];
  applyNetwork: (networkId) => any;
  unapplyNetwork: (networkId) => any;
}
export const Network: FC<NetworkProps> = ({ appliedNetworks, unappliedNetworks, applyNetwork, unapplyNetwork }) => {
  const [initialItems, setInitialItems] = useState<any>([]);

  useEffect(() => {
    setInitialItems([...appliedNetworks, ...unappliedNetworks]);
  }, [appliedNetworks, unappliedNetworks]);

  const columns: ColumnProps[] = useMemo(() => {
    return [{ label: "Name" }];
  }, []);

  const rowCreator: RowCreatorProps = useCallback((item: any) => [{ content: item?.network_name || item?.network?.network_name }], []);

  const rowActions: RowActionProps[] = useMemo(
    () => [
      {
        label: (item) =>
          item?.isUnapplied ? "Attach Network" : item?.managed_by === "user" || item?.network?.managed_by === "user" ? "Detach Network" : "Network attached by system",
        onClick: (item) =>
          item?.isUnapplied ? applyNetwork(item?.id) : item?.managed_by === "user" || item?.network?.managed_by === "user" ? unapplyNetwork(item?.network_id) : null,
        disabled: (item) => (item?.isUnapplied ? false : !(item?.managed_by === "user" || item?.network?.managed_by === "user")),
      },
    ],
    [applyNetwork, unapplyNetwork],
  );

  const dataList = useDataList({
    data: initialItems,
    columns,
    rowCreator,
    rowActions,
  });

  return (
    <Stack sx={{ height: "100%" }} gap={1}>
      <Typography variant="subtitle1">Networks</Typography>
      <DataList dataList={dataList} />
    </Stack>
  );
};
