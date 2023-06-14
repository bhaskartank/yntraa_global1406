import { matchRoutes, useLocation } from "react-router-dom";
import routes from "routes";

const useCurrentPath = () => {
  const location = useLocation();
  const matchedRoutes = matchRoutes(Object.values(routes), location.pathname);
  const matchingRoute = matchedRoutes[matchedRoutes?.length - 1]?.route;

  return matchingRoute?.path || location.pathname;
};

export default useCurrentPath;
