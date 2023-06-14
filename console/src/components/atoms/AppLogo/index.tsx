import { FC } from "react";

import { validateEnv } from "utils";

import logoCCP from "assets/images/logo/ccp/main.svg";
import logoCCPMini from "assets/images/logo/ccp/mini.svg";
import logoYotta from "assets/images/logo/yotta/main.svg";
import logoYottaMini from "assets/images/logo/yotta/mini.svg";

const LogoCCP = () => <img src={logoCCP} />;
const LogoCCPMini = () => <img src={logoCCPMini} />;

const LogoYotta = () => <img src={logoYotta} width="120px" />;
const LogoYottaMini = () => <img src={logoYottaMini} />;

interface AppLogoProps {
  variant?: "full" | "short";
}

const AppLogo: FC<AppLogoProps> = ({ variant = "full" }) => {
  if (validateEnv(process.env.REACT_APP_THEME_NAME, "yotta")) {
    return variant === "short" ? <LogoYottaMini /> : <LogoYotta />;
  } else {
    return variant === "short" ? <LogoCCPMini /> : <LogoCCP />;
  }
};

export default AppLogo;
