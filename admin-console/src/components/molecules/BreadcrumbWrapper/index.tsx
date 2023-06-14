import { Breadcrumbs, Typography } from "@mui/material";
import { FC } from "react";
import { AiFillHome } from "react-icons/ai";

import LinkRouter from "components/molecules/LinkRouter";

interface BreadcrumbProps {
  label: string;
  to?: string;
  state?: any;
}

interface BreadcrumbWrapperProps {
  breadcrumbs?: BreadcrumbProps[];
}

export const BreadcrumbWrapper: FC<BreadcrumbWrapperProps> = ({ breadcrumbs }) => {
  return (
    <>
      <Breadcrumbs maxItems={4} aria-label="breadcrumb" sx={{ color: "common.white", ol: { flexWrap: "nowrap" } }}>
        <LinkRouter underline="hover" color="inherit" to={"/organisations"}>
          <AiFillHome size={16} />
        </LinkRouter>

        {breadcrumbs?.slice(0, breadcrumbs?.length - 1).map(({ label, to, state }) => (
          <LinkRouter key={label} underline="hover" color="inherit" to={to || "/organisations"} state={state}>
            <Typography noWrap>{label}</Typography>
          </LinkRouter>
        ))}
        {breadcrumbs?.length ? (
          <Typography color="common.white" noWrap>
            {breadcrumbs[breadcrumbs?.length - 1]?.label}
          </Typography>
        ) : null}
      </Breadcrumbs>
    </>
  );
};

export default BreadcrumbWrapper;
