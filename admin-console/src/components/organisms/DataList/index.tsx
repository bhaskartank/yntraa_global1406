import { Stack, styled } from "@mui/material";
import { FC } from "react";

import ActionBar from "./ActionBar";
import Pagination from "./Pagination";
import TableListing from "./TableListing";
import { DataListProps } from "./model";

const DataListContainer = styled(Stack)(() => ({
  "&": { minHeight: "0", flex: 1 },
}));

export const DataList: FC<DataListProps> = (props) => {
  const { hideActionBar = true } = props;
  return (
    <DataListContainer>
      {hideActionBar && <ActionBar {...props} />}

      <TableListing {...props} />

      {props?.dataList?.totalRecords ? <Pagination {...props} /> : null}
    </DataListContainer>
  );
};

export default DataList;
