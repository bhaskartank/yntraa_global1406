import keycloak from "plugins/sso";
import { FC, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "store";
import authRedux from "store/modules/auth";

import { validateEnv } from "utilities";

interface AuthGuardProps {
  children: any;
}

const AuthGuard: FC<AuthGuardProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rootState = useSelector((state: any) => state);
  const isLoggedIn = authRedux.getters.isLoggedIn(rootState);

  const basePath = window.location.origin.toString();

  const validateSession = useCallback(async () => {
    try {
      await dispatch(authRedux.actions.checkAuthToken());
      await dispatch(authRedux.actions.autoLogin());
    } catch (err) {
      dispatch(authRedux.actions.logout({ keepSession: false, triggerLogoutEndPoint: true }));
    }
  }, [dispatch]);

  const checkAuthentication = useCallback(async () => {
    try {
      if (validateEnv(process.env.REACT_APP_OIDC_ENABLED, "true")) {
        if (!isLoggedIn) {
          await dispatch(authRedux.actions.loginWithOidc());
        }

        if (!keycloak.authenticated) {
          keycloak.login({ redirectUri: basePath });
        } else {
          await keycloak.updateToken(70);
          await validateSession();
        }
      } else {
        if (location.pathname.includes("/login")) {
          if (isLoggedIn) navigate("/organisations");
        } else {
          if (!isLoggedIn) navigate("/login");
          else await validateSession();
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [validateSession, dispatch, navigate, isLoggedIn, basePath, location]);

  useEffect(() => {
    checkAuthentication();
  }, [location, checkAuthentication]);

  return isLoggedIn ? children : null;
};

export default AuthGuard;
