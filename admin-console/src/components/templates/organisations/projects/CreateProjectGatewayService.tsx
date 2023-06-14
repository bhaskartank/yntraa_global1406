import { Box, Button, Divider, Grid, Stack } from "@mui/material";
import { FC, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";

import DataField from "components/organisms/Form/DataField";
import { FormSchema } from "components/organisms/Form/model";
import useForm from "components/organisms/Form/useForm";

interface CreateProjectGatewayServiceProps {
  onSubmit: (payload: any) => void;
}

const CreateProjectGatewayService: FC<CreateProjectGatewayServiceProps> = ({ onSubmit }) => {
  const { projectId, providerId } = useParams();
  const navigate = useNavigate();

  const schema: FormSchema = useMemo(
    () => ({
      service_name: {
        label: "Service Name",
        initialValue: "",
        type: "text",
        validation: yup.string().required("Service Name is required"),
        autoFocus: true,
        required: true,
      },
      service_protocol: {
        label: "Service Protocol",
        initialValue: "",
        type: "text",
        validation: yup.string().required("Service Protocol is required"),
        required: true,
      },
      service_gw_port: {
        label: "Service Port",
        initialValue: "",
        type: "text",
        validation: yup.string().required("Service Port is required"),
        required: true,
      },
      service_destination: {
        label: "Service Destination",
        initialValue: "",
        type: "text",
        validation: yup.string().required("Service Destination is required"),
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
            <DataField name="service_name" formConfig={formConfig} />
          </Grid>
          <Grid item xs={6}>
            <DataField name="service_protocol" formConfig={formConfig} />
          </Grid>
          <Grid item xs={6}>
            <DataField name="service_gw_port" formConfig={formConfig} />
          </Grid>
          <Grid item xs={6}>
            <DataField name="service_destination" formConfig={formConfig} />
          </Grid>
        </Grid>
      </Box>

      <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} p={1}>
        <Button variant="outlined" fullWidth onClick={() => navigate(`/organisations/projects/${projectId}/providers/${providerId}/gateway-services`)}>
          Cancel
        </Button>

        <Button color="primary" variant="contained" fullWidth type="submit">
          Create
        </Button>
      </Stack>
    </Stack>
  );
};

export default CreateProjectGatewayService;
