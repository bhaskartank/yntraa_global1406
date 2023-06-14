import { Box, Button, Divider, Grid, Stack } from "@mui/material";
import { FC, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";

import DataField from "components/organisms/Form/DataField";
import { FormSchema } from "components/organisms/Form/model";
import useForm from "components/organisms/Form/useForm";

interface CreateProviderResourceMappingProps {
  onSubmit: (payload: any) => void;
  resourceTypes: any[];
  images: any[];
  flavors: any[];
}

const CreateProviderResourceMapping: FC<CreateProviderResourceMappingProps> = ({ onSubmit, resourceTypes, images, flavors }) => {
  const { providerId } = useParams();
  const navigate = useNavigate();

  const schema: FormSchema = useMemo(
    () => ({
      resource_type: {
        label: "Resource Type",
        initialValue: "",
        type: "select",
        validation: yup.string().required("Resource Type is required"),
        options: [],
        required: true,
      },
      resource_type_version: {
        label: "Resource Type Version",
        initialValue: "",
        type: "select",
        validation: yup.string().required("Resource Type Version is required"),
        options: [],
        required: true,
      },
      image_id: {
        label: "Image",
        initialValue: "",
        type: "select",
        validation: yup.string().required("Image is required"),
        options: [],
        required: true,
      },
      flavor_id: {
        label: "Flavor",
        initialValue: "",
        type: "select",
        validation: yup.string().required("Flavor is required"),
        options: [],
        required: true,
      },
    }),
    [],
  );

  const { handleUpdateOptions, handleUpdateValue, handleSubmit, formConfig, watchValue } = useForm({ schema, onSubmit });

  const resourceTypeValue = watchValue("resource_type");

  useEffect(() => {
    if (resourceTypes) {
      const resourceTypeKeys = Object.keys(resourceTypes);
      const resourceTypesMapping = resourceTypeKeys?.map((type) => ({ label: type, value: type })) || [];
      handleUpdateOptions("resource_type", resourceTypesMapping);
    }
  }, [resourceTypes, handleUpdateOptions, handleUpdateValue]);

  useEffect(() => {
    if (images?.length) {
      const imagesMapping = images?.map((image) => ({ label: image?.name, value: image?.id })) || [];
      handleUpdateOptions("image_id", imagesMapping);
    }
  }, [images, handleUpdateOptions, handleUpdateValue]);

  useEffect(() => {
    if (flavors?.length) {
      const flavorsMapping = flavors?.map((flavor) => ({ label: flavor?.name, value: flavor?.id })) || [];
      handleUpdateOptions("flavor_id", flavorsMapping);
    }
  }, [flavors, handleUpdateOptions, handleUpdateValue]);

  useEffect(() => {
    handleUpdateValue("resource_type_version", "");

    if (resourceTypeValue && resourceTypes) {
      const options = resourceTypes[resourceTypeValue];

      if (options?.versions?.length) {
        const resourceTypeVersionMapping = options?.versions?.map((version) => ({ label: version, value: version })) || [];
        handleUpdateOptions("resource_type_version", resourceTypeVersionMapping);
      }
    }
  }, [resourceTypes, resourceTypeValue, handleUpdateOptions, handleUpdateValue]);

  return (
    <Stack justifyContent="space-between" component="form" onSubmit={handleSubmit} divider={<Divider flexItem />} sx={{ height: "100%" }}>
      <Box sx={{ overflowY: "auto", flex: 1, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <DataField name="resource_type" formConfig={formConfig} />
          </Grid>
          <Grid item xs={6}>
            <DataField name="resource_type_version" formConfig={formConfig} />
          </Grid>
          <Grid item xs={6}>
            <DataField name="image_id" formConfig={formConfig} />
          </Grid>
          <Grid item xs={6}>
            <DataField name="flavor_id" formConfig={formConfig} />
          </Grid>
        </Grid>
      </Box>

      <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} p={1}>
        <Button variant="outlined" fullWidth onClick={() => navigate(`/providers/${providerId}/resource-mapping`)}>
          Cancel
        </Button>

        <Button color="primary" variant="contained" fullWidth type="submit">
          Map Resource
        </Button>
      </Stack>
    </Stack>
  );
};

export default CreateProviderResourceMapping;
