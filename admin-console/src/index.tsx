import keycloak from "plugins/sso";
import ReactDOM from "react-dom/client";
import { Helmet } from "react-helmet";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import { store } from "store";

import { validateEnv } from "utilities";
import { APP_DESCRIPTION, APP_TITLE, FAVICON_PATH } from "utilities/constants";

import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

if (validateEnv(process.env.REACT_APP_OIDC_ENABLED, "true")) {
  keycloak.init({ onLoad: "login-required", checkLoginIframe: false, redirectUri: window.location.origin }).then(() => {
    root.render(
      <BrowserRouter>
        <Helmet>
          <title>{APP_TITLE}</title>
          <meta name="description" content={APP_DESCRIPTION} />
          <link rel="icon" type="image/x-icon" href={FAVICON_PATH} />
        </Helmet>

        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>,
    );
  });
} else {
  root.render(
    <BrowserRouter>
      <Helmet>
        <title>{APP_TITLE}</title>
        <meta name="description" content={APP_DESCRIPTION} />
        <link rel="icon" type="image/x-icon" href={FAVICON_PATH} />
      </Helmet>

      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>,
  );
}
