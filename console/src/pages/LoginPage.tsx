import { Alert, Box, Button, Link, Stack, Typography, styled } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HiChevronDoubleLeft } from "react-icons/hi";
import * as yup from "yup";

import { useDispatch, useSelector } from "store";
import authRedux from "store/modules/auth";

import DataField from "components/organisms/Form/DataField";
import { FormSchema } from "components/organisms/Form/model";
import useForm from "components/organisms/Form/useForm";

import { FilledUserIcon, KeyIcon } from "assets/icons";
import loginPageBackground from "assets/images/login-page/background.jpeg";
import loginPageLogo from "assets/images/login-page/logo.svg";

const PageWrapper = styled(Stack)(() => ({
  "&": {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100vh",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
}));

const FormWrapper = styled(Stack)(({ theme }) => ({
  "&": {
    justifyContent: "center",
    alignItems: "center",
    background: theme.palette.background.paper,
    height: "100%",
    width: "100%",
    borderLeft: `1px solid ${theme.palette.info.main}`,
    boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.1)",
    padding: "45px 30px",
  },
}));

function UserLoginForm() {
  const dispatch = useDispatch();

  const schema: FormSchema = useMemo(
    () => ({
      username: {
        label: "Email Address",
        placeholder: "Please enter your email address",
        initialValue: "",
        validation: yup.string().required("Email is required"),
        type: "text",
        startAdornment: <FilledUserIcon height="24" width="24" />,
        autoFocus: true,
      },
      password: {
        label: "Password",
        placeholder: "Please enter your password",
        initialValue: "",
        validation: yup.string().required("Password is required"),
        type: "password",
        startAdornment: <KeyIcon />,
        displayAdornmentTooltip: true,
        noCopyPaste: true,
      },
    }),
    [],
  );

  const handleLogin = useCallback(
    async ({ username, password }) => {
      await dispatch(authRedux.actions.login({ username, password }));
    },
    [dispatch],
  );

  const { handleSubmit, formConfig } = useForm({ schema, onSubmit: handleLogin });

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Stack spacing={1}>
          <DataField name="username" formConfig={formConfig} />
          <DataField name="password" formConfig={formConfig} />
        </Stack>
        <Stack mt={2}>
          <Button type="submit" variant="contained" size="large" fullWidth>
            Login
          </Button>
        </Stack>
      </form>

      <Stack mt={2} gap="4px" color="primary.main" flexDirection="row" justifyContent="center">
        <span>{"Don't have an account? "}</span>
        <Link underline="always" sx={{ cursor: "pointer" }} fontWeight="bold" variant="subtitle2" href="https://uatmyaccountcloud.yotta.com/#/register">
          Sign Up
        </Link>
      </Stack>
    </>
  );
}

function OTPValidationForm() {
  const dispatch = useDispatch();
  const rootState = useSelector((state: any) => state);
  const otpExpiryTime = authRedux.getters.otpExpiryTime(rootState);

  const [otpTimer, setOtpTimer] = useState<number>(otpExpiryTime);

  const formatTimer = useCallback((time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;

    const minutesString = minutes < 10 ? `0${minutes}` : minutes;
    const secondsString = seconds < 10 ? `0${seconds}` : seconds;

    return `${minutesString}:${secondsString}`;
  }, []);

  const handleResendOtp = useCallback(async () => {
    try {
      await dispatch(authRedux.actions.resendOtp());
      setOtpTimer(otpExpiryTime);
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, otpExpiryTime]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setOtpTimer((current) => current - 1);
    }, 1000);

    if (otpTimer <= 0) {
      clearInterval(timerId);
    }

    return () => clearInterval(timerId);
  }, [otpTimer]);

  useEffect(() => {
    setOtpTimer(otpExpiryTime);
  }, [otpExpiryTime]);

  const handleValidateOTP = useCallback(
    ({ otp }) => {
      dispatch(authRedux.actions.validateOtp({ otp }));
    },
    [dispatch],
  );

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
        noCopyPaste: true,
        autoFocus: true,
        required: true,
      },
    }),
    [],
  );

  const { handleSubmit, formConfig } = useForm({ schema, onSubmit: handleValidateOTP });

  const handleBack = async () => {
    await dispatch(authRedux.actions.resetAuthentication());
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Alert severity="success">One-Time Password (OTP) has been sent to your registered mobile number. OTP is valid for {Math.floor(otpExpiryTime / 60)} minutes.</Alert>
          <DataField name="otp" formConfig={formConfig} />
          <Stack direction="row" mt={2} spacing={1} alignItems="center" justifyContent="space-between">
            <Button variant="contained" size="large" type="submit" fullWidth>
              Validate OTP
            </Button>
            <Button variant="outlined" size="large" onClick={handleResendOtp} fullWidth disabled={!!otpTimer}>
              Resend OTP {otpTimer ? `(${formatTimer(otpTimer)})` : null}
            </Button>
          </Stack>
        </Stack>

        <Stack color="primary.main" flexDirection="row" justifyContent="space-between" mt={1}>
          <Link variant="subtitle2" fontWeight="bold" sx={{ cursor: "pointer" }} onClick={handleBack}>
            <Stack flexDirection="row" justifyContent="center" alignItems="center">
              <HiChevronDoubleLeft /> Back to login
            </Stack>
          </Link>
        </Stack>
      </form>
    </>
  );
}

function LoginPage() {
  const rootState = useSelector((state: any) => state);
  const isPasswordAuthenticated = authRedux.getters.isPasswordAuthenticated(rootState);

  return (
    <PageWrapper>
      <Box
        sx={{
          flex: 1,
          height: "100%",
          display: { xs: "none", md: "grid" },
          backgroundImage: `url(${loginPageBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}>
        <Stack width="100%" height="100%" justifyContent="center" alignItems="center">
          <img src={loginPageLogo} />
        </Stack>
      </Box>
      <Stack sx={{ alignItems: "center", height: "100%", width: { xs: "100%", md: "500px" } }} height="100%" width="500px" alignItems="center">
        <FormWrapper zIndex={2}>
          <Stack width="100%" justifyContent="center" alignItems="center" sx={{ display: { xs: "flex", md: "none" } }}>
            <img src={loginPageLogo} />
          </Stack>

          <Box width="100%">
            <Typography textAlign="center" sx={{ fontWeight: "500", fontSize: "24px" }}>
              Start your cloud journey
            </Typography>

            <Stack mt={4} sx={{ flex: 1, width: "100%" }}>
              {!isPasswordAuthenticated ? <UserLoginForm /> : <OTPValidationForm />}
            </Stack>
          </Box>
        </FormWrapper>
      </Stack>
    </PageWrapper>
  );
}

export default LoginPage;

// <PageWrapper>
// <LogoWrapper>
//   <LogoContainer />
// </LogoWrapper>
// <FormWrapper zIndex={2}>
//   <Typography textAlign="center" variant="h5">
//     Sign in to your cloud account
//   </Typography>
//   <Stack justifyContent="space-between" mt={2} sx={{ flex: 1, width: "min(90%, 480px)" }}>
//     {!isPasswordAuthenticated ? <UserLoginForm /> : <OTPValidationForm />}
//   </Stack>
// </FormWrapper>
// </PageWrapper>
