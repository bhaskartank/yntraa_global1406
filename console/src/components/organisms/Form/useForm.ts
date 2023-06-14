import { useFormik } from "formik";
import { useCallback, useMemo, useState } from "react";
import * as yup from "yup";

import { FieldSchema, FormSchema, Options, UseFormHook } from "./model";

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

  const handleAddField = useCallback(
    (field: string, schema: FieldSchema) => {
      setFormSchema((current) => ({ ...current, [field]: schema }));
      handleUpdateValue(field, schema?.initialValue);
    },
    [setFormSchema, handleUpdateValue],
  );

  const handleRemoveFields = useCallback(
    (fields: string[]) => {
      const formSchemaCopy = Object.assign({}, formSchema);

      fields?.forEach((field) => {
        delete formSchemaCopy[field];

        delete formik?.values[field];
        delete formik?.errors[field];
        delete formik?.touched[field];
      });

      setFormSchema(formSchemaCopy);
      formik.setValues(formik.values);
    },
    [setFormSchema, formSchema, formik],
  );

  const handleUpdateKey = useCallback(
    (field: string, obj: any) => {
      setFormSchema((current) => {
        const schema = { ...current, [field]: { ...current[field], ...obj } };
        return schema;
      });
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
    formConfig: { formSchema, formik },
    formErrors: formik?.errors,

    handleSubmit: formik.handleSubmit,
    submitForm: formik.submitForm,
    handleUpdateValue,
    handleUpdateOptions,
    handleAddField,
    handleRemoveFields,
    handleUpdateKey,
    watchValue,
    resetForm,
  };
};

export default useForm;
