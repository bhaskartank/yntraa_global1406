import { Checkbox, Stack, Typography } from "@mui/material";
import React, { FC, useCallback, useMemo } from "react";

import DataList from "components/organisms/DataList";
import { ColumnProps, RowActionProps, RowCreatorProps } from "components/organisms/DataList/types";
import useDataList from "components/organisms/DataList/useDataList";

interface VolumeSnapshotsProps {
  data: any[];
  isDeleteActive: any;
  selectedVolumeSnapshots: any;
  handleSelectVolumeSnapshot: (item: any) => void;
}
export const VolumeSnapshots: FC<VolumeSnapshotsProps> = ({ data, isDeleteActive, selectedVolumeSnapshots, handleSelectVolumeSnapshot }) => {
  const columns: ColumnProps[] = useMemo(() => {
    return [{ label: "Name" }, { label: "Status" }, { label: "zxc" }];
  }, []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.snapshot_name },
      { content: item?.status },
      {
        content: (
          <Checkbox
            disabled={!isDeleteActive}
            checked={!!selectedVolumeSnapshots?.find((snapshot) => snapshot?.id === item?.id)}
            onClick={() => handleSelectVolumeSnapshot(item)}
          />
        ),
      },
    ],
    [],
  );

  const rowActions: RowActionProps[] = useMemo(
    () => [
      {
        label: () => "Delete",
        onClick: (item) => handleSelectVolumeSnapshot(item),
        disabled: () => !isDeleteActive,
      },
    ],
    [handleSelectVolumeSnapshot, isDeleteActive],
  );

  const dataList = useDataList({
    data,
    columns,
    rowCreator,
    rowActions,
  });

  return (
    <Stack sx={{ height: "100%" }} gap={1}>
      <Typography variant="subtitle1">Volume Snapshots</Typography>
      <DataList dataList={dataList} />
    </Stack>
  );
};
