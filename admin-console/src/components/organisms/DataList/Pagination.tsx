import { FormControl, MenuItem, Pagination, Select, Stack, Typography } from "@mui/material";
import { FC } from "react";

import { DataListProps } from "./model";

export const DataListPagination: FC<DataListProps> = (props) => {
  const { dataList } = props;

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} padding="8px 32px" sx={{ color: "common.black", borderTop: "1px solid #e5e8ef" }}>
      {/* <TablePagination
        labelRowsPerPage={"Rows per page"}
        rowsPerPageOptions={[20, 25, 50]}
        count={dataList?.totalRecords}
        rowsPerPage={dataList?.rowsPerPage}
        page={dataList?.page}
        SelectProps={{ inputProps: { "aria-label": "rows per page" }, native: true }}
        onPageChange={dataList?.handleChangePage}
        onRowsPerPageChange={dataList?.onRowsPerPageChange}
        ActionsComponent={ActionsComponent}
        labelDisplayedRows={({ from, to, count }) => `Rows ${from}-${to} of ${count}`}
        sx={{
          borderBottom: 0,
          ".MuiTablePagination-select": {
            backgroundColor: "primary.lightest",
            borderRadius: "4px",
            "&.Mui-focused": { backgroundColor: "primary.lightest" },
          },
          ".MuiIconButton-root": { borderRadius: "4px", p: 0.5, fontSize: "16px" },
        }}
      /> */}

      <Stack direction="row" alignItems="center" spacing={3}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography>Records per page:</Typography>
          <FormControl
            sx={{
              backgroundColor: "primary.light",
              borderRadius: "6px",
              fieldset: { border: 0 },
              ".MuiSelect-icon": { backgroundColor: "transparent", color: "common.black", fontSize: "28px" },
            }}>
            <Select value={dataList?.rowsPerPage} onChange={dataList?.handleRowsPerPageChange} size="small" sx={{ fontSize: "14px", color: "common.black" }}>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Typography>{`Showing ${dataList?.rowsPerPage * dataList?.page + 1} to ${Math.min(dataList?.rowsPerPage * (dataList?.page + 1), dataList?.totalRecords)} of ${
          dataList?.totalRecords
        } record${dataList?.totalRecords > 1 ? "s" : ""}`}</Typography>
      </Stack>

      <Pagination
        count={Math.floor(dataList?.totalRecords / dataList?.rowsPerPage) + 1}
        page={dataList?.page + 1}
        onChange={dataList?.handleChangePage}
        showFirstButton
        showLastButton
      />
    </Stack>
  );
};

export default DataListPagination;
