import { Backdrop, Box, Chip, Divider, Fade, IconButton, InputAdornment, Modal, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { IoCloseOutline } from "react-icons/io5";
import { VscNewline } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import globalSearchRedux from "store/modules/global-search";

import { sidebarMenus } from "utils/constants";

const GlobalSearch = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const open = globalSearchRedux.getters.open(rootState);

  const [searchKey, setSearchKey] = useState<string>("");
  const [filteredList, setFilteredList] = useState<any>([]);
  const [activeItem, setActiveItem] = useState<any>(null);

  const handleClose = () => dispatch(globalSearchRedux.actions.close());
  const handleSelect = (path) => {
    handleClose();
    navigate(path);
  };

  useEffect(() => {
    const pageList = Object.values(sidebarMenus);

    if (searchKey) {
      const list = pageList?.filter((page) => page?.title?.toLowerCase()?.includes(searchKey?.toLowerCase()));

      setFilteredList(list);
      if (list?.length) setActiveItem(list[0]);
    } else {
      setFilteredList([]);
    }
  }, [searchKey]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && activeItem) {
        event.preventDefault();

        handleSelect(activeItem?.path);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeItem]);

  useEffect(() => {
    if (!open) {
      setSearchKey("");
    }
  }, [open]);

  return (
    <Backdrop open={open} sx={{ zIndex: 5, backdropFilter: "blur(2px)" }}>
      <Modal open={open} onClose={handleClose} closeAfterTransition disableAutoFocus={true}>
        <Fade in={open}>
          <Stack
            sx={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              mx: "auto",
              transform: "translateY(-50%)",
              width: { xs: "100%", md: "600px" },
              height: { xs: "100%", md: "550px" },
              bgcolor: "background.paper",
              borderRadius: { xs: 0, md: "8px" },
              overflow: "hidden",
            }}
            divider={<Divider />}>
            {/* Modal Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" px={1} sx={{ backgroundColor: "info.lighter", color: "text.black" }}>
              <TextField
                fullWidth
                autoFocus
                placeholder="Search by resource name"
                inputProps={{ sx: { ml: 2, fontSize: "16px" } }}
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="end">
                      <BiSearch size={20} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClose}>
                        <IoCloseOutline size={24} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ fieldset: { outline: "none", borderWidth: "0px !important" } }}
              />
            </Stack>

            <Stack flex={1}>
              {searchKey && !filteredList?.length ? (
                <Stack alignItems="center" justifyContent="center" height="90%" width="100%">
                  <Typography variant="h6">
                    No match found for <i>{`"${searchKey}"`}</i>
                  </Typography>
                </Stack>
              ) : (
                <Box sx={{ overflow: "auto", p: "16px 24px", flex: 1 }}>
                  <Stack gap={2}>
                    {filteredList?.map((item) => (
                      <Stack
                        key={item?.title}
                        justifyContent="center"
                        onClick={() => handleSelect(activeItem?.path)}
                        sx={{
                          border: "1px solid",
                          borderColor: "primary.main",
                          p: "16px 32px",
                          height: "72px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          ...(activeItem?.title === item?.title ? { backgroundColor: "primary.light" } : {}),
                        }}
                        onMouseEnter={() => setActiveItem(item)}
                        onMouseLeave={() => setActiveItem(null)}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                          <Typography color="primary">{item?.title}</Typography>
                          {activeItem?.title === item?.title ? (
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <IconButton>
                                <VscNewline />
                              </IconButton>
                              <Chip label="Press enter" />
                            </Stack>
                          ) : null}
                        </Stack>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          </Stack>
        </Fade>
      </Modal>
    </Backdrop>
  );
};

export default GlobalSearch;
