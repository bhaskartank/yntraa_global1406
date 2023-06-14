import { Box, Button, Divider, Grid, Stack } from "@mui/material";
import { FC, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import DataField from "components/organisms/Form/DataField";
import { FormSchema } from "components/organisms/Form/model";
import useForm from "components/organisms/Form/useForm";

interface AvailabilityZoneFormProps {
  onSubmit: (payload: any) => void;
  defaultValues: any;
}

const AvailabilityZoneForm: FC<AvailabilityZoneFormProps> = ({ onSubmit, defaultValues }) => {
  const navigate = useNavigate();

  const schema: FormSchema = useMemo(
    () => ({
      is_public: {
        label: "Public",
        initialValue: defaultValues?.is_public?.toString() || "",
        type: "select",
        options: [
          { label: "True", value: "true" },
          { label: "False", value: "false" },
        ],
      },
      is_default: {
        label: "Default",
        initialValue: defaultValues?.is_default?.toString() || "",
        type: "select",
        options: [
          { label: "True", value: "true" },
          { label: "False", value: "false" },
        ],
      },
    }),
    [defaultValues],
  );

  const { handleSubmit, formConfig } = useForm({ schema, onSubmit });

  return (
    <Stack justifyContent="space-between" component="form" onSubmit={handleSubmit} divider={<Divider flexItem />} sx={{ height: "100%" }}>
      <Box sx={{ overflowY: "auto", flex: 1, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <DataField name="is_public" formConfig={formConfig} />
          </Grid>
          <Grid item xs={6}>
            <DataField name="is_default" formConfig={formConfig} />
          </Grid>
        </Grid>
      </Box>

      <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} p={1}>
        <Button variant="outlined" fullWidth onClick={() => navigate(`/providers/availability-zones`)}>
          Cancel
        </Button>

        <Button color="primary" variant="contained" fullWidth type="submit">
          Update
        </Button>
      </Stack>
    </Stack>
  );
};

export default AvailabilityZoneForm;
