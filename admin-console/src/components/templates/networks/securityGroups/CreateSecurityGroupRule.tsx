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
const manageByMapping = [
  { label: "System", value: "system" },
  { label: "User", value: "user" },
];

interface CreateSecurityGroupRuleProps {
  handleCreate: (payload: any) => void;
  providers: any[];
}

const CreateSecurityGroupRule: FC<CreateSecurityGroupRuleProps> = ({ handleCreate, providers }) => {
  const navigate = useNavigate();

  const schema: FormSchema = useMemo(
    () => ({
      //   provider_id: {
      //     label: "Provider",
      //     initialValue: "",
      //     type: "select",
      //     validation: yup.string().required("Provider is required"),
      //   },
      direction: {
        label: "Direction",
        initialValue: ["egress"],
        validation: yup.array().min(1, "At least one direction must be selected"),
        type: "checkbox",
        options: directionMapping,
        autoFocus: true,
      },
      remote_ip_prefix: {
        label: "Remote IP Prefix",
        initialValue: "",
        validation: yup.string().required("Remote IP Prefix is required"),
        type: "text",
      },
      protocol: {
        label: "Protocol",
        initialValue: "tcp",
        validation: yup.string().required("Protocol is required"),
        type: "select",
        options: protocolMapping,
      },
      ethertype: {
        label: "Ethertype",
        initialValue: "IPv4",
        validation: yup.string().required("Ethertype is required"),
        type: "text",
      },
      managed_by: {
        label: "Managed By",
        initialValue: "",
        validation: yup.string().required("Managed By is required"),
        type: "select",
        options: manageByMapping,
      },
      port_range_min: {
        label: "Port Range Min",
        initialValue: "",
        validation: yup.number().min(0, "Port Range Min must be a positive number").required("Port Range Min is required"),
        type: "number",
      },
      port_range_max: {
        label: "Port Range Max",
        initialValue: "",
        validation: yup.number().min(0, "Port Range Max must be a positive number").required("Port Range Max is required"),
        type: "number",
      },
      description: {
        label: "Description",
        initialValue: "",
        validation: yup.string().required("Description is required"),
        type: "textarea",
        minRows: 3,
        maxRows: 3,
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
          {/* <Grid item xs={3}>
            <DataField name="provider_id" formConfig={formConfig} />
          </Grid> */}
          <Grid item xs={4}>
            <DataField name="remote_ip_prefix" formConfig={formConfig} />
          </Grid>
          <Grid item xs={4}>
            <DataField name="protocol" formConfig={formConfig} />
          </Grid>
          <Grid item xs={4}>
            <DataField name="ethertype" formConfig={formConfig} />
          </Grid>
          <Grid item xs={4}>
            <DataField name="managed_by" formConfig={formConfig} />
          </Grid>
          <Grid item xs={4}>
            <DataField name="port_range_min" formConfig={formConfig} />
          </Grid>
          <Grid item xs={4}>
            <DataField name="port_range_max" formConfig={formConfig} />
          </Grid>
          <Grid item xs={12}>
            <DataField name="description" formConfig={formConfig} />
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

export default CreateSecurityGroupRule;
