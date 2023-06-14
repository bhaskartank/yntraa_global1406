import { FC, useCallback } from "react";

import DateDisplay from "components/atoms/DateDisplay";
import { GridViewSection, GridViewWrapper } from "components/atoms/GridViewWrapper";
import KeyValuePair from "components/atoms/KeyValuePair";
import ResourceName from "components/atoms/ResourceName";
import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { GridCreatorProps } from "components/organisms/DataList/types";
import useDataList from "components/organisms/DataList/useDataList";

interface ListLogProps {
  list: any[];
  totalRecords: number;
  fetchList: (payload: any) => void;
}

const ListLog: FC<ListLogProps> = ({ list, totalRecords, fetchList }) => {
  const gridCreator: GridCreatorProps = useCallback(
    (item: any) => ({
      header: <ResourceName label={item?.action} />,
      content: (
        <GridViewWrapper>
          <GridViewSection>
            <KeyValuePair label="Status" value={item?.status ? <StatusChip label={item?.status} /> : null} />
            <KeyValuePair label="Action Method" value={item?.action_method} />
            <KeyValuePair label="Action URL" value={item?.action_url} />
          </GridViewSection>

          <GridViewSection>
            <KeyValuePair label="Resource Name" value={item?.resource_name} />
            <KeyValuePair label="Resource Type" value={item?.resource_type} />
            <KeyValuePair label="Description" value={item?.error_message} />
          </GridViewSection>

          <GridViewSection>
            <KeyValuePair label="User" value={item?.user_name} />
            <KeyValuePair label="Action Time" value={<DateDisplay datetime={item?.created} />} />
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
    gridViewBreakpoints: { xs: 1, sm: 1, md: 1, lg: 1, xl: 2 },
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListLog;
