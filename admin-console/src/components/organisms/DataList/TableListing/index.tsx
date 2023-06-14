import { Table, TableContainer, styled } from "@mui/material";
import { FC } from "react";

import { DataListProps } from "../model";
import Body from "./Body";
import Header from "./Header";

const StyledTableContainer = styled(TableContainer)(() => ({
  "&": { flex: 1 },
}));

const StyledTable = styled(Table)(() => ({
  "&": {
    borderCollapse: "separate",
    borderSpacing: "0",
    border: "0",
  },
}));

export const TableListing: FC<DataListProps> = (props) => {
  return (
    <>
      <StyledTableContainer sx={{ maxHeight: props?.dataList?.maxHeight }}>
        <StyledTable stickyHeader>
          {/* Table Header */}
          <Header {...props} />

          {/* Table Body */}
          {props?.dataList?.data ? <Body {...props} /> : null}
        </StyledTable>
      </StyledTableContainer>
    </>
  );
};

export default TableListing;
