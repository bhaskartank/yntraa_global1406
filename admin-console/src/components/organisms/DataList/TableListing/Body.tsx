import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TableBody,
  TableCell,
  TableRow,
  Theme,
  Typography,
  styled,
} from "@mui/material";
import isEmpty from "lodash/isEmpty";
import React, { FC, useState } from "react";
import { BiRightArrowAlt } from "react-icons/bi";
import { BsDashLg } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";

import ConfirmModal from "components/molecules/ConfirmModal";

import { DATA_LIST_VARIANT, DataListProps } from "../model";

interface ExtendedStyledTableRowProps {
  variant?: DATA_LIST_VARIANT;
}

const StyledTableRow = styled(TableRow)<{ theme?: Theme } & ExtendedStyledTableRowProps>(({ theme, variant }) => ({
  "&, td": {
    borderBottom: variant === DATA_LIST_VARIANT?.EVENT_LOG ? 0 : "0.5px solid #2A3457",
    borderLeft: 0,
    borderRight: 0,
    padding: "8px 4px",
  },
}));

export const Body: FC<DataListProps> = (props) => {
  const { dataList } = props;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [confirmationPopup, setConfirmationPopup] = useState<any>(null);
  const [isConfirmationPopupActive, setIsConfirmationPopupActive] = useState<boolean>(false);

  const handleCloseActionMenu = () => setAnchorEl(null);
  const handleClickActionMenu = (event: React.MouseEvent<HTMLButtonElement>, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
    if (dataList?.onSelectRow) dataList?.onSelectRow(row);
  };

  const getAvailableMenus = (row) => {
    return dataList?.actions?.length ? dataList?.actions?.filter((menu) => !menu.hidden || !menu.hidden(row)) : [];
  };

  const handleOpenConfirmationPopup = (menu) => {
    setConfirmationPopup(menu);
    setIsConfirmationPopupActive(true);
  };

  const handleCloseConfirmationPopup = () => {
    setIsConfirmationPopupActive(false);
  };

  return (
    <>
      <TableBody>
        {dataList?.data.map((row, index) => (
          <StyledTableRow key={row?.id} variant={dataList?.variant}>
            {dataList?.checkbox ? (
              <TableCell>
                {!dataList?.rowCheckboxHidden?.(row) ? (
                  <FormGroup sx={{ minWidth: "24px", maxWidth: "24px" }}>
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      value={String(row?.id)}
                      label={""}
                      onChange={dataList?.handleCheckRow}
                      checked={dataList?.checkedRows?.includes(String(row?.id))}
                      sx={{ mx: "auto" }}
                    />
                  </FormGroup>
                ) : null}
              </TableCell>
            ) : null}

            <TableCell sx={{ minWidth: "28px" }}>
              <Box
                sx={{
                  ...(dataList?.variant === DATA_LIST_VARIANT?.EVENT_LOG
                    ? { display: "inline-block", textAlign: "center", borderRadius: "40px", backgroundColor: "#E0E0E0", p: "2px 8px", mx: "8px" }
                    : { pl: 1 }),
                }}>
                {dataList?.rowsPerPage * dataList?.page + index + 1}
              </Box>
            </TableCell>

            {dataList
              ?.rowCreator(row)
              ?.filter((item, index) => dataList?.viewColumns?.includes(index))
              .map((item, index) => (
                <TableCell key={index} align={item?.align || "left"}>
                  {item?.content || <BsDashLg />}
                </TableCell>
              ))}

            {dataList?.actions?.length ? (
              <TableCell
                sx={{
                  position: "sticky",
                  right: 0,
                  ...(dataList?.variant === DATA_LIST_VARIANT?.TABLE ? { boxShadow: "-2px 0px 0px rgba(0, 0, 0, 0.1)" } : {}),
                  zIndex: 2,
                  width: "28px",
                  minWidth: "28px",
                  maxWidth: "28px",
                  backgroundColor: "#F7F7F7",
                }}>
                {getAvailableMenus(row)?.length ? (
                  <IconButton
                    id="action-button"
                    aria-controls={open ? "action-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={(e) => handleClickActionMenu(e, row)}
                    color="inherit"
                    sx={{
                      position: "absolute",
                      right: 0,
                      top: 0,
                      height: "100%",
                      borderRadius: 0,
                      color: "common.black",
                      ...(dataList?.variant === DATA_LIST_VARIANT?.TABLE ? { backgroundColor: "#F7F7F7", ":hover": { backgroundColor: "#F7F7F7" } } : {}),
                      px: 0.5,
                      width: "100%",
                    }}
                    disabled={row.actionDisabled}>
                    <IoEllipsisVertical />
                  </IconButton>
                ) : null}

                {selectedRow?.id === row.id ? (
                  <Menu
                    id="action-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseActionMenu}
                    MenuListProps={{
                      "aria-labelledby": `action-button-${row.id}`,
                    }}
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
                        boxShadow: "0px 1px 1px rgb(100 116 139 / 6%), 0px 1px 2px rgb(100 116 139 / 10%)",
                      },
                    }}>
                    {getAvailableMenus(row).map((menu, key) => (
                      <MenuItem
                        key={key}
                        disabled={row.actionDisabled || (!!menu.disabled && menu.disabled(row))}
                        onClick={() => {
                          handleCloseActionMenu();

                          if (menu?.confirmation) {
                            handleOpenConfirmationPopup(menu);
                          } else {
                            menu.onClick(row);
                          }
                        }}>
                        <ListItemIcon sx={{ color: menu.color || "black", svg: { height: "18px", width: "18px" } }}>{menu?.icon || <BiRightArrowAlt />}</ListItemIcon>
                        <ListItemText sx={{ color: menu.color || "black" }}>{menu?.label?.(row)}</ListItemText>
                      </MenuItem>
                    ))}
                  </Menu>
                ) : null}
              </TableCell>
            ) : null}
          </StyledTableRow>
        ))}

        {isEmpty(dataList?.data) ? (
          <StyledTableRow>
            <TableCell colSpan={100}>
              <Typography textAlign="center">{dataList?.emptyDataText || "No Record Available."}</Typography>
            </TableCell>
          </StyledTableRow>
        ) : null}
      </TableBody>

      <ConfirmModal
        isOpen={isConfirmationPopupActive}
        title={confirmationPopup?.confirmation?.(selectedRow)?.title}
        resourceDetails={confirmationPopup?.confirmation?.(selectedRow)?.resourceDetails}
        description={confirmationPopup?.confirmation?.(selectedRow)?.description}
        detailDescription={confirmationPopup?.confirmation?.(selectedRow)?.detailDescription}
        confirmBtnText={confirmationPopup?.confirmation?.(selectedRow)?.confirmBtnText}
        cancelBtnText={confirmationPopup?.confirmation?.(selectedRow)?.cancelBtnText}
        content={confirmationPopup?.confirmation?.(selectedRow)?.content}
        onConfirm={() => {
          confirmationPopup.onClick(selectedRow);
          handleCloseConfirmationPopup();
        }}
        onClose={handleCloseConfirmationPopup}
      />
    </>
  );
};

export default Body;
