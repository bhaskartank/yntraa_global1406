import { Divider, Stack } from "@mui/material";
import { FC, useCallback } from "react";

import DateDisplay from "components/atoms/DateDisplay";
import { GridViewSection, GridViewWrapper } from "components/atoms/GridViewWrapper";
import KeyValuePair from "components/atoms/KeyValuePair";
import ResourceName from "components/atoms/ResourceName";
import StatusChip from "components/atoms/StatusChip";
import UnitFilter from "components/atoms/UnitFilter";
import DataList from "components/organisms/DataList";
import { GridCreatorProps } from "components/organisms/DataList/types";
import useDataList from "components/organisms/DataList/useDataList";

interface ListVolumeSnapshotProps {
  list: any[];
  totalRecords: number;
  fetchList: (payload: any) => void;
}

const ListVolumeSnapshot: FC<ListVolumeSnapshotProps> = ({ list, totalRecords, fetchList }) => {
  const gridCreator: GridCreatorProps = useCallback(
    (item: any) => ({
      header: (
        <Stack gap="4px">
          <ResourceName label={item?.snapshot_name} />
          <Stack direction="row" alignItems="center" spacing={1} divider={<Divider flexItem orientation="vertical" />}>
            <UnitFilter size={item?.volume?.volume_size} unit="GiB" flavorType="disk" />
          </Stack>
        </Stack>
      ),
      content: (
        <GridViewWrapper>
          <GridViewSection>
            <KeyValuePair label="Status" value={<StatusChip label={item?.status} />} />
            <KeyValuePair label="Volume Name" value={item?.volume?.volume_name} />
            <KeyValuePair label="Volume Status" value={item?.compute_snapshot?.action ? <StatusChip label={item?.compute_snapshot?.action} /> : null} />
          </GridViewSection>

          <GridViewSection>
            <KeyValuePair label="Created At" value={<DateDisplay datetime={item?.created} />} />
            <KeyValuePair label="Last Update" value={<DateDisplay datetime={item?.updated} />} />
          </GridViewSection>
        </GridViewWrapper>
      ),
    }),
    [],
  );

  const reload = useCallback(
    ({ page, size }) => {
      fetchList({ offset: page * size, limit: size });
    },
    [fetchList],
  );

  const dataList = useDataList({
    data: list,
    totalRecords,
    gridCreator,
    gridViewBreakpoints: { xs: 1, sm: 1, md: 1, lg: 2, xl: 2 },
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListVolumeSnapshot;
