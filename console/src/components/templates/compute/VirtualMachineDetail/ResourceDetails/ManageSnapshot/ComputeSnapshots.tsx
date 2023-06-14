import { Stack, Typography } from "@mui/material";
import React, { FC, useCallback, useMemo } from "react";

import DataList from "components/organisms/DataList";
import { ColumnProps, RowActionProps, RowCreatorProps } from "components/organisms/DataList/types";
import useDataList from "components/organisms/DataList/useDataList";

interface ComputeSnapshotsProps {
  data: any[];
  selectedComputeSnapshot: any;
  setIsDeleteActive: any;
  handleSelectComputeSnapshot: (item: any) => void;
}
export const ComputeSnapshots: FC<ComputeSnapshotsProps> = ({ data, selectedComputeSnapshot, setIsDeleteActive, handleSelectComputeSnapshot }) => {
  const columns: ColumnProps[] = useMemo(() => {
    return [{ label: "Name" }, { label: "Action" }];
  }, []);

  const rowCreator: RowCreatorProps = useCallback((item: any) => [{ content: item?.snapshot_name }, { content: item?.action }], []);

  const rowActions: RowActionProps[] = useMemo(
    () => [
      {
        label: () => (selectedComputeSnapshot ? "Hide Details" : "View Details"),
        // onClick: (item) => {
        //   handleSelectComputeSnapshot(item);
        // },
        onClick: (item) => {
          if (selectedComputeSnapshot) {
            handleSelectComputeSnapshot(null);
          } else {
            handleSelectComputeSnapshot(item);
          }
          setIsDeleteActive(false);
        },
        // disabled: (item) => !!(!item?.volume_snapshot_compute_snapshot?.length || item?.action.toLowerCase() === "deleting" || item?.action.toLowerCase() === "processing"),
      },
    ],
    [handleSelectComputeSnapshot, selectedComputeSnapshot, setIsDeleteActive],
  );

  const dataList = useDataList({
    data,
    columns,
    rowCreator,
    // rowActions,
  });

  return (
    <Stack sx={{ height: "100%" }} gap={1}>
      <Typography variant="subtitle1">Compute Snapshots</Typography>
      <DataList dataList={dataList} />
    </Stack>
  );
};
