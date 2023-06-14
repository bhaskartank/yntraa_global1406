import { FC, useMemo } from "react";

import Checkbox from "./inputs/Checkbox";
import Select from "./inputs/Select";
import TextField from "./inputs/TextField";
import { DataFieldProps } from "./model";

const DataField: FC<DataFieldProps> = (props) => {
  const { name, formConfig } = props;

  const fieldSchema = useMemo(() => formConfig?.formSchema[name], [name, formConfig]);

  switch (fieldSchema?.type) {
    case "text":
    case "textarea":
    case "number":
    case "password":
    case "select":
      return <TextField name={name} fieldSchema={fieldSchema} formik={formConfig?.formik} />;
    case "multiselect":
      return <Select name={name} fieldSchema={fieldSchema} formik={formConfig?.formik} />;
    case "checkbox":
      return <Checkbox name={name} fieldSchema={fieldSchema} formik={formConfig?.formik} />;
  }
};

export default DataField;
