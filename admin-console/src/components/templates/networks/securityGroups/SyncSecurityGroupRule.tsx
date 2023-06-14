import { Box, Button, Divider, Grid, Stack } from "@mui/material";
import { FC, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

import DataField from "components/organisms/Form/DataField";
import { FormSchema } from "components/organisms/Form/model";
import useForm from "components/organisms/Form/useForm";

const sourceMapping = [
  { label: "Database", value: "database" },
  { label: "Openstack (Horizon)", value: "openstack" },
];
const removeExtraMapping = [
  { label: "True", value: "true" },
  { label: "False", value: "false" },
];

interface SyncSecurityGroupRuleProps {
  handleCreate: (payload: any) => void;
  providers: any[];
}

const SyncSecurityGroupRule: FC<SyncSecurityGroupRuleProps> = ({ handleCreate, providers }) => {
  const navigate = useNavigate();

  const schema: FormSchema = useMemo(
    () => ({
      source: {
        label: "Source",
        initialValue: "",
        validation: yup.string().required("Source is required"),
        type: "select",
        options: sourceMapping,
        autoFocus: true,
      },
      remove_extra_rule: {
        label: "Remove Extra Rule",
        initialValue: "",
        validation: yup.string().required("Remove Extra Rule is required"),
        type: "select",
        options: removeExtraMapping,
      },
    }),
    [],
  );

  const { handleUpdateOptions, handleSubmit, formConfig } = useForm({ schema, onSubmit: handleCreate });

  useEffect(() => {
    if (providers?.length) {
      const providersMapping = providers?.map((provider) => ({ label: `${provider?.provider_name} (${provider?.provider_id})`, value: String(provider?.id) })) || [];
      handleUpdateOptions("provider_id", providersMapping);
    }
  }, [providers, handleUpdateOptions]);

  return (
    <Stack justifyContent="space-between" component="form" onSubmit={handleSubmit} divider={<Divider flexItem />} sx={{ height: "100%" }}>
      <Box sx={{ overflowY: "auto", flex: 1, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <DataField name="source" formConfig={formConfig} />
          </Grid>
          <Grid item xs={6}>
            <DataField name="remove_extra_rule" formConfig={formConfig} />
          </Grid>
        </Grid>
      </Box>

      <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} p={2}>
        <Button variant="outlined" fullWidth onClick={() => navigate("/networks/security-groups")}>
          Cancel
        </Button>

        <Button color="primary" variant="contained" fullWidth type="submit">
          Submit
        </Button>
      </Stack>
    </Stack>
  );
};

export default SyncSecurityGroupRule;
