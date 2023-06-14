import { Box, Button, Divider, Grid, Stack } from "@mui/material";
import { FC, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

import DataField from "components/organisms/Form/DataField";
import { FormSchema } from "components/organisms/Form/model";
import useForm from "components/organisms/Form/useForm";

interface PublicIPFormProps {
  onSubmit: (payload: any) => void;
  defaultValues?: any;
  providers: any;
}

const PublicIPForm: FC<PublicIPFormProps> = ({ onSubmit, providers, defaultValues }) => {
  const navigate = useNavigate();

  const schema: FormSchema = useMemo(
    () => ({
      provider_id: {
        label: "Provider",
        initialValue: "",
        type: "select",
        ...(!defaultValues ? { validation: yup.string().required("Provider is required") } : {}),
        autoFocus: true,
        disabled: !!defaultValues,
        required: true,
      },
      public_ip: {
        label: "Public IP Pool",
        initialValue: defaultValues?.public_ip,
        type: "text",
        validation: yup.string().required("Weight is required"),
        required: true,
      },
      traffic_direction: {
        label: "Traffic Direction",
        initialValue: defaultValues?.public?.toString(),
        type: "select",
        description: "Required Format: 10.20.30.1 - 10.20.30.5",
        options: [
          { label: "Inbound", value: "inbound" },
          { label: "Outbound", value: "outbound" },
          { label: "Inbound or Outbound", value: "inbound or outbound" },
        ],
      },
    }),
    [defaultValues],
  );

  const { handleUpdateOptions, handleSubmit, formConfig } = useForm({ schema, onSubmit });

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
          {!defaultValues ? (
            <>
              <Grid item xs={12}>
                <DataField name="provider_id" formConfig={formConfig} />
              </Grid>
            </>
          ) : null}
          <Grid item xs={6}>
            <DataField name="public_ip" formConfig={formConfig} />
          </Grid>
          <Grid item xs={6}>
            <DataField name="traffic_direction" formConfig={formConfig} />
          </Grid>
        </Grid>
      </Box>

      <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} p={2}>
        <Button variant="outlined" fullWidth onClick={() => navigate(`/networks/public-ip-pools`)}>
          Cancel
        </Button>

        <Button color="primary" variant="contained" fullWidth type="submit">
          {defaultValues ? "Update" : "Submit"}
        </Button>
      </Stack>
    </Stack>
  );
};

export default PublicIPForm;
