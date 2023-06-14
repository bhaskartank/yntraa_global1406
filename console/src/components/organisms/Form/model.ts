/* eslint-disable @typescript-eslint/ban-types */
import { FormikHelpers } from "formik";

export type InputType = "text" | "textarea" | "password" | "number" | "select" | "multiselect" | "checkbox" | "radio";

export interface Options {
  label: string;
  value: string | number;
}

export interface FieldSchema {
  label: string;
  placeholder?: string;
  initialValue: string | string[] | number | number[];
  minValue?: number;
  maxValue?: number;
  validation?: any;
  type: InputType;
  options?: Options[];
  minRows?: number;
  maxRows?: number;
  startAdornment?: React.ReactElement | string;
  endAdornment?: React.ReactElement | string;
  iconColor?: string;
  displayAdornmentTooltip?: boolean;
  noCopyPaste?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  suffix?: string;
  description?: string;
}

export interface FormSchema {
  [key: string]: FieldSchema;
}

export interface UseFormHook {
  schema: FormSchema;
  onSubmit: (values: any, formikHelpers: FormikHelpers<any>) => void;
}

export interface FormConfig {
  schema: FormSchema;
  formSchema: FormSchema;
  fields: string[];
  validationSchema: any;
  initialValues: any;
  formik: any;
  onSubmit: (values: any, formikHelpers: FormikHelpers<any>) => void;
  updateSchema: (field: string, config: FieldSchema) => void;
}

export interface DataFieldProps {
  name: string;
  formConfig: any;
  sx?: any;
}
