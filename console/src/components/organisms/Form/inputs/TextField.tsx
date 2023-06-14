import { FormControl, FormLabel, IconButton, InputAdornment, MenuItem, TextField as MuiTextField, Stack, Tooltip, Typography } from "@mui/material";
import { FC, useState } from "react";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";

const TextField: FC<any> = ({ name, fieldSchema, formik, handleFocus, sx = {} }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <FormControl error={formik?.touched[name] && Boolean(formik?.errors[name])} disabled={fieldSchema?.disabled} fullWidth={fieldSchema?.fullWidth || true} sx={{ ...sx }}>
      <FormLabel component="legend">
        {fieldSchema?.label} {fieldSchema?.required ? <span>*</span> : null}
      </FormLabel>

      {fieldSchema?.description ? <Typography>{fieldSchema?.description}</Typography> : null}

      <Stack direction="row" alignItems="center" gap={1}>
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
          onFocus={handleFocus}
          error={formik?.touched[name] && Boolean(formik?.errors[name])}
          helperText={formik?.touched[name] && formik?.errors[name]}
          inputProps={{ min: fieldSchema?.minValue, max: fieldSchema?.maxValue }}
          InputProps={{
            ...(fieldSchema?.startAdornment
              ? {
                  startAdornment: (
                    <InputAdornment position="start" sx={{ color: fieldSchema?.color || "common.black" }}>
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
                            {showPassword ? (
                              <MdOutlineVisibility color={fieldSchema?.iconColor || "common.black"} />
                            ) : (
                              <MdOutlineVisibilityOff color={fieldSchema?.iconColor || "common.black"} />
                            )}
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ) : (
                      <InputAdornment position="end" sx={{ color: fieldSchema?.color || "common.black" }}>
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
              if (fieldSchema?.type === "number" && ["e", "E", "+", "-"]?.includes(event?.key)) {
                event.preventDefault();
              }
              if (fieldSchema?.type !== "textarea" && event?.key === "Enter") {
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
        {fieldSchema?.suffix ? <Typography>{fieldSchema?.suffix}</Typography> : null}
      </Stack>
    </FormControl>
  );
};

export default TextField;
