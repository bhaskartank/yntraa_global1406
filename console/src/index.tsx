import keycloak from "plugins/keycloak";
import ReactDOM from "react-dom/client";
import { Helmet } from "react-helmet";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import { store } from "store";

import { validateEnv } from "utils";
import { APP_DESCRIPTION, APP_TITLE, appRoutes } from "utils/constants";

import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

if (validateEnv(process.env.REACT_APP_OIDC_ENABLED, "true")) {
  keycloak
    .init({
      onLoad: "login-required",
      checkLoginIframe: false,
      redirectUri: window.location.origin?.toString() + appRoutes.AUTHENTICATE,
    })
    .then(() => {
      let faviconPath;

      if (validateEnv(process.env.REACT_APP_THEME_NAME, "yotta")) {
        faviconPath = "/yotta-favicon.ico";
      } else {
        faviconPath = "/ccp-favicon.ico";
      }

      root.render(
        <BrowserRouter>
          <Helmet>
            <title>{APP_TITLE}</title>
            <meta name="description" content={APP_DESCRIPTION} />
            <link rel="icon" type="image/x-icon" href={faviconPath} />
          </Helmet>
          <Provider store={store}>
            <App />
          </Provider>
        </BrowserRouter>,
      );
    });
} else {
  let faviconPath;

  if (validateEnv(process.env.REACT_APP_THEME_NAME, "yotta")) {
    faviconPath = "/yotta-favicon.ico";
  } else {
    faviconPath = "/ccp-favicon.ico";
  }

  root.render(
    <BrowserRouter>
      <Helmet>
        <title>{APP_TITLE}</title>
        <meta name="description" content={APP_DESCRIPTION} />
        <link rel="icon" type="image/x-icon" href={faviconPath} />
      </Helmet>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>,
  );
}
