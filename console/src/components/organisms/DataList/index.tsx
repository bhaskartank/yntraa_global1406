import { Stack, styled } from "@mui/material";
import { FC } from "react";

import ActionBar from "./ActionBar";
import GridListing from "./GridListing";
import Pagination from "./Pagination";
import TableListing from "./TableListing";
import { DATA_LIST_VARIANT, DataListProps } from "./types";

const DataListContainer = styled(Stack)(() => ({
  minHeight: "0",
  flex: 1,
}));

export const DataList: FC<DataListProps> = (props) => {
  const { dataList } = props;

  return (
    <DataListContainer>
      {!dataList?.hideActionBar && <ActionBar {...props} />}

      {dataList?.variant === DATA_LIST_VARIANT.TABLE && <TableListing {...props} />}
      {dataList?.variant === DATA_LIST_VARIANT.GRID && <GridListing {...props} />}

      {dataList?.variant && dataList?.totalRecords && dataList?.totalRecords > 10 && !dataList?.loading ? <Pagination {...props} /> : null}
    </DataListContainer>
  );
};

export default DataList;
