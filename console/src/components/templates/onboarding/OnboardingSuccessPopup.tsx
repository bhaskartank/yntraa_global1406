import { Backdrop, Button, Fade, Modal, Stack, Typography } from "@mui/material";
import { FC } from "react";

import { SubscriptionSuccessIcon } from "assets/icons";

interface OnboardingSuccessPopup {
  open: boolean;
  onConfirm: () => void;
}

const OnboardingSuccessPopup: FC<OnboardingSuccessPopup> = ({ open, onConfirm }) => {
  return (
    <Backdrop open={open} sx={{ zIndex: 5, backdropFilter: "blur(2px)" }}>
      <Modal open={open} closeAfterTransition disableAutoFocus>
        <Fade in={open}>
          <Stack
            gap={5}
            sx={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              mx: "auto",
              transform: "translateY(-50%)",
              width: { xs: "100%", md: "600px" },
              bgcolor: "background.paper",
              borderRadius: { xs: 0, md: "8px" },
              overflow: "hidden",
              alignItems: "center",
              justifyContent: "center",
              p: 4,
            }}>
            <SubscriptionSuccessIcon />

            <Stack gap={2}>
              <Typography variant="h5" textAlign="center" fontWeight="600" noWrap>
                Thank you for subscribing!
              </Typography>

              <Typography textAlign="center" variant="h6" fontWeight="normal">
                {"Project Initialization has been started. You'll receive an email once your account setup is completed."}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="center" alignItems="center">
              <Button variant="outlined" color="primary" onClick={onConfirm}>
                Back to Login
              </Button>
            </Stack>
          </Stack>
        </Fade>
      </Modal>
    </Backdrop>
  );
};

export default OnboardingSuccessPopup;
