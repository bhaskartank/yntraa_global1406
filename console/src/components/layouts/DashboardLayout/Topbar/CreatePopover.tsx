import { Box, Button, Divider, ListItemIcon, ListItemText, MenuItem, Popover, Slide, Typography } from "@mui/material";
import { FC, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { appRoutes } from "utils/constants";

import { OverviewIcon, PlusIcon } from "assets/icons";

const resources = [
  { icon: <OverviewIcon />, title: "Project", path: appRoutes.CREATE_PROJECT },
  { icon: <OverviewIcon />, title: "Virtual Machine", path: appRoutes.CREATE_VIRTUAL_MACHINE },
  { icon: <OverviewIcon />, title: "Volume", path: appRoutes.CREATE_VOLUME },
  { icon: <OverviewIcon />, title: "Network", path: appRoutes.CREATE_NETWORK },
];

const CreatePopover: FC = () => {
  const navigate = useNavigate();
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [openPopover, setOpenPopover] = useState<boolean>(false);

  const handleOpenPopover = (): void => {
    setOpenPopover(true);
  };

  const handleClosePopover = (): void => {
    setOpenPopover(false);
  };

  const handleClickMenu = (path) => {
    navigate(path);
    handleClosePopover();
  };

  return (
    <>
      <Button variant="contained" color="secondary" onClick={handleOpenPopover} ref={anchorRef} startIcon={<PlusIcon />}>
        Create
      </Button>
      <Popover
        anchorEl={anchorRef.current}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        onClose={handleClosePopover}
        open={openPopover}
        sx={{ top: "8px" }}
        transitionDuration={300}
        TransitionComponent={Slide}>
        <Divider />
        <Box sx={{ my: 1 }}>
          {resources?.map((resource) => (
            <MenuItem key={resource?.title} onClick={() => handleClickMenu(resource?.path)} sx={{ width: "100%" }}>
              <ListItemIcon>{resource?.icon}</ListItemIcon>
              <ListItemText primary={<Typography>{resource?.title}</Typography>} />
            </MenuItem>
          ))}
        </Box>
      </Popover>
    </>
  );
};

export default CreatePopover;
