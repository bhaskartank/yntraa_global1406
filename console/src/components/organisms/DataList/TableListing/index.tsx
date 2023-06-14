import { Stack, Table, TableContainer } from "@mui/material";
import { FC, useMemo } from "react";

import EmptyData from "components/atoms/EmptyData";

import { DataListProps } from "../types";
import Body from "./Body";
import Header from "./Header";

export const TableListing: FC<DataListProps> = (props) => {
  const { dataList } = props;

  const isEmptyList = useMemo(() => !dataList?.data?.length, [dataList]);
  const isListLoading = useMemo(() => dataList?.loading, [dataList]);

  return (
    <>
      <TableContainer sx={{ maxHeight: dataList?.maxHeight, flex: isEmptyList ? "none" : 1 }}>
        <Table stickyHeader>
          <Header {...props} />

          {!isEmptyList || isListLoading ? <Body {...props} /> : null}
        </Table>
      </TableContainer>

      {isEmptyList && !isListLoading ? (
        <Stack justifyContent="center" alignItems="center" flex={1}>
          <EmptyData text={dataList?.emptyDataText} />
        </Stack>
      ) : null}
    </>
  );
};

export default TableListing;
