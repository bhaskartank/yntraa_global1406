import { Box, Button, Divider, Grid, Stack } from "@mui/material";
import { FC, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

import DataField from "components/organisms/Form/DataField";
import { FormSchema } from "components/organisms/Form/model";
import useForm from "components/organisms/Form/useForm";

interface CreateUserProps {
  handleCreate: (payload: any) => void;
}

const CreateUser: FC<CreateUserProps> = ({ handleCreate }) => {
  const navigate = useNavigate();

  const schema: FormSchema = useMemo(
    () => ({
      first_name: {
        label: "First Name",
        initialValue: "",
        type: "text",
        validation: yup.string().required("First Name is required"),
        autoFocus: true,
        required: true,
      },
      middle_name: {
        label: "Middle Name",
        initialValue: "",
        type: "text",
      },
      last_name: {
        label: "Last Name",
        initialValue: "",
        type: "text",
      },
      mobile_no: {
        label: "Mobile Number",
        initialValue: "",
        type: "text",
      },
      email: {
        label: "Email",
        initialValue: "",
        type: "text",
        validation: yup.string().email("Email is invalid").required("Email is required"),
        required: true,
      },
      password: {
        label: "Password",
        initialValue: "",
        type: "password",
        validation: yup.string().required("Password is required"),
        required: true,
      },
      user_role: {
        label: "User Role",
        initialValue: "",
        type: "select",
        validation: yup.string().required("User Role is required"),
        options: [
          { label: "Admin", value: "admin" },
          { label: "Internal", value: "internal" },
        ],
        required: true,
      },
      user_type: {
        label: "User Type",
        initialValue: "",
        type: "select",
        validation: yup.string().required("User Type is required"),
        options: [
          { label: "API", value: "api" },
          { label: "Normal", value: "normal" },
        ],
        required: true,
      },
      is_2fa: {
        label: "Two Factor Authentication",
        initialValue: "",
        type: "select",
        validation: yup.string().required("Two Factor Authentication is required"),
        options: [
          { label: "Yes", value: "true" },
          { label: "No", value: "false" },
        ],
        required: true,
      },
      is_csrf_token: {
        label: "CSRF Token",
        initialValue: "",
        type: "select",
        validation: yup.string().required("CSRF Token is required"),
        options: [
          { label: "Yes", value: "true" },
          { label: "No", value: "false" },
        ],
        required: true,
      },
    }),
    [],
  );

  const { handleSubmit, formConfig } = useForm({ schema, onSubmit: (values) => handleCreate({ ...values, username: values.email }) });

  return (
    <Stack justifyContent="space-between" component="form" onSubmit={handleSubmit} divider={<Divider flexItem />} sx={{ height: "100%" }}>
      <Box sx={{ overflowY: "auto", flex: 1, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <DataField name="first_name" formConfig={formConfig} />
          </Grid>
          <Grid item xs={4}>
            <DataField name="middle_name" formConfig={formConfig} />
          </Grid>
          <Grid item xs={4}>
            <DataField name="last_name" formConfig={formConfig} />
          </Grid>
          <Grid item xs={6}>
            <DataField name="email" formConfig={formConfig} />
          </Grid>
          <Grid item xs={6}>
            <DataField name="password" formConfig={formConfig} />
          </Grid>
          <Grid item xs={6}>
            <DataField name="mobile_no" formConfig={formConfig} />
          </Grid>
          <Grid item xs={6}>
            <DataField name="is_2fa" formConfig={formConfig} />
          </Grid>
          <Grid item xs={4}>
            <DataField name="user_role" formConfig={formConfig} />
          </Grid>
          <Grid item xs={4}>
            <DataField name="user_type" formConfig={formConfig} />
          </Grid>
          <Grid item xs={4}>
            <DataField name="is_csrf_token" formConfig={formConfig} />
          </Grid>
        </Grid>
      </Box>

      <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} p={1}>
        <Button variant="outlined" fullWidth onClick={() => navigate("/providers")}>
          Cancel
        </Button>
        <Button color="primary" variant="contained" fullWidth type="submit">
          Create
        </Button>
      </Stack>
    </Stack>
  );
};

export default CreateUser;
