import { FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Checkbox as MuiCheckbox, Typography } from "@mui/material";
import { FC } from "react";

const Checkbox: FC<any> = ({ name, fieldSchema, formik, handleFocus }) => {
  return (
    <FormControl component="fieldset" error={formik?.touched[name] && Boolean(formik?.errors[name])}>
      <FormLabel component="legend">
        {fieldSchema?.label} {fieldSchema?.required ? <span>*</span> : null}
      </FormLabel>

      {fieldSchema?.description ? <Typography>{fieldSchema?.description}</Typography> : null}

      <FormGroup row>
        {fieldSchema?.options?.map((item) => (
          <FormControlLabel
            key={item?.value}
            control={
              <MuiCheckbox
                checked={formik?.values[name]?.includes(item?.value)}
                name={name}
                value={item?.value}
                onChange={formik?.handleChange}
                onBlur={formik?.handleBlur}
                onFocus={handleFocus}
              />
            }
            label={item?.label}
          />
        ))}
      </FormGroup>
      {formik?.touched[name] && (
        <>
          {Array.isArray(formik?.errors[name]) ? (
            formik?.errors[name].map((error, index) => <FormHelperText key={index}>{error}</FormHelperText>)
          ) : (
            <FormHelperText>{formik?.errors[name]}</FormHelperText>
          )}
        </>
      )}
    </FormControl>
  );
};

export default Checkbox;
