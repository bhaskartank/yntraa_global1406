import { Box, IconButton, InputAdornment, Stack, TextField, styled } from "@mui/material";
import useOutsideClick from "hooks/useOutsideClick";
import isDate from "lodash/isDate";
import moment from "moment";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, DateRangePicker as DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { AiOutlineClose } from "react-icons/ai";
import { MdEvent } from "react-icons/md";

const StyledDatePickerContainer = styled(Box)(() => ({
  "&": { position: "relative" },
}));

const StyledDatePicker = styled(Calendar)(({ theme, inset, position = "absolute" }) => ({
  "&.rdrCalendarWrapper": {
    position,
    inset,
    zIndex: 5,
    border: `1px solid ${theme.palette.neutral[300]}`,
    borderRadius: "8px",
  },

  ".rdrMonthPicker, .rdrYearPicker, .rdrNextPrevButton, .rdrNextPrevButton:hover": {
    background: theme.palette.primary.lightest,
  },
}));

interface DatePickerProps {
  value: any;
  onChange: any;
  min?: any;
  max?: any;
  size?: "small" | "medium";
  label?: string;
  disabled?: boolean;
  width?: string | number;
  isRequired?: boolean;
  topLabel?: boolean;
  inputProps?: any;
  inset?: string;
}

export const DatePicker: FC<DatePickerProps> = ({ value, onChange, min, max, size, label, disabled, width, isRequired, topLabel, inputProps, inset }) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleClickOutside = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const ref = useOutsideClick(handleClickOutside);

  const dateFormatter = useCallback((date) => {
    return moment(date).format("DD-MMM-YYYY");
  }, []);

  const handleSelect = useCallback(
    (date) => {
      onChange(date);
      setOpen(false);
    },
    [onChange],
  );

  const clearValue = useCallback(
    (event) => {
      event.stopPropagation();
      onChange(null);
    },
    [onChange],
  );

  const getDisplayDateRange = useCallback(() => {
    return isDate(value) ? dateFormatter(value) : "";
  }, [value, dateFormatter]);

  return (
    <Stack>
      <TextField
        size={size || "small"}
        placeholder="Select Date"
        value={getDisplayDateRange()}
        onClick={() => !disabled && setOpen(true)}
        disabled={disabled || false}
        InputProps={{
          readOnly: true,
          startAdornment: (
            <InputAdornment position="start">
              <MdEvent size={16} />
            </InputAdornment>
          ),
          ...(value && !disabled
            ? {
                endAdornment: (
                  <InputAdornment position="start">
                    <IconButton aria-label="clear date" onClick={clearValue} edge="end" sx={{ p: 0 }}>
                      <AiOutlineClose size={16} />
                    </IconButton>
                  </InputAdornment>
                ),
              }
            : {}),
          ...inputProps,
        }}
        sx={{
          width: width || "180px",
          fontWeight: disabled && 600,
          input: {
            width,
          },
          ".MuiInputBase-root": {
            borderRadius: "50px",
            backgroundColor: disabled ? "#f4f4f4" : "info.lightest",
            color: "text.black",
            transition: "300ms",
          },
        }}
      />
      <StyledDatePickerContainer ref={ref}>
        {open ? <StyledDatePicker onChange={handleSelect} weekStartsOn={1} minDate={min} maxDate={max} inset={inset || "0px auto auto 0px"} /> : null}
      </StyledDatePickerContainer>
    </Stack>
  );
};

const StyledDateRangePicker = styled(DateRange)(({ theme, position = "absolute", borderRadius = "8px" }) => ({
  "&.rdrDateRangePickerWrapper": {
    position,
    top: 0,
    left: 0,
    zIndex: 5,
    border: `1px solid ${theme.palette.neutral[300]}`,
    borderRadius,
  },

  ".rdrMonthPicker, .rdrYearPicker, .rdrNextPrevButton, .rdrNextPrevButton:hover": {
    background: theme.palette.primary.lightest,
  },

  ".rdrStartEdge, .rdrInRange, .rdrEndEdge": {
    color: `${theme.palette.info.main} !important`,
  },
}));

const INITIAL_DATE_RANGE = [null, new Date("")];

export const DateRangePicker: FC<DatePickerProps> = ({ value, onChange, min, max }) => {
  const [open, setOpen] = useState(false);

  const handleClickOutside = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const ref = useOutsideClick(handleClickOutside);

  const dateFormatter = useCallback((date) => {
    return moment(date).format("DD-MMM-YYYY");
  }, []);

  const handleSelect = useCallback(
    ({ selection: { startDate, endDate } }) => {
      onChange([startDate, moment(endDate)?.endOf("day")?.toDate()]);
    },
    [onChange],
  );

  const ranges = useMemo(() => {
    return [{ startDate: value[0], endDate: value[1], key: "selection" }];
  }, [value]);

  const clearValue = useCallback(
    (event) => {
      event.stopPropagation();
      onChange(INITIAL_DATE_RANGE);
    },
    [onChange],
  );

  const getDisplayDateRange = useCallback(() => {
    const startDate = isDate(value[0]) ? dateFormatter(value[0]) : null;
    const endDate = isDate(value[1]) ? dateFormatter(value[1]) : null;

    return startDate && endDate ? `${startDate} - ${endDate}` : "";
  }, [value, dateFormatter]);

  useEffect(() => {
    onChange(INITIAL_DATE_RANGE);
  }, [onChange]);

  return (
    <Stack>
      <TextField
        variant="outlined"
        size="small"
        placeholder="Start Date - End Date"
        value={getDisplayDateRange()}
        onClick={() => setOpen(true)}
        label="Date Range"
        InputProps={{
          readOnly: true,
          startAdornment: (
            <InputAdornment position="start">
              <MdEvent />
            </InputAdornment>
          ),
          ...(value[0] && value[1]
            ? {
                endAdornment: (
                  <InputAdornment position="start">
                    <IconButton aria-label="clear date" onClick={clearValue} edge="end" sx={{ p: 0 }}>
                      <AiOutlineClose size={16} />
                    </IconButton>
                  </InputAdornment>
                ),
              }
            : {}),
        }}
        sx={{ width: "260px" }}
      />
      <StyledDatePickerContainer ref={ref}>
        {open ? (
          <StyledDateRangePicker
            ranges={ranges}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            showDateDisplay={false}
            weekStartsOn={1}
            minDate={min}
            maxDate={max}
            inputRanges={[]}
          />
        ) : null}
      </StyledDatePickerContainer>
    </Stack>
  );
};

export const DateCalendar: FC<DatePickerProps> = ({ value, onChange, min, max }) => {
  const handleSelect = useCallback(
    (date) => {
      onChange(date);
    },
    [onChange],
  );

  return <StyledDatePicker date={value} onChange={handleSelect} weekStartsOn={1} minDate={min} maxDate={max} position="relative" />;
};

export const DateCalendarRange: FC<DatePickerProps> = ({ value, onChange, min, max }) => {
  const handleSelect = useCallback(
    ({ selection: { startDate, endDate } }) => {
      onChange([moment(startDate)?.startOf("day")?.toDate(), moment(endDate)?.endOf("day")?.toDate()]);
    },
    [onChange],
  );

  const ranges = useMemo(() => {
    return [{ startDate: value[0], endDate: value[1], key: "selection" }];
  }, [value]);

  return (
    <StyledDateRangePicker
      ranges={ranges}
      onChange={handleSelect}
      moveRangeOnFirstSelection={false}
      showDateDisplay={false}
      weekStartsOn={1}
      minDate={min}
      maxDate={max}
      inputRanges={[]}
      position="relative"
      borderRadius="0"
    />
  );
};

export default DatePicker;
