import { Autocomplete, Checkbox, FormControl, FormLabel, ListItemText, TextField as MuiTextField } from "@mui/material";
import { FC } from "react";

const Select: FC<any> = ({ name, fieldSchema, formik }) => {
  return (
    <FormControl error={formik?.touched[name] && Boolean(formik?.errors[name])} disabled={fieldSchema?.disabled} fullWidth={fieldSchema?.fullWidth || true}>
      <FormLabel component="legend">
        {fieldSchema?.label} {fieldSchema?.required ? <span>*</span> : null}
      </FormLabel>

      <Autocomplete
        multiple
        limitTags={3}
        fullWidth
        disableCloseOnSelect
        id={name}
        disabled={fieldSchema?.disabled}
        // autoFocus={fieldSchema?.autoFocus}
        placeholder={fieldSchema?.placeholder || fieldSchema?.label}
        getOptionLabel={(option) => option?.label}
        value={fieldSchema?.options?.filter((option) => formik.values[name]?.includes(option?.value))}
        onChange={(event, newValue) => {
          formik?.setFieldValue(
            name,
            newValue?.map((option) => option?.value),
          );
        }}
        onBlur={formik?.handleBlur}
        options={fieldSchema?.options || []}
        renderOption={(props, option, { selected }) => {
          return (
            <li {...props}>
              <Checkbox checked={selected} />
              <ListItemText primary={option?.label} sx={{ ml: 1 }} />
            </li>
          );
        }}
        renderInput={(params) => (
          <MuiTextField {...params} name={name} error={formik?.touched[name] && Boolean(formik?.errors[name])} helperText={formik?.touched[name] && formik?.errors[name]} />
        )}
      />
    </FormControl>
  );
};

export default Select;
