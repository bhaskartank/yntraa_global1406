import { Avatar, Box, Divider, ListItemIcon, ListItemText, MenuItem, Popover, Stack, Typography } from "@mui/material";
import keycloak from "plugins/sso";
import { FC } from "react";
import { BiLogOutCircle as LogoutIcon } from "react-icons/bi";
import { RiLockPasswordLine as PasswordIcon } from "react-icons/ri";

import { useDispatch, useSelector } from "store";
import authRedux from "store/modules/auth";

import { validateEnv } from "utilities";
import stringAvatar from "utilities/stringAvatar";

interface AccountPopoverProps {
  anchorEl: null | Element;
  onClose?: () => void;
  open?: boolean;
}

export const AccountPopover: FC<AccountPopoverProps> = (props) => {
  const { anchorEl, onClose, open, ...other } = props;

  const dispatch = useDispatch();
  const rootState = useSelector((state: any) => state);
  const userDetails = authRedux.getters.userDetails(rootState);

  const handleLogout = () => {
    onClose();
    dispatch(authRedux.actions.logout({ keepSession: false, triggerLogoutEndPoint: true }));
  };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "center",
        vertical: "bottom",
      }}
      keepMounted
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 300 } }}
      transitionDuration={0}
      {...other}>
      <Stack direction="row" alignItems="center" p={2} spacing={1}>
        <Avatar {...stringAvatar(`${userDetails?.first_name} ${userDetails?.last_name}`)} sx={{ bgcolor: "primary.main", height: 40, width: 40 }} />
        <Box>
          <Typography variant="body1" textTransform="capitalize">{`${userDetails?.first_name || ""} ${userDetails?.last_name || ""}`}</Typography>
          <Typography color="textSecondary" variant="body2">
            {userDetails?.username || ""}
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Box sx={{ my: 1 }}>
        <MenuItem
          onClick={() => {
            onClose();

            validateEnv(process.env.REACT_APP_OIDC_ENABLED, "true")
              ? keycloak.login({ action: "SECURE_UPDATE_PASSWORD", prompt: "login" })
              : dispatch(authRedux.actions.updatePasswordModalActive(true));
          }}>
          <ListItemIcon>
            <PasswordIcon fontSize="large" />
          </ListItemIcon>
          <ListItemText primary={<Typography variant="body1">Change Password</Typography>} />
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="large" />
          </ListItemIcon>
          <ListItemText primary={<Typography variant="body1">Logout</Typography>} />
        </MenuItem>
      </Box>
    </Popover>
  );
};
