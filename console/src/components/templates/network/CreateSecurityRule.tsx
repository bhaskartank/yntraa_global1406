import { Grid, Stack, Typography } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import * as yup from "yup";

import { FormContainer } from "components/atoms/FormWrapper";
import DataField from "components/organisms/Form/DataField";
import { FormSchema } from "components/organisms/Form/model";
import useForm from "components/organisms/Form/useForm";

interface CreateSecurityGroupProps {
  onSubmit: (payload: any) => void;
  onCancel: () => void;
}

const CreateSecurityGroup: FC<CreateSecurityGroupProps> = ({ onSubmit, onCancel }) => {
  const schema: FormSchema = useMemo(
    () => ({
      protocol: {
        label: "Protocol",
        placeholder: "Please select protocol",
        initialValue: "",
        validation: yup.string().required("Protocol is required"),
        type: "select",
        options: [
          { label: "TCP", value: "tcp" },
          { label: "UDP", value: "udp" },
          { label: "ICMP", value: "icmp" },
        ],
        autoFocus: true,
        required: true,
      },
      ethertype: {
        label: "IP Version",
        placeholder: "Please select IP version",
        initialValue: "",
        validation: yup.string().required("IP version is required"),
        type: "select",
        options: [{ label: "IPv4", value: "IPv4" }],
        required: true,
      },
      direction: {
        label: "Direction",
        placeholder: "Please select direction",
        initialValue: "",
        validation: yup.string().required("Direction is required"),
        type: "select",
        options: [
          { label: "Inbound", value: "ingress" },
          { label: "Outbound", value: "egress" },
        ],
        required: true,
      },
      description: {
        label: "Description",
        placeholder: "Please enter description",
        initialValue: "",
        validation: yup.string().required("Description is required"),
        type: "textarea",
        minRows: 3,
        required: true,
      },
      predefinedPorts: {
        label: "Predefined Ports",
        placeholder: "Please select predefined ports",
        initialValue: "",
        validation: yup.string().when("protocol", (protocol, field) => {
          return protocol[0] === "icmp" ? field : field.required("Predefined ports are required");
        }),
        type: "select",
        options: [
          { label: "HTTP (port 80)", value: "80" },
          { label: "HTTPS (port 443)", value: "443" },
          { label: "SSH (port 22)", value: "22" },
          { label: "Custom", value: "custom" },
        ],
        required: true,
      },
      checkRange: {
        label: "",
        initialValue: [],
        validation: yup.array(),
        type: "checkbox",
        options: [{ label: "Click here if port range is to be entered", value: "true" }],
      },
      // TODO: Add Validation
      port: {
        label: "Port Number",
        placeholder: "Please enter port number",
        initialValue: "",
        validation: yup.number().when("predefinedPorts", (predefinedPorts, field) => {
          return predefinedPorts[0] === "custom" || predefinedPorts[0] === "undefined" ? field : field.required("Port number is required");
        }),
        type: "number",
        required: true,
      },
      port_range_min: {
        label: "Port Number Start",
        placeholder: "Please enter port number start",
        initialValue: "",
        validation: yup.number(),
        // .required("Port number start is required"),
        type: "number",
        required: true,
      },
      port_range_max: {
        label: "Port Number End",
        placeholder: "Please enter port number end",
        initialValue: "",
        validation: yup.number(),
        // .required("Port number end is required"),
        type: "number",
        required: true,
      },
      remote_ip_prefix: {
        label: "Network Address",
        placeholder: "Please enter network address in CIDR format (192.168.0.0/24)",
        initialValue: "",
        validation: yup
          .string()
          .matches(/^(?:\d{1,3}\.){3}\d{1,3}\/(?:[12]\d|3[0-2]|[0-9])$/, "Network Address should be in CIDR format (192.168.0.0/24)")
          .required("Network Address is required"),
        type: "text",
        required: true,
      },
    }),
    [],
  );

  const handleFormSubmit = useCallback(
    (payload) => {
      const temp = {
        protocol: payload?.protocol,
        ethertype: payload?.ethertype,
        direction: payload?.direction,
        description: payload?.description,
        ...(payload?.protocol === "icmp"
          ? { port_range_min: 0, port_range_max: 0 }
          : {
              ...(payload?.predefinedPorts === "custom"
                ? {
                    port_range_min: payload?.checkRange[0] === "true" ? payload?.port_range_min : payload?.port,
                    port_range_max: payload?.checkRange[0] === "true" ? payload?.port_range_max : payload?.port,
                  }
                : { port_range_min: payload?.predefinedPorts, port_range_max: payload?.predefinedPorts }),
            }),
        remote_ip_prefix: payload?.remote_ip_prefix,
      };

      // onSubmit(temp);
    },
    [onSubmit],
  );

  const { formConfig, submitForm, formErrors, watchValue } = useForm({ schema, onSubmit: handleFormSubmit });

  const watchProtocol = watchValue("protocol");
  const watchPredefinedPorts = watchValue("predefinedPorts");
  const watchCheckRange = watchValue("checkRange");

  const creationDisabled = useMemo(() => {
    return Boolean(formErrors?.security_group_name);
  }, [formErrors]);

  return (
    <FormContainer onCancel={onCancel} onSubmit={submitForm} submitDisabled={creationDisabled}>
      <Stack gap={4}>
        <Typography>
          Security rules define the specific network traffic permissions, such as allowing or blocking specific protocols, ports, and IP addresses for inbound and outbound
          communication within the security group.
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <DataField name="protocol" formConfig={formConfig} />
          </Grid>
          <Grid item xs={12} md={4}>
            <DataField name="ethertype" formConfig={formConfig} />
          </Grid>
          <Grid item xs={12} md={4}>
            <DataField name="direction" formConfig={formConfig} />
          </Grid>
        </Grid>

        <DataField name="description" formConfig={formConfig} />

        {watchProtocol === "tcp" || watchProtocol === "udp" ? (
          <>
            <DataField name="predefinedPorts" formConfig={formConfig} />

            {watchPredefinedPorts === "custom" ? (
              <>
                <DataField name="checkRange" formConfig={formConfig} />

                {watchCheckRange[0] === "true" ? (
                  <>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <DataField name="port_range_min" formConfig={formConfig} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <DataField name="port_range_max" formConfig={formConfig} />
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  <DataField name="port" formConfig={formConfig} />
                )}
              </>
            ) : null}
          </>
        ) : null}

        <DataField name="remote_ip_prefix" formConfig={formConfig} />
      </Stack>
    </FormContainer>
  );
};

export default CreateSecurityGroup;
