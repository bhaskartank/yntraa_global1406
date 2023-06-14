import { FC, useCallback } from "react";

import DateDisplay from "components/atoms/DateDisplay";
import { GridViewSection, GridViewWrapper } from "components/atoms/GridViewWrapper";
import KeyValuePair from "components/atoms/KeyValuePair";
import ResourceName from "components/atoms/ResourceName";
import StatusChip from "components/atoms/StatusChip";
import TagList from "components/atoms/TagList";
import DataList from "components/organisms/DataList";
import { GridCreatorProps } from "components/organisms/DataList/types";
import useDataList from "components/organisms/DataList/useDataList";

interface ListLoadBalancerProps {
  list: any[];
  totalRecords: number;
  fetchList: (payload: any) => void;
}

const ListLoadBalancer: FC<ListLoadBalancerProps> = ({ list, totalRecords, fetchList }) => {
  const getSSlStatus = (loadBalancer) => {
    const permission = { canRequest: false, canCancel: false, canUpdate: false };

    if (!loadBalancer) return { status: null, permission };

    const sslRequest = loadBalancer["ssl_configure_request_load_balancer"][0];

    if (!loadBalancer.version_type) {
      permission.canRequest = false;
      permission.canCancel = false;
      permission.canUpdate = false;
    } else if (!sslRequest) {
      permission.canRequest = true;
      permission.canCancel = false;
      permission.canUpdate = false;
    } else {
      if (sslRequest.status === "configured") {
        permission.canRequest = false;
        permission.canCancel = false;
        permission.canUpdate = true;
      } else if (sslRequest.status === "rejected") {
        permission.canRequest = true;
        permission.canCancel = false;
        permission.canUpdate = false;
      } else if (sslRequest.status === "cancelled") {
        permission.canRequest = false;
        permission.canCancel = false;
        permission.canUpdate = true;
      } else if (sslRequest.status === "pending") {
        permission.canRequest = false;
        permission.canCancel = true;
        permission.canUpdate = false;
      }
    }

    const res = {
      permission,
      status: sslRequest ? sslRequest.status.charAt(0).toUpperCase() + sslRequest.status.slice(1) : "Not Requested",
    };

    return res;
  };

  const gridCreator: GridCreatorProps = useCallback(
    (item: any) => ({
      header: <ResourceName label={item?.name} />,
      content: (
        <GridViewWrapper>
          <GridViewSection>
            <KeyValuePair label="Status" value={<StatusChip label={item?.status} />} />
            <KeyValuePair label="Action" value={<StatusChip label={item?.action} />} />
            <KeyValuePair label="SSL Request Status" value={item?.version_type ? <StatusChip label={getSSlStatus(item)?.status} /> : null} />
            {getSSlStatus(item)?.status?.toLowerCase() === "configured" ? (
              <KeyValuePair label="SSL Configured At" value={<DateDisplay datetime={item?.ssl_configure_request_load_balancer[0]?.configure_date} />} />
            ) : null}
            {getSSlStatus(item)?.status?.toLowerCase() === "pending" ? (
              <KeyValuePair label="SSL Requested At" value={<DateDisplay datetime={item?.ssl_configure_request_load_balancer[0]?.created} />} />
            ) : null}
          </GridViewSection>

          <GridViewSection>
            <KeyValuePair
              label="Private IP"
              value={
                item?.task_id ? (
                  <StatusChip label={item?.action} loading />
                ) : item?.load_balancer_compute?.length ? (
                  <StatusChip label={item.load_balancer_compute[0]?.compute?.compute_network_mapping[0]?.private_ip} />
                ) : item?.status?.toLowerCase() === "error" ? (
                  <StatusChip label={item?.status} />
                ) : null
              }
            />
            <KeyValuePair label="Floating IP" value={item?.lb_device_ip ? <StatusChip label={item?.lb_device_ip} /> : null} />
            <KeyValuePair
              label="Attached Endpoints"
              value={
                item?.load_balancer_server_farm?.length && item?.load_balancer_server_farm[0]?.lb_server_farm_compute_mapping_lb_farm?.length ? (
                  <TagList tags={item?.load_balancer_server_farm[0]?.lb_server_farm_compute_mapping_lb_farm?.map((compute) => compute.compute_ip)} />
                ) : (
                  "No Endpoints"
                )
              }
            />
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

  const reload = useCallback(
    ({ page, size }) => {
      fetchList({ offset: page * size, limit: size });
    },
    [fetchList],
  );

  const dataList = useDataList({
    data: list,
    totalRecords,
    gridCreator,
    gridViewBreakpoints: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1 },
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default ListLoadBalancer;
