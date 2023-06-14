import { useFormik } from "formik";
import { useCallback, useMemo, useState } from "react";
import * as yup from "yup";

import { FormSchema, Options, UseFormHook } from "./model";

export const useForm = (config: UseFormHook) => {
  const { schema, onSubmit } = config;

  const [formSchema, setFormSchema] = useState<FormSchema>(schema);

  const fields = useMemo(() => Object.keys(formSchema), [formSchema]);

  const validationSchema = useMemo(() => {
    const validationObject = {};
    fields.forEach((field) => (validationObject[field] = formSchema[field]?.validation));
    return yup.object(validationObject);
  }, [fields, formSchema]);

  const initialValues = useMemo(() => {
    const values = {};
    fields.forEach((field) => (values[field] = formSchema[field]?.initialValue));
    return values;
  }, [fields, formSchema]);

  const formik = useFormik({ initialValues, validationSchema, onSubmit, validateOnMount: true });
  const { setFieldValue, resetForm } = formik;

  const handleUpdateValue = useCallback(
    (field: string, value: any) => {
      setFieldValue(field, value);
    },
    [setFieldValue],
  );

  const handleUpdateOptions = useCallback(
    (field: string, options: Options[]) => {
      setFormSchema((current) => ({ ...current, [field]: { ...current[field], options } }));
    },
    [setFormSchema],
  );

  const watchValue = useCallback(
    (field: string) => {
      return formik.values[field];
    },
    [formik],
  );

  return {
    values: formik?.values,
    errors: formik?.errors,
    formConfig: { formSchema, formik },

    handleSubmit: formik.handleSubmit,
    submitForm: formik.submitForm,
    handleUpdateValue,
    handleUpdateOptions,
    watchValue,
    resetForm,
  };
};

export default useForm;
