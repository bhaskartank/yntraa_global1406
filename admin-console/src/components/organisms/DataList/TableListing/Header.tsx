import { Box, Checkbox, FormControlLabel, FormGroup, IconButton, Stack, TableCell, TableHead, TableRow, TableSortLabel, Tooltip } from "@mui/material";
import { FC, useState } from "react";
import { RiFilterFill, RiFilterLine } from "react-icons/ri";

import SortingIcon from "components/atoms/SortingIcon";

import ColumnFilter from "../Popups/ColumnFilter";
import DateColumnFilter from "../Popups/DateColumnFilter";
import { DATA_LIST_VARIANT, DataListProps } from "../model";

export const enum ANCHOR_TYPE {
  FILTER = "FILTER",
  DATE_FILTER = "DATE_FILTER",
}

export const Header: FC<DataListProps> = (props) => {
  const { dataList } = props;

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | HTMLDivElement | null>(null);
  const [anchorType, setAnchorType] = useState<ANCHOR_TYPE | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<any | null>(null);

  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setAnchorType(null);
  };

  const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
    dataList?.handleRequestSort(event, property);
  };

  return (
    <>
      <TableHead>
        <TableRow>
          {dataList?.checkbox ? (
            <TableCell>
              <FormGroup sx={{ minWidth: "24px", maxWidth: "24px" }}>
                <FormControlLabel
                  label=""
                  control={<Checkbox size="small" indeterminate={dataList?.isIndeterminate} sx={{ svg: { backgroundColor: "common.white" } }} />}
                  onChange={dataList?.isIndeterminate || dataList?.isDeterminate ? dataList?.handleClearAllCheckedRows : dataList?.handleCheckAllRows}
                  checked={dataList?.isDeterminate}
                />
              </FormGroup>
            </TableCell>
          ) : null}

          <TableCell sx={{ minWidth: "28px" }}>
            <Stack
              sx={{
                ...(dataList?.variant === DATA_LIST_VARIANT?.EVENT_LOG ? { mx: "16px" } : { pl: 1 }),
              }}>
              #
            </Stack>
          </TableCell>

          {dataList?.columns
            ?.filter((column, index) => dataList?.viewColumns?.includes(index))
            ?.map((headCell, key) => (
              <TableCell key={key} align={headCell?.align || "inherit"} sortDirection={dataList?.orderBy === headCell?.sortKey ? dataList?.order : false}>
                {headCell?.sortKey ? (
                  <Tooltip title={`Click to sort ${dataList?.orderBy === headCell?.sortKey && dataList?.order === "asc" ? "descending" : "ascending"}`} placement="top" arrow>
                    <TableSortLabel
                      active={dataList?.orderBy === headCell?.sortKey}
                      direction={dataList?.orderBy === headCell?.sortKey ? dataList?.order : "asc"}
                      onClick={createSortHandler(headCell?.sortKey)}
                      IconComponent={null}
                      sx={{ display: "inline-block", width: "100%" }}>
                      <Box component="span" pr="4px">
                        {headCell?.label}
                      </Box>

                      <SortingIcon isAsc={headCell?.sortKey === dataList?.orderBy ? dataList?.order === "asc" : null} />

                      {headCell?.filterKey ? (
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenPopover(e);
                            setSelectedColumn(headCell);
                            headCell?.dateFilter ? setAnchorType(ANCHOR_TYPE.DATE_FILTER) : setAnchorType(ANCHOR_TYPE.FILTER);
                          }}
                          sx={{ py: 0, fontSize: "16px", color: "common.white" }}>
                          {Object.keys(dataList?.filters)?.includes(headCell?.filterKey) ? <RiFilterFill /> : <RiFilterLine />}
                        </IconButton>
                      ) : null}
                    </TableSortLabel>
                  </Tooltip>
                ) : (
                  <>
                    <Box component="span" pr="4px">
                      {headCell?.label}
                    </Box>

                    {headCell?.filterKey ? (
                      <IconButton
                        onClick={(e) => {
                          handleOpenPopover(e);
                          setSelectedColumn(headCell);
                          setAnchorType(ANCHOR_TYPE.FILTER);
                        }}
                        sx={{ py: 0, pl: "4px", fontSize: "16px", mt: "-4px", color: "common.white" }}>
                        {Object.keys(dataList?.filters)?.includes(headCell?.filterKey) ? <RiFilterFill /> : <RiFilterLine />}
                      </IconButton>
                    ) : null}
                  </>
                )}
              </TableCell>
            ))}

          {dataList?.actions?.length ? (
            <TableCell
              sx={{
                position: "sticky",
                right: 0,
                ...(dataList?.variant === DATA_LIST_VARIANT?.TABLE ? { boxShadow: "-6px 0px 4px 0 rgb(0 0 0 / 20%)" } : {}),
                zIndex: 3,
              }}
            />
          ) : null}
        </TableRow>
      </TableHead>

      {anchorType === ANCHOR_TYPE.FILTER ? (
        <ColumnFilter
          dataList={dataList}
          anchorEl={anchorEl}
          handleClose={handleClosePopover}
          selectedColumnKey={selectedColumn?.filterKey}
          selectedColumnLabel={selectedColumn?.label}
        />
      ) : null}

      {anchorType === ANCHOR_TYPE.DATE_FILTER ? (
        <DateColumnFilter
          dataList={dataList}
          anchorEl={anchorEl}
          handleClose={handleClosePopover}
          selectedColumnKey={selectedColumn?.filterKey}
          selectedColumnLabel={selectedColumn?.label}
        />
      ) : null}
    </>
  );
};

export default Header;
