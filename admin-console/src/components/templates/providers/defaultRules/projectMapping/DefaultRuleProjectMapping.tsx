import { Stack } from "@mui/material";
import { FC } from "react";

import ListAppliedProjects from "./ListAppliedProjects";
import ListUnappliedProjects from "./ListUnappliedProjects";

interface DefaultRuleProjectMappingProps {
  projects: any;
  applyRuleOnProjects: (payload: any) => void;
  removeRuleFromProjects: (payload: any) => void;
}

const DefaultRuleProjectMapping: FC<DefaultRuleProjectMappingProps> = ({ projects, applyRuleOnProjects, removeRuleFromProjects }) => {
  return (
    <Stack direction="row" gap={4} flexWrap="wrap" sx={{ p: 2, overflow: "auto" }}>
      <ListAppliedProjects projects={projects?.rule_applied_on || []} onSubmit={removeRuleFromProjects} />
      <ListUnappliedProjects projects={projects?.rule_not_applied_on || []} onSubmit={applyRuleOnProjects} />
    </Stack>
  );
};

export default DefaultRuleProjectMapping;
