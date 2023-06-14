import { Box, Button, Divider, Grid, Stack } from "@mui/material";
import { FC, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

import DataField from "components/organisms/Form/DataField";
import { FormSchema } from "components/organisms/Form/model";
import useForm from "components/organisms/Form/useForm";

const directionMapping = [
  { label: "Ingress", value: "ingress" },
  { label: "Egress", value: "egress" },
];
const protocolMapping = [
  { label: "TCP", value: "tcp" },
  { label: "UDP", value: "udp" },
  { label: "ICMP", value: "icmp" },
  { label: "Other", value: "other" },
];
const resourceMapping = [
  { label: "Virtual Machine", value: "vm" },
  { label: "Load Balancer", value: "lb" },
  { label: "Scaling Group LB", value: "sglb" },
  { label: "Gateway", value: "gateway" },
  { label: "AV", value: "av" },
  { label: "Backup", value: "backup" },
  { label: "NKS Default", value: "nks_default" },
  { label: "NKS Controller/Worker", value: "nks_cw" },
];

interface CreateDefaultRuleProps {
  handleCreate: (payload: any) => void;
  providers: any[];
}

const CreateDefaultRule: FC<CreateDefaultRuleProps> = ({ handleCreate, providers }) => {
  const navigate = useNavigate();

  const schema: FormSchema = useMemo(
    () => ({
      provider_id: {
        label: "Provider",
        initialValue: "",
        type: "select",
        validation: yup.string().required("Provider is required"),
        required: true,
      },
      direction: {
        label: "Direction",
        initialValue: ["egress"],
        validation: yup.array().min(1, "At least one direction must be selected").required("Direction is required"),
        type: "checkbox",
        options: directionMapping,
        autoFocus: true,
        required: true,
      },
      remote_ip_prefix: {
        label: "Remote IP Prefix",
        initialValue: "",
        validation: yup.string().required("Remote IP Prefix is required"),
        type: "text",
        required: true,
      },
      protocol: {
        label: "Protocol",
        initialValue: "tcp",
        validation: yup.string().required("Protocol is required"),
        type: "select",
        options: protocolMapping,
        required: true,
      },
      ethertype: {
        label: "Ethertype",
        initialValue: "IPv4",
        validation: yup.string().required("Ethertype is required"),
        type: "text",
        required: true,
      },
      resource_type: {
        label: "Resource Type",
        initialValue: [],
        validation: yup.array().min(1, "At least one resource type must be selected"),
        type: "checkbox",
        options: resourceMapping,
        required: true,
      },
      port_range_min: {
        label: "Port Range Min",
        initialValue: "",
        validation: yup.number().min(0, "Port Range Min must be a positive number").required("Port Range Min is required"),
        type: "number",
        required: true,
      },
      port_range_max: {
        label: "Port Range Max",
        initialValue: "",
        validation: yup.number().min(0, "Port Range Max must be a positive number").required("Port Range Max is required"),
        type: "number",
        required: true,
      },
      description: {
        label: "Description",
        initialValue: "",
        validation: yup.string().required("Description is required"),
        type: "textarea",
        minRows: 3,
        maxRows: 3,
        required: true,
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
          <Grid item xs={12}>
            <DataField name="direction" formConfig={formConfig} />
          </Grid>
          <Grid item xs={3}>
            <DataField name="provider_id" formConfig={formConfig} />
          </Grid>
          <Grid item xs={3}>
            <DataField name="remote_ip_prefix" formConfig={formConfig} />
          </Grid>
          <Grid item xs={3}>
            <DataField name="protocol" formConfig={formConfig} />
          </Grid>
          <Grid item xs={3}>
            <DataField name="ethertype" formConfig={formConfig} />
          </Grid>
          <Grid item xs={12}>
            <DataField name="resource_type" formConfig={formConfig} />
          </Grid>
          <Grid item xs={6}>
            <DataField name="port_range_min" formConfig={formConfig} />
          </Grid>
          <Grid item xs={6}>
            <DataField name="port_range_max" formConfig={formConfig} />
          </Grid>
          <Grid item xs={12}>
            <DataField name="description" formConfig={formConfig} />
          </Grid>
        </Grid>
      </Box>

      <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} p={1}>
        <Button variant="outlined" fullWidth onClick={() => navigate("/providers/default-rules")}>
          Cancel
        </Button>

        <Button color="primary" variant="contained" fullWidth type="submit">
          Submit
        </Button>
      </Stack>
    </Stack>
  );
};

export default CreateDefaultRule;
