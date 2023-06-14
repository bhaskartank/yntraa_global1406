import keycloak from "plugins/keycloak";
import { FC, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useSelector } from "store";
import authRedux from "store/modules/auth";

import { validateEnv } from "utils";
import { appRoutes } from "utils/constants";

interface AuthGuardProps {
  children: any;
}

const AuthGuard: FC<AuthGuardProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const rootState = useSelector((state: any) => state);
  const isPasswordAuthenticated = authRedux.getters.isPasswordAuthenticated(rootState);
  const isOtpValidated = authRedux.getters.isOtpValidated(rootState);

  const checkAuthentication = useCallback(async () => {
    try {
      if (validateEnv(process.env.REACT_APP_OIDC_ENABLED, "true")) {
        if (!keycloak.authenticated) keycloak.login();
        // else navigate(appRoutes.AUTHENTICATE);
        // else dispatch(authRedux.actions.checkAuthToken());

        // TODO: check if this is required
        // await keycloak.updateToken(70);
      } else {
        if (!location.pathname.includes(appRoutes.LOGIN) && (!isPasswordAuthenticated || !isOtpValidated)) {
          navigate(appRoutes.LOGIN);
        } else if (location.pathname.includes(appRoutes.LOGIN) && isPasswordAuthenticated && isOtpValidated) {
          navigate(appRoutes.AUTHENTICATE);
        }
        // else {
        //   dispatch(authRedux.actions.checkAuthToken());
        // }
      }
    } catch (err) {
      console.error(err);
    }
  }, [location.pathname, isPasswordAuthenticated, isOtpValidated, navigate]);

  useEffect(() => {
    checkAuthentication();
  }, [location, checkAuthentication]);

  return children;
};

export default AuthGuard;
