import { FC } from "react";

import TabBox from "components/molecules/TabBox";

import { appRoutes } from "utils/constants";

import Overview from "./Overview";
import SecurityRules from "./SecurityRules";

interface ResourceDetailsProps {
  securityGroup: any;
  fetchSecurityGroupRules: (payload: any) => void;
  securityGroupRules: any;
}

const ResourceDetails: FC<ResourceDetailsProps> = ({ securityGroup, fetchSecurityGroupRules, securityGroupRules }) => {
  return (
    <TabBox
      indexBased={false}
      tabs={[
        {
          tabKey: appRoutes.SECURITY_GROUP_DETAIL(securityGroup?.id, "overview"),
          title: "Overview",
          content: <Overview securityGroup={securityGroup} />,
        },
        {
          tabKey: appRoutes.SECURITY_GROUP_DETAIL(securityGroup?.id, "security-rules"),
          title: "Security Rules",
          content: <SecurityRules fetchSecurityGroupRules={fetchSecurityGroupRules} securityGroupRules={securityGroupRules} />,
        },
      ]}
    />
  );
};

export default ResourceDetails;
