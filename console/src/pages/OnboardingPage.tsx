import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "store";
import authRedux from "store/modules/auth";
import projectRedux from "store/modules/projects";

import Onboarding from "components/templates/onboarding";
import OnboardingSuccessPopup from "components/templates/onboarding/OnboardingSuccessPopup";

const OnboardingPage = () => {
  const dispatch = useDispatch();
  const rootState = useSelector((state) => state);
  const eula = authRedux.getters.eula(rootState);

  const [successPopupActive, setSuccessPopupActive] = useState<boolean>(false);

  const handleSubscribeAndInit = async () => {
    try {
      await dispatch(projectRedux.actions.initializeProject({ eula_id: eula?.id }));

      setSuccessPopupActive(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await dispatch(authRedux.actions.logout());
  };

  useEffect(() => {
    dispatch(authRedux.actions.eula());
  }, [dispatch]);

  return (
    <>
      <Onboarding eula={eula} handleSubscribe={handleSubscribeAndInit} />
      <OnboardingSuccessPopup open={successPopupActive} onConfirm={handleLogout} />
    </>
  );
};

export default OnboardingPage;
