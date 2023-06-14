import { FC, useCallback } from "react";

import { GridViewSection, GridViewWrapper } from "components/atoms/GridViewWrapper";
import KeyValuePair from "components/atoms/KeyValuePair";
import ResourceName from "components/atoms/ResourceName";
import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { GridCreatorProps } from "components/organisms/DataList/types";
import useDataList from "components/organisms/DataList/useDataList";

interface SubnetsProps {
  network: any;
}

const Subnets: FC<SubnetsProps> = ({ network }) => {
  const gridCreator: GridCreatorProps = useCallback(
    (item: any) => ({
      header: <ResourceName label={item?.subnet_name} />,
      content: (
        <GridViewWrapper>
          <GridViewSection>
            <KeyValuePair label="Gateway IP" value={item?.gateway_ip} />
            <KeyValuePair label="IP Version" value={item?.ip_version} />
            <KeyValuePair label="Managed By" value={<StatusChip label={item?.managed_by} />} />
            <KeyValuePair label="Network Address" value={item?.network_address} />
          </GridViewSection>
        </GridViewWrapper>
      ),
    }),
    [],
  );

  const dataList = useDataList({
    data: network?.subnet_network,
    gridCreator,
    gridViewBreakpoints: { xs: 1, sm: 1, md: 2, lg: 3, xl: 4 },
  });

  return <DataList dataList={dataList} />;
};

export default Subnets;
