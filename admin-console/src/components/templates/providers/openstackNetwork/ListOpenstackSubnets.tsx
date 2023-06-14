import { FC, useCallback, useMemo } from "react";

import { useSelector } from "store";
import providersRedux from "store/modules/providers";

import StatusChip from "components/atoms/StatusChip";
import DataList from "components/organisms/DataList";
import { ColumnProps, RowCreatorProps } from "components/organisms/DataList/model";
import useDataList from "components/organisms/DataList/useDataList";

import { formatDate } from "utilities/comp";

interface OpenstackSubnetProps {
  fetchOpenstackSubnets: any;
  exportOpenstackSubnets: any;
}

const OpenstackSubnets: FC<OpenstackSubnetProps> = ({ fetchOpenstackSubnets, exportOpenstackSubnets }) => {
  const rootState = useSelector((state: any) => state);
  const openstackSubnets = providersRedux.getters.openstackSubnets(rootState);

  const columns: ColumnProps[] = useMemo(
    () => [
      { label: "Subnet Name" },
      { label: "Gateway IP", align: "center" },
      { label: "CIDR", align: "center" },
      { label: "DHCP Enabled", align: "center" },
      { label: "Allocation Pool Start", align: "center" },
      { label: "Allocation Pool End", align: "center" },
      { label: "Created", align: "center" },
    ],
    [],
  );

  const exportColumns: string[] = useMemo(() => ["Subnet Name", "Gateway IP", "CIDR", "DHCP Enabled", "Allocation Pool Start", "Allocation Pool End", "Created"], []);

  const rowCreator: RowCreatorProps = useCallback(
    (item: any) => [
      { content: item?.name },
      { content: item?.gateway_ip, align: "center" },
      { content: item?.cidr, align: "center" },
      { content: item?.enable_dhcp !== null ? <StatusChip label={item?.enable_dhcp} /> : null, align: "center" },
      { content: item?.allocation_pools?.length ? item?.allocation_pools[0]?.start : null, align: "center" },
      { content: item?.allocation_pools?.length ? item?.allocation_pools[0]?.end : null, align: "center" },
      { content: formatDate(item?.created_at, true, false, true), align: "center" },
    ],
    [],
  );

  const exportCreator = useCallback((item: any) => {
    return [
      item?.name,
      item?.gateway_ip,
      item?.cidr,
      item?.enable_dhcp,
      item?.allocation_pools[0]?.start,
      item?.allocation_pools[0]?.end,
      formatDate(item?.created, false, true, true),
    ];
  }, []);

  const reload = useCallback(fetchOpenstackSubnets, [fetchOpenstackSubnets]);

  const dataList = useDataList({
    data: openstackSubnets?.list || [],
    columns,
    exportFilename: "Openstack Subnets List",
    exportColumns,
    rowCreator,
    exportCreator,
    listExporter: exportOpenstackSubnets,
    reload,
  });

  return <DataList dataList={dataList} />;
};

export default OpenstackSubnets;
