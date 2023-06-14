import { Backdrop, Box, Button, Divider, IconButton, Popover, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { MdClose } from "react-icons/md";

const ActionPopover: FC<any> = (props) => {
  const { children, title, icon, handleClose, anchorEl, onSubmit, submitDisabled, submitBtnText = "Save" } = props;

  return (
    <Backdrop sx={{ color: "common.white", zIndex: 5 }} open={Boolean(anchorEl)}>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={props?.anchorOrigin || { vertical: "top", horizontal: "right" }}
        transformOrigin={props?.transformOrigin || { vertical: "top", horizontal: "right" }}
        sx={props?.sx || {}}>
        <Stack maxWidth={props?.maxWidth || "600px"} divider={<Divider flexItem />}>
          {title ? (
            <Box p="16px">
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Stack component="span" alignItems="center" justifyContent="center">
                    {icon}
                  </Stack>
                  <Typography>{title}</Typography>
                </Stack>
                <IconButton onClick={handleClose} color="primary" sx={{ p: 0 }}>
                  <MdClose />
                </IconButton>
              </Stack>
            </Box>
          ) : null}

          <Box sx={{ p: "16px", maxHeight: "290px", overflowY: "auto" }}>{children}</Box>

          <Stack direction="row" justifyContent="flex-end" sx={{ p: "16px" }}>
            <Button size="small" variant="contained" color="primary" onClick={onSubmit} disabled={submitDisabled}>
              {submitBtnText}
            </Button>
          </Stack>
        </Stack>
      </Popover>
    </Backdrop>
  );
};

export default ActionPopover;
