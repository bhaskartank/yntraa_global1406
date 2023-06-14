import { Backdrop, Box, IconButton, Popover, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { MdClose } from "react-icons/md";

const ActionPopover: FC<any> = (props) => {
  const { children, title, icon, handleClose, anchorEl } = props;

  return (
    <Backdrop sx={{ color: "#fff", zIndex: 5 }} open={Boolean(anchorEl)}>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={props?.anchorOrigin || { vertical: "top", horizontal: "right" }}
        transformOrigin={props?.transformOrigin || { vertical: "top", horizontal: "right" }}
        sx={props?.sx || {}}>
        <Box maxWidth={props?.maxWidth || "600px"}>
          {title ? (
            <Box pl={2} pr={1} py={1} sx={{ backgroundColor: "primary.light" }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Stack component="span" alignItems="center" justifyContent="center">
                    {icon}
                  </Stack>
                  <Typography fontWeight="bold">{title}</Typography>
                </Stack>
                <IconButton onClick={handleClose} color="primary" sx={{ p: 0 }}>
                  <MdClose />
                </IconButton>
              </Stack>
            </Box>
          ) : null}

          {children}
        </Box>
      </Popover>
    </Backdrop>
  );
};

export default ActionPopover;
