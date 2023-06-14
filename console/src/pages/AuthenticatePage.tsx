import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import authRedux from "store/modules/auth";

import { validateEnv } from "utils";
import { appRoutes } from "utils/constants";

const AuthenticatePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rootState = useSelector((state: any) => state);
  const userSubscription = authRedux.getters.userSubscription(rootState);

  const [oidcTokenCaptured, setOIDCTokenCaptured] = useState<boolean>(false);

  const handleAuthentication = useCallback(async () => {
    if (validateEnv(process.env.REACT_APP_OIDC_ENABLED, "true") && !oidcTokenCaptured) {
      await dispatch(authRedux.actions.oidcLogin({}));
      setOIDCTokenCaptured(true);
    } else {
      if (userSubscription === null) {
        dispatch(authRedux.actions.userSubscription());
      } else if (typeof userSubscription === "object") {
        dispatch(authRedux.actions.userDetails());
        if (Object.keys(userSubscription)?.length) {
          dispatch(
            authRedux.actions.updateSessionContext({
              organisationId: userSubscription?.organisation_id,
              projectId: userSubscription?.project_id,
              providerId: userSubscription?.provider_id,
            }),
          );
          await dispatch(authRedux.actions.userRoleScope());
          navigate(appRoutes.DASHBOARD);
        } else {
          navigate(appRoutes.ONBOARDING);
        }
      }
    }
  }, [dispatch, navigate, oidcTokenCaptured, userSubscription]);

  useEffect(() => {
    handleAuthentication();
  }, [handleAuthentication]);

  return <></>;
};

export default AuthenticatePage;
