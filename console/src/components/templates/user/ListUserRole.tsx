import { FC, useCallback } from "react";

import { GridViewSection, GridViewWrapper } from "components/atoms/GridViewWrapper";
import KeyValuePair from "components/atoms/KeyValuePair";
import ResourceName from "components/atoms/ResourceName";
import TagList from "components/atoms/TagList";
import DataList from "components/organisms/DataList";
import { GridCreatorProps } from "components/organisms/DataList/types";
import useDataList from "components/organisms/DataList/useDataList";

interface ListUserRoleProps {
  list: any[];
  totalRecords: number;
  fetchList: (payload: any) => void;
}

const ListUserRole: FC<ListUserRoleProps> = ({ list, totalRecords, fetchList }) => {
  const gridCreator: GridCreatorProps = useCallback(
    (item: any) => ({
      header: <ResourceName label={item?.group_name} />,
      content: (
        <GridViewWrapper>
          <GridViewSection>
            <KeyValuePair label="Description" value={item?.group_description} />
            <KeyValuePair label="Scope" value={<TagList tags={item?.scope?.map((scope) => scope)} max={100} />} />
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

export default ListUserRole;
