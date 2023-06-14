import { Button, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup, Stack } from "@mui/material";
import React, { FC, useMemo, useState } from "react";
import { MdClose, MdOutlineFileDownload } from "react-icons/md";

import ActionPopover from "../ActionPopover";

const ExportColumns: FC<any> = (props) => {
  const { dataList, anchorEl, handleClose } = props;

  const [isExportAll, setIsExportAll] = useState<string>("false");
  const [selected, setSelected] = useState<string[]>([]);

  const isIndeterminate: boolean = useMemo(() => selected?.length > 0 && selected?.length < dataList?.exportColumns?.length, [selected, dataList?.exportColumns]);
  const isDeterminate: boolean = useMemo(() => selected?.length === dataList?.exportColumns?.length, [selected, dataList?.exportColumns]);

  const handleChangeExportSize = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsExportAll((event.target as HTMLInputElement).value);
  };

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
      setSelected(dataList?.exportColumns?.map((item, index) => index));
    } else {
      setSelected([]);
    }
  };

  const handleClearAll = () => {
    setSelected([]);
  };

  const handleExport = () => {
    dataList?.handleExportColumns(selected, isExportAll);
    handleClose();
  };

  return (
    <ActionPopover icon={<MdOutlineFileDownload size={24} />} title={"Export Columns"} anchorEl={anchorEl} handleClose={handleClose}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" px={2} py={0} sx={{ backgroundColor: "grey.200" }}>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox size="small" indeterminate={isIndeterminate} />}
            label={`${isIndeterminate ? `${selected?.length} column${selected?.length > 1 ? "s" : ""} selected` : isDeterminate ? "Unselect All" : "Select All"}`}
            onChange={isIndeterminate || isDeterminate ? handleClearAll : handleSelectAll}
            checked={isDeterminate}
          />{" "}
        </FormGroup>
      </Stack>

      <Stack direction="row" gap={"12px"} px={2} my={2}>
        <FormControl>
          <FormLabel id="export-size">Export Size</FormLabel>
          <RadioGroup row aria-labelledby="export-size" value={isExportAll} onChange={handleChangeExportSize}>
            <FormControlLabel value="true" control={<Radio />} label={`All (${dataList?.totalRecords || dataList?.data?.length})`} />
            <FormControlLabel value="false" control={<Radio />} label={`Current Page (${dataList?.data?.length})`} />
          </RadioGroup>
        </FormControl>
      </Stack>

      <Divider sx={{ mx: 2 }} />

      <Stack direction="row" flexWrap="wrap" gap={"12px"} px={2} my={3}>
        {dataList?.exportColumns?.map((column, index) => (
          <Chip
            key={column}
            size="small"
            label={column}
            onClick={() => (selected?.includes(index) ? handleDelete(index) : handleSelect(index))}
            // onDelete={selected?.includes(index) ? () => handleDelete(index) : null}
            deleteIcon={<MdClose />}
            sx={{ borderRadius: 2 }}
            color={selected?.includes(index) ? "info" : "default"}
          />
        ))}
      </Stack>

      <Stack direction="row" justifyContent="center" alignItems="center" mb={2}>
        <Button size="small" variant="contained" color="primary" onClick={handleExport} disabled={!selected?.length}>
          Export
        </Button>
      </Stack>
    </ActionPopover>
  );
};

export default ExportColumns;
