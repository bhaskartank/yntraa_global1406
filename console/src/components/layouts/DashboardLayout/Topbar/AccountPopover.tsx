import { Avatar, Box, Divider, ListItemIcon, ListItemText, MenuItem, Popover, Slide, Stack, Typography } from "@mui/material";
import { FC, useRef, useState } from "react";
import { BiLogOutCircle as LogoutIcon } from "react-icons/bi";

import { useDispatch, useSelector } from "store";
import authRedux from "store/modules/auth";

import { stringAvatar } from "utils";

const AccountPopover: FC = () => {
  const dispatch = useDispatch();
  const rootState = useSelector((state: any) => state);
  const userDetails = authRedux.getters.userDetails(rootState);

  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [openPopover, setOpenPopover] = useState<boolean>(false);

  const handleOpenPopover = (): void => {
    setOpenPopover(true);
  };

  const handleClosePopover = (): void => {
    setOpenPopover(false);
  };

  const handleLogout = async () => {
    handleClosePopover();
    await dispatch(authRedux.actions.logout());
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" gap={1} onClick={handleOpenPopover} ref={anchorRef} sx={{ cursor: "pointer" }}>
        <Avatar
          {...stringAvatar(`${userDetails?.first_name} ${userDetails?.last_name}`)}
          sx={{ height: 36, width: 36, backgroundColor: "primary.main", fontSize: "16px", color: "common.white" }}
        />
        <Stack>
          <Typography textTransform="capitalize">{`${userDetails?.first_name} ${userDetails?.last_name}`}</Typography>
          <Typography variant="body2">{userDetails?.email || ""}</Typography>
        </Stack>
      </Stack>

      <Popover
        anchorEl={anchorRef.current}
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        keepMounted
        onClose={handleClosePopover}
        open={openPopover}
        sx={{ top: "8px" }}
        PaperProps={{ sx: { width: 300 } }}
        transitionDuration={300}
        TransitionComponent={Slide}>
        <Stack direction="row" alignItems="center" p={2} spacing={1}>
          <Avatar
            {...stringAvatar(`${userDetails?.first_name} ${userDetails?.last_name}`)}
            sx={{ backgroundColor: "primary.main", height: 36, width: 36, color: "common.white", fontSize: "16px" }}
          />
          <Box>
            <Typography textTransform="capitalize">{`${userDetails?.first_name} ${userDetails?.last_name}`}</Typography>
            <Typography variant="body2">{userDetails?.email || ""}</Typography>
          </Box>
        </Stack>
        <Divider />
        <Box sx={{ my: 1 }}>
          <MenuItem onClick={handleLogout} sx={{ width: "100%" }}>
            <ListItemIcon>
              <LogoutIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary={<Typography>Logout</Typography>} />
          </MenuItem>
        </Box>
      </Popover>
    </Box>
  );
};

export default AccountPopover;
