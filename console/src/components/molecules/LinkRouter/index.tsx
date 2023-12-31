import { Link, LinkProps } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

interface LinkRouterProps extends LinkProps {
  to: string;
  replace?: boolean;
  state?: any;
}

const LinkRouter = (props: LinkRouterProps) => <Link {...props} component={RouterLink as any} />;

export default LinkRouter;
