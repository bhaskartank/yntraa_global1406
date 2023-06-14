import { Box, Button, Divider, Grid, Stack } from "@mui/material";
import { FC, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";

import DataField from "components/organisms/Form/DataField";
import { FormSchema } from "components/organisms/Form/model";
import useForm from "components/organisms/Form/useForm";

interface UpdateImageProps {
  onSubmit: (payload: any) => void;
  defaultValues: any;
}

const UpdateImage: FC<UpdateImageProps> = ({ onSubmit, defaultValues }) => {
  const { providerId } = useParams();
  const navigate = useNavigate();

  const schema: FormSchema = useMemo(
    () => ({
      cost: {
        label: "Cost",
        initialValue: defaultValues?.cost || 0,
        type: "number",
        validation: yup.number().min(0, "Cost must be greater than or equal zero"),
        autoFocus: true,
        required: true,
      },
      instruction_text: {
        label: "Instruction Text",
        initialValue: defaultValues?.instruction_text || "",
        type: "text",
        autoFocus: true,
      },
      description: {
        label: "Description",
        initialValue: defaultValues?.description || "",
        type: "textarea",
        minRows: 3,
      },
      is_public: {
        label: "Public",
        initialValue: defaultValues?.public?.toString(),
        type: "select",
        options: [
          { label: "True", value: "true" },
          { label: "False", value: "false" },
        ],
      },
      is_active: {
        label: "Active",
        initialValue: defaultValues?.is_active?.toString(),
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
            <DataField name="cost" formConfig={formConfig} />
          </Grid>
          <Grid item xs={6}>
            <DataField name="instruction_text" formConfig={formConfig} />
          </Grid>
          <Grid item xs={6}>
            <DataField name="is_public" formConfig={formConfig} />
          </Grid>
          <Grid item xs={6}>
            <DataField name="is_active" formConfig={formConfig} />
          </Grid>
          <Grid item xs={12}>
            <DataField name="description" formConfig={formConfig} />
          </Grid>
        </Grid>
      </Box>

      <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} p={1}>
        <Button variant="outlined" fullWidth onClick={() => navigate("/providers/images")}>
          Cancel
        </Button>

        <Button color="primary" variant="contained" fullWidth type="submit">
          Update
        </Button>
      </Stack>
    </Stack>
  );
};

export default UpdateImage;
