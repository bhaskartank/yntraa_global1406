import { FC, useCallback, useMemo } from "react";

import Checkbox from "./inputs/Checkbox";
import MultiSelect from "./inputs/MultiSelect";
import Radio from "./inputs/Radio";
import TextField from "./inputs/TextField";
import { DataFieldProps } from "./model";

const DataField: FC<DataFieldProps> = (props) => {
  const { name, formConfig, sx } = props;

  const handleFocus = useCallback(() => {
    // TODO: Uncomment this if want to validate the field onFocus instead of onBlur
    // if (!formConfig?.formik.touched[name]) {
    //   formConfig?.formik.setFieldTouched(name, true);
    // }
  }, [formConfig?.formik?.touched, name]);

  const fieldSchema = useMemo(() => formConfig?.formSchema[name], [name, formConfig]);

  switch (fieldSchema?.type) {
    case "text":
    case "textarea":
    case "number":
    case "select":
    case "password":
      return <TextField name={name} fieldSchema={fieldSchema} formik={formConfig?.formik} handleFocus={handleFocus} sx={sx} />;
    case "checkbox":
      return <Checkbox name={name} fieldSchema={fieldSchema} formik={formConfig?.formik} handleFocus={handleFocus} />;
    case "radio":
      return <Radio name={name} fieldSchema={fieldSchema} formik={formConfig?.formik} handleFocus={handleFocus} />;
    case "multiselect":
      return <MultiSelect name={name} fieldSchema={fieldSchema} formik={formConfig?.formik} handleFocus={handleFocus} />;
  }
};

export default DataField;
