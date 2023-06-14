import { Button, Divider, Stack } from "@mui/material";
import moment from "moment";
import { FC, useEffect, useState } from "react";
import { VscFilter } from "react-icons/vsc";

import { DateCalendarRange } from "components/molecules/DatePicker";

import ActionPopover from "../ActionPopover";

const DateColumnFilter: FC<any> = (props) => {
  const { dataList, anchorEl, handleClose, selectedColumnKey, selectedColumnLabel } = props;

  const [date, setDate] = useState<[Date | null, Date | null]>([moment()?.startOf("day")?.toDate(), moment()?.endOf("day")?.toDate()]);

  const handleApply = () => {
    dataList?.handleApplyFilters({ ...dataList?.filters, [selectedColumnKey]: date });
    handleClose();
  };

  const handleClear = () => {
    dataList?.handleApplyFilters({ ...dataList?.filters, [selectedColumnKey]: [] });
    handleClose();
  };

  useEffect(() => {
    if (anchorEl) {
      if (dataList?.filters && dataList?.filters[selectedColumnKey]?.length) {
        setDate(dataList?.filters && dataList?.filters[selectedColumnKey] ? dataList?.filters[selectedColumnKey] : [null, null]);
      }
    }
  }, [anchorEl, selectedColumnKey, dataList?.filters]);

  return (
    <ActionPopover
      anchorEl={anchorEl}
      handleClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      icon={<VscFilter size={20} />}
      title={selectedColumnLabel}
      maxWidth="max-content">
      <Stack spacing={0} divider={<Divider orientation="horizontal" />}>
        <DateCalendarRange value={date} onChange={setDate} max={moment().endOf("day").toDate()} />

        <Stack direction="row" alignItems="center" justifyContent="center" py={1} spacing={2}>
          <Button size="small" variant="outlined" color="primary" onClick={handleClear}>
            Clear Filter
          </Button>
          <Button size="small" variant="contained" color="primary" onClick={handleApply}>
            Apply Filter
          </Button>
        </Stack>
      </Stack>
    </ActionPopover>
  );
};

export default DateColumnFilter;
