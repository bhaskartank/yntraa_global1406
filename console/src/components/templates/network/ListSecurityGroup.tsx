import { Box } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import DateDisplay from "components/atoms/DateDisplay";
import { GridViewSection, GridViewWrapper } from "components/atoms/GridViewWrapper";
import KeyValuePair from "components/atoms/KeyValuePair";
import ResourceName from "components/atoms/ResourceName";
import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { GridCreatorProps, RowActionProps } from "components/organisms/DataList/types";
import useDataList from "components/organisms/DataList/useDataList";

import { appRoutes } from "utils/constants";

interface ListSecurityGroupProps {
  list: any[];
  totalRecords: number;
  fetchList: (payload: any) => void;
}

const ListSecurityGroup: FC<ListSecurityGroupProps> = ({ list, totalRecords, fetchList }) => {
  const navigate = useNavigate();

  const gridCreator: GridCreatorProps = useCallback(
    (item: any) => ({
      header: <ResourceName label={item?.security_group_name} onClick={() => navigate(appRoutes.SECURITY_GROUP_DETAIL(item?.id, "overview"))} />,
      content: (
        <GridViewWrapper>
          <GridViewSection>
            <KeyValuePair label="Status" value={<StatusChip label={item?.status} />} />
            <KeyValuePair
              label="Managed By"
              value={
                <Box component="span" sx={{ textTransform: "capitalize" }}>
                  {item?.managed_by}
                </Box>
              }
            />
            <KeyValuePair label="Type" value={item?.security_group_type} />
          </GridViewSection>

          <GridViewSection>
            <KeyValuePair label="Created At" value={<DateDisplay datetime={item?.created} />} />
            <KeyValuePair label="Last Update" value={<DateDisplay datetime={item?.updated} />} />
          </GridViewSection>
        </GridViewWrapper>
      ),
    }),
    [navigate],
  );

  const rowActions: RowActionProps[] = useMemo(
    () => [
      {
        label: () => "Security Rules",
        onClick: (item) => navigate(appRoutes.SECURITY_GROUP_DETAIL(item?.id, "overview")),
      },
    ],
    [navigate],
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
    rowActions,
    gridCreator,
    gridViewBreakpoints: { xs: 1, sm: 1, md: 1, lg: 2, xl: 2 },
    createResourceButton: { text: "Create Security Group", onClick: () => navigate(appRoutes.CREATE_SECURITY_GROUP) },
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListSecurityGroup;
