import { Box, Checkbox, FormControl, ListItemText, MenuItem, Select } from "@mui/material";
import * as React from "react";

export interface ControlledSelectProps {
  label?: string;
  placeholder?: string;
  size?: "small" | "medium";
  list: any[];
  onChange: (e: React.ChangeEvent<HTMLInputElement> | any) => void;
  disabled?: boolean;
  value?: string | string[] | null;
  required?: boolean;
  width?: string | number;
  sx?: any;
  defaultMenu?: any;
  name?: string;
  singleAsDefault?: boolean;
  firstAsDefault?: boolean;
  multiple?: boolean;
}

const ControlledSelect = (props: ControlledSelectProps) => {
  const {
    label,
    placeholder = "Select",
    size = "small",
    list = [],
    required = false,
    onChange,
    disabled = false,
    value,
    width = "240px",
    sx,
    defaultMenu,
    name,
    singleAsDefault = false,
    firstAsDefault = false,
    multiple = false,
  } = props;

  // const isIndeterminate: boolean = React.useMemo(() => multiple && value?.length > 0 && value?.length < list?.length, [multiple, value, list]);
  // const isDeterminate: boolean = React.useMemo(() => multiple && value?.length === list?.length, [multiple, value, list]);

  // const handleSelectAll = (event: any) => {
  //   if (event?.target?.checked) {
  //     onChange(list?.map((option) => String(option?.value)));
  //   } else {
  //     onChange([]);
  //   }
  // };

  // const handleClearAll = () => {
  //   onChange([]);
  // };

  React.useEffect(() => {
    if ((singleAsDefault && !multiple && list?.length === 1) || (firstAsDefault && list?.length)) {
      onChange(list[0]?.value);
    }
  }, [firstAsDefault, singleAsDefault, list, multiple, onChange]);

  return (
    <FormControl sx={{ m: 0, minWidth: width }} size={size}>
      <Select
        displayEmpty
        renderValue={(selected) => {
          if (!selected?.length) {
            return (
              <Box component="span" sx={{ color: "text.secondary" }}>
                {placeholder}
              </Box>
            );
          }

          return multiple
            ? selected?.map((option) => list?.find((item) => item?.value === option)?.label || "")?.join(", ")
            : list?.find((item) => item?.value === selected)?.label || "";
        }}
        name={name}
        required={required}
        disabled={disabled}
        value={value}
        multiple={multiple}
        onChange={(event) => onChange(event.target.value)}
        defaultValue={defaultMenu?.value}
        sx={{
          borderRadius: "50px",
          backgroundColor: "primary.light",
          ...sx,
        }}
        MenuProps={{
          PaperProps: {
            sx: { py: 0, maxHeight: "300px" },
          },
        }}>
        {list.map((item: any) => (
          <MenuItem key={item?.value} value={item?.value}>
            {multiple ? (
              <>
                <Checkbox checked={value?.includes(item?.value)} size="small" sx={{ py: 0, px: 1 }} />
                <ListItemText primary={item?.label || item?.value} />
              </>
            ) : (
              <>{item?.label || item?.value}</>
            )}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ControlledSelect;
