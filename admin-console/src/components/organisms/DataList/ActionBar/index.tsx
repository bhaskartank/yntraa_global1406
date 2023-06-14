import { Box, Button, Divider, IconButton, InputAdornment, Stack, TextField, Tooltip, Typography } from "@mui/material";
import React, { FC, useState } from "react";
import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import { MdClose, MdEdit, MdOutlineFileDownload, MdOutlineRemoveRedEye } from "react-icons/md";
import { VscFilter, VscFilterFilled } from "react-icons/vsc";

import ExportColumns from "../Popups/ExportColumns";
import Filters from "../Popups/Filters";
import SearchPopup from "../Popups/SearchPopup";
import ViewColumns from "../Popups/ViewColumns";
import { DataListProps } from "../model";

export const enum ANCHOR_TYPE {
  SEARCH = "SEARCH",
  FILTER = "FILTER",
  VIEW_COLUMNS = "VIEW_COLUMNS",
  EXPORT_COLUMNS = "EXPORT_COLUMNS",
}

const ActionBar: FC<DataListProps> = (props) => {
  const { dataList } = props;

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | HTMLDivElement | null>(null);
  const [anchorType, setAnchorType] = useState<ANCHOR_TYPE | null>(null);

  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setAnchorType(null);
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" columnGap={2} padding="8px 32px" sx={{ color: "common.black" }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          {dataList?.filterCount?.categories ? (
            <>
              <Typography>
                <Box component="span" fontWeight="bold">
                  {dataList?.totalRecords}
                </Box>{" "}
                results found with{" "}
                <Box component="span" fontWeight="bold">
                  {dataList?.filterCount?.options}
                </Box>{" "}
                filters in{" "}
                <Box component="span" fontWeight="bold">
                  {dataList?.filterCount?.categories}
                </Box>{" "}
                categories
              </Typography>

              <IconButton
                onClick={(e) => {
                  handleOpenPopover(e);
                  setAnchorType(ANCHOR_TYPE.FILTER);
                }}>
                <Tooltip title="Edit Filter" arrow>
                  <span>
                    <MdEdit />
                  </span>
                </Tooltip>
              </IconButton>

              <IconButton onClick={() => dataList?.handleClearFilter()}>
                <Tooltip title="Clear Filter" arrow>
                  <span>
                    <MdClose />
                  </span>
                </Tooltip>
              </IconButton>
            </>
          ) : null}
        </Stack>

        <Stack direction="row" alignItems="center" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
          {dataList?.searchFields?.length ? (
            <Box
              onClick={(e) => {
                handleOpenPopover(e);
                setAnchorType(ANCHOR_TYPE.SEARCH);
              }}>
              <TextField
                focused
                variant="outlined"
                placeholder={"Search"}
                value={dataList?.search}
                size="small"
                InputProps={{
                  endAdornment: dataList?.search ? (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          dataList?.handleClearSearch();
                        }}
                        sx={{ padding: "0", color: "primary.main" }}>
                        <AiOutlineClose size={20} />
                      </IconButton>
                    </InputAdornment>
                  ) : (
                    <InputAdornment position="start" sx={{ color: "primary.main" }}>
                      <AiOutlineSearch size={20} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  input: { pl: 2, pr: 0, width: "220px", caretColor: "transparent" },
                  ".MuiInputBase-root": { borderRadius: "45px", color: "common.black" },
                  fieldset: { border: 0 },
                }}
                fullWidth
              />
            </Box>
          ) : null}

          {dataList?.filterableColumns?.length ? (
            <Stack direction="row" alignItems="center">
              <Tooltip title="Apply Filter">
                <IconButton
                  onClick={(e) => {
                    handleOpenPopover(e);
                    setAnchorType(ANCHOR_TYPE.FILTER);
                  }}
                  sx={{ padding: "8px", color: "primary.main", backgroundColor: "primary.light" }}>
                  {dataList?.filterCount?.categories ? <VscFilterFilled /> : <VscFilter />}
                </IconButton>
              </Tooltip>
            </Stack>
          ) : null}

          {(dataList?.exportColumns?.length || !dataList?.hideViewColumn) && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography>Columns:</Typography>

              {!dataList.hideViewColumn && (
                <Tooltip title="View Columns">
                  <IconButton
                    onClick={(e) => {
                      handleOpenPopover(e);
                      setAnchorType(ANCHOR_TYPE.VIEW_COLUMNS);
                    }}
                    sx={{ color: "primary.main", backgroundColor: "primary.light" }}>
                    <MdOutlineRemoveRedEye />
                  </IconButton>
                </Tooltip>
              )}
              {dataList?.exportColumns?.length ? (
                <Tooltip title="Export Details">
                  <IconButton
                    onClick={(e) => {
                      handleOpenPopover(e);
                      setAnchorType(ANCHOR_TYPE.EXPORT_COLUMNS);
                    }}
                    sx={{ color: "primary.main", backgroundColor: "primary.light" }}>
                    <MdOutlineFileDownload />
                  </IconButton>
                </Tooltip>
              ) : null}
              {dataList?.createResourceButton ? (
                <Button color="info" variant="contained" onClick={dataList?.createResourceButton?.onClick}>
                  {dataList?.createResourceButton?.text}
                </Button>
              ) : null}
              {dataList?.deleteResourceButton ? (
                <Button
                  color="error"
                  variant="contained"
                  onClick={dataList?.deleteResourceButton?.(dataList?.checkedRows)?.onClick}
                  disabled={dataList?.deleteResourceButton?.(dataList?.checkedRows)?.disabled}>
                  {dataList?.deleteResourceButton?.(dataList?.checkedRows)?.text}
                </Button>
              ) : null}
              {dataList?.extraActions || null}
            </Stack>
          )}
        </Stack>
      </Stack>

      {anchorType === ANCHOR_TYPE.SEARCH ? <SearchPopup dataList={dataList} anchorEl={anchorEl} handleClose={handleClosePopover} /> : null}
      {anchorType === ANCHOR_TYPE.FILTER ? <Filters dataList={dataList} anchorEl={anchorEl} handleClose={handleClosePopover} /> : null}
      {anchorType === ANCHOR_TYPE.VIEW_COLUMNS ? <ViewColumns dataList={dataList} anchorEl={anchorEl} handleClose={handleClosePopover} /> : null}
      {anchorType === ANCHOR_TYPE.EXPORT_COLUMNS ? <ExportColumns dataList={dataList} anchorEl={anchorEl} handleClose={handleClosePopover} /> : null}
    </>
  );
};

export default ActionBar;
