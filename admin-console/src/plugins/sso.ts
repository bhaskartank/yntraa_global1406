import Keycloak from "keycloak-js";

const initOptions = {
  url: process.env.REACT_APP_OIDC_AUTH_URL,
  realm: process.env.REACT_APP_OIDC_REALM,
  clientId: process.env.REACT_APP_OIDC_CLIENT_ID,
  onLoad: "login-required",
};

const keycloak = new Keycloak(initOptions);

export default keycloak;
