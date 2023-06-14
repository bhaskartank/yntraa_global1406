import { FC, useCallback } from "react";

import DateDisplay from "components/atoms/DateDisplay";
import { GridViewSection, GridViewWrapper } from "components/atoms/GridViewWrapper";
import KeyValuePair from "components/atoms/KeyValuePair";
import ResourceName from "components/atoms/ResourceName";
import TagList from "components/atoms/TagList";
import DataList from "components/organisms/DataList";
import { GridCreatorProps } from "components/organisms/DataList/types";
import useDataList from "components/organisms/DataList/useDataList";

interface ListUserProps {
  list: any[];
  totalRecords: number;
  fetchList: (payload: any) => void;
}

const ListUser: FC<ListUserProps> = ({ list, totalRecords, fetchList }) => {
  const gridCreator: GridCreatorProps = useCallback(
    (item: any) => ({
      header: <ResourceName label={`${item?.first_name} ${item?.middle_name} ${item?.last_name}`} />,
      content: (
        <GridViewWrapper>
          <GridViewSection>
            <KeyValuePair label="User Type" value={item?.is_admin ? "Admin" : "Regular"} />
            <KeyValuePair label="Username" value={item?.username} />
            <KeyValuePair
              label="Projects"
              value={item?.organisation_project_user_user?.length ? <TagList tags={item?.organisation_project_user_user?.map((project) => project?.project?.name)} /> : null}
            />
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

export default ListUser;
