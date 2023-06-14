import find from "lodash/find";
import { FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import DateDisplay from "components/atoms/DateDisplay";
import { GridViewSection, GridViewWrapper } from "components/atoms/GridViewWrapper";
import KeyValuePair from "components/atoms/KeyValuePair";
import ResourceName from "components/atoms/ResourceName";
import StatusChip from "components/atoms/StatusChip";
import TagList from "components/atoms/TagList";
import DataList from "components/organisms/DataList";
import { GridCreatorProps } from "components/organisms/DataList/types";
import useDataList from "components/organisms/DataList/useDataList";

import { appRoutes } from "utils/constants";

interface ListProjectProps {
  list: any[];
  fetchList: (payload: any) => void;
  userRoles: any[];
}

const ListProject: FC<ListProjectProps> = ({ list, fetchList, userRoles }) => {
  const navigate = useNavigate();

  const getRoleDetail = useCallback(
    (projectId) => {
      if (!projectId) return;

      const selectedRole = find(userRoles, { project_id: projectId });

      if (!selectedRole) return "";
      return selectedRole?.role_permission_group?.group_name?.replace("_", " ");
    },
    [userRoles],
  );

  const gridCreator: GridCreatorProps = useCallback(
    (item: any) => ({
      header: <ResourceName label={item?.name} />,
      content: (
        <GridViewWrapper>
          <GridViewSection>
            <KeyValuePair label="Status" value={item?.status ? <StatusChip label={item?.status} /> : null} />
            <KeyValuePair label="State" value={item?.action ? <StatusChip label={item?.action} /> : null} />
            <KeyValuePair label="Description" value={item?.description} />
          </GridViewSection>

          <GridViewSection>
            <KeyValuePair label="Role" value={getRoleDetail(item?.id)} />
            <KeyValuePair
              label="Data Centre Zone"
              value={
                <TagList
                  tags={item?.project_provider_mapping_project?.map(
                    (providerMapping) => `${providerMapping?.provider?.provider_name} (${providerMapping?.provider?.provider_location})`,
                  )}
                />
              }
            />
          </GridViewSection>

          <GridViewSection>
            <KeyValuePair label="Created At" value={<DateDisplay datetime={item?.created} />} />
            <KeyValuePair label="Last Update" value={<DateDisplay datetime={item?.updated} />} />
          </GridViewSection>
        </GridViewWrapper>
      ),
    }),
    [getRoleDetail],
  );

  const reload = useCallback(
    ({ page, size }) => {
      fetchList({ offset: page * size, limit: size });
    },
    [fetchList],
  );

  const dataList = useDataList({
    data: list,
    gridCreator,
    gridViewBreakpoints: { xs: 1, sm: 1, md: 1, lg: 1, xl: 2 },
    createResourceButton: { text: "Create Project", onClick: () => navigate(appRoutes.CREATE_PROJECT) },
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListProject;
