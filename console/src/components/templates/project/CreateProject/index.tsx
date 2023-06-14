import { Stack, Typography } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import * as yup from "yup";

import { FormContainer } from "components/atoms/FormWrapper";
import { FormSchema } from "components/organisms/Form/model";
import useForm from "components/organisms/Form/useForm";

import BasicDetail from "./BasicDetail";
import TechnicalDetail from "./TechnicalDetail";

interface CreateProjectProps {
  onSubmit: (payload: any) => void;
  onCancel: () => void;
}

const CreateProject: FC<CreateProjectProps> = ({ onSubmit, onCancel }) => {
  const schema: FormSchema = useMemo(
    () => ({
      name: {
        label: "Project Name",
        description: "Choose a friendly name for your project which is easy to remember.",
        placeholder: "Please enter project name",
        initialValue: "",
        validation: yup
          .string()
          .min(4, "Project name must have minimum 4 characters")
          .max(16, "Project name can have maximum 16 characters")
          .matches(/^[a-zA-Z][a-zA-Z0-9]*$/, "Project name can have only alphabets and numbers and it must start with an alphabet only")
          .required("Project name is required"),
        type: "text",
        autoFocus: true,
        required: true,
      },
      description: {
        label: "Project Description",
        description: "Description will be useful for groups, and distinguishing projects that share similar names.",
        placeholder: "Please enter project description",
        initialValue: "",
        validation: yup.string().required("Project description is required"),
        type: "textarea",
        minRows: 3,
        required: true,
      },
      projectStack: {
        label: "Project Stack Technology",
        description: "Choose the technologies you will be using on your project.",
        placeholder: "Please select project stack technology",
        initialValue: [],
        validation: yup.array().min(1, "At least one technology must be selected").required("Project stack technology is required"),
        type: "multiselect",
        options: [
          { label: "PHP", value: "PHP" },
          { label: "Java", value: "Java" },
          { label: "Scala", value: "Scala" },
        ],
        required: true,
      },
      projectEnvironment: {
        label: "Project Environment",
        description: "Select the project environment.",
        placeholder: "Please select project environment.",
        initialValue: "",
        validation: yup.string().required("Project environment is required"),
        type: "select",
        options: [
          { label: "PHP", value: "PHP" },
          { label: "Java", value: "Java" },
          { label: "Scala", value: "Scala" },
        ],
        required: true,
      },
      projectDatabase: {
        label: "Project Database",
        description: "Select a database for your project.",
        placeholder: "Please select project database",
        initialValue: "",
        validation: yup.string().required("Project database is required"),
        type: "select",
        options: [
          { label: "MySQL", value: "MySQL" },
          { label: "MongoDB", value: "MongoDB" },
          { label: "Oracle", value: "Oracle" },
          { label: "SQL Server", value: "SQL Server" },
          { label: "PostgreSQL", value: "PostgreSQL" },
        ],
        required: true,
      },
      projectDeploymentEnvironment: {
        label: "Project Deployment Environment",
        description: "Choose your project deployment environment",
        placeholder: "Please select project deployment environment",
        initialValue: "",
        validation: yup.string().required("Project deployment environment is required"),
        type: "select",
        options: [
          { label: "CentOS 7", value: "centos-7" },
          { label: "Ubuntu 18", value: "ubuntu-18" },
        ],
        required: true,
      },
    }),
    [],
  );

  const handleFormSubmit = useCallback(
    (payload) => {
      onSubmit({
        name: payload?.name,
        description: payload?.description,
        project_meta: [
          `environment:${payload?.projectEnvironment}`,
          `database:${payload?.projectDatabase}`,
          `deployment_environment:${payload?.projectDeploymentEnvironment}`,
          ...payload.projectStack.map((stack) => `stack_technologies:${stack}`),
        ],
      });
    },
    [onSubmit],
  );

  const { formConfig, submitForm, formErrors } = useForm({ schema, onSubmit: handleFormSubmit });

  const creationDisabled = useMemo(() => {
    return Boolean(formErrors?.project_name) || Boolean(formErrors?.subnet_name) || Boolean(formErrors?.project_address);
  }, [formErrors]);

  return (
    <FormContainer onCancel={onCancel} onSubmit={submitForm} submitDisabled={creationDisabled}>
      <Stack gap={6}>
        <Typography>
          Projects are organizational units that help manage and group resources, facilitating better resource management, collaboration, and access control within an account.
        </Typography>

        <BasicDetail formConfig={formConfig} />

        <TechnicalDetail formConfig={formConfig} />
      </Stack>
    </FormContainer>
  );
};

export default CreateProject;
