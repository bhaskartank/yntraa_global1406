import { FC, useCallback } from "react";

import DateDisplay from "components/atoms/DateDisplay";
import { GridViewSection, GridViewWrapper } from "components/atoms/GridViewWrapper";
import KeyValuePair from "components/atoms/KeyValuePair";
import ResourceName from "components/atoms/ResourceName";
import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { GridCreatorProps } from "components/organisms/DataList/types";
import useDataList from "components/organisms/DataList/useDataList";

interface ListComputeSnapshotProps {
  list: any[];
  totalRecords: number;
  fetchList: (payload: any) => void;
}

const ListComputeSnapshot: FC<ListComputeSnapshotProps> = ({ list, totalRecords, fetchList }) => {
  const getStatus = (status, taskId) => {
    return !taskId ? <StatusChip label={status} /> : null;
  };

  const getState = (action, taskId) => {
    let status: { label: string } = { label: action };

    if (taskId || action?.toLowerCase() === "processing") {
      status = { label: "Processing" };
    } else {
      status = { label: action };
    }

    return <StatusChip label={status.label} />;
  };

  const gridCreator: GridCreatorProps = useCallback(
    (item: any) => ({
      header: <ResourceName label={item?.snapshot_name} />,
      content: (
        <GridViewWrapper>
          <GridViewSection>
            <KeyValuePair label="Status" value={getStatus(item?.status, item.task_id)} />
            <KeyValuePair label="State" value={getState(item?.action, item.task_id)} />
            <KeyValuePair label="Instance Name" value={item?.compute?.instance_name} />
            <KeyValuePair label="Image" value={item?.is_image ? "Yes" : "No"} />
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

export default ListComputeSnapshot;
