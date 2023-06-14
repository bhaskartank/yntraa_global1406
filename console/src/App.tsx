import { CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect } from "react";
import { useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import routes from "routes";
import { loadTheme } from "theme";

import { useDispatch } from "store";
import globalSearchRedux from "store/modules/global-search";

import Loader from "components/atoms/loaders/PageLoader";
import ConfirmModal from "components/molecules/ConfirmModal";
import GlobalSearch from "components/molecules/GlobalSearch";

const App = () => {
  const content = useRoutes(routes);
  const theme = loadTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "/") {
        event.preventDefault();
        dispatch(globalSearchRedux.actions.open());
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Loader />
      <ToastContainer />
      <GlobalSearch />
      <ConfirmModal />
      {content}
    </ThemeProvider>
  );
};

export default App;
