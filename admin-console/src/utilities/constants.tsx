import { validateEnv } from "utilities";

import LogoCoredgeMainDark from "assets/logo/coredge/main-dark.svg";
import LogoCoredgeMainLight from "assets/logo/coredge/main-light.svg";
import LogoYntraaMainDark from "assets/logo/yntraa/main-dark.svg";
import LogoYntraaMainLight from "assets/logo/yntraa/main-light.svg";

const constants = {
  coredge: {
    APP_TITLE: "Cloud Admin",
    APP_DESCRIPTION: "Cloud Admin Dashboard",
    FOOTER_TEXT: `© ${new Date().getFullYear()} Coredge. All rights reserved.`,
    APP_LOGO: {
      DARK: LogoCoredgeMainDark,
      LIGHT: LogoCoredgeMainLight,
    },
    FAVICON_PATH: "/coredge-favicon.ico",
  },
  yotta: {
    APP_TITLE: "Yntraa Admin",
    APP_DESCRIPTION: "Yntraa Admin Dashboard",
    FOOTER_TEXT: `© ${new Date().getFullYear()} Yntraa. All rights reserved.`,
    APP_LOGO: {
      DARK: LogoYntraaMainDark,
      LIGHT: LogoYntraaMainLight,
    },
    FAVICON_PATH: "/yotta-favicon.ico",
  },
};

const commonConstants = {
  pageTitles: {},
  ui: {
    FOOTER_HEIGHT: 32,
    HEADER_HEIGHT: 40,
    LOGO_CONTAINER_HEIGHT: 80,
    DRAWER_WIDTH: 290,
    DRAWER_WIDTH_COLLAPSED: 78,
    SIDE_MENU_ITEM_HEIGHT: 40,
  },
  messages: {
    success: {},
    error: {},
  },
};

export const appRoutes = {};

export const sidebarMenus = {};

let themeName;

if (validateEnv(process.env.REACT_APP_THEME_NAME, "yotta")) {
  themeName = "yotta";
} else {
  themeName = "coredge";
}

const themeConstants = constants[themeName];

export const { APP_TITLE, APP_DESCRIPTION, FOOTER_TEXT, APP_LOGO, FAVICON_PATH } = themeConstants;
export const { pageTitles, ui, messages } = commonConstants;
export const { FOOTER_HEIGHT, HEADER_HEIGHT, LOGO_CONTAINER_HEIGHT, DRAWER_WIDTH, DRAWER_WIDTH_COLLAPSED, SIDE_MENU_ITEM_HEIGHT } = ui;
