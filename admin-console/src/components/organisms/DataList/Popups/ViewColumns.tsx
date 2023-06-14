import { Button, Checkbox, Chip, FormControlLabel, FormGroup, Stack } from "@mui/material";
import { FC, useEffect, useMemo, useState } from "react";
import { MdClose, MdOutlineRemoveRedEye } from "react-icons/md";

import ActionPopover from "../ActionPopover";

const ViewColumns: FC<any> = (props) => {
  const { dataList, anchorEl, handleClose } = props;

  const [selected, setSelected] = useState<string[]>([]);

  const isIndeterminate: boolean = useMemo(() => selected?.length > 0 && selected?.length < dataList?.columns?.length, [selected, dataList?.columns]);
  const isDeterminate: boolean = useMemo(() => selected?.length === dataList?.columns?.length, [selected, dataList?.columns]);

  const handleSelect = (key: string) => {
    if (!selected?.includes(key)) {
      setSelected((current) => [...current, key]);
    }
  };

  const handleDelete = (key: string) => {
    setSelected((current) => current?.filter((item) => item !== key));
  };

  const handleSelectAll = (event: any) => {
    if (event?.target?.checked) {
      setSelected(dataList?.columns?.map((item, index) => index));
    } else {
      setSelected([]);
    }
  };

  const handleClearAll = () => {
    setSelected([]);
  };

  const handleApply = () => {
    dataList?.handleApplyViewColumns(selected);
    handleClose();
  };

  useEffect(() => {
    if (anchorEl) setSelected(dataList?.viewColumns);
  }, [anchorEl, dataList?.viewColumns]);

  return (
    <ActionPopover icon={<MdOutlineRemoveRedEye size={24} />} title={"View Columns"} anchorEl={anchorEl} handleClose={handleClose}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" px={2} py={0} sx={{ backgroundColor: "grey.200" }}>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox size="small" indeterminate={isIndeterminate} />}
            label={`${isIndeterminate ? `${selected?.length} column${selected?.length > 1 ? "s" : ""} selected` : isDeterminate ? "Unselect All" : "Select All"}`}
            onChange={isIndeterminate || isDeterminate ? handleClearAll : handleSelectAll}
            checked={isDeterminate}
          />
        </FormGroup>
      </Stack>

      <Stack direction="row" flexWrap="wrap" gap={"12px"} px={2} my={3}>
        {dataList?.columns?.map((column, index) => (
          <Chip
            key={column?.label}
            size="small"
            label={column?.label}
            onClick={() => (selected?.includes(index) ? handleDelete(index) : handleSelect(index))}
            // onDelete={selected?.includes(index) ? () => handleDelete(index) : null}
            deleteIcon={<MdClose />}
            sx={{ borderRadius: 2 }}
            color={selected?.includes(index) ? "info" : "default"}
          />
        ))}
      </Stack>

      <Stack direction="row" justifyContent="center" alignItems="center" mb={2}>
        <Button size="small" variant="contained" color="primary" onClick={handleApply} disabled={!selected?.length}>
          Apply
        </Button>
      </Stack>
    </ActionPopover>
  );
};

export default ViewColumns;
