import { FC } from "react";

import TabBox from "components/molecules/TabBox";

import { appRoutes } from "utils/constants";

import AttachedResources from "./AttachedResources";
import Overview from "./Overview";

interface ResourceDetailsProps {
  volume: any;
}

const ResourceDetails: FC<ResourceDetailsProps> = ({ volume }) => {
  return (
    <TabBox
      indexBased={false}
      tabs={[
        {
          tabKey: appRoutes.VOLUME_DETAIL(volume?.id, "overview"),
          title: "Overview",
          content: <Overview volume={volume} />,
        },
        {
          tabKey: appRoutes.VOLUME_DETAIL(volume?.id, "attached-resources"),
          title: "Attached Resources",
          content: <AttachedResources volume={volume} />,
        },
      ]}
    />
  );
};

export default ResourceDetails;
