import { Stack } from "@mui/material";
import { FC } from "react";

import ResourceDetails from "./ResourceDetails";
import SummaryHeader from "./SummaryHeader";

interface SecurityGroupDetailProps {
  securityGroup: any;
  fetchSecurityGroupRules: (payload: any) => void;
  securityGroupRules: any;
}

const SecurityGroupDetail: FC<SecurityGroupDetailProps> = ({ securityGroup, fetchSecurityGroupRules, securityGroupRules }) => {
  return (
    <Stack gap={4}>
      <SummaryHeader securityGroup={securityGroup} />
      <ResourceDetails securityGroup={securityGroup} fetchSecurityGroupRules={fetchSecurityGroupRules} securityGroupRules={securityGroupRules} />
    </Stack>
  );
};

export default SecurityGroupDetail;
