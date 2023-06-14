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

function UserLoginForm({ handleLogin }: any) {
  const navigate = useNavigate();

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const schema: FormSchema = useMemo(
    () => ({
      username: {
        label: "Username or Email",
        initialValue: "",
        validation: yup.string().required("Username or email is required"),
        type: "text",
        startAdornment: <FilledUserIcon height="24" width="24" />,
        autoFocus: true,
        required: true,
      },
      password: {
        label: "Password",
        initialValue: "",
        validation: yup.string().required("Password is required"),
        type: "password",
        startAdornment: <KeyIcon />,
        displayAdornmentTooltip: true,
        noCopyPaste: true,
        required: true,
      },
    }),
    [],
  );

  const { handleSubmit, formConfig } = useForm({ schema, onSubmit: handleLogin });

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Stack spacing={1}>
          <DataField name="username" formConfig={formConfig} />
          <DataField name="password" formConfig={formConfig} />
        </Stack>

        <Stack color="primary.main" flexDirection="row" justifyContent="space-between">
          <Link underline="none" variant="subtitle2" onClick={handleForgotPassword} sx={{ cursor: "pointer" }}>
            Forgot Password?
          </Link>
          <Link underline="none" target="_blank" variant="subtitle2" href={process.env.REACT_APP_HELP_LINK}>
            Need Help?
          </Link>
        </Stack>

        <Stack direction="row" justifyContent="center" alignItems="center" mt="28px">
          <Button type="submit" variant="contained" size="large" sx={{ margin: "0 auto", width: "220px" }}>
            Login
          </Button>
        </Stack>
      </form>
    </>
  );
}

function OTPValidationForm({ handleValidateOTP, handleBack }: any) {
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

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Alert severity="success">One-Time Password (OTP) has been sent to your registered mobile number. OTP is valid for {Math.floor(otpExpiryTime / 60)} minutes.</Alert>

          <Box>
            <DataField name="otp" formConfig={formConfig} />

            <Stack color="primary.main" flexDirection="row" justifyContent="space-between">
              <Link underline="none" variant="subtitle2" sx={{ cursor: "pointer" }} onClick={handleBack}>
                <Stack flexDirection="row" justifyContent="center" alignItems="center">
                  Back to login
                </Stack>
              </Link>
              <Link underline="none" target="_blank" variant="subtitle2" href={process.env.REACT_APP_HELP_LINK}>
                Need Help?
              </Link>
            </Stack>
          </Box>

          <Stack direction="row" mt={2} spacing={1} alignItems="center" justifyContent="space-between">
            <Button variant="contained" size="large" type="submit" fullWidth>
              Validate OTP
            </Button>
            <Button variant="outlined" size="large" onClick={handleResendOtp} fullWidth disabled={!!otpTimer}>
              Resend {otpTimer ? `(${formatTimer(otpTimer)})` : null}
            </Button>
          </Stack>
        </Stack>
      </form>
    </>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const isLoggedIn = authRedux.getters.isLoggedIn(rootState);

  const [isPasswordAuthenticated, setIsPasswordAuthenticated] = useState<boolean>(false);
  const [isOtpValidated, setIsOtpValidated] = useState<boolean>(false);

  const handleLogin = useCallback(
    async ({ username, password }) => {
      await dispatch(authRedux.actions.login({ username, password }));
      setIsPasswordAuthenticated(true);
    },
    [dispatch],
  );

  const handleValidateOTP = useCallback(
    async ({ otp }) => {
      await dispatch(authRedux.actions.validateOtp({ otp }));
      setIsOtpValidated(true);
    },
    [dispatch],
  );

  const handleBack = async () => {
    await dispatch(authRedux.actions.resetAuthentication());
    setIsPasswordAuthenticated(false);
  };

  useEffect(() => {
    if (isLoggedIn) navigate("/organisations");
  }, [navigate, isLoggedIn]);

  return !isPasswordAuthenticated || !isOtpValidated ? (
    <PageWrapper>
      <FormWrapper zIndex={2}>
        <LogoWrapper>
          <LogoContainer variant="dark" />
        </LogoWrapper>
        <Typography textAlign="center" sx={{ fontWeight: "500", fontSize: "18px" }}>
          Sign into your Service Admin Dashboard
        </Typography>

        <Stack justifyContent="space-between" mt={4} sx={{ flex: 1, width: "100%" }}>
          {!isPasswordAuthenticated ? <UserLoginForm handleLogin={handleLogin} /> : <OTPValidationForm handleValidateOTP={handleValidateOTP} handleBack={handleBack} />}
        </Stack>
      </FormWrapper>
    </PageWrapper>
  ) : null;
}

export default LoginPage;
