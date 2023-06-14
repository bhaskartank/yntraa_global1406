import { Box, Checkbox, FormControlLabel, TableCell, TableHead, TableRow, TableSortLabel, Tooltip } from "@mui/material";
import { FC } from "react";

import SortingIcon from "components/atoms/SortingIcon";

import { DATA_LIST_VARIANT, DataListProps } from "../types";

export const Header: FC<DataListProps> = (props) => {
  const { dataList } = props;

  const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
    dataList?.handleRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {dataList?.checkbox && dataList?.data?.length ? (
          <TableCell sx={{ width: "20px" }}>
            {dataList?.multicheck ? (
              <FormControlLabel
                label=""
                control={<Checkbox size="small" indeterminate={dataList?.isIndeterminate} />}
                onChange={dataList?.isIndeterminate || dataList?.isDeterminate ? dataList?.handleClearAllCheckedRows : dataList?.handleCheckAllRows}
                checked={dataList?.isDeterminate}
                sx={{ mx: "auto" }}
              />
            ) : null}
          </TableCell>
        ) : null}

        {dataList?.columns
          ?.filter((_, index) => dataList?.viewColumns?.includes(index))
          ?.map((headCell, key) => (
            <TableCell key={key} align={headCell?.align || "inherit"}>
              {headCell?.sortKey ? (
                <Tooltip title={`Click to sort ${dataList?.orderBy === headCell?.sortKey && dataList?.order === "asc" ? "descending" : "ascending"}`} placement="top" arrow>
                  <TableSortLabel
                    active={dataList?.orderBy === headCell?.sortKey}
                    direction={dataList?.orderBy === headCell?.sortKey ? dataList?.order : "asc"}
                    onClick={createSortHandler(headCell?.sortKey)}
                    IconComponent={null}
                    sx={{ display: "inline-block", width: "100%", ":hover": { color: "inherit" } }}>
                    <Box component="span" mr={1}>
                      {headCell?.label}
                    </Box>

                    <SortingIcon isAsc={headCell?.sortKey === dataList?.orderBy ? dataList?.order === "asc" : null} />
                  </TableSortLabel>
                </Tooltip>
              ) : (
                <Box display="inline-block" pt="4px">
                  {headCell?.label}
                </Box>
              )}
            </TableCell>
          ))}

        {dataList?.rowActions?.length && dataList?.data?.length ? (
          <TableCell
            sx={{
              position: "sticky",
              right: 0,
              zIndex: 3,
              px: 1,
              ...(dataList?.variant === DATA_LIST_VARIANT?.TABLE ? { boxShadow: "-2px 0px 0px rgba(0, 0, 0, 0.1)" } : {}),
            }}
          />
        ) : null}
      </TableRow>
    </TableHead>
  );
};

export default Header;
