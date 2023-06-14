import { FC } from "react";

import TabBox from "components/molecules/TabBox";

import { appRoutes } from "utils/constants";

import Subnets from "./Subnets";

interface ResourceDetailsProps {
  network: any;
}

const ResourceDetails: FC<ResourceDetailsProps> = ({ network }) => {
  return (
    <TabBox
      indexBased={false}
      tabs={[
        {
          tabKey: appRoutes.NETWORK_DETAIL(network?.id, "subnets"),
          title: "Subnets",
          content: <Subnets network={network} />,
        },
      ]}
    />
  );
};

export default ResourceDetails;
