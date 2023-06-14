import { FormControl, FormLabel, IconButton, InputAdornment, MenuItem, TextField as MuiTextField, Tooltip } from "@mui/material";
import { FC, useState } from "react";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";

const TextField: FC<any> = ({ name, fieldSchema, formik }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <FormControl component="fieldset" error={formik?.touched[name] && Boolean(formik?.errors[name])} disabled={fieldSchema?.disabled} fullWidth>
      <FormLabel component="legend">
        {fieldSchema?.label} {fieldSchema?.required ? <span>*</span> : null}
      </FormLabel>
      <MuiTextField
        fullWidth
        id={name}
        name={name}
        disabled={fieldSchema?.disabled}
        type={showPassword ? "text" : fieldSchema?.type}
        select={fieldSchema?.type === "select"}
        multiline={fieldSchema?.type === "textarea"}
        {...(fieldSchema?.type === "textarea" && fieldSchema?.minRows ? { minRows: fieldSchema?.minRows } : {})}
        {...(fieldSchema?.type === "textarea" && (fieldSchema?.maxRows || fieldSchema?.minRows) ? { maxRows: fieldSchema?.maxRows || fieldSchema?.minRows } : {})}
        autoFocus={fieldSchema?.autoFocus}
        placeholder={fieldSchema?.placeholder || fieldSchema?.label}
        value={formik?.values[name]}
        onChange={formik?.handleChange}
        onBlur={formik?.handleBlur}
        error={formik?.touched[name] && Boolean(formik?.errors[name])}
        helperText={formik?.touched[name] && formik?.errors[name]}
        InputProps={{
          ...(fieldSchema?.startAdornment
            ? {
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: fieldSchema?.color || "black" }}>
                    {fieldSchema?.startAdornment}
                  </InputAdornment>
                ),
              }
            : {}),
          ...(fieldSchema?.endAdornment || fieldSchema?.type === "password"
            ? {
                endAdornment:
                  fieldSchema?.type === "password" ? (
                    <InputAdornment position="end">
                      <Tooltip title={fieldSchema?.displayAdornmentTooltip ? (showPassword ? "Hide" : "Show") : ""} placement="top">
                        <IconButton
                          tabIndex={-1}
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword((current) => !current)}
                          onMouseDown={(event) => event.preventDefault()}
                          edge="end">
                          {showPassword ? <MdOutlineVisibility color={fieldSchema?.iconColor || "black"} /> : <MdOutlineVisibilityOff color={fieldSchema?.iconColor || "black"} />}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ) : (
                    <InputAdornment position="end" sx={{ color: fieldSchema?.color || "black" }}>
                      {fieldSchema?.endAdornment}
                    </InputAdornment>
                  ),
              }
            : {}),
          ...(fieldSchema?.noCopyPaste
            ? {
                onCopy: (event) => {
                  event.preventDefault();
                  return false;
                },
                onPaste: (event) => {
                  event.preventDefault();
                  return false;
                },
              }
            : {}),
          onKeyDown: (event) => {
            if (event?.key === "Enter" && fieldSchema?.type !== "textarea") {
              event.preventDefault();
              formik.submitForm();
            }
          },
        }}>
        {fieldSchema?.type === "select"
          ? fieldSchema?.options?.map((option) => (
              <MenuItem key={option?.value} value={option?.value}>
                {option?.label}
              </MenuItem>
            ))
          : null}
      </MuiTextField>
    </FormControl>
  );
};

export default TextField;
