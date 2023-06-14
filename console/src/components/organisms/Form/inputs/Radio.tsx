import { FormControl, FormControlLabel, FormHelperText, FormLabel, Radio as MuiRadio, RadioGroup, Typography } from "@mui/material";
import { FC } from "react";

const Radio: FC<any> = ({ name, fieldSchema, formik, handleFocus }) => {
  return (
    <FormControl component="fieldset" error={formik?.touched[name] && Boolean(formik?.errors[name])}>
      <FormLabel component="legend">
        {fieldSchema?.label} {fieldSchema?.required ? <span>*</span> : null}
      </FormLabel>

      {fieldSchema?.description ? <Typography>{fieldSchema?.description}</Typography> : null}

      <RadioGroup row name={name} value={formik?.values[name]} onChange={formik?.handleChange} onBlur={formik?.handleBlur} onFocus={handleFocus}>
        {fieldSchema?.options?.map((item) => (
          <FormControlLabel key={item?.value} control={<MuiRadio />} label={item?.label} value={item?.value} />
        ))}
      </RadioGroup>
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

export default Radio;
