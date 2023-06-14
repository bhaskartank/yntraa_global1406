import { Box, Button, Divider, Grid, Stack } from "@mui/material";
import { FC, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";

import DataField from "components/organisms/Form/DataField";
import { FormSchema } from "components/organisms/Form/model";
import useForm from "components/organisms/Form/useForm";

interface ApplyDefaultRuleWithProjectProps {
  onSubmit: (payload: any) => void;
}

const ApplyDefaultRuleWithProject: FC<ApplyDefaultRuleWithProjectProps> = ({ onSubmit }) => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const schema: FormSchema = useMemo(
    () => ({
      resource_type: {
        label: "Resource Type",
        initialValue: "",
        type: "select",
        validation: yup.string().required("Resource Type is required"),
        options: [
          { label: "Virtual Machine", value: "vm" },
          { label: "Gateway", value: "gateway" },
          { label: "NKS Default", value: "nks_default" },
        ],
        autoFocus: true,
        required: true,
      },
    }),
    [],
  );

  const { handleSubmit, formConfig } = useForm({ schema, onSubmit });

  return (
    <Stack justifyContent="space-between" component="form" onSubmit={handleSubmit} divider={<Divider flexItem />} sx={{ height: "100%" }}>
      <Box sx={{ overflowY: "auto", flex: 1, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <DataField name="resource_type" formConfig={formConfig} />
          </Grid>
        </Grid>
      </Box>

      <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} p={1}>
        <Button variant="outlined" fullWidth onClick={() => navigate(`/organisations/projects/${projectId}/providers`)}>
          Cancel
        </Button>

        <Button color="primary" variant="contained" fullWidth type="submit">
          Apply
        </Button>
      </Stack>
    </Stack>
  );
};

export default ApplyDefaultRuleWithProject;
