import { Alert, Box, Button, Link, Stack, Typography, styled } from "@mui/material";
import { FilledUserIcon, KeyIcon } from "icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

import { useDispatch, useSelector } from "store";
import authRedux from "store/modules/auth";

import LogoContainer from "components/atoms/LogoContainer";
import DataField from "components/organisms/Form/DataField";
import { FormSchema } from "components/organisms/Form/model";
import useForm from "components/organisms/Form/useForm";

import loginPageBackground from "assets/images/login-page-background.png";

const PageWrapper = styled(Stack)(() => ({
  "&": {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100vh",
    backgroundImage: `url(${loginPageBackground})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
}));

const LogoWrapper = styled(Box)(() => ({
  "&": {
    transform: "scale(2.1)",
    marginBottom: "50px",
    marginTop: "10px",
  },
}));

const FormWrapper = styled(Stack)(({ theme }) => ({
  "&": {
    alignItems: "center",
    background: theme.palette.background.paper,
    width: "min(420px, 90vw)",
    borderRadius: "8px",
    border: `1px solid ${theme.palette.info.main}`,
    boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.1)",
    padding: "45px 30px",
  },
}));

function OTPValidationForm() {
  const rootState = useSelector((state: any) => state);
  const userDetails = authRedux.getters.userDetails(rootState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [otpTimer, setOtpTimer] = useState<number>(120);

  const formatTimer = useCallback((time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;

    const minutesString = minutes < 10 ? `0${minutes}` : minutes;
    const secondsString = seconds < 10 ? `0${seconds}` : seconds;

    return `${minutesString}:${secondsString}`;
  }, []);

  const handleResendOtp = useCallback(async () => {
    try {
      await dispatch(authRedux.actions.forgotPassword({ username: userDetails }));
      setOtpTimer(120);
    } catch (err) {
      return err;
    }
  }, [dispatch, userDetails, setOtpTimer]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setOtpTimer((current) => current - 1);
    }, 1000);

    if (otpTimer <= 0) {
      clearInterval(timerId);
    }

    return () => clearInterval(timerId);
  }, [otpTimer]);

  const onSubmit = async (values) => {
    try {
      await dispatch(authRedux.actions.validateForgotPasswordOtp({ otp: values?.otp, username: userDetails }));
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const schema: FormSchema = useMemo(
    () => ({
      otp: {
        label: "OTP",
        placeholder: "Please enter the OTP",
        initialValue: "",
        validation: yup.string().required("OTP is required"),
        type: "password",
        startAdornment: <KeyIcon />,
        displayAdornmentTooltip: true,
        iconColor: "#5486BF",
        noCopyPaste: true,
        autoFocus: true,
        required: true,
      },
    }),
    [],
  );

  const { handleSubmit, formConfig } = useForm({ schema, onSubmit });

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3} mt={2}>
        <Alert severity="success">One-Time Password (OTP) has been sent to your registered mobile number. OTP is valid for 2 minutes.</Alert>

        <Box>
          <DataField name="otp" formConfig={formConfig} />

          <Stack color="primary.main" direction="row" justifyContent="space-between">
            <Link underline="none" variant="subtitle2" sx={{ cursor: "pointer" }} onClick={() => navigate("/login")}>
              Back to login
            </Link>
            <Link underline="none" target="_blank" variant="subtitle2" href={process.env.REACT_APP_HELP_LINK}>
              Need Help?
            </Link>
          </Stack>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Button variant="contained" size="large" type="submit" fullWidth>
            Validate OTP
          </Button>
          <Button variant="outlined" size="large" onClick={handleResendOtp} fullWidth disabled={!!otpTimer}>
            Resend {otpTimer ? `(${formatTimer(otpTimer)})` : null}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}

function ForgotPasswordSendOTPForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (values) => {
    dispatch(authRedux.actions.forgotPassword(values));
  };

  const schema: FormSchema = useMemo(
    () => ({
      username: {
        label: "Username or Email",
        initialValue: "",
        validation: yup.string().required("Username or email is required"),
        type: "text",
        startAdornment: <FilledUserIcon color="#5486BF" height="24" width="24" />,
        autoFocus: true,
        required: true,
      },
    }),
    [],
  );

  const { handleSubmit, formConfig } = useForm({ schema, onSubmit });

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <Box>
          <DataField name="username" formConfig={formConfig} />

          <Stack color="primary.main" direction="row" justifyContent="space-between">
            <Link underline="none" variant="subtitle2" sx={{ cursor: "pointer" }} onClick={() => navigate("/login")}>
              Back to login
            </Link>
            <Link underline="none" target="_blank" variant="subtitle2" href={process.env.REACT_APP_HELP_LINK}>
              Need Help?
            </Link>
          </Stack>
        </Box>

        <Stack direction="row" justifyContent="center" alignItems="center" mt="28px">
          <Button type="submit" variant="contained" size="large">
            Send OTP
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}

function ForgotPasswordPage() {
  const rootState = useSelector((state: any) => state);
  const isSentForgotPasswordOTP = authRedux.getters.isSentForgotPasswordOTP(rootState);

  return (
    <PageWrapper>
      <FormWrapper zIndex={2}>
        <LogoWrapper>
          <LogoContainer variant="dark" />
        </LogoWrapper>
        <Typography textAlign="center" sx={{ fontWeight: "500", fontSize: "18px" }}>
          Reset your Password
        </Typography>

        <Stack justifyContent="space-between" mt={4} sx={{ flex: 1, width: "100%" }}>
          {!isSentForgotPasswordOTP ? <ForgotPasswordSendOTPForm /> : <OTPValidationForm />}
        </Stack>
      </FormWrapper>
    </PageWrapper>
  );
}

export default ForgotPasswordPage;
