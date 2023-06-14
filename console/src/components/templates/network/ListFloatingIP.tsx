import { FC, useCallback } from "react";

import DateDisplay from "components/atoms/DateDisplay";
import { GridViewSection, GridViewWrapper } from "components/atoms/GridViewWrapper";
import KeyValuePair from "components/atoms/KeyValuePair";
import ResourceName from "components/atoms/ResourceName";
import TagList from "components/atoms/TagList";
import DataList from "components/organisms/DataList";
import { GridCreatorProps } from "components/organisms/DataList/types";
import useDataList from "components/organisms/DataList/useDataList";

interface ListFloatingIPProps {
  list: any[];
  totalRecords: number;
  fetchList: (payload: any) => void;
}

const ListFloatingIP: FC<ListFloatingIPProps> = ({ list, totalRecords, fetchList }) => {
  const gridCreator: GridCreatorProps = useCallback(
    (item: any) => ({
      header: <ResourceName label={item?.floating_ip}/>,
      content: (
        <GridViewWrapper>
          <GridViewSection>
            <KeyValuePair label="Available" value={item?.is_available ? "Yes" : "No"} />
            <KeyValuePair label="Attached With" value={item?.attached_with_resource} />
            <KeyValuePair label="IP Source" value={item?.ip_source} />
          </GridViewSection>

          <GridViewSection>
            <KeyValuePair label="Created At" value={<DateDisplay datetime={item?.created} />} />
            <KeyValuePair label="Last Update" value={<DateDisplay datetime={item?.updated} />} />
            {/* <KeyValuePair label="Attached On" value={<DateDisplay datetime={item?.attached_on} />} /> */}
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

export default ListFloatingIP;
