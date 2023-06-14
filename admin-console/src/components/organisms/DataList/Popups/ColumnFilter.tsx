import { Button, Checkbox, Divider, FormControlLabel, FormGroup, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import { FC, useEffect, useMemo, useState } from "react";
import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import { VscFilter } from "react-icons/vsc";

import ActionPopover from "../ActionPopover";

const ColumnFilter: FC<any> = (props) => {
  const { dataList, anchorEl, handleClose, selectedColumnKey, selectedColumnLabel } = props;

  const [selected, setSelected] = useState<any>([]);
  const [options, setOptions] = useState<any[]>([]);
  const [search, setSearch] = useState<string>("");

  const isIndeterminate: boolean = useMemo(() => selected?.length > 0 && selected?.length < options?.length, [selected, options]);
  const isDeterminate: boolean = useMemo(() => selected?.length === options?.length, [selected, options]);

  const handleSelect = (event: any) => {
    if (event?.target?.checked) {
      setSelected((current) => [...current, event?.target?.value]);
    } else {
      setSelected((current) => current?.filter((item) => item !== event?.target?.value));
    }
  };

  const handleSelectAll = (event: any) => {
    if (event?.target?.checked) {
      setSelected(options?.map((option) => option?.value?.toString()));
    } else {
      setSelected([]);
    }
  };

  const handleClearAll = () => {
    setSelected([]);
  };

  const handleApply = () => {
    dataList?.handleApplyFilters({ ...dataList?.filters, [selectedColumnKey]: selected });
    handleClose();
  };

  useEffect(() => {
    if (anchorEl) {
      if (dataList?.filterableColumns?.find((column) => column?.filterKey === selectedColumnKey)) {
        setOptions(dataList?.filterableColumns?.find((column) => column?.filterKey === selectedColumnKey)?.filters);
      }
      if (dataList?.filters && dataList?.filters[selectedColumnKey]?.length) {
        setSelected(dataList?.filters ? dataList?.filters[selectedColumnKey] : []);
      }
    }
  }, [anchorEl, selectedColumnKey, dataList?.filterableColumns, dataList?.filters]);

  return (
    <ActionPopover
      anchorEl={anchorEl}
      handleClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      icon={<VscFilter size={20} />}
      title={`${selectedColumnLabel} (${dataList?.columns?.find((column) => column?.filterKey === selectedColumnKey)?.filters?.length})`}>
      <Stack spacing={0} divider={<Divider orientation="horizontal" />}>
        <Stack>
          <TextField
            variant="outlined"
            placeholder={"Search Filters"}
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ color: "primary.main" }}>
                  <AiOutlineSearch size={20} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearch("")} sx={{ padding: "0", color: "primary.main", visibility: search ? "visible" : "hidden" }}>
                    <AiOutlineClose size={20} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              input: { pl: 0, pr: 0, width: "100%" },
              ".MuiInputBase-root": { borderRadius: 0, backgroundColor: "background.paper" },
              fieldset: { border: 0 },
            }}
            fullWidth
          />
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center" px={2} py={0} sx={{ backgroundColor: "grey.200" }}>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox size="small" indeterminate={isIndeterminate} />}
              label={`${isIndeterminate ? `${selected?.length} filter${selected?.length > 1 ? "s" : ""} selected` : isDeterminate ? "Unselect All" : "Select All"}`}
              onChange={isIndeterminate || isDeterminate ? handleClearAll : handleSelectAll}
              checked={isDeterminate}
            />
          </FormGroup>
        </Stack>

        <Stack divider={<Divider />}>
          <Stack gap={"4px"} divider={<Divider />} sx={{ maxHeight: "320px", overflowY: "auto" }}>
            {options?.filter((option) => option?.label?.toString()?.toLowerCase()?.includes(search?.toLowerCase()))?.length ? (
              options
                ?.filter((option) => option?.label?.toString()?.toLowerCase()?.includes(search?.toLowerCase()))
                ?.map((option) => (
                  <FormGroup key={option?.value} sx={{ px: 2 }}>
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      value={option?.value}
                      label={option?.label}
                      onChange={handleSelect}
                      checked={selected?.includes(String(option?.value))}
                    />
                  </FormGroup>
                ))
            ) : (
              <Typography variant="body2" textAlign="center" pt={1}>
                No Filters Found
              </Typography>
            )}
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="center" py={1}>
            <Button size="small" variant="contained" color="primary" onClick={handleApply}>
              Apply Filter
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </ActionPopover>
  );
};

export default ColumnFilter;
