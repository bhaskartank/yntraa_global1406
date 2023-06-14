import { Box, Button, Divider, Popover, Slide, Stack, Typography } from "@mui/material";
import { FC, ReactNode } from "react";

interface SelectPopperProps {
  children: ReactNode;
  handleClose: () => void;
  submitBtnText?: string;
  onSubmit: () => void;
  icon: ReactNode;
  title: string;
  anchorEl: any;
  open: boolean;
  submitDisabled?: boolean;
}

const SelectPopper: FC<SelectPopperProps> = (props) => {
  const { children, title, icon, open, handleClose, anchorEl, onSubmit, submitBtnText = "Apply", submitDisabled = false } = props;

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      keepMounted
      onClose={handleClose}
      open={open}
      sx={{ top: "14px", zIndex: 8 }}
      transitionDuration={300}
      TransitionComponent={Slide}>
      <Stack divider={<Divider flexItem />} sx={{ minWidth: "640px" }}>
        {title ? (
          <Box p="16px">
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
              <Stack direction="row" alignItems="center" spacing={1}>
                {icon ? (
                  <Stack component="span" alignItems="center" justifyContent="center">
                    {icon}
                  </Stack>
                ) : null}
                <Typography fontWeight="bold">{title}</Typography>
              </Stack>
            </Stack>
          </Box>
        ) : null}

        <Box sx={{ p: "16px" }}>{children}</Box>

        <Stack direction="row" justifyContent="flex-end" sx={{ p: "16px" }}>
          <Button size="small" variant="contained" color="primary" onClick={onSubmit} disabled={submitDisabled}>
            {submitBtnText}
          </Button>
        </Stack>
      </Stack>
    </Popover>
  );
};

export default SelectPopper;
