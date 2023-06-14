import { Box, Checkbox, FormControlLabel, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Skeleton, TableBody, TableCell, TableRow } from "@mui/material";
import React, { FC, useState } from "react";
import { BiRightArrowAlt } from "react-icons/bi";
import { BsDashLg } from "react-icons/bs";

import { useDispatch } from "store";

// import modalRedux from "store/modules/modal";
import { EllipsisIcon } from "assets/icons";

import { DATA_LIST_VARIANT, DataListProps } from "../types";

export const Body: FC<DataListProps> = (props) => {
  const { dataList } = props;

  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const handleCloseActionMenu = () => setAnchorEl(null);
  const handleClickActionMenu = (event: React.MouseEvent<HTMLButtonElement>, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
    if (dataList?.onSelectRow) dataList?.onSelectRow(row);
  };

  const getAvailableMenus = (row) => {
    return dataList?.rowActions?.length ? dataList?.rowActions?.filter((menu) => !menu.hidden || !menu.hidden(row)) : [];
  };

  return (
    <TableBody>
      {dataList?.data?.length
        ? dataList?.data?.map((row) => (
            <TableRow key={row?.id}>
              {dataList?.checkbox ? (
                <TableCell sx={{ width: "20px" }}>
                  <FormControlLabel
                    control={<Checkbox size="small" />}
                    value={String(row?.id)}
                    label={""}
                    onChange={dataList?.handleCheckRow}
                    checked={dataList?.checkedRows?.includes(String(row?.id))}
                    sx={{ mx: "auto" }}
                  />
                </TableCell>
              ) : null}

              {dataList
                ?.rowCreator(row)
                ?.filter((_, index) => dataList?.viewColumns?.includes(index))
                .map((item, index) => (
                  <TableCell key={index} align={item?.align || "left"}>
                    {dataList?.loading ? (
                      <Skeleton height="20px" width="100%">
                        <Box sx={{ width: "100%", visibility: "hidden" }}>{item?.content}</Box>
                      </Skeleton>
                    ) : (
                      item?.content || <BsDashLg />
                    )}
                  </TableCell>
                ))}

              {dataList?.rowActions?.length ? (
                <TableCell
                  sx={{
                    position: "sticky",
                    right: -1,
                    px: 1,
                    ...(dataList?.variant === DATA_LIST_VARIANT?.TABLE ? { boxShadow: "-2px 0px 0px rgba(0, 0, 0, 0.1)" } : {}),
                    zIndex: 2,
                    width: `${dataList?.flatActions ? "40px" : "28px"}`,
                    maxWidth: `${dataList?.flatActions ? "40px" : "28px"}`,
                    minWidth: "28px",
                    backgroundColor: "grey.200",
                  }}>
                  <>
                    {getAvailableMenus(row)?.length ? (
                      <IconButton
                        onClick={(e) => handleClickActionMenu(e, row)}
                        color="inherit"
                        sx={{
                          position: "absolute",
                          right: 0,
                          top: 0,
                          height: "100%",
                          borderRadius: 0,
                          backgroundColor: "grey.200",
                          ":hover": { backgroundColor: "grey.200" },
                          px: 0.5,
                          width: "100%",
                        }}
                        disabled={row?.actionDisabled || dataList?.checkedRows?.length}>
                        <EllipsisIcon />
                      </IconButton>
                    ) : null}

                    {selectedRow?.id === row?.id ? (
                      <Menu
                        id="action-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseActionMenu}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        PaperProps={{
                          sx: {
                            boxShadow: "rgba(58, 53, 65, 0.2) 0px 5px 5px -3px, rgba(58, 53, 65, 0.14) 0px 8px 10px 1px, rgba(58, 53, 65, 0.12) 0px 3px 14px 2px",
                          },
                        }}>
                        {getAvailableMenus(row).map((menu, key) => (
                          <MenuItem
                            key={key}
                            disabled={row?.actionDisabled || (!!menu?.disabled && menu?.disabled(row))}
                            onClick={() => {
                              handleCloseActionMenu();

                              // if (menu?.confirmation?.(row)) {
                              //   dispatch(
                              //     modalRedux.actions.open({
                              //       title: menu?.confirmation?.(row)?.title,
                              //       description: menu?.confirmation?.(row)?.description,
                              //       onConfirm: () => menu?.onClick?.(row),
                              //     }),
                              //   );
                              // } else {
                              menu?.onClick?.(row);
                              // }
                            }}>
                            <ListItemIcon
                              sx={{
                                minWidth: "28px !important",
                                color: menu?.color?.(row) || "black",
                                svg: { height: "18px", width: "18px" },
                              }}>
                              {menu?.icon?.(row) || <BiRightArrowAlt />}
                            </ListItemIcon>
                            <ListItemText sx={{ span: { color: menu?.color?.(row) || "black" } }}>{menu?.label?.(row)}</ListItemText>
                          </MenuItem>
                        ))}
                      </Menu>
                    ) : null}
                  </>
                </TableCell>
              ) : null}
            </TableRow>
          ))
        : Array(10)
            .fill(null)
            .map((_, index) => (
              <TableRow key={index}>
                {dataList?.columns
                  ?.filter((_, index) => dataList?.viewColumns?.includes(index))
                  ?.map((_, key) => (
                    <TableCell key={key}>
                      <Skeleton height="20px" width="100%" />
                    </TableCell>
                  ))}
              </TableRow>
            ))}
    </TableBody>
  );
};

export default Body;
