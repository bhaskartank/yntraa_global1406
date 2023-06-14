import { Box, Button, IconButton, InputAdornment, Stack, TextField, Tooltip } from "@mui/material";
import useSearch from "hooks/useSearch";
import React, { FC, useEffect } from "react";

import { GridViewIcon, PlusIcon, SearchIcon, TableViewIcon } from "assets/icons";

import { DATA_LIST_VARIANT, DataListProps } from "../types";

const ActionBar: FC<DataListProps> = (props) => {
  const { dataList } = props;

  const { localSearchTerm, handleSearch } = useSearch();

  useEffect(() => {
    dataList?.handleSearch(localSearchTerm);
  }, [localSearchTerm]);

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} sx={{ color: "text.gray" }}>
        <Box>
          {dataList?.searchBar ? (
            <TextField
              variant="outlined"
              placeholder={dataList?.searchBar?.placeholder || "Search"}
              onChange={handleSearch}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: "grey.700" }}>
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                input: { pl: 1, pr: 0, width: "300px" },
                ".MuiInputBase-root": {
                  py: "1px",
                  border: "1px solid",
                  borderColor: "grey.500",
                  borderRadius: "4px",
                  backgroundColor: "grey.200",
                  color: "text.black",
                },
                fieldset: { border: "1px solid", borderColor: "grey.500" },
              }}
            />
          ) : null}
        </Box>

        <Stack direction="row" alignItems="center" spacing={"12px"}>
          {dataList?.rowCreator && dataList?.gridCreator ? (
            dataList?.variant === DATA_LIST_VARIANT.TABLE ? (
              <Tooltip title="Switch to Grid View">
                <IconButton
                  onClick={() => dataList?.handleChangeVariant(DATA_LIST_VARIANT.GRID)}
                  sx={{ border: "1px solid", borderColor: "primary.main", ":hover": { background: "transparent" } }}>
                  <GridViewIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Switch to Table View">
                <IconButton
                  onClick={() => dataList?.handleChangeVariant(DATA_LIST_VARIANT.TABLE)}
                  sx={{ border: "1px solid", borderColor: "primary.main", ":hover": { background: "transparent" } }}>
                  <TableViewIcon />
                </IconButton>
              </Tooltip>
            )
          ) : null}
          {dataList?.createResourceButton ? (
            <Button variant="contained" size="medium" onClick={dataList?.createResourceButton?.onClick} startIcon={<PlusIcon />}>
              {dataList?.createResourceButton?.text}
            </Button>
          ) : null}
          {dataList?.extraActions || null}
        </Stack>
      </Stack>
    </>
  );
};

export default ActionBar;
