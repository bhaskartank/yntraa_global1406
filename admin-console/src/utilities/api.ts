import axios from "axios";
import keycloak from "plugins/sso";
import { toast } from "react-toastify";

import { validateEnv } from "utilities";

const apiInstance = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/adminapi/v1/`,
});

function interceptors(apiInstanceInstance) {
  apiInstanceInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const { status } = error.response;

      if (status === 401) {
        if (validateEnv(process.env.REACT_APP_OIDC_ENABLED, "true")) keycloak.logout();
        else if (!window.location.pathname?.includes("/login")) window.location.replace("/login");
      } else if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      } else if (error?.response?.status >= 400 && error?.response?.statusText) {
        toast.error(error?.response?.statusText);
      } else {
        toast.error("Something went wrong");
      }

      return Promise.reject(error);
    },
  );
}

interceptors(apiInstance);

export default apiInstance;
