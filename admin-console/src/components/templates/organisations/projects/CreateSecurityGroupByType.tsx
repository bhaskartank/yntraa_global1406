import { Box, Button, Divider, Grid, Stack } from "@mui/material";
import { FC, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";

import DataField from "components/organisms/Form/DataField";
import { FormSchema } from "components/organisms/Form/model";
import useForm from "components/organisms/Form/useForm";

interface CreateSecurityGroupByTypeProps {
  onSubmit: (payload: any) => void;
  types: any;
}

const CreateSecurityGroupByType: FC<CreateSecurityGroupByTypeProps> = ({ onSubmit, types }) => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const schema: FormSchema = useMemo(
    () => ({
      security_group_type: {
        label: "Security Group Type",
        initialValue: "",
        type: "select",
        validation: yup.string().required("Security Group Type is required"),
        options: [{ label: "", value: "" }],
        autoFocus: true,
        required: true,
      },
    }),
    [],
  );

  const { handleUpdateOptions, handleSubmit, formConfig } = useForm({ schema, onSubmit });

  useEffect(() => {
    if (types?.length) {
      const typesMapping = types?.map((type) => ({ label: type, value: type }));
      handleUpdateOptions("security_group_type", typesMapping);
    }
  }, [types, handleUpdateOptions]);

  return (
    <Stack justifyContent="space-between" component="form" onSubmit={handleSubmit} divider={<Divider flexItem />} sx={{ height: "100%" }}>
      <Box sx={{ overflowY: "auto", flex: 1, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <DataField name="security_group_type" formConfig={formConfig} />
          </Grid>
        </Grid>
      </Box>

      <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} p={1}>
        <Button variant="outlined" fullWidth onClick={() => navigate(`/organisations/projects/${projectId}/providers`)}>
          Cancel
        </Button>

        <Button color="primary" variant="contained" fullWidth type="submit">
          Create
        </Button>
      </Stack>
    </Stack>
  );
};

export default CreateSecurityGroupByType;
