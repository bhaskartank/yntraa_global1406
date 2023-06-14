import { Box, Button, Chip, IconButton, Stack, Typography } from "@mui/material";
import { FC, useCallback, useEffect, useState } from "react";
import { MdClose } from "react-icons/md";

import SearchBar from "components/molecules/SearchBar";
import useSearch from "components/molecules/SearchBar/useSearch";

import ActionPopover from "../ActionPopover";

const SearchPopup: FC<any> = (props) => {
  const { dataList, anchorEl, handleClose } = props;

  const { localSearchTerm, setLocalSearchTerm, handleClearSearch, handleSearch } = useSearch();

  const [selected, setSelected] = useState<string[]>([]);

  const handleSelect = (key: string) => {
    if (!selected?.includes(key)) {
      setSelected((current) => [...current, key]);
    }
  };

  const handleDelete = (key: string) => {
    setSelected((current) => current?.filter((item) => item !== key));
  };

  const handleApply = useCallback(() => {
    dataList?.handleSearch(localSearchTerm, selected);
    handleClose();
  }, [handleClose, localSearchTerm, selected, dataList]);

  const onKeyDown = useCallback(
    (event) => {
      if (event?.key === "Enter") {
        if (!(!selected?.length || localSearchTerm?.length < 3)) {
          handleApply();
        }
      }
    },
    [selected, localSearchTerm, handleApply],
  );

  useEffect(() => {
    if (anchorEl) {
      setLocalSearchTerm(dataList?.search);
      setSelected(dataList?.searchColumns);
    }
  }, [dataList?.search, dataList?.searchColumns, setLocalSearchTerm, anchorEl]);

  return (
    <ActionPopover anchorEl={anchorEl} handleClose={handleClose}>
      <Box p={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
          <Box component="span" sx={{ display: "inline-flex", flex: 1 }}>
            <SearchBar
              autoFocus={true}
              fullWidth
              defaultValue={dataList?.search}
              onChange={handleSearch}
              onClear={handleClearSearch}
              onKeyDown={onKeyDown}
              placeholder="Search (min 3 chars)"
            />
          </Box>

          <IconButton onClick={handleClose} color="primary" sx={{ p: 0 }}>
            <MdClose />
          </IconButton>
        </Stack>

        <Stack spacing={2} my={3}>
          <Typography color="common.black">Select columns to apply search</Typography>
          <Stack direction="row" flexWrap="wrap" gap={"12px"} my={3}>
            {dataList?.searchFields?.map((field) => (
              <Chip
                key={field?.key}
                size="small"
                label={field?.label}
                onClick={() => (selected?.includes(field?.key) ? handleDelete(field?.key) : handleSelect(field?.key))}
                // onDelete={selected?.includes(field?.key) ? () => handleDelete(field?.key) : null}
                deleteIcon={<MdClose />}
                sx={{ borderRadius: 2 }}
                color={selected?.includes(field?.key) ? "info" : "default"}
              />
            ))}
          </Stack>
        </Stack>

        <Stack direction="row" justifyContent="center" alignItems="center">
          <Button size="small" variant="contained" color="primary" onClick={handleApply} disabled={!selected?.length || localSearchTerm?.length < 3}>
            Search
          </Button>
        </Stack>
      </Box>
    </ActionPopover>
  );
};

export default SearchPopup;
