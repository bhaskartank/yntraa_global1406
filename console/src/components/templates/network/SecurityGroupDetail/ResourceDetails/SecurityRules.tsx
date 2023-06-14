import { FC, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DateDisplay from "components/atoms/DateDisplay";
import { GridViewSection, GridViewWrapper } from "components/atoms/GridViewWrapper";
import KeyValuePair from "components/atoms/KeyValuePair";
import ResourceName from "components/atoms/ResourceName";
import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { GridCreatorProps } from "components/organisms/DataList/types";
import useDataList from "components/organisms/DataList/useDataList";

import { cidrToRange } from "utils";

interface SecurityRulesProps {
  fetchSecurityGroupRules: (payload: any) => void;
  securityGroupRules: any;
}

const SecurityRules: FC<SecurityRulesProps> = ({ fetchSecurityGroupRules, securityGroupRules }) => {
  const { securityGroupId } = useParams();

  const navigate = useNavigate();

  const remoteIpRange = (remoteIp) => {
    if (remoteIp) return cidrToRange(remoteIp);
    return "Any";
  };

  const gridCreator: GridCreatorProps = useCallback(
    (item: any) => ({
      header: <ResourceName label={item?.direction} />,
      content: (
        <GridViewWrapper>
          <GridViewSection>
            <KeyValuePair
              label="Port"
              value={
                item?.protocol === "icmp"
                  ? "-"
                  : item?.port_range_min
                  ? item?.port_range_min === item?.port_range_max
                    ? item?.port_range_min
                    : `${item?.port_range_min} - ${item?.port_range_max}`
                  : "Any"
              }
            />
            <KeyValuePair label="Managed By" value={<StatusChip label={item?.managed_by} />} />
            <KeyValuePair
              label="IP Range"
              value={remoteIpRange(item?.remote_ip_prefix) === "Any" ? "Any" : `${remoteIpRange(item?.remote_ip_prefix)[0]} - ${remoteIpRange(item?.remote_ip_prefix)[1]}`}
            />
            <KeyValuePair label="Protocol" value={item?.protocol} />
          </GridViewSection>
          <GridViewSection>
            <KeyValuePair label="Ether Type" value={item?.ethertype} />
            <KeyValuePair label="Description" value={item?.description} />
          </GridViewSection>
          <GridViewSection>
            <KeyValuePair label="Created At" value={<DateDisplay datetime={item?.created} />} />
            <KeyValuePair label="Last Update" value={<DateDisplay datetime={item?.updated} />} />
          </GridViewSection>
        </GridViewWrapper>
      ),
    }),
    [],
  );

  const dataList = useDataList({
    data: securityGroupRules?.list,
    totalRecords: securityGroupRules?.totalRecords,
    gridCreator,
    gridViewBreakpoints: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 },
    // createResourceButton: { text: "Create Security Rule", onClick: () => navigate(appRoutes.CREATE_SECURITY_RULE(securityGroupId)) },
    reload: fetchSecurityGroupRules,
  });

  return <DataList dataList={dataList} />;
};

export default SecurityRules;
