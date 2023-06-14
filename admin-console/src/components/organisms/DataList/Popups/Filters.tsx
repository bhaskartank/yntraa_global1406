import { Box, Button, Checkbox, Chip, Divider, FormControlLabel, FormGroup, Stack, Typography } from "@mui/material";
import { FC, useEffect, useMemo, useState } from "react";
import { MdClose } from "react-icons/md";
import { VscFilter } from "react-icons/vsc";

import { DateCalendarRange } from "components/molecules/DatePicker";

import ActionPopover from "../ActionPopover";

const Filters: FC<any> = (props) => {
  const { dataList, anchorEl, handleClose } = props;

  const [selected, setSelected] = useState<any>({});
  const [highlighted, setHighlighted] = useState<string | null>(null);

  const currentCategory = useMemo(() => dataList?.filterableColumns?.find((column) => column?.filterKey === highlighted), [dataList?.filterableColumns, highlighted]);
  const isIndeterminate: boolean = useMemo(
    () => selected[highlighted]?.length > 0 && selected[highlighted]?.length < currentCategory?.filters?.length,
    [currentCategory, selected, highlighted],
  );
  const isDeterminate: boolean = useMemo(() => selected[highlighted]?.length === currentCategory?.filters?.length, [currentCategory, selected, highlighted]);

  const handleSelect = (category: string, option: string, dateFilter: boolean) => {
    if (dateFilter) {
      setSelected((current) => ({ ...current, [category]: option }));
    } else if (!selected[category]?.includes(option)) {
      setSelected((current) => ({ ...current, [category]: current[category] ? [...current[category], option] : [option] }));
    }
  };

  const handleSelectAll = () => {
    setSelected((current) => ({ ...current, [highlighted]: currentCategory?.filters?.map((filter) => filter?.value) }));
  };

  const handleDeleteCategory = (category: string) => {
    const selectedCopy = Object.assign({}, selected);
    delete selectedCopy[category];
    setSelected(selectedCopy);
  };

  const handleDelete = (category: string, option: string) => {
    if (selected[category]?.length < 2) {
      handleDeleteCategory(category);
    } else {
      setSelected((current) => ({ ...current, [category]: current[category]?.filter((value) => value !== option) }));
    }
  };

  const handleApply = () => {
    dataList?.handleApplyFilters(selected);
    handleClose();
  };

  const handleClearAll = () => {
    setSelected({});
  };

  useEffect(() => {
    if (anchorEl) {
      setHighlighted(dataList?.filterableColumns[0]?.filterKey);
      setSelected(dataList?.filters);
    }
  }, [dataList?.filterableColumns, dataList?.filters, anchorEl]);

  return (
    <ActionPopover icon={<VscFilter size={20} />} title={"Filter"} anchorEl={anchorEl} handleClose={handleClose}>
      <Stack p={2} spacing={2} divider={<Divider orientation="horizontal" />}>
        <Box py={1}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Stack>
              <Typography variant="body1" fontWeight="bold">
                Choose Category ({dataList?.filterableColumns?.filter((column) => !!column?.filters || column?.dateFilter)?.length})
              </Typography>
              <Typography variant="caption">{Object.keys(selected)?.length || "0"} categories selected</Typography>
            </Stack>

            {Object.keys(selected)?.length ? (
              <Button
                variant="text"
                size="small"
                onClick={handleClearAll}
                sx={{
                  background: "transparent",
                  fontWeight: "400",
                  color: "common.black",
                  textDecoration: "underline",
                  p: 0,
                  fontSize: "14px",
                  "&:hover": { p: 0, background: "transparent", textDecoration: "underline", color: "common.black" },
                }}>
                Clear All
              </Button>
            ) : null}
          </Stack>

          <Stack direction="row" flexWrap="wrap" gap={1} mt={2}>
            {dataList?.filterableColumns
              ?.filter((column) => !!column?.filters || column?.dateFilter)
              ?.map((column) => (
                <Chip
                  key={column?.label}
                  size="small"
                  label={column?.label}
                  onClick={() => setHighlighted(column?.filterKey)}
                  onDelete={
                    Object.keys(selected)?.includes(column?.filterKey) &&
                    ((column?.dateFilter && selected[column?.filterKey]?.length && selected[column?.filterKey][0] && selected[column?.filterKey][1]) ||
                      selected[column?.filterKey]?.length)
                      ? () => handleDeleteCategory(column?.filterKey)
                      : null
                  }
                  deleteIcon={<MdClose />}
                  sx={{ borderRadius: 2, ...(highlighted === column?.filterKey ? { border: "2px solid black", borderColor: "primary.main" } : {}) }}
                  color={(Object.keys(selected)?.includes(column?.filterKey) && selected[column?.filterKey]?.length) || highlighted === column?.filterKey ? "info" : "default"}
                />
              ))}
          </Stack>
        </Box>

        <Box py={1}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Stack>
              <Typography variant="body1" fontWeight="bold">
                Select filter options in {dataList?.filterableColumns?.find((column) => highlighted === column?.filterKey)?.label}{" "}
                {!dataList?.filterableColumns?.find((column) => highlighted === column?.filterKey)?.dateFilter
                  ? `(${dataList?.filterableColumns?.find((column) => highlighted === column?.filterKey)?.filters?.length})`
                  : ""}
              </Typography>
            </Stack>
          </Stack>

          {!dataList?.filterableColumns?.find((column) => highlighted === column?.filterKey)?.dateFilter ? (
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox size="small" indeterminate={isIndeterminate} />}
                  label={`${
                    isIndeterminate
                      ? `${selected[highlighted]?.length} filter${selected[highlighted]?.length > 1 ? "s" : ""} selected`
                      : isDeterminate
                      ? "Unselect All"
                      : "Select All"
                  }`}
                  onChange={isIndeterminate || isDeterminate ? () => handleDeleteCategory(highlighted) : handleSelectAll}
                  checked={isDeterminate}
                />
              </FormGroup>
            </Stack>
          ) : null}

          {!dataList?.filterableColumns?.find((column) => highlighted === column?.filterKey)?.dateFilter ? (
            <Stack direction="row" flexWrap="wrap" gap={1} mt={1} sx={{ height: "120px", overflowY: "auto" }}>
              {dataList?.filterableColumns?.map((column) =>
                highlighted === column?.filterKey
                  ? column?.filters?.map((filter) => (
                      <Chip
                        key={filter?.value}
                        size="small"
                        label={filter?.label}
                        onClick={() =>
                          selected[column?.filterKey]?.includes(filter?.value)
                            ? handleDelete(column?.filterKey, filter?.value)
                            : handleSelect(column?.filterKey, filter?.value, false)
                        }
                        deleteIcon={<MdClose />}
                        sx={{ borderRadius: 2 }}
                        color={selected[column?.filterKey]?.includes(filter?.value) ? "info" : "default"}
                      />
                    ))
                  : null,
              )}
            </Stack>
          ) : (
            <Box mt={1}>
              <DateCalendarRange value={selected[highlighted] || [null, null]} onChange={(value) => handleSelect(highlighted, value, true)} max={new Date()} />
            </Box>
          )}
        </Box>
      </Stack>

      <Stack direction="row" justifyContent="center" alignItems="center" mb={2}>
        <Button size="small" variant="contained" color="primary" onClick={handleApply}>
          Apply
        </Button>
      </Stack>
    </ActionPopover>
  );
};

export default Filters;
