import { Stack } from "@mui/material";
import { KeyIcon } from "icons";
import { useMemo } from "react";
import * as yup from "yup";

import { useDispatch, useSelector } from "store";
import authRedux from "store/modules/auth";

import ModalBox from "components/molecules/ModalBox";
import DataField from "components/organisms/Form/DataField";
import { FormSchema } from "components/organisms/Form/model";
import useForm from "components/organisms/Form/useForm";

export default function ChangePassword() {
  const dispatch = useDispatch();
  const rootState = useSelector((state: any) => state);
  const isUpdatePasswordActive = authRedux.getters.isUpdatePasswordActive(rootState);

  const onClose = async () => {
    await dispatch(authRedux.actions.updatePasswordModalActive(false));
  };

  const onSubmit = async (values) => {
    await dispatch(authRedux.actions.changePassword(values));
    dispatch(authRedux.actions.logout({ keepSession: false, triggerLogoutEndPoint: true }));
  };

  const schema: FormSchema = useMemo(
    () => ({
      current_password: {
        label: "Current Password",
        initialValue: "",
        validation: yup.string().required("Current Password is required"),
        type: "password",
        startAdornment: <KeyIcon />,
        displayAdornmentTooltip: true,
        iconColor: "#5486BF",
        noCopyPaste: true,
        required: true,
        autoFocus: true,
      },
      new_password: {
        label: "New Password",
        initialValue: "",
        validation: yup
          .string()
          .required("New Password is required")
          .test("no-password-match", "New password must not match current password", function (value) {
            const { current_password: currentPassword } = this.parent;
            return value !== currentPassword;
          }),
        type: "password",
        startAdornment: <KeyIcon />,
        displayAdornmentTooltip: true,
        iconColor: "#5486BF",
        noCopyPaste: true,
        required: true,
      },
      confirm_password: {
        label: "Confirm Password",
        initialValue: "",
        validation: yup
          .string()
          .oneOf([yup.ref("new_password"), ""], "New and Confirm Password must match")
          .required("Confirm Password is required"),
        type: "password",
        startAdornment: <KeyIcon />,
        displayAdornmentTooltip: true,
        iconColor: "#5486BF",
        noCopyPaste: true,
        required: true,
      },
    }),
    [],
  );

  const { submitForm, handleSubmit, formConfig } = useForm({ schema, onSubmit });

  return (
    <ModalBox
      title={`Change Password`}
      isOpen={isUpdatePasswordActive}
      onCancel={onClose}
      onConfirm={submitForm}
      confirmBtnText="Change"
      customStyle={{ width: { xs: "80%", md: "40%" } }}>
      <Stack component="form" onSubmit={handleSubmit} spacing={2} justifyContent="center">
        <DataField name="current_password" formConfig={formConfig} />
        <DataField name="new_password" formConfig={formConfig} />
        <DataField name="confirm_password" formConfig={formConfig} />
      </Stack>
    </ModalBox>
  );
}
