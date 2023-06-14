import { Box } from "@mui/material";
import { FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import DateDisplay from "components/atoms/DateDisplay";
import { GridViewSection, GridViewWrapper } from "components/atoms/GridViewWrapper";
import KeyValuePair from "components/atoms/KeyValuePair";
import ResourceName from "components/atoms/ResourceName";
import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { GridCreatorProps } from "components/organisms/DataList/types";
import useDataList from "components/organisms/DataList/useDataList";

import { appRoutes, pageTitles } from "utils/constants";

interface ListNetworkProps {
  list: any[];
  totalRecords: number;
  fetchList: (payload: any) => void;
}

const ListNetwork: FC<ListNetworkProps> = ({ list, totalRecords, fetchList }) => {
  const navigate = useNavigate();

  const gridCreator: GridCreatorProps = useCallback(
    (item: any) => ({
      header: <ResourceName label={item?.network_name} onClick={() => navigate(appRoutes.NETWORK_DETAIL(item?.id, "subnets"), { state: { network: item } })} />,
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
            <KeyValuePair label="External" value={item?.external ? "Yes" : "No"} />
            <KeyValuePair label="Subnet" value={item?.subnet_network?.map((subnet) => `${subnet?.subnet_name} (${subnet?.network_address})`)?.join(", ")} />
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
    createResourceButton: {
      text: pageTitles.PAGE_TITLE_CREATE_NETWORK,
      onClick: () => navigate(appRoutes.CREATE_NETWORK),
    },
  });

  return <DataList dataList={dataList} />;
};

export default ListNetwork;
