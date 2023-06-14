import { Divider, Stack, Typography } from "@mui/material";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

import KeyValuePair from "components/atoms/KeyValuePair";
import StepperForm from "components/molecules/StepperForm";
import { FormSchema } from "components/organisms/Form/model";
import useForm from "components/organisms/Form/useForm";

import AddUsers from "./sections/AddUsers";
import OrganisationDetails from "./sections/OrganisationDetails";
import OtherDetails from "./sections/OtherDetails";
import ProjectDetails from "./sections/ProjectDetails";

interface CreateOrganisationOnboardingRequestProps {
  handleCreate: (payload: any) => void;
  users: any[];
  quotaPackages: any[];
  providers: any[];
  fetchQuotaPackages: (providerId: string | number) => void;
}

const CreateOrganisationOnboardingRequest: FC<CreateOrganisationOnboardingRequestProps> = ({ handleCreate, users, quotaPackages, providers, fetchQuotaPackages }) => {
  const navigate = useNavigate();

  const [completedSteps, setCompletedSteps] = useState<{ [step: number]: boolean }>({});

  const schema: FormSchema = useMemo(
    () => ({
      org_reg_code: {
        label: "Cloud Reg. A/C No.",
        initialValue: "",
        type: "text",
        validation: yup.string().min(15, "Cloud Reg. A/C No. must be at least 15 characters long").required("Cloud Reg. A/C No. is required"),
        required: true,
        autoFocus: true,
      },
      name: {
        label: "Organisation Name",
        initialValue: "",
        type: "text",
        validation: yup.string().min(4, "Organisation name must be at least 4 characters long").required("Organisation Name is required"),
        required: true,
      },
      description: {
        label: "Organisation Description",
        initialValue: "",
        type: "textarea",
        validation: yup.string().min(10, "Description must be at least 10 characters long").required("Cloud Reg. A/C No. is required"),
        required: true,
        minRows: 5,
      },
      project_name: {
        label: "Project Name",
        initialValue: "",
        type: "text",
        validation: yup.string().min(4, "Project name must be at least 4 characters long").max(32, "Project name can have upto 32 characters").required("Project Name is required"),
        required: true,
      },
      project_description: {
        label: "Project Description",
        initialValue: "",
        type: "textarea",
        validation: yup.string().min(10, "Project description must be at least 10 characters long").required("Project Description is required"),
        required: true,
        minRows: 5,
      },
      technologyUsed: {
        label: "Project Stack",
        initialValue: "",
        type: "select",
        validation: yup.string().required("Project Stack is required"),
        options: [
          { label: "PHP", value: "PHP" },
          { label: "Java", value: "Java" },
          { label: "Scala", value: "Scala" },
        ],
        required: true,
      },
      environment: {
        label: "Project Environment",
        initialValue: "",
        type: "select",
        validation: yup.string().required("Project Environment is required"),
        options: [
          { label: "PHP", value: "PHP" },
          { label: "Java", value: "Java" },
          { label: "Scala", value: "Scala" },
        ],
        required: true,
      },
      database: {
        label: "Project Database",
        initialValue: "",
        type: "select",
        validation: yup.string().required("Project Database is required"),
        options: [
          { label: "MySQL", value: "MySQL" },
          { label: "MongoDB", value: "MongoDB" },
          { label: "Oracle", value: "Oracle" },
          { label: "SQL Server", value: "SQL Server" },
          { label: "PostgreSQL", value: "PostgreSQL" },
        ],
        required: true,
      },
      deployment_environment: {
        label: "Deployment Environment",
        initialValue: "",
        type: "select",
        validation: yup.string().required("Deployment Environment is required"),
        options: [
          { label: "CentOS 7", value: "centos-7" },
          { label: "Ubuntu 18", value: "ubuntu-18" },
        ],
        required: true,
      },
      user_details: {
        label: "Select Users",
        initialValue: [],
        type: "multiselect",
        validation: yup.array().min(1, "At least one user should be selected").required("Users is required"),
        options: [],
        required: true,
      },
      provider_id: {
        label: "Select Provider",
        initialValue: "",
        type: "select",
        validation: yup.string().required("Provider is required"),
        options: [],
        required: true,
      },
      quotapackage_name: {
        label: "Select Quota Package",
        initialValue: "",
        type: "select",
        validation: yup.string().required("Quota Package is required"),
        options: [],
        required: true,
      },
    }),
    [],
  );

  const handleFormSubmit = useCallback(
    (values) => {
      const formValues = {
        name: values?.name,
        org_reg_code: values?.org_reg_code,
        description: values?.description,
        project_name: values?.project_name,
        project_description: values?.project_description,
        quotapackage_name: values?.quotapackage_name,
        provider_location: providers?.find((provider) => provider?.id?.toString() === values?.provider_id?.toString())?.provider_location,
        project_meta: [
          `technologyUsed:${values?.technologyUsed}`,
          `environment:${values?.environment}`,
          `database:${values?.database}`,
          `deployment_environment:${values?.deployment_environment}`,
        ],
        user_details: JSON.stringify(values?.user_details?.map((userId) => users?.find((user) => user?.id === userId))),
      };

      handleCreate(formValues);
    },
    [handleCreate, providers, users],
  );

  const { handleSubmit, submitForm, handleUpdateOptions, formConfig, errors, values } = useForm({
    schema,
    onSubmit: handleFormSubmit,
  });

  const selectedUsersList = useMemo(() => {
    return values?.user_details?.map((userId) => users?.find((user) => user?.id === userId));
  }, [users, values]);

  useEffect(() => {
    setCompletedSteps({
      0: !errors?.name && !errors?.org_reg_code && !errors?.description,
      1: !errors?.project_name && !errors?.technologyUsed && !errors?.environment && !errors?.database && !errors?.deployment_environment && !errors?.project_description,
      2: !errors?.user_details,
      3: !errors?.quotapackage_name && !errors?.provider_id,
      4: false,
    });
  }, [errors]);

  useEffect(() => {
    handleUpdateOptions(
      "user_details",
      users?.map((user) => ({ label: `${user?.first_name} ${user?.middle_name} ${user?.last_name} (${user?.email})`?.replaceAll("  ", " "), value: user?.id })),
    );
  }, [handleUpdateOptions, users]);

  useEffect(() => {
    handleUpdateOptions(
      "quotapackage_name",
      quotaPackages?.map(({ quotapackage }) => ({ label: `${quotapackage?.name} (${quotapackage?.version})`, value: quotapackage?.name })),
    );
  }, [handleUpdateOptions, quotaPackages]);

  useEffect(() => {
    if (providers?.length) {
      const providersMapping =
        providers?.map((provider) => ({
          label: `${provider?.provider_name} (${provider?.provider_id}) [${provider?.provider_location}]`,
          value: String(provider?.id),
        })) || [];
      handleUpdateOptions("provider_id", providersMapping);
    }
  }, [providers, handleUpdateOptions]);

  useEffect(() => {
    if (values?.provider_id) {
      fetchQuotaPackages(values?.provider_id);
    }
  }, [fetchQuotaPackages, values?.provider_id]);

  const formSummary = useMemo(() => {
    return [
      {
        heading: "Organisation Details",
        items: [
          { label: "Organisation Name", value: values?.name },
          { label: "Cloud Reg. A/C No.", value: values?.org_reg_code },
          { label: "Organisation Description", value: values?.description },
        ],
      },
      {
        heading: "Project Details",
        items: [
          { label: "Project Name", value: values?.project_name },
          { label: "Project Stack", value: values?.technologyUsed },
          { label: "Environment", value: values?.environment },
          { label: "Deployment Environment", value: values?.deployment_environment },
          { label: "Project Description", value: values?.project_description },
        ],
      },
      {
        heading: "User Details",
        items: [
          {
            label: "Users",
            value: values?.user_details
              ?.map((userId) => {
                const userDetail = users?.find((user) => user?.id === userId);

                return `${userDetail?.first_name} ${userDetail?.middle_name} ${userDetail?.last_name}`?.replaceAll("  ", " ");
              })
              ?.join(", "),
          },
        ],
      },
      {
        heading: "Other Details",
        items: [
          { label: "Provider Location", value: providers?.find((provider) => provider?.provider_id?.toString() === values?.id?.toString())?.provider_location },
          { label: "Quota Package Name", value: values?.quotapackage_name },
          // { label: "Request Origin", value: values?.request_origin },
        ],
      },
    ];
  }, [providers, users, values]);

  return (
    <Stack justifyContent="space-between" component="form" onSubmit={handleSubmit} divider={<Divider flexItem />} sx={{ height: "100%" }}>
      <StepperForm
        completedSteps={completedSteps}
        onSubmit={submitForm}
        onCancel={() => navigate("/providers")}
        steps={[
          {
            label: "Organisation Details",
            content: <OrganisationDetails formConfig={formConfig} />,
          },
          {
            label: "Project Details",
            content: <ProjectDetails formConfig={formConfig} />,
          },
          {
            label: "Add Users",
            content: <AddUsers formConfig={formConfig} data={selectedUsersList} />,
          },
          {
            label: "Other Details",
            content: <OtherDetails formConfig={formConfig} />,
          },
          {
            label: "Confirm & Submit",
            content: (
              <Stack gap={2} divider={<Divider />}>
                {formSummary?.map((group) => (
                  <Stack key={group?.heading} gap={2} sx={{ color: "#000000" }}>
                    <Typography variant="h5">{group?.heading}</Typography>

                    <Stack gap={1}>
                      {group?.items?.map((item) => (
                        <KeyValuePair key={item?.label} label={item?.label} value={item?.value} />
                      ))}
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            ),
          },
        ]}
      />
    </Stack>
  );
};

export default CreateOrganisationOnboardingRequest;
