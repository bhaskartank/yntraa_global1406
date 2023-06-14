import { Box, styled } from "@mui/material";
import { FC, useMemo } from "react";

import EmptyData from "components/atoms/EmptyData";

import { DataListProps } from "../types";
import Body from "./Body";

const StyledGridListContainer = styled(Box)(() => ({
  flex: 1,
  padding: "0",
  overflowY: "auto",
}));

export const GridListing: FC<DataListProps> = (props) => {
  const { dataList } = props;

  const isEmptyList = useMemo(() => !dataList?.data?.length, [dataList]);
  const isListLoading = useMemo(() => dataList?.loading, [dataList]);

  return (
    <StyledGridListContainer>
      {!isEmptyList || isListLoading ? <Body dataList={dataList} /> : null}

      {isEmptyList && !isListLoading ? (
        <Box mt={2}>
          <EmptyData text={dataList?.emptyDataText} />
        </Box>
      ) : null}
    </StyledGridListContainer>
  );
};

export default GridListing;
