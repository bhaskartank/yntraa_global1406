/* eslint-disable @typescript-eslint/ban-types */
import * as yup from "yup";

export type InputType = "text" | "textarea" | "password" | "number" | "select" | "multiselect" | "checkbox";

export interface Options {
  label: string;
  value: string | number;
}

export interface FieldSchema {
  label: string;
  placeholder?: string;
  initialValue: string | string[] | number | number[];
  validation?: yup.Schema;
  type: InputType;
  options?: Options[];
  minRows?: number;
  maxRows?: number;
  startAdornment?: React.ReactElement;
  endAdornment?: React.ReactElement;
  iconColor?: string;
  displayAdornmentTooltip?: boolean;
  noCopyPaste?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  required?: boolean;
}

export interface FormSchema {
  [key: string]: FieldSchema;
}

export interface UseFormHook {
  schema: FormSchema;
  onSubmit: (values: any) => void;
}

export interface FormConfig {
  schema: FormSchema;
  formSchema: FormSchema;
  fields: string[];
  validationSchema: yup.ObjectSchema<{}, yup.AnyObject, {}, "">;
  initialValues: any;
  formik: any;
  onSubmit: (values: any) => void;
  updateSchema: (field: string, config: FieldSchema) => void;
}

export interface DataFieldProps {
  name: string;
  formConfig: any;
}
