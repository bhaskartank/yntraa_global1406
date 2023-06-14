import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { useDispatch, useSelector } from "store";
import authRedux from "store/modules/auth";

import LogoContainer from "components/atoms/AppLogo";

import { stringAvatar } from "utils";

const Navbar = () => {
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const userDetails = authRedux.getters.userDetails(rootState);

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await dispatch(authRedux.actions.logout());
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppBar position="static" color="transparent" sx={{ backgroundColor: "primary.main" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1 }}>
          <LogoContainer />
          <Box>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar
                {...stringAvatar(userDetails ? `${userDetails?.first_name} ${userDetails?.last_name}` : "")}
                sx={{ height: 40, width: 40, backgroundColor: "background.paper", fontSize: "18px", color: "primary.main" }}
              />
            </IconButton>

            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}>
              <MenuItem onClick={() => handleLogout()}>
                <Typography textAlign="center">{"Logout"}</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
