import coredgeTheme from "theme/coredge-theme";
import yottaTheme from "theme/yotta-theme";

import { validateEnv } from "utils";

export const loadTheme = () => {
  if (validateEnv(process.env.REACT_APP_THEME_NAME, "yotta")) {
    return yottaTheme;
  } else {
    return coredgeTheme;
  }
};
