import { Box, Button, Divider, Grid, Stack } from "@mui/material";
import { FC, useEffect, useMemo } from "react";
import * as yup from "yup";

import DataField from "components/organisms/Form/DataField";
import { FormSchema } from "components/organisms/Form/model";
import useForm from "components/organisms/Form/useForm";

interface OrganisationMappingProps {
  onSubmit: (payload: any) => void;
  onCancel: () => void;
  organisations: any[];
}

const OrganisationMapping: FC<OrganisationMappingProps> = ({ onSubmit, onCancel, organisations }) => {
  const schema: FormSchema = useMemo(
    () => ({
      organisation_id: {
        label: "Organisation",
        initialValue: "",
        validation: yup.string().required("Organisation is required"),
        type: "select",
        required: true,
      },
    }),
    [],
  );

  const { handleUpdateOptions, handleSubmit, formConfig } = useForm({ schema, onSubmit });

  useEffect(() => {
    if (organisations?.length) {
      const organisationMapping = organisations?.map((organisation) => ({ label: `${organisation?.name} (${organisation?.org_id})`, value: organisation?.id }));
      handleUpdateOptions("organisation_id", organisationMapping);
    }
  }, [organisations, handleUpdateOptions]);

  return (
    <Stack justifyContent="space-between" component="form" onSubmit={handleSubmit} divider={<Divider flexItem />} sx={{ height: "100%" }}>
      <Box sx={{ overflowY: "auto", flex: 1, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <DataField name="organisation_id" formConfig={formConfig} />
          </Grid>
        </Grid>
      </Box>

      <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} p={1}>
        <Button variant="outlined" fullWidth onClick={onCancel}>
          Cancel
        </Button>

        <Button color="primary" variant="contained" fullWidth type="submit">
          Submit
        </Button>
      </Stack>
    </Stack>
  );
};

export default OrganisationMapping;
