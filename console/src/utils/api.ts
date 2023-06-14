import axios from "axios";
import { toast } from "react-toastify";

import { store } from "store";

const apiInstance = axios.create({
  baseURL: `${process.env.NODE_ENV === "development" ? process.env.REACT_APP_API_URL : ""}`,
});

function interceptors(apiInstanceInstance) {
  apiInstanceInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error?.response?.status === 401) {
        store.dispatch({ type: "GLOBAL_RESET" });
        window.location.replace("/");
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
