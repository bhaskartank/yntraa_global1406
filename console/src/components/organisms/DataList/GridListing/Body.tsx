import { Box, Card, CardContent, Checkbox, Divider, FormControlLabel, Grid, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Skeleton, Stack } from "@mui/material";
import { FC, useState } from "react";
import { BiRightArrowAlt } from "react-icons/bi";

import { useDispatch } from "store";
import modalRedux from "store/modules/modal";

// import modalRedux from "store/modules/modal";
import GridListLoader from "components/atoms/loaders/GridListLoader";

import { EllipsisIcon } from "assets/icons";

import { DataListProps } from "../types";

const Body: FC<DataListProps> = (props) => {
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
    <Grid container columnSpacing={2} rowGap={2} mt={2} pb={2} sx={{ maxHeight: "auto", gridAutoRows: "max-content" }}>
      {dataList?.data?.length
        ? dataList?.data?.map((row) => (
            <>
              <Grid
                item
                key={row?.id}
                xs={12 / (dataList?.gridViewBreakpoints?.xs || 1)}
                sm={12 / (dataList?.gridViewBreakpoints?.sm || 1)}
                md={12 / (dataList?.gridViewBreakpoints?.md || 1)}
                lg={12 / (dataList?.gridViewBreakpoints?.lg || 2)}
                xl={12 / (dataList?.gridViewBreakpoints?.xl || 2)}>
                <Card
                  sx={{
                    position: "relative",
                    height: "100%",
                    backgroundColor: "background.paper",
                    border: "1px solid",
                    borderColor: "grey.600",
                    borderRadius: "8px",
                    boxShadow: "0",
                  }}>
                  <Stack height="100%" divider={<Divider />}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: "12px 16px" }}>
                      <Stack direction="row" spacing={2} alignItems="center" flex={1}>
                        {dataList?.checkbox ? (
                          <FormControlLabel
                            control={<Checkbox />}
                            value={String(row?.id)}
                            label={""}
                            onChange={dataList?.handleCheckRow}
                            checked={dataList?.checkedRows?.includes(String(row?.id))}
                            sx={{ ml: 0, mr: 0 }}
                          />
                        ) : null}

                        {dataList?.loading ? (
                          <Stack direction="row" spacing={2} width="100%">
                            <Skeleton height="40px" width="40px" variant="circular" />
                            <Skeleton height="40px" width="30%" />
                          </Stack>
                        ) : (
                          <Box>{dataList?.gridCreator?.(row)?.header}</Box>
                        )}
                      </Stack>
                      <Box>
                        {dataList?.rowActions?.length ? (
                          getAvailableMenus(row)?.length ? (
                            <IconButton
                              onClick={(e) => handleClickActionMenu(e, row)}
                              color="inherit"
                              disabled={row?.actionDisabled || dataList?.checkedRows?.length}
                              sx={{ p: 0, ":hover": { backgroundColor: "transparent" } }}>
                              <EllipsisIcon />
                            </IconButton>
                          ) : null
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
                              style: {
                                boxShadow: "rgba(58, 53, 65, 0.2) 0px 5px 5px -3px, rgba(58, 53, 65, 0.14) 0px 8px 10px 1px, rgba(58, 53, 65, 0.12) 0px 3px 14px 2px",
                              },
                            }}>
                            {getAvailableMenus(row).map((menu, key) => (
                              <MenuItem
                                key={key}
                                disabled={row?.actionDisabled || (!!menu?.disabled && menu?.disabled(row))}
                                onClick={() => {
                                  handleCloseActionMenu();

                                  if (menu?.confirmation?.(row)) {
                                    dispatch(
                                      modalRedux.actions.open({
                                        title: menu?.confirmation?.(row)?.title,
                                        description: menu?.confirmation?.(row)?.description,
                                        onConfirm: () => menu?.onClick?.(row),
                                      }),
                                    );
                                  } else {
                                    menu?.onClick?.(row);
                                  }
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
                      </Box>
                    </Stack>

                    <CardContent sx={{ ...(!dataList?.loading ? { p: 0, ":last-child": { pb: 0 }, height: "100%" } : { p: 2 }) }}>
                      {dataList?.loading ? <GridListLoader /> : dataList?.gridCreator?.(row)?.content}
                    </CardContent>
                  </Stack>
                </Card>
              </Grid>
            </>
          ))
        : Array(10)
            .fill(null)
            .map((_, index) => (
              <Grid
                item
                key={index}
                xs={12 / (dataList?.gridViewBreakpoints?.xs || 1)}
                sm={12 / (dataList?.gridViewBreakpoints?.sm || 1)}
                md={12 / (dataList?.gridViewBreakpoints?.md || 1)}
                lg={12 / (dataList?.gridViewBreakpoints?.lg || 2)}
                xl={12 / (dataList?.gridViewBreakpoints?.xl || 2)}>
                <Card
                  sx={{
                    position: "relative",
                    height: "100%",
                    backgroundColor: "background.paper",
                    border: "1px solid",
                    borderColor: "grey.600",
                    borderRadius: "8px",
                    boxShadow: "0",
                  }}>
                  <Stack height="100%" divider={<Divider />}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: "12px 16px" }}>
                      <Stack direction="row" spacing={2} alignItems="center" flex={1}>
                        <Stack direction="row" spacing={2} width="100%">
                          <Skeleton height="40px" width="40px" variant="circular" />
                          <Skeleton height="40px" width="30%" />
                        </Stack>
                      </Stack>
                    </Stack>

                    <CardContent sx={{ ...(!dataList?.loading ? { p: 0, ":last-child": { pb: 0 }, height: "100%" } : { p: 2 }) }}>
                      <GridListLoader />
                    </CardContent>
                  </Stack>
                </Card>
              </Grid>
            ))}
    </Grid>
  );
};

export default Body;
