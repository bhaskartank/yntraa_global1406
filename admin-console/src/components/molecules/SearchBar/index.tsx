import { FormHelperText, IconButton, InputAdornment, TextField, TextFieldProps } from "@mui/material";
import React, { useEffect } from "react";
import { AiOutlineClose as CloseIcon, AiOutlineSearch as SearchIcon } from "react-icons/ai";

import { SearchBarProps } from "./model";

const SearchBar = ({
  label,
  placeholder,
  helpText,
  disabled,
  icon,
  primaryIconOverride,
  clearButton,
  onClear,
  externalStyles,
  secondaryComponentButtonOverride,
  size,
  width = "200px",
  defaultValue,
  onClick,
  onKeyDown,
  autoFocus,
  ...otherProps
}: TextFieldProps & SearchBarProps) => {
  const [value, setValue] = React.useState<string>("");

  const handleClear = () => {
    if (onClear !== undefined) {
      onClear();
    }
    setValue("");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);

    if (otherProps.onChange) {
      otherProps.onChange(event);
    }
  };

  useEffect(() => {
    if (defaultValue) setValue(String(defaultValue));
  }, [defaultValue]);

  return (
    <>
      <TextField
        disabled={disabled}
        autoFocus={autoFocus || false}
        label={label}
        variant="outlined"
        placeholder={placeholder}
        onChange={handleChange}
        onClick={onClick}
        value={value}
        defaultValue={defaultValue}
        size={size || "small"}
        InputProps={{
          startAdornment: icon && <InputAdornment position="start">{primaryIconOverride || <SearchIcon size={16} />}</InputAdornment>,
          endAdornment: clearButton && value && (
            <InputAdornment position="end">
              {secondaryComponentButtonOverride || (
                <IconButton onClick={handleClear} sx={{ padding: "0" }}>
                  <CloseIcon size={16} />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
        sx={{
          input: {
            px: "12px",
            pl: icon ? "0" : 2,
            width,
          },
          ".MuiInputBase-root": {
            borderRadius: "50px",
            backgroundColor: "background.paper",
            color: "common.black",
            transition: "300ms",
            pl: "11px",
          },
          ...externalStyles,
        }}
        fullWidth
        inputProps={{
          ...otherProps.inputProps,
        }}
        onKeyDown={onKeyDown}
      />
      {helpText && <FormHelperText>{helpText}</FormHelperText>}
    </>
  );
};

export default SearchBar;
