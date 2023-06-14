import { Container, Stack } from "@mui/material";
import React, { FC } from "react";

import CloudServices from "./CloudServices";
import CloudSubscription from "./CloudSubscription";
import EulaModal from "./EulaModal";
import Footer from "./Footer";
import Navbar from "./Navbar";

interface OnboardingProps {
  eula: any;
  handleSubscribe: () => void;
}

const Onboarding: FC<OnboardingProps> = ({ eula, handleSubscribe }) => {
  const [eulaModalActive, setEulaModalActive] = React.useState<boolean>(false);

  return (
    <>
      <Stack height="100%" sx={{ backgroundColor: "grey.100" }}>
        <Navbar />

        <Container maxWidth="xl" sx={{ py: 4, flex: 1, overflowY: "auto" }}>
          <Stack gap={4}>
            <CloudServices />

            <CloudSubscription handleOpenEulaModal={() => setEulaModalActive(true)} />
          </Stack>
        </Container>

        <Footer />
      </Stack>

      <EulaModal
        isOpen={eulaModalActive}
        eulaText={eula?.content}
        onClose={() => setEulaModalActive(false)}
        onConfirm={() => {
          handleSubscribe();
          setEulaModalActive(false);
        }}
      />
    </>
  );
};

export default Onboarding;
