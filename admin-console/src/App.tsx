import { CssBaseline, ThemeProvider } from "@mui/material";
import { useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import routes from "routes";
import { loadTheme } from "theme";

import Loader from "components/atoms/loaders/PageLoader";
import GlobalConfirmModal from "components/molecules/GlobalConfirmModal";

const App = () => {
  const content = useRoutes(routes);
  const theme = loadTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Loader />
      <GlobalConfirmModal />
      <ToastContainer />
      {content}
    </ThemeProvider>
  );
};

export default App;
