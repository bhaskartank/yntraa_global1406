import { Stack, Typography } from "@mui/material";
import isEmpty from "lodash/isEmpty";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import * as yup from "yup";

import { useDispatch, useSelector } from "store";
import authRedux from "store/modules/auth";
import flavorsRedux from "store/modules/flavors";
import imagesRedux from "store/modules/images";
import networksRedux from "store/modules/networks";
import organisationsRedux from "store/modules/organisations";
import securityGroupsRedux from "store/modules/security-groups";
import snapshotsRedux from "store/modules/snapshots";

import { FormContainer } from "components/atoms/FormWrapper";
import { FormSchema } from "components/organisms/Form/model";
import useForm from "components/organisms/Form/useForm";

import AvailabilityZone from "./sections/AvailabilityZone";
import BasicDetail from "./sections/BasicDetail";
import Flavor from "./sections/Flavor";
import Image from "./sections/Image";
import Network from "./sections/Network";
import SecurityGroup from "./sections/SecurityGroup";

interface CreateVirtualMachineProps {
  onSubmit: (payload: any) => void;
  onCancel: () => void;
}

const CreateVirtualMachine: FC<CreateVirtualMachineProps> = ({ onSubmit, onCancel }) => {
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const images = imagesRedux.getters.images(rootState);
  const snapshots = snapshotsRedux.getters.snapshots(rootState);
  const flavors = flavorsRedux.getters.flavors(rootState);
  const availabilityZones = organisationsRedux.getters.availabilityZones(rootState);
  const networks = networksRedux.getters.networks(rootState);
  const securityGroups = securityGroupsRedux.getters.securityGroups(rootState);
  const userId = authRedux.getters.userId(rootState);

  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [selectedFlavor, setSelectedFlavor] = useState<any>(null);
  const [selectedAvailabilityZone, setSelectedAvailabilityZone] = useState<any>(null);

  const handleSelectImage = useCallback(
    (image: any) => {
      setSelectedImage((current) => (current?.id === image?.id ? null : image));
    },
    [setSelectedImage],
  );

  const handleSelectFlavor = useCallback(
    (flavor: any) => {
      setSelectedFlavor((current) => (current?.id === flavor?.id ? null : flavor));
    },
    [setSelectedFlavor],
  );

  const handleSelectAvailabilityZone = useCallback((zone: any) => {
    setSelectedAvailabilityZone((current) => (current?.id === zone?.id ? null : zone));
  }, []);

  useEffect(() => {
    // fetch images
    dispatch(imagesRedux.actions.images());
    dispatch(snapshotsRedux.actions.snapshots({ limit: 100, offset: 0 }));

    // fetch flavors
    dispatch(flavorsRedux.actions.flavors(null));

    // fetch availability zones
    dispatch(organisationsRedux.actions.availabilityZones());

    // fetch networks
    dispatch(networksRedux.actions.networks({ limit: 100, offset: 0, external: false }));

    // fetch security groups
    dispatch(securityGroupsRedux.actions.securityGroups({ limit: 100, offset: 0, is_lb_security_group: false, is_gw_security_group: false, storeResult: false }));
  }, [dispatch]);

  const schema: FormSchema = useMemo(
    () => ({
      instance_name: {
        label: "Machine Name",
        placeholder: "Please enter machine name",
        initialValue: "",
        validation: yup
          .string()
          .min(4, "Machine name must have minimum 4 characters")
          .max(16, "Machine name can have maximum 16 characters")
          .matches(/^[a-zA-Z][a-zA-Z0-9]*$/, "Machine name can have only alphabets and numbers and it must start with an alphabet only")
          .required("Machine name is required"),
        type: "text",
        autoFocus: true,
        required: true,
      },
      vm_username: {
        label: "Username",
        placeholder: "Please enter username",
        initialValue: "",
        validation: yup
          .string()
          .min(4, "Username must have minimum 4 characters")
          .max(7, "Username can have maximum 7 characters")
          .matches(/^[a-zA-Z]*$/, "Username can only have alphabets")
          .required("Username is required"),
        type: "text",
        required: true,
      },
      vm_password: {
        label: "Password",
        placeholder: "Please enter password",
        initialValue: "",
        validation: yup
          .string()
          .min(15, "Password must have minimum 15 characters")
          .max(32, "Password can have maximum 32 characters")
          .matches(/[A-Z]/, "Password must have at least one uppercase alphabet")
          .matches(/[a-z]/, "Password must have at least one lowercase alphabet")
          .matches(/[0-9]/, "Password must have at least one number")
          .matches(/.*[?=.*[~!@#$%^&\]).*].*/, "Password must have at least one special character")
          .required("Password is required"),
        type: "password",
        required: true,
      },
      network_id: {
        label: "Networks",
        placeholder: "Please select networks",
        initialValue: [],
        validation: yup.array().min(1, "Please select at least one network").required("Network is required"),
        type: "multiselect",
        options: [],
        required: true,
      },
      sec_group_id: {
        label: "Security Groups",
        placeholder: "Please select security groups",
        initialValue: [],
        validation: yup.array().min(1, "Please select at least one security group").required("Security Group is required"),
        type: "multiselect",
        options: [],
        required: true,
      },
    }),
    [],
  );

  const handleOnSubmit = useCallback(
    (values) => {
      const payload = {
        instance_name: values?.instance_name,
        image_id: selectedImage?.image_id || selectedImage?.id,
        flavor_id: selectedFlavor?.id,
        network_id: values?.network_id,
        availability_zone: selectedAvailabilityZone?.resource_availability_zones?.zone_name,
        vm_username: values?.vm_username,
        vm_password: values?.vm_password,
        vm_confirm_password: values?.vm_password,
        sec_group_id: values?.sec_group_id,
        user_id: userId,
        user_data: null,
        boot_from_volume: true,
      };

      onSubmit(payload);
    },
    [onSubmit, selectedAvailabilityZone, selectedFlavor, selectedImage, userId],
  );

  const { formConfig, submitForm, formErrors, handleUpdateOptions } = useForm({ schema, onSubmit: handleOnSubmit });

  const creationDisabled = useMemo(() => {
    return (
      Boolean(formErrors?.instance_name) ||
      Boolean(formErrors?.vm_username) ||
      Boolean(formErrors?.vm_password) ||
      Boolean(formErrors?.network_id) ||
      Boolean(formErrors?.sec_group_id) ||
      isEmpty(selectedImage) ||
      isEmpty(selectedFlavor) ||
      isEmpty(selectedAvailabilityZone)
    );
  }, [formErrors, selectedAvailabilityZone, selectedFlavor, selectedImage]);

  useEffect(() => {
    handleUpdateOptions(
      "network_id",
      networks?.list?.map((network) => ({ label: network?.network_name, value: network?.id })),
    );
  }, [handleUpdateOptions, networks]);

  useEffect(() => {
    handleUpdateOptions(
      "sec_group_id",
      securityGroups?.list?.map((securityGroup) => ({ label: securityGroup?.security_group_name, value: securityGroup?.id })),
    );
  }, [handleUpdateOptions, securityGroups]);

  return (
    <FormContainer onCancel={onCancel} onSubmit={submitForm} submitDisabled={creationDisabled}>
      <Stack gap={6}>
        <Typography>
          Virtual machines (VMs) are software-based emulations of physical computers. VMs allows to run multiple operating systems and applications on a single physical machine,
          providing isolation, flexibility, and efficient utilization of computing resources.
        </Typography>

        <BasicDetail formConfig={formConfig} />

        <Image images={images} snapshots={snapshots?.list} selectedImage={selectedImage} handleSelectImage={handleSelectImage} />

        <Flavor flavors={flavors?.list} selectedFlavor={selectedFlavor} handleSelectFlavor={handleSelectFlavor} />

        <AvailabilityZone availabilityZones={availabilityZones} selectedAvailabilityZone={selectedAvailabilityZone} handleSelectAvailabilityZone={handleSelectAvailabilityZone} />

        <Network formConfig={formConfig} />

        <SecurityGroup formConfig={formConfig} />
      </Stack>
    </FormContainer>
  );
};

export default CreateVirtualMachine;
