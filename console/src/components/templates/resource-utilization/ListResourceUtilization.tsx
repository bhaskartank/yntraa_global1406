import { Box, Stack, Tooltip, Typography } from "@mui/material";
import { FC, useCallback } from "react";

import { GridViewSection, GridViewWrapper } from "components/atoms/GridViewWrapper";
import KeyValuePair from "components/atoms/KeyValuePair";
import ResourceName from "components/atoms/ResourceName";
import DataList from "components/organisms/DataList";
import { GridCreatorProps } from "components/organisms/DataList/types";
import useDataList from "components/organisms/DataList/useDataList";

interface ListResourceUtilizationProps {
  list: any[];
  fetchList: (payload: any) => void;
}

const ListResourceUtilization: FC<ListResourceUtilizationProps> = ({ list, fetchList }) => {
  const gridCreator: GridCreatorProps = useCallback(
    (item: any) => ({
      header: <ResourceName label={item[1]?.name} />,
      content: (
        <GridViewWrapper>
          <GridViewSection>
            <KeyValuePair
              label="Allocated"
              value={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle2">{item[1]?.allocated?.value}</Typography>
                  {/* <Chip label={item[1]?.allocated?.value} color="info" size="small" /> */}{" "}
                  {item[1]?.allocated?.quotapackage_breakup && item[1]?.allocated?.quotapackage_breakup[1] ? (
                    <>
                      <Tooltip title="Base" placement="top">
                        <Box component="span" sx={{ color: "primary.main" }}>
                          ({item[1]?.allocated?.quotapackage_breakup[0]?.base?.value}
                        </Box>
                      </Tooltip>{" "}
                      <Box component="span" sx={{ color: "primary.main" }}>
                        +
                      </Box>{" "}
                      <Tooltip title="Topup" placement="top">
                        <Box component="span" sx={{ color: "primary.main" }}>
                          {item[1]?.allocated?.quotapackage_breakup[1]?.topup?.value})
                        </Box>
                      </Tooltip>
                    </>
                  ) : null}
                </Stack>
              }
            />
            <KeyValuePair label="Consumed" value={item[1]?.consumed?.value} />
            <KeyValuePair label="Available" value={item[1]?.available?.value} />
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
    gridCreator,
    gridViewBreakpoints: { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 },
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListResourceUtilization;
